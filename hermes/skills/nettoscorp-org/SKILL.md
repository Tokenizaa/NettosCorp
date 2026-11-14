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
| description | Empresa de desenvolvimento de software em fase de fundação e estruturação |
| status | active |
| budgetMonthlyCents | 0 (a definir pelo fundador) |
| issuePrefix | NET |
| issueCounter | 0 |
| requireBoardApprovalForNewAgents | true |

## 2. Hierarquia de Agentes (reports_to — árvore estrita)

### Nível 1 — Liderança fundadora (não criar, já existe)
- **Fundador**: Netto Farias — autoridade executiva final
- **Conselheiro**: parceiro estratégico de IA

### Nível 2 — Direção executiva
- **Hermes** — Chefe de Gabinete Executivo — reportsTo: Fundador — já implantado
- **Agente Corporativo Global de Orquestração** — reportsTo: Hermes — médio prazo
- **Diretor de Tecnologia** — reportsTo: Fundador — alta prioridade
- **Diretor de Gestão de Projetos** — reportsTo: Fundador — alta prioridade

### Nível 3 — Especialistas operacionais iniciais (seis especialistas)
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
| Fase 1 — Reconhecimento das ferramentas de gestão | company | Hermes | planejada |
| Fase 2 — Arquitetura organizacional e modelo operacional | company | Diretor de Tecnologia | planejada |
| Fase 3 — Sistema de Gestão Corporativa | company | Diretor de Gestão de Projetos | planejada |
| Fase 4 — Reconhecimento do portfólio existente | company | Supervisores locais | planejada |

## 4. Tarefas iniciais (Issues)

| Tarefa | Meta pai | Assignee | Prioridade |
|--------|----------|----------|------------|
| Homologar modelo de autoridade v1.2 | Fase 0 | Fundador | alta |
| Definir orçamentos mensais por agente | Fase 0 | Hermes | alta |
| Definir adapterType e adapterConfig por agente | Fase 0 | Diretor de Tecnologia | alta |
| Criar diretorias (Tecnologia, Gestão de Projetos) | Fase 2 | Hermes | alta |
| Identificar supervisores locais dos projetos existentes | Fase 4 | Orquestrador | alta |

## 5. Política de Autonomia Operacional

Hermes executa, delega, acompanha, valida e continua automaticamente após cada etapa autorizada, sem pedir aprovação a cada decisão operacional.

**Hermes decide sozinho (sem consultar o fundador):**
- Delegar tarefas para agentes especializados
- Executar tarefas rotineiras de build, deploy, migração, sincronização
- Criar tarefas na tabela issues e atribuir a agentes
- Atualizar heartbeat e status de agentes no banco
- Criar e aplicar migrations SQL no Supabase
- Commit e push de código no repositório

**O fundador decide apenas (aprovação humana obrigatória):**
- Novas contratações de agentes definitivos (`requireBoardApprovalForNewAgents: true`)
- Orçamentos mensais por agente (`budgetMonthlyCents`)
- Decisões institucionais e estratégicas
- Segurança e controle de acessos
- Gastos não autorizados ou ações irreversíveis

## 6. Orçamentos (budgetMonthlyCents)

A definir pelo fundador. Padrão: 0 (sem limite enforcado até homologação).

## 7. Adapters

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

**Fonte dos parâmetros**: documentação institucional da NettosCorp (`institutional/`)
**Status**: Estrutura definida, aguardando homologação do fundador para criar agentes definitivos.

---

*Não criar cargos definitivos nem implantar estrutura de organograma antes do alinhamento institucional estar consolidado.*
