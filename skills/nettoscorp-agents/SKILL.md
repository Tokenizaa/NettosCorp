---
name: nettoscorp-agents
description: "Agentes básicos da NettosCorp rodando nativamente no Hermes (modelo Paperclip, fora do servidor)."
version: 1.0.0
metadata:
  source: paperclip-parameters
  structure: agents-reportsTo-capabilities-budget
---

# Agentes Básicos — NettosCorp (Hermes Nativo)

Este skill define os agentes básicos que rodam dentro do Hermes, liberando o Chefe de Gabinete para monitorar e atender o fundador continuamente.

## Modelo (parâmetros Paperclip)

| Campo | Significado |
|-------|-------------|
| id | Identificador único do agente |
| name | Nome do agente |
| role | Papel funcional |
| title | Cargo |
| reportsTo | UUID do supervisor (árvore estrita, raiz = Hermes) |
| capabilities | Lista do que o agente faz |
| adapterType | process (roda nativamente no Hermes) |
| adapterConfig | hermes-native |
| budgetMonthlyCents | Orçamento mensal (0 = sem limite até homologação) |
| status | idle / in_progress / paused |
| lifecycleState | ready |

## Agente 1 — Monitor Enterprise

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
- Escalar assuntos complexos para o Chefe de Gabinete

## Hierarquia (reports_to — árvore esttrica)

```
hermes-chefe-gabinete (raiz, reportsTo = fundador)
├── net-ag-001 Monitor Enterprise
├── net-ag-002 Documentação Institucional
├── net-ag-003 Operacional
└── net-ag-004 Atendimento
```

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

## Próximos passos

1. Definir orçamentos mensais (budgetMonthlyCents) se necessário
2. Ativar os agentes via delegação de tarefas no Hermes
3. Integrar com o `enterprise/` para monitoramento real

---

**Fonte**: PAPERCLIP_INVESTIGACAO.md + PROPOSTA_EQUIPE.md (modelo Paperclip)
**Status**: Definido, aguardando homologação do fundador para ativação
