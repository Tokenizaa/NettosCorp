#!/usr/bin/env bash
# Inicia o paperclip-telegram-bridge no contexto do Hermes.
# Fonte as variáveis de ambiente antes de rodar: source ~/.hermes/.env (ou defina manualmente).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export PAPERCLIP_API_URL="${PAPERCLIP_API_URL:-http://localhost:3100}"
export PAPERCLIP_API_KEY="${PAPERCLIP_API_KEY:-}"
export PAPERCLIP_COMPANY_ID="${PAPERCLIP_COMPANY_ID:-}"
export TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
export TELEGRAM_ALLOWED_USERS="${TELEGRAM_ALLOWED_USERS:-}"

if [ ! -f "$SCRIPT_DIR/agents.yaml" ] && [ -f "$SCRIPT_DIR/agents.example.yaml" ]; then
  cp "$SCRIPT_DIR/agents.example.yaml" "$SCRIPT_DIR/agents.yaml"
  echo "[bridge] agents.yaml criado a partir do exemplo. Edite com seus agent_id reais."
fi

echo "[bridge] Iniciando bridge Hermes ↔ Paperclip (Telegram)…"
exec python3 "$SCRIPT_DIR/bridge.py"
