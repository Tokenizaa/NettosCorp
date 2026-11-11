# Plano Técnico de Migração — NOS-OS → Paperclip

**Repositório:** Tokenizaa/NettosCorp (branch master)
**Deliberação:** Congelamento de novas implementações do NOS-OS; elaboração de plano de migração para o Paperclip original
**Data:** 2026-11-13
**Status:** Planejamento — sem alterações destrutivas, sem nova implementação, sem deploy
**Fonte de evidências:** documentação oficial do Paperclip (doc/PRODUCT.md, doc/SPEC-implementation.md, doc/agent-configuration-yaml.md, doc/execution-semantics.md), código do repositório paperclipai/paperclip

---

## 1. Resumo Executivo

Este plano estabelece como a arquitetura organizacional, departamentos, diretorias, especialistas, responsabilidades e fluxos operacionais do NettosCorp/NOS-OS seriam representados dentro do Paperclip original, sem alterar a arquitetura de núcleo único de inteligência (Hermes como única IA).

**Princípio central:** o Paperclip é um *control plane* para empresas de agentes autônomos. Cada empresa tem funcionários (agentes), organograma, metas, orçamentos, task management hierárquico, heartbeats, governança e aprovações. O NOS-OS foi especificado com 10 domínios que espelham exatamente essas capacidades do Paperclip.

**Decisão chave:** Hermes permanece como o único núcleo de raciocínio e decisão. No Paperclip, isso se traduz em Hermes ser o único agente com `adapter_type` configurado para executar raciocínio real, enquanto todas as outras 13 funções organizacionais são registradas como colaboradores/funcionários no organograma do Paperclip, mas com execução delegada a Hermes (ou sem ciclo de vida autônomo de IA).

**NÃO será iniciada nenhuma migração, alteração destrutiva ou nova implementação neste plano.** Este documento é apenas a especificação técnica prévia.

---

## 2. Pressupostos e Restrições

| # | Pressuposto / Restrição | Justificativa |
|---|------------------------|---------------|
| P1 | Congelamento de novas funcionalidades do NOS-OS | Deliberação estratégica |
| P2 | Preservação integral de código, commits, documentação, dados e histórico | Deliberação estratégica; não excluir nem reverter nada |
| P3 | Hermes continua sendo o único agente de IA (`is_ai = true`) | Deliberação estratégica; não criar múltiplas IAs |
| P4 | As 13 funções organizacionais do NOS-OS são funcionários/cargos no Paperclip, não agentes autônomos | Mapeamento direto ao modelo "employees are agents" do Paperclip, mas com execução centralizada em Hermes |
| P5 | O Paperclip é referência arquitetural, não infraestrutura operacional do NOS-OS | Regra existente do NOS-OS (domínio 10) |
| P6 | A investigação do CEO no Paperclip é fonte de evidências; o plano será atualizado quando o relatório final estiver disponível | Deliberação estratégica |
| P7 | Não há deploy em produção sem autorização do fundador | Regra existente do NOS-OS |
| P8 | Toda comunicação em português, direta, sem filler | Regra existente do NOS-OS |

---

## 3. Arquitetura Proposta — Visão Geral

### 3.1 Modelo de Organização no Paperclip

O Paperclip adota o **company como unidade de organização de primeira ordem**. Uma instância do Paperclip pode rodar múltiplas empresas, cada uma isolada. Dentro de uma empresa:

- **Company** → NettosCorp (uma instância)
- **Goal** → objetivo da empresa (ex: "Construir o sistema operacional empresarial da NettosCorp")
- **Employees / Agents** → organograma: CEO, diretores, especialistas, suporte operacional
- **Org graph** → árvore estrita (`reports_to` raiz nula; sem multi-gerenciamento)
- **Tasks / Issues** → hierarquia de tarefas com pai/filho, single assignee, atomic checkout
- **Budgets** → orçamento mensal por agente (cents)
- **Heartbeats** → monitoramento de atividade real
- **Approvals** → gates de governança
- **Adapters** → como cada agente executa (process, http, hermes_local, etc.)

### 3.2 Hermes como Núcleo Único

No Paperclip, cada agente tem um `adapter_type` e `adapter_config`. Para manter Hermes como única IA:

- **Hermes (HERMES-001)**: `adapter_type = hermes_local` (ou `hermes_gateway`), `is_ai = true`, executa todo raciocínio e decisão. É o CEO do organograma Paperclip.
- **As outras 13 funções**: `adapter_type = none` ou `adapter_type = http` (apenas para receber notificações/webhook), `is_ai = false`. São funcionários no organograma, mas não executam ciclo de vida autônomo de IA. Recebem tarefas atribuídas por Hermes e reportam resultados a ele.

Isso preserva a regra inegociável do NOS-OS: "Hermes é a única entidade classificada como IA/executor inteligente."

---

## 4. Matriz de Mapeamento — 10 Domínios → Paperclip

| Domínio NOS-OS | Recurso Nativo/Extensível do Paperclip | Mapeamento | Estado |
|---|---|---|---|
| 01 — Organização e organograma | Company, Employees/Agents, Org Chart (`reports_to`), Roles, Positions | Empresa NettosCorp = company; departamentos = agrupamentos; cargos = positions; funções = employees com código, nome, propósito, capacidades, `reports_to` | Parcial — Paperclip tem org chart nativo, mas não separa departamentos/posições como tabelas distintas |
| 02 — Estratégia e objetivos | Goals, Key Results, Metrics | Goal = objetivo da empresa; hierarquia pai/filho de objetivos; métricas rastreáveis | Parcial — Paperclip tem goals nativos, mas não Key Results/Metrics como entidades separadas |
| 03 — Gestão de projetos e tarefas | Issues, Projects, Tasks, Subtasks, Dependencies, Comments, Attachments, Deliverables, Acceptance Criteria, Reviews | Issue = tarefa; hierarquia pai/filho; blockers; single assignee; atomic checkout; comentários; anexos; entregáveis; critérios de aceitação; revisão | Parcial — Paperclip tem issues nativas com boa parte desses campos, mas não todos como tabelas separadas |
| 04 — Orquestração e coordenação | Heartbeats, Routines & Schedules, Orchestration, Work Queues (implícito via issues/queue) | Fila = issues pendentes; claim atômico = atomic checkout; scheduler = routines; gatilhos = events/webhooks | Parcial — Paperclip tem heartbeats e routines nativas; fila de trabalho é implícita |
| 05 — Motor de execução | Agent Adapters (process, http, hermes_local), Execution Services, Project Workspaces, Runtime Services | Cada execução = heartbeat invocation; sessão = agent run; passos = tool invocations dentro do adapter; artefatos = work products/documents | Parcial — Paperclip delega execução ao adapter; o NOS-OS implementa rastreamento detalhado próprio |
| 06 — Memória e contexto institucional | Activity & Events, Documents, Knowledge (via plugins), Context Snapshots (implícito via issue history) | Decisões = activity events; snapshots = issue/task history; documentos = documents table | Parcial — Paperclip tem activity e documents, mas não snapshots de contexto formais |
| 07 — Governança e segurança | Identity & Access, Governance & Approvals, Budgets & Costs, Role/Permission grants | Papéis = roles; permissões = grants; aprovações = approval workflows; segredos = Secrets & Storage; auditoria = Activity & Events | Parcial — Paperclip tem governança nativa, mas não separa secret_references como tabela |
| 08 — Monitoramento e confiabilidade | Heartbeat Execution, Activity & Events, Budget thresholds, Recovery/Watchdog | Heartbeat = heartbeat monitoring; alertas = budget threshold checks; recuperação = task watchdog/recovery | Parcial — Paperclip tem monitoramento nativo |
| 09 — Aprendizado e evolução | Skills (Company Skills, Paperclip-managed skills), Plugin framework, Evaluations (implícito) | Skills = company skills; versões = skill versions; avaliações = skill reviews; melhorias = skill updates | Parcial — Paperclip tem skills nativos |
| 10 — Interface e integrações | REST API server, UI (React), CLI (`npx paperclipai`), Connectors, Webhooks, Plugins | API própria = Paperclip REST API + CLI; frontend = Paperclip UI; integrações = connectors/webhooks/plugins | Parcial — Paperclip tem API/UI/CLI nativos |

---

## 5. Mapeamento Detalhado por Domínio

### Domínio 01 — Organização e Organograma

| Entidade NOS-OS | Mapeamento Paperclip | Observações |
|----------------|---------------------|-------------|
| Company | `companies` table (single tenant, multi-company data model) | Uma empresa NettosCorp por instância Paperclip |
| Department | Agrupamento lógico dentro da company; não é tabela separada no Paperclip V1 | Usar `department_id` ou tag/metadados no agent |
| Position | `agents` com `code`, `title`, `level`, `description` | Position = registro de agent com campos de metadados |
| Function | `agents` com `is_ai = false`, `capabilities` (jsonb/texto) | Função organizacional = employee não-IA |
| FunctionAssignment | `agents.reports_to` + task assignee | Atribuição = tarefa atribuída ao agent |
| Hermes (única IA) | `agents` com `is_ai = true`, `adapter_type = hermes_local` | Único agente com ciclo de vida autônomo de IA |

### Domínio 02 — Estratégia e Objetivos

| Entidade NOS-OS | Mapeamento Paperclip | Observações |
|----------------|---------------------|-------------|
| StrategicPlan | Company goal | Um goal por empresa |
| Goal | `goals` table | Hierarquia pai/filho suportada |
| KeyResult | Não é tabela separada no V1 | Armazenar como metadados no goal ou documento |
| Metric | Não é tabela separada no V1 | Armazenar como metadados ou run_metrics |
| GoalRelation | `goals` pai/filho | Nativo |
| GoalProgressSnapshot | Issue/task history + activity events | Progresso = evolução das issues vinculadas |

### Domínio 03 — Gestão de Projetos e Tarefas

| Entidade NOS-OS | Mapeamento Paperclip | Observações |
|----------------|---------------------|-------------|
| Project | `projects` table (se existir no V1) ou agrupamento de issues | Verificar se projects existe no schema Drizzle |
| Issue/Task | `issues` table nativa | Single assignee, atomic checkout, parent/sub-issue, blockers |
| Subtask | Child issue | Hierarquia pai/filho |
| Dependency | `blockers` / `depends_on` | Nativo no modelo de issues |
| Comment | Issue comments | Nativo |
| Attachment | Issue attachments | Nativo |
| Deliverable | Work products / documents | Nativo via issue documents |
| AcceptanceCriterion | Metadados da issue ou documento | Não é tabela separada |
| Review | Approval workflow + issue status transitions | Nativo |

### Domínio 04 — Orquestração e Coordenação

| Entidade NOS-OS | Mapeamento Paperclip | Observações |
|----------------|---------------------|-------------|
| WorkQueue | Issues pendentes (status `backlog`/`todo`) | Fila implícita no modelo de issues |
| WorkQueueItem | Issue com `assignee_id = NULL` | Item da fila = issue não atribuída |
| Claim atômico | Atomic checkout para `in_progress` | Nativo no Paperclip (task ownership = single assignee; atomic checkout required) |
| Schedule | `routines` (cron, webhook, API triggers) | Nativo no Paperclip |
| Trigger | Events/webhooks | Nativo |
| OrchestrationRun | Heartbeat execution tracking | Nativo |
| DependencyState | Issue blocker resolution | Nativo |
| RetryPolicy | Task watchdog / recovery | Nativo (escopo de issue subtree) |

### Domínio 05 — Motor de Execução

| Entidade NOS-OS | Mapeamento Paperclip | Observações |
|----------------|---------------------|-------------|
| Session | Agent run (heartbeat invocation) | Nativo via adapter |
| Execution | Agent run com start/complete | Nativo |
| ExecutionStep | Tool invocations dentro do adapter | Nativo (dentro do contexto do agent) |
| ToolInvocation | Adapter tool calls | Depende do adapter (process, http, etc.) |
| ExecutionArtifact | Work products / documents | Nativo |
| Checkpoint | Issue/task state persistence | Nativo (persistent agent state across heartbeats) |
| ExecutionCost | Budget & cost tracking | Nativo (token salary budgets per agent) |

### Domínio 06 — Memória e Contexto Institucional

| Entidade NOS-OS | Mapeamento Paperclip | Observações |
|----------------|---------------------|-------------|
| Decision | Activity events | Nativo |
| DecisionRationale | Activity event details | Nativo |
| Event | Activity & Events | Nativo |
| ActivityLog | Activity & Events | Nativo |
| TaskSession | Agent run context | Nativo (persistent agent state) |
| ContextSnapshot | Issue/task history | Nativo |
| KnowledgeDocument | Documents + plugins (knowledge base) | Parcial — knowledge base é plugin/edge |
| WorkProduct | Work products / documents | Nativo |
| LessonLearned | Activity events + skill improvements | Parcial |

### Domínio 07 — Governança e Segurança

| Entidade NOS-OS | Mapeamento Paperclip | Observações |
|----------------|---------------------|-------------|
| Role | Instance roles / permission grants | Nativo |
| Permission | Permission grants (management, tools, etc.) | Nativo |
| Policy | Policy engine (skill-policy, execution policies) | Nativo |
| Approval | Approval workflows | Nativo |
| Budget | Budgets & Costs (monthly_cents, hard stops) | Nativo |
| SecretReference | Secrets & Storage | Nativo |
| AuditEvent | Activity & Events | Nativo |
| SecurityIncident | Activity events + alerts | Parcial |

### Domínio 08 — Monitoramento e Confiabilidade

| Entidade NOS-OS | Mapeamento Paperclip | Observações |
|----------------|---------------------|-------------|
| Heartbeat | Heartbeat monitoring | Nativo |
| HealthCheck | Scheduler/worker checks | Parcial |
| RunMetric | Activity & Events + cost events | Nativo |
| Alert | Budget threshold checks | Nativo (overspend pauses agents) |
| Incident | Activity events + recovery | Parcial |
| RecoveryAttempt | Task watchdog / recovery | Nativo (escopo limitado) |
| ServiceStatus | Agent status (active/paused/idle/running/error) | Nativo |

### Domínio 09 — Aprendizado e Evolução

| Entidade NOS-OS | Mapeamento Paperclip | Observações |
|----------------|---------------------|-------------|
| Skill | Company Skills | Nativo |
| SkillVersion | Paperclip-managed skills (immutable versions) | Nativo |
| Procedure | Company skill (workflow) | Parcial |
| Evaluation | Skill review / agent review | Parcial |
| TestRun | Não é tabela separada | Parcial |
| ImprovementProposal | Skill update / policy change | Parcial |
| Regression | Não é tabela separada | Parcial |
| Release | Não é tabela separada | Parcial |

### Domínio 10 — Interface e Integrações

| Entidade NOS-OS | Mapeamento Paperclip | Observações |
|----------------|---------------------|-------------|
| API Própria | Paperclip REST API (`server/`) | Nativo |
| Frontend | Paperclip UI (`ui/`, React) | Nativo |
| CLI | `npx paperclipai` | Nativo |
| Conectores | Connectors (app/tool connections, chat/email, AI accounts) | Nativo |
| Webhooks | Webhook triggers | Nativo |
| Dashboard | Dashboard pages | Nativo |
| Relatórios | Activity & Events + cost reports | Nativo |
| Notificações | Agent Chat (opt-in) + issue comments | Parcial |
| API Key References | Secrets & Storage | Nativo |

---

## 6. Dependências

| Dependência | Tipo | Impacto na Migração |
|-------------|------|---------------------|
| Paperclip server (Node + TypeScript) | Infraestrutura | Requer instalação e configuração do Paperclip como control plane |
| PostgreSQL | Banco de dados | Paperclip usa Postgres (embedded ou hospedado); NOS-OS já usa Supabase/Postgres |
| Hermes como adapter | Adapter customizado | Precisa criar/adaptar um adapter `hermes_local` que delegue execução ao Hermes |
| Dados existentes (NOS-OS) | Dados | Migração de 14 agentes, 10 issues, 8 goals, departamentos, posições, funções |
| Credenciais | Segredos | Migrar para Secrets & Storage do Paperclip; nunca expor valores |
| Frontend enterprise | Interface | Decidir se reutiliza o frontend enterprise ou migra para Paperclip UI |
| Investigação do CEO | Evidências | Aguardar relatório final do CEO sobre Paperclip antes de atualizar o plano |

---

## 7. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Hermes como única IA não se encaixa no modelo "every employee is an agent" do Paperclip | Alta | Alto | Configurar Hermes como único agent com `is_ai = true`; as demais funções como employees sem ciclo autônomo; adapter `hermes_local` para execução centralizada |
| Perda de dados durante migração | Média | Alto | Migrar por etapas com backup completo; validar contagem de registros antes e depois; nunca excluir dados do NOS-OS |
| Incompatibilidade de schema (NOS-OS tem 64 tabelas; Paperclip tem schema próprio) | Alta | Médio | Mapear entidade-por-entidade; usar metadados/jsonb para campos não nativos; não forçar correspondência 1:1 |
| Dependência operacional do Paperclip (contrariando regra do NOS-OS) | Média | Alto | Manter Paperclip como control plane de referência; o NOS-OS continua como execução real; não instalar Paperclip como infraestrutura obrigatória |
| Múltiplas IAs criadas acidentalmente | Baixa | Crítico | Rigorosa configuração de `is_ai = false` em todos os employees exceto Hermes; revisão de código antes de qualquer inserção |
| Relatório final do CEO não disponível a tempo | Média | Médio | Elaborar plano baseado na documentação pública do Paperclip; atualizar quando o relatório estiver disponível |

---

## 8. Etapas de Migração (Plano — Não Iniciar Ainda)

Esta é a sequência proposta. **Nenhuma etapa será executada sem autorização explícita do fundador.**

### Etapa 0 — Preparação e Evidências
- [ ] Aguardar relatório final da investigação do CEO no Paperclip
- [ ] Atualizar este plano com evidências do relatório do CEO
- [ ] Fazer backup completo do banco NOS-OS (Supabase) e do repositório Git
- [ ] Documentar estado atual de todos os 14 agentes, 10 issues, 8 goals, departamentos, posições, funções

### Etapa 1 — Instalação do Paperclip (Ambiente de Homologação)
- [ ] Instalar Paperclip (`npx paperclipai onboard --yes` ou equivalente) em ambiente isolado
- [ ] Configurar PostgreSQL (embedded ou Supabase)
- [ ] Verificar acesso à API REST e CLI do Paperclip
- [ ] Validar que uma empresa pode ser criada com goal, CEO e employees

### Etapa 2 — Mapeamento da Estrutura Organizacional (Domínio 01)
- [ ] Criar company NettosCorp no Paperclip
- [ ] Criar Hermes como CEO/único agente de IA (`adapter_type = hermes_local`, `is_ai = true`)
- [ ] Criar as 13 funções organizacionais como employees (`is_ai = false`, `adapter_type = none/http`)
- [ ] Configurar `reports_to` para refletir a hierarquia (Hermes → diretores → especialistas → suporte)
- [ ] Mapear departamentos e posições como metadados nos agents

### Etapa 3 — Migração de Metas e Tarefas (Domínios 02 e 03)
- [ ] Migrar 8 goals para goals do Paperclip (hierarquia pai/filho)
- [ ] Migrar 10 issues para issues do Paperclip (status, prioridade, assignee)
- [ ] Migrar dependências, comentários, anexos, entregáveis, critérios de aceitação
- [ ] Validar integridade referencial (toda issue tem goal pai ou está órfã intencionalmente)

### Etapa 4 — Orquestração e Execução (Domínios 04 e 05)
- [ ] Configurar routines/schedules para tarefas recorrentes
- [ ] Configurar adapter `hermes_local` para execução centralizada em Hermes
- [ ] Implementar fluxo: claim atômico → checkout → execução → checkpoint → conclusão com resultado
- [ ] Migrar checkpoints e snapshots de contexto

### Etapa 5 — Memória, Monitoramento, Governança (Domínios 06, 07, 08)
- [ ] Migrar events, activity log, decisões
- [ ] Configurar health checks e alertas (budget thresholds)
- [ ] Configurar roles, permissões, approvals no Paperclip
- [ ] Migrar secret_references para Secrets & Storage
- [ ] Migrar audit_events

### Etapa 6 — Aprendizado e Interface (Domínios 09 e 10)
- [ ] Migrar skills, procedures, evaluations para Company Skills
- [ ] Configurar conectores e webhooks conforme necessário
- [ ] Validar API REST do Paperclip para operações críticas
- [ ] Decidir se frontend enterprise é mantido ou substituído por Paperclip UI

### Etapa 7 — Testes e Homologação
- [ ] Executar testes de unidade, integração e aceitação
- [ ] Validar Hermes como única IA
- [ ] Validar checkout atômico e prevenção de duplicidade
- [ ] Validar heartbeat real (não artificial)
- [ ] Validar preservação de dados (contagem de registros antes/depois)

### Etapa 8 — Decisão de Deploy
- [ ] Apresentar resultados dos testes ao fundador
- [ ] Obter autorização para deploy (se aplicável)
- [ ] Manter NOS-OS como fallback até validação completa

---

## 9. Testes

| Teste | Objetivo | Critério de Aceitação |
|-------|----------|----------------------|
| T1 — Hermes como única IA | Verificar que apenas Hermes tem `is_ai = true` | Consulta ao banco: 1 agent com `is_ai = true`, 13 com `is_ai = false` |
| T2 — Estrutura organizacional | Verificar organograma completo | 14 employees cadastrados, `reports_to` consistente, sem loops |
| T3 — Migração de dados | Verificar preservação de registros | Contagem de agents, issues, goals antes e depois idêntica |
| T4 — Checkout atômico | Verificar que uma issue só tem um assignee | Duas tentativas simultâneas de atribuição: apenas uma succeeds |
| T5 — Heartbeat real | Verificar que heartbeat não é renovado artificialmente | `last_heartbeat_at` só atualiza quando Hermes executa tarefa real |
| T6 — Execução com resultado | Verificar que execução só é concluída com resultado verificável | Execução em `started` até `--complete-execution --result` ser chamado |
| T7 — Governança | Verificar approvals e permissões | Ação sem permissão retorna erro; aprovação requerida para decisões sensíveis |
| T8 — API do Paperclip | Verificar endpoints REST | `/api/health`, `/api/agents`, `/api/issues` respondem corretamente |
| T9 — Sem credenciais expostas | Verificar código e banco | Nenhuma senha/token hardcoded em scripts ou defaults |
| T10 — Não há dependência operacional do Paperclip | Verificar que NOS-OS funciona sem Paperclip rodando | Scripts Python do NOS-OS executam independentemente |

---

## 10. Critérios de Homologação

O plano de migração está homologado quando:

1. **Evidências do CEO**: relatório final da investigação do CEO no Paperclip está disponível e foi incorporado a este plano
2. **Arquitetura aprovada**: fundador aprova a matriz de mapeamento e a decisão de Hermes como única IA no Paperclip
3. **Testes aprovados**: todos os 10 testes acima executados com sucesso em ambiente de homologação
4. **Dados preservados**: contagem de registros (agents, issues, goals, departments, positions, functions) idêntica antes e depois da migração de teste
5. **Sem credenciais expostas**: grep confirma nenhuma senha/token hardcoded
6. **Hermes única IA**: confirmação de que apenas Hermes tem ciclo de vida autônomo
7. **Não há deploy em produção**: nenhuma alteração foi feita no ambiente de produção
8. **Plano atualizado**: este documento reflete o relatório final do CEO

---

## 11. Próximas Ações (Aguardando Autorização)

1. Não iniciar nenhuma implementação ou migração
2. Aguardar o relatório final da investigação do CEO no Paperclip
3. Atualizar este plano com as evidências do relatório do CEO
4. Apresentar o plano atualizado ao fundador para aprovação
5. Somente após aprovação: iniciar a Etapa 0 (backup e preparação)

---

## 12. Regras Respeitadas

- ✅ Congelamento de novas implementações do NOS-OS
- ✅ Preservação integral de código, commits, documentação, dados e histórico
- ✅ Nenhuma exclusão nem reversão
- ✅ Hermes permanece como único núcleo de inteligência
- ✅ Nenhuma outra IA criada
- ✅ Nenhuma alteração destrutiva iniciada
- ✅ Nenhuma nova implementação iniciada
- ✅ Plano entregue antes de qualquer execução
- ✅ Comunicação em português, direta, sem filler

---

**Este documento é um planejamento técnico prévio. Não representa execução, deploy ou alteração de qualquer ambiente de produção.**
