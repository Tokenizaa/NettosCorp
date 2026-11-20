#!/usr/bin/env python3
"""
paperclip-telegram-bridge — Hermes como intermediário entre Telegram e Paperclip.

IMPORTANTE: esta bridge NÃO faz getUpdates do Telegram com o mesmo token que o
Hermes já usa (isso causaria conflito de updates). Ela expõe um webhook HTTP
local que pode receber mensagens (via configuração de webhook do Telegram, ou
via chamada manual --once), e as encaminha para o Paperclip.

Fluxo:
  Telegram (mensagem com @Agente)
    → webhook local (localhost:8765/webhook)  [ou comando --once]
    → Bridge detecta menção
    → POST /api/agents/{agent_id}/wakeup  (Paperclip)
    → heartbeat_run criado (run_id)
    → Bridge armazena run_id → (chat_id, agente)
    → Bridge polla GET /api/heartbeat-runs/{run_id}
    → Quando completa/falha, envia resultado ao Telegram assinado pelo agente
      (via sendMessage com o mesmo TELEGRAM_BOT_TOKEN do Hermes)

Usa apenas stdlib. Nenhuma dependência externa.
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer
from threading import Thread
from typing import Any, Dict, List, Optional

# ---------------------------------------------------------------------------
# Configuração (usa o mesmo token do Hermes, lido do ambiente)
# ---------------------------------------------------------------------------

PAPERCLIP_API_URL = os.getenv("PAPERCLIP_API_URL", "http://localhost:3100").rstrip("/")
PAPERCLIP_API_KEY = os.getenv("PAPERCLIP_API_KEY", "")
PAPERCLIP_COMPANY_ID = os.getenv("PAPERCLIP_COMPANY_ID", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}" if TELEGRAM_BOT_TOKEN else ""
ALLOWED_USERS_RAW = os.getenv("TELEGRAM_ALLOWED_USERS", "")
ALLOWED_USERS = set(int(u.strip()) for u in ALLOWED_USERS_RAW.split(",") if u.strip()) if ALLOWED_USERS_RAW else set()

AGENTS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "agents.yaml")
POLL_INTERVAL = 3
WEBHOOK_HOST = "127.0.0.1"
WEBHOOK_PORT = 8765

# ---------------------------------------------------------------------------
# Estado em memória
# ---------------------------------------------------------------------------

# run_id -> {chat_id, agent_name, agent_id, created_at}
RUN_STATE: Dict[str, Dict[str, Any]] = {}

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


def telegram_send_message(chat_id: int, text: str) -> Any:
    """Envia mensagem ao Telegram usando o mesmo bot token do Hermes."""
    if not TELEGRAM_API_URL:
        raise RuntimeError("TELEGRAM_BOT_TOKEN não configurado")
    payload: Dict[str, Any] = {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
    return http_post(f"{TELEGRAM_API_URL}/sendMessage", payload, timeout=15)


# ---------------------------------------------------------------------------
# Agentes
# ---------------------------------------------------------------------------

def load_agents() -> List[Dict[str, Any]]:
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
        current: Optional[Dict[str, Any]] = None
        with open(AGENTS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                stripped = line.strip()
                if not stripped or stripped.startswith("#"):
                    continue
                if stripped == "agents:":
                    continue
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
    lookup: Dict[str, Dict[str, Any]] = {}
    for a in agents:
        lookup[a["name"].lower()] = a
        for alias in a.get("aliases", []):
            lookup[alias.lower()] = a
    return lookup


def find_agent(text: str, lookup: Dict[str, Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not text:
        return None
    for m in re.finditer(r"@([A-Za-zÀ-ÿ0-9_\s][A-Za-zÀ-ÿ0-9_\s]*)", text, re.IGNORECASE):
        mention = m.group(1).strip().lower()
        if mention in lookup:
            return lookup[mention]
        for key, agent in lookup.items():
            if mention in key or key in mention:
                return agent
    return None


def strip_mention(text: str) -> str:
    return re.sub(r"@[A-Za-zÀ-ÿ0-9_\s]+", "", text, count=1).strip(" ,:;-\n\r\t")


# ---------------------------------------------------------------------------
# Paperclip
# ---------------------------------------------------------------------------

def paperclip_wakeup(agent_id: str, message_text: str, chat_id: int, user_id: int) -> Optional[Dict[str, Any]]:
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
    url = f"{PAPERCLIP_API_URL}/api/heartbeat-runs/{run_id}"
    try:
        return http_get(url, _headers(), timeout=15)
    except Exception as e:
        print(f"[bridge] run status falhou para {run_id}: {e}", file=sys.stderr)
        return None


def paperclip_list_agents() -> List[Dict[str, Any]]:
    if not PAPERCLIP_COMPANY_ID:
        return []
    url = f"{PAPERCLIP_API_URL}/api/companies/{PAPERCLIP_COMPANY_ID}/agents"
    try:
        data = http_get(url, _headers(), timeout=15)
        if isinstance(data, list):
            return [
                {"name": a.get("name", "sem nome"), "agent_id": a.get("id", ""), "aliases": []}
                for a in data
            ]
    except Exception as e:
        print(f"[bridge] sync agents falhou: {e}", file=sys.stderr)
    return []


# ---------------------------------------------------------------------------
# Processamento de uma mensagem (webhook ou --once)
# ---------------------------------------------------------------------------

def process_message(text: str, chat_id: int, user_id: int, lookup: Dict[str, Dict[str, Any]]) -> Optional[str]:
    """Processa uma mensagem de entrada. Retorna resposta de texto ou None."""
    if text.strip().startswith("/pc"):
        parts = text.strip().split()
        cmd = parts[1] if len(parts) > 1 else ""
        if cmd == "help":
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
            import yaml  # type: ignore
            with open(AGENTS_FILE, "w", encoding="utf-8") as f:
                yaml.safe_dump({"agents": remotos}, f, allow_unicode=True, sort_keys=False)
            return f"Sincronizados {len(remotos)} agente(s) do Paperclip para `agents.yaml`."
        return None

    agent = find_agent(text, lookup)
    if not agent:
        return None  # Não é para um agente

    agent_name = agent["name"]
    agent_id = agent["agent_id"]
    clean_text = strip_mention(text) or text

    run = paperclip_wakeup(agent_id, clean_text, chat_id, user_id)
    if not run or not run.get("id"):
        return f"❌ Falha ao acionar *{agent_name}*. Verifique se a API do Paperclip está acessível."

    run_id = run["id"]
    RUN_STATE[run_id] = {
        "chat_id": chat_id,
        "agent_name": agent_name,
        "agent_id": agent_id,
        "created_at": time.time(),
    }
    print(f"[bridge] run {run_id} criada para agente {agent_name} (chat {chat_id})")
    return f"⏳ Acionando *{agent_name}*… aguardando resposta."


# ---------------------------------------------------------------------------
# Polling de runs do Paperclip (entrega de saída ao Telegram)
# ---------------------------------------------------------------------------

def poll_paperclip_runs() -> None:
    to_remove: List[str] = []
    for run_id, state in list(RUN_STATE.items()):
        run = paperclip_run_status(run_id)
        if not run:
            continue
        status = run.get("status")
        if status in ("completed", "failed", "cancelled"):
            agent_name = state["agent_name"]
            chat_id = state["chat_id"]
            result_json = run.get("resultJson") or {}
            error = run.get("error")

            if status == "completed" and result_json:
                summary = result_json.get("summary") or result_json.get("text") or str(result_json)
                if len(summary) > 3500:
                    summary = summary[:3500] + "…"
                texto_resposta = f"*[{agent_name}]*\n{summary}"
            else:
                motivo = error or result_json.get("summary") or "run finalizada sem resultado visível"
                texto_resposta = f"*[{agent_name}]* ⚠️ {motivo}"

            try:
                telegram_send_message(chat_id, texto_resposta)
                print(f"[bridge] resposta entregue para run {run_id} (agente {agent_name}, status {status})")
            except Exception as e:
                print(f"[bridge] falha ao entregar resposta run {run_id}: {e}", file=sys.stderr)

            to_remove.append(run_id)

    for run_id in to_remove:
        RUN_STATE.pop(run_id, None)


# ---------------------------------------------------------------------------
# Webhook HTTP local (recebe mensagens do Telegram sem getUpdates)
# ---------------------------------------------------------------------------

class WebhookHandler(BaseHTTPRequestHandler):
    lookup: Dict[str, Dict[str, Any]] = {}

    def do_POST(self):
        if self.path != "/webhook":
            self.send_response(404)
            self.end_headers()
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            payload = json.loads(body) if body else {}
        except Exception:
            self.send_response(400)
            self.end_headers()
            return

        text = payload.get("text", "")
        chat_id = payload.get("chat_id")
        user_id = payload.get("user_id", 0)

        if not chat_id:
            self.send_response(400)
            self.end_headers()
            return

        if ALLOWED_USERS and user_id not in ALLOWED_USERS:
            try:
                telegram_send_message(chat_id, "Usuário não autorizado para usar este bot.")
            except Exception:
                pass
            self.send_response(200)
            self.end_headers()
            return

        resposta = process_message(text, chat_id, user_id, self.lookup)
        if resposta:
            try:
                telegram_send_message(chat_id, resposta)
            except Exception as e:
                print(f"[bridge] falha ao enviar resposta: {e}", file=sys.stderr)

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"ok")

    def log_message(self, format, *args):
        return  # silenciar logs do http.server


def _run_poll_loop() -> None:
    while True:
        try:
            poll_paperclip_runs()
        except Exception as e:
            print(f"[bridge] erro no poll de runs: {e}", file=sys.stderr)
        time.sleep(POLL_INTERVAL)


def run_webhook(lookup: Dict[str, Dict[str, Any]]) -> None:
    WebhookHandler.lookup = lookup
    server = HTTPServer((WEBHOOK_HOST, WEBHOOK_PORT), WebhookHandler)
    print(f"[bridge] Webhook local escutando em http://{WEBHOOK_HOST}:{WEBHOOK_PORT}/webhook")
    print("[bridge] Configure o webhook do Telegram para apontar para esta URL.")
    print("[bridge] Ou use: python3 bridge.py --once \"@Agente texto\" [chat_id] [user_id]")
    t = Thread(target=_run_poll_loop, daemon=True)
    t.start()
    server.serve_forever()


# ---------------------------------------------------------------------------
# Modo linha de comando (única mensagem, para teste)
# ---------------------------------------------------------------------------

def run_once(text: str, chat_id: int, user_id: int, lookup: Dict[str, Dict[str, Any]]) -> None:
    resposta = process_message(text, chat_id, user_id, lookup)
    if resposta:
        print(resposta)
        try:
            telegram_send_message(chat_id, resposta)
        except Exception as e:
            print(f"[bridge] não foi possível enviar ao Telegram: {e}", file=sys.stderr)
    else:
        print("(nenhuma menção de agente detectada)")

    # Aguarda a run completar (até 60s)
    for run_id, state in list(RUN_STATE.items()):
        for _ in range(20):
            time.sleep(3)
            run = paperclip_run_status(run_id)
            if not run:
                break
            if run.get("status") in ("completed", "failed", "cancelled"):
                result_json = run.get("resultJson") or {}
                error = run.get("error")
                if run.get("status") == "completed" and result_json:
                    summary = result_json.get("summary") or result_json.get("text") or str(result_json)
                    if len(summary) > 3500:
                        summary = summary[:3500] + "…"
                    print(f"\n*[{state['agent_name']}]*\n{summary}")
                else:
                    motivo = error or result_json.get("summary") or "sem resultado visível"
                    print(f"\n*[{state['agent_name']}]* ⚠️ {motivo}")
                try:
                    if run.get("status") == "completed" and result_json:
                        telegram_send_message(chat_id, f"*[{state['agent_name']}]*\n{summary}")
                    else:
                        telegram_send_message(chat_id, f"*[{state['agent_name']}]* ⚠️ {motivo}")
                except Exception:
                    pass
                break


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("[bridge] Paperclip Telegram Bridge (modo webhook local)")
    print(f"[bridge] Paperclip API: {PAPERCLIP_API_URL}")
    print(f"[bridge] Company: {PAPERCLIP_COMPANY_ID}")
    print(f"[bridge] Telegram bot configurado: {'sim' if TELEGRAM_BOT_TOKEN else 'NÃO'}")

    if not TELEGRAM_BOT_TOKEN:
        print("[bridge] ERRO: TELEGRAM_BOT_TOKEN não definido.", file=sys.stderr)
        print("[bridge] Exporte a variável ou faça `source ~/.hermes/.env` antes de iniciar.", file=sys.stderr)
        sys.exit(1)

    if not PAPERCLIP_API_URL:
        print("[bridge] ERRO: PAPERCLIP_API_URL não definido.", file=sys.stderr)
        sys.exit(1)

    agents = load_agents()
    lookup = build_lookup(agents)
    print(f"[bridge] {len(agents)} agente(s) carregado(s) de agents.yaml")

    if "--once" in sys.argv:
        idx = sys.argv.index("--once")
        resto = sys.argv[idx + 1:]
        if not resto:
            print("Uso: python3 bridge.py --once \"@Agente sua mensagem\" [chat_id] [user_id]", file=sys.stderr)
            sys.exit(1)
        texto = resto[0]
        chat_id = int(resto[1]) if len(resto) > 1 else 0
        user_id = int(resto[2]) if len(resto) > 2 else 0
        run_once(texto, chat_id, user_id, lookup)
        return

    run_webhook(lookup)


if __name__ == "__main__":
    main()
