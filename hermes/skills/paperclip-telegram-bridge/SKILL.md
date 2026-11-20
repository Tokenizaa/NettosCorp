---
name: paperclip-telegram-bridge
description: "Bridge Hermes ↔ Paperclip via Telegram: encaminha mensagens para agentes do Paperclip e devolve as respostas ao mesmo chat."
version: 1.0.0
author: Hermes Agent (NettosCorp)
---

# paperclip-telegram-bridge

Skill que faz o Hermes intermediar conversas do Telegram com agentes do Paperclip, sem criar tabelas nem outro sistema de chat.

## O que faz

- Recebe mensagens do Telegram (um único bot).
- Detecta menções a agentes (`@NomeDoAgente`).
- Chama `POST /api/agents/{id}/wakeup` no Paperclip para acordar o agente.
- Acompanha a run via `GET /api/heartbeat-runs/{id}`.
- Quando a run completa/falha, envia a resposta de volta ao mesmo chat do Telegram, assinada com o nome do agente.
- Mantém cada conversa vinculada ao agente respectivo (via mapeamento run_id → chat_id).

## O que NÃO faz

- Não cria tabelas no banco do Paperclip.
- Não cria um novo sistema de chat.
- Não substitui a identidade dos agentes (as respostas saem assinadas pelo agente).
- Não depende de `chat_endpoint` do Telegram já configurado no Paperclip (funciona com o wakeup puro).

## Pré-requisitos

- Hermes instalado e rodando.
- Paperclip API acessível (ex: `http://localhost:3100`).
- Um bot do Telegram criado via `@BotFather` com `TELEGRAM_BOT_TOKEN`.
- (Opcional, para teste completo) Um `chat_endpoint` do tipo `telegram` cadastrado no Paperclip e pelo menos um agente logado/executável.

## Variáveis de ambiente

Defina em `~/.hermes/.env` ou exporte antes de iniciar:

| Variável | Exemplo | Obrigatório |
|---|---|---|
| `PAPERCLIP_API_URL` | `http://localhost:3100` | Sim |
| `PAPERCLIP_API_KEY` | `pcp_board_...` | Não (modo local_trusted) |
| `PAPERCLIP_COMPANY_ID` | `1ad50023-...` | Sim |
| `TELEGRAM_BOT_TOKEN` | `123456789:AA...` | Sim |
| `TELEGRAM_ALLOWED_USERS` | `123456789,987654321` | Não (se vazio, aceita todos) |

## Agentes mapeados

Edite `agents.yaml` na pasta da skill para mapear nomes do Telegram → `agent_id` do Paperclip:

```yaml
agents:
  - name: Arquiteto
    agent_id: c47189df-3863-4a67-81f6-4e00a1716876
    aliases: [arquiteto, software architect]
  - name: Diretor de Tecnologia
    agent_id: 10a2e4b1-6a82-46c0-9559-9e1e3a65a324
    aliases: [cto, diretor]
```

Ou carregue dinamicamente via `GET /api/companies/{id}/agents` (veja `bridge.py --sync-agents`).

## Como iniciar

```bash
# Na pasta da skill
chmod +x start.sh
./start.sh
```

Ou, via Hermes (quando a skill estiver instalada no perfil):

```bash
hermes skills enable paperclip-telegram-bridge
```

O bridge roda como um loop independente: polling do Telegram + polling das runs do Paperclip.

## Fluxo de mensagem

```
Usuário (Telegram): @Arquiteto revise esta API
  → Bridge detecta @Arquiteto → agent_id
  → Bridge chama POST /api/agents/{agent_id}/wakeup
  → Paperclip cria heartbeat_run (run_id)
  → Bridge responde no Telegram: "⏳ Acionando @Arquiteto..."
  → Bridge polla GET /api/heartbeat-runs/{run_id}
  → Quando completado, Bridge envia ao Telegram: "[Arquiteto] resultado da análise..."
```

## Comandos

- `/pc status` — mostra o estado do bridge e agentes configurados.
- `/pc sync` — sincroniza a lista de agentes da API do Paperclip para `agents.yaml`.
- `/pc help` — mostra esta ajuda.