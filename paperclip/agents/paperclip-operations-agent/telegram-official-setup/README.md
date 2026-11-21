# Paperclip Operations Agent + Telegram (Plugin Oficial)

Configuração usando o **plugin oficial da Anthropic**: `telegram@claude-plugins-official`

Este plugin usa o sistema **Claude Code Channels** - um bridge MCP que conecta Telegram ↔ sessão local do Claude Code.

## Documentação Oficial

- [Claude Code Channels](https://code.claude.com/docs/en/channels)
- Plugin: `telegram@claude-plugins-official`
- Código: `~/.claude/plugins/marketplaces/claude-plugins-official/external_plugins/telegram/`

## Arquitetura

```
Telegram (BotFather) 
    ↓
MCP Server (server.ts - Bun + Grammy)
    ↓
Claude Code Session (--channels plugin:telegram@claude-plugins-official)
    ↓
Paperclip Operations Agent (via skill paperclip)
```

**Fluxo:** Mensagem Telegram → MCP Server → Channel notification → Claude Code Session → Paperclip API → Resposta → MCP Server → Telegram

## Pré-requisitos

```bash
# Bun (necessário para o MCP server)
curl -fsSL https://bun.sh/install | bash

# Claude Code (já instalado)
claude --version
```

## Setup Passo a Passo

### 1. Criar/Verificar Bot no BotFather

```bash
# Abrir @BotFather no Telegram
# /newbot
# Nome: Paperclip Operations
# Username: paperclip_ops_bot (ou seu nome)
# Token: 8843826391:AAGrNRMOcGwKAxgqN9tvKvRsxWBMi1vZntg (seu token)
```

### 2. Instalar Plugin Oficial

```bash
# Iniciar sessão Claude Code
claude

# Instalar plugin
/plugin install telegram@claude-plugins-official

# Ou via CLI direto
claude --plugin install telegram@claude-plugins-official
```

### 3. Configurar Token

```bash
# Na sessão Claude Code:
/telegram:configure 8843826391:AAGrNRMOcGwKAxgqN9tvKvRsxWBMi1vZntg

# Isso cria: ~/.claude/channels/telegram/.env
# Com: TELEGRAM_BOT_TOKEN=8843826391:AAGrNRMOcGwKAxgqN9tvKvRsxWBMi1vZntg
```

### 4. Iniciar Sessão com Channel

```bash
# SAIR da sessão atual (Ctrl+D ou exit)
# Iniciar NOVA sessão com channel:
claude --channels plugin:telegram@claude-plugins-official
```

### 5. Pareamento (Primeira vez)

```bash
# No Telegram, envie mensagem para o bot
# Bot responde com código de 6 caracteres (ex: a4f91c)

# Na sessão Claude Code:
/telegram:access pair a4f91c

# Pronto! Mensagens agora chegam na sessão
```

### 6. Configurar Allowlist (Segurança)

```bash
# Ver seu user ID:
# Telegram → @userinfobot → seu ID numérico (ex: 8816487898)

# Na sessão Claude Code:
/telegram:access allow 8816487898

# Mudar política para allowlist (não responde estranhos):
/telegram:access policy allowlist

# Ver estado:
/telegram:access
```

## Integração com Paperclip Operations Agent

A sessão Claude Code deve carregar as instruções do **Chefe de Gabinete / Paperclip Operations Agent**.

### Opção A: Instruções via Arquivo

```bash
# Criar arquivo de instruções
cat > ~/paperclip-operations-instructions.md << 'EOF'
# Paperclip Operations Agent Instructions

You are the Paperclip Operations Agent for NettosCorp.

You have access to:
- Paperclip API via skill 'paperclip'
- Agent hiring via skill 'paperclip-create-agent'
- Company ID: <seu-company-id>
- API Key: configurada via variável de ambiente

When receiving Telegram messages:
1. Parse the request
2. Use Paperclip API tools to execute
3. Return formatted response
EOF
```

### Opção B: Carregar skill paperclip na sessão

O plugin Telegram injeta mensagens na sessão. A sessão deve ter:
- Skill `paperclip` disponível
- Variáveis de ambiente `PAPERCLIP_API_URL`, `PAPERCLIP_API_KEY`, `PAPERCLIP_COMPANY_ID`

```bash
# Exportar variáveis antes de iniciar
export PAPERCLIP_API_URL="http://localhost:3100"
export PAPERCLIP_API_KEY="sua-api-key"
export PAPERCLIP_COMPANY_ID="uuid-da-empresa"

# Iniciar com channel
claude --channels plugin:telegram@claude-plugins-official
```

### Opção C: Session persistente (Recomendado para produção)

```bash
# Usar tmux/screen para manter sessão ativa
tmux new-session -s paperclip-telegram

# Dentro do tmux:
export PAPERCLIP_API_URL="http://localhost:3100"
export PAPERCLIP_API_KEY="sua-api-key"
export PAPERCLIP_COMPANY_ID="uuid-da-empresa"
claude --channels plugin:telegram@claude-plugins-official

# Detach: Ctrl+B, D
# Reattach: tmux attach -t paperclip-telegram
```

## Comandos Úteis na Sessão

```bash
# Ver status do channel
/telegram:access

# Adicionar usuário à allowlist
/telegram:access allow 8816487898

# Remover usuário
/telegram:access remove 8816487898

# Mudar política
/telegram:access policy allowlist
/telegram:access policy pairing

# Configurar reação de confirmação
/telegram:access set ackReaction 👀

# Ver grupos ativos
/telegram:access group add -1001234567890

# Testar conexão Paperclip
# (use as ferramentas da skill paperclip)
```

## Estrutura de Arquivos

```
~/.claude/channels/telegram/
├── .env              # TELEGRAM_BOT_TOKEN (chmod 600)
├── access.json       # Configuração de acesso (policy, allowlist, groups)
├── access.json.bak   # Backup automático
├── inbox/            # Fotos recebidas (auto-download)
├── approved/         # Usuários aprovados (pairing)
└── bot.pid           # PID do processo MCP server
```

## Exemplo de Uso

### No Telegram:
```
Você: /inbox
Bot:  📥 Inbox (3 issues)
      1. [PAP-123] Fix login bug (in_progress)
      2. [PAP-124] Update docs (todo)
      3. [PAP-125] Deploy staging (blocked)

Você: /issue PAP-123
Bot:  📋 Issue: PAP-123
      Título: Fix login bug
      Status: in_progress
      Assignee: Agent: paperclip-operations
      ...

Você: /checkout PAP-123
Bot:  ✅ Checkout realizado!

Você: /comment PAP-123 "Iniciando investigação"
Bot:  ✅ Comentário adicionado!

Você: /status PAP-123 done "Bug corrigido"
Bot:  ✅ Status atualizado para done!
```

## Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Token do BotFather | Sim (em `~/.claude/channels/telegram/.env`) |
| `TELEGRAM_STATE_DIR` | Diretório alternativo para múltiplos bots | Não |
| `TELEGRAM_ACCESS_MODE` | `static` para desabilitar pairing runtime | Não |
| `PAPERCLIP_API_URL` | URL da API Paperclip | Sim (para o agent funcionar) |
| `PAPERCLIP_API_KEY` | API Key Paperclip | Sim |
| `PAPERCLIP_COMPANY_ID` | Company UUID | Sim |

## Limitações Conhecidas

1. **Sessão deve estar ativa** - Se fechar o terminal, para de receber mensagens
2. **Sem histórico** - Telegram Bot API não expõe histórico/busca
3. **Uma sessão por token** - Não pode ter 2 sessões com mesmo bot simultâneas
4. **MCP server em Bun** - Requer Bun instalado

## Solução para Produção (Sessão Persistente)

```bash
# systemd service para manter sessão ativa
# /etc/systemd/system/paperclip-telegram.service

[Unit]
Description=Paperclip Telegram Channel
After=network.target

[Service]
Type=simple
User=seu-usuario
Environment=PAPERCLIP_API_URL=http://localhost:3100
Environment=PAPERCLIP_API_KEY=sua-key
Environment=PAPERCLIP_COMPANY_ID=uuid-empresa
WorkingDirectory=/home/seu-usuario
ExecStart=/home/seu-usuario/.bun/bin/claude --channels plugin:telegram@claude-plugins-official
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target

# Ativar:
sudo systemctl enable --now paperclip-telegram
```

## Troubleshooting

### Bot não responde
```bash
# Verificar se channel está ativo
ps aux | grep server.ts

# Ver logs
tail -f ~/.claude/channels/telegram/*.log 2>/dev/null || echo "Sem logs"

# Reiniciar sessão com channel
claude --channels plugin:telegram@claude-plugins-official
```

### Erro 409 Conflict
```bash
# Outro processo usando o token
pkill -f "server.ts"
# Ou reiniciar - o server.ts mata processos órfãos automaticamente
```

### Pairing não funciona
```bash
# Verificar se sessão tem --channels
# Verificar access.json policy
cat ~/.claude/channels/telegram/access.json

# Deve ser "pairing" ou "allowlist" com seu ID
```

### Paperclip não funciona na sessão
```bash
# Verificar variáveis de ambiente
env | grep PAPERCLIP

# Verificar se skill paperclip carrega
# Na sessão: /skill list | grep paperclip
```

## Referências

- [Claude Code Channels Docs](https://code.claude.com/docs/en/channels)
- [Plugin Telegram Source](~/.claude/plugins/marketplaces/claude-plugins-official/external_plugins/telegram/)
- [ACCESS.md](~/.claude/plugins/marketplaces/claude-plugins-official/external_plugins/telegram/ACCESS.md)
- [Paperclip Operations Agent](../README.md)