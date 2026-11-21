#!/usr/bin/env bash
# Start script for Paperclip Telegram Bot

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🤖 Paperclip Telegram Bot - Startup${NC}"
echo "=================================="

# Check if node_modules exists
if [[ ! -d "node_modules" ]]; then
  echo -e "${YELLOW}📦 Instalando dependências...${NC}"
  npm install
fi

# Load environment variables from .env if exists
if [[ -f ".env" ]]; then
  echo -e "${GREEN}📋 Carregando .env${NC}"
  export $(grep -v '^#' .env | xargs)
fi

# Validate required environment variables
required_vars=(
  "TELEGRAM_BOT_TOKEN"
  "TELEGRAM_CHAT_ID"
  "PAPERCLIP_API_URL"
  "PAPERCLIP_API_KEY"
  "PAPERCLIP_COMPANY_ID"
  "PAPERCLIP_AGENT_ID"
)

missing_vars=()
for var in "${required_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    missing_vars+=("$var")
  fi
done

if [[ ${#missing_vars[@]} -gt 0 ]]; then
  echo -e "${RED}❌ Variáveis de ambiente obrigatórias faltando:${NC}"
  for var in "${missing_vars[@]}"; do
    echo -e "  ${RED}- $var${NC}"
  done
  echo ""
  echo "Crie um arquivo .env com:"
  cat << 'EOF'
TELEGRAM_BOT_TOKEN=8843826391:AAGrNRMOcGwKAxgqN9tvKvRsxWBMi1vZntg
TELEGRAM_CHAT_ID=8816487898
PAPERCLIP_API_URL=http://localhost:3100
PAPERCLIP_API_KEY=sua-api-key-aqui
PAPERCLIP_COMPANY_ID=uuid-da-empresa
PAPERCLIP_AGENT_ID=uuid-do-agent
EOF
  exit 1
fi

echo -e "${GREEN}✅ Variáveis de ambiente OK${NC}"
echo ""

# Build TypeScript
echo -e "${YELLOW}🔨 Compilando TypeScript...${NC}"
npm run build

if [[ $? -ne 0 ]]; then
  echo -e "${RED}❌ Falha na compilação${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Compilação OK${NC}"
echo ""

# Start the bot
echo -e "${GREEN}🚀 Iniciando bot...${NC}"
node dist/telegram-bot.js