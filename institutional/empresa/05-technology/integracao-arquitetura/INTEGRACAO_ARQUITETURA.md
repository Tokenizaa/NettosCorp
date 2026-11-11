# ARQUITETURA DE INTEGRAÇÃO — AGENCY AGENTS + PAPERCLIP — NETTOSCORP

Versao: 1.0 (proposta, NAO aprovada)
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/05-technology/integracao-arquitetura/INTEGRACAO_ARQUITETURA.md
Status: PROPOSTA DE ARQUITETURA — sujeita a revisao e aprovacao pela lideranca fundadora

---

## 1. Objetivo

Definir a arquitetura de integracao entre o Agency Agents (catalogo de agentes especializados) e o Paperclip (control plane organizacional) para construir a primeira equipe corporativa da NettosCorp.

---

## 2. Modelo conceitual

```
+-----------------------------------------------------------------------+
|                    NettosCorp - Arquitetura Integrada                 |
|                                                                       |
|  +----------------------------------------------------------------+   |
|  |                    CONTROL PLANE (Paperclip)                    |   |
|  |                                                                  |   |
|  |  Empresa: NettosCorp                                             |   |
|  |  +-----------------------------------------------------------+ |   |
|  |  | Nivel 1: Lideranca Fundadora                              | |   |
|  |  |  Fundador (Netto Farias)  +  Conselheiro (IA estrategico) | |   |
|  |  +-----------------------------------------------------------+ |   |
|  |  | Nivel 2: Direcao Executiva                                | |   |
|  |  |  Chefe de Gabinete (Hermes)  +  Diretor de Operacoes      | |   |
|  |  +-----------------------------------------------------------+ |   |
|  |  | Nivel 3: Diretorias                                       | |   |
|  |  |  Tecnologia  |  Gestao de Projetos  |  Qualidade  | Seguranca| |   |
|  |  +-----------------------------------------------------------+ |   |
|  |  | Nivel 4: Gestores e Coordenadores                         | |   |
|  |  +-----------------------------------------------------------+ |   |
|  |  | Nivel 5: Supervisores Locais (projetos existentes)        | |   |
|  |  +-----------------------------------------------------------+ |   |
|  |  | Nivel 6: Agentes Operacionais e Especialistas             | |   |
|  |  +-----------------------------------------------------------+ |   |
|  |                                                                  |   |
|  |  Mecanismos: reports_to, issues, goals, heartbeats, orcamentos, |   |
|  |  aprovacoes, activity_log, cost_events                          |   |
|  +----------------------------------------------------------------+   |
|                                                                       |
|  ^                                                                    |
  |  Conteudo de instrucao (identidade, misao, regras, estilo)         |
|                                                                       |
|  +----------------------------------------------------------------+   |
|  |                 FONTE DE AGENTES (Agency Agents)                |   |
|  |                                                                  |   |
|  |  17 diretorias, 264 agentes especializados                      |   |
|  |  Arquivos .md com frontmatter YAML                               |   |
|  |  engineering, design, security, product, etc.                   |   |
|  +----------------------------------------------------------------+   |
+-----------------------------------------------------------------------+
```

---

## 3. Mapeamento de entidades

| Conceito NettosCorp | Agency Agents | Paperclip |
|---------------------|---------------|-----------|
| Agente especialista | Arquivo .md (identidade, misao, regras) | Registro `agents` (reportsTo, adapter, budget, permissions) |
| Conteudo de instrucao | Corpo do markdown | `adapterConfig.instructions` / `spec.instructions` |
| Especialidade | `description` (frontmatter) | `capabilities` |
| Departamento/Diretoria | Divisao (ex: engineering) | Sub-arvore via `reportsTo` |
| Hierarquia organizacional | Nao existe | `reportsTo` (arvore estrita) |
| Tarefa/entrega | Nao existe | `issues` (assigneeAgentId, parentId, status) |
| Objetivo | Nao existe | `goals` (hierarquico, ownerAgentId) |
| Orcamento | Nao existe | `budgetMonthlyCents` por agente |
| Monitoramento | Nao existe | `lastHeartbeatAt`, `lifecycleState` |
| Aprovacao de contratacao | Nao existe | `requireBoardApprovalForNewAgents`, `approveHire` |

---

## 4. Fluxo de criacao de um agente corporativo

```
1. Lideranca define necessidade (ex: "precisamos de um Software Architect")
2. Chefe de Gabinete seleciona agente do Agency Agents (ex: engineering/software-architect)
3. Copia conteudo do .md para instrucoes do agente no Paperclip
4. Cria registro de agente no Paperclip:
   - name: "Software Architect"
   - reportsTo: <diretor de tecnologia>
   - adapterType: <conforme ambiente>
   - budgetMonthlyCents: <aprovado>
   - capabilities: <descricao da especialidade>
5. Board aprova contratacao (se requireBoardApprovalForNewAgents = true)
6. Agente move para estado "ready" e pode receber tarefas
7. Diretor atribui tarefas (issues) ao agente
8. Agente executa via heartbeat e reporta entregas
```

---

## 5. Sincronizacao de conteudo

O Agency Agents pode evoluir (novas versoes de agentes). O Paperclip nao tem sincronizacao nativa com repositorios externos de agente.

**Processo proposto (manual, inicialmente):**
1. Chefe de Gabinete monitora atualizacoes no repositorio Agency Agents
2. Quando um agente relevante e atualizado, compara versao local no Paperclip
3. Se houver mudanca relevante, atualiza `instructions` do agente no Paperclip
4. Registra a alteracao em `agent_config_revisions` (tabela existente)
5. Comunica a mudanca ao supervisor/responsavel pelo agente

**Ferramenta futura (desenvolvimento proprio):** Script de sincronizacao automatizada que compara arquivos .md do Agency Agents com instrucoes armazenadas no Paperclip.

---

## 6. Interfaces e pontos de integracao

| Ponto | Descricao | Responsavel |
|-------|-----------|-------------|
| Importacao de instrucao | Copiar conteudo .md do Agency Agents para `instructions` do Paperclip | Chefe de Gabinete |
| Mapeamento de especialidade | Vincular divisao do Agency Agents a papel/departamento Paperclip | Diretor de Tecnologia |
| Atribuicao de tarefa | Criar `issue` no Paperclip com `assigneeAgentId` | Gestor/Diretor |
| Acompanhamento | Ler `lastHeartbeatAt`, `status`, `cost_events` | Chefe de Gabinete / Diretor |
| Aprovacao de contratacao | `approveHire` / `rejectHire` no Paperclip | Fundador (board) |

---

## 7. Funcionalidades que exigem desenvolvimento proprio

| Funcionalidade | Descricao | Prioridade |
|----------------|-----------|------------|
| Script de sincronizacao Agency Agents → Paperclip | Comparar e atualizar instrucoes de agentes | Medio |
| Dashboard unificado | Visao combinada de agentes (Agency Agents) e operacao (Paperclip) | Medio |
| Importacao em lote | Criar multiplos agentes no Paperclip a partir de um runbook do Agency Agents | Baixo |
| Sincronizacao de habilidades/skills | Vincular skills do Paperclip a especialidades do Agency Agents | Baixo |

---

## 8. Seguranca e controle de acesso

- Tokens de acesso do Agency Agents (x-access-token nas URLs remotas) nao devem ser armazenados no Paperclip
- Chaves privadas de identidade do Paperclip (Ed25519) nao devem ser compartilhadas com o Agency Agents
- API keys de agentes do Paperclip são bearer tokens, hashed em repouso
- Cada agente do Paperclip tem `permissions` JSONB para controle de acesso
- Agentes nao acessam outras empresas (multi-company isolado)

---

## 9. Relacao com documentos existentes

Este documento complementa:
- `empresa/00-governance/MEMORIA_INSTITUCIONAL_NETTOSCORP.md`
- `empresa/01-strategy/ROADMAP_CORPORATIVO.md`
- `empresa/00-governance/GOVERNANCA_CORPORATIVA.md`
- `empresa/03-management-system/SISTEMA_GESTAO_CORPORATIVA.md`
- `empresa/02-organization/agency-agents-investigacao/AGENCY_AGENTS_INVESTIGACAO.md`
- `empresa/02-organization/paperclip-investigacao/PAPERCLIP_INVESTIGACAO.md`
- `empresa/02-organization/integracao/INTEGRACAO.md`
- `empresa/02-organization/proposta-equipe/PROPOSTA_EQUIPE.md`
- `empresa/05-technology/agency-agents/AGENCY_AGENTS_TECNOLOGIA.md`
- `empresa/05-technology/paperclip/PAPERCLIP_TECNOLOGIA.md`

---

## 10. Decisoes que dependem da lideranca

1. Aprovar a arquitetura de integracao proposta
2. Definir se o processo de sincronizacao e manual ou automatizado
3. Aprovar o desenvolvimento proprio de scripts de integracao (quando necessario)
4. Definir o orçamento para desenvolvimento de integracao (se houver)
5. Definir a ordem de criacao dos agentes iniciais

---

## 11. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/05-technology/integracao-arquitetura/INTEGRACAO_ARQUITETURA.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/05-technology/integracao-arquitetura/INTEGRACAO_ARQUITETURA.md")

---

Nenhum codigo foi alterado. Nenhum agente foi implantado. Nenhuma estrutura de organograma definitiva foi criada.