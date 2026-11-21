#!/usr/bin/env bash
# Setup script for official Telegram plugin (Claude Code Channels)

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🤖 Paperclip + Telegram Official Plugin Setup${NC}"
echo "=============================================="
echo ""

# Check prerequisites
echo -e "${YELLOW}📋 Verificando pré-requisitos...${NC}"

# Check Bun
if ! command -v bun &> /dev/null; then
    echo -e "${RED}❌ Bun não encontrado${NC}"
    echo "Instale: curl -fsSL https://bun.sh/install | bash"
    exit 1
else
    echo -e "${GREEN}✅ Bun: $(bun --version)${NC}"
fi

# Check Claude Code
if ! command -v claude &> /dev/null; then
    echo -e "${RED}❌ Claude Code não encontrado${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Claude Code: $(claude --version)${NC}"
fi

# Check plugin marketplace
MARKETPLACE_DIR="$HOME/.claude/plugins/marketplaces/claude-plugins-official/external_plugins/telegram"
if [[ ! -d "$MARKETPLACE_DIR" ]]; then
    echo -e "${RED}❌ Plugin telegram não encontrado no marketplace${NC}"
    echo "Execute: /plugin install telegram@claude-plugins-official dentro do Claude Code"
    exit 1
else
    echo -e "${GREEN}✅ Plugin telegram encontrado no marketplace${NC}"
fi

echo ""

# Get configuration
read -p "Telegram Bot Token [8843826391:AAGrNRMOcGwKAxgqN9tvKvRsxWBMi1vZntg]: " BOT_TOKEN
BOT_TOKEN="${BOT_TOKEN:-8843826391:AAGrNRMOcGwKAxgqN9tvKvRsxWBMi1vZntg}"

read -p "Seu Telegram User ID (de @userinfobot) [8816487898]: " USER_ID
USER_ID="${USER_ID:-8816487898}"

read -p "Paperclip API URL [http://localhost:3100]: " PAPERCLIP_API_URL
PAPERCLIP_API_URL="${PAPERCLIP_API_URL:-http://localhost:3100}"

read -p "Paperclip API Key: " PAPERCLIP_API_KEY
if [[ -z "$PAPERCLIP_API_KEY" ]]; then
    echo -e "${RED}❌ Paperclip API Key é obrigatória${NC}"
    exit 1
fi

read -p "Paperclip Company ID: " PAPERCLIP_COMPANY_ID
if [[ -z "$PAPERCLIP_COMPANY_ID" ]]; then
    echo -e "${RED}❌ Paperclip Company ID é obrigatória${NC}"
    exit 1
fi

read -p "Paperclip Agent ID (do agent operations): " PAPERCLIP_AGENT_ID
if [[ -z "$PAPERCLIP_AGENT_ID" ]]; then
    echo -e "${YELLOW}⚠️ Agent ID opcional - pode ser descoberto via /api/agents/me${NC}"
fi

echo ""
echo -e "${YELLOW}🔧 Configurando...${NC}"

# 1. Configure token via Claude Code command (preferred)
echo "1. Configurando token do bot..."
echo "Execute esta comando DENTRO de uma sessão Claude Code:"
echo -e "   ${GREEN}/telegram:configure $BOT_TOKEN${NC}"
echo ""

# 2. Create environment file for session
ENV_FILE="$HOME/paperclip-telegram-env.sh"
cat > "$ENV_FILE" << EOF
#!/usr/bin/env bash
# Paperclip + Telegram Environment
# Source este arquivo antes de iniciar a sessão: source $ENV_FILE

export PAPERCLIP_API_URL="$PAPERCLIP_API_URL"
export PAPERCLIP_API_KEY="$PAPERCLIP_API_KEY"
export PAPERCLIP_COMPANY_ID="$PAPERCLIP_COMPANY_ID"
EOF

if [[ -n "$PAPERCLIP_AGENT_ID" ]]; then
    echo "export PAPERCLIP_AGENT_ID=\"$PAPERCLIP_AGENT_ID\"" >> "$ENV_FILE"
fi

chmod +x "$ENV_FILE"
echo -e "${GREEN}✅ Arquivo de ambiente criado: $ENV_FILE${NC}"

# 3. Create start script
START_SCRIPT="$HOME/start-paperclip-telegram.sh"
cat > "$START_SCRIPT" << 'EOF'
#!/usr/bin/env bash
# Start Paperclip Operations Agent with Telegram Channel

# Load environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/paperclip-telegram-env.sh"

echo "🚀 Iniciando Paperclip Operations Agent com Telegram Channel..."
echo "   API: $PAPERCLIP_API_URL"
echo "   Company: $PAPERCLIP_COMPANY_ID"
echo ""

# Start Claude Code with Telegram channel
exec claude --channels plugin:telegram@claude-plugins-official
EOF

chmod +x "$START_SCRIPT"
echo -e "${GREEN}✅ Script de inicialização criado: $START_SCRIPT${NC}"

# 4. Create tmux session script
TMUX_SCRIPT="$HOME/start-paperclip-telegram-tmux.sh"
cat > "$TMUX_SCRIPT" << 'EOF'
#!/usr/bin/env bash
# Start in tmux for persistent session

SESSION_NAME="paperclip-telegram"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Kill existing session
tmux kill-session -t "$SESSION_NAME" 2>/dev/null || true

# Create new session
tmux new-session -d -s "$SESSION_NAME" \
  "source $SCRIPT_DIR/paperclip-telegram-env.sh && claude --channels plugin:telegram@claude-plugins-official"

echo "✅ Sessão tmux '$SESSION_NAME' iniciada"
echo "   Anexar: tmux attach -t $SESSION_NAME"
echo "   Logs: tmux capture-pane -t $SESSION_NAME -p"
echo "   Parar: tmux kill-session -t $SESSION_NAME"
EOF

chmod +x "$TMUX_SCRIPT"
echo -e "${GREEN}✅ Script tmux criado: $TMUX_SCRIPT${NC}"

# 5. Create systemd service template
SERVICE_FILE="$HOME/paperclip-telegram.service"
cat > "$SERVICE_FILE" << EOF
# systemd service for Paperclip Telegram Channel
# Instale: sudo cp $SERVICE_FILE /etc/systemd/system/paperclip-telegram.service
# Ative: sudo systemctl enable --now paperclip-telegram

[Unit]
Description=Paperclip Telegram Channel
After=network.target

[Service]
Type=simple
User=$USER
Environment=PAPERCLIP_API_URL=$PAPERCLIP_API_URL
Environment=PAPERCLIP_API_KEY=$PAPERCLIP_API_KEY
Environment=PAPERCLIP_COMPANY_ID=$PAPERCLIP_COMPANY_ID
WorkingDirectory=$HOME
ExecStart=$HOME/.bun/bin/claude --channels plugin:telegram@claude-plugins-official
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}✅ Template systemd criado: $SERVICE_FILE${NC}"

echo ""
echo -e "${BLUE}=============================================="
echo -e "📋 PRÓXIMOS PASSOS MANUAIS:${NC}"
echo -e "${BLUE}=============================================="
echo ""
echo -e "${YELLOW}1. CONFIGURAR TOKEN (dentro do Claude Code):${NC}"
echo "   claude"
echo "   /telegram:configure $BOT_TOKEN"
echo "   (Ctrl+D para sair)"
echo ""
echo -e "${YELLOW}2. INICIAR SESSÃO COM CHANNEL:${NC}"
echo "   source $ENV_FILE"
echo "   claude --channels plugin:telegram@claude-plugins-official"
echo ""
echo -e "${YELLOW}3. PAREAMENTO (primeira mensagem no Telegram):${NC}"
echo "   - Envie qualquer mensagem para o bot no Telegram"
echo "   - Bot responde com código (ex: a4f91c)"
echo "   - Na sessão Claude Code:"
echo "     /telegram:access pair a4f91c"
echo ""
echo -e "${YELLOW}4. CONFIGURAR ALLOWLIST:${NC}"
echo "   /telegram:access allow $USER_ID"
echo "   /telegram:access policy allowlist"
echo ""
echo -e "${YELLOW}5. PARA PRODUÇÃO (tmux persistente):${NC}"
echo "   $TMUX_SCRIPT"
echo ""
echo -e "${YELLOW}6. PARA SYSTEMD (boot automático):${NC}"
echo "   sudo cp $SERVICE_FILE /etc/systemd/system/"
echo "   sudo systemctl enable --now paperclip-telegram"
echo ""
echo -e "${GREEN}✅ Setup completo!${NC}"