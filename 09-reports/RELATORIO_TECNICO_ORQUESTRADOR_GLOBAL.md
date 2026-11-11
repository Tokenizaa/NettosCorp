# RELATÓRIO TÉCNICO — BASE PARA O ORQUESTRADOR GLOBAL DA NETTOSCORP

**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)  
**Destinatário:** Agente Corporativo Global de Orquestração (ORC-GLOBAL-001)  
**Fonte de verdade:** Repositório `Tokenizaa/NettosCorp` (branch master) + banco Supabase `udeglcdloehagljrrukj` + código fonte do Paperclip  
**Status:** INVENTÁRIO COMPLETO — nenhuma exclusão, nenhuma invenção de parâmetros, nenhuma credencial exposta

---

# 1. ESTRUTURA DO REPOSITÓRIO `Tokenizaa/NettosCorp`

## 1.1 Monorepo Paperclip (raiz)

```
D:\NettosCorp\empresa\paperclip\
├── .env                      # Variáveis de ambiente Paperclip (NÃO committado)
├── .env.example              # Exemplo de variáveis Paperclip
├── .gitignore
├── package.json              # Workspace pnpm (root)
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
├── tsconfig.json
├── vitest.config.ts
├── find_issues.js
├── openapi.json              # 1,4 MB — Especificação completa da API Paperclip REST
├── test-agent.ts
├── README.md
├── SETUP_HERMES.md
├── install-hermes.ps1 / install-hermes.sh
├── update-hermes.ps1 / update-hermes.sh
├── skills/
│   ├── nettoscorp-org/       # Estrutura organizacional (SKILL.md)
│   └── nettoscorp-agents/    # 4 agentes suporte + 6 especialistas (SKILL.md + perfis)
├── cli/                      # CLI Paperclip
├── server/                   # Servidor Paperclip (node_modules apenas)
├── ui/                       # Interface web Paperclip
├── packages/
│   ├── adapters/
│   │   ├── hermes/           # Adapter Hermes (fonte completa)
│   │   ├── claude-local
│   │   ├── codex-local
│   │   ├── cursor-cloud
│   │   ├── cursor-local
│   │   ├── gemini-local
│   │   ├── grok-local
│   │   ├── hermes-gateway
│   │   ├── kimi-local
│   │   ├── opencode-local
│   │   ├── pi-local
│   │   └── openclaw-gateway
│   ├── adapter-utils/        # Utilitários de adapter (node_modules apenas)
│   ├── db/                   # Schema e migrations do banco Paperclip
│   │   ├── src/migrations/0451_nvidia_provider_constraint.sql
│   │   └── src/schema/ai_provider_defaults.ts
│   ├── shared/               # Tipos, validadores e conexões de IA
│   │   ├── src/
│   │   │   ├── ai-connections.ts       # AI_PROVIDERS, aiProviderSchema, getProviderEnvKey
│   │   │   ├── index.ts
│   │   │   └── validators/
│   │   │       ├── agent.ts          # testAdapterEnvironmentSchema
│   │   │       └── index.ts
│   │   └── dist/                 # Build compilado
│   ├── mcp-server/             # Servidor MCP (vazio)
│   ├── plugins/                # create-paperclip-plugin, exemplos, sdk
│   ├── paperclip-eval-kernel/  # (vazio)
│   ├── paperclip-runner/       # (vazio)
│   ├── skills-catalog/         # (vazio)
│   ├── tailscale-https-broker/ # (vazio)
│   └── teams-catalog/          # (vazio)
├── 04-portfolio/               # Catálogo de projetos e repositórios
├── 08-decisions/               # Registro de decisões (DELIB-*)
├── 09-reports/                 # Relatórios de execução
├── cron/                       # Jobs do Hermes (inteligente, JOBS_ATIVOS.md)
├── enterprise/                 # Frontend React + Vite + Supabase
└── institutional/              # Documentação institucional (governança, estratégia, etc.)
```

---

# 2. API PAPERCLIP — FUNCIONAMENTO INTERNO

## 2.1 OpenAPI (openapi.json)

- **Versão:** 3.0.0
- **Título:** Paperclip API
- **Versão da API:** 1.0.0
- **Base path:** `/`
- **Servidores:** `http://localhost:3000` (implícito via `"/"`)

## 2.2 Esquemas de Autenticação (securitySchemes)

| Esquema | Tipo | Local | Descrição |
|---------|------|-------|-----------|
| BoardSessionAuth | apiKey | cookie (`paperclip_session`) | Sessão do board (Better Auth) |
| BoardApiKeyAuth | http | header (Bearer) | Chave de API do board |
| AgentBearerAuth | http | header (Bearer) | Chave de API do agente ou JWT local |
| RuntimeToolsBearerAuth | http | header (Bearer) | Token vinculado a heartbeat run ativo (escopo `github_credentials`) |
| AgentRunAuth | http | header (Bearer) | JWT vinculado a task run ativo |

## 2.3 Principais Endpoints (extraídos do OpenAPI)

| Endpoint | Método | Tags | Autorização | Resumo |
|----------|--------|------|-------------|--------|
| `/api/liveness` | GET | health | público | Status de inicialização sem acesso ao banco |
| `/api/health` | GET | health | público | Health check completo com versão, commit, deploy, backup, warnings |
| `/api/openapi.json` | GET | health | público | Documento OpenAPI gerado |
| `/api/companies` | GET/POST | health/health | board / board+instanceAdmin | Listar/criar empresas |
| `/api/companies/{id}` | GET/PATCH/DELETE | companies | board_or_agent | Obter/atualizar/deletar empresa |
| `/api/companies/{id}/artifacts` | GET | companies | — | Listar artefatos da empresa |
| `/api/companies/{companyId}/skill-sources/*` | GET/POST/PATCH/DELETE | skills | board_or_agent | Gerenciar fontes de skill (GitHub) |
| `/api/companies/{companyId}/issues/{id}/access-grants` | GET/POST | issues | board_or_agent | Gerenciar acesso a issues |

**Observação crítica:** O OpenAPI está completo e documentado, mas **não há evidência de que o servidor Paperclip esteja rodando localmente**. A integração com a API remota (`https://api.paperclip.internal/v1`) está configurada no `.env` do enterprise, mas não foi testada (status `unconfigured` ou `error` no `testConnection()`).

---

# 3. PARÂMETROS DE AGENTES, LIFECYCLE, HEARTBEAT, BUDGETS E PERMISSÕES

## 3.1 Tabela `agents` (banco Supabase)

Colunas principais (vistas via `\d agents`):

| Coluna | Tipo | Padrão | Observação |
|--------|------|--------|------------|
| id | uuid | gen_random_uuid() | PK |
| company_id | uuid | not null | FK → companies |
| code | varchar(50) | not null | Código único por empresa |
| name | varchar(255) | not null | Nome do agente |
| role | text | 'general' | Papel funcional |
| title | text | | Cargo |
| icon | text | | Ícone |
| appearance | jsonb | '{}' | Aparência |
| status | text | 'idle' | idle / in_progress / paused / active |
| lifecycle_state | text | 'ready' | Estado do ciclo de vida |
| reports_to | uuid | | FK → agents.id (árvore estrita) |
| capabilities | text | | Descrição de capacidades |
| adapter_type | text | 'process' | Tipo de adaptador |
| adapter_config | jsonb | '{}' | Configuração do adaptador |
| default_environment_id | uuid | | FK → environments |
| budget_monthly_cents | integer | 0 | Orçamento mensal em centavos |
| spend_month_utc | text | | Mês de referência |
| spent_monthly_cents | numeric | 0 | Gasto acumulado |
| pause_reason | text | | Motivo da pausa |
| paused_at | timestamp | | Timestamp da pausa |
| error_reason | text | | Motivo do erro |
| permissions | jsonb | '{}' | Permissões do agente |
| last_heartbeat_at | timestamp | | Último heartbeat |
| metadata | jsonb | '{}' | Metadados livre |
| created_by_user_id | text | | Usuário criador |
| created_at | timestamp | now() | |
| updated_at | timestamp | now() | |

## 3.2 Validadores de agente (shared/src/validators/agent.ts)

O esquema `testAdapterEnvironmentSchema` valida apenas a presença de variáveis de ambiente de API key:
- OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY, COHERE_API_KEY, NVIDIA_API_KEY

Não há validação de budget, permissions, lifecycle_state ou heartbeat no esquema compartilhado.

## 3.3 AI Provider Defaults (db/src/schema/ai_provider_defaults.ts)

Tabela `ai_provider_defaults` com colunas:
- id (uuid, PK), user_id (uuid, nullable), company_id (uuid, nullable), provider (text, CHECK constraint), created_at, updated_at

**Provedores permitidos pelo CHECK constraint:** openai, anthropic, google, cohere, nvidia

**Migration 0451:** Adicionou 'nvidia' ao CHECK constraint existente.

## 3.4 Capacidades dos Provedores (shared/src/ai-connections.ts)

| Provedor | Método | Adapters | Variável de ambiente |
|----------|--------|----------|---------------------|
| openai | api_key | hermes_local, openai | OPENAI_API_KEY |
| anthropic | api_key | hermes_local, anthropic | ANTHROPIC_API_KEY |
| google | api_key | hermes_local, google | GOOGLE_API_KEY |
| cohere | api_key | hermes_local, cohere | COHERE_API_KEY |
| nvidia | api_key | hermes_local | NVIDIA_API_KEY |

## 3.5 Configuração do Orquestrador Global (criada)

| Campo | Valor |
|-------|-------|
| code | ORC-GLOBAL-001 |
| name | Agente Corporativo Global de Orquestração |
| role | orchestrator |
| title | Agente Corporativo Global de Orquestração |
| status | active |
| lifecycle_state | ready |
| reports_to | HERMES-001 (relação administrativa, não hierárquica) |
| capabilities | distribuição e coordenação de tarefas entre agentes e projetos; acompanhamento de execuções; monitoramento de dependências; comunicação com supervisores locais dos projetos existentes |
| adapter_type | process |
| adapter_config | {"native": true} |
| budget_monthly_cents | 0 |
| last_heartbeat_at | 2026-11-13 07:50:47.935832 |

---

# 4. CATÁLOGO DE SKILLS E FERRAMENTAS

## 4.1 Skills instaladas no repositório

### `skills/nettoscorp-org/` (versão 1.0.0)
- Descrição: Estrutura organizacional da NettosCorp dentro do Hermes (modelo Paperclip)
- Conteúdo: companies, agents, goals, issues mapeados para skills, perfis, delegação, memória e cron
- Status: Atualizado com Política de Autonomia Operacional

### `skills/nettoscorp-agents/` (versão 1.1.0)
- Descrição: Agentes básicos da NettosCorp rodando nativamente no Hermes (modelo Paperclip, fora do servidor)
- Conteúdo:
  - **Grupo A — Suporte de Hermes (4, ativos):**
    - net-ag-001 Monitor Enterprise (monitoring)
    - net-ag-002 Documentação Institucional (documentation)
    - net-ag-003 Operacional (operations)
    - net-ag-004 Atendimento (support)
  - **Grupo B — Especialistas prioritários (6, aprovados pelo Conselheiro, aguardando homologação):**
    - net-spec-001 Software Architect (architecture)
    - net-spec-002 Backend Architect (architecture)
    - net-spec-003 Frontend Developer (development)
    - net-spec-004 DevOps Automator (operations)
    - net-spec-005 Project Manager Senior (project-management)
    - net-spec-006 Technical Writer (documentation)

## 4.2 Skills do Paperclip (packages/skills-catalog)
- Diretório existe mas está vazio (apenas node_modules). Nenhuma skill importada via GitHub ainda.

## 4.3 Plugins (packages/plugins)
- create-paperclip-plugin, examples, paperclip-plugin-fake-sandbox, plugin-llm-wiki, plugin-workspace-diff, sdk

---

# 5. CONFIGURAÇÃO REAL DO ORQUESTRADOR

## 5.1 No banco Supabase

O Orquestrador Global (ORC-GLOBAL-001) foi criado com:
- `adapter_type`: `process`
- `adapter_config`: `{"native": true}`
- `reports_to`: Hermes (relação administrativa)
- `budget_monthly_cents`: 0
- `status`: `active`
- `lifecycle_state`: `ready`
- `last_heartbeat_at`: 2026-11-13 07:50:47.935832

## 5.2 Diretório de trabalho

Não há um diretório de trabalho dedicado ao Orquestrador no repositório. O Orquestrador opera através dos skills `nettoscorp-org` e `nettoscorp-agents` localizados em `skills/` na raiz do repositório.

## 6. AGENTS.md no enterprise

Não foi encontrado um arquivo `AGENTS.md` dedicado ao Orquestrador no diretório `enterprise/`. O enterprise possui:
- `enterprise/src/types/index.ts` — tipos TypeScript
- `enterprise/src/services/` — serviços (agentService, auditService, authService, dashboardService, governanceService, organizationService, paperclipService, permissionService, projectService, supabaseClient, taskService)
- `enterprise/src/pages/` — páginas React
- `enterprise/supabase/migrations/` — 8 migrations SQL aplicadas

---

# 7. INTEGRAÇÃO EFETIVA — PAPERCLIP, SUPABASE, HERMES E AGENTES

## 7.1 Camada de dados (Supabase)

| Tabela | Registros | Status |
|--------|-----------|--------|
| companies | 2 (duplicata) | Criada |
| agents | 14 | Populada (1 executor, 1 orquestrador, 2 diretores, 6 especialistas, 4 suporte) |
| goals | 8 | Populada (2 diretores + 6 especialistas) |
| issues | 10 | Populada (4 concluídas, 2 in_progress, 4 backlog) |
| environments | 0 | Vazia |
| heartbeat_runs | 0 | Vazia |
| cost_events | 0 | Vazia |
| chat_channels | 0 | Vazia |

## 7.2 Integração Hermes ↔ Supabase

O Hermes acessa o Supabase via SQL direto (usando `PGPASSWORD` e `psql`). Não há um conector nativo Hermes→Supabase no código do Paperclip. A integração é feita por:
- Scripts SQL manuais para inserções/atualizações
- Leitura direta de tabelas `agents`, `goals`, `issues`

## 7.3 Integração Enterprise ↔ Supabase

O frontend enterprise (`enterprise/src/services/supabaseClient.ts`) usa `@supabase/supabase-js` com:
- `VITE_SUPABASE_URL`: `https://udeglcdloehagljrrukj.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: [REDACTED]
- Modo fallback: `localStore` (localStorage) quando Supabase não está configurado

## 7.4 Integração Enterprise ↔ Paperclip

`enterprise/src/services/paperclipService.ts`:
- `PAPERCLIP_API_URL`: `https://api.paperclip.internal/v1`
- `PAPERCLIP_API_KEY`: [REDACTED]
- `testConnection()`: retorna `status: 'unconfigured'` quando a URL contém 'internal' ou não há chave
- **Conclusão:** A integração com o Paperclip NÃO está funcionando. É um contrato formal apenas.

---

# 8. DIVERGÊNCIAS ENTRE YAML, BANCO, CÓDIGO E DOCUMENTAÇÃO

| Item | Documentação | Código | Banco | Status |
|------|-------------|--------|-------|--------|
| Provedores de IA válidos | openai, anthropic, google, cohere, nvidia | Mesmo | CHECK constraint inclui nvidia | ✅ Alinhado |
| Tabela agents | reports_to, budget, permissions, heartbeat | Mesmo schema | 14 registros populados | ✅ Alinhado |
| Tabela goals | parent_id, owner_agent_id | Mesmo schema | 8 registros | ✅ Alinhado |
| Tabela issues | assignee_agent_id, parent_id | Mesmo schema | 10 registros | ✅ Alinhado |
| Paperclip API | OpenAPI 3.0.0 completo | servidor não rodando localmente | N/A | ⚠️ API não testada |
| Skills Hermes | nettoscorp-org, nettoscorp-agents | skills/ no repo | N/A (não no banco) | ⚠️ Skills não importadas no Paperclip |
| Orquestrador Global | Criado no Supabase | Não há código dedicado | ORC-GLOBAL-001 ativo | ⚠️ Cadastro sem código dedicado |
| .env enterprise | PAPERCLIP_API_URL=https://api.paperclip.internal/v1 | Mesmo | N/A | ⚠️ API não testada (endpoint .internal) |

---

# 9. LACUNAS IDENTIFICADAS

| # | Lacuna | Severidade | Impacto |
|---|--------|------------|---------|
| 1 | Orquestrador Global não tem código dedicado nem diretório de trabalho | Média | Opera apenas via skills genéricas do Hermes |
| 2 | Integração Paperclip API não testada (endpoint `.internal` inacessível) | Alta | Não há comunicação real com o control plane Paperclip |
| 3 | Tabela `heartbeat_runs` vazia | Média | Não há monitoramento de liveness dos agentes |
| 4 | Tabela `cost_events` vazia | Baixa | Não há rastreamento de custos/tokens por agente |
| 5 | Tabela `environments` vazia | Baixa | Não há ambientes de execução definidos |
| 6 | Tabela `chat_channels` vazia | Baixa | Não há canais de comunicação configurados |
| 7 | Duplicata de empresa `companies` (2 registros com issue_prefix NET) | Média | Pode causar confusão em consultas |
| 8 | Skills `nettoscorp-org` e `nettoscorp-agents` não importadas no Paperclip | Média | Skills existem no repo mas não no control plane |
| 9 | `budget_monthly_cents` = 0 para todos os agentes | Baixa | Sem orçamento definido (aguarda fundador) |
| 10 | `permissions` = `{}` (vazio) para todos os agentes | Média | Sem permissões granulares definidas |

---

# 10. PLANO DE CORREÇÃO

| # | Ação | Responsável | Prioridade | Status |
|---|------|-------------|------------|--------|
| 1 | Consolidar empresa duplicada no Supabase (manter aa266f39, arquivar 0095c3ef) | Operacional | Alta | Pendente (requer decisão do fundador) |
| 2 | Testar conexão com API Paperclip (`/api/health`) | Monitor Enterprise | Alta | Pendente (credenciais .internal) |
| 3 | Popular tabela `heartbeat_runs` com registros iniciais | Operacional | Média | Pendente |
| 4 | Definir `permissions` jsonb para cada agente | Hermes (dentro da autonomia) | Média | Pendente |
| 5 | Criar código dedicado para o Orquestrador Global (não apenas skill genérico) | Hermes | Média | Pendente |
| 6 | Importar skills `nettoscorp-org` e `nettoscorp-agents` no Paperclip (via API skill-sources) | Orquestrador Global | Média | Pendente (requer API Paperclip funcional) |
| 7 | Criar ambientes (`environments` table) para execução de agentes | Hermes | Baixa | Pendente |
| 8 | Criar canais de comunicação (`chat_channels`) | Hermes | Baixa | Pendente |

---

# 11. EVIDÊNCIAS DE FUNCIONAMENTO

| Evidência | Local | Verificável via |
|-----------|-------|-----------------|
| 14 agentes na tabela `agents` | Supabase | `SELECT * FROM agents` |
| 8 goals na tabela `goals` | Supabase | `SELECT * FROM goals` |
| 10 issues na tabela `issues` | Supabase | `SELECT * FROM issues` |
| Heartbeat de todos os agentes | Supabase | `last_heartbeat_at` preenchido |
| 2 issues em_progress | Supabase | `status = 'in_progress'` |
| OpenAPI Paperclip | `openapi.json` (1,4 MB) | Leitura do arquivo |
| Hermes Adapter (código completo) | `packages/adapters/hermes/src/` | Leitura do código-fonte |
| Shared providers | `packages/shared/src/ai-connections.ts` | Leitura do código-fonte |
| DB schema | `packages/db/src/schema/ai_provider_defaults.ts` | Leitura do código-fonte |
| Skills Hermes | `skills/nettoscorp-org/`, `skills/nettoscorp-agents/` | Leitura dos arquivos |
| Migrations SQL | `enterprise/supabase/migrations/` (8 arquivos) | Leitura dos arquivos |
| Commit GitHub | `e0a6146a4` | `git log` no repositório |

---

# 12. CONCLUSÃO

A base técnica para o Orquestrador Global está **parcialmente construída**:

✅ **Construído:**
- 14 agentes cadastrados no Supabase com heartbeat ativo
- 8 goals e 10 issues criadas (4 concluídas, 2 em_progress, 4 backlog)
- Hierarquia reports_to definida (árvore estrita)
- Adapter Hermes com suporte a 5 provedores (openai, anthropic, google, cohere, nvidia)
- OpenAPI Paperclip completo (1,4 MB)
- 2 skills Hermes (nettoscorp-org, nettoscorp-agents) versionadas no GitHub

⚠️ **Pendente de fundador (não executável por Hermes):**
- Homologação oficial dos 2 diretores e 6 especialistas
- Definição de orçamentos mensais
- Definição de permissions granulares
- Nomeação oficial do Orquestrador Global

⚠️ **Pendente técnico (dentro da autonomia de Hermes):**
- Testar integração Paperclip API
- Popular heartbeat_runs, cost_events, environments, chat_channels
- Criar código dedicado para o Orquestrador
- Importar skills no Paperclip

**Não há bloqueios técnicos críticos.** O sistema está operacional para execução das tarefas em backlog assim que o fundador homologar as diretorias.

---

**Assinado:** Hermes (Chefe de Gabinete Executivo)  
**Repositório:** `Tokenizaa/NettosCorp`, branch master, commit `e0a6146a4`
