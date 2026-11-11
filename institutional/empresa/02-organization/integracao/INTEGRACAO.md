# ESTUDO DE INTEGRAÇÃO — AGENCY AGENTS + PAPERCLIP — NETTOSCORP

Versao: 1.0
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/02-organization/integracao/INTEGRACAO.md
Status: PROPOSTA DE ARQUITETURA — sujeita a aprovacao da lideranca fundadora

---

## 1. Objetivo

Estudar como o Agency Agents (catalogo de agentes especialistas) e o Paperclip (control plane organizacional) podem trabalhar em conjunto para construir a primeira equipe corporativa da NettosCorp.

---

## 2. Resumo das duas ferramentas

| Dimensao | Agency Agents | Paperclip |
|----------|--------------|-----------|
| Natureza | Catalogo de agentes especializados (arquivos .md) | Control plane para empresas autônomas de IA |
| O que faz | Define identidade, misao, regras, estilo de comunicacao de cada agente | Gerencia empresas, organograma, tarefas, orcamentos, heartbeats, aprovacoes |
| Modelo de agente | Frontmatter YAML + corpo markdown (instrucoes, regras, entregaveis) | Registro no banco com reports_to, adapterType, adapterConfig, budget, permissions |
| Organizacao | Divisoes planas (17 diretorias), sem hierarquia entre agentes | Arvore estrita via reports_to (CEO -> executivos -> gestores -> especialistas) |
| Comunicacao | Nenhuma entre agentes (cada um independente) | Tasks + comments, hierarquicos, vinculados a objetivos |
| Orcamento/custo | Nenhum | budgetMonthlyCents por agente e por empresa |
| Monitoramento | Nenhum | lastHeartbeatAt, lifecycleState, monitorNextCheckAt |
| Persistencia | Arquivos .md no repositorio | Banco de dados PostgreSQL (Drizzle ORM) |
| Instalacao | Scripts para múltiplas ferramentas (Claude Code, Cursor, Codex, etc.) | Interface web do board operator + API REST |

---

## 3. Perguntas-chave e respostas

### 3.1 Como representar um agente do Agency Agents dentro do Paperclip?

**Resposta:** O agente do Agency Agents fornece o **conteúdo de instrução** (identidade, misao, regras, estilo). O Paperclip fornece a **estrutura organizacional** (cargo, relatorio, orcamento, adaptador, permissoes).

Mapeamento proposto:

| Campo Agency Agents | Campo Paperclip | Como mapear |
|---------------------|-----------------|-------------|
| `name` (frontmatter) | `name` | Nome do agente |
| `description` (frontmatter) | `capabilities` | Descricao da especialidade |
| `emoji` / `color` / `icon` | `icon` / `appearance` | Identidade visual |
| Corpo do markdown (misao, regras, entregaveis) | `adapterConfig.instructions` ou instrucoes do adapter | Conteudo de instrucao do agente |
| `vibe` (personalidade) | `metadata` | Metadados de personalidade |
| Divisao (ex: engineering) | `role` ou departamento | Cargo/area |
| Nao existe | `reportsTo` | Definido na organizacao da NettosCorp |
| Nao existe | `budgetMonthlyCents` | Definido pela lideranca |
| Nao existe | `adapterType` | Definido pelo ambiente de execucao |

**Arquivo de suporte:** O `.paperclip.yaml` (sidecar vendor-specific do Agent Companies Spec) pode conter a configuracao de adapter, runtime, inputs de ambiente e permissoes, enquanto o `AGENTS.md` permanece com o conteudo de instrucao vindo do Agency Agents.

### 3.2 Como associar competencias, skills e ferramentas a cada agente?

**Agency Agents:** Nao possui sistema formal de skills compartilháveis. Cada agente e autocontido. As competencias estao no `description` e no corpo do markdown.

**Paperclip:** Possui sistema de skills (`company_skills`, `company_skill_sources`, `skills`), perfis de acesso (`managed_agent_profiles`), ferramentas (`tools.connections`, `tools.profiles`), e configuracao de adapter.

**Proposta de integracao:**
- Cada agente do Paperclip criado a partir do Agency Agents recebe:
  - `instructions` = conteudo do agente do Agency Agents
  - `skills` = skills relevantes da biblioteca da empresa (se houver)
  - `tools.profiles` = perfis de acesso necessarios para a especialidade (ex: `engineering` para desenvolvedores)
  - `adapterType` e `adapterConfig` = definidos conforme o ambiente de execucao disponível

### 3.3 Como estruturar departamentos e diretorias?

**Agency Agents:** Possui 17 diretorias planas (academic, design, engineering, finance, etc.) que servem como categorias de especialidade, nao como departamentos organizacionais com hierarquia.

**Paperclip:** Nao possui tabela de departamentos. A organizacao e feita por `reports_to` (arvore), `role`, `title`, `capabilities`.

**Proposta de integracao:**
- Usar as diretorias do Agency Agents como **linhas de especialidade** (competencias)
- Usar o `reports_to` do Paperclip para criar a **hierarquia organizacional** (diretorias, departamentos, gestores, supervisores)
- Cada "departamento" da NettosCorp = um sub-grupo na arvore de `reports_to`, com um agente gestor no topo

### 3.4 Como estabelecer relacoes hierarquicas e funcionais?

**Hierarquica (formal):** Via `reports_to` no Paperclip. Arvore estrita: CEO (reportsTo = null) -> diretores -> gestores -> supervisores -> agentes especialistas.

**Funcional (operacional):** Vinculos entre agentes que nao estao na mesma linha hierarquica, mas colaboram em tarefas. No Paperclip, isso acontece por atribuicao de tarefas (`assigneeAgentId`) e comentarios vinculados a issues.

**Proposta:**
- Hierarquica: definida pela lideranca fundadora e registrada no Paperclip via `reports_to`
- Funcional: estabelecida por atribuicao de tarefas e projetos, nao necessariamente seguindo a linha hierarquica

### 3.5 Como um diretor pode delegar tarefas a gestores e especialistas?

**Mecanismo Paperclip:**
1. Diretor cria uma `issue` (tarefa) vinculada a um `goal` (objetivo)
2. Atribui a tarefa a um agente gestor ou especialista (`assigneeAgentId`)
3. O agente recebido executa via heartbeat e reporta de volta
4. O diretor acompanha via `lastHeartbeatAt`, `status`, `monitorNextCheckAt`
5. Aprovacoes: `requireBoardApprovalForNewAgents` controla contratacao; decisoes de tarefa seguem o fluxo normal

**Limite:** Nao há mecanismo de "delegacao em massa" ou "workflow de aprovacao em cadeia" nativo. Cada atribuicao e individual.

### 3.6 Como os agentes podem colaborar entre projetos?

**Mecanismo Paperclip:**
- Tarefas podem ter `parentId` (hierarquia de subtarefas)
- Varios agentes podem trabalhar em tarefas filhas de um mesmo pai
- Comentarios e documentos estao vinculados a issues
- Agentes podem criar casos (`cases`) com handoffs entre agentes
- Projeto (`projects`) agrupa tarefas relacionadas

**Limite:** Nao há mecanismo nativo de "equipe de projeto" com membros definidos. A colaboracao e estabelecida por atribuicao de tarefas e compartilhamento de documentos.

### 3.7 Como supervisores locais se relacionam com agentes corporativos?

**Modelo proposto (conforme a Memoria Institucional da NettosCorp):**
- Agentes locais existentes (projetos ja incorporados) sao preservados inicialmente
- Supervisores locais cuidam dos projetos existentes
- Agentes corporativos globais compreendem o portifolio, conversam com supervisores locais, delegam atividades, acompanham execucoes e recebem relatorios
- Hierarquia formal nao eh confundida com todos os vinculos funcionais

**Implementacao Paperclip:**
- Supervisores locais = agentes na arvore de `reports_to`, responsaveis por projetos existentes
- Agentes corporativos globais = agentes superiores na arvore, com `reportsTo` apontando para diretoros/executivos
- Relacao funcional: atribuicao de tarefas entre agentes de diferentes ramos da arvore

### 3.8 Como acompanhar entregas e prestacao de contas?

**Mecanismo Paperclip:**
- `status` da issue (backlog, in_progress, done, blocked)
- `executionRunId` e `checkoutRunId` vinculados a `heartbeatRuns`
- `workProducts` (trabalhos produzidos)
- `activity_log` (log de acoes mutantes)
- `cost_events` (custos por agente/tarefa/projeto/empresa)
- `lastHeartbeatAt` (atividade recente)
- `monitorNextCheckAt` (proxima verificacao)

**Relatorio de prestacao de contas:** O board pode gerar relatorios a partir dos dados de atividade, custo e status de tarefas.

### 3.9 Como evitar duplicacao de agentes e responsabilidades?

**Risco:** O Agency Agents tem 264 agentes; o Paperclip permite criar quantos agentes forem necessarios. Risco de criar agentes duplicados com responsabilidades sobrepostas.

**Mitigacao proposta:**
1. Catalogo unico: usar o Agency Agents como fonte de especialidades, nao criar agentes duplicados no Paperclip para a mesma funcao
2. Um agente por papel: no Paperclip, criar um agente para cada responsabilidade distinta na organizacao
3. `capabilities` bem definidos: cada agente tem descricao clara do que faz, evitando sobreposicao
4. Revisao periodica: o board revisa se agentes tem responsabilidades sobrepostas

### 3.10 Quais funcionalidades exigem desenvolvimento proprio?

| Funcionalidade | Agency Agents | Paperclip | Necessita desenvolvimento proprio? |
|----------------|---------------|-----------|------------------------------------|
| Catalogo de agentes especializados | Sim | Nao | Nao |
| Organograma e reports_to | Nao | Sim | Nao |
| Gestao de tarefas hierarquicas | Nao | Sim | Nao |
| Orcamento por agente | Nao | Sim | Nao |
| Heartbeat e monitoramento | Nao | Sim | Nao |
| Aprovacoes de board | Nao | Sim (parcial) | Parcial |
| Integracao Agency Agents -> Paperclip (importacao de instrucoes) | Nao | Nao | **Sim** |
| Sincronizacao de conteudo de agente (atualizacao de instrucoes) | Nao | Nao | **Sim** |
| Mapeamento de diretorias Agency Agents -> departamentos Paperclip | Nao | Nao | **Sim** |
| Dashboard unificado de ambas ferramentas | Nao | Nao | **Sim** |

---

## 4. Proposta de arquitetura de integracao

### 4.1 Modelo conceitual

```
+---------------------------------------------------------------+
|                    NettosCorp - Control Plane                 |
|                         (Paperclip)                           |
|                                                               |
|  Company (NettosCorp)                                         |
|  +---------------------------------------------------------+  |
|  | CEO (reportsTo: null)                                   |  |
|  | +-----------------------------------------------------+ |  |
|  | | Diretoria de Estrategia                             | |  |
|  | | +-----------------------------------------------+   | |  |
|  | | | Gestor de Produto                             |   | |  |
|  | | | +-----------------------------------------+   |   | |  |
|  | | | | Agente Especialista (Paperclip)         |   |   | |  |
|  | | | | - instructions: [conteudo Agency Agents]|   |   | |  |
|  | | | | - skills: [skills da empresa]           |   |   | |  |
|  | | | | - tools.profiles: [engineering]         |   |   | |  |
|  | | | | - budget: 5000 centavos/mes             |   |   | |  |
|  | | | +-----------------------------------------+   |   | |  |
|  | | +-----------------------------------------------+   | |  |
|  | +-----------------------------------------------------+ |  |
|  +---------------------------------------------------------+  |
|                                                               |
|  Fonte de instrucoes: Agency Agents (arquivos .md)           |
+---------------------------------------------------------------+
```

### 4.2 Fluxo de criacao de um agente corporativo

1. **Escolher especialidade:** Selecionar um agente do Agency Agents (ex: Software Architect da divisao engineering)
2. **Criar no Paperclip:** Criar registro de agente com `reportsTo` apontando para o gestor responsavel
3. **Configuracao de instrucao:** Copiar o conteudo do .md do Agency Agents para `instructions` do agente no Paperclip
4. **Configuracao de execucao:** Definir `adapterType` e `adapterConfig` conforme ambiente disponível
5. **Orcamento e permissoes:** Definir `budgetMonthlyCents` e `permissions`
6. **Habilitar:** Aprovar contratacao (se `requireBoardApprovalForNewAgents` = true), mover para estado `ready`

### 4.3 Sincronizacao de conteudo

O conteudo do Agency Agents pode evoluir (novas versoes de agentes). O Paperclip nao tem mecanismo nativo de sincronizacao com repositorios externos de agente. Desenvolver processo manual ou script para:
- Exportar agentes atualizados do Agency Agents
- Atualizar `instructions` dos agentes correspondentes no Paperclip
- Versionar as alteracoes (`agent_config_revisions` tabela existe no Paperclip)

---

## 5. Relacao com documentos existentes

Este estudo complementa:
- `empresa/00-governance/MEMORIA_INSTITUCIONAL_NETTOSCORP.md`
- `empresa/01-strategy/ROADMAP_CORPORATIVO.md`
- `empresa/00-governance/GOVERNANCA_CORPORATIVA.md`
- `empresa/03-management-system/SISTEMA_GESTAO_CORPORATIVA.md`

Apoia as Fases 2 e 3 do Roadmap Corporativo.

---

## 6. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/02-organization/integracao/INTEGRACAO.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/02-organization/integracao/INTEGRACAO.md")

---

Nenhum codigo foi alterado. Nenhum agente foi implantado. Nenhuma estrutura de organograma definitiva foi criada.