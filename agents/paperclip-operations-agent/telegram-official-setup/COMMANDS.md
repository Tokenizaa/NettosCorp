# Quick Reference - Comandos Telegram + Paperclip

## Comandos do Plugin Telegram (dentro da sessão Claude Code)

```bash
# Ver estado atual
/telegram:access

# Pareamento (primeira vez)
/telegram:access pair a4f91c

# Allowlist
/telegram:access allow 8816487898
/telegram:access remove 8816487898

# Políticas
/telegram:access policy allowlist    # Só allowlist (silencioso)
/telegram:access policy pairing      # Pairing para novos (padrão)
/telegram:access policy disabled     # Bloqueia tudo

# Grupos
/telegram:access group add -1001234567890
/telegram:access group add -1001234567890 --no-mention
/telegram:access group rm -1001234567890

# Configurações
/telegram:access set ackReaction 👀
/telegram:access set replyToMode first
/telegram:access set textChunkLimit 4096
/telegram:access set chunkMode newline
/telegram:access set mentionPatterns '["^hey claude\\b", "^paperclip\\b"]'
```

## Comandos Paperclip (via skill paperclip na sessão)

### Issues
```
/inbox                           # Ver inbox do agent
/issues [status] [limit]         # Listar issues
/issue PAP-123                   # Ver detalhes
/create                          # Criar issue (multi-step)
/checkout PAP-123                # Checkout
/release PAP-123                 # Liberar
/comment PAP-123 "texto"         # Comentar
/status PAP-123 done "msg"       # Atualizar status
```

### Agents
```
/agents                          # Listar agents
/hire                            # Hire novo agent (JSON)
/wake agent-id                   # Acordar agent
```

### Runs
```
/runs [limit]                    # Runs recentes
/run run-id                      # Detalhes de run
```

### Approvals
```
/approve approval-id             # Aprovar
/reject approval-id "motivo"     # Rejeitar
```

### Utilitários
```
/ping                            # Testar conexão Paperclip
/config                          # Ver configuração
/help                            # Ajuda
```

## Fluxo de Trabalho Típico

```
1. Telegram: /inbox
   → Vê issues atribuídas

2. Telegram: /issue PAP-123
   → Vê detalhes da issue

3. Telegram: /checkout PAP-123
   → Faz checkout

4. Telegram: /comment PAP-123 "Iniciando trabalho"
   → Comenta

5. Telegram: /status PAP-123 in_progress
   → Atualiza status

6. ...faz o trabalho via Paperclip tools...

7. Telegram: /status PAP-123 done "Concluído"
   → Finaliza

8. Telegram: /release PAP-123
   → Libera issue
```

## Exemplos de Uso no Telegram

```
Você: /inbox
Bot:  📥 Inbox (2 issues)
      1. [PAP-123] Fix login (in_progress)
      2. [PAP-124] Update deps (todo)

Você: /checkout PAP-124
Bot:  ✅ Checkout realizado!

Você: /status PAP-124 in_progress "Atualizando dependências"
Bot:  ✅ Status: in_progress

Você: /comment PAP-124 "npm update concluído, rodando testes"
Bot:  ✅ Comentário adicionado

Você: /status PAP-124 done "Testes passando"
Bot:  ✅ Status: done

Você: /release PAP-124
Bot:  ✅ Issue liberada!
```

## Variáveis de Ambiente Necessárias

```bash
# Paperclip (para o agent funcionar)
export PAPERCLIP_API_URL="http://localhost:3100"
export PAPERCLIP_API_KEY="sua-api-key"
export PAPERCLIP_COMPANY_ID="uuid-empresa"
export PAPERCLIP_AGENT_ID="uuid-agent"  # opcional

# Telegram (configurado via /telegram:configure)
# TELEGRAM_BOT_TOKEN em ~/.claude/channels/telegram/.env
```

## Inicialização

```bash
# Desenvolvimento
source ~/paperclip-telegram-env.sh
claude --channels plugin:telegram@claude-plugins-official

# Produção (tmux)
~/start-paperclip-telegram-tmux.sh

# Produção (systemd)
sudo systemctl start paperclip-telegram
```

## Arquivos Importantes

```
~/.claude/channels/telegram/
├── .env              # TELEGRAM_BOT_TOKEN
├── access.json       # Config de acesso
├── inbox/            # Fotos recebidas
└── bot.pid           # PID do MCP server
```

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Bot não responde | Verificar se sessão tem `--channels` |
| 409 Conflict | `pkill -f server.ts` e reiniciar |
| Pairing falha | Verificar `dmPolicy` em access.json |
| Paperclip erro | Verificar vars `PAPERCLIP_*` no env |
| Sessão caiu | Usar tmux ou systemd para persistir |