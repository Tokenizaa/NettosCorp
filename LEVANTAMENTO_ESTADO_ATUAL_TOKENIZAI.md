# LEVANTAMENTO ESTADO ATUAL — TOKENIZAI

**Data do levantamento:** 2026-11-20  
**Empresa:** TokenizAi (`41094d81-f950-4565-bdf6-1de1f03909aa`)  
**API base:** `http://127.0.0.1:3100`  
**Perfil CLI:** default  
**Elaboração:** Hermes Agent (Chief of Staff) — nenhum agente criado, alterado ou excluído nesta etapa

---

## 1. Resumo Executivo

A TokenizAi já possui toda a estrutura do primeiro escalão executivo criada e configurada no Paperclip. Existem 8 agentes ativos: 1 CEO (raiz operacional) e 7 subordinados diretos (CTO, COO, CFO, CPO, CMO, CCO, Summarizer). Todos os diretores reportam diretamente ao CEO (`reportsTo: 78fb964b-...`). Nenhum cargo do primeiro escalão está pendente de criação.

O CEO já produziu a proposta executiva inicial (TOK-4/TOK-5/TOK-6) com a estrutura diretiva recomendada, responsabilidades, organograma, departamentos, prioridades de 90 dias e plano de contratação de 18 agentes. As decisões de contratação listadas na Seção 7.1 da proposta aguardam autorização explícita do fundador.

Nenhum agente está atualmente executando trabalho ativo (todos os diretores estão `idle`, exceto o CEO que está `running`). O Summarizer está `paused`.

---

## 2. Organograma Atual

```
FUNDADOR (Netto Farias)
      │
  [Decisão Estratégica]
      │
      ▼
    ┌─────┐
    │ CEO │  ← reportsTo: null (raiz operacional)
    └──┬──┘
   ┌──┼──┬──┬──┬──┬──┬──┐
   ▼  ▼  ▼  ▼  ▼  ▼  ▼
 CTO COO CPO CMO CCO CFO Summarizer
 (todos reportsTo = CEO)
```

- **CEO:** `78fb964b-0c1e-4b1c-9656-241a053bb111` — `running`
- **CTO:** `8e5dee7f-5508-4680-bc2a-032db517b19c` — `idle`
- **COO:** `f6a35541-1b68-4f07-86f7-8fb0553ebb83` — `idle`
- **CFO:** `1584c40b-a34c-48b0-983e-5c9c48b7bb76` — `idle`
- **CPO:** `557aea55-3a1b-4e45-9262-7292aedaa005` — `idle`
- **CMO:** `df803b1c-6bb9-4d65-a36a-9fa93ad593de` — `idle`
- **CCO:** `dce13e51-7927-47b4-bb83-3a975ccb721e` — `idle`
- **Summarizer:** `80cbaca4-d7f1-4019-a99c-1699867e7396` — `paused` (built-in agent do Paperclip)

---

## 3. Inventário dos Agentes

| # | Nome | Cargo | ID | reportsTo | Status | Role | Budget (¢) | Adapter | Modelo | Heartbeat |
|---|------|-------|-----|-----------|--------|------|------------|---------|--------|-----------|
| 1 | CEO | Chief Executive Officer - TokenizAi | `78fb964b-0c1e-4b1c-9656-241a053bb111` | null | running | ceo | 100.000 | claude_local | claude-opus-5-5 | enabled (300s) |
| 2 | CTO | Chief Technology Officer - TokenizAi | `8e5dee7f-5508-4680-bc2a-032db517b19c` | CEO | idle | cto | 100.000 | claude_local | claude-opus-5-5 | enabled (300s) |
| 3 | COO | Chief Operating Officer - TokenizAi | `f6a35541-1b68-4f07-86f7-8fb0553ebb83` | CEO | idle | general | 100.000 | claude_local | claude-opus-5-5 | enabled (300s) |
| 4 | CFO | Chief Financial Officer - TokenizAi | `1584c40b-a34c-48b0-983e-5c9c48b7bb76` | CEO | idle | cfo | 100.000 | claude_local | claude-opus-5-5 | enabled (300s) |
| 5 | CPO | Chief Product Officer - TokenizAi | `557aea55-3a1b-4e45-9262-7292aedaa005` | CEO | idle | general | 100.000 | claude_local | claude-opus-5-5 | enabled (300s) |
| 6 | CMO | Chief Marketing Officer - TokenizAi | `df803b1c-6bb9-4d65-a36a-9fa93ad593de` | CEO | idle | cmo | 100.000 | claude_local | claude-opus-5-5 | enabled (300s) |
| 7 | CCO | Chief Commercial Officer - TokenizAi | `dce13e51-7927-47b4-bb83-3a975ccb721e` | CEO | idle | general | 100.000 | claude_local | claude-opus-5-5 | enabled (300s) |
| 8 | Summarizer | Summarizer | `80cbaca4-d7f1-4019-a99c-1699867e7396` | CEO | paused | general | 0 | claude_local | claude-haiku-4-5 | não configurado |

**Observações:**
- Todos os 7 diretores têm `canCreateAgents: true` e `canCreateSkills: true`.
- O Summarizer é um built-in agent do Paperclip (`paperclipBuiltInAgent`), com `canCreateAgents: false`, `canCreateSkills: false`, `budgetMonthlyCents: 0`, e está `paused`.
- Nenhum dos 7 diretores possui `defaultEnvironmentId` configurado.
- Todas as configurações usam `aiConnection.mode: shared`, `method: api_key`, `provider: anthropic`.
- O CEO usa `instructionsBundleMode: external` (workspace próprio); os diretores usam `managed` (empresa/agente).
- Todos os diretores têm `dangerouslySkipPermissions: true`.

---

## 4. Situação do CEO

### Configuração técnica
- **Nome:** CEO
- **Role:** ceo
- **Título:** Chief Executive Officer - TokenizAi
- **Ícone:** null
- **Aparência:** palette `lime-lagoon`, characterVersion `cap-v1`
- **reportsTo:** null (raiz operacional)
- **Capabilities:** Direção executiva, coordenação de diretores, planejamento estratégico, gestão de desempenho, gestão de riscos, comunicação executiva e governança organizacional
- **adapterType:** claude_local
- **adapterConfig:**
  - cwd: `/home/lg/.paperclip/instances/default/workspaces/78fb964b-0c1e-4b1c-9656-241a053bb111`
  - model: claude-opus-5-5
  - effort: high
  - engine: acp
  - graceSec: 30
  - timeoutSec: 1800
  - maxTurnsPerRun: 50
  - instructionsBundleMode: external
  - instructionsEntryFile: AGENTS.md
  - dangerouslySkipPermissions: true
- **runtimeConfig:**
  - heartbeat: enabled, intervalSec: 300, wakeOnDemand: true, maxConcurrentRuns: 5, skipTimerWhenNoActionableWork: true
  - aiConnection: shared, api_key, grantId `d0387207-eb17-443d-8af8-15cb542964b9`, provider anthropic, connectionId `0eb8d66e-671c-4f85-89df-acb5afe45592`
- **budgetMonthlyCents:** 100.000 (R$ 1.000,00)
- **spentMonthlyCents:** 0
- **permissions:** canCreateAgents: true, canCreateSkills: true
- **status:** running
- **updatedAt:** 2026-11-20T22:08:53.474Z

### Arquivos de instrução (workspace do CEO)
Local: `/home/lg/.paperclip/instances/default/workspaces/78fb964b-0c1e-4b1c-9656-241a053bb111/`

| Arquivo | Tipo | Tamanho | Updated |
|---------|------|---------|---------|
| `.claude/settings.local.json` | JSON | 1.016 bytes | 2026-11-20T22:07:06Z |
| `AGENTS.md` | (entry file) | — | — |
| `final-report.json` | JSON | 2.168 bytes | 2026-11-20T22:08:03Z |
| `final-report.md` | Markdown | 2.103 bytes | 2026-11-20T22:07:36Z |
| `PLATFORM_13_DOMAIN_AUDIT_TASK.md` | Markdown | 16.642 bytes | 2026-11-20T20:11:48Z |
| `platform_audit_blockers.md` | Markdown | 9.751 bytes | 2026-11-20T20:17:25Z |
| `platform_audit_executive_summary.md` | Markdown | 9.263 bytes | 2026-11-20T20:15:26Z |
| `platform_audit_hiring_authorization_pack.md` | Markdown | 17.112 bytes | 2026-11-20T20:23:37Z |
| `platform_audit_report_20261120.json` | JSON | 34.216 bytes | 2026-11-20T20:14:02Z |
| `platform_audit_roadmap_90d.md` | Markdown | 16.924 bytes | 2026-11-20T20:20:37Z |
| `proposta_organizacional_tokenizai.md` | Markdown | 26.420 bytes | 2026-11-20T19:52:40Z |

### Skills vinculadas ao CEO
| Skill | Chave | Versão ID | Estado | Desejado |
|-------|-------|-----------|--------|----------|
| paperclip | paperclipai/paperclip/paperclip | e5d40b7b-1f27-4bdf-9ab0-b3caa86ef1a9 | configured | sim |
| complain | paperclipai/paperclip/complain | 9ea0a853-ff4f-449f-a78a-dc28d2d8d21a | configured | sim |
| suggestion-box | paperclipai/paperclip/suggestion-box | 106ebfae-7b1f-4eb1-8c00-ea22e73a536f | configured | sim |
| nettoscorp-paperclip-operations | paperclipai/paperclip/nettoscorp-paperclip-operations | ebe8b15c-f103-48ed-b3dc-b360cb43f52a | configured | sim |
| paperclip-converting-plans-to-tasks | paperclipai/paperclip/paperclip-converting-plans-to-tasks | 3b887edd-f714-451a-ae0a-154311949d47 | configured | sim |

Mesmo conjunto de skills desejadas está configurado para todos os 7 diretores (CTO, COO, CFO, CPO, CMO, CCO).

---

## 5. Situação da Proposta Executiva

### Issues relacionadas

| Issue | ID | Título | Status | Assignee | Criado | Concluído |
|-------|-----|--------|--------|----------|---------|-----------|
| TOK-4 | `035f704f-37ab-438a-8743-b77124980d29` | Proposta Executiva Inicial de Organização da Tokenizaí | done | CEO | 19:46 | 19:59 |
| TOK-5 | `57a1c0e2-bac8-4ce5-b7b8-2b3376970cf0` | Produza uma proposta executiva inicial (TOK-4) | done | CEO | 19:50 | 19:59 |
| TOK-6 | `5a113d05-c132-4e65-a9a9-0e1f3c6b3ab1` | A diretoria da TokenizAi está agora constituída com 6 diretores | done | CEO | 20:09 | 20:19 |

### Conteúdo da proposta (arquivo `proposta_organizacional_tokenizai.md`)

**Estrutura diretiva recomendada (6 cargos):**
1. CTO — Tecnologia (prioridade 1, imediato)
2. COO — Operações (prioridade 2, curto prazo)
3. CPO — Produto (prioridade 3, curto prazo)
4. CMO — Marketing (prioridade 4, médio prazo)
5. CCO — Comercial (prioridade 5, médio prazo)
6. CFO — Finanças (prioridade 6, médio/longo prazo, pode ser fracionado)

**Princípio de criação gradual (4 fases):**
- Fase 1 (Agora): CEO + CTO
- Fase 2 (30-60 dias): + COO + CPO
- Fase 3 (60-90 dias): + CMO
- Fase 4 (90+ dias): + CCO + CFO

**Responsabilidades de cada diretor:** detalhadas na proposta com entregáveis-chave para cada cargo.

**Relações hierárquicas:** todos os 6 diretores reportam ao CEO; CEO reporta ao fundador.

**Departamentos:** Engenharia, Operações de Casos, Produto/Design, Brand/Comunicação, Vendas B2B, Contabilidade/FP&A, mais departamentos transversais (Pessoas, Jurídico Corporativo, Dados & BI, Qualidade & Auditoria).

**Prioridades de 90 dias (Top 5):**
1. Fundação Tecnológica Mínima (MVP) — CTO — 30 dias
2. Fluxo Operacional de Casos (End-to-End) — COO + CTO — 45 dias
3. Produto: Experiência do Beneficiário (MVP) — CPO + CTO — 45 dias
4. Aquisição Orgânica & Autoridade — CMO — 60 dias
5. Governança Financeira & Orçamento — CFO (fracionado) + CEO — 30 dias

**Plano de contratação de 18 agentes:** distribuído em 4 fases, totalizando 6 diretores + 12 especialistas subordinados.

**Decisões requeridas do fundador (Seção 7.1 da proposta):**
1. Autorizar criação do CTO + 2 Engenheiros (Backend, Frontend) — esta semana
2. Aprovar orçamento mensal inicial para diretoria — esta semana
3. Confirmar propósito institucional formal — esta semana
4. Definir frequência de relatórios e reuniões — próxima semana
5. Validar critérios de priorização — próxima semana

---

## 6. Matriz de Conclusão — Sete Cargos Diretivos

| Cargo | ID | Criado | Configurado | Heartbeat | Orçamento | Conexão IA | Skills | Status Geral |
|-------|-----|--------|-------------|-----------|-----------|------------|--------|--------------|
| CEO | `78fb964b` | ✓ | ✓ | ✓ (ativo) | ✓ 100.000¢ | ✓ shared | ✓ 5 skills | CONCLUÍDO |
| CTO | `8e5dee7f` | ✓ | ✓ | ✓ (idle) | ✓ 100.000¢ | ✓ shared | ✓ 5 skills | CONCLUÍDO |
| COO | `f6a35541` | ✓ | ✓ | ✓ (idle) | ✓ 100.000¢ | ✓ shared | ✓ 5 skills | CONCLUÍDO |
| CFO | `1584c40b` | ✓ | ✓ | ✓ (idle) | ✓ 100.000¢ | ✓ shared | ✓ 5 skills | CONCLUÍDO |
| CPO | `557aea55` | ✓ | ✓ | ✓ (idle) | ✓ 100.000¢ | ✓ shared | ✓ 5 skills | CONCLUÍDO |
| CMO | `df803b1c` | ✓ | ✓ | ✓ (idle) | ✓ 100.000¢ | ✓ shared | ✓ 5 skills | CONCLUÍDO |
| CCO | `dce13e51` | ✓ | ✓ | ✓ (idle) | ✓ 100.000¢ | ✓ shared | ✓ 5 skills | CONCLUÍDO |

**Conclusão:** Todos os 7 cargos do primeiro escalão estão **CONCLUÍDO** — criados, configurados com adaptador, conexão de IA, heartbeat, orçamento e skills vinculados. Nenhum cargo precisa ser criado.

---

## 7. Pendências e Impedimentos

### Pendências (não são bloqueios, são próximos passos)

| Item | Descrição | Responsável | Status |
|------|-----------|-------------|--------|
| Autorização do fundador para criação de CTO + 2 engenheiros | Decisão 7.1 da proposta executiva | Fundador | PENDENTE |
| Aprovação de orçamento mensal inicial da diretoria | Decisão 7.1 da proposta executiva | Fundador | PENDENTE |
| Confirmação de propósito institucional formal | Decisão 7.1 da proposta executiva | Fundador | PENDENTE |
| Definição de frequência de relatórios/reuniões | Decisão 7.1 da proposta executiva | Fundador + CEO | PENDENTE |
| Validação de critérios de priorização (Top 5) | Decisão 7.1 da proposta executiva | Fundador + CEO | PENDENTE |
| Submeter propostas de criação via governança de contratação | Ação autônoma do CEO | CEO | PENDENTE |
| Configurar relatórios semanais automáticos ao fundador | Ação autônoma do CEO | CEO | PENDENTE |

### Impedimentos (bloqueios concretos)

Nenhum impedimento concreto foi identificado. Todos os agentes do primeiro escalão existem e estão configurados. O único "bloqueio" é a ausência de autorização do fundador para as contratações da Fase 1 (CTO + engenheiros), que é uma decisão de governança prevista na proposta, não um problema técnico.

### Nota sobre o Summarizer
O Summarizer está `paused` e não possui heartbeat configurado. É um built-in agent do Paperclip para resumos de status. Não é um cargo diretivo e não afeta o primeiro escalão.

---

## 8. Próxima Sequência Recomendada de Execução

Com base na proposta executiva já produzida (não refeita nesta etapa):

1. **Aguardar autorização do fundador** para as 5 decisões da Seção 7.1 da proposta (criação de CTO + engenheiros, orçamento, propósito institucional, frequência de relatórios, critérios de priorização).

2. **CEO submeter propostas de criação** via governança de contratação para: CTO, Engenheiro Backend, Engenheiro Frontend (Fase 1).

3. **Após aprovação, criar os agentes** no Paperclip com o mesmo padrão de configuração dos diretores existentes (claude_local, claude-opus-5-5, aiConnection shared, heartbeat habilitado, orçamento, skills vinculadas).

4. **Seguir o plano gradual:** Fase 2 (COO + CPO + analistas + designer), Fase 3 (CMO + content + growth + DevOps), Fase 4 (CCO + vendas + CFO interno + paralegal).

5. **Não importar especialistas do Agency Agents** antes da conclusão de cada fase de diretoria, conforme definido na proposta.

---

## 9. Referências e Rastreabilidade

- **Empresa:** TokenizAi (`41094d81-f950-4565-bdf6-1de1f03909aa`)
- **CEO:** `78fb964b-0c1e-4b1c-9656-241a053bb111`
- **Issues principais:** TOK-4 (`035f704f-...`), TOK-5 (`57a1c0e2-...`), TOK-6 (`5a113d05-...`), TOK-7 (`dfcfb70c-...`), TOK-8 (`ae85e103-...`), TOK-9 (`f295b8be-...`)
- **Arquivo da proposta:** `proposta_organizacional_tokenizai.md` no workspace do CEO
- **Skill de operações:** `nettoscorp-paperclip-operations` (versão 2.0.0, inclui seções 20-27 sobre Agent Chat, Delegação, Chat-Style Tasks, teste definitivo TOK-9)
- **Instância Paperclip:** `http://127.0.0.1:3100` (local, modo local_trusted)

---

**Fim do relatório.** Nenhum agente foi criado, alterado ou excluído durante este levantamento. Aguardando próxima deliberação para continuar a constituição do primeiro escalão.