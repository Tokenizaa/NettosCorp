# ESTUDO TECNOLOGICO — PAPERCLIP — NETTOSCORP

Versao: 1.0
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/05-technology/paperclip/PAPERCLIP_TECNOLOGIA.md
Fonte: /home/lg/workspace/NettosCorp/paperclip/
Status: REGISTRO TECNOLOGICO — evidencia coletada, sem alteracao de codigo

---

## 1. Visao geral tecnologica

O Paperclip e um **control plane para empresas autônomas de IA**. E uma aplicacao monolítica (monorepo) com backend REST, UI React, banco de dados PostgreSQL, e sistema de adaptadores para execucao de agentes externos.

---

## 2. Stack tecnologica

| Camada | Tecnologia |
|--------|------------|
| Backend | Node.js + TypeScript, Express REST API |
| Frontend | React + Vite |
| Banco de dados | PostgreSQL via Drizzle ORM (com embedded PgLite fallback para dev) |
| ORM | Drizzle ORM |
| Migracoes | SQL via Drizzle (`pnpm db:generate`) |
| Testes | Vitest, Playwright (E2E) |
| Gerenciador de pacotes | pnpm (monorepo com workspaces) |
| Linguagem | TypeScript |

---

## 3. Estrutura do monorepo

| Pacote | Descricao |
|--------|-----------|
| `server/` | Express REST API e servicos de orquestracao |
| `ui/` | Interface React do board operator |
| `packages/db/` | Schema Drizzle, miscoes, clientes de banco |
| `packages/shared/` | Tipos, constantes, validadores, constantes de caminho da API |
| `packages/adapters/` | Implementacoes de adaptadores de agente (Claude, Codex, Cursor, etc.) |
| `packages/adapter-utils/` | Utilitarios compartilhados de adaptador |
| `packages/plugins/` | Pacotes do sistema de plugins |
| `packages/skills-catalog/` | Catalogo de skills embarcado no app |
| `packages/teams-catalog/` | Catalogo de equipes embarcado no app |
| `cli/` | CLI `paperclipai` (binario publicado, comandos voltados a agentes) |
| `skills/` | Skills operacionais do runtime Paperclip |
| `doc/` | Documentacao operacional e de produto |

---

## 4. Schemas de dados relevantes

### 4.1 Companies (`companies.ts`)

Empresa e entidade de primeiro escalao. Multi-company em uma instancia.

Campos principais: `id`, `name`, `description`, `status`, `budgetMonthlyCents`, `spentMonthlyCents`, `requireBoardApprovalForNewAgents`, `issuePrefix`, `issueCounter`, `defaultResponsibleUserId`.

### 4.2 Agents (`agents.ts`)

```sql
agents (
  id UUID PK,
  companyId UUID FK,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'general',
  title TEXT,
  icon TEXT,
  appearance JSONB,
  status TEXT DEFAULT 'idle',
  lifecycleState TEXT DEFAULT 'ready',
  reportsTo UUID FK -> agents.id,      -- hierarquia
  capabilities TEXT,
  adapterType TEXT DEFAULT 'process',
  adapterConfig JSONB DEFAULT {},
  runtimeConfig JSONB DEFAULT {},
  defaultEnvironmentId UUID FK -> environments,
  budgetMonthlyCents INTEGER DEFAULT 0,
  spentMonthlyCents NUMERIC DEFAULT 0,
  pauseReason TEXT,
  permissions JSONB DEFAULT {},
  lastHeartbeatAt TIMESTAMP,
  metadata JSONB,
  createdByUserId TEXT,
  createdAt, updatedAt
)
```

### 4.3 Goals (`goals.ts`)

Hierarquia de objetivos vinculada à empresa.

### 4.4 Issues / Tarefas (`issues.ts`)

```sql
issues (
  id UUID PK,
  companyId UUID FK,
  projectId UUID FK -> projects,
  goalId UUID FK -> goals,
  parentId UUID FK -> issues.id,       -- hierarquia de tarefas
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'backlog',
  priority TEXT DEFAULT 'medium',
  assigneeAgentId UUID FK -> agents.id, -- single assignee
  checkoutRunId UUID FK -> heartbeatRuns,
  executionRunId UUID FK -> heartbeatRuns,
  monitorNextCheckAt TIMESTAMP,
  ...
)
```

### 4.5 Outras tabelas relevantes

- `agent_config_revisions` — historico de versoes de configuracao
- `agent_identity_keys` — chaves Ed25519 por agente
- `cost_events` — eventos de custo
- `heartbeat_runs` — registros de execucao de heartbeat
- `routines` — tarefas recorrentes
- `company_skills`, `company_skill_sources` — skills da empresa
- `workflows` — definicoes reutilizaveis de fluxo
- `cases` — casos com handoffs entre agentes
- `approvals` — fluxos de aprovacao

---

## 5. Ciclo de vida do agente

| Estado | Proximo |
|--------|---------|
| pending_approval | preparing ou rejected |
| preparing | verifying |
| verifying | ready |
| ready | pausing ou terminating |
| pausing | paused |
| paused | resuming ou terminating |
| resuming | estado salvo antes da pausa |
| terminating | cleaning_up |
| cleaning_up | terminated |
| terminated | (final) |
| rejected | (final) |

---

## 6. Adaptadores de execucao

| Tipo | Descricao |
|------|-----------|
| process | Processo local (inicia/resume sessoes de ferramentas de codificacao) |
| http | HTTP/webhook para agentes externos |
| local CLI/session | Claude Code, Codex, Gemini, OpenCode, Pi, Cursor |
| OpenClaw gateway | Integracao para agentes remotos OpenClaw |
| External plugins | Adaptadores carregados dinamicamente via plugin |

---

## 7. Heartbeats

- Cada agente reporta heartbeat periodicamente
- `lastHeartbeatAt` indica ultima atividade
- `monitorNextCheckAt` para proxima verificacao automatica
- Heartbeat pode ser cancelado
- `heartbeat_runs` tabela armazena registros de execucao

---

## 8. Orcamentos

- `budgetMonthlyCents` por agente e por empresa
- `spentMonthlyCents` gasto acumulado
- `spendMonthUtc` mes de referencia
- Periodo: janela de calendario mensal UTC
- Aplicacao: best-effort admission, alertas suaves, auto-pausa em limite

---

## 9. YAML de configuracao do agente

Tab "Advanced" edita configuracao como YAML versionado (`apiVersion: paperclip/v1`, `kind: Agent`):

```yaml
spec:
  name: Codie
  role: engineer
  adapterType: codex_local
  adapterConfig:
    model: gpt-5
    cwd: /workspace/project
  runtimeConfig:
    heartbeat:
      enabled: true
      intervalSec: 3600
  budgetMonthlyCents: 10000
  instructions:
    mode: managed
    entryFile: AGENTS.md
  skills:
    - paperclip
  tools:
    profiles:
      - profileKey: engineering
```

---

## 10. APIs e extensão

### 10.1 API REST

Base path `/api`. Endpoints para companies, agents, goals, issues, approvals, costs, etc. Agentes usam bearer API keys (hashed em repouso).

### 10.2 Plugin framework

Plugin runtime local/self-hosted em V1. Cloud marketplace fora do escopo.

### 10.3 Sidecar vendor-specific

`.paperclip.yaml` para configuracao especifica do Paperclip (adapter config, runtime config, env inputs, permissoes, orcamentos, triggers de rotina).

---

## 11. Modo de operacao

| Modo | Descricao |
|------|-----------|
| `local_trusted` | Padrao local, board implicito sem login |
| `authenticated` | Login requerido, sessoes, exposicao privada/publica |

---

## 12. Limitacoes da implementacao

| Limite | Descricao |
|--------|-----------|
| Nao e chat geral | Tasks + comments apenas |
| Nao substitui Jira/GitHub completo | Focado em orquestracao organizacional |
| RBAC granular empresarial fora do escopo V1 | Fine-grained governance secundario |
| Nao ha tabela de departamentos | Organizacao via reports_to, role, capabilities |
| Plugin marketplace publico fora do escopo V1 | Apenas runtime local |
| Knowledge base fora do escopo V1 | Nao ha base de conhecimento nativa |
| Multi-board fora do escopo V1 | Apenas um board operator por deployment |
| Auto-healing fora do escopo V1 | Nao ha auto-reassign/retry planners |

---

## 13. Avaliacao para NettosCorp

O Paperclip e o **control plane organizacional** que a NettosCorp precisa para construir uma empresa de agentes de IA. Fornece empresa, organograma, tarefas, orcamentos, heartbeats, aprovacoes e auditoria. Pode ser integrado com o Agency Agents (como fonte de conteudo de instrucao para agentes especialistas).

---

## 14. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/05-technology/paperclip/PAPERCLIP_TECNOLOGIA.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/05-technology/paperclip/PAPERCLIP_TECNOLOGIA.md")

---

Nenhum codigo do Paperclip foi alterado. Nenhuma instalacao foi executada.