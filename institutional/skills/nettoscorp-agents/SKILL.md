---
name: nettoscorp-agents
description: "Agentes básicos da NettosCorp rodando nativamente no Hermes (modelo Paperclip, fora do servidor)."
version: 1.1.0
metadata:
  source: paperclip-parameters
  structure: agents-reportsTo-capabilities-budget
  institutional_alignment: PROPOSTA_EQUIPE_v1.2 + ARQUITETURA_DEPARTAMENTAL_v1.0
---

# Agentes da NettosCorp (Hermes Nativo)

Este skill define os agentes que rodam dentro do Hermes, alinhados com a documentação institucional da NettosCorp (PROPOSTA_EQUIPE v1.2 e ARQUITETURA_DEPARTAMENTAL v1.0).

## Modelo (parâmetros Paperclip)

| Campo | Significado |
|-------|-------------|
| id | Identificador único do agente |
| name | Nome do agente |
| role | Papel funcional |
| title | Cargo |
|| reportsTo | UUID do supervisor (árvore estrita, raiz = Fundador) |
| capabilities | Lista do que o agente faz |
| adapterType | process (roda nativamente no Hermes) |
| adapterConfig | hermes-native |
| budgetMonthlyCents | Orçamento mensal (0 = sem limite até homologação) |
| status | idle / in_progress / paused |
| lifecycleState | ready |

## Grupo A — Agentes de Suporte Operacional de Hermes (criados, ativos)

Estes 4 agentes foram criados por Hermes para suporte imediato. Não estão na lista dos 6 especialistas aprovados pelo Conselheiro, mas operam sob a autoridade direta de Hermes como suporte operacional.

### Agente 1 — Monitor Enterprise

| Campo | Valor |
|-------|-------|
| id | net-ag-001 |
| name | Monitor Enterprise |
| role | monitoring |
| title | Agente de Monitoramento Enterprise |
| reportsTo | hermes-chefe-gabinete |
| capabilities | monitorar plataforma enterprise, detectar falhas, reportar status, alertar Hermes |
| adapterType | process |
| adapterConfig | hermes-native |
| budgetMonthlyCents | 0 |
| status | idle |

**Responsabilidades:**
- Acompanhar a plataforma `enterprise/` (frontend React/Vite/Supabase)
- Monitorar issues, tarefas e desempenho
- Reportar anomalias para o Hermes
- Manter o fundador informado sobre o estado do enterprise

## Agente 2 — Documentação Institucional

| Campo | Valor |
|-------|-------|
| id | net-ag-002 |
| name | Documentação Institucional |
| role | documentation |
| title | Agente de Documentação |
| reportsTo | hermes-chefe-gabinete |
| capabilities | manter documentação atualizada, sincronizar institutional/, versionar documentos |
| adapterType | process |
| adapterConfig | hermes-native |
| budgetMonthlyCents | 0 |
| status | idle |

**Responsabilidades:**
- Manter `institutional/empresa/` atualizado
- Sincronizar decisões e deliberações
- Versionar documentos da NettosCorp
- Garantir rastreabilidade de mudanças

## Agente 3 — Operacional

| Campo | Valor |
|-------|-------|
| id | net-ag-003 |
| name | Operacional |
| role | operations |
| title | Agente Operacional |
| reportsTo | hermes-chefe-gabinete |
| capabilities | tarefas gerais, coordenação, lembretes, acompanhamento de prazos |
| adapterType | process |
| adapterConfig | hermes-native |
| budgetMonthlyCents | 0 |
| status | idle |

**Responsabilidades:**
- Executar tarefas rotineiras delegadas pelo Hermes
- Controlar prazos e entregas
- Manter o registro de atividades operacionais
- Escalar para Hermes quando necessário

## Agente 4 — Atendimento

| Campo | Valor |
|-------|-------|
| id | net-ag-004 |
| name | Atendimento |
| role | support |
| title | Agente de Atendimento |
| reportsTo | hermes-chefe-gabinete |
| capabilities | filtrar mensagens, responder perguntas simples, escalar para Hermes |
| adapterType | process |
| adapterConfig | hermes-native |
| budgetMonthlyCents | 0 |
| status | idle |

**Responsabilidades:**
- Primeiro contato com mensagens entrantes
- Responder dúvidas simples sobre a NettosCorp
- Filtrar o que chega até o Hermes

## Grupo B — Seis Especialistas Prioritários Aprovados pelo Conselheiro (pendente homologação do fundador)

Conforme PROPOSTA_EQUIPE v1.2 (seção 9) e ARQUITETURA_DEPARTAMENTAL (seção 7), estes 6 agentes foram aprovados pelo Conselheiro como candidatos para composição inicial, mas **não foram implantados** (aguardam homologação do fundador e criação das diretorias).

### Especialista 1 — Software Architect

| Campo | Valor |
|-------|-------|
| id | net-spec-001 |
| name | Software Architect |
| role | architecture |
| title | Arquiteto de Software |
| reportsTo | diretor-tecnologia (vago — depende do fundador) |
| capabilities | projetar sistemas escaláveis, DDD, ADRs, estratégia de evolução do sistema |
| adapterType | process |
| adapterConfig | hermes-native |
| budgetMonthlyCents | 0 (pendente definição do fundador) |
| status | pendente_criacao |

**Departamento:** Tecnologia  
**Superior hierárquico institucional:** Diretor de Tecnologia  
**Serviços compartilháveis:** Sim — todas as áreas técnicas  
**Fonte:** PROPOSTA_EQUIPE v1.2, seção 9; ARQUITETURA_DEPARTAMENTAL, seção 7

---

### Especialista 2 — Backend Architect

| Campo | Valor |
|-------|-------|
| id | net-spec-002 |
| name | Backend Architect |
| role | architecture |
| title | Arquiteto de Backend |
| reportsTo | diretor-tecnologia (vago) |
| capabilities | design de APIs, arquitetura de banco, escalabilidade |
| adapterType | process |
| adapterConfig | hermes-native |
| budgetMonthlyCents | 0 (pendente) |
| status | pendente_criacao |

**Departamento:** Tecnologia  
**Superior hierárquico institucional:** Diretor de Tecnologia  
**Serviços compartilháveis:** Sim — backend

---

### Especialista 3 — Frontend Developer

| Campo | Valor |
|-------|-------|
| id | net-spec-003 |
| name | Frontend Developer |
| role | development |
| title | Desenvolvedor Frontend |
| reportsTo | diretor-tecnologia (vago) |
| capabilities | React/Vue/Angular, implementação de UI, desenvolvimento de interfaces |
| adapterType | process |
| adapterConfig | hermes-native |
| budgetMonthlyCents | 0 (pendente) |
| status | pendente_criacao |

**Departamento:** Tecnologia  
**Superior hierárquico institucional:** Diretor de Tecnologia  
**Serviços compartilháveis:** Sim — interfaces de usuário

---

### Especialista 4 — DevOps Automator

| Campo | Valor |
|-------|-------|
| id | net-spec-004 |
| name | DevOps Automator |
| role | operations |
| title | Automatizador DevOps |
| reportsTo | diretor-tecnologia (vago) |
| capabilities | CI/CD, infraestrutura, cloud ops |
| adapterType | process |
| adapterConfig | hermes-native |
| budgetMonthlyCents | 0 (pendente) |
| status | pendente_criacao |

**Departamento:** Tecnologia  
**Superior hierárquico institucional:** Diretor de Tecnologia  
**Serviços compartilháveis:** Sim — CI/CD, infraestrutura

---

### Especialista 5 — Project Manager Senior

| Campo | Valor |
|-------|-------|
| id | net-spec-005 |
| name | Project Manager Senior |
| role | project-management |
| title | Gerente de Projeto Sênior |
| reportsTo | diretor-gestao-projetos (vago) |
| capabilities | planejar projetos, acompanhar execução, gerenciar dependências, relatar status |
| adapterType | process |
| adapterConfig | hermes-native |
| budgetMonthlyCents | 0 (pendente) |
| status | pendente_criacao |

**Departamento:** Gestão de Projetos  
**Superior hierárquico institucional:** Diretor de Gestão de Projetos  
**Serviços compartilháveis:** Sim — gestão de projetos

---

### Especialista 6 — Technical Writer

| Campo | Valor |
|-------|-------|
| id | net-spec-006 |
| name | Technical Writer |
| role | documentation |
| title | Escritor Técnico |
| reportsTo | diretor-tecnologia (vago) |
| capabilities | documentação técnica, criar e manter docs, versionar documentos |
| adapterType | process |
| adapterConfig | hermes-native |
| budgetMonthlyCents | 0 (pendente) |
| status | pendente_criacao |

**Departamento:** Tecnologia (compartilhado)  
**Superior hierárquico institucional:** Diretor de Tecnologia  
**Serviços compartilháveis:** Sim — todos os departamentos

## Hierarquia (reports_to — árvore estrita)

```
NIVEL 1 — LIDERANCA FUNDADORA
  Fundador (Netto Farias) — reports_to: null
  Conselheiro (IA estratégico) — reports_to: Fundador

NIVEL 2 — DIRECAO EXECUTIVA
  Hermes (Chefe de Gabinete Executivo) — reports_to: Fundador — IMPLANTADO
    |
    +-- Agente Corporativo Global de Orquestracao — reports_to: Hermes (administrativo) — APROVADO COM AJUSTES, PENDENTE
    |
    +-- Diretor de Tecnologia — reports_to: Fundador (institucional) — VAGO (PROPOSTO)
    |
    +-- Diretor de Gestao de Projetos — reports_to: Fundador (institucional) — VAGO (PROPOSTO)

NIVEL 6 — ESPECIALISTAS PRIORITARIOS (reports_to: diretor correspondente)
  Software Architect — reports_to: Diretor de Tecnologia — PENDENTE
  Backend Architect — reports_to: Diretor de Tecnologia — PENDENTE
  Frontend Developer — reports_to: Diretor de Tecnologia — PENDENTE
  DevOps Automator — reports_to: Diretor de Tecnologia — PENDENTE
  Project Manager Senior — reports_to: Diretor de Gestao de Projetos — PENDENTE
  Technical Writer — reports_to: Diretor de Tecnologia — PENDENTE (compartilhado)

AGENTES DE SUPORTE DE HERMES (reports_to: Hermes — IMPLANTADOS)
  Monitor Enterprise — reports_to: Hermes
  Documentacao Institucional — reports_to: Hermes
  Operacional — reports_to: Hermes
  Atendimento — reports_to: Hermes
```

**Regras de hierarquia (conforme ARQUITETURA_DEPARTAMENTAL, seção 4):**
- Hermes não é superior hierárquico (`reports_to`) dos diretores, mas coordena a integração entre eles
- Diretores respondem institucionalmente ao fundador
- Cada especialista reporta ao seu diretor de departamento

## Como funciona no Hermes

- Cada agente é um **perfil de skill** com instruções próprias
- O Hermes delega tarefas via `delegate_task` para cada agente, sem aprovação individual por tarefa
- Os agentes reportam de volta via memória persistente e cron
- Hermes continua automaticamente após cada etapa concluída, sem pausar para confirmação
- O Hermes fica livre para monitorar e atender o fundador em tempo real
- Não depende do servidor Paperclip rodando

## Regra de Continuidade

Hermes continua automaticamente após concluir cada etapa autorizada. Não pausa para pedir confirmação a cada tarefa concluída. A sequência é: delegar → executar → validar → reportar → prosseguir para a próxima etapa.

**Delegação automática:** Hermes usa `delegate_task` para atribuir tarefas aos agentes sem aprovação individual por tarefa. Os agentes executam, reportam resultados para Hermes, e Hermes prossegue com a próxima ação.

## Referências de procedimento

- `references/heartbeat-pattern.md` — atualizar `last_heartbeat_at` e status de agentes no Supabase
- `references/issue-creation-pattern.md` — inserir tarefas na tabela `issues` e atribuir a agentes

## Divergências identificadas e corrigidas

| Item | Antes (incorreto) | Depois (alinhado) |
|------|-------------------|-------------------|
| Nomes dos agentes | Monitor Enterprise, Operacional, Atendimento (não aprovados) | 6 especialistas aprovados pelo Conselheiro (Software Architect, Backend Architect, Frontend Developer, DevOps Automator, Project Manager Senior, Technical Writer) |
| Hierarquia reports_to | Todos reportam a Hermes | Especialistas reportam ao Diretor de Tecnologia ou Diretor de Gestão de Projetos; Hermes coordena mas não é superior hierárquico |
| Documentação Institucional | reports_to: Hermes | Mantido como suporte de Hermes; Technical Writer é um dos 6 especialistas aprovados (reports_to: Diretor de Tecnologia) |
| Orçamentos | Não definidos | 0 (pendente definição do fundador) |
| Status | idle | pendente_criacao (especialistas) / idle (suporte de Hermes) |

---

## Decisões que dependem do fundador (não executadas por Hermes)

Conforme PROPOSTA_EQUIPE v1.2, seção 11 e ARQUITETURA_DEPARTAMENTAL, seção 10:

1. Homologação do modelo de autoridade v1.2
2. Criação do Departamento de Tecnologia e Departamento de Gestão de Projetos
3. Nomeação de Diretor de Tecnologia e Diretor de Gestão de Projetos
4. Nomeação do Agente Corporativo Global de Orquestração
5. Definição de orçamentos mensais (`budgetMonthlyCents`) por agente
6. Definição de `adapterType` e `adapterConfig` para cada agente
7. Definição de `requireBoardApprovalForNewAgents`

---

## Referências de procedimento

- `references/heartbeat-pattern.md` — atualizar `last_heartbeat_at` e status de agentes no Supabase
- `references/issue-creation-pattern.md` — inserir tarefas na tabela `issues` e atribuir a agentes

---

## Próximos passos (dentro da autonomia de Hermes)

1. Manter os 4 agentes de suporte de Hermes ativos e com tarefas em andamento
2. Preparar tarefas no Supabase para quando o fundador homologar a criação das diretorias
3. Não criar cargos definitivos nem alterar estrutura organizacional sem autorização do fundador

---

**Fontes:**
- PROPOSTA_EQUIPE.md v1.2 (D:\NettosCorp\empresa\paperclip\institutional\empresa\02-organization\proposta-equipe\)
- ARQUITETURA_DEPARTAMENTAL.md v1.0 (D:\NettosCorp\empresa\paperclip\institutional\empresa\02-organization\arquitetura-departamental\)
- AGENCY_AGENTS_INVESTIGACAO.md v1.0
- INTEGRACAO.md v1.0

**Status:** Alinhado com documentação institucional. 6 especialistas aguardam homologação do fundador para criação. 4 agentes de suporte de Hermes ativos.
