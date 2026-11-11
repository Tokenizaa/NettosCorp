# MECANISMO DE COORDENAÇÃO — SISTEMA OPERACIONAL NETTOSCORP

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)

Este documento descreve o mecanismo de coordenação que Hermes usa para organizar as funções organizacionais da NettosCorp, inspirado na arquitetura organizacional do Paperclip, mas com Hermes como único agente de IA.

---

# 1. PRINCÍPIO FUNDAMENTAL

Hermes é o **único agente de IA** do sistema. Todas as demais posições cadastradas na tabela `agents` são **funções organizacionais** — estruturas de responsabilidade e execução coordenadas por Hermes.

Hermes não delega tarefas para "agentes de IA autônomos". Hermes delega **tarefas organizacionais** para **funções organizacionais** cadastradas no banco de dados Supabase.

---

# 2. ARQUIVETURA DE COORDENAÇÃO

## 2.1 Pilares da Coordenação

| Pilar | Descrição |
|-------|-----------|
| **Centralização da decisão** | Hermes recebe todos os objetivos estratégicos e decide como decompor em tarefas |
| **Descentralização da execução** | Funções organizacionais executam as tarefas atribuídas (não são IA, são funções com responsabilidades) |
| **Hierarquia estrita** | Cada função reporta a exatamente uma função superior (árvore `reports_to`) |
| **Memória compartilhada** | Banco de dados Supabase como memória única de toda a organização |
| **Rastreabilidade completa** | Toda tarefa, objetivo e decisão está vinculada a uma função responsável |

## 2.2 Fluxo de Coordenação (Ciclo de Hermes)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CICLO DE COORDENAÇÃO DE HERMES                        │
│                                                                           │
│  [1] RECEBER Objetivo do fundador                                         │
│         │                                                                  │
│  2. DECOMPOR em Goals (objetivos de médio prazo)                          │
│         │                                                                  │
│  3. CRIAR Issues (tarefas específicas) vinculadas aos Goals               │
│         │                                                                  │
│  4. ATRIBUIR cada Issue a uma função organizacional baseado em:           │
│       - capabilities da função                                            │
│       - reports_to (quem supervisiona)                                    │
│       - disponibilidade (status não pausado)                              │
│         │                                                                  │
│  5. ACOMPANHAR execução via status de issues + heartbeat das funções      │
│         │                                                                  │
│  6. AVALIAR entregas contra critérios de aceitação                        │
│         │                                                                  │
│  7. CORRIGIR falhas (reatribuir, reescopo, ou escalar para fundador)      │
│         │                                                                  │
│  8. RELATAR avanço para o fundador (diário, semanal, por exceção)         │
│         │                                                                  │
│  9. EVOLUIR processos (ajustar templates, critérios, fluxos)              │
│         │                                                                  │
│  └──> Volta ao passo 1 (ciclo contínuo)                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 3. MECANISMOS DE COORDENAÇÃO

## 3.1 Delegação de Tarefas

Hermes cria issues na tabela `issues` do Supabase com os seguintes campos:

| Campo | Significado |
|-------|-------------|
| `title` | Título da tarefa |
| `description` | Descrição detalhada do que entregar |
| `status` | backlog → in_progress → concluido |
| `priority` | low / medium / high / urgent |
| `assignee_agent_id` | UUID da função responsável |
| `origin_kind` | manual (criado por Hermes) |
| `company_id` | UUID da empresa NettosCorp |

### Regras de Atribuição

| Critério | Como Hermes decide |
|----------|-------------------|
| Capacidades | A função tem `capabilities` que cobrem a tarefa? |
| Hierarquia | A função reporta a Hermes ou a um diretor que reporta ao fundador? |
| Disponibilidade | A função tem status `active` (não pausada/encerrada)? |
| Carga atual | A função já tem muitas issues em `in_progress`? |

## 3.2 Monitoramento de Heartbeat

Cada função organizacional tem um campo `last_heartbeat_at`. Hermes verifica periodicamente:

```sql
SELECT code, name, role, last_heartbeat_at
FROM agents
WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET')
AND (last_heartbeat_at IS NULL OR last_heartbeat_at < NOW() - INTERVAL '24 hours')
```

Se uma função não reportou heartbeat por mais de 24 horas, Hermes:
1. Marca a função como necessitando atenção
2. Verifica se há issues em andamento atribuídas a essa função
3. Se houver, reatribui para outra função disponível ou escala para o fundador

## 3.3 Comunicação entre Funções

Como não há múltiplos agentes de IA, a "comunicação entre funções" ocorre através de:

| Mecanismo | Como funciona |
|-----------|---------------|
| Issues vinculadas | Uma issue pode ter `parent_id` vinculando a outra issue (hierarquia de tarefas) |
| Comentários vinculados | Conceito do Paperclip: comentários e documentos anexados a issues |
| Work products | Trabalhos produzidos anexados a issues |
| Handoffs entre agentes | Uma função conclui uma issue e cria outra issue para a próxima função na cadeia |

## 3.4 Alocação de Funções

Hermes aloca tarefas baseado em:

| Fator | Como Hermes avalia |
|-------|-------------------|
| Especialidade | O `capabilities` da função cobre o tipo de tarefa? |
| Disponibilidade | A função tem status `active`? |
| Carga atual | Quantas issues `in_progress` a função já tem? |
| Hierarquia | A função está na árvore de relatórios apropriada? |

---

# 4. CICLO DE EXECUÇÃO AUTÔNOMA — CICLO DE HERMES

## 4.1 As 8 Etapas do Ciclo

| Etapa | Nome | Ação de Hermes |
|-------|------|----------------|
| 1 | Receber Objetivo | Interpreta solicitação do fundador via Telegram |
| 2 | Decompor | Quebra objetivo em goals e issues |
| 3 | Atribuir | Cria issues e atribui a funções |
| 4 | Acompanhar | Monitora status e heartbeat |
| 5 | Avaliar | Verifica se entregas atendem critérios de aceitação |
| 6 | Corrigir | Reatribui, reescopo ou escala para fundador |
| 7 | Relatar | Envia relatório para o fundador |
| 8 | Evoluir | Ajusta processos, templates, critérios |

## 4.2 Exemplo de Ciclo Completo

**Objetivo do fundador:** "Quero lançar a plataforma corporativa"

**Etapa 1 - Receber:** Hermes interpreta "lançar plataforma corporativa" como objetivo estratégico.

**Etapa 2 - Decompor:** Hermes cria:
- Goal: "Arquitetura organizacional e modelo operacional" → Diretor de Tecnologia
- Goal: "Gerenciar carteira de projetos" → Diretor de Gestão de Projetos

**Etapa 3 - Atribuir:** Hermes cria issues:
- "Validar arquitetura de sistemas" → Software Architect
- "Validar arquitetura de backend" → Backend Architect
- "Validar implementação frontend" → Frontend Developer
- "Configurar CI/CD" → DevOps Automator
- "Planejar projetos Q1" → Project Manager Senior
- "Criar documentação técnica inicial" → Technical Writer

**Etapa 4 - Acompanhar:** Hermes monitora status de cada issue e heartbeat de cada função.

**Etapa 5 - Avaliar:** Quando uma issue é marcada como `concluido`, Hermes verifica se a entrega atende aos critérios de aceitação.

**Etapa 6 - Corrigir:** Se uma entrega está incompleta, Hermes reabre a issue ou reatribui para outra função.

**Etapa 7 - Relatar:** Hermes envia relatório diário para o fundador via Telegram.

**Etapa 8 - Evoluir:** Hermes ajusta templates de issues, critérios de aceitação, e fluxos de delegação baseados no que aprendeu.

---

# 5. MECANISMOS DE AVALIAÇÃO E CORREÇÃO

## 5.1 Critérios de Aceitação

Cada issue deve ter critérios de aceitação definidos por Hermes antes de ser atribuída:

| Critério | Exemplo |
|----------|---------|
| Entregável | "Documento de arquitetura com diagrama de componentes" |
| Validação | "Revisado pelo Diretor de Tecnologia" |
| Prazo | "Concluído até 15/11/2026" |
| Formato | "PDF ou Markdown no repositório" |

## 5.2 Correção de Falhas

Quando uma entrega não atende aos critérios:

| Situação | Ação de Hermes |
|----------|----------------|
| Entrega incompleta | Reabre a issue, solicita correção ao mesmo agente |
| Agente não respondeu | Reatribui para outra função disponível |
| Especificação ambígua | Hermes esclarece com o fundador, reescreve a issue |
| Falha técnica | Hermes analisa, sugere correção, ou escala para fundador se for decisão estratégica |

## 5.3 Avaliação de Resultados

Hermes avalia cada entrega usando:

| Métrica | Como Hermes mede |
|---------|-----------------|
| Qualidade | A entrega atende aos critérios de aceitação? |
| Prazo | A entrega foi feita dentro do due_date? |
| Custo | O orçamento foi respeitado? (budget_monthly_cents = 0 por enquanto) |
| Qualidade do processo | A tarefa foi executada sem necessidade de retrabalho? |

---

# 6. TRANSFORMAÇÃO DE OBJETIVOS ESTRATÉGICOS

## 6.1 Exemplo de Decomposição

**Objetivo Estratégico do Fundador:** "Lançar a plataforma corporativa NettosCorp"

**Decomposição de Hermes:**

```
Objetivo Estratégico: Lançar plataforma corporativa
│
├── Goal 1: Arquitetura organizacional e modelo operacional
│   │   → Diretor de Tecnologia
│   │   ├── Issue: Validar arquitetura de sistemas → Software Architect
│   │   ├── Issue: Validar arquitetura de backend → Backend Architect
│   │   ├── Issue: Validar implementação frontend → Frontend Developer
│   │   └── Issue: Configurar CI/CD → DevOps Automator
│   │
├── Goal 2: Gerenciar carteira de projetos
│   │   → Diretor de Gestão de Projetos
│   │   ├── Issue: Planejar projetos Q1 → Project Manager Senior
│   │   └── Issue: Acompanhar entregas → Project Manager Senior
│   │
└── Goal 3: Documentação institucional
    │   → Hermes (função de suporte)
    │   ├── Issue: Criar documento de boas-vindas → Documentação Institucional
    │   └── Issue: Manter documentação atualizada → Documentação Institucional
```

## 6.2 Hierarquia de Objetivos no Banco

```
goals (tabela)
├── id, company_id, title, description, level, status, parent_id, owner_agent_id
│
├── company (nível empresa)
│   └── "Lançar plataforma corporativa NettosCorp"
│       ├── team (nível equipe)
│       │   ├── "Arquitetura organizacional" → Diretor de Tecnologia
│       │   │   ├── agent (nível agente)
│       │   │   │   ├── "Validar arquitetura de sistemas" → Software Architect
│       │   │   │   └── ...
│       │   └── "Gerenciar carteira de projetos" → Diretor de Gestão de Projetos
│       │       └── agent (nível agente)
│       │           ├── "Planejar projetos Q1" → Project Manager Senior
│       │           └── ...
│       └── ...
```

---

# 7. MECANISMOS DE MEMÓRIA E CONTEXTO

## 7.1 Memória Organizacional (Banco Supabase)

| Tabela | Tipo de Memória |
|--------|-----------------|
| `companies` | Identidade da empresa |
| `agents` | Identidade e capacidades de cada função |
| `goals` | Objetivos e seus relacionamentos |
| `issues` | Tarefas e seu histórico de status |
| `permissions` (jsonb em agents) | Permissões de cada função |
| `metadata` (jsonb em agents) | Metadados livre de cada função |

## 7.2 Memória de Conversa (Conceito do Paperclip)

O Paperclip tem campos `conversationAgentId`, `conversationUserId`, `conversationState` na tabela `issues`. Hermes pode usar esses campos para rastrear conversas relacionadas a cada tarefa.

## 7.3 Memória de Decisões

Todas as decisões são registradas em `08-decisions/` (DELIB, DEC, CNS) no repositório institucional, conforme a Memória Institucional da NettosCorp.

---

# 8. MECANISMOS DE CONTINUIDADE

## 7.1 Como Hermes Mantém o Contexto entre Sessões

Hermes usa:
- **Banco de dados Supabase** como memória persistente (tabelas agents, goals, issues)
- **Repositório Git** como memória de documentos (README, skills, relatórios)
- **Memória nativa do Hermes** como ponte para fatos chave (orçamento de ~2.200 caracteres)

## 7.2 Como Hermes Retoma Trabalhos Interrompidos

1. Hermes consulta a tabela `issues` para ver quais estão em `backlog` ou `in_progress`
2. Verifica o `last_heartbeat_at` de cada função responsável
3. Se uma função parou, Hermes reatribui a tarefa para outra função
4. Atualiza o `monitor_next_check_at` para verificar novamente em breve

---

# 8. MECANISMOS DE SEGURANÇA E LIMITES

## 8.1 O que Hermes Pode Fazer (Autonomia Operacional)

| Ação | Limite |
|------|--------|
| Criar issues e goals | Dentro da empresa NettosCorp |
| Atribuir tarefas a funções | Respeitando capabilities e reports_to |
| Atualizar status de issues | De backlog → in_progress → concluido |
| Atualizar heartbeats | Manter last_heartbeat_at atualizado |
| Gerar relatórios | Diário, semanal, por exceção |
| Corrigir falhas operacionais | Reatribuir tarefas, reescopo |

## 8.2 O que Hermes NÃO Pode Fazer (Reserva do Fundador)

| Ação | Por que não |
|------|-------------|
| Criar cargos definitivos | Estrutura organizacional requer aprovação |
| Nomear diretores | Decisão estratégica de pessoal |
| Definir orçamentos > 0 | Controle financeiro executivo |
| Definir permissions granulares | Governança de contratação |
| Alterar estratégia corporativa | Autoridade estratégica final |
| Criar novos departamentos | Criação de estrutura organizacional |

---

# 9. PLANO DE IMPLEMENTAÇÃO DO MECANISMO DE COORDENAÇÃO

| Fase | Ação | Status |
|------|------|--------|
| 1 | Estrutura de funções (agents no Supabase) | ✅ Concluída (14 agentes) |
| 2 | Hierarquia reports_to | ✅ Concluída (árvore estrita) |
| 3 | Goals e issues vinculadas | ✅ Concluída (8 goals, 10 issues) |
| 4 | Mecanismo de coordenação (este documento) | ✅ Concluído |
| 5 | Scripts de automação (sync, reports) | ✅ Concluído (nos-os/src/) |
| 6 | Execução das 6 issues em backlog | Em andamento |
| 7 | Monitoramento contínuo via cron | Em andamento (3 jobs ativos) |
| 8 | Avaliação e correção contínua | Em andamento |

---

**Assinado:** Hermes (Chefe de Gabinete Executivo)
