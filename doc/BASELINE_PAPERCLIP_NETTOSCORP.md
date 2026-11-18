# BASELINE DA PLATAFORMA PAPERCLIP — NETTOSCORP

**Etapa:** FASE 2 — Auditoria da instalação existente (baseline antes de qualquer modificação)  
**Data da coleta:** 18/11/2026  
**Responsável:** OpenCode  
**Status:** Relatório de baseline. Nenhuma alteração foi implementada. Apenas auditoria, reconciliação e reporte.  
**Instância alvo:** `http://127.0.0.1:3100` (modo `local_trusted`, exposição `private`)  
**Empresa alvo:** NettoCorp (`NET`), ID `1ad50023-2215-4d61-b1ea-d896cfe0e535`

---

## 1. Objetivo e método

Estabelecer uma fotografia confiável do ambiente Paperclip real antes de qualquer intervenção de parametrização, contrários-se aos documentos institucionais da NettosCorp (`institutional/`, `empresa/`). Nenhuma configuração declarada foi considerada funcional sem evidência de execução real via API e CLI.

Fontes examinadas:
- API Paperclip real: `http://127.0.0.1:3100/api`
- CLI Paperclip: `pnpm paperclipai` (v0.3.1, via tsx)
- Empresa real via API: `GET /api/companies`
- Agentes reais via API: `GET /api/companies/{companyId}/agents`
- Skills reais via API: `GET /api/companies/{companyId}/skills`
- Conexões de IA reais via API: `GET /api/companies/{companyId}/ai-connections`
- Atividade real via API: `GET /api/companies/{companyId}/activity`
- Sistema de arquivos: `~/.paperclip/instances/default/`
- Documentos institucionais: `institutional/01-strategy/`, `empresa/06-operations/`, `empresa/05-technology/paperclip/`

---

## 2. Estado do ambiente Paperclip (evidência de execução real)

### 2.1 Servidor

| Item | Valor |
|------|-------|
| Endpoint | `http://127.0.0.1:3100/api` |
| Versão / commit | `0.3.1` / `7685b7a4fc00fb5469c4e1fb38b1d8ba534322af` |
| Branch | `master` |
| Commit subject | `fix(native): continue a run that reports a system environment blocker (#21959)` |
| Commitado em | 2026-11-17T04:40:37.000Z |
| Processo iniciado | 2026-11-18T03:35:11.924Z |
| Modo de implantação | `local_trusted`, exposição `private` |
| Autenticação | `authReady: true`, `localAiLoginSupported: true` |
| Recursos | `companyDeletionEnabled: true` |
| Banco | PostgreSQL embedded (PgLite) |
| Diretório da instância | `~/.paperclip/instances/default/` |
| Backup automático | Enabled, status `ok`, último backup 5.8h atrás (dentro do limite de 26h) |
| Diretório de backup | `/home/lg/.paperclip/instances/default/data/backups/` |
| Último backup | `paperclip-20261117-191811.sql.gz` (579.985 bytes) |

### 2.2 CLI Paperclip

| Item | Valor |
|------|-------|
| Nome do pacote | `paperclipai` |
| Versão | `0.3.1` |
| Caminho no monorepo | `cli/` |
| Modo de execução | `pnpm paperclipai` (via `tsx`, sem `dist/` funcional standalone) |
| Bin global instalado | Não |
| `dist/` construído | Sim, mas requer `node_modules` do workspace (não funciona standalone) |
| Contexto configurado | `~/.paperclip/context.json`, profile `default` |
| API base no contexto | `http://127.0.0.1:3100` |
| Company ID no contexto | `1ad50023-2215-4d61-b1ea-d896cfe0e535` |
| Node.js | `v24.18.0` (requisito: `>=24.11.0` ✓) |
| pnpm | `9.15.4` (requisito: `9+` ✓) |

### 2.3 Empresa no Paperclip (estado real via API)

| Campo | Valor real |
|-------|------------|
| Nome | NettoCorp |
| ID | `1ad50023-2215-4d61-b1ea-d896cfe0e535` |
| Prefixo de issues | `NET` |
| Contador de issues | 0 |
| Status | `active` |
| Pausada | Não |
| Orçamento mensal | 0 centavos |
| Gasto mensal | 0 centavos |
| Aprovação do board para novos agentes | `false` (não exigida) |
| defaultResponsibleUserId | `local-board` |
| defaultDecisionOwnerUserId | null |
| budgetOwnerUserId | null |
| interactionResolverGovernance | `{}` |
| feedbackDataSharingEnabled | `false` |
| logoAssetId | null |
| Criada em | 2026-11-17T06:11:14.004Z |
| Atualizada em | 2026-11-17T06:11:14.004Z |

Outra empresa na instância: `TokenizAi` (ID `41094d81-f950-4565-bdf6-1de1f03909aa`, prefixo `TOK`, ativa).

---

## 3. Agentes na empresa NettoCorp (19 agentes encontrados)

Todos os agentes têm `role: general`, `permissions: {canCreateAgents: true, canCreateSkills: true}`, `budgetMonthlyCents: 0`, `spentMonthlyCents: 0`, `reportsTo: null` (plano, sem hierarquia), `heartbeat: {enabled: false, intervalSec: 300, maxConcurrentRuns: 20}`.

### 3.1 Agentes em estado `idle` / `ready` (2 agentes)

| # | Nome | ID | URL key | Status | Lifecycle | Adapter | Modelo | AI Connection | AGENTS.md | Criado em |
|---|------|----|---------|--------|-----------|---------|--------|---------------|-----------|-----------|
| 1 | FCC Agent | `a3458d26-5b77-419f-b7ba-73f69633c07c` | fcc-agent | idle | ready | claude_local | (shared anthropic) | grantId `2fd47376...`, provider anthropic, connectionId `b053eb9c...` | Gerenciado, caminho configurado | 2026-11-17T14:04:39 |
| 2 | CEO | `fddd427b-4c2c-4665-855b-45f559992c18` | ceo | idle | ready | claude_local | claude-3-5-sonnet-20241022 | grantId `2fd47376...`, provider anthropic, connectionId `b053eb9c...` | Gerenciado, caminho configurado | 2026-11-17T06:11:20 |

### 3.2 Agentes em estado `paused` / `paused` (hold: `setup`) (17 agentes)

| # | Nome | ID | URL key | Adapter | defaultEnvironmentId | metadata.setupAdapterPending | Criado em |
|---|------|----|---------|---------|----------------------|------------------------------|-----------|
| 3 | FCC Agent Test | `2a16b2db-062f-4385-8040-d459cff2dde6` | fcc-agent-test | process | null | true | 2026-11-17T14:05:43 |
| 4 | FCC Agent 2 | `52a61354-2b2a-4fef-b0a6-f5cca8205e91` | fcc-agent-2 | claude_local | `592f20a1-24ee-4b6e-b222-eaf29227f436` | false | 2026-11-17T14:10:10 |
| 5 | FCC Agent Test 2 | `ba3e986c-68ec-40e4-8d4c-4c9d76ad16e6` | fcc-agent-test-2 | process | null | true | 2026-11-17T14:11:25 |
| 6 | FCC Agent 3 | `7f8d9952-ec35-4bb6-ae5e-f72685b0f907` | fcc-agent-3 | claude_local | `592f20a1-24ee-4b6e-b222-eaf29227f436` | false | 2026-11-17T14:12:30 |
| 7 | FCC Agent Test 3 | `e475acc6-15f7-4509-aab3-436916f886e7` | fcc-agent-test-3 | process | null | true | 2026-11-17T14:13:45 |
| 8 | FCC Agent 8 | `51fd30a5-65e6-46ac-b7a6-0a8e40e694f4` | fcc-agent-8 | process | null | true | 2026-11-17T18:08:47 |
| 9 | FCC Agent 4 | `9518f6c9-51a7-46cb-9c9b-bf6f02190b43` | fcc-agent-4 | claude_local | `592f20a1-24ee-4b6e-b222-eaf29227f436` | false | 2026-11-17T16:09:03 |
| 10 | FCC Agent Test 4 | `ebf2e236-9513-4f03-ab90-993152e47906` | fcc-agent-test-4 | claude_local | `592f20a1-24ee-4b6e-b222-eaf29227f436` | false | 2026-11-17T16:10:28 |
| 11 | FCC Agent 5 | `2f73a512-d20e-4d8a-9b9a-1f00db7e9879` | fcc-agent-5 | claude_local | `592f20a1-24ee-4b6e-b222-eaf29227f436` | false | 2026-11-17T17:03:13 |
| 12 | FCC Agent Test 5 | `d14a3bf9-5484-4498-9c30-7c38fd39b249` | fcc-agent-test-5 | process | null | true | 2026-11-17T17:04:42 |
| 13 | FCC Agent 6 | `6e3b4a61-5791-493d-b1a7-f8ef7db7bb9a` | fcc-agent-6 | process | null | true | 2026-11-17T17:10:58 |
| 14 | FCC Agent Test 6 | `72ffaee8-06c0-46f2-b6d6-e6b0920dc254` | fcc-agent-test-6 | process | null | true | 2026-11-17T17:11:32 |
| 15 | FCC Agent 7 | `73497c0e-24bd-4662-865e-8f2a6df14db4` | fcc-agent-7 | process | null | true | 2026-11-17T17:18:48 |
| 16 | FCC Agent Test 7 | `0d4686aa-7a8a-4a86-bb97-54152a65ca85` | fcc-agent-test-7 | process | null | true | 2026-11-17T17:19:22 |
| 17 | FCC Agent Test 8 | `7470949e-cc83-444c-8644-59621fc7d500` | fcc-agent-test-8 | process | null | true | 2026-11-17T18:07:01 |
| 18 | FCC Agent Test 9 | `00b9b31b-86ca-4764-a07e-fa7bdfd30687` | fcc-agent-test-9 | claude_local | `592f20a1-24ee-4b6e-b222-eaf29227f436` | false | 2026-11-17T18:11:06 |

Observações:
- Agentes com `adapterType: process` têm `adapterConfig: {}` e `metadata.setupAdapterPending: true` (adapter ainda não configurado).
- Agentes com `adapterType: claude_local` têm `dangerouslySkipPermissions: true` e `graceSec: 15`, `timeoutSec: 0`, `maxTurnsPerRun: 1000`.
- Todos os 19 agentes estão `paused` com `lifecycleHolds: ["setup"]` exceto os 2 listados acima.
- Nenhum agente tem `reportsTo` preenchido (hierarquia plana).

---

## 4. Projetos, Objetivos, Issues, Rotinas

| Recurso | Contagem | Detalhe |
|---------|----------|---------|
| Projetos | 0 | `GET /api/companies/1ad50023.../projects` → `[]` |
| Objetivos | 0 | `GET /api/companies/1ad50023.../goals` → `[]` |
| Issues | 0 | `GET /api/companies/1ad50023.../issues` → `[]` |
| Rotinas | 0 | `GET /api/companies/1ad50023.../routines` → `[]` |
| Aprovações | 0 | `GET /api/companies/1ad50023.../approvals` → `[]` |

---

## 5. Skills instaladas na empresa (10 skills, todas bundled/read-only)

| # | Nome | Slug | Key | Trust | Attached agents |
|---|------|------|-----|-------|-----------------|
| 1 | agentmail | agentmail | paperclipai/paperclip/agentmail | markdown_only | 0 |
| 2 | complain | complain | paperclipai/paperclip/complain | assets | 0 |
| 3 | first-task | first-task | paperclipai/paperclip/first-task | markdown_only | 0 |
| 4 | paperclip | paperclip | paperclipai/paperclip/paperclip | scripts_executables | 0 |
| 5 | paperclip-board | paperclip-board | paperclipai/paperclip/paperclip-board | markdown_only | 0 |
| 6 | paperclip-converting-plans-to-tasks | paperclip-converting-plans-to-tasks | paperclipai/paperclip/paperclip-converting-plans-to-tasks | markdown_only | 0 |
| 7 | paperclip-create-agent | paperclip-create-agent | paperclipai/paperclip/paperclip-create-agent | markdown_only | 0 |
| 8 | para-memory-files | para-memory-files | paperclipai/paperclip/para-memory-files | markdown_only | 0 |
| 9 | slack | slack | paperclipai/paperclip/slack | markdown_only | 0 |
| 10 | suggestion-box | suggestion-box | paperclipai/paperclip/suggestion-box | assets | 0 |

Todas são `source: paperclip` (bundled), `compatibility: compatible`, `sharingScope: company`, `attachedAgentCount: 0`, `editable: false` (read-only). Nenhuma skill anexada a qualquer agente.

---

## 6. Conexões de IA (3 conexões, todas `connected`)

| # | Nome | Provider | Método | Routing | Base URL | Auth | Status | Default |
|---|------|----------|--------|---------|----------|------|--------|---------|
| 1 | Company Local endpoint | openai | api_key | local, chat | `http://localhost:8082/v1` | none | connected | Não |
| 2 | Company integrate.api.nvidia.com | openai | api_key | gateway, chat | `https://integrate.api.nvidia.com/v1` | bearer | connected | Não |
| 3 | Company Local endpoint | anthropic | api_key | local, messages | `http://127.0.0.1:8082` | none | connected | Não |

Nenhuma conexão marcada como `isDefault: true`. Todas `ownership: shared`, `ownerName: Account owner`, `canSetDefault: false`.

---

## 7. Atividade recente (últimas entradas via API)

A atividade mostra:
- Criação da empresa `NettoCorp` (`company.created`, por `local-board`)
- Criação dos agentes `FCC Agent` e `CEO` (`agent.hire_created`)
- Atualizações de configuração de agentes (`agent.updated`)
- Conexões de IA locais iniciadas e conectadas (`ai_connection.local_login_started`, `ai_connection.connected`)
- Provedores: anthropic (grantId `2fd47376-a300-46e8-922e-57afb9fffe07`), openai (grantId `55f3652f-cba4-453c-a026-86a27596f9be`)
- Todas as ações por `local-board` (Board)

---

## 8. Divergências e pendências identificadas

| # | Divergência | Severidade | Observação |
|---|-------------|------------|------------|
| D1 | Nenhum projeto cadastrado | Alta | Plataforma sem estrutura de trabalho (projetos/objetivos/issues) |
| D2 | Nenhum objetivo cadastrado | Alta | Sem hierarquia de objetivos da empresa |
| D3 | 17 de 19 agentes pausados (hold `setup`) | Alta | Adapters pendentes de configuração (`setupAdapterPending: true`) |
| D4 | Hierarquia plana (nenhum `reportsTo`) | Alta | Sem estrutura organizacional definida |
| D5 | Nenhuma rotina cadastrada | Média | Sem automação recorrente |
| D6 | Nenhuma aprovação cadastrada | Média | Sem fluxo de governança de aprovações |
| D7 | Orçamento zerado para empresa e agentes | Média | Sem limites financeiros configurados |
| D8 | 10 skills bundled instaladas, 0 anexadas a agentes | Média | Skills disponíveis mas não atribuídas |
| D9 | Nenhuma conexão de IA como default | Média | Sem conexão padrão definida para agentes |
| D10 | Documentação institucional descreve estado anterior diferente | Alta | Os cadastros CIA-001..008 referenciam company ID `da110a22...` que não existe nesta instância; a instância atual foi recriada com agentes FCC |

---

## 9. Riscos e requisitos de segurança

| Risco | Descrição | Severidade |
|-------|-----------|------------|
| R1 | Tokens de API não devem ser versionados nem impressos em relatórios | Alta | Usar `PAPERCLIP_API_KEY` via variável de ambiente |
| R2 | Alterar identidades/hierarquia sem respaldo documental | Alta | Apenas após homologação das decisões institucionais |
| R3 | Executar `onboard` criaria segunda instância | Crítica | Não executar; conectar CLI à instância existente |
| R4 | Alterar porta 3100 | Crítica | Manter porta fixa |
| R5 | Modificar banco de forma destrutiva | Crítica | Não executar operações destrutivas no DB |
| R6 | `dangerouslySkipPermissions: true` em agentes claude_local | Média | Revisar se é desejado para produção |

---

## 10. Comandos CLI validados nesta instância

| Comando | Resultado |
|---------|-----------|
| `pnpm paperclipai --version` | `0.3.1` ✓ |
| `pnpm paperclipai context set --api-base http://127.0.0.1:3100 --company-id 1ad50023-2215-4d61-b1ea-d896cfe0e535` | Contexto atualizado ✓ |
| `pnpm paperclipai context show` | Mostra profile `default` com apiBase e companyId ✓ |
| `pnpm paperclipai company list` | Lista TokenizAi e NettoCorp ✓ |
| `pnpm paperclipai agent list --company-id 1ad50023-...` | Lista 19 agentes ✓ |
| `pnpm paperclipai skills list --company-id 1ad50023-...` | Lista 10 skills bundled ✓ |

---

## 11. Conclusão do baseline

A plataforma Paperclip está instalada, funcionando e acessível em `http://127.0.0.1:3100`. A empresa `NettoCorp` existe com 19 agentes (2 ativos/idle, 17 pausados em setup). Não há projetos, objetivos, issues, rotinas nem aprovações. O CLI está instalado e configurado para a instância existente. O contexto aponta para `http://127.0.0.1:3100` e company `NET`.

Este baseline é o ponto de partida para a FASE 3 (CLI já instalado e configurado), FASE 4 (criação da skill `paperclip-operator`) e FASE 5 (parametrização da NettosCorp).

**Nenhuma alteração destrutiva foi executada. Nenhum token ou segredo foi exposto.**

---

## 12. Recuperação

Documento completo: `doc/BASELINE_PAPERCLIP_NETTOSCORP.md`

Recuperar em novas sessões com leitura deste arquivo.

---

Nenhum código do Paperclip foi alterado. Nenhuma instalação foi executada além da verificação do CLI existente. Nenhum dado privado foi versionado.
