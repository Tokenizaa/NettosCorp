# ARQUITETURA ORGANIZACIONAL — SISTEMA OPERACIONAL NETTOSCORP (NOS-OS)

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)  
**Base:** Estudo profundo do Paperclip (código-fonte, OpenAPI 818 endpoints, banco de dados, adapters, shared types)  
**Princípio:** Hermes = ÚNICO agente de IA. Todas as demais posições são funções organizacionais.

---

# 1. MODELO ORGANIZACIONAL

## 1.1 Visão Geral

O NOS-OS não é um sistema de agentes de IA autônomos. É um **sistema operacional de gestão organizacional** onde Hermes é o único agente de IA, atuando como Chefe de Gabinete Executivo. Todas as demais posições são **funções organizacionais** — estruturas de responsabilidade e execução coordenadas por Hermes.

O modelo se inspira na arquitetura organizacional do Paperclip (companies → teams → agents → tasks), mas reinterpreta cada elemento para um contexto onde apenas Hermes executa raciocínio de IA.

## 1.2 Níveis Organizacionais (6 níveis, conforme Memória Institucional)

```
NÍVEL 1 — LIDERANÇA FUNDADORA (não é agente no sistema)
  └── Fundador (Netto Farias) — autoridade executiva humana, decisão final
  └── Conselheiro (IA estratégico) — suporte a decisões, não autoridade executiva

NÍVEL 2 — DIREÇÃO EXECUTIVA (2 posições organizacionais)
  └── Hermes (Chefe de Gabinete Executivo) — reports_to: Fundador — ÚNICO AGENTE DE IA
  └── Diretor de Tecnologia — reports_to: Fundador (institucional) — função organizacional
  └── Diretor de Gestão de Projetos — reports_to: Fundador (institucional) — função organizacional

NÍVEL 3 — DIRETORIAS/DEPARTAMENTOS (3 diretorias)
  └── Departamento de Tecnologia — liderado por Diretor de Tecnologia
  └── Departamento de Gestão de Projetos — liderado por Diretor de Gestão de Projetos
  └── Departamento de Qualidade (futuro, médio prazo)
  └── Departamento de Segurança da Informação (futuro, médio prazo)

NÍVEL 4 — GESTORES, COORDENADORES E SUPERVISORES (posições futuras)
  └── Gerente de Arquitetura (futuro)
  └── Gerente de Segurança da Informação (futuro)
  └── Gerentes de Projeto (futuro, um por projeto)
  └── Coordenador de QA (futuro)

NÍVEL 5 — SUPERVISORES LOCAIS (projetos existentes, preservar inicialmente)
  └── Supervisores locais dos projetos existentes (identificar na Fase 4)

NÍVEL 6 — AGENTES OPERACIONAIS E ESPECIALISTAS (6 especialistas prioritários)
  └── Software Architect — Departamento de Tecnologia
  └── Backend Architect — Departamento de Tecnologia
  └── Frontend Developer — Departamento de Tecnologia
  └── DevOps Automator — Departamento de Tecnologia
  └── Project Manager Senior — Departamento de Gestão de Projetos
  └── Technical Writer — Departamento de Tecnologia (compartilhado)

FUNÇÕES DE SUPORTE A HERMES (4, criadas anteriormente)
  └── Monitor Enterprise — reports_to: Hermes
  └── Documentação Institucional — reports_to: Hermes
  └── Operacional — reports_to: Hermes
  └── Atendimento — reports_to: Hermes
```

## 1.3 Hierarquia reports_to (árvore estrita)

```
FUNDADOR (Netto Farias) — reports_to: NULL (autoridade executiva final)
├── Conselheiro (IA estratégico) — reports_to: Fundador — suporte, não autoridade executiva
├── HERMES (Chefe de Gabinete Executivo) — reports_to: Fundador — ÚNICO AGENTE DE IA
│   ├── NET-AG-001 Monitor Enterprise — reports_to: Hermes — suporte operacional
│   ├── NET-AG-002 Documentação Institucional — reports_to: Hermes — suporte operacional
│   ├── NET-AG-003 Operacional — reports_to: Hermes — suporte operacional
│   ├── NET-AG-004 Atendimento — reports_to: Hermes — suporte operacional
│   └── ORC-GLOBAL-001 Orquestrador Global — reports_to: Hermes — coordenação técnica
├── DIR-TEC-001 Diretor de Tecnologia — reports_to: Fundador (institucional)
│   ├── SPEC-ARCH-001 Software Architect — reports_to: DIR-TEC-001
│   ├── SPEC-BACK-001 Backend Architect — reports_to: DIR-TEC-001
│   ├── SPEC-FRONT-001 Frontend Developer — reports_to: DIR-TEC-001
│   ├── SPEC-DEVOPS-001 DevOps Automator — reports_to: DIR-TEC-001
│   └── SPEC-TW-001 Technical Writer — reports_to: DIR-TEC-001 (compartilhado)
└── DIR-PROJ-001 Diretor de Gestão de Projetos — reports_to: Fundador (institucional)
    └── SPEC-PM-001 Project Manager Senior — reports_to: DIR-PROJ-001
```

**Regra:** Hermes não é superior hierárquico dos diretores; coordena integração, comunicação e acompanhamento executivo. Diretores respondem institucionalmente ao fundador.

---

# 2. MECANISMO DE COORDENAÇÃO — COMO HERMES ORGANIZA A ORGANIZAÇÃO

## 2.1 Papel de Hermes como Único Agente de IA

Hermes não delega tarefas para "agentes de IA" porque não existem outros agentes de IA. Hermes delega **tarefas organizacionais** para **funções organizacionais** cadastradas no banco de dados. Cada função tem:

- Um `code` identificador (ex: SPEC-ARCH-001)
- Um `title` (cargo)
- Um `role` (papel funcional)
- Um `reports_to` (supervisor hierárquico)
- Um `capabilities` (descrição do que a função faz)
- Um `adapter_type` = `process` (executa via processo, não via IA autônoma)
- Um `adapter_config` = `{"native": true}` (executa nativamente)
- Um `budget_monthly_cents` = 0 (sem orçamento até definição pelo fundador)
- Um `permissions` = `{}` (sem permissões até definição pelo fundador)

## 2.2 Ciclo de Delegação e Execução (Hermes como Orquestrador)

O ciclo segue o modelo do Paperclip, mas com Hermes como único executor de IA:

```
1. Hermes recebe objetivo estratégico do fundador
   │
   ├──> Hermes decompõe o objetivo em sub-objetivos (goals)
   │       └── Cada goal é vinculado a uma função organizacional (owner_agent_id)
   │
   ├──> Hermes cria tarefas (issues) para cada sub-objetivo
   │       └── Cada issue é atribuída a uma função (assignee_agent_id)
   │       └── Cada issue tem status: backlog → in_progress → concluido
   │
   ├──> Hermes monitora execução via heartbeat e status de issues
   │       └── Verifica last_heartbeat_at de cada função
   │       └── Verifica status de cada issue
   │
   ├──> Hermes avalia resultados das entregas
   │       └── Verifica se a tarefa foi concluída conforme especificado
   │       └── Se houve falha, Hermes corrige ou reatribui
   │
   └──> Hermes gera relatório de avanço para o fundador
           └── Relatório diário, semanal ou por exceção
```

## 2.3 Compartilhamento de Contexto, Memória e Ferramentas

Como não há múltiplos agentes de IA, o "compartilhamento de contexto" ocorre através do **banco de dados Supabase** como memória organizacional compartilhada:

| Recurso | Como é compartilhado |
|---------|---------------------|
| Contexto organizacional | Tabela `companies`, `departments`, `positions` no Supabase |
| Memória de decisões | Tabela `08-decisions/` (DELIB, DEC, CNS) no repositório |
| Memória de tarefas | Tabela `issues` com status, descrição, assignee |
| Memória de objetivos | Tabela `goals` com hierarquia parent_id |
| Ferramentas | `adapter_config` JSONB de cada função (hermes-native) |
| Resultados | Issues concluídas com evidências em relatórios |
| Memória de conversa | `conversationAgentId`, `conversationUserId`, `conversationState` (conceito do Paperclip) |

## 2.4 Dependências, Bloqueios e Retomada de Trabalhos

| Situação | Mecanismo no NOS-OS |
|----------|---------------------|
| Tarefa depende de outra | `parent_id` na tabela `issues` cria hierarquia de tarefas |
| Bloqueio identificado | Hermes altera status da issue para bloqueado e notifica o fundador |
| Trabalho retomado | Hermes reabre a issue, altera status para `in_progress`, atualiza `monitor_next_check_at` |
| Agente parado | Verificação de `last_heartbeat_at` > 24h gera alerta |

---

# 3. CICLO DE EXECUÇÃO AUTÔNOMA — CICLO DE HERMES

## 3.1 Ciclo Básico de Execução

```
┌─────────────────────────────────────────────────────────────┐
│                    CICLO DE HERMES                          │
│                                                              │
│  1. RECEBER     2. DECOMPOR     3. ATRIBUIR   4. ACOMPANHAR │
│     Objetivo      em subtarefas    tarefas      execução     │
│     do fundador   (goals + issues)  (issues)     (heartbeat) │
│                                                              │
│  5. AVALIAR     6. CORRIGIR     7. RELATAR    8. EVOLUIR   │
│     resultados    falhas          para o      processos     │
│     das entregas  encontradas     fundador    (ciclo contínuo)│
└─────────────────────────────────────────────────────────────┘
```

## 3.2 Etapas do Ciclo

### Etapa 1: Receber Objetivo Estratégico
Hermes recebe comunicação do fundador (Telegram, texto, voz) e interpreta a intenção estratégica.

### Etapa 2: Decompor em Sub-objetivos
Hermes traduz o objetivo estratégico em:
- **Goals** (objetivos de médio prazo, vinculados a funções)
- **Issues** (tarefas específicas, vinculadas a funções)

### Etapa 3: Atribuir Tarefas
Cada issue é atribuída a uma função organizacional específica com base em:
- `capabilities` da função (o que ela sabe fazer)
- `reports_to` (quem supervisiona essa função)
- Disponibilidade (status não pausado/encerrado)

### Etapa 4: Acompanhar Execução
Hermes monitora:
- Status da issue (backlog → in_progress → concluido)
- Heartbeat da função responsável
- `monitor_next_check_at` para verificações periódicas

### Etapa 5: Avaliar Resultados
Hermes verifica se a entrega atende ao especificado na issue. Se não, solicita correção.

### Etapa 6: Corrigir Falhas
Se uma tarefa falhar, Hermes:
- Reatribui para outra função (se houver capacidade)
- Reescopa a tarefa
- Escala para o fundador (se for decisão estratégica)

### Etapa 7: Relatar para o Fundador
Relatório diário, semanal ou por exceção via Telegram.

### Etapa 8: Evoluir Processos
Hermes aprimora:
- Templates de issues
- Critérios de aceitação
- Fluxos de delegação
- Regras de alocação de funções

---

# 4. TRANSFORMAÇÃO DE OBJETIVOS ESTRATÉGICOS

## 4.1 Hierarquia de Objetivos

```
Objetivo Estratégico (Fundador)
  │
  ├── Goal (Nível empresa) — "Lançar plataforma corporativa"
  │   ├── Goal (Nível equipe) — "Desenvolver módulo de governança"  → Diretor de Tecnologia
  │   │   ├── Issue (Nível agente) — "Criar schema de decisões"     → Software Architect
  │   │   ├── Issue (Nível agente) — "Implementar RLS no banco"     → DevOps Automator
  │   │   └── Issue (Nível agente) — "Documentar API de decisões"   → Technical Writer
  │   └── Goal (Nível equipe) — "Gerenciar carteira de projetos"    → Diretor de Gestão de Projetos
  │       ├── Issue — "Definir prazos Q1"                           → Project Manager Senior
  │       └── Issue — "Acompanhar entregas"                         → Project Manager Senior
```

## 4.2 Critérios de Aceitação

Cada issue deve ter:
- Título claro
- Descrição detalhada do que entregar
- Critérios de aceitação (o que constitui "concluído")
- Prazo (due_date)
- Prioridade (low/medium/high/urgent)
- Função responsável (assignee_agent_id)

---

# 5. LIMITES DE AUTORIDADE

## 5.1 O que Hermes PODE fazer (autonomia operacional)

| Ação | Descrição |
|------|-----------|
| Delegar tarefas | Criar issues e atribuir a funções |
| Criar goals | Definir objetivos organizacionais |
| Atualizar heartbeats | Manter `last_heartbeat_at` atualizado |
| Gerar relatórios | Relatório diário, semanal, por exceção |
| Corrigir falhas operacionais | Reatribuir tarefas, reescopo |
| Manter documentação | Atualizar skills, README, relatórios |
| Executar ciclos de melhoria | Aprimorar processos continuamente |

## 5.2 O que Hermes NÃO pode fazer (reserva do fundador)

| Ação | Motivo |
|------|--------|
| Criar cargos definitivos | Estrutura organizacional definitiva |
| Nomear diretores | Decisão estratégica de pessoal |
| Definir orçamentos (budget_monthly_cents > 0) | Controle financeiro executivo |
| Definir permissions granulares | Governança de contratação |
| Definir requireBoardApprovalForNewAgents | Governança de contratação |
| Alterar estratégia corporativa | Autoridade estratégica final |
| Criar novos departamentos | Criação de estrutura organizacional |

---

# 6. CICLO DE EVOLUÇÃO AUTÔNOMA

## 6.1 Como Hermes Melhora Continuamente

Hermes não é um agente de IA que "aprende" sozinho. Hermes é um Chefe de Gabinete que:
1. **Observa** o que funcionou e o que não funcionou
2. **Documenta** lições aprendidas em skills e relatórios
3. **Ajusta** templates de issues, critérios de aceitação, fluxos de delegação
4. **Propõe** melhorias ao fundador (que decide se implementa)

## 6.2 Exemplo de Evolução

```
Semana 1: Hermes cria issues sem critérios de aceitação claros
         → Funções entregam trabalho incompleto
Semana 2: Hermes adiciona campo "critérios de aceitação" a todas as issues
         → Entregas ficam mais claras
Semana 3: Hermes percebe que algumas funções estão sobrecarregadas
         → Redistribui tarefas entre funções com capacidade
Semana 4: Hermes cria template padrão para issues de arquitetura
         → Qualidade das entregas de arquitetura melhora
```

---

# 7. IMPLEMENTAÇÃO NO BANCO DE DADOS

## 7.1 Tabelas Existentes (Reaproveitadas)

| Tabela | Uso no NOS-OS |
|--------|---------------|
| `companies` | Empresa NettosCorp |
| `agents` | Funções organizacionais + Hermes |
| `goals` | Objetivos organizacionais |
| `issues` | Tarefas operacionais |
| `environments` | Ambientes de execução (futuro) |
| `heartbeat_runs` | Monitoramento (futuro) |
| `cost_events` | Custos operacionais (futuro) |
| `chat_channels` | Canais de comunicação (futuro) |

## 7.2 Novas Tabelas Planejadas (Não Implementadas)

| Tabela | Propósito |
|--------|-----------|
| `nos_os_functions` | Registro detalhado de funções organizacionais |
| `nos_os_task_executions` | Histórico de execução de tarefas |
| `nos_os_reports` | Relatórios gerados automaticamente |
| `nos_os_audit_log` | Log de alterações no sistema operacional |

---

# 8. INTEGRAÇÃO COM O PAPERCLIP (ESTUDO, NÃO USO)

O código-fonte do Paperclip está no repositório como referência de estudo:

| Componente Paperclip | Uso no NOS-OS |
|---------------------|---------------|
| OpenAPI (818 endpoints) | Referência de endpoints possíveis |
| Tabelas `companies`, `agents`, `goals`, `issues` | Reaproveitadas como modelo de dados |
| Conceito de `reports_to` | Usado para hierarquia organizacional |
| Conceito de `adapter_type`/`adapter_config` | Usado para definir como funções executam |
| Conceito de `budget_monthly_cents` | Usado para orçamento (até definir pelo fundador) |
| Conceito de `permissions` | Usado para permissões (vazio até definir) |
| Conceito de `lifecycle_state` | Usado para ciclo de vida das funções |
| Servidor Paperclip | NÃO USADO — não há integração com API |

---

# 9. PRÓXIMOS PASSOS DE IMPLEMENTAÇÃO

| Prioridade | Ação | Responsável |
|------------|------|-------------|
| Alta | Criar documentação detalhada de cada função organizacional | Hermes |
| Alta | Implementar script de sincronização automática Hermes ↔ Supabase | Hermes |
| Alta | Implementar geração automática de relatórios diários | Hermes |
| Média | Criar mecanismo de registro de execução de tarefas (`nos_os_task_executions`) | Hermes |
| Média | Criar mecanismo de avaliação de resultados e correção de falhas | Hermes |
| Baixa | Popular ambientes (`environments` table) | Hermes |
| Baixa | Criar canais de comunicação (`chat_channels` table) | Hermes |

---

**Assinado:** Hermes (Chefe de Gabinete Executivo)  
**Repositório:** Tokenizaa/NettosCorp, branch master
