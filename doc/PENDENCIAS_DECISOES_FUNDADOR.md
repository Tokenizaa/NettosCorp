# PENDÊNCIAS E DECISÕES QUE DEPENDEM DO FUNDADOR — NETTOSCORP / PAPERCLIP

**Etapa:** FASE 9 — Itens que não podem ser resolvidos unilateralmente pelo OpenCode  
**Data:** 18/11/2026  
**Instância:** http://127.0.0.1:3100 | Empresa: NettoCorp (`1ad50023-2215-4d61-b1ea-d896cfe0e535`)  
**Autoridade decisória:** Netto Farias (fundador), conforme DELIB-014-2026-11-07 (Modelo de Autoridade v1.2)

---

## 1. Contexto

A plataforma Paperclip está instalada, operacional e parametrizada parcialmente. A skill institucional `nettoscorp-paperclip-operations` foi criada, importada para a company library e anexada ao agente CEO. No entanto, várias parametrizações dependem de decisões institucionais homologadas pelo fundador e **não podem ser aplicadas unilateralmente**.

Este documento registra cada pendência, a decisão necessária, a fonte governança e o impacto se não resolvida.

---

## 2. Decisões pendentes (lista ordenada por prioridade)

### D1 — ID canônico da empresa

**Decisão necessária:** Confirmar qual ID de empresa é canônico:
- ID real do banco (atual): `1ad50023-2215-4d61-b1ea-d896cfe0e535` (NettoCorp, ativa, 19 agentes)
- ID dos cadastros CIA-001 a CIA-008: `da110a22-ca31-412d-be28-5caddcabb801` (não existe nesta instância)

**Fonte:** `institutional/09-reports/BASELINE_ESTADO_REAL_AGENTES_PAPERCLIP.md` seção 7, item 1  
**Impacto se não resolvido:** Os documentos institucionais (CIA, perfis, YAMLs, JSONs) continuam apontando para um ID de empresa inexistente; qualquer aplicação desses dados apontaria para empresa inválida.  
**Recomendação:** Preservar o ID real do banco (`1ad50023...`) e atualizar os documentos institucionais para refletir o ID real.

---

### D2 — Hierarquia organizacional (`reportsTo`)

**Decisão necessária:** Confirmar o organograma e as relações de reporte:
- Opção A: Orquestrador Global como superior formal de todos os especialistas (estado atual é plano, todos `reportsTo: null`)
- Opção B: PM reporta ao fundador; especialistas reportam ao Diretor de Tecnologia (vago)
- Opção C: Outra estrutura conforme homologação

**Fonte:** `institutional/09-reports/BASELINE_ESTADO_REAL_AGENTES_PAPERCLIP.md` seção 7, item 3; `empresa/08-decisions/` DELIB-014  
**Impacto se não resolvido:** A empresa opera com hierarquia plana; não há cadeia de comando definida; a autoridade de delegação de tarefas não está clara.  
**Recomendação:** Aguardar homologação do fundador antes de definir `reportsTo` em qualquer agente.

---

### D3 — Adapter e modelo padrão de execução

**Decisão necessária:** Confirmar o adapter e modelo operacionais:
- Estado real: adapter misto (`claude_local` / `process`), modelos `claude-3-5-sonnet-20241022` / nemotron
- Documentado nos CIA: `codex_local` / `gpt-5` (baseline anterior com company ID `88af1dda...`)

**Fonte:** `institutional/09-reports/BASELINE_ESTADO_REAL_AGENTES_PAPERCLIP.md` seção 7, item 4  
**Impacto se não resolvido:** Os agentes atuais usam adapters/modelos diferentes dos documentados; o comportamento de execução não está validado contra a documentação institucional.  
**Recomendação:** Confirmar se o estado real (claude_local/process + modelos atuais) é o padrão desejado, ou se deve migrar para codex_local/gpt-5.

---

### D4 — Permissões por papel (`canCreateAgents`, `canCreateSkills`)

**Decisão necessária:** Confirmar se todos os agentes devem ter `canCreateAgents: true` e `canCreateSkills: true`, ou se devem ser restringidos por papel.

**Estado atual:** Todos os 19 agentes têm ambas as permissões `true`.  
**Limites dos cadastros CIA:** Especialistas não devem criar ou modificar agentes nem definir orçamentos/adapters sem autorização.

**Fonte:** `institutional/09-reports/BASELINE_ESTADO_REAL_AGENTES_PAPERCLIP.md` seção 7, item 5; cadastros CIA-001 a CIA-008  
**Impacto se não resolvido:** Permissões excedem os limites de autoridade dos cadastros CIA; qualquer agente pode criar novos agentes e skills sem aprovação.  
**Recomendação:** Revisar com o fundador e restringir permissões conforme o papel de cada agente.

---

### D5 — Orçamentos mensais (`budgetMonthlyCents`)

**Decisão necessária:** Definir orçamento mensal para cada agente e para a empresa.

**Estado atual:** Orçamento = 0 centavos para empresa e todos os agentes.  
**Requisito:** Conforme DEC-20261107-009 e limites dos CIA, orçamentos devem ser definidos antes de criar agentes ou alocar trabalho.

**Fonte:** `institutional/09-reports/BASELINE_ESTADO_REAL_AGENTES_PAPERCLIP.md` seção 7, item 9  
**Impacto se não resolvido:** Sem limites financeiros, não há controle de gastos por agente nem por empresa.  
**Recomendação:** Definir orçamentos conforme o plano financeiro da NettosCorp (em fundação, orçamento pode ser 0 inicialmente).

---

### D6 — Composição final da equipe de agentes

**Decisão necessária:** Confirmar se os 19 agentes atuais (nomes do tipo "FCC Agent N", "CEO") são a equipe aprovada, considerando que nenhum dos 8 IDs dos cadastros CIA-001 a CIA-008 existe nesta instância.

**Fonte:** `institutional/09-reports/BASELINE_ESTADO_REAL_AGENTES_PAPERCLIP.md` seção 7, item 8  
**Impacto se não resolvido:** Não há clareza sobre quais agentes são oficialmente parte da equipe NettosCorp.  
**Recomendação:** O fundador deve confirmar a composição da equipe antes de qualquer alteração (criar, apagar ou renomear agentes).

---

### D7 — Projetos, objetivos e tarefas iniciais

**Decisão necessária:** Definir o portfólio de projetos, objetivos e tarefas iniciais da NettosCorp no Paperclip.

**Estado atual:** 0 projetos, 0 objetivos, 0 issues.  
**Requisito:** Conforme a estratégia institucional, o portfólio deve ser definido antes de criar tarefas.

**Fonte:** `empresa/04-portfolio/`, `empresa/01-strategy/`  
**Impacto se não resolvido:** A plataforma não tem estrutura de trabalho; agentes não têm tarefas atribuídas.  
**Recomendação:** Aguardar definição do portfólio antes de criar projetos e objetivos.

---

### D8 — Agente `agente de teste` (baseline anterior)

**Nota:** Este agente existia no baseline anterior (company ID `88af1dda...`), não na instância atual (`1ad50023...`). Não há agente não cadastrado na instância atual.  
**Status:** Não se aplica à instância atual.

---

### D9 — Recursos experimentais

**Decisão necessária:** Qualificar quais recursos experimentais (Assistant Connections/MCP, Chat Connectors, Durable App Actions, Environments, Isolated Workspaces, Memory Connectors, Paperclip Runner, Status Cards, Summaries, Smoke Lab, Developer Mode, Built-in Agents, Cases, External Objects, GitHub review bots, Task Plan Decomposition) devem ser adotados, testados ou descartados.

**Fonte:** `docs/guides/board-operator/experimental-features.md`, tela Experimental da instância  
**Recomendação:** Não habilitar recursos experimentais indiscriminadamente. Avaliar individualmente antes de ativar.

---

## 3. Itens que o OpenCode NÃO fará sem decisão do fundador

Conforme os LIMITES DE AUTORIDADE da ordem executiva:

| Item | Motivo |
|------|--------|
| Recriar a organização ou criar segunda instância | Não executar `onboard`; não criar outro banco |
| Apagar agentes existentes | Preservar dados existentes |
| Alterar identidades, nome, título de agentes | Sem respaldo documental |
| Alterar hierarquia (`reportsTo`) | Sem conferir decisões homologadas |
| Substituir conexões existentes | Sem necessidade comprovada |
| Modificar banco de forma destrutiva | Preservar dados de produção |
| Alterar porta 3100 | Manter porta fixa |
| Declarar sucesso sem testes | Cada configuração deve ser validada |

---

## 4. Itens que o OpenCode PODE executar (já feitos ou em andamento)

| Item | Status |
|------|--------|
| Instalar e validar CLI `paperclipai` v0.3.1 | ✅ Feito |
| Conectar CLI à instância existente (contexto configurado) | ✅ Feito |
| Criar skill institucional `nettoscorp-paperclip-operations` | ✅ Feito (repositório + company library) |
| Anexar skill ao agente CEO | ✅ Feito |
| Backup da instância antes de alterações | ✅ Feito |
| Baseline da instância atual | ✅ Feito (`doc/BASELINE_PAPERCLIP_NETTOSCORP.md`) |
| Inventário da documentação Paperclip | ✅ Feito (`doc/INVENTARIO_DOCUMENTACAO_PAPERCLIP.md`) |
| Manual do Dashboard e interface | ✅ Feito (via subagent) |
| Catálogo de recursos experimentais | ✅ Feito (via subagent) |
| Matriz de aderência Paperclip × governança | ✅ Feito (`doc/MATRIZ_ADERENCIA_PAPERCLIP_NETTOSCORP.md`) |

---

## 5. Próximos passos após homologação do fundador

1. Confirmar ID canônico da empresa (D1)
2. Definir hierarquia e `reportsTo` (D2) → atualizar agentes via PATCH /api/agents/:id
3. Confirmar adapter e modelo padrão (D3) → atualizar configuração de agentes
4. Revisar permissões por papel (D4) → atualizar `permissions` de agentes
5. Definir orçamentos (D5) → definir `budgetMonthlyCents`
6. Confirmar composição da equipe (D6) → validar agentes atuais
7. Definir portfólio/projetos/objetivos/tarefas (D7) → criar via API
8. Qualificar recursos experimentais (D9) → habilitar os aprovados

---

## 6. Recuperação

Documento completo: `doc/PENDENCIAS_DECISOES_FUNDADOR.md`

Recuperar em novas sessões com leitura deste arquivo.

---

Nenhum código do Paperclip foi alterado além da criação da skill institucional. Nenhum token ou segredo foi exposto.
