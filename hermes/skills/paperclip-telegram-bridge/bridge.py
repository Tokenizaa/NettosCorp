#!/usr/bin/env python3
"""
paperclip-telegram-bridge — Hermes como intermediário entre Telegram e Paperclip.

Fluxo:
  Telegram (mensagem com @Agente)
    → Bridge detecta menção
    → POST /api/agents/{agent_id}/wakeup  (Paperclip)
    → heartbeat_run criado (run_id)
    → Bridge armazena run_id → (chat_id, agente)
    → Bridge polla GET /api/heartbeat-runs/{run_id}
    → Quando completa/falha, envia resultado ao Telegram assinado pelo agente

Usa apenas stdlib (urllib, json, re, time). Nenhuma dependência externa.
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional

# ---------------------------------------------------------------------------
# Configuração
# ---------------------------------------------------------------------------

PAPERCLIP_API_URL = os.getenv("PAPERCLIP_API_URL", "http://localhost:3100").rstrip("/")
PAPERCLIP_API_KEY = os.getenv("PAPERCLIP_API_KEY", "")
PAPERCLIP_COMPANY_ID = os.getenv("PAPERCLIP_COMPANY_ID", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}" if TELEGRAM_BOT_TOKEN else ""
ALLOWED_USERS_RAW = os.getenv("TELEGRAM_ALLOWED_USERS", "")
ALLOWED_USERS = set(int(u.strip()) for u in ALLOWED_USERS_RAW.split(",") if u.strip()) if ALLOWED_USERS_RAW else set()

AGENTS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "agents.yaml")
POLL_INTERVAL = 3  # segundos entre polls
TELEGRAM_TIMEOUT = 30  # segundos para getUpdates long polling

# ---------------------------------------------------------------------------
# Estado em memória
# ---------------------------------------------------------------------------

# run_id -> {chat_id, agent_name, agent_id, telegram_message_id, created_at}
RUN_STATE: Dict[str, Dict[str, Any]] = {}

# último update_id processado do Telegram
LAST_UPDATE_ID = 0

# ---------------------------------------------------------------------------
# Utilitários HTTP
# ---------------------------------------------------------------------------

def _headers(extra: Optional[Dict[str, str]] = None) -> Dict[str, str]:
    h = {"Content-Type": "application/json"}
    if PAPERCLIP_API_KEY:
        h["Authorization"] = f"Bearer {PAPERCLIP_API_KEY}"
    if extra:
        h.update(extra)
    return h


def http_get(url: str, headers: Optional[Dict[str, str]] = None, timeout: int = 15) -> Any:
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read()
        return json.loads(data) if data else {}


def http_post(url: str, payload: Dict[str, Any], headers: Optional[Dict[str, str]] = None, timeout: int = 15) -> Any:
    body = json.dumps(payload).encode("utf-8")
    h = {"Content-Type": "application/json"}
    if PAPERCLIP_API_KEY:
        h["Authorization"] = f"Bearer {PAPERCLIP_API_KEY}"
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=body, headers=h, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read()
        return json.loads(data) if data else {}


def telegram_api(method: str, payload: Optional[Dict[str, Any]] = None) -> Any:
    if not TELEGRAM_API_URL:
        raise RuntimeError("TELEGRAM_BOT_TOKEN não configurado")
    url = f"{TELEGRAM_API_URL}/{method}"
    if payload is None:
        return http_get(url, timeout=15)
    return http_post(url, payload, timeout=15)


# ---------------------------------------------------------------------------
# Agentes
# ---------------------------------------------------------------------------

def load_agents() -> List[Dict[str, Any]]:
    """Carrega agentes do arquivo agents.yaml (formato simples, sem dependência de PyYAML)."""
    agents: List[Dict[str, Any]] = []
    if not os.path.exists(AGENTS_FILE):
        return agents
    try:
        import yaml  # type: ignore
        with open(AGENTS_FILE, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
        for a in data.get("agents", []):
            agents.append({
                "name": a.get("name", ""),
                "agent_id": a.get("agent_id", ""),
                "aliases": [x.lower() for x in a.get("aliases", [])],
            })
    except ImportError:
        # Parse manual mínimo de YAML (suficiente para o formato agents.yaml)
        current: Optional[Dict[str, Any]] = None
        with open(AGENTS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                stripped = line.strip()
                if not stripped or stripped.startswith("#"):
                    continue
                if stripped == "agents:" or stripped == "- name:":
                    if stripped == "- name:":
                        current = {"name": "", "agent_id": "", "aliases": []}
                    continue
                if current is None:
                    continue
                if stripped.startswith("name:"):
                    current["name"] = stripped.split(":", 1)[1].strip().strip('"')
                elif stripped.startswith("agent_id:"):
                    current["agent_id"] = stripped.split(":", 1)[1].strip().strip('"')
                elif stripped.startswith("aliases:"):
                    current["aliases"] = []
                elif stripped.startswith("- "):
                    val = stripped[2:].strip().strip('"')
                    if "aliases" in current and current["aliases"] is not None:
                        current["aliases"].append(val.lower())
                    elif current.get("agent_id") == "":
                        current["agent_id"] = val
                if current and current.get("name") and current.get("agent_id"):
                    agents.append(current)
                    current = None
    except Exception as e:
        print(f"[bridge] erro ao carregar agents.yaml: {e}", file=sys.stderr)
    return agents


def build_lookup(agents: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """Constrói um índice nome/alias → agente."""
    lookup: Dict[str, Dict[str, Any]] = {}
    for a in agents:
        lookup[a["name"].lower()] = a
        for alias in a.get("aliases", []):
            lookup[alias.lower()] = a
    return lookup


def find_agent(text: str, lookup: Dict[str, Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Procura @Nome ou @Alias no texto. Retorna o agente ou None."""
    if not text:
        return None
    for m in re.finditer(r"@([A-Za-zÀ-ÿ0-9_\s][A-Za-zÀ-ÿ0-9_\s]*)", text, re.IGNORECASE):
        mention = m.group(1).strip().lower()
        if mention in lookup:
            return lookup[mention]
        # match parcial
        for key, agent in lookup.items():
            if mention in key or key in mention:
                return agent
    return None


def strip_mention(text: str) -> str:
    """Remove a primeira menção @Nome do texto."""
    return re.sub(r"@[A-Za-zÀ-ÿ0-9_\s]+", "", text, count=1).strip(" ,:;-\n\r\t")


# ---------------------------------------------------------------------------
# Paperclip
# ---------------------------------------------------------------------------

def paperclip_wakeup(agent_id: str, message_text: str, chat_id: int, user_id: int) -> Optional[Dict[str, Any]]:
    """Acorda um agente no Paperclip. Retorna o objeto run ou None."""
    url = f"{PAPERCLIP_API_URL}/api/agents/{agent_id}/wakeup"
    payload = {
        "source": "on_demand",
        "triggerDetail": "manual",
        "reason": "telegram_bridge",
        "requestedByActorType": "user",
        "contextSnapshot": {
            "triggeredBy": "user",
            "originIdentityContextId": None,
            "responsibleUserId": None,
            "actorId": None,
        },
        "payload": {
            "text": message_text,
            "source_platform": "telegram",
            "source_chat_id": str(chat_id),
            "source_user_id": str(user_id),
        },
    }
    try:
        return http_post(url, payload, _headers(), timeout=20)
    except Exception as e:
        print(f"[bridge] wakeup falhou para {agent_id}: {e}", file=sys.stderr)
        return None


def paperclip_run_status(run_id: str) -> Optional[Dict[str, Any]]:
    """Consulta o status de uma run do Paperclip."""
    url = f"{PAPERCLIP_API_URL}/api/heartbeat-runs/{run_id}"
    try:
        return http_get(url, _headers(), timeout=15)
    except Exception as e:
        print(f"[bridge] run status falhou para {run_id}: {e}", file=sys.stderr)
        return None


def paperclip_list_agents() -> List[Dict[str, Any]]:
    """Sincroniza agentes da API do Paperclip."""
    if not PAPERCLIP_COMPANY_ID:
        return []
    url = f"{PAPERCLIP_API_URL}/api/companies/{PAPERCLIP_COMPANY_ID}/agents"
    try:
        data = http_get(url, _headers(), timeout=15)
        if isinstance(data, list):
            return [
                {
                    "name": a.get("name", "sem nome"),
                    "agent_id": a.get("id", ""),
                    "aliases": [],
                }
                for a in data
            ]
    except Exception as e:
        print(f"[bridge] sync agents falhou: {e}", file=sys.stderr)
    return []


# ---------------------------------------------------------------------------
# Telegram
# ---------------------------------------------------------------------------

def telegram_send_message(chat_id: int, text: str, reply_to: Optional[int] = None) -> Any:
    payload: Dict[str, Any] = {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
    if reply_to:
        payload["reply_to_message_id"] = reply_to
    return telegram_api("sendMessage", payload)


def telegram_get_updates(offset: int, timeout: int) -> List[Dict[str, Any]]:
    payload = {"offset": offset, "timeout": timeout, "allowed_updates": ["message"]}
    try:
        result = telegram_api("getUpdates", payload)
        return result.get("result", []) if isinstance(result, dict) else []
    except Exception as e:
        print(f"[bridge] getUpdates falhou: {e}", file=sys.stderr)
        return []


# ---------------------------------------------------------------------------
# Comandos do bridge
# ---------------------------------------------------------------------------

def handle_command(text: str, chat_id: int) -> Optional[str]:
    """Processa comandos /pc ... Retorna resposta ou None."""
    if not text.startswith("/pc"):
        return None
    parts = text.strip().split()
    cmd = parts[1] if len(parts) > 1 else ""
    args = parts[2:]

    if cmd == "help" or cmd == "start":
        return (
            "*Paperclip Telegram Bridge*\n"
            "Uso: `@NomeDoAgente sua mensagem` para acordar um agente.\n"
            "Comandos: `/pc status`, `/pc sync`, `/pc help`.\n"
            "As respostas dos agentes voltam para este chat assinadas com o nome do agente."
        )
    if cmd == "status":
        agents = load_agents()
        lines = [f"*Bridge status* — {len(agents)} agente(s) configurado(s), {len(RUN_STATE)} run(ens) ativa(s)."]
        for a in agents:
            lines.append(f"• {a['name']} (`{a['agent_id'][:8]}…`)")
        return "\n".join(lines)
    if cmd == "sync":
        remotos = paperclip_list_agents()
        if not remotos:
            return "Não foi possível sincronizar agentes do Paperclip."
        # Grava agents.yaml atualizado
        import yaml  # type: ignore
        with open(AGENTS_FILE, "w", encoding="utf-8") as f:
            yaml.safe_dump({"agents": remotos}, f, allow_unicode=True, sort_keys=False)
        return f"Sincronizados {len(remotos)} agente(s) do Paperclip para `agents.yaml`."
    return None


# ---------------------------------------------------------------------------
# Loop principal
# ---------------------------------------------------------------------------

def process_telegram_update(update: Dict[str, Any], lookup: Dict[str, Dict[str, Any]]) -> None:
    global LAST_UPDATE_ID
    LAST_UPDATE_ID = max(LAST_UPDATE_ID, update["update_id"]) + 1

    message = update.get("message")
    if not message or not message.get("text"):
        return

    chat = message.get("chat", {})
    chat_id = chat.get("id")
    user = message.get("from", {})
    user_id = user.get("id")
    text = message["text"]
    message_id = message.get("message_id")

    if not chat_id or not user_id:
        return

    # Allowlist (se configurada)
    if ALLOWED_USERS and user_id not in ALLOWED_USERS:
        telegram_send_message(chat_id, "Usuário não autorizado para usar este bot.")
        return

    # Comandos /pc
    cmd_resp = handle_command(text, chat_id)
    if cmd_resp:
        telegram_send_message(chat_id, cmd_resp, reply_to=message_id)
        return

    # Detectar menção de agente
    agent = find_agent(text, lookup)
    if not agent:
        return  # Não é para um agente; ignora silenciosamente

    agent_name = agent["name"]
    agent_id = agent["agent_id"]
    clean_text = strip_mention(text) or text

    # Ack imediato
    telegram_send_message(
        chat_id,
        f"⏳ Acionando *{agent_name}*…",
        reply_to=message_id,
    )

    # Wakeup no Paperclip
    run = paperclip_wakeup(agent_id, clean_text, chat_id, user_id)
    if not run or not run.get("id"):
        telegram_send_message(
            chat_id,
            f"❌ Falha ao acionar *{agent_name}*. Verifique se a API do Paperclip está acessível.",
            reply_to=message_id,
        )
        return

    run_id = run["id"]
    RUN_STATE[run_id] = {
        "chat_id": chat_id,
        "agent_name": agent_name,
        "agent_id": agent_id,
        "telegram_message_id": message_id,
        "created_at": time.time(),
    }
    print(f"[bridge] run {run_id} criada para agente {agent_name} (chat {chat_id})")


def poll_paperclip_runs() -> None:
    """Verifica runs em andamento e entrega respostas concluídas ao Telegram."""
    to_remove: List[str] = []
    for run_id, state in list(RUN_STATE.items()):
        run = paperclip_run_status(run_id)
        if not run:
            continue
        status = run.get("status")
        if status in ("completed", "failed", "cancelled"):
            agent_name = state["agent_name"]
            chat_id = state["chat_id"]
            reply_to = state.get("telegram_message_id")

            result_json = run.get("resultJson") or {}
            error = run.get("error")

            if status == "completed" and result_json:
                # Extrair texto útil do resultado
                summary = result_json.get("summary") or result_json.get("text") or str(result_json)
                # Limitar tamanho para não estourar o Telegram
                if len(summary) > 3500:
                    summary = summary[:3500] + "…"
                texto_resposta = f"*[{agent_name}]*\n{summary}"
            else:
                motivo = error or result_json.get("summary") or "run finalizada sem resultado visível"
                texto_resposta = f"*[{agent_name}]* ⚠️ {motivo}"

            try:
                telegram_send_message(chat_id, texto_resposta, reply_to=reply_to)
                print(f"[bridge] resposta entregue para run {run_id} (agente {agent_name}, status {status})")
            except Exception as e:
                print(f"[bridge] falha ao entregar resposta run {run_id}: {e}", file=sys.stderr)

            to_remove.append(run_id)

    for run_id in to_remove:
        RUN_STATE.pop(run_id, None)


def main() -> None:
    print("[bridge] Iniciando Paperclip Telegram Bridge…")
    print(f"[bridge] Paperclip API: {PAPERCLIP_API_URL}")
    print(f"[bridge] Company: {PAPERCLIP_COMPANY_ID}")
    print(f"[bridge] Telegram bot configurado: {'sim' if TELEGRAM_BOT_TOKEN else 'NÃO'}")

    if not TELEGRAM_BOT_TOKEN:
        print("[bridge] ERRO: TELEGRAM_BOT_TOKEN não definido.", file=sys.stderr)
        sys.exit(1)

    if not PAPERCLIP_API_URL:
        print("[bridge] ERRO: PAPERCLIP_API_URL não definido.", file=sys.stderr)
        sys.exit(1)

    agents = load_agents()
    lookup = build_lookup(agents)
    print(f"[bridge] {len(agents)} agente(s) carregado(s) de agents.yaml")

    global LAST_UPDATE_ID
    # Inicializa offset com o último update disponível (não processa histórico antigo)
    try:
        updates = telegram_get_updates(offset=0, timeout=1)
        if updates:
            LAST_UPDATE_ID = max(u["update_id"] for u in updates)
    except Exception:
        pass

    print("[bridge] Loop principal iniciado. Pressione Ctrl+C para parar.")
    try:
        while True:
            # 1) Receber mensagens do Telegram
            updates = telegram_get_updates(offset=LAST_UPDATE_ID, timeout=TELEGRAM_TIMEOUT)
            for upd in updates:
                process_telegram_update(upd, lookup)

            # 2) Pollar runs do Paperclip para entregas de saída
            poll_paperclip_runs()

            # Recarrega agentes periodicamente (a cada ~60s)
            if int(time.time()) % 60 < POLL_INTERVAL:
                agents = load_agents()
                lookup = build_lookup(agents)

            time.sleep(POLL_INTERVAL)
    except KeyboardInterrupt:
        print("\n[bridge] Encerrado pelo usuário.")


if __name__ == "__main__":
    main()
