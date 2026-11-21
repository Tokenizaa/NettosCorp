# FASE 2 — BACKUP E LIMPEZA SE LETIVA DOS AGENTES EXPERIMENTAIS

**Data:** 16/11/2026
**Executado por:** Hermes, Chefe de Gabinete Executivo
**Empresa:** NettosCorp (Paperclip, id `88af1dda-ef60-41c4-851e-65e2b1f50a9f`)
**Dependência:** Fase 0 (diagnóstico), autorização do Fundador (ORDEM EXECUTIVA INTEGRAL).

---

## 1. OBJETIVO

Esvaziar a estrutura experimental temporária do Paperclip (8 agentes instalados na Fase 0) e substituí-la pela estrutura institucional (18 divisões / 267 especialistas, Fase 1 e seguintes). A operação seguiu o protocolo:

1. Exportar configurações, identificadores, hierarquia, instruções e demais dados relevantes **antes** da exclusão.
2. Registrar os estados e erros encontrados.
3. Preservar evidências e histórico necessários à auditoria.
4. Identificar dependências e possíveis efeitos em cascata.
5. Executar a limpeza seletiva dos 8 agentes e de seus artefatos de teste, **sem** apagar a empresa, projetos legítimos, deliberações, documentação ou histórico institucional.

---

## 2. INVENTÁRIO DOS 8 AGENTES EXPERIMENTAIS (antes da exclusão)

### 2.1 Estado agrupado

| ID | Agente | Modelo/adaptador | Estado | Erro detectado | Lifecycle | reportsTo |
|---|---|---|---|---|---|---|
| 7cebf5d9-b9c1-4db8-85fc-5bec8e7e9299 | Orquestrador Global | hermes_local + nvidia/nemotron-3.5-super-vl-120b-a12b | running | Timed out | ready | NULL |
| e8a4cb30-bf8e-4def-b365-04db8808bfd1 | QA Engineer | hermes_local + nvidia/nemotron-3.5-super-vl-120b-a12b | error | Timed out | ready | 7cebf5d9 |
| cd15e7c6-791f-4d5d-b945-68295b46bb65 | Frontend Developer | hermes_local + nvidia/nemotron-3.5-super-vl-120b-a12b | error | `Hermes exited with code 1` | ready | 7cebf5d9 |
| c883cc49-7dc1-4ce7-b777-15a98b387894 | Backend Architect | hermes_local + nvidia/nemotron-3.5-super-vl-120b-a12b | running | `Hermes exited with code 1` | ready | 7cebf5d9 |
| 3badd366-87a8-4b5d-9d98-ae30105e25d2 | Technical Writer | hermes_local + nvidia/nemotron-3.5-super-vl-120b-a12b | idle | None | ready | 7cebf5d9 |
| 4e4ad0f0-70e4-4290-9662-d66cdb138c97 | DevOps Automator | hermes_local + nvidia/nemotron-3.5-super-vl-120b-a12b | running | None | ready | 7cebf5d9 |
| f0d7dcc5-7432-4471-8ebd-7b6ea7077d36 | Software Architect | hermes_local + nvidia/nemotron-3.5-super-vl-120b-a12b | idle | Timed out | ready | 7cebf5d9 |
| 6b89630b-9a16-4c51-99a6-9a758180dd6d | Project Manager Senior | hermes_local + nvidia/nemotron-3.5-super-vl-120b-a12b | error | `Hermes exited with code 1` | ready | 7cebf5d9 |

### 2.2 Evidências de estado gravadas

- `agentes-atual-completo.json` — configuração JSON completa de todos os 8 agentes (campos: id, name, role, status, lifecycleState, reportsTo, errorReason, etc.).
- `issues-atual.json` — extração de 73 issues com `assigneeAgentId`, com status (done/blocked/backlog/cancelled).
- 8 arquivos `.instructions.md` — transcrição local dos `AGENTS.md` de cada agente, preservando instruções e personalidade.
- `agencia-agents-inventario.json` — inventário de 267 agentes da fonte Agency Agents (divisão, nome, descrição, vibe, arquivo-fonte).

### 2.3 Dependências e efeitos em cascata identificados

- **Hierarquia:** os 7 agentes de especialidade tinham `reportsTo: 7cebf5d9` (Orquestrador Global). Com sua exclusão, a cadeia de subordinação do grupo experimental se desfez — o que era esperado, pois a nova estrutura (Fase 1) irá repor a hierarquia com o Orquestrador Global institucional.
- **Issues:** as 73 issues dos 8 agentes foram preservadas em `issues-atual.json`. Não foram apagadas. O novo Orquestrador Global e os 18 divisões redefinirão o backlog delas.
- **Herança no repositório:** os JSONs `agentes-criados.json`, `agentes-configurados.json`, `tarefas-distribuidas.json` e `cadastros/` documentam o estado experimental anterior. São referência histórica e não foram excluídos (preservação para auditoria).
- **Hora:** o documento `STATUS_IMPLANTACAO_OPERACIONAL.md` já registra o estado de testes prévios (causas de falha dos agents experimentais).

---

## 3. OPERAÇÃO DE EXCLUSÃO

### 3.1 Método

Cada agente foi terminado via API oficial:
`POST /api/agents/{id}/terminate` (route `router.post("/agents/:id/terminate")`).

**Resultado:** 8/8 retornaram HTTP 200.
```
7cebf5d9 (Orquestrador Global) ........ OK
e8a4cb30 (QA Engineer) ................ OK
cd15e7c6 (Frontend Developer) ......... OK
c883cc49 (Backend Architect) .......... OK
3badd366 (Technical Writer) ........... OK
4e4ad0f0 (DevOps Automator) ........... OK
f0d7dcc5 (Software Architect) ......... OK
6b89630b (Project Manager Senior) ..... OK
```

### 3.2 Verificação após exclusão

- `GET /api/companies/{id}/agents` → **0 agentes** restantes na empresa NettosCorp.
- Empresa intacta: `GET /api/companies/{id}` → `status: active`, `issueCounter: 77` (não foi reiniciada).
- Issues preservadas: **75 issues** ainda vinculadas à empresa (algumas foram reatribuídas a outros agentes ou mantiveram responsável durante o processo).

---

## 4. RESUMO DAS DECISÕES TÉCNICAS

- Não foi utilizado `DELETE /agents/{id}` (retornou 404 — endpoint não existente no Paperclip). O método correto para pausa/definição definitiva é `POST /agents/:id/terminate`.
- Não houve exclusão de `company`, `issues`, `deliberations`, documentos institucionais ou repositórios legítimos.
- O backup completo dos 8 agentes está no diretório `backup-agentes-experimentais/`.

---

## 5. PRÓXIMO PASSO

A Fase 1 (arquitectura institucional com 18 divisões / 267 especialistas) foi preparada e está registrada na pasta correspondente. Em seguida, a Fase 3 preparará as 267 novas configurações e a Fase 4 as implantará em lotes.
