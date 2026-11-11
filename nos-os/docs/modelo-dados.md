# MODELO DE DADOS — SISTEMA OPERACIONAL NETTOSCORP

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)

Este documento descreve o modelo de dados utilizado pelo Sistema Operacional NettosCorp, baseado nas tabelas existentes no Supabase e reinterpretação dos conceitos do Paperclip.

## Tabelas Existentes (Mantidas)

### companies
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| name | text | Nome da empresa |
| description | text | Descrição |
| status | text | active / paused / archived |
| issue_prefix | text | Prefixo para códigos de issues |
| budget_monthly_cents | integer | Orçamento mensal em centavos |
| require_board_approval_for_new_agents | boolean | Requer aprovação do board para novas funções |

### agents (Funções Organizacionais + Hermes IA)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| company_id | uuid | FK → companies |
| code | varchar(50) | Código único |
| name | varchar(255) | Nome |
| role | text | Papel funcional (executive, direction, specialist, monitoring, documentation, operations, support, orchestrator) |
| title | text | Cargo |
| reports_to | uuid | FK → agents.id (árvore estrita, NULL = fundador) |
| capabilities | text | Capacidades da função |
| adapter_type | text | Tipo de adaptador (process) |
| adapter_config | jsonb | Configuração do adaptador |
| budget_monthly_cents | integer | Orçamento mensal (0 = não definido) |
| permissions | jsonb | Permissões da função |
| last_heartbeat_at | timestamp | Último batimento |
| status | text | active / idle / paused / terminated |
| lifecycle_state | text | Estado do ciclo de vida |

**Regra importante:** Apenas Hermes (code: HERMES-001, role: executive) é agente de IA. Todos os demais registros na tabela `agents` são funções organizacionais (diretores, especialistas, suporte) — não executam raciocínio autônomo de IA.

### goals (Objetivos Organizacionais)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| company_id | uuid | FK → companies |
| title | text | Título do objetivo |
| description | text | Descrição |
| level | text | task / team / company |
| status | text | planned / in_progress / completed / cancelled |
| parent_id | uuid | FK → goals.id (hierarquia de objetivos) |
| owner_agent_id | uuid | FK → agents.id (função responsável) |

### issues (Tarefas Operacionais)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| company_id | uuid | FK → companies |
| goal_id | uuid | FK → goals (opcional) |
| parent_id | uuid | FK → issues.id (hierarquia de tarefas) |
| title | text | Título da tarefa |
| description | text | Descrição |
| status | text | backlog / in_progress / concluido / cancelled |
| priority | text | low / medium / high / urgent |
| assignee_agent_id | uuid | FK → agents.id (função responsável) |
| origin_kind | text | manual / automatic / system |

### Tabelas Auxiliares (Existentes, Pouco ou Nada Utilizadas)
| Tabela | Uso |
|--------|-----|
| environments | Ambientes de execução (vazia) |
| heartbeat_runs | Registro de batimentos (vazia) |
| cost_events | Rastreamento de custos (vazia) |
| chat_channels | Canais de comunicação (vazia) |

---

## Novas Tabelas Planejadas (Não Implementadas Ainda)

| Tabela | Propósito |
|--------|-----------|
| nos_os_functions | Registro de funções organizacionais com metadados detalhados |
| nos_os_task_executions | Histórico de execução de tarefas |
| nos_os_reports | Relatórios gerados automaticamente |
| nos_os_audit_log | Log de alterações no sistema operacional |

---

## Regras de Negócio

1. **Hermes é o único agente de IA** — nenhum outro registro na tabela `agents` executa raciocínio autônomo.
2. **Árvore estrita de reports_to** — cada função reporta a exatamente uma função superior (exceto Hermes que reporta ao fundador).
3. **Não há multi-gerente** — uma função reporta a apenas uma função superior.
4. **Orçamentos são zero por padrão** — budget_monthly_cents = 0 até definição pelo fundador.
5. **Permissões são vazias por padrão** — permissions = {} até definição pelo fundador.
