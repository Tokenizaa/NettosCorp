# Paperclip Operations Agent

Agent para operações gerais do Paperclip via API/MCP: gerencia issues, cria tasks, aprova PRs, monitora runs, faz hiring de agents, e operações gerais do control-plane.

## Visão Geral

| Campo | Valor |
|-------|-------|
| **Nome** | Paperclip Operations |
| **Role** | engineer |
| **Título** | Paperclip Operations Agent |
| **Ícone** | cpu |
| **Adapter** | claude_local (ACP mode) |
| **Modelo** | claude-opus-5-5 |
| **Effort** | high |

## Skills Instaladas

1. **paperclip** - Skill core do Paperclip (heartbeats, API, issues, approvals, tasks, etc.)
2. **paperclip-create-agent** - Para criar/hire novos agents

## Capabilities

- Gerencia lifecycle de issues (criar, atualizar, fechar, checkout, release)
- Cria e delega tasks/subtasks
- Aprova/rejeita PRs via workflows de aprovação
- Monitora runs e heartbeats
- Hire de novos agents via `agent-hires` API
- Configura adapters e runtime settings
- Gerencia skills nos agents
- Interage via MCP com ferramentas do Paperclip

## Estrutura

```
paperclip-operations-agent/
├── AGENTS.md              # Instruções do agent (managed bundle)
├── hire-payload.json      # Payload para API de hire
├── .paperclip.yaml        # Vendor extension para Paperclip
├── hire-agent.sh          # Script para hire via API
└── README.md              # Este arquivo
```

## Como Usar

### 1. Via Script (Recomendado)

```bash
# Configure as variáveis de ambiente
export PAPERCLIP_API_URL="http://localhost:3100"
export PAPERCLIP_API_KEY="sua-api-key-aqui"

# Execute o hire
./hire-agent.sh <company-id>
```

### 2. Via API Direta

```bash
curl -X POST "http://localhost:3100/api/companies/<company-id>/agent-hires" \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d @hire-payload.json
```

### 3. Via Paperclip CLI

```bash
npx paperclipai agent hire \
  --company-id <company-id> \
  --payload-json "$(cat hire-payload.json)"
```

## Variáveis de Ambiente Necessárias

O agent precisa das seguintes variáveis injetadas no runtime:

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `PAPERCLIP_API_URL` | URL base da API do Paperclip | Sim |
| `PAPERCLIP_API_KEY` | API key para autenticação | Sim |
| `PAPERCLIP_COMPANY_ID` | ID da empresa | Sim |
| `PAPERCLIP_AGENT_ID` | ID do próprio agent (injetado pelo runtime) | Auto |
| `PAPERCLIP_RUN_ID` | ID do run atual (injetado pelo runtime) | Auto |

## Permissões

```json
{
  "canCreateAgents": true,
  "canCreateSkills": false,
  "canAssignTasks": true,
  "trustPreset": "standard",
  "authorizationPolicy": "standard"
}
```

## Heartbeat Config

```json
{
  "heartbeat": {
    "enabled": true,
    "intervalSec": 300,
    "wakeOnDemand": true
  },
  "maxConcurrentRuns": 5
}
```

## Aprovação de Hire

Se a empresa exigir aprovação do board (`requireBoardApprovalForNewAgents: true`), o hire criará um approval pendente. O board deve aprovar antes do agent ficar ativo.

```bash
# Verificar status do approval
curl -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  "$PAPERCLIP_API_URL/api/approvals/<approval-id>"

# Após aprovação, o agent será criado automaticamente
```

## Exemplos de Uso do Agent

Uma vez hired e rodando, o agent pode:

```bash
# Listar issues atribuídas
curl -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  "$PAPERCLIP_API_URL/api/agents/me/inbox-lite"

# Criar nova issue
curl -X POST -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  "$PAPERCLIP_API_URL/api/companies/$PAPERCLIP_COMPANY_ID/issues" \
  -d '{"title": "Nova task", "description": "Descrição..."}'

# Checkout de issue
curl -X POST -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  -H "X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID" \
  "$PAPERCLIP_API_URL/api/issues/<issue-id>/checkout" \
  -d '{"agentId": "'$PAPERCLIP_AGENT_ID'"}'

# Hire de novo agent
curl -X POST -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
  "$PAPERCLIP_API_URL/api/companies/$PAPERCLIP_COMPANY_ID/agent-hires" \
  -d @hire-payload.json
```

## Referências

- [Paperclip API Reference](skills/paperclip/references/api-reference.md)
- [Create Agent Skill](skills/paperclip-create-agent/SKILL.md)
- [Agent Companies Spec](https://agentcompanies.io/specification)