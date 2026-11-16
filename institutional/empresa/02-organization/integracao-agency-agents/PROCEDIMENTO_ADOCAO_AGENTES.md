# PROCEDIMENTO DE ADOÇÃO DE AGENTES — AGENCY AGENTS → NETTOSCORP → PAPERCLIP

Versão: 1.0
Data: 15 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/PROCEDIMENTO_ADOCAO_AGENTES.md
Status: DOCUMENTO INSTITUCIONAL OFICIAL — procedimento vinculante após homologação

---

## 1. Objetivo e escopo

Este procedimento define o processo **oficial e obrigatório** para identificar, avaliar, propor, homologar e implementar agentes do catálogo Agency Agents como agentes operacionais na NettosCorp via Paperclip.

**Escopo:** Todos os agentes originários do Agency Agents (msitarzewski/agency-agents) que se tornem parte da estrutura organizacional da NettosCorp.

**Fora do escopo:** Agentes criados internamente na NettosCorp (não derivados do Agency Agents) — estes seguem processo próprio de criação de cargo/agente.

---

## 2. Princípios do procedimento

| Princípio | Aplicação |
|-----------|-----------|
| **Necessidade comprovada** | Só adotar agente quando houver necessidade operacional documentada (não especulativa) |
| **Não duplicação** | Verificar se cargo/especialidade já existe na matriz antes de propor novo |
| **Rastreabilidade total** | Cada etapa gera registro auditável (origem, avaliação, decisão, implementação) |
| **Autoridade respeitada** | Homologação da liderança fundadora é obrigatória antes de implementar no Paperclip |
| **Orçamento pré-definido** | `budgetMonthlyCents` deve ser aprovado antes da criação do agente |
| **Adapter definido** | `adapterType` e `adapterConfig` devem ser definidos antes da criação |
| **Preservação da origem** | Adaptações seguem `POLITICA_SINCRONIZACAO.md` (seção `🏛️ Adaptação NettosCorp`) |

---

## 3. Etapas do procedimento

### ETAPA 1 — IDENTIFICAÇÃO DA NECESSIDADE

**Gatilhos:**
- Diretoria identifica lacuna de especialidade em seu departamento
- Novo projeto requer competência não coberta pelos agentes atuais
- Runbook/cenário do Agency Agents recomenda agente não adotado
- Auditoría de competências revela ausência crítica

**Entradas:**
- Descrição da necessidade (qual especialidade, para quê, urgência)
- Referência ao agente Agency Agents candidato (divisão/slug/name)
- Estimativa de carga de trabalho (issues/semana, complexidade)

**Saída:** `Solicitação de Adoção de Agente` (issue no Paperclip ou documento estruturado)

**Responsável:** Diretor da área solicitante / Hermes (se transversal)

**Template de solicitação:**
```markdown
## Solicitação de Adoção — [Especialidade]

**Origem:** Agency Agents — `division/slug` (ex: engineering/engineering-sre)
**Cargo proposto:** [Nome do cargo na NettosCorp]
**Departamento:** [Diretoria]
**Necessidade:** [Descrição do porquê — lacuna, projeto, runbook]
**Urgência:** [Imediata / Próxima sprint / Próximo trimestre]
**Carga estimada:** [Issues/semana, complexidade típica]
**Compartilhável?** [Sim/Não — se sim, quais departamentos]
**Solicitante:** [Nome/Cargo]
**Data:** YYYY-MM-DD
```

---

### ETAPA 2 — AVALIAÇÃO TÉCNICA E INSTITUCIONAL

**Executada por:** Hermes + Diretor da área (ou Diretor de Tecnologia se transversal)

**Atividades:**
1. **Verificar catálogo:** Confirmar agente existe no Agency Agents (versão atual do clone)
2. **Verificar matriz:** Consultar `MATRIZ_CORRESPONDENCIA.md` — já mapeado? Já adotado? Lacuna?
3. **Analisar agente original:** Ler arquivo `.md` completo — identidade, missão, regras, processos, vibe
4. **Mapear para cargo institucional:**
   - Cargo existe na estrutura? (ver `PROPOSTA_EQUIPE.md`, `MODELO_AUTORIDADE.md`)
   - Se não existe: propor novo cargo (requer aprovação Fundador)
   - Definir `reportsTo` administrativo
   - Definir se compartilhável (múltiplos `reportsTo` funcionais)
5. **Avaliar adaptações necessárias:**
   - Quais seções do original são preservadas integralmente
   - Quais adaptações institucionais (`reportsTo`, `budget`, `adapter`, `capabilities`, `permissions`)
   - Conflitos conhecidos (ver `POLITICA_SINCRONIZACAO.md` seção 5)
6. **Estimar recursos:**
   - `budgetMonthlyCents` estimado (base: complexidade + modelo + uso esperado)
   - `adapterType` recomendado (`process`/`http`/external) + config
   - `capabilities` derivado de `description` + `mission` do original

**Saída:** `Relatório de Avaliação de Agente` (documento estruturado)

**Template de relatório:**
```markdown
## Relatório de Avaliação — [Especialidade]

**Agente origem:** division/slug (commit: SHA)
**Arquivo lido:** [caminho completo]
**Cargo proposto:** [Nome]
**Departamento:** [Diretoria]
**ReportsTo administrativo:** [Cargo/UUID]
**Compartilhável:** [Sim/Não — departamentos]

### Análise do Agente Original
- **Identidade preservada:** [Sim/Parcial — detalhar]
- **Missão preservada:** [Sim/Parcial — detalhar]
- **Regras críticas preservadas:** [Sim/Parcial — detalhar]
- **Processos preservados:** [Sim/Parcial — detalhar]
- **Vibe/Persona preservada:** [Sim/Parcial — detalhar]

### Adaptações Institucionais Necessárias
| Elemento | Valor Original | Valor Institucional | Justificativa |
|----------|----------------|---------------------|---------------|
| reportsTo | (não existe) | Diretor de Tecnologia (UUID) | Hierarquia NettosCorp |
| budgetMonthlyCents | (não existe) | 150000 | Estimativa modelo + uso |
| adapterType | (não existe) | process/claude-code | Ambiente execução |
| capabilities | description | [derivado] | Mapeamento Paperclip |
| permissions | (não existe) | {read:all, write:dept} | Menor privilégio |

### Conflitos Identificados
- [ ] Nenhum
- [ ] Sim — listar: _______________

### Recursos Estimados
- **Orçamento mensal:** R$ X.XXX,XX (budgetMonthlyCents: XXXXXX)
- **Adapter:** [tipo/config]
- **Implementação:** [Simples/Média/Complexa — dias estimados]

### Recomendação
- [ ] **APROVAR** — Prosseguir para homologação
- [ ] **APROVAR COM RESSALVAS** — Listar: _______________
- [ ] **REJEITAR** — Justificativa: _______________
- [ ] **AGUARDAR** — Dependência: _______________

**Avaliador:** Hermes / [Diretor]
**Data:** YYYY-MM-DD
```

---

### ETAPA 3 — PROPOSTA FORMAL E HOMOLOGAÇÃO

**Executada por:** Hermes (consolida) → Fundador (decide)

**Entrada:** `Relatório de Avaliação` + `Solicitação de Adoção`

**Processo:**
1. Hermes consolida proposta formal com:
   - Resumo executivo (1 parágrafo)
   - Relatório de avaliação completo
   - Impacto orçamentário (atual + projetado)
   - Impacto organizacional (hierarquia, compartilhamento, precedentes)
   - Riscos e mitigações
   - Recomendação clara (Aprovar / Aprovar com ressalvas / Rejeitar / Aguardar)

2. Submete à liderança fundadora (Netto Farias) via:
   - Issue no Paperclip com label `governance:agent-adoption`
   - Ou documento em `institutional/empresa/08-decisions/` (se estratégico)

3. Fundador decide (com apoio do Conselheiro se técnico):
   - **APROVADO** → Etapa 4
   - **APROVADO COM RESSALVAS** → Ajustar + re-submeter
   - **REJEITADO** → Registrar justificativa, fechar solicitação
   - **AGUARDAR** → Definir gatilho de reavaliação

**Registro obrigatório:** Decisão em `institutional/empresa/08-decisions/DECISAO-YYYYMMDD-ADOCAO-[SLUG].md`

**Template de decisão:**
```markdown
# Decisão de Adoção — [Especialidade/Cargo]

**Data:** YYYY-MM-DD
**Decisor:** Netto Farias (Fundador)
**Conselheiro:** [Nome/Parecer]
**Proposta:** [Link para issue/documento]

## Decisão
- [ ] **APROVADO**
- [ ] **APROVADO COM RESSALVAS**
- [ ] **REJEITADO**
- [ ] **AGUARDAR**

## Detalhes
**Cargo homologado:** [Nome exato]
**Departamento:** [Diretoria]
**ReportsTo:** [Cargo/UUID]
**BudgetMonthlyCents aprovado:** XXXXXX
**Adapter aprovado:** [tipo/config]
**Compartilhável:** [Sim/Não — departamentos]

## Ressalvas/Condições (se houver)
1. _______________
2. _______________

## Próximos passos
- [ ] Implementar no Paperclip (Etapa 4)
- [ ] Atualizar MATRIZ_CORRESPONDENCIA.md
- [ ] Comunicar ao Diretor solicitante
- [ ] Agendar validação operacional (Etapa 5)

**Assinatura digital:** [Fundador]
```

---

### ETAPA 4 — IMPLEMENTAÇÃO NO PAPERCLIP

**Executada por:** Hermes (ou técnico designado) — **APÓS homologação**

**Pré-requisitos (checklist obrigatório):**
- [ ] Decisão de homologação registrada em `08-decisions/`
- [ ] `budgetMonthlyCents` definido e aprovado
- [ ] `adapterType` e `adapterConfig` definidos e testados
- [ ] `reportsTo` UUID confirmado (supervisor já existe no Paperclip)
- [ ] `capabilities` string preparada (derivado de description + mission)
- [ ] `permissions` JSONB definido (menor privilégio)
- [ ] Seção `🏛️ Adaptação NettosCorp` preparada para o agente Agency Agents
- [ ] `MATRIZ_CORRESPONDENCIA.md` atualizado com situação `aprovado`

**Passos de implementação:**

1. **Criar agente via API Paperclip:**
```bash
POST /api/agents
{
  "companyId": "nettoscorp-uuid",
  "name": "[Nome Institucional do Cargo]",
  "role": "[director|manager|specialist|operator]",
  "title": "[Título formal]",
  "icon": "[emoji do Agency Agents]",
  "appearance": { "color": "[hex do Agency Agents]" },
  "reportsTo": "[UUID do supervisor]",
  "capabilities": "[string derivada]",
  "adapterType": "[aprovado]",
  "adapterConfig": { ...config aprovada... },
  "runtimeConfig": { "heartbeat": { "enabled": true, "intervalSec": 3600 } },
  "budgetMonthlyCents": [aprovado],
  "permissions": { ...menor privilégio... },
  "metadata": {
    "source": "agency-agents",
    "sourceDivision": "[division]",
    "sourceSlug": "[slug]",
    "sourceCommit": "[SHA do commit de origem]",
    "adaptationDate": "YYYY-MM-DD",
    "homologacaoDecisao": "[ref decisão 08-decisions]"
  },
  "createdByUserId": "hermes"
}
```

2. **Registrar instruções (adapterConfig.instructions ou spec.instructions):**
   - Copiar conteúdo completo do agente Agency Agents (frontmatter + corpo)
   - **Adicionar ao final** a seção `🏛️ Adaptação NettosCorp` (conforme `POLITICA_SINCRONIZACAO.md`)
   - Atualizar via `PATCH /api/agents/{id}/config` ou UI Advanced tab

3. **Criar primeira revisão de configuração:**
   - Paperclip registra automaticamente em `agent_config_revisions`
   - Verificar se `version: 1` criada corretamente

4. **Aprovar contratação (se `requireBoardApprovalForNewAgents = true`):**
   - `POST /api/agents/{id}/approve-hire` (Fundador ou board)
   - Agente move para `lifecycleState: preparing` → `verifying` → `ready`

5. **Validar implementação:**
   - [ ] Agente aparece no board Paperclip
   - [ ] `lifecycleState = ready`
   - [ ] `lastHeartbeatAt` atualizado (primeiro heartbeat)
   - [ ] Instruções carregadas corretamente (verificar seção adaptação presente)
   - [ ] `reportsTo` aponta para supervisor correto
   - [ ] Orçamento e adapter configurados

**Saída:** Agente operacional no Paperclip + UUID registrado na `MATRIZ_CORRESPONDENCIA.md`

---

### ETAPA 5 — VALIDAÇÃO OPERACIONAL E ENTREGA

**Executada por:** Diretor da área + Hermes (conjunto)

**Atividades:**
1. **Teste de atribuição:** Criar issue de teste (`priority: low`, `assigneeAgentId: novo agente`)
2. **Execução:** Aguardar heartbeat + execução da tarefa
3. **Verificação de entrega:** Confirmar que agente:
   - Entende a tarefa (comentário de aceitação)
   - Executa conforme instruções + adaptação institucional
   - Reporta progresso via heartbeat/comentários
   - Entrega resultado esperado
4. **Validação de integração:** Confirmar que:
   - `reportsTo` funcional (supervisor recebe notificações)
   - Orçamento consumido corretamente (`cost_events`)
   - Permissões respeitadas (não acessa outras empresas/departamentos)
   - Logs de atividade (`activity_log`) registram ações

**Critérios de aceitação:**
- [ ] Issue de teste concluída com sucesso
- [ ] Heartbeat regular (intervalo configurado)
- [ ] Zero erros de permissão/orçamento/adapter
- [ ] Supervisor confirma visibilidade e controle
- [ ] Agente responde conforme persona + adaptação institucional

**Registro:** Atualizar `MATRIZ_CORRESPONDENCIA.md` → situação `validado`, preencher `ID Técnico`, `Validado em`, `Validador`, `Evidência validação`.

**Comunicação:** Issue de fechamento com resumo + link para agente no Paperclip board.

---

## 4. Fluxo resumido (visual)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. IDENTI- │────▶│  2. AVALIA- │────▶│  3. PROPOSTA│────▶│  4. IMPLE-  │────▶│  5. VALIDA- │
│  FICAÇÃO    │     │  ÇÃO        │     │  + HOMOLO-  │     │  MENTAÇÃO   │     │  ÇÃO        │
└─────────────┘     └─────────────┘     │  GAÇÃO      │     └─────────────┘     └─────────────┘
                                        └──────┬──────┘
                                               │
                                    ┌──────────┴──────────┐
                                    ▼                     ▼
                             ┌─────────────┐        ┌─────────────┐
                             │   APROVADO  │        │  REJEITADO/ │
                             │   → Etapa 4 │        │   AGUARDAR  │
                             └─────────────┘        └─────────────┘
```

---

## 5. Prazos e SLAs internos

| Etapa | Prazo Máximo | Responsável | Escalação |
|-------|--------------|-------------|-----------|
| 1. Identificação → Solicitação | 2 dias úteis | Diretor solicitante | Hermes |
| 2. Avaliação Técnica | 5 dias úteis | Hermes + Diretor | Fundador (se conflito) |
| 3. Homologação Fundador | Conforme agenda | Fundador | Conselheiro (parecer) |
| 4. Implementação Paperclip | 2 dias úteis | Hermes/Técnico | Diretor de Tecnologia |
| 5. Validação Operacional | 5 dias úteis | Diretor + Hermes | Fundador (se falha crítica) |
| **Total estimado (ideal)** | **~14 dias úteis** | — | — |

---

## 6. Casos especiais

### 6.1 Agente compartilhável (múltiplos departamentos)
- `reportsTo` administrativo: um único supervisor (diretor "dono")
- `permissions`: leitura cross-departamento, escrita no próprio
- Validação: todos os diretores envolvidos assinam validação operacional

### 6.2 Agente para cargo inexistente (nova diretoria/nível)
- Requer aprovação de **estrutura organizacional** (Fundador) antes da Etapa 3
- Processo paralelo: criação do cargo na governança → depois adoção do agente

### 6.3 Agente já implementado precisa de atualização de instruções
- Segue `POLITICA_SINCRONIZACAO.md` (ciclo de sincronização)
- Não requer nova homologação se mudança for menor (typos, exemplos)
- Requer homologação se mudança for maior (missão, regras, persona)

### 6.4 Agente Agency Agents removido/descontinuado no upstream
- Registrar em `REGISTRO_PENDENCIAS_DECISOES.md`
- Decidir: manter versão local congelada / buscar substituto / remover do Paperclip
- Se remover: `lifecycleState: terminating` → `terminated` (preservar histórico)

---

## 7. Checklist mestre por adoção

Use este checklist para cada agente adotado. Anexe ao issue de adoção.

```
ADOÇÃO DE AGENTE — CHECKLIST MESTRE
=====================================
Agente: [division/slug] → Cargo: [Nome] → Dept: [Diretoria]

ETAPA 1 - IDENTIFICAÇÃO
☐ Solicitação criada (issue/documento)
☐ Necessidade documentada
☐ Agente origem confirmado no clone atual

ETAPA 2 - AVALIAÇÃO
☐ Relatório de avaliação completo
☐ MATRIZ_CORRESPONDENCIA.md consultado
☐ Adaptações mapeadas
☐ Conflitos identificados (ou "nenhum")
☐ Orçamento estimado
☐ Adapter recomendado
☐ Recomendação clara (Aprovar/Rejeitar/Aguardar)

ETAPA 3 - HOMOLOGAÇÃO
☐ Proposta formal submetida ao Fundador
☐ Decisão registrada em 08-decisions/
☐ BudgetMonthlyCents APROVADO
☐ AdapterType/Config APROVADO
☐ ReportsTo UUID CONFIRMADO
☐ Capabilities DEFINIDO
☐ Permissions DEFINIDO

ETAPA 4 - IMPLEMENTAÇÃO
☐ Agente criado via API Paperclip
☐ Instruções carregadas (original + seção 🏛️)
☐ agent_config_revisions v1 criada
☐ approve-hire executado (se necessário)
☐ lifecycleState = ready
☐ Primeiro heartbeat OK
☐ UUID registrado na MATRIZ

ETAPA 5 - VALIDAÇÃO
☐ Issue de teste criada e atribuída
☐ Agente aceitou e executou
☐ Entrega conforme esperado
☐ Orçamento/permissões/adapter OK
☐ Supervisor confirma controle
☐ MATRIZ atualizada: validado + ID técnico + data + validador
☐ Issue de adoção fechada com resumo

ASSINATURAS
-----------
Diretor solicitante: _______________ Data: _______
Hermes (avaliador): _______________ Data: _______
Fundador (homologador): _______________ Data: _______
Diretor + Hermes (validadores): _______________ Data: _______
```

---

## 8. Recuperação e referências

**Documento completo:** `/home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/PROCEDIMENTO_ADOCAO_AGENTES.md`

**Documentos correlatos:**
- `INTEGRACAO_INSTITUCIONAL.md` (arquitetura 4 camadas)
- `INVENTARIO_AGENCY_AGENTS.md` (catálogo completo)
- `MATRIZ_CORRESPONDENCIA.md` (mapeamento agente-a-agente)
- `POLITICA_SINCRONIZACAO.md` (atualização contínua)
- `REGISTRO_PENDENCIAS_DECISOES.md` (conflitos e decisões)
- `institutional/empresa/08-decisions/` (registro de decisões)
- `paperclip/packages/db/src/schema/agents.ts` (schema agente Paperclip)
- `paperclip/doc/SPEC-implementation.md` (contrato V1)

**Upstream:** https://github.com/msitarzewski/agency-agents (MIT License)