# REGISTRO DE PENDÊNCIAS E DECISÕES — INTEGRAÇÃO AGENCY AGENTS

Versão: 1.0
Data: 15 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/REGISTRO_PENDENCIAS_DECISOES.md
Status: DOCUMENTO INSTITUCIONAL OFICIAL — registro vivo, atualizado a cada ciclo

---

## 1. Finalidade

Registrar **todas as pendências, conflitos e decisões** que exigem deliberação da liderança fundadora (Netto Farias) ou do Conselheiro, no contexto da integração do Agency Agents à NettosCorp.

Cada entrada deve ser rastreável, com status claro, responsável e prazo.

---

## 2. Legenda de status

| Status | Significado |
|--------|-------------|
| `ABERTA` | Pendência identificada, aguardando análise/decisão |
| `EM_ANALISE` | Sendo analisada por Hermes/Diretor/Conselheiro |
| `AGUARDANDO_FUNDADOR` | Submetida ao Fundador, aguardando decisão |
| `AGUARDANDO_CONSELHEIRO` | Submetida ao Conselheiro para parecer |
| `DECIDIDA` | Decisão tomada (aprovada/rejeitada/condicionada) |
| `IMPLEMENTADA` | Decisão executada e validada |
| `CANCELADA` | Pendência obsoleta ou resolvida por outro caminho |

---

## 3. Pendências atuais (base: 15 nov 2026)

### 3.1 Decisões estruturais (pendentes)

| ID | Título | Descrição | Status | Responsável | Prazo | Decisão Necessária |
|----|--------|-----------|--------|-------------|-------|-------------------|
| PEND-001 | **Homologação Modelo Autoridade v1.2** | Estrutura: Fundador, Conselheiro, Hermes (CdG), Orquestrador Global (subord. adm. a Hermes), **sem Diretor de Operações**. Diretores respondem ao Fundador; Hermes coordena integração. **Já homologado via DELIB-014 (07/11/2026)**. | `DECIDIDA` / `IMPLEMENTADA` | Fundador (Netto Farias) | — | **Homologado em 07/11/2026** — DELIB-014. Não requer nova decisão. |
| PEND-002 | **Orçamentos mensais (budgetMonthlyCents)** | Definir budget para cada um dos 8 cargos iniciais + Hermes + Orquestrador. Base: complexidade, modelo, uso estimado. | `ABERTA` | Fundador + Conselheiro | Semana 1-2 | Valores por cargo (R$/mês) |
| PEND-003 | **Adapters e configuração de execução** | Definir `adapterType` e `adapterConfig` para cada agente (process/claude-code, http/openclaw, etc.). Ambiente de execução no Paperclip. | `ABERTA` | Diretor de Tecnologia + Hermes | Semana 2-3 | Tipo + config por agente |
| PEND-004 | **requireBoardApprovalForNewAgents** | Se cada novo agente precisa de aprovação individual do board (Fundador) ou se a aprovação da estrutura inicial basta. | `ABERTA` | Fundador | Semana 1 | true / false |
| PEND-005 | **Criação Diretor de Tecnologia (cargo + agente)** | Cargo não existe no Agency Agents. Requer criação de cargo institucional + agente Paperclip com role=director. | `ABERTA` | Fundador | Semana 2 | Aprovar criação do cargo |
| PEND-006 | **Criação Diretor de Gestão de Projetos (cargo + agente)** | Cargo não existe no Agency Agents. Mesmo padrão do Diretor de Tecnologia. | `ABERTA` | Fundador | Semana 2 | Aprovar criação do cargo |

### 3.2 Decisões de adoção de agentes iniciais (8 cargos)

| ID | Agente Agency Agents | Cargo Institucional | Status | Bloqueado por | Decisão Necessária |
|----|---------------------|---------------------|--------|---------------|-------------------|
| ADO-001 | engineering/engineering-software-architect | Software Architect | `AGUARDANDO_FUNDADOR` | PEND-001, PEND-002, PEND-003, PEND-005 | Aprovar adoção + orçamento + adapter |
| ADO-002 | engineering/engineering-backend-architect | Backend Architect | `AGUARDANDO_FUNDADOR` | PEND-001, PEND-002, PEND-003, PEND-005 | Aprovar adoção + orçamento + adapter |
| ADO-003 | engineering/engineering-frontend-developer | Frontend Developer | `AGUARDANDO_FUNDADOR` | PEND-001, PEND-002, PEND-003, PEND-005 | Aprovar adoção + orçamento + adapter |
| ADO-004 | engineering/engineering-devops-automator | DevOps Automator | `AGUARDANDO_FUNDADOR` | PEND-001, PEND-002, PEND-003, PEND-005 | Aprovar adoção + orçamento + adapter |
| ADO-005 | project-management/project-manager-senior | Project Manager Senior | `AGUARDANDO_FUNDADOR` | PEND-001, PEND-002, PEND-003, PEND-006 | Aprovar adoção + orçamento + adapter |
| ADO-006 | engineering/engineering-technical-writer | Technical Writer (compartilhável) | `AGUARDANDO_FUNDADOR` | PEND-001, PEND-002, PEND-003, PEND-004 | Aprovar adoção + orçamento + adapter + modelo relatório funcional |
| ADO-007 | specialized/agents-orchestrator | Agente Corporativo Global de Orquestração | `AGUARDANDO_FUNDADOR` | PEND-001, PEND-002, PEND-003, PEND-004 | Aprovar adoção + subord. adm. a Hermes + orçamento + adapter |
| ADO-008 | specialized/specialized-chief-of-staff | Chefe de Gabinete Executivo (Hermes) | **IMPLEMENTADA** | — | **Já operacional — validado** |

### 3.3 Conflitos conhecidos (origem vs instituição)

| ID | Agente | Conflito | Status | Análise | Recomendação |
|----|--------|----------|--------|---------|--------------|
| CONF-001 | project-manager-senior | Agente original referencia `ai/memory-bank/site-setup.md` e `ai/memory-bank/tasks/` — estrutura específica de projetos web, não compatível com Paperclip issues/goals | `EM_ANALISE` | Hermes | Adaptar referências para Paperclip: issues, goals, routines. Preservar lógica de "specs → tasks". |
| CONF-002 | agents-orchestrator | Agente original assume controle total do pipeline (PM → Architect → Dev↔QA). Na NettosCorp, autoridade operacional delegada e limitada, subord. adm. a Hermes. | `EM_ANALISE` | Hermes | Preservar capacidade de orquestração técnica; limitar autoridade via `permissions` e `reportsTo` → Hermes. Documentar limites na adaptação. |
| CONF-003 | technical-writer | Agente original foca em docs-as-code (Docusaurus, MkDocs, OpenAPI). NettosCorp usa documentação institucional em Markdown versionado + Paperclip docs. | `EM_ANALISE` | Hermes | Preservar padrões de qualidade (code examples must run, version everything). Adaptar ferramentas para stack NettosCorp. |
| CONF-004 | software-architect | Agente original usa ADR template próprio. NettosCorp pode ter template institucional próprio (08-decisions/). | `ABERTA` | Diretor de Tecnologia | Alinhar template ADR com `08-decisions/` formato. Preservar rigor de "document decisions, not just designs". |
| CONF-005 | devops-automator | Agente original assume Terraform, K8s, cloud providers específicos. NettosCorp stack pode diferir. | `ABERTA` | Diretor de Tecnologia | Preservar princípios (automation-first, security, cost optimization). Adaptar ferramentas para stack aprovada. |

### 3.4 Lacunas de cargos sem equivalência no Agency Agents

| ID | Cargo Necessário | Lacuna | Status | Proposta | Decisão Necessária |
|----|------------------|--------|--------|----------|-------------------|
| GAP-001 | Diretor de Tecnologia | Não existe "Director of Engineering" ou "CTO" no catálogo | `ABERTA` | Criar cargo institucional; agente Paperclip com role=director, capabilities de liderança, instruções de governança | Aprovar criação do cargo |
| GAP-002 | Diretor de Gestão de Projetos | Não existe "Director of Project Management" | `ABERTA` | Mesmo padrão GAP-001 | Aprovar criação do cargo |
| GAP-003 | Diretor de Qualidade | Não existe "Director of Quality" | `ABERTA` | Futuro (fase 3) — registrar para planejamento | Nenhuma agora (fase 3) |
| GAP-004 | Diretor de Segurança da Informação | Não existe "CISO" ou "Security Director" | `ABERTA` | Futuro (fase 3) — registrar para planejamento | Nenhuma agora (fase 3) |
| GAP-005 | Gerente de Arquitetura | Não existe "Architecture Manager" | `ABERTA` | Nível 4, subordinado a Diretor de Tecnologia. Pode adaptar software-architect ou criar novo. | Definir na fase 2 |
| GAP-006 | Gerente de Segurança da Informação | Não existe "Security Manager" | `ABERTA` | Nível 4, subordinado a Diretor de Segurança. | Definir na fase 3 |
| GAP-007 | Gerentes de Projeto (múltiplos) | Apenas 1 project-manager-senior no catálogo | `ABERTA` | Clonar/adaptar project-manager-senior para múltiplas instâncias com reportsTo → Diretor Gestão Projetos | Definir modelo de instânciação |
| GAP-008 | Coordenador de QA | Não existe "QA Coordinator" | `ABERTA` | Futuro (fase 3) | Nenhuma agora |

### 3.5 Decisões de sincronização com upstream

| ID | Tópico | Descrição | Status | Decisão Necessária |
|----|--------|-----------|--------|-------------------|
| SYNC-001 | Método de integração Git | Clone direto atual vs branch de integração protegida (ver POLITICA_SINCRONIZACAO.md seção 2.2) | `ABERTA` | Aprovar migração para branch `nettoscorp/integration` |
| SYNC-002 | Frequência de sincronização | Semanal (monitorar releases) vs quinzenal vs mensal | `ABERTA` | Definir cadência oficial |
| SYNC-003 | Automação de sync | Desenvolver scripts `sync-agency-agents.sh`, `compare-agent.sh` (ver POLITICA_SINCRONIZACAO.md seção 6) | `ABERTA` | Aprovar desenvolvimento / prioridade |
| SYNC-004 | Notificação de mudanças | Como Hermes detecta mudanças relevantes automaticamente (GitHub webhooks, polling, manual) | `ABERTA` | Definir mecanismo |

---

### 3.6 Resumo de quantidades e observação sobre solapamento

| Categoria | Itens | Quantidade |
|-----------|-------|------------|
| Decisões estruturais (pendentes) | PEND-002 a PEND-006 | 5 |
| Decisões de adoção de agentes | ADO-001 a ADO-008 | 8 |
| Conflitos conhecidos | CONF-001 a CONF-005 | 5 |
| Lacunas de cargos | GAP-001 a GAP-008 | 8 |
| Decisões de sincronização | SYNC-001 a SYNC-004 | 4 |

**Observação sobre a contagem:** o relatório original apresentava 6 "decisões estruturais críticas", 8 "adoções", 5 "conflitos" e 8 "lacunas". Considerando a homologação de PEND-001 via DELIB-014 (07/11/2026), as decisões estruturais reais em aberto são PEND-002 a PEND-006 (5 itens). Os pares PEND-005/GAP-001 e PEND-006/GAP-002 referem-se ao mesmo cargo (Diretor de Tecnologia, Diretor de Gestão de Projetos) em duas vertentes — a pendência de criação do cargo e a lacuna de especialidade equivalente no catálogo — e não devem ser somados como decisões independentes.

## 4. Decisões já tomadas (histórico)

| ID | Título | Decisão | Data | Decisor | Referência |
|----|--------|---------|------|---------|------------|
| DEC-001 | Integração documental Agency Agents → NettosCorp | **APROVADA** — Criar integração arquitetural documental (4 camadas) sem implantação operacional | 2026-11-15 | Hermes (autonomia operacional) | `INTEGRACAO_INSTITUCIONAL.md` |
| DEC-002 | Modelo de 4 camadas (A/B/C/D) | **APROVADA** — Agency Agents (fonte), NettosCorp (governança), Paperclip (control plane), Hermes (coordenação) | 2026-11-15 | Hermes | `INTEGRACAO_INSTITUCIONAL.md` seção 3 |
| DEC-003 | 8 correspondências documentadas | **IDENTIFICADOS** — 6 especialistas (Software Architect, Backend Architect, Frontend Developer, DevOps Automator, Project Manager Senior, Technical Writer), Orquestrador Global, Chefe de Gabinete Executivo (Hermes) | 2026-11-15 | Hermes | `MATRIZ_CORRESPONDENCIA.md` seção 2 |
| DEC-004 | Preservação de origem (não sobrescrita) | **APROVADA** — Adaptações apenas aditivas (seção 🏛️), original intacto | 2026-11-15 | Hermes | `POLITICA_SINCRONIZACAO.md` seção 1 |
| DEC-005 | Hermes já implantado e validado | **CONFIRMADO** — Chefe de Gabinete Executivo operacional no Paperclip | 2026-11-15 | Fundador (implantação anterior) | `MEMORIA_INSTITUCIONAL.md`, `MODELO_AUTORIDADE.md` |

---

## 5. Próximas ações agendadas

| Ação | Responsável | Prazo | Dependência |
|------|-------------|-------|-------------|
| Apresentar PEND-002 a PEND-006 ao Fundador | Hermes | Imediato | — |
| Definir orçamentos (PEND-002) | Fundador + Conselheiro | Semana 1-2 | PEND-001 |
| Definir adapters (PEND-003) | Dir. Tecnologia + Hermes | Semana 2-3 | PEND-001, PEND-002 |
| Analisar CONF-001 a CONF-005 | Hermes + Diretores | Semana 1-2 | — |
| Decidir GAP-001 e GAP-002 (Diretores) | Fundador | Semana 2 | PEND-001 |
| Migrar clone para branch de integração (SYNC-001) | Hermes | Semana 2 | PEND-001 |
| Implementar ADO-001 a ADO-007 no Paperclip | Hermes | Semana 3-4 | Todas PENDs resolvidas |

---

## 6. Formato de registro de nova pendência

Ao identificar nova pendência, usar este template e adicionar à seção correspondente:

```markdown
### PEND-XXX / ADO-XXX / CONF-XXX / GAP-XXX / SYNC-XXX — [Título Curto]

**Descrição:** [Descrição completa do problema/decisão necessária]
**Contexto:** [Por que surgiu agora — agente, documento, evento]
**Impacto:** [O que fica bloqueado se não decidido]
**Opções:**
1. [Opção A] — Prós/Contras
2. [Opção B] — Prós/Contras
3. [Opção C] — Prós/Contras
**Recomendação (Hermes):** [Opção recomendada + justificativa]
**Status:** `ABERTA`
**Responsável:** [Quem decide]
**Prazo:** [Data limite]
**Registrado em:** YYYY-MM-DD por Hermes
```

---

## 7. Recuperação e referências

**Documento completo:** `/home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/REGISTRO_PENDENCIAS_DECISOES.md`

**Documentos base:**
- `INTEGRACAO_INSTITUCIONAL.md` (arquitetura)
- `MATRIZ_CORRESPONDENCIA.md` (mapeamento agentes)
- `POLITICA_SINCRONIZACAO.md` (sincronização)
- `PROCEDIMENTO_ADOCAO_AGENTES.md` (processo)
- `institutional/empresa/00-governance/MODELO_AUTORIDADE_DIRECAO_EXECUTIVA.md`
- `institutional/empresa/02-organization/proposta-equipe/PROPOSTA_EQUIPE.md`
- `institutional/empresa/08-decisions/` (registro decisões oficiais)

**Controle de versão:** Este documento é atualizado a cada ciclo de sincronização, decisão de liderança ou nova pendência identificada. Histórico mantido via Git.