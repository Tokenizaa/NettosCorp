# Paperclip Telegram Bot

Bot do Telegram que conecta ao **Paperclip Operations Agent** via API do Paperclip. Permite gerenciar issues, agents, runs, approvals e muito mais direto do Telegram.

## Configuração

### Bot Token e Chat ID
- **Bot Token:** `8843826391:AAGrNRMOcGwKAxgqN9tvKvRsxWBMi1vZntg`
- **Chat ID:** `8816487898`

### Variáveis de Ambiente Necessárias

```bash
# Telegram (já configurado acima)
TELEGRAM_BOT_TOKEN=8843826391:AAGrNRMOcGwKAxgqN9tvKvRsxWBMi1vZntg
TELEGRAM_CHAT_ID=8816487898

# Paperclip API (configure estes)
PAPERCLIP_API_URL=http://localhost:3100
PAPERCLIP_API_KEY=sua-api-key-aqui
PAPERCLIP_COMPANY_ID=uuid-da-empresa
PAPERCLIP_AGENT_ID=uuid-do-agent-operations
```

## Instalação e Execução

### Opção 1: Desenvolvimento Local

```bash
cd telegram-bot

# Instalar dependências
npm install

# Copiar e configurar .env
cp .env.example .env
# Editar .env com suas credenciais Paperclip

# Desenvolvimento com hot reload
npm run dev

# Ou build + start
npm run build
npm start
```

### Opção 2: Docker

```bash
cd telegram-bot

# Copiar e configurar .env
cp .env.example .env
# Editar .env

# Build e start
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### Opção 3: Script Direto

```bash
cd telegram-bot
./start-bot.sh
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `/start` | Menu de ajuda |
| `/help` | Menu de ajuda |
| `/ping` | Testar conexão com Paperclip |
| `/config` | Ver configuração atual |
| `/inbox` | Ver issues atribuídas ao agent |
| `/issues [status] [limit]` | Listar issues (ex: `/issues todo,in_progress 20`) |
| `/issue <id>` | Ver detalhes de uma issue |
| `/create` | Criar nova issue (multi-step) |
| `/checkout <id>` | Fazer checkout de issue |
| `/release <id>` | Liberar issue |
| `/comment <id> <texto>` | Comentar em issue |
| `/status <id> <status>` | Atualizar status (backlog, todo, in_progress, in_review, done, blocked, cancelled) |
| `/hire` | Hire novo agent (envia JSON) |
| `/agents` | Listar todos os agents |
| `/runs [limit]` | Listar runs recentes |
| `/run <id>` | Ver detalhes de um run |
| `/wake <agent-id>` | Acordar agent |
| `/approve <id>` | Aprovar approval |
| `/reject <id> [motivo]` | Rejeitar approval |

## Exemplos de Uso

### Ver inbox
```
/inbox
```

### Listar issues em progresso
```
/issues in_progress 10
```

### Ver issue específica
```
/issue PAP-123
```

### Criar issue (multi-step)
```
/create
# Bot pede título
Minha nova task
# Bot pede descrição
Descrição detalhada aqui
# Issue criada!
```

### Checkout e trabalho
```
/checkout PAP-123
# Trabalha na issue...
/comment PAP-123 "Iniciando trabalho"
/status PAP-123 in_progress
# ...faz o trabalho...
/status PAP-123 done "Task concluída"
/release PAP-123
```

### Hire novo agent
```
/hire
# Bot pede JSON
{"name":"Novo Agent","role":"engineer","title":"Software Engineer","icon":"code","capabilities":"Implementa features","adapterType":"claude_local","adapterConfig":{"model":"claude-opus-5-5"},"desiredSkills":["paperclip"],"budgetMonthlyCents":50000}
```

### Aprovar/Rejeitar approval
```
/approve abc-123-def
/reject abc-123-def "Precisa de mais testes"
```

## Arquitetura

```
telegram-bot/
├── telegram-bot.ts      # Bot principal (Telegraf)
├── paperclip-client.ts  # Cliente API Paperclip tipado
├── config.ts            # Carregamento de configuração
├── package.json         # Dependências
├── tsconfig.json        # TypeScript config
├── Dockerfile           # Multi-stage Docker build
├── docker-compose.yml   # Docker Compose
├── .env.example         # Exemplo de variáveis
├── start-bot.sh         # Script de inicialização
└── README.md            # Esta documentação
```

## Fluxo de Dados

```
Telegram User → Bot (Telegraf) → Paperclip API → Paperclip Operations Agent
                                    ↓
                              Resposta formatada
                                    ↓
Telegram User ← Bot ← Paperclip API
```

## Segurança

- ✅ Apenas `TELEGRAM_CHAT_ID` autorizado pode usar o bot
- ✅ Todas as chamadas API incluem `X-Paperclip-Run-Id` para auditoria
- ✅ Tokens e chaves apenas via variáveis de ambiente
- ✅ Container roda como usuário não-root (Docker)

## Troubleshooting

### Bot não responde
1. Verifique se `TELEGRAM_BOT_TOKEN` está correto
2. Verifique se `TELEGRAM_CHAT_ID` corresponde ao seu chat
3. Veja logs: `docker-compose logs -f` ou output do `npm run dev`

### Erro de conexão Paperclip
1. Verifique `PAPERCLIP_API_URL` (deve ser acessível do bot)
2. Verifique `PAPERCLIP_API_KEY` válido
3. Teste: `/ping` no Telegram

### Agent não encontrado
1. Verifique `PAPERCLIP_AGENT_ID` existe na empresa
2. Verifique `PAPERCLIP_COMPANY_ID` correto
3. O agent deve estar hired e ativo

## Desenvolvimento

### Adicionar novo comando

1. Adicione handler em `telegram-bot.ts`:
```typescript
this.bot.command('meucomando', (ctx) => this.handleMeuComando(ctx));

private async handleMeuComando(ctx: Context): Promise<void> {
  if (!this.isAllowed(ctx)) return;
  // Sua lógica aqui
}
```

2. Adicione método no `PaperclipClient` se precisar de nova API

3. Rebuild: `npm run build`

### Testes

```bash
# Testar cliente Paperclip isolado
node -e "
import { PaperclipClient } from './paperclip-client.js';
const client = new PaperclipClient({...});
console.log(await client.getAgentIdentity());
"
```

## Referências

- [Paperclip API Docs](skills/paperclip/references/api-reference.md)
- [Telegraf Documentation](https://telegraf.js.org/)
- [Paperclip Operations Agent](../README.md)