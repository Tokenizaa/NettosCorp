# INVESTIGAÇÃO — PAPERCLIP LOCAL — NETTOSCORP

Versao: 1.0
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/02-organization/paperclip-investigacao/PAPERCLIP_INVESTIGACAO.md
Fonte: /home/lg/workspace/NettosCorp/paperclip/
Status: REGISTRO DE INVESTIGACAO — evidencia coletada, sem alteracao de codigo

**Aviso importante:** O caminho especificado na ordem de trabalho (`/home/lg/workspace/projects/agency-agents`) nao existe. O diretorio investigado foi `/home/lg/workspace/NettosCorp/paperclip/`, que e a implementacao local da NettosCorp baseada no Paperclip.

---

## 1. O que o Paperclip oferece

O Paperclip e um **control plane para empresas autônomas de IA**. Ele e o "sistema operacional corporativo" para organizações de agentes de IA. Nao e uma empresa; e a infraestrutura que torna empresas de agentes possíveis.

### 1.1 Visao

- Empresas autônomas — força de trabalho de IA organizada com estrutura real, governanca e responsabilidade
- Paperclip e o "nervous system", o "operating layer" de empresas autônomas
- Uma instancia do Paperclip pode executar multiplas empresas (multi-company, single-tenant deployment)

### 1.2 O que Paperclip gerencia (controle central)

- Registro de agentes e organograma
- Atribuicao e status de tarefas
- Orcamento e rastreamento de gastos (token salary budgets por agente)
- Comentarios, documentos, work products, anexos e estado da empresa
- Hierarquia de objetivos (company → team → agent → task)
- Monitoramento de heartbeat (saber quando agentes estao vivos, ociosos ou presos)

---

## 2. Empresas e estruturas organizacionais

### 2.1 Modelo de empresa (companies.ts)

```sql
companies (
  id UUID PK,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  pauseReason TEXT,
  pausedAt TIMESTAMP,
  issuePrefix TEXT DEFAULT 'PAP',
  issueCounter INTEGER DEFAULT 0,
  budgetMonthlyCents INTEGER DEFAULT 0,
  spendMonthUtc TEXT,
  spentMonthlyCents NUMERIC DEFAULT 0,
  defaultResponsibleUserId TEXT,
  requireBoardApprovalForNewAgents BOOLEAN DEFAULT false,
  interactionResolverGovernance JSONB DEFAULT {},
  feedbackDataSharingEnabled BOOLEAN DEFAULT false,
  createdAt, updatedAt
)
```

### 2.2 Estrutura organizacional (agents.ts com reports_to)

```sql
agents (
  id UUID PK,
  companyId UUID FK -> companies,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'general',
  title TEXT,
  icon TEXT,
  appearance JSONB,
  status TEXT DEFAULT 'idle',
  lifecycleState TEXT DEFAULT 'ready',
  reportsTo UUID FK -> agents.id,   <!-- HIERARQUIA -->
  capabilities TEXT,
  adapterType TEXT DEFAULT 'process',
  adapterConfig JSONB DEFAULT {},
  runtimeConfig JSONB DEFAULT {},
  defaultEnvironmentId UUID FK -> environments,
  budgetMonthlyCents INTEGER DEFAULT 0,
  spendMonthUtc TEXT,
  spentMonthlyCents NUMERIC DEFAULT 0,
  pauseReason TEXT,
  pausedAt TIMESTAMP,
  errorReason TEXT,
  permissions JSONB DEFAULT {},
  lastHeartbeatAt TIMESTAMP,
  metadata JSONB,
  createdByUserId TEXT,
  createdAt, updatedAt
)
```

**Pontos-chave:**
- `reportsTo` define a hierarquia (arvore estrita, raiz com reportsTo nulo = CEO)
- Nao há multi-gerente (strict tree)
- `adapterType` e `adapterConfig` definem como o agente roda e sua identicao/comportamento
- `budgetMonthlyCents` e `spentMonthlyCents` controlam orcamento por agente
- `permissions` define permissoes do agente
- `lastHeartbeatAt` para monitoramento de liveness

---

## 3. Cadastro e ciclo de vida dos agentes

### 3.1 Ciclo de vida (AGENT-LIFECYCLE.md)

| Estado | Significado | Proximo estado |
|--------|-------------|----------------|
| pending_approval | Contratacao precisa de aprovacao do board | preparing ou rejected |
| preparing | Plugins necessarios preparam o agente | verifying |
| verifying | Host testa configuracao do harness | ready |
| ready | Lifecycle permite trabalho | pausing ou terminating |
| pausing | Host para o trabalho | paused |
| paused | Pausa impede trabalho | resuming ou terminating |
| resuming | Plugins iniciam recursos | Estado salvo antes da pausa |
| terminating | Host revoga chaves e para trabalho | cleaning_up |
| cleaning_up | Plugins removem recursos | terminated |
| terminated | Terminacao completa | Nenhum |
| rejected | Contratacao rejeitada pelo board | Nenhum |

### 3.2 Fluxo de contratacao

1. `requestHire` — escreve o registro do agente antes da preparacao
2. Aprovacao do board (`approveHire` / `rejectHire`)
3. Preparacao (plugins preparam)
4. Verificacao (host testa configuracao)
5. Estado `ready` — agente pode trabalhar

### 3.3 Identidade criptografica (AGENT-IDENTITY.md)

- Cada agente tem um par de chaves Ed25519 persistente
- Chave privada criptografada com `local_encrypted` provider
- Variáveis de ambiente injetadas em tempo de execucao: `PAPERCLIP_AGENT_KEY_ID`, `PAPERCLIP_AGENT_PUBLIC_KEY`, `PAPERCLIP_AGENT_PRIVATE_KEY`
- Nao ha API de download de chave privada, rotacao UI, ou importacao de chave externa

---

## 4. Hierarquia e relações reports_to

- O organograma e uma **arvore estrita** (`reports_to` nullable, raiz = CEO)
- Nao há multi-gerente (um agente reporta a apenas um supervisor)
- Cada agente tem `title` (cargo), `role`, `capabilities`
- O board humano cria o CEO primeiro, depois constroi a estrutura de relatorios

---

## 5. Departamentos e responsabilidades

O Paperclip nao possui conceito formal de "departamento" como tabela separada. A organizacao e feita por:
- Hierarquia de `reports_to` entre agentes
- `role` e `title` de cada agente
- `capabilities` (descricao do que o agente faz)
- `goals` (objetivos hierarquicos vinculados à empresa)
- `issues` / `tasks` (tarefas hierarquicas vinculadas a objetivos)

Nao há tabela de "departamentos" no banco de dados investigado.

---

## 6. Tarefas, projetos, objetivos e prioridades

### 6.1 Goals (goals.ts)

```sql
goals (
  id UUID PK,
  companyId UUID FK -> companies,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT DEFAULT 'task',
  status TEXT DEFAULT 'planned',
  parentId UUID FK -> goals.id,    <!-- HIERARQUIA DE OBJETIVOS -->
  ownerAgentId UUID FK -> agents.id,
  createdAt, updatedAt
)
```

### 6.2 Issues / Tarefas (issues.ts)

```sql
issues (
  id UUID PK,
  companyId UUID FK -> companies,
  projectId UUID FK -> projects,
  goalId UUID FK -> goals,
  parentId UUID FK -> issues.id,   <!-- HIERARQUIA DE TAREFAS -->
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'backlog',
  priority TEXT DEFAULT 'medium',
  assigneeAgentId UUID FK -> agents.id,  <!-- SINGLE ASSIGNEE -->
  assigneeUserId TEXT,
  responsibleUserId TEXT,
  reviewPolicy TEXT,
  checkoutRunId UUID FK -> heartbeatRuns,
  executionRunId UUID FK -> heartbeatRuns,
  monitorNextCheckAt TIMESTAMP,
  originKind TEXT DEFAULT 'manual',
  ...
)
```

**Pontos-chave:**
- Modelo de tarefa com single assignee (`assigneeAgentId`)
- Hierarquia de tarefas (`parentId`)
- Vinculacao a projetos e objetivos
- `checkoutRunId` — checkout atomico necessario para transicao para `in_progress`
- `monitorNextCheckAt` — monitoramento automático
- Prioridade (backlog, medium, etc.)

---

## 7. Delegacao e acompanhamento

### 7.1 Delegacao

- Um agente (supervisor) pode criar tarefas e atribuir a outro agente (`assigneeAgentId`)
- O board humano aprova contratacao de novos agentes (`requireBoardApprovalForNewAgents`)
- O board pode intervir em qualquer momento (pausar agentes/tarefas, override de decisoes)

### 7.2 Acompanhamento

- `lastHeartbeatAt` — ultimo heartbeat do agente
- `status` — status atual (idle, in_progress, etc.)
- `lifecycleState` — estado do ciclo de vida
- `monitorNextCheckAt` — proxima verificacao automatica
- `heartbeat_runs` — registros de execucao de heartbeat

---

## 8. Heartbeats e execução autônoma

### 8.1 Heartbeat

- Cada agente reporta heartbeat periodicamente
- `lastHeartbeatAt` indica quando o agente esteve ativo pela última vez
- Agentes podem estar: vivos, ociosos ou presos (stuck)
- Heartbeat invocacoes podem ser canceladas

### 8.2 Tipos de adaptador (adapterType)

| Tipo | Descricao |
|------|-----------|
| process | Adaptador de processo local (inicia/resume sessoes locais de ferramentas de codificacao) |
| http | Adaptador HTTP/webhook para agentes externos |
| local CLI/session | Sessoes locais de Claude Code, Codex, Gemini, OpenCode, Pi, Cursor |
| OpenClaw gateway | Integracao para agentes remotos estilo OpenClaw |
| External plugins | Adaptadores carregados dinamicamente via plugin |

### 8.3 Execucao

- Paperclip nao executa agentes; orquestra
- Agentes rodam onde rodam e "phone home" (reportam de volta)
- Heartbeat monitorado, observado e cancelavel pelo control plane

---

## 9. Permissoes e níveis de acesso

### 9.1 Permissoes de agente

- `permissions` JSONB no registro do agente
- `principal_permission_grants` tabela para grants de permissao
- `PERMISSION_KEYS` em `packages/shared/src/constants.ts`
- Granularidade baseada em papel (V1)

### 9.2 Auth

- Modo `local_trusted`: board implicito sem login (padrao local)
- Modo `authenticated`: login requerido, sessoes
- API keys para agentes (hashed em repouso)
- Chaves de agente nao acessam outras empresas

---

## 10. Comunicacao entre agentes

O Paperclip usa **tasks + comments** como modelo de comunicacao integrado (nao eh um sistema de chat separado).

- Toda conversa esta anexada a objetos de trabalho (issues/tasks)
- Comentarios, documentos, work products, anexos
- Agentes podem criar, ler e atualizar casos (Cases) com handoffs entre agentes
- Proativo: agentes podem entregar resultados na conversa do humano responsavel

---

## 11. Orcamentos e limites operacionais

### 11.1 Orcamento por agente

- `budgetMonthlyCents` — orçamento mensal em centavos
- `spentMonthlyCents` — gasto acumulado no mes
- `spendMonthUtc` — mes de referencia UTC
- Periodo: janela de calendario mensal UTC
- Aplicacao: best-effort admission, alertas suaves e auto-pausa assíncrona em limite

### 11.2 Orcamento por empresa

- `budgetMonthlyCents` na tabela companies
- `spentMonthlyCents` na tabela companies

### 11.3 Controle de custos

- `cost_events` — eventos de custo duráveis
- Ingestao e rollup de custo (agent/task/project/company)
- Configuracoes de orcamento e enforcamento de hard-stop

---

## 12. Memória e continuidade

### 12.1 Contexto de agente

- `adapterConfig` — configuracao de identidade e comportamento do agente
- `instructions` — instrucoes do agente (bundle mode, entry file, arquivos de texto)
- `metadata` — metadados livre do agente
- `runtimeConfig` — configuracao de runtime (heartbeat interval, etc.)

### 12.2 Continuidade entre sessoes

- Agentes tem estado persistente no banco de dados
- `lastHeartbeatAt` rastreia atividade
- `lifecycleState` preserva estado entre pausas e resumos
- Documentos e comentarios permanecem anexados a tarefas

### 12.3 Memória de conversa

- Nao e um sistema de chat; conversas estao anexadas a issues/tasks
- `conversationAgentId`, `conversationUserId`, `conversationState` na tabela issues
- Read states (`issue_read_states`) para controle de leitura

---

## 13. Integrações e adapters

### 13.1 Adaptadores de execucao

- Built-in: process, http, local CLI/session (Claude Code, Codex, Gemini, OpenCode, Pi, Cursor)
- OpenClaw gateway
- External adapter plugins (carregados dinamicamente)

### 13.2 Plugins

- Plugin framework local/self-hosted em V1
- Cloud marketplace e distribuicao pública fora do escopo V1
- Plugins podem declarar `agentLifecycle: true` e implementar `onAgentLifecycle` no SDK
- `setRequiredPlugins` armazena IDs de plugins exigidos por agente

### 13.3 Canais

- `chat_channels` — endpoints de comunicacao (Slack, Telegram, Discord, Teams, iMessage Photon, etc.)
- Configuracao de execucao, instrucoes de comunicacao, recursos habilitados

---

## 14. APIs e mecanismos de extensão

### 14.1 API REST

- Base path: `/api`
- Endpoints para companies, agents, goals, issues, approvals, costs, etc.
- Agentes usam bearer API keys

### 14.2 YAML de configuracao (agent-configuration-yaml.md)

- Tab "Advanced" edita configuracao do agente como YAML versionado
- Cobertura: identidade/perfil, harness/runtime, instrucoes, skills, secrets/variaveis, ferramentas, canais, permissoes/confianca, API keys, revisoes
- Formato: `apiVersion: paperclip/v1`, `kind: Agent`, `spec: {...}`

### 14.3 Mecanismos de extensão

- `.paperclip.yaml` — sidecar vendor-specific para Paperclip (adapter config, runtime config, env inputs, permissoes, orcamentos, triggers de rotina)
- `metadata.paperclip` — metadados Paperclip inline em arquivos markdown
- Plugin system para adaptadores externos

---

## 15. Limitacoes da implementacao atual

| Limite | Descricao |
|--------|-----------|
| Nao e um chat geral | Tasks/comments apenas; nao eh um app de chat |
| Nao substitui Jira/GitHub completo | Focado em orquestracao organizacional, nao revisão de PR |
| RBAC granular empresarial nao eh prioridade V1 | Fine-grained governance secundario ao control plane |
| Nao ha tabela de "departamentos" | Organizacao via reports_to, role, capabilities |
| Nao ha sistema de skills compartilhados | Skills sao por agente (conforme documento de skills) |
| Plugin marketplace publico fora do escopo V1 | Apenas plugin runtime local/self-hosted |
| Knowledge base subsystem fora do escopo V1 | Nao ha base de conhecimento nativa |
| Multi-board governance fora do escopo V1 | Apenas um board operator por deployment |
| Auto-healing orquestracao fora do escopo V1 | Nao ha auto-reassign/retry planners |

---

## 16. Relacao com o Agent Companies Spec

O Paperclip esta adotando o **Agent Companies Specification** (`agentcompanies/v1-draft`) como formato de pacote portavel:

- `COMPANY.md` -> metadata da empresa
- `TEAM.md` -> subarvore organizacional importavel
- `AGENTS.md` -> identidade e instrucoes do agente
- `PROJECT.md` -> definicao inicial de projeto
- `TASK.md` -> definicao inicial de tarefa/issue (ou rotina quando `recurring: true`)
- `SKILL.md` -> pacote de skill importado
- `.paperclip.yaml` -> sidecar vendor-specific (adapter config, runtime config, env, permissoes, orcamentos)

---

## 17. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/02-organization/paperclip-investigacao/PAPERCLIP_INVESTIGACAO.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/02-organization/paperclip-investigacao/PAPERCLIP_INVESTIGACAO.md")

---

Nenhum codigo do Paperclip foi alterado. Nenhum agente foi criado ou implantado.