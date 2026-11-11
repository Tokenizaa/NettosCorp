# Inventário e Matriz de Lacunas — NOS-OS vs Especificação dos 10 Domínios

**Repositório:** Tokenizaa/NettosCorp (branch master)
**Commit base:** ff3773c7d (especificação dos 10 domínios)
**Data:** 2026-11-11
**Banco Supabase:** udeglcdloehagljrrukj (tabelas NOS-OS: agents, companies, goals, issues, heartbeat_runs, cost_events, chat_channels, environments)

---

## 1. Inventário de arquivos do repositório

### nos-os/ (Python — runtime do sistema operacional)

| Caminho | Função | Estado | Credenciais |
|---------|--------|--------|-------------|
| `nos-os/src/execution/task_executor.py` | Checkout atômico, atribuição, conclusão, reatribuição de issues travadas, auditoria | Implementado e testado (atribuição e conclusão funcionais) | Nenhuma (SUPABASE_PASSWORD via env) |
| `nos-os/src/monitor/heartbeat_monitor.py` | Monitor de heartbeat — APENAS lê estado, não renova artificialmente | Corrigido (sem auto-heartbeat) | Nenhuma (SUPABASE_PASSWORD via env) |
| `nos-os/src/sync/sync_hermes_supabase.py` | Sincronização Hermes ↔ Supabase (agentes, issues, goals) | Implementado | Nenhuma (SUPABASE_PASSWORD via env) |
| `nos-os/src/reports/generate_report.py` | Relatórios diário e semanal | Implementado | Nenhuma (SUPABASE_PASSWORD via env) |

### docs/ (documentação)

| Caminho | Função | Estado |
|---------|--------|--------|
| `nos-os/docs/especificacao-arquitetural-10-dominios.md` | Especificação dos 10 domínios + plano obrigatório | Criado (commit ff3773c7d) |
| `nos-os/docs/api-interna.md` | API interna | Documentado |
| `nos-os/docs/arquitetura-organizacional.md` | Arquitetura organizacional | Documentado |
| `nos-os/docs/ciclo-evolucao-autonoma.md` | Ciclo de evolução autônoma | Documentado |
| `nos-os/docs/mecanismo-coordenacao.md` | Mecanismo de coordenação | Documentado |
| `nos-os/docs/modelo-dados.md` | Modelo de dados | Documentado |
| `nos-os/docs/monitoramento.md` | Monitoramento | Documentado |
| `nos-os/docs/procedimentos.md` | Procedimentos | Documentado |

### enterprise/ (frontend — referência arquitetural, não infra do NOS-OS)

| Caminho | Função | Estado | Risco Paperclip |
|---------|--------|--------|-----------------|
| `enterprise/src/services/paperclipService.ts` | Contrato de integração Paperclip | Standby (não conectado) | Dependência residual de Paperclip |
| `enterprise/src/services/agentService.ts` | CRUD de agentes IA (múltiplos) | Permite múltiplas IAs | Viola "Hermes como única IA" |
| `enterprise/src/services/supabaseClient.ts` | Cliente Supabase + localStore mirror | LocalStorage + Supabase | Fallback silencioso possível |
| `enterprise/supabase/migrations/20261107000001_initial_schema.sql` | Schema inicial (organizations, profiles, departments, positions, agents, projects, tasks, decisions, deliberations, documents, audit_logs) | Referência | Não aplicado ao banco NOS-OS |

---

## 2. Estado do banco Supabase (NOS-OS)

**Empresas:** 1 (NettosCorp, prefix NET)

**Agentes (14 total — 1 IA + 13 funções organizacionais):**

| Código | Nome | Role | Título | Status | reports_to |
|--------|------|------|--------|--------|------------|
| HERMES-001 | Hermes | executive | Chefe de Gabinete Executivo | active | — |
| DIR-TEC-001 | Diretor de Tecnologia | direction | Diretor de Tecnologia (Funcao Organizacional) | active | — |
| DIR-PROJ-001 | Diretor de Gestão de Projetos | direction | Diretor de Gestão de Projetos (Funcao Organizacional) | active | — |
| ORC-GLOBAL-001 | Agente Corporativo Global de Orquestração | orchestrator | Agente Corporativo Global de Orquestracao (Funcao de Coordenacao) | active | HERMES-001 |
| SPEC-ARCH-001 | Software Architect | specialist | Arquiteto de Software (Funcao Organizacional) | active | DIR-TEC-001 |
| SPEC-BACK-001 | Backend Architect | specialist | Arquiteto de Backend (Funcao Organizacional) | active | DIR-TEC-001 |
| SPEC-FRONT-001 | Frontend Developer | specialist | Desenvolvedor Frontend (Funcao Organizacional) | active | DIR-TEC-001 |
| SPEC-DEVOPS-001 | DevOps Automator | specialist | Automatizador DevOps (Funcao Organizacional) | active | DIR-TEC-001 |
| SPEC-PM-001 | Project Manager Senior | specialist | Gerente de Projeto Senior (Funcao Organizacional) | active | DIR-PROJ-001 |
| SPEC-TW-001 | Technical Writer | specialist | Escritor Tecnico (Funcao Organizacional) | active | DIR-TEC-001 |
| NET-AG-001 | Monitor Enterprise | monitoring | Agente de Monitoramento Enterprise (Suporte Operacional) | active | HERMES-001 |
| NET-AG-002 | Documentação Institucional | documentation | Agente de Documentação Institucional (Suporte Operacional) | active | HERMES-001 |
| NET-AG-003 | Operacional | operations | Agente Operacional (Suporte Operacional) | active | HERMES-001 |
| NET-AG-004 | Atendimento | support | Agente de Atendimento (Suporte Operacional) | active | HERMES-001 |

**Issues (10 total):**

| Título | Status | Prioridade | Assignee |
|--------|--------|------------|----------|
| Verificar saúde da plataforma enterprise | concluido | high | NET-AG-001 |
| Criar documento de boas-vindas | concluido | high | NET-AG-002 |
| Criar primeira tarefa operacional | concluido | high | NET-AG-003 |
| Registrar primeiro atendimento | concluido | high | NET-AG-004 |
| Validar arquitetura de sistemas | in_progress | high | SPEC-ARCH-001 |
| Validar arquitetura de backend | backlog | high | SPEC-BACK-001 |
| Validar implementação frontend | in_progress | high | SPEC-FRONT-001 |
| Configurar CI/CD | backlog | high | SPEC-DEVOPS-001 |
| Planejar projetos Q1 | backlog | high | SPEC-PM-001 |
| Criar documentação técnica inicial | backlog | high | SPEC-TW-001 |

**Goals (8 total, todos em "planned"):**

| Título | Nível | Status | Owner |
|--------|-------|--------|-------|
| Arquitetura organizacional e modelo operacional | team | planned | SPEC-ARCH-001 |
| Gerenciar carteira de projetos | team | planned | SPEC-PM-001 |
| Arquitetura de sistemas | agent | planned | SPEC-ARCH-001 |
| Arquitetura de backend e APIs | agent | planned | SPEC-BACK-001 |
| Desenvolvimento de interfaces | agent | planned | SPEC-FRONT-001 |
| CI/CD e infraestrutura | agent | planned | SPEC-DEVOPS-001 |
| Documentação técnica | agent | planned | SPEC-TW-001 |
| Gestão de projetos | agent | planned | SPEC-PM-001 |

---

## 3. Matriz de lacunas — 10 domínios vs estado atual

### Domínio 01 — Organização e organograma

| Requisito da especificação | Estado atual | Lacuna |
|---------------------------|--------------|--------|
| Entidades Company, Department, OrganizationalUnit, Function, Position, Responsibility, Capability, ReportingLine | Apenas `companies` e `agents` com `reports_to` simples | Tabelas departments, positions, functions não existem no banco NOS-OS |
| Organograma navegável | Não existe | Ausente |
| Integridade referencial | Parcial (apenas agents.company_id) | Não há FK para departments/positions |
| Hermes como única IA | ✓ Implementado | — |
| Migração preserva registros | — | Não aplicado ainda |

**Classificação:** Apenas documentado (implementação parcial no banco)

---

### Domínio 02 — Estratégia e objetivos

| Requisito | Estado atual | Lacuna |
|-----------|--------------|--------|
| Goal, KeyResult, Metric, Priority, GoalRelation, GoalProgressSnapshot | Apenas `goals` com title, level, status, owner_agent_id | Sem KeyResult, Metric, progresso baseado em evidências |
| Todo objetivo tem responsável funcional, critério mensurável, prioridade, prazo | Parcial (tem owner, status, mas não critério mensurável nem prioridade) | Ausente |
| Progresso calculado a partir de resultados rastreáveis | Não existe | Ausente |

**Classificação:** Parcial

---

### Domínio 03 — Gestão de projetos e tarefas

| Requisito | Estado atual | Lacuna |
|-----------|--------------|--------|
| Estados: backlog, todo, in_progress, in_review, done, blocked, cancelled | Apenas: backlog, in_progress, concluido | Estados inválidos não são recusados |
| Subtask, Dependency, Comment, Attachment, Deliverable, AcceptanceCriterion, Review | Não existem | Ausente |
| Transições validadas | Não existe (script Python faz manualmente) | Ausente |
| done exige entregável e evidência | Não existe | Ausente |

**Classificação:** Parcial

---

### Domínio 04 — Orquestração e coordenação

| Requisito | Estado atual | Lacuna |
|-----------|--------------|--------|
| WorkQueue, Schedule, Trigger, Assignment, OrchestrationRun, DependencyState, RetryPolicy | Não existem | Ausente |
| Fila persistente e transacional | Não existe | Ausente |
| Claim atômico impede dupla reivindicação | Parcial (task_executor.py faz UPDATE com WHERE status='backlog') | Não é transacional multi-etapa |
| Scheduler, event dispatcher, queue, claim/lease | Não existem | Ausente |
| Retomadas limitadas, auditáveis, idempotentes | Não existe | Ausente |

**Classificação:** Ausente

---

### Domínio 05 — Motor de execução

| Requisito | Estado atual | Lacuna |
|-----------|--------------|--------|
| Execution, ExecutionStep, ToolInvocation, ExecutionArtifact, Session, ExecutionCost, Checkpoint | Não existem | Ausente |
| Cada chamada registra ferramenta, parâmetros, autorização, início/fim, resultado, erro, artefatos | Não existe | Ausente |
| Segredos nunca aparecem em logs | ✓ (credenciais removidas) | — |
| Timeout, cancelamento, limites, idempotência, retomada por ferramenta | Não existe | Ausente |

**Classificação:** Ausente

---

### Domínio 06 — Memória e contexto institucional

| Requisito | Estado atual | Lacuna |
|-----------|--------------|--------|
| Decision, DecisionRationale, Event, ActivityLog, TaskSession, ContextSnapshot, KnowledgeDocument, WorkProduct, LessonLearned | Não existem | Ausente |
| Registrar decisões, justificativas, eventos, ações, resultados, falhas, evidências | Não existe | Ausente |
| Recuperar estado após reinício sem memória volátil | Não existe | Ausente |

**Classificação:** Ausente

---

### Domínio 07 — Governança e segurança

| Requisito | Estado atual | Lacuna |
|-----------|--------------|--------|
| Negar por padrão; menor privilégio | Não aplicado tecnicamente | Ausente |
| Separar permissões de leitura, escrita, execução, publicação, gasto, administração | Não existe | Ausente |
| Aprovação humana para decisões estratégicas/financeiras/institucionais | Não existe (apenas convenção) | Ausente |
| Segredos em armazenamento apropriado; nunca hardcode | ✓ Removidos do código Python | — |
| Registrar ator, ação, recurso, decisão de autorização, timestamp, correlação | Não existe | Ausente |

**Classificação:** Parcial (credenciais removidas, mas sem enforcement técnico)

---

### Domínio 08 — Monitoramento e confiabilidade

| Requisito | Estado atual | Lacuna |
|-----------|--------------|--------|
| Heartbeat com origem, timestamp, ID de execução, resultado | Parcial (heartbeat_runs existe, mas sem source/process_id/correlação) | Parcial |
| Proibido atualizar last_heartbeat_at de funções organizacionais para simular atividade | ✓ Corrigido (monitor só lê) | — |
| HealthCheck, RunMetric, Alert, Incident, RecoveryAttempt, ServiceStatus | Não existem | Ausente |
| Alertar heartbeat vencido, fila parada, execução travada | Não existe | Ausente |

**Classificação:** Parcial

---

### Domínio 09 — Aprendizado e evolução

| Requisito | Estado atual | Lacuna |
|-----------|--------------|--------|
| Skill, SkillVersion, Procedure, Evaluation, TestRun, ImprovementProposal, Regression, Release | Não existem | Ausente |
| Ciclo executar → avaliar → propor → testar → aprovar → versionar → publicar → monitorar | Não existe | Ausente |
| Melhoria documentada, testada, versionada, comparada com baseline | Não existe | Ausente |

**Classificação:** Ausente

---

### Domínio 10 — Interface e integrações

| Requisito | Estado atual | Lacuna |
|-----------|--------------|--------|
| API própria como fronteira de validação, autorização, transações, auditoria | Não existe (apenas scripts Python diretos no banco) | Ausente |
| Frontend não contorna API para gravar diretamente no banco | O frontend enterprise usa localStore + Supabase direto | Risco |
| Remover dependências residuais de Paperclip | paperclipService.ts e agentService.ts ainda existem | Não removido |
| agentService.ts: impedir criação de múltiplas IAs | Permite criação de múltiplos agentes IA | Viola regra central |

**Classificação:** Parcial (dependências de Paperclip ainda presentes)

---

## 4. Riscos críticos identificados

1. **Credenciais hardcoded** — ✓ CORRIGIDO (removidas de 3 scripts Python, agora exigem variáveis de ambiente)
2. **Heartbeat artificial** — ✓ CORRIGIDO (heartbeat_monitor.py só lê, não escreve last_heartbeat_at)
3. **Dependências residuais de Paperclip** — PENDENTE (paperclipService.ts, agentService.ts permitem múltiplas IAs e integração externa)
4. **Sem enforcement de governança** — PENDENTE (não há policy engine, authorization middleware, approval workflow)
5. **Sem orquestração** — PENDENTE (não há fila, claim atômico, scheduler)
6. **Sem memória persistente** — PENDENTE (não há decision log, activity log, context snapshot)
7. **Sem motor de execução rastreável** — PENDENTE (não há execution steps, tool invocations, artifacts)

---

## 5. Plano de implementação (por ordem da especificação)

| Etapa | Domínios | Ação | Status |
|-------|----------|------|--------|
| 1 | Inventário e segurança | Mapear arquivos, tabelas, credenciais; remover defaults inseguros; corrigir heartbeat | ✓ Concluído |
| 2 | 01 e 07 | Identidade única Hermes, organograma funcional, papéis, permissões, políticas, aprovações | Em andamento |
| 3 | 02 e 03 | Objetivos, projetos, tarefas, dependências, critérios, entregáveis | Pendente |
| 4 | 06 e 08 | Memória persistente, histórico, auditoria, heartbeat real, observabilidade | Pendente |
| 5 | 04 e 05 | Fila persistente, scheduler, claim atômico, executor, ferramentas, retomada | Pendente |
| 6 | 09 | Skills, avaliações, testes, versionamento, rollback | Pendente |
| 7 | 10 | API própria, frontend, CLI, relatórios, integrações | Pendente |

---

## 6. Próximas ações autorizadas

1. Criar migrations SQL para tabelas dos domínios 01 e 07 no banco NOS-OS (departments, positions, role_permissions, approvals, secret_references)
2. Criar script Python para popular dados iniciais de departamentos e posições (preservando agentes existentes)
3. Remover ou neutralizar dependências de Paperclip no frontend (paperclipService.ts, agentService.ts)
4. Implementar policy engine e authorization middleware
5. Implementar fila persistente com claim atômico (domínio 04)
6. Implementar motor de execução com rastreamento (domínio 05)

**Commit base:** ff3773c7d
**Branch:** master
**Evidências:** consultas SQL executadas no banco Supabase (agents, goals, issues), leitura do documento de especificação, grep de credenciais
