# TAREFA DE ALINHAMENTO — ENTERPRISE ↔ PAPERCLIP

**Código da tarefa:** NET-ALIGN-001  
**Meta pai:** Fase 0 — Fundamentos da empresa  
**Status:** DELEGADA  
**Criado por:** Hermes (Chefe de Gabinete Executivo)  
**Data:** 11 de novembro de 2026

## 1. Objetivo

Alinhar a plataforma enterprise (`enterprise/`) com o modelo do Paperclip (control plane), garantindo que a estrutura organizacional, agentes, metas e tarefas do enterprise reflitam os parâmetros definidos no PAPERCLIP_INVESTIGACAO.md.

## 2. O que está no enterprise (estado atual)

- React 19 + Vite + TypeScript + Supabase
- Migration SQL com 524 linhas (organizations, profiles, departments, agents, projects, tasks, decisions, deliberations, documents, audit_logs)
- RLS habilitado em todas as tabelas
- `.env.example` com placeholders (não tem valores reais)
- Sem dependências instaladas
- Sem projeto Supabase criado

## 3. O que está no Paperclip (referência)

Tabelas: companies, agents, goals, issues, environments, heartbeat_runs, cost_events, chat_channels, etc.
Campos chave: reports_to (árvore estrita), budgetMonthlyCents, adapterType, adapterConfig, capabilities, permissions, lifecycleState, lastHeartbeatAt

## 4. Tarefas delegadas

### 4.1 — Monitor Enterprise (net-ag-001)
**Responsabilidade:** Mapear tecnicamente o que falta no enterprise para espelhar o modelo Paperclip.
**Entregável:** Relatório de gap analysis (enterprise vs Paperclip) com campos faltantes, tabelas faltantes, adapters necessários.

### 4.2 — Documentação Institucional (net-ag-002)
**Responsabilidade:** Registrar o alinhamento na documentação institucional (02-organization, 05-technology).
**Entregável:** Documento atualizado com o mapeamento enterprise ↔ Paperclip.

### 4.3 — Operacional (net-ag-003)
**Responsabilidade:** Criar o plano de execução com prazos para cada item do gap analysis.
**Entregável:** Cronograma de ativação do enterprise alinhado ao Paperclip.

### 4.4 — Atendimento (net-ag-004)
**Responsabilidade:** Filtrar comunicações relacionadas a este alinhamento e escalar para Hermes apenas decisões ultra relevantes.
**Entregável:** Relatório de comunicações filtradas.

## 5. Critérios de aceitação

- [ ] Relatório de gap analysis entregue pelo Monitor Enterprise
- [ ] Documentação institucional atualizada pela Documentação Institucional
- [ ] Cronograma de execução entregue pelo Operacional
- [ ] Todas as decisões ultra relevantes encaminhadas ao fundador via Hermes

---

**Arquivo:** `04-portfolio/tarefas/alinhamento-enterprise-paperclip/NET-ALIGN-001.md`  
**Reports to:** Hermes
