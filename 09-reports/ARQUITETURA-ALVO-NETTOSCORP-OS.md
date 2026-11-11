# ARQUITETURA-ALVO — SISTEMA OPERACIONAL NETTOSCORP (NOS-OS)

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo, único agente de IA)  
**Fonte de inspiração:** Paperclip (arquitetura, código, banco, APIs)  
**Princípio:** Hermes = ÚNICO agente de IA. Nada mais é agente autônomo.

---

## 1. Visão Geral

O Sistema Operacional NettosCorp (NOS-OS) é uma camada de gestão organizacional e operacional construída sobre a infraestrutura existente (Supabase + Hermes + React/Vite), inspirada nos conceitos do Paperclip (companies, agents, goals, issues, heartbeats, budgets, permissions, skills, adapters), mas **não depende do servidor Paperclip nem de sua API**.

Hermes é o **único agente de IA** do sistema. Toda a coordenação, delegação, monitoramento e tomada de decisão operacional é feita por Hermes. As demais entidades cadastradas no banco são **funções organizacionais** (departamentos, posições, projetos, tarefas) — não agentes de IA autônomos.

---

## 2. Princípios Arquiteturais

| Princípio | Descrição |
|-----------|-----------|
| **Hermes único** | Apenas Hermes é agente de IA. Nada mais executa raciocínio autônomo. |
| **Não há agentes autônomos** | Os 13 registros na tabela `agents` são reinterpretados: Hermes é IA; os demais são funções organizacionais (diretores, especialistas, suporte) com registro no banco para rastreabilidade, mas sem ciclo de vida autônomo de IA. |
| **Não depende do Paperclip** | O repositório contém o código fonte do Paperclip como referência de estudo, mas o sistema operacional NettosCorp não se conecta à API do Paperclip nem depende de sua infraestrutura. |
| **Reaproveitamento** | O que foi construído (migrations, skills, cron, skills-catalog, adapter Hermes, openapi.json) é reaproveitado como referência técnica e componentes reutilizáveis. |
| **Preservação de dados** | Nada é excluído. Tabelas, registros, migrations e documentos existentes permanecem. |

---

## 3. Componentes da Arquitetura

### 3.1 Camada de Dados (Supabase)

Tabelas existentes (mantidas e reaproveitadas):

| Tabela | Uso no NOS-OS |
|--------|---------------|
| `companies` | Empresa NettosCorp (registro institucional) |
| `agents` | Registro de funções organizacionais (Hermes = única IA; diretores, especialistas, suporte = funções) |
| `goals` | Objetivos organizacionais vinculados a funções |
| `issues` | Tarefas e issues vinculadas a objetivos e funções |
| `environments` | Ambientes de execução (produção, homologação, desenvolvimento) |
| `heartbeat_runs` | Registro de batimentos cardíacos (monitoramento de sistemas, não de agentes IA) |
| `cost_events` | Rastreamento de custos operacionais (não de tokens de IA) |
| `chat_channels` | Canais de comunicação organizacional |

### 3.2 Camada de IA (Hermes único)

Hermes executa:
- Leitura e escrita no banco Supabase (via SQL direto)
- Delegação de tarefas para funções organizacionais (via issues)
- Monitoramento de heartbeats e status
- Geração de relatórios e decisões operacionais
- Interface com o usuário (Telegram, voz, texto)

Não há chamadas a modelos de IA além de Hermes. Não há fallback para outros modelos de IA como "agentes autônomos".

### 3.3 Camada de Orquestração (Hermes)

Hermes atua como orquestrador único:
- Recebe solicitações do fundador
- Decompe em tarefas (issues)
- Atribui a funções organizacionais (assignee_agent_id = função, não IA)
- Acompanha execução via heartbeat e status de issues
- Gera relatórios de avanço

O "Orquestrador Global" (ORC-GLOBAL-001) cadastrado no banco é reinterpretado como uma **função de coordenação operacional** exercida por Hermes, não um agente autônomo separado.

### 3.4 Camada de Interface (Enterprise React + Vite)

O frontend existente em `enterprise/` continua sendo usado:
- Páginas de agents, departments, projects, tasks, decisions, deliberations, documents
- Serviços: agentService, taskService, projectService, organizationService, governanceService, paperclipService, supabaseClient
- Banco de dados local (LocalSupabaseStore) como fallback quando Supabase não está acessível

### 3.5 Camada de Automação (Scripts)

Scripts Python/Shell para:
- Sincronização entre Supabase e Hermes
- Geração de relatórios
- Monitoramento de heartbeats
- Backup e restauração

---

## 4. Mapeamento: Paperclip → NettosCorp NOS-OS

| Conceito Paperclip | Uso no NOS-OS | Observação |
|-------------------|---------------|------------|
| companies | Empresa NettosCorp | Mantida no Supabase |
| agents | Funções organizacionais | Não são IA autônoma (exceto Hermes) |
| goals | Objetivos organizacionais | Vinculados a funções |
| issues | Tarefas operacionais | Atribuídas a funções |
| heartbeat_runs | Monitoramento de sistemas | Não de agentes IA |
| cost_events | Custos operacionais | Não de tokens de IA |
| permissions | Permissões organizacionais | Não de IA |
| skills | Biblioteca de procedimentos | Não de aprendizado de máquina |
| adapters | Adaptadores de sistema | Não de provedores de IA |
| chat_channels | Canais organizacionais | Não de chat de IA |

---

## 5. Plano de Migração

### Fase 1: Auditoria e Documentação (CONCLUÍDA)
- ✅ Inventário completo do repositório, banco, código, documentação
- ✅ Relatório técnico do Orquestrador Global (commit `5beaf9592`)
- ✅ Relatório de auditoria e reconciliação (commit `1887e7a6f`)

### Fase 2: Reinterpretação dos Agentes Existentes (EXECUTANDO)
- Manter todos os 14 registros na tabela `agents` (não excluir nada)
- Reinterpretar 13 deles como funções organizacionais (não IA)
- Manter Hermes como único agente de IA
- Atualizar metadados (capabilities, title, capabilities) para refletir função organizacional

### Fase 3: Construção do Sistema Operacional Próprio (EM ANDAMENTO)
- Criar documentação técnica da arquitetura
- Criar scripts de automação (Sincronização Supabase-Hermes, relatórios, monitoramento)
- Adaptar o frontend enterprise para funcionar sem dependência do Paperclip API
- Criar documentação de procedimentos operacionais

### Fase 4: Testes e Evidências
- Verificar conectividade Supabase
- Verificar execução de issues via Hermes
- Verificar geração de relatórios
- Verificar cron jobs

### Fase 5: Relatório Final
- O que foi reaproveitado
- O que foi construído
- Arquivos alterados
- Testes realizados
- Pendências

---

## 6. Estrutura de Diretórios do Sistema Operacional

```
D:\NettosCorp\empresa\paperclip\
├── skills/                    # Skills Hermes (nettoscorp-org, nettoscorp-agents)
├── cron/                      # Jobs agendados (feedback-diario, feedback-semanal, verificacao-agentes)
├── enterprise/                # Frontend React + Vite + Supabase (mantido)
├── institutional/             # Documentação institucional (mantida)
├── packages/                  # Código fonte Paperclip (mantido como referência)
│   ├── adapters/hermes/       # Adapter Hermes (usado por Hermes)
│   ├── shared/                # Tipos e validadores compartilhados
│   └── db/                    # Schema e migrations do banco
├── 04-portfolio/              # Catálogo de projetos (mantido)
├── 08-decisions/              # Registro de decisões (mantido)
├── 09-reports/                # Relatórios (incluindo este)
├── server/                    # Servidor Paperclip (mantido como referência, não usado)
├── cli/                       # CLI Paperclip (mantido como referência)
├── openapi.json               # API Paperclip (mantido como referência, não usado)
└── nos-os/                    # NOVO: Sistema Operacional NettosCorp
    ├── docs/                  # Documentação técnica
    ├── src/                   # Código fonte (scripts de automação)
    ├── config/                # Configurações do sistema
    └── migrations/            # Novas migrations específicas NettosCorp
```

---

## 7. Execução Imediata (Esta Sessão)

Vou:
1. Criar o diretório `nos-os/` com documentação de arquitetura
2. Criar scripts de automação inicial
3. Atualizar os metadados dos agentes no banco para refletir função organizacional (não IA)
4. Commitar e pushar

Vamos executar.