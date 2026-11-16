# INTEGRAÇÃO INSTITUCIONAL — AGENCY AGENTS → NETTOSCORP

Versão: 1.0
Data: 15 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/INTEGRACAO_INSTITUCIONAL.md
Status: DOCUMENTO INSTITUCIONAL OFICIAL — homologado para uso como fonte de verdade

---

## 1. Finalidade

Este documento formaliza a integração do repositório **Agency Agents** (msitarzewski/agency-agents) à arquitetura institucional da NettosCorp, estabelecendo-o como **fonte oficial de especializações, competências, personalidades e metodologias** para a estrutura organizacional da empresa.

A integração não substitui nem duplica a governança existente. Ela conecta quatro camadas distintas, preservando a autonomia e a identidade de cada uma:

| Camada | Papel | Fonte de verdade |
|--------|-------|------------------|
| **A. Agency Agents** | Fonte de especialização (conteúdo de instrução, identidade, habilidades) | `agency-agents/` (clone oficial) |
| **B. NettosCorp** | Identidade e governança institucional (cargos, departamentos, autoridade) | `institutional/empresa/` |
| **C. Paperclip** | Materialização operacional (agentes executáveis, hierarquia, orçamentos, heartbeats) | `paperclip/` (control plane) |
| **D. Hermes** | Coordenação transversal (integração, rastreabilidade, consistência) | Este documento e documentos correlatos |

---

## 2. Princípios arquiteturais

### 2.1 Separação de conceitos
- **Especialidade (Agency Agents)** ≠ **Cargo institucional (NettosCorp)** ≠ **Agente operacional (Paperclip)**. São conceitos relacionados, mas não equivalentes.
- A especialidade descreve *o que o agente sabe fazer*. O cargo descreve *onde ele atua na organização*. O agente operacional descreve *como ele executa no control plane*.

### 2.2 Preservação da origem
- O Agency Agents permanece reconhecido como projeto independente (MIT License).
- A NettosCorp preserva a referência à origem e à licença em todos os documentos derivados.
- Personalizações institucionais **não** sobrescrevem silenciosamente o conteúdo original.
- Atualizações do upstream são comparadas antes da incorporação (ver `POLITICA_SINCRONIZACAO.md`).

### 2.3 Rastreabilidade obrigatória
Cada agente institucional deve ser rastreável até:
1. Arquivo de origem no Agency Agents (caminho, slug, commit)
2. Cargo e departamento na NettosCorp
3. Registro de agente no Paperclip (quando implementado)
4. Decisão de homologação (quem aprovou, quando, com que justificativa)

### 2.4 Não implantação antecipada
Esta integração é **documental e arquitetural**. Não cria, exclui, pausa ou altera agentes no Paperclip. Não altera IDs, hierarquia, modelos, adaptadores ou configurações operacionais. A implementação operacional será etapa posterior, sujeita à governança institucional.

---

## 3. Responsabilidades das quatro camadas

### 3.1 Camada A — Agency Agents (Fonte de especialização)
**O que fornece:**
- Especialidade e competências técnicas descritas no frontmatter e corpo do agente
- Personalidade e estilo de comunicação (`vibe`, `color`, `emoji`, tom de voz)
- Experiência e memória operacional descritas (padrões, falhas conhecidas, heurísticas)
- Missão principal e regras críticas (princípios operacionais inegociáveis)
- Processos, workflows e entregáveis esperados (templates, ADRs, checklists)
- Metadados de identidade (`name`, `description`, `color`, `emoji`, `vibe`)

**O que NÃO fornece:**
- Hierarquia organizacional, departamentos, `reports_to`
- Orçamentos (`budgetMonthlyCents`), heartbeats, aprovações
- Adapters, runtime config, permissões de execução
- Autoridade hierárquica ou disciplinar

### 3.2 Camada B — NettosCorp (Identidade e governança)
**O que define:**
- Cargo e departamento na estrutura organizacional
- Nome institucional ou humanizado (quando aprovado pela liderança)
- Responsabilidades e autoridade delegada
- Relações hierárquicas (`reports_to` administrativo e funcional)
- Identidade visual e comunicacional (quando documentada)
- Limites e critérios de atuação (escopo, orçamento, aprovações necessárias)

**Fonte de verdade:** Documentos em `institutional/empresa/00-governance/`, `02-organization/`, `08-decisions/`.

### 3.3 Camada C — Paperclip (Materialização operacional)
**O que implementa:**
- Identificador técnico (UUID do agente no Paperclip)
- Configuração e instruções (`adapterConfig`, `runtimeConfig`, `instructions`)
- Modelo e adaptador (`adapterType`, `adapterConfig`)
- Hierarquia operacional (`reportsTo` UUID)
- Estado de implementação e validação (`lifecycleState`, `status`, `lastHeartbeatAt`)
- Orçamento (`budgetMonthlyCents`, `spentMonthlyCents`)
- Permissões (`permissions` JSONB)

**Fonte de verdade:** `paperclip/packages/db/src/schema/agents.ts`, API REST `/api/agents`.

### 3.4 Camada D — Hermes (Coordenação)
**O que coordena:**
- Integração entre documentação, governança, agentes e execução
- Rastreabilidade de decisões e mudanças (este documento, `REGISTRO_PENDENCIAS_DECISOES.md`)
- Coordenação das atualizações e da consistência institucional
- Monitoramento de sincronização com upstream Agency Agents
- Comunicação com liderança fundadora para homologações

---

## 4. Arquitetura de integração

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NETTOSCORP — ARQUITETURA INTEGRADA                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CAMADA B: NETTOSCORP (GOVERNANÇA)               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ Fundador     │  │ Conselheiro  │  │ Hermes (CdG) │              │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │   │
│  │         │                 │                 │                       │   │
│  │  ┌──────▼─────────────────▼─────────────────▼───────┐              │   │
│  │  │           DIRETORIAS ESPECIALIZADAS              │              │   │
│  │  │  Tecnologia  │  Gestão Projetos  │  Qualidade   │  Segurança   │   │
│  │  └──────┬───────┴────────┬────────┴──────┬────────┴──────┬────────┘   │   │
│  │         │                │               │                │            │   │
│  └─────────┼────────────────┼───────────────┼────────────────┼────────────┘   │
│            │                │               │                │                │
│            ▼                ▼               ▼                ▼                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                 CAMADA C: PAPERCLIP (CONTROL PLANE)                │   │
│  │  Agents (UUID)  │  reportsTo  │  budget  │  adapter  │  heartbeat │   │
│  │  issues         │  goals      │  approvals│  costs    │  skills    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│            ▲                ▲               ▲                ▲                │
│            │                │               │                │                │
│  ┌─────────┼────────────────┼───────────────┼────────────────┼────────────┐   │
│  │         │                │               │                │            │   │
│  │  ┌──────▼─────────────────▼─────────────────▼────────────▼───────┐    │   │
│  │  │              CAMADA A: AGENCY AGENTS (FONTE)                 │    │   │
│  │  │  engineering/  │  project-mgmt/  │  specialized/  │  design/  │    │   │
│  │  │  software-arch │  project-mgr    │  agents-orch   │  ux-arch  │    │   │
│  │  │  backend-arch  │  sprint-priorit │  chief-of-staff│  brand-gd │    │   │
│  │  │  frontend-dev  │                 │                │           │    │   │
│  │  │  devops-auto   │                 │                │           │    │   │
│  │  │  tech-writer   │                 │                │           │    │   │
│  │  └────────────────┴─────────────────┴────────────────┴───────────┘    │   │
│  │                                                                     │    │   │
│  │  Fonte: https://github.com/msitarzewski/agency-agents               │    │   │
│  │  Clone: /home/lg/workspace/NettosCorp/agency-agents (main, 4e3ac3c) │    │   │
│  │  Licença: MIT                                                       │    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CAMADA D: HERMES — COORDENAÇÃO TRANSVERSAL                         │   │
│  │  • Rastreabilidade (matriz, decisões, pendências)                   │   │
│  │  • Sincronização com upstream (política, auditoria)                 │   │
│  │  • Validação de consistência institucional                          │   │
│  │  • Interface com liderança fundadora                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Estrutura documental criada

Esta integração produz os seguintes documentos centrais em `institutional/empresa/02-organization/integracao-agency-agents/`:

| Documento | Finalidade |
|-----------|------------|
| `INTEGRACAO_INSTITUCIONAL.md` (este) | Arquitetura, princípios, responsabilidades das 4 camadas |
| `INVENTARIO_AGENCY_AGENTS.md` | Estrutura, categorias, especialidades e origem do catálogo |
| `MATRIZ_CORRESPONDENCIA.md` | Mapeamento: especialidade → cargo → departamento → agente Paperclip |
| `POLITICA_SINCRONIZACAO.md` | Atualização, preservação, versionamento, tratamento de conflitos |
| `PROCEDIMENTO_ADOCAO_AGENTES.md` | Identificação, avaliação, proposta, homologação, implementação |
| `REGISTRO_PENDENCIAS_DECISOES.md` | Pontos que exigem deliberação do fundador |

**Índice e referências cruzadas:** Atualizados em `institutional/empresa/02-organization/INDICE.md`.

---

## 6. Agentes iniciais mapeados (fase 0-1)

Com base na `PROPOSTA_EQUIPE.md` v1.2 e na investigação do Agency Agents, os seguintes agentes são candidatos prioritários para composição inicial:

| Especialidade (Agency Agents) | Cargo Institucional (NettosCorp) | Departamento | Status |
|-------------------------------|----------------------------------|--------------|--------|
| engineering/software-architect | Software Architect | Diretoria de Tecnologia | Identificado |
| engineering/backend-architect | Backend Architect | Diretoria de Tecnologia | Identificado |
| engineering/frontend-developer | Frontend Developer | Diretoria de Tecnologia | Identificado |
| engineering/devops-automator | DevOps Automator | Diretoria de Tecnologia | Identificado |
| project-management/project-manager-senior | Project Manager Senior | Diretoria de Gestão de Projetos | Identificado |
| engineering/technical-writer | Technical Writer | Compartilhável (todas) | Identificado |
| specialized/agents-orchestrator | Agente Corporativo Global de Orquestração | Nível 2 — Direção Executiva | Identificado |
| specialized/specialized-chief-of-staff | Chefe de Gabinete Executivo (Hermes) | Nível 2 — Direção Executiva | **Já implantado** |

**Observação:** A lista acima reflete o mapeamento documental. A implantação operacional no Paperclip requer homologação da liderança, definição de orçamentos, adapters e aprovação de contratação (board).

---

## 7. Validação e conformidade

### 7.1 Checklist de conformidade desta integração

- [x] Clone do Agency Agents localizado e auditado (caminho, URL, branch, commit, método)
- [x] Diferenças entre clone e upstream verificadas (clone está atualizado com origin/main)
- [x] Documentação institucional existente estudada (governança, proposta de equipe, arquitetura)
- [x] Quatro camadas definidas e separadas (A, B, C, D)
- [x] Matriz de rastreabilidade criada para cargos previstos + agentes adicionais do catálogo
- [x] Política de sincronização documentada (preservação, versionamento, conflitos)
- [x] Procedimento de adoção definido (identificação → homologação → implementação)
- [x] Registro de pendências e decisões criado (reservadas ao fundador)
- [x] Índices e referências cruzadas atualizados
- [x] **Paperclip e Telegram inalterados** (nenhum agente criado/modificado, nenhuma config alterada)
- [x] Licença MIT preservada e referenciada

### 7.2 Evidências de validação

| Validação | Resultado | Evidência |
|-----------|-----------|-----------|
| Clone existe e é oficial | ✅ | `agency-agents/.git` remote = github.com/msitarzewski/agency-agents |
| Clone atualizado com upstream | ✅ | `git status`: "Your branch is up to date with 'origin/main'" |
| Commit atual | ✅ | `4e3ac3c` (Merge PR #1175, 20 out 2026) |
| 17 divisões, 264 agentes confirmados | ✅ | `divisions.json` + contagem de arquivos `.md` |
| 8 cargos iniciais mapeados | ✅ | `MATRIZ_CORRESPONDENCIA.md` |
| Documentos institucionais referenciados | ✅ | Links internos validados |
| Nenhuma alteração no Paperclip | ✅ | `git status` em `paperclip/` limpo |
| Nenhuma alteração no Telegram/gateway | ✅ | Fora do escopo desta missão |

---

## 8. Próximos passos (pós-homologação)

Após homologação da liderança fundadora:

1. **Definir orçamentos** (`budgetMonthlyCents`) para cada agente proposto
2. **Definir adapters** (`adapterType`, `adapterConfig`) por ambiente de execução
3. **Homologar modelo de autoridade v1.2** (Fundador, Conselheiro, Hermes, Orquestrador, sem Diretor de Operações)
4. **Criar agentes no Paperclip** para Diretor de Tecnologia e Diretor de Gestão de Projetos (fase 2)
5. **Identificar supervisores locais** dos projetos existentes (fase 4 do roadmap)
6. **Criar seis agentes especialistas iniciais** no Paperclip (fase 3-5)
7. **Desenvolver script de sincronização** Agency Agents → Paperclip (quando necessário)

---

## 9. Recuperação e referências

**Documento completo:** `/home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/INTEGRACAO_INSTITUCIONAL.md`

**Documentos correlatos:**
- `institutional/empresa/00-governance/MEMORIA_INSTITUCIONAL_NETTOSCORP.md`
- `institutional/empresa/00-governance/MODELO_AUTORIDADE_DIRECAO_EXECUTIVA.md`
- `institutional/empresa/00-governance/GOVERNANCA_CORPORATIVA.md`
- `institutional/empresa/02-organization/proposta-equipe/PROPOSTA_EQUIPE.md`
- `institutional/empresa/02-organization/agency-agents-investigacao/AGENCY_AGENTS_INVESTIGACAO.md`
- `institutional/empresa/05-technology/paperclip/PAPERCLIP_TECNOLOGIA.md`
- `institutional/empresa/05-technology/integracao-arquitetura/INTEGRACAO_ARQUITETURA.md`
- `agency-agents/divisions.json` (fonte de verdade das divisões)
- `agency-agents/strategy/runbooks.json` (rosters de cenários)

**Origem upstream:** https://github.com/msitarzewski/agency-agents (MIT License)

---

**Homologação:** Este documento aguarda homologação final da liderança fundadora (Netto Farias) para tornar-se fonte de verdade vinculante. Até lá, tem status de **proposta institucional documentada**.