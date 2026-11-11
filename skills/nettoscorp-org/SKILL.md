---
name: nettoscorp-org
description: "Estrutura organizacional da NettosCorp dentro do Hermes (modelo Paperclip)."
version: 1.0.0
metadata:
  source: paperclip-parameters
  structure: companies-agents-goals-issues
---

# Estrutura Organizacional — NettosCorp

Este skill mapeia a estrutura do Paperclip (companies, agents, goals, issues) para recursos nativos do Hermes: skills, perfis, delegação, memória e cron.

## 1. Empresa (Company)

| Campo | Valor |
|-------|-------|
| id | nettoscorp-001 |
| name | NettosCorp |
| description | Empresa de desenvolvimento de software em fase de fundacao e estruturacao |
| status | active |
| budgetMonthlyCents | 0 (a definir pelo fundador) |
| issuePrefix | NET |
| issueCounter | 0 |
| requireBoardApprovalForNewAgents | true |

## 2. Hierarquia de Agentes (reports_to — árvore estrita)

### Nível 1 — Liderança fundadora (não criar, já existe)
- **Fundador**: Netto Farias — autoridade executiva final
- **Conselheiro**: parceiro estratégico de IA

### Nível 2 — Direção executiva (criar no Hermes)
- **Hermes** — Chefe de Gabinete Executivo — reportsTo: Fundador — já implantado
- **Agente Corporativo Global de Orquestracao** — reportsTo: Hermes (administrativo) — médio prazo

### Nível 3 — Diretorias (criar no Hermes)
- **Diretor de Tecnologia** — reportsTo: Fundador — alta prioridade
- **Diretor de Gestão de Projetos** — reportsTo: Fundador — alta prioridade

### Nível 6 — Agentes operacionais iniciais (seis especialistas)
- Software Architect — reportsTo: Diretor de Tecnologia
- Backend Architect — reportsTo: Diretor de Tecnologia
- DevOps Automator — reportsTo: Diretor de Tecnologia
- Project Manager Senior — reportsTo: Diretor de Gestão de Projetos
- Frontend Developer — reportsTo: Diretor de Tecnologia
- Technical Writer — reportsTo: Hermes (compartilhado)

## 3. Metas (Goals)

Hierarquia: company → team → agent → task

| Meta | Nível | Owner | Status |
|------|-------|-------|--------|
| Fase 0 — Fundamentos da empresa | company | Hermes | em_execucao |
| Fase 1 — Reconhecimento das ferramentas de gestao | company | Hermes | planejada |
| Fase 2 — Arquitetura organizacional e modelo operacional | company | Diretor de Tecnologia | planejada |
| Fase 3 — Sistema de Gestao Corporativa | company | Diretor de Gestão de Projetos | planejada |
| Fase 4 — Reconhecimento do portfolio existente | company | Supervisores locais | planejada |

## 4. Tarefas iniciais (Issues)

| Tarefa | Meta pai | Assignee | Prioridade |
|--------|----------|----------|------------|
| Homologar modelo de autoridade v1.2 | Fase 0 | Fundador | alta |
| Definir orcamentos mensais por agente | Fase 0 | Hermes | alta |
| Definir adapterType e adapterConfig por agente | Fase 0 | Diretor de Tecnologia | alta |
| Criar diretorias (Tecnologia, Gestão de Projetos) | Fase 2 | Hermes | alta |
| Identificar supervisores locais dos projetos existentes | Fase 4 | Orquestrador | alta |

## 5. Orçamentos (budgetMonthlyCents)

A definir pelo fundador. Padrão: 0 (sem limite enforcado até homologação).

## 6. Adapters

| Agente | adapterType | adapterConfig |
|--------|-------------|---------------|
| Hermes | process | hermes-native |
| Diretor de Tecnologia | process | hermes-native |
| Diretor de Gestão de Projetos | process | hermes-native |
| Software Architect | process | hermes-native |
| Backend Architect | process | hermes-native |
| DevOps Automator | process | hermes-native |
| Project Manager Senior | process | hermes-native |
| Frontend Developer | process | hermes-native |
| Technical Writer | process | hermes-native |

---

**Fonte dos parâmetros**: PAPERCLIP_INVESTIGACAO.md e PROPOSTA_EQUIPE.md (D:\NettosCorp\empresa\empresa\02-organization)
**Status**: Estrutura definida, aguardando homologação do fundador para criar agentes definitivos.

---

*Não criar cargos definitivos nem implantar estrutura de organograma antes do alinhamento institucional estar consolidado (MEMORIA_INSTITUCIONAL_NETTOSCORP.md, linha 71).*
