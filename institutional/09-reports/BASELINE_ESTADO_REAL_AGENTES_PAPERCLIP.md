# BASELINE DE ESTADO REAL — AGENTES PAPERCLIP NETTOSCORP

**Etapa:** Auditoria e plano de execução dos agentes (Fase 0 — Preservação e baseline)
**Data da coleta:** 14/11/2026 (coleta ao vivo via API e sistema de arquivos)
**Autor:** Hermes — Chefe de Gabinete Executivo
**Status:** Relatório de baseline. Nenhuma alteração foi implementada. Apenas auditoria, reconciliação e reporte.
**Restrições respeitadas:** não foram criados, excluídos, renomeados ou substituídos agentes; não foram alterados IDs, hierarquia, orçamento, adapters, permissões nem configs; não foi forçado lifecycle por SQL; não foram iniciadas expansões.

---

## 1. Objetivo e método

Estabelecer uma fotografia confiável do ambiente real antes de qualquer intervenção, contrapondo-a aos oito cadastros CIA-001 a CIA-008, perfis e YAMLs do repositório. Nenhuma configuração declarada foi considerada funcional sem evidência de execução real.

Fontes examinadas:
- API Paperclip real: `http://127.0.0.1:3100/api` (servidor rodando, versão `2026.1106.0`, commit `29ac9045c`, branch `master`, modo `local_trusted`)
- Empresa real via API: `GET /api/companies` → empresa NettosCorp
- Agentes reais via API: `GET /api/companies/{companyId}/agents`
- Issues reais via API: `GET /api/companies/{companyId}/issues`
- Sistema de arquivos: `/home/lg/.paperclip/instances/default/companies/88af1dda-ef60-41c4-851e-65e2b1f50a9f/agents/*/instructions/AGENTS.md`
- Diretórios `cwd`: `/home/lg/.hermes/cache/scratch/nettoscorp/*`
- Documentos institucionais: `empresa/06-operations/equipe-implantação/cadastros/CIA-001..008.md`, `perfis/`, `configuracoes/*.yaml`, `agentes-configurados.json`, `agentes-criados.json`, `tarefas-distribuidas.json`
- Documento de referência (auditoria documental): branch `audit/identidades-agentes-plano-execucao-2026-11-13` no GitHub, arquivo `AUDITORIA_IDENTIDADES_DIRETRIZES_TECNICAS_E_PLANO_EXECUCAO_AGENTES.md`
- Modelo técnico Paperclip: `empresa/05-technology/paperclip/PAPERCLIP_TECNOLOGIA.md`

---

## 2. Estado do ambiente Paperclip (evidência de execução real)

### 2.1 Servidor
| Item | Valor |
|------|-------|
| Endpoint | `http://127.0.0.1:3100/api` |
| Versão / commit | `2026.1106.0` / `29ac9045c` (igual ao HEAD de `master` local) |
| Modo de implantação | `local_trusted`, exposição `private` |
| Autenticação | `authReady: true`, `localAiLoginSupported: true` |
| Banco | PostgreSQL embbeded (PgLite) na porta `54329`, diretório `/home/lg/.paperclip/instances/default/db` |
| Processo | `paperclipai onboard --yes` (PID 2557) + postgres (PID 2579) rodando |
| Aviso do servidor | `database_backup_stale`: backup mais recente com 49.1h de idade, excede o limite de 26h (`/home/lg/.paperclip/instances/default/data/backups/paperclip-20261111-222746.sql.gz`) |

### 2.2 Empresa no Paperclip (estado real)
| Campo | Valor real |
|-------|------------|
| Nome | NettosCorp |
| ID | `88af1dda-ef60-41c4-851e-65e2b1f50a9f` |
| Prefixo de issues | `NET` |
| Contador de issues | 19 |
| Status | active |
| Orçamento mensal | 0 centavos |
| Aprovação do board para novos agentes | `false` (não exigida) |
| Criada em | 2026-11-09T03:12:58.624Z |

### 2.3 Divergência crítica — ID da empresa
Os cadastros CIA-001 a CIA-008, `agentes-configurados.json` e `agentes-criados.json` declaram `company_id = da110a22-ca31-412d-be28-5caddcabb801`. Essa empresa **não existe** no Paperclip real. A empresa NettosCorp real tem ID `88af1dda-ef60-41c4-851e-65e2b1f50a9f`. Todo o baseline documental aponta para um ID de empresa inexistente.

---

## 3. Estado real de cada agente (via API Paperclip)

Foram encontrados **9 agentes** na empresa `88af1dda-ef60-41c4-851e-65e2b1f50a9f`. Oito compartilham nomes com os cadastros CIA, mas com **IDs totalmente diferentes**. Um nono agente (`agente de teste`) não consta em nenhum cadastro CIA.

| # | Nome (real) | ID Paperclip real | URL key | Role | Status | Lifecycle | Versão | reportsTo (real) | Adapter | Modelo | cwd real | lastHeartbeatAt | Criado em | AGENTS.md |
|---|-------------|-------------------|---------|------|--------|-----------|--------|------------------|---------|--------|----------|-----------------|-----------|-----------|
| 1 | Orquestrador Global | `7cebf5d9-b9c1-4db8-85fc-5bec8e7e9299` | orquestrador-global | general | idle | ready | 8 | null (raiz) | hermes_local | nvidia/nemotron-3.5-super-vl-120b-a12b | `/home/lg/.hermes/cache/scratch/nettoscorp/orquestrador` | 2026-11-14T02:32:18.943Z | 2026-11-09T04:14:01 | 93 linhas (substantivo) |
| 2 | Project Manager Senior | `6b89630b-9a16-4c51-99a6-9a758180dd6d` | project-manager-senior | pm | running | ready | 6 | `7cebf5d9...` (Orquestrador) | hermes_local | nemotron | `/home/lg/.hermes/cache/scratch/nettoscorp/qa` | 2026-11-14T02:33:56.333Z | 2026-11-12T00:01:21 | 1 linha (placeholder) |
| 3 | Software Architect | `f0d7dcc5-7432-4471-8ebd-7b6ea7077d36` | software-architect | engineer | idle | ready | 8 | `7cebf5d9...` | hermes_local | nemotron | `/home/lg/.hermes/cache/scratch/nettoscorp/arquitetura` | 2026-11-14T02:36:32.380Z | 2026-11-09T04:14:25 | 93 linhas (substantivo) |
| 4 | Backend Architect | `c883cc49-7dc1-4ce7-b777-15a98b387894` | backend-architect | engineer | idle | ready | 4 | `7cebf5d9...` | hermes_local | nemotron | `/home/lg/.hermes/cache/scratch/nettoscorp/qa` | 2026-11-14T02:35:04.652Z | 2026-11-12T00:01:23 | 1 linha (placeholder) |
| 5 | Frontend Developer | `cd15e7c6-791f-4d5d-b945-68295b46bb65` | frontend-developer | engineer | idle | ready | 3 | `7cebf5d9...` | hermes_local | nemotron | `/home/lg/.hermes/cache/scratch/nettoscorp/frontend` | 2026-11-14T02:32:40.788Z | 2026-11-12T00:01:22 | 1 linha (placeholder) |
| 6 | DevOps Automator | `4e4ad0f0-70e4-4290-9662-d66cdb138c97` | devops-automator | devops | running | ready | 3 | `7cebf5d9...` | hermes_local | nemotron | `/home/lg/.hermes/cache/scratch/nettoscorp/infra` | 2026-11-14T02:33:56.333Z | 2026-11-12T00:01:20 | 1 linha (placeholder) |
| 7 | Technical Writer | `3badd366-87a8-4b5d-9d98-ae30105e25d2` | technical-writer | engineer | running | ready | 3 | `7cebf5d9...` | hermes_local | nemotron | `/home/lg/.hermes/cache/scratch/nettoscorp/docs` | 2026-11-14T02:37:14.660Z | 2026-11-12T00:01:22 | 1 linha (placeholder) |
| 8 | QA Engineer | `e8a4cb30-bf8e-4def-b365-04db8808bfd1` | qa-engineer | qa | running | ready | 8 | `7cebf5d9...` | hermes_local | nemotron | `/home/lg/.hermes/cache/scratch/nettoscorp/qa` | 2026-11-14T02:33:56.333Z | 2026-11-09T04:14:28 | 94 linhas (substantivo) |
| 9 | agente de teste | `8e5d95af-96bb-45b7-8c8c-f2a58ff41bbc` | agente-de-teste | general | error | ready | 4 | null | hermes_local | Nemotron 3.5 Super VL 120B A12B | null | 2026-11-14T02:28:43.410Z | 2026-11-12T01:02:50 | 1 linha (placeholder) |

**Permissões (todos os 9):** `canCreateAgents: true`, `canCreateSkills: true`, `budgetMonthlyCents: 0`, `spentMonthlyCents: 0`, `trustBoundary.projectIds: []` (não exibido no resumo da API, mas presente no schema; ver seção 5).
**Heartbeat:** habilitado com `intervalSec: 300`, `maxConcurrentRuns: 20` em todos; `lastHeartbeatAt` preenchido recentemente (heartbeat está funcionando na prática).
**Instruções AGENTS.md:** existem para todos os 9, mas apenas 3 têm conteúdo substantivo (Orquestrador, Software Architect, QA Engineer). Os outros 6 contêm a linha única `You are an agent in a Paperclip company.` (placeholder).

### 3.1 Hierarquia real (orgChainHealth via API)
Todos os 8 agentes nomeados reportam ao Orquestrador Global (`7cebf5d9-...`), que por sua vez tem `reportsTo: null`. A cadeia é de profundidade 1 para todos (self → Orquestrador). Não há agente reportando diretamente a Hermes nem a fundador-netto-farias.

---

## 4. Matriz de conformidade por agente (CIA documentado vs estado real)

Cada linha confronto o cadastro CIA / perfil / YAML com o estado real da API. Símbolos: `OK` = confere, `DIV` = divergente, `AUS` = ausente no real, `NCOMP` = não comprovado.

### Orquestrador Global (CIA-001)
| Campo | Documentado (CIA/YAML) | Estado real | Conformidade |
|-------|------------------------|-------------|--------------|
| ID Paperclip | `f17a8bf5-4631-4add-870b-6286eaecba59` | `7cebf5d9-b9c1-4db8-85fc-5bec8e7e9299` | DIV (ID diferente; ID do CIA não existe no real) |
| Empresa | `da110a22-ca31-412d-be28-5caddcabb801` | `88af1dda-ef60-41c4-851e-65e2b1f50a9f` | DIV (empresa do CIA não existe) |
| Nome | Orquestrador Global | Orquestrador Global | OK |
| reportsTo | hermes-chefe-de-gabinete (YAML); Hermes (cadastro) | null | DIV (não reporta a Hermes) |
| Status | paused | idle | DIV |
| lifecycleState | verifying (configurados) / preparing (criados) | ready | DIV |
| adapterType | codex_local | hermes_local | DIV |
| Modelo | gpt-5 | nvidia/nemotron-3.5-super-vl-120b-a12b | DIV |
| cwd | `/home/lg/.hermes/cache/scratch/nettoscorp/orquestrador` | mesmo | OK |
| Diretório cwd existe | — | sim | OK |
| AGENTS.md | AGENTS.md gerenciado | 93 linhas, substantivo, baseado em CIA-001 | OK |
| lastHeartbeatAt | null (JSON) | 2026-11-14T02:32:18 | DIV (JSON desatualizado; heartbeat funciona) |
| canCreateAgents/ Skills | true (JSON); CIA limita (não criar sem autorização) | true | DIV (permissão excede o limite do cadastro) |
| orçamento | 0 | 0 | OK |

### Project Manager Senior (CIA-002)
| Campo | Documentado | Estado real | Conformidade |
|-------|-------------|-------------|--------------|
| ID Paperclip | `dd81019c-0ffa-4115-a555-c699399b4323` | `6b89630b-9a16-4c51-99a6-9a758180dd6d` | DIV |
| Empresa | `da110a22...` | `88af1dda...` | DIV |
| reportsTo | fundador-netto-farias (YAML); Fundador / Diretor GP vago (cadastro) | `7cebf5d9...` (Orquestrador) | DIV (não reporta a fundador) |
| cwd | `/home/lg/.hermes/cache/scratch/nettoscorp/pm` | `/home/lg/.hermes/cache/scratch/nettoscorp/qa` | DIV (cwd errado; diretório `/pm` não existe) |
| AGENTS.md | AGENTS.md gerenciado | 1 linha placeholder | NCOMP (instruções não populadas) |
| Status / lifecycle | paused / preparing | running / ready | DIV |
| adapter / modelo | codex_local / gpt-5 | hermes_local / nemotron | DIV |

### Software Architect (CIA-003)
| Campo | Documentado | Estado real | Conformidade |
|-------|-------------|-------------|--------------|
| ID Paperclip | `0d8d1c17-eb14-4cc6-a2d9-7f79fc88bacd` | `f0d7dcc5-7432-4471-8ebd-7b6ea7077d36` | DIV |
| reportsTo | orquestrador-global | `7cebf5d9...` (Orquestrador) | OK (conceitualmente confere, por UUID) |
| cwd | `/home/lg/.hermes/cache/scratch/nettoscorp/arquitetura` | mesmo | OK |
| Diretório cwd | — | existe (vazio) | OK |
| AGENTS.md | — | 93 linhas, substantivo | OK |
| adapter / modelo | codex_local / gpt-5 | hermes_local / nemotron | DIV |

### Backend Architect (CIA-004)
| Campo | Documentado | Estado real | Conformidade |
|-------|-------------|-------------|--------------|
| ID Paperclip | `df988cdf-e894-47c7-b34b-296f8f2960eb` | `c883cc49-7dc1-4ce7-b777-15a98b387894` | DIV |
| reportsTo | orquestrador-global | Orquestrador UUID | OK (conceitual) |
| cwd | `/home/lg/.hermes/cache/scratch/nettoscorp/backend` | `/home/lg/.hermes/cache/scratch/nettoscorp/qa` | DIV (cwd errado; diretório `/backend` não existe) |
| AGENTS.md | — | 1 linha placeholder | NCOMP |

### Frontend Developer (CIA-005)
| Campo | Documentado | Estado real | Conformidade |
|-------|-------------|-------------|--------------|
| ID Paperclip | `a8088f13-4573-43f8-9654-be716218e262` | `cd15e7c6-791f-4d5d-b945-68295b46bb65` | DIV |
| reportsTo | orquestrador-global | Orquestrador UUID | OK (conceitual) |
| cwd | `/home/lg/.hermes-cache/.../frontend` | mesmo | OK |
| Diretório | — | existe (vazio) | OK |
| AGENTS.md | — | 1 linha placeholder | NCOMP |

### DevOps Automator (CIA-006)
| Campo | Documentado | Estado real | Conformidade |
|-------|-------------|-------------|--------------|
| ID Paperclip | `12be1a99-84af-45d5-b90f-fd236a6773f7` | `4e4ad0f0-70e4-4290-9662-d66cdb138c97` | DIV |
| reportsTo | orquestrador-global | Orquestrador UUID | OK (conceitual) |
| cwd | `/home/lg/.hermes-cache/.../infra` | mesmo | OK |
| Diretório | — | existe (vazio) | OK |
| AGENTS.md | — | 1 linha placeholder | NCOMP |

### Technical Writer (CIA-007)
| Campo | Documentado | Estado real | Conformidade |
|-------|-------------|-------------|--------------|
| ID Paperclip | `1b037f76-530d-47bf-988b-66f41a8d2463` | `3badd366-87a8-4b5d-9d98-ae30105e25d2` | DIV |
| reportsTo | orquestrador-global | Orquestrador UUID | OK (conceitual) |
| cwd | `/home/lg/.hermes-cache/.../docs` | mesmo | OK |
| Diretório | — | existe (vazio) | OK |
| AGENTS.md | — | 1 linha placeholder | NCOMP |

### QA Engineer (CIA-008)
| Campo | Documentado | Estado real | Conformidade |
|-------|-------------|-------------|--------------|
| ID Paperclip | `708497eb-d506-41c4-99ba-a059f2b41096` | `e8a4cb30-bf8e-4def-b365-04db8808bfd1` | DIV |
| reportsTo | orquestrador-global (execução) | Orquestrador UUID | OK (conceitual) |
| cwd | `/home/lg/.hermes-cache/.../qa` | mesmo | OK |
| Diretório | — | existe, com logs de Playwright | OK |
| AGENTS.md | — | 94 linhas, substantivo | OK |

### Agente extra não cadastrado (não está nos CIA-001 a 008)
- Nome: `agente de teste`, ID `8e5d95af-96bb-45b7-8c8c-f2a58ff41bbc`, status `error`, `reportsTo: null`, `cwd: null`, AGENTS.md placeholder, criado 2026-11-12. Não há cadastro CIA, perfil nem YAML para este agente.

---

## 5. Divergências encontradas (consolidadas)

### D1 — ID da empresa inexistente nos documentos
Todos os cadastros CIA e JSONs declaram `company_id = da110a22-ca31-412d-be28-5caddcabb801`. Não existe no Paperclip. A empresa real é `88af1dda-ef60-41c4-851e-65e2b1f50a9f`. **Impacto:** nenhum documento de configuração corresponde ao ambiente real; qualquer aplicação desses dados apontaria para empresa inválida.

### D2 — Nenhum ID de agente do CIA confere com o real
Os 8 IDs Paperclip declarados nos cadastros CIA-001 a CIA-008 são **ausentes** do banco real. Os 8 agentes reais de mesmo nome possuem IDs diferentes. **Conclusão:** os cadastros CIA descrevem agentes que não existem com aqueles identificadores no ambiente operacional.

### D3 — Agente não cadastrado presente no real
`agente de teste` (`8e5d95af-...`) existe no Paperclip, em status `error`, sem `reportsTo`, sem `cwd`, sem cadastro CIA/perfil/YAML. É um agente fora da matriz institucional.

### D4 — Hierarquia (`reportsTo`) divergente
- Documentado (YAMLs): Orquestrador → hermes-chefe-de-gabinete; PM → fundador-netto-farias; especialistas → orquestrador-global.
- Real: Orquestrador → null; **todos** os outros 7 (incluindo PM) → Orquestrador Global. Nenhum reporta a Hermes nem ao fundador.
- Além disso, o YAML do PM aponta para `fundador-netto-farias`, um identificador que não existe como agente no banco.

### D5 — Adapter e modelo divergentes
- Documentado (YAMLs + JSONs): `adapterType: codex_local`, `model: gpt-5`.
- Real: `adapterType: hermes_local`, `model: nvidia/nemotron-3.5-super-vl-120b-a12b` em todos os 9 agentes.

### D6 — Diretórios `cwd` ausentes ou incorretos
- `/pm` (Project Manager Senior) não existe.
- `/backend` (Backend Architect) não existe.
- PM e Backend Architect apontam no real para `/.../qa` (cwd do QA Engineer), ou seja, dois agentes compartilham o cwd de um terceiro.
- `arquitetura`, `frontend`, `infra`, `docs`, `qa`, `orquestrador` existem; todos estão vazios exceto `orquestrador` (contém arquivos de estado/issues) e `qa` (contém logs de Playwright).

### D7 — Instruções AGENTS.md não populadas
Apenas 3 de 9 agentes têm AGENTS.md com conteúdo substantivo (Orquestrador, Software Architect, QA Engineer). Os outros 6 (PM, Backend, Frontend, DevOps, Technical Writer, agente de teste) contêm a linha `You are an agent in a Paperclip company.` (placeholder). Isso descumpre o requisito "instruções gerenciadas com AGENTS.md" dos YAMLs.

### D8 — Status e lifecycle divergentes vs JSONs de baseline
- `agentes-configurados.json` declara todos `status: paused`, `lifecycleState: verifying`, `lifecycleVersion: 4`.
- `agentes-criados.json` declara todos `status: paused`, `lifecycleState: preparing`, `lifecycleVersion: 2`.
- Real: todos `lifecycleState: ready`; status misto (`idle`, `running`, `error`); `lifecycleVersion` varia de 3 a 8.
- Os JSONs de baseline estão desatualizados em relação ao banco real.

### D9 — lastHeartbeatAt
JSONs declaram `lastHeartbeatAt: null` para todos. Real: todos possuem heartbeat recente (entre 02:28 e 02:37 do dia 14/11). O heartbeat está funcionando; os JSONs não refletem isso.

### D10 — Issues (tarefas) não condizem com `tarefas-distribuidas.json`
- `tarefas-distribuidas.json` lista 8 tarefas NET-1 a NET-8 (criadas 2026-11-07).
- Real: 18 issues (contador 19; NET-2 ausente). As tarefas equivalentes aparecem com identificadores deslocados (+3): NET-4 a NET-11. A maioria está `cancelled`; apenas NET-4 e NET-9 estão `done`; NET-19 (esta auditoria) está `in_progress`; NET-17 e NET-18 estão `blocked`.
- Várias issues atribuídas a IDs de agentes antigos que já não existem (ghost directories: `46b2ab36`, `4af4e9ee`, `4c3c2752`, `4ca0b666`, `a5d37c59`, `ec6493c5`, `ee343f31` sob `/agents/`), indicando agentes criados e depois removidos, deixando diretórios de instrução órfãos.

### D11 — Permissões excedem limites dos cadastros CIA
Todos os 9 agentes têm `canCreateAgents: true` e `canCreateSkills: true`. Os cadastros CIA (ex. CIA-001 limitação 9) estabelecem que especialistas não devem criar ou modificar agentes nem definir orçamentos/adaptadores sem autorização. Essa permissão é geral e não diferenciada por papel.

### D12 — Backup do banco desatualizado
Último backup com 49.1h, excedendo o limite de 26h configurado (`database_backup_stale`).

---

## 6. Riscos e dependências

| Risco | Descrição | Severidade |
|-------|-----------|------------|
| R1 | Documentação (CIA/YAML/JSON) não reflete o ambiente real; aplicar esses dados como fonte de verdade apontaria para empresa/agentes inexistentes. | Alta |
| R2 | Hierarquia real não espelha o organograma aprovado (PM reporta a Orquestrador, não ao fundador; ninguém reporta a Hermes). | Alta |
| R3 | Agente `agente de teste` em status `error`, não cadastrado, pode gerar ruído/loops no pipeline. | Média |
| R4 | 6 agentes com AGENTS.md placeholder não possuem instruções operacionais efetivas. | Alta |
| R5 | cwd incorreto/inexistente para PM e Backend Architect impede execução em diretório correto. | Alta |
| R6 | Adapter/modelo (hermes_local/nemotron) diferem do cadastrado (codex_local/gpt-5); comportamento de execução não validado contra a documentação. | Média |
| R7 | Permissões `canCreateAgents/ Skills: true` em todos os agentes, incluindo especialistas, excedem os limites de autoridade dos cadastros CIA. | Média |
| R8 | Diretórios de instrução órfãos de agentes excluídos (ghost IDs) ainda ocupam espaço no filesystem. | Baixa |
| R9 | Backup do banco desatualizado (49.1h > 26h); risco de perda em restauração. | Média |
| R10 | Dados do DefesaI-Saude (outro projeto do fundador) não devem ser misturados com NettosCorp; nenhum agente NettosCorp deve atuar fora do escopo. | Alta |

Dependências:
- D1 e D2 dependem de decisão do fundador: quais IDs/empresa são canônicos (os do banco real ou os dos cadastros CIA?).
- D4 depende de homologação do organograma e distinção entre `reportsTo` formal, reporte institucional e coordenação funcional.
- D5, D6, D7 dependem de confirmação do adapter/modelo suportados na instalação real e da política de permissões desejada.

---

## 7. Decisões que exigem aprovação do fundador (não tomar unilateralmente)

Conforme a seção 10 da auditoria documental, permanecem reservadas ao fundador:

1. **Qual ID de empresa e de agente é canônico:** manter os IDs reais do banco (`88af1dda...`, `7cebf5d9...` etc.) ou alinhar ao declarados nos cadastros CIA (`da110a22...`, `f17a8bf5...` etc.)?
2. **O que fazer do agente `agente de teste` (status `error`, não cadastrado):** remover, manter ou cadastrar formalmente?
3. **Organograma e `reportsTo`:** confirmar se Orquestrador Global deve ser o superior formal de todos os especialistas, ou se PM deve reportar ao fundador e especialistas ao Diretor de Tecnologia (vago).
4. **Adapter e modelo:** confirmar `hermes_local` + `nvidia/nemotron-3.5-super-vl-120b-a12b` como padrão operacional, ou migrar para `codex_local` + `gpt-5` conforme cadastros?
5. **Permissões:** confirmar se todos os agentes devem ter `canCreateAgents` e `canCreateSkills`, ou restringir por papel (conforme limites dos cadastros CIA).
6. **AGENTS.md placeholders:** autorizar preenchimento das instruções dos 6 agentes com placeholder.
7. **cwd incorreto/inexistente:** autorizar correção dos diretórios de trabalho de PM e Backend Architect.
8. **Composição final da equipe:** confirmar se os 8 agentes CIA (com nomes atuais) são a equipe aprovada, considerando que nenhum dos 8 IDs cadastrados existe no real.

---

## 8. Plano de execução ordenado (apenas proposta — não implementado)

Critérios de aceite (gate) devem ser cumpridos em cada fase antes de avançar. Nenhuma correção é implementada nesta etapa.

### Fase A — Validação do baseline com o fundador
1. Apresentar este relatório; confirmar IDs canônicos (empresa e agentes).
2. Decidir destino do `agente de teste`.
3. Homologar organograma e `reportsTo`.
4. **Aceite:** fundador assina quais IDs e hierarquia são válidos.

### Fase B — Reconciliação de configuração (sem forçar lifecycle)
5. Alinhar YAMLs/perfis/cadastros aos IDs reais do banco (sem alterar o banco).
6. Corrigir cwd de PM e Backend Architect para diretórios existentes.
7. Preencher AGENTS.md placeholder dos 6 agentes com conteúdo condizente com o perfil.
8. **Aceite:** configs documentais correspondem ao banco real; nenhum lifecycle forçado.

### Fase C — Piloto controlado (Fase 5 da auditoria documental)
9. Selecionar Hermes + Orquestrador + pelo menos um especialista técnico já existentes e autorizados.
10. Executar delegação ponta a ponta: solicitação → tarefa Paperclip → atribuição → execução → revisão/QA → conclusão → registro.
11. Testar texto, áudio (Piper/Telegram), falha de áudio, retomada, timeout, duplicidade.
12. **Aceite:** ciclo completo com evidências, lifecycle nativo, sem violação de autoridade/permissão; fundador aprova expansão.

### Fase D — Expansão gradual (Fase 6)
13. Expandir somente para agentes/cargos homologados.
14. Aplicar matriz dos 13 domínios por projeto.
15. Relatório final com evidências, riscos residuais e pendências.

---

## 9. Evidências e arquivos examinados (com caminhos)

**API Paperclip (execução real):**
- `GET http://127.0.0.1:3100/api/health` → versão, commit, modo, aviso de backup
- `GET http://127.0.0.1:3100/api/companies` → empresa NettosCorp ID `88af1dda-ef60-41c4-851e-65e2b1f50a9f`
- `GET http://127.0.0.1:3100/api/companies/88af1dda-ef60-41c4-851e-65e2b1f50a9f/agents` → 9 agentes com IDs, status, lifecycle, adapter, modelo, cwd, heartbeat, reportsTo
- `GET http://127.0.0.1:3100/api/companies/88af1dda-ef60-41c4-851e-65e2b1f50a9f/issues` → 18 issues, status e assignees

**Sistema de arquivos:**
- `/home/lg/.paperclip/instances/default/companies/88af1dda-ef60-41c4-851e-65e2b1f50a9f/agents/*/instructions/AGENTS.md` → 3 substanciais, 6 placeholders
- `/home/lg/.hermes/cache/scratch/nettoscorp/{orquestrador,arquitetura,frontend,infra,docs,qa}` existem; `/pm` e `/backend` não existem
- `/home/lg/.paperclip/instances/default/db` (banco embarcado, porta 54329)

**Documentos do repositório (NettosCorp, branch master):**
- `empresa/06-operations/equipe-implantação/cadastros/CIA-001-orquestrador-global.md` a `CIA-008-qa-engineer.md`
- `empresa/06-operations/equipe-implantação/perfis/*.md` (8 perfis)
- `empresa/06-operations/equipe-implantação/configuracoes/*.yaml` (8 YAMLs)
- `empresa/06-operations/equipe-implantação/agentes-configurados.json`
- `empresa/06-operations/equipe-implantação/agentes-criados.json`
- `empresa/06-operations/equipe-implantação/tarefas-distribuidas.json`
- `empresa/02-organization/PLANO_IDENTIDADES_AGENTES_E_COMUNICACAO_TELEGRAM.md`
- `empresa/05-technology/paperclip/PAPERCLIP_TECNOLOGIA.md`

**Documento de referência (branch de auditoria no GitHub, não local):**
- `audit/identidades-agentes-plano-execucao-2026-11-13` → `empresa/06-operations/auditorias/AUDITORIA_IDENTIDADES_DIRETRIZES_TECNICAS_E_PLANO_EXECUCAO_AGENTES.md`

---

**Conclusão do baseline:** o ambiente Paperclip real possui 9 agentes (8 com nomes dos cadastros CIA, mas IDs todos diferentes, mais 1 agente não cadastrado em erro), todos na empresa `88af1dda-ef60-41c4-851e-65e2b1f50a9f`, em lifecycle `ready`, com heartbeat ativo, adapter `hermes_local` e modelo nemotron. Nenhum dos 8 IDs Paperclip declarados nos cadastros CIA-001 a CIA-008 existe no banco. A documentação institucional não é espelhada pelo ambiente operacional. Nenhuma correção foi implementada; este relatório estabelece o ponto de partida para a reconciliação e o piloto, sujeitos à aprovação do fundador.
