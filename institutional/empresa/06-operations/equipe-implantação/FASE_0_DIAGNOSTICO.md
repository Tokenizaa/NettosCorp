# FASE 0 — DIAGNÓSTICO E MANIFESTO DE IMPLANTAÇÃO

Data: 16/11/2026
Revisor: Hermes (chefe de gabinetes), sob ordem executiva integral do fundador
Plataforma de destino: Paperclip (https://127.0.0.1:3100) — empresa NettosCorp
Fonte de especialidades: Agency Agents (vendada em `agency-agents/`)

Aviso importante sobre procedência: `agency-agents` no repositório é um **submodule git**
(`git rev-parse HEAD` → `4e3ac3ca6604c75113f52c695dbddcc7af928b46`). Não será modificado.
A adaptação institucional será sempre escrita em camadas novas, nunca nos arquivos originais.

---

## 1. INVENTÁRIO REAL DA FONTE (agency-agents)

Contagem feita por leitura direta das pastas, não pela contagem documental:

| Divisão | Perfis com identidade (frontmatter) |
|---|---|
| engineering | 65 |
| specialized | 59 |
| marketing | 37 |
| gis | 13 |
| security | 12 |
| design | 10 |
| sales | 9 |
| testing | 9 |
| paid-media | 7 |
| project-management | 7 |
| academic | 6 |
| game-development | 6 |
| product | 6 |
| spatial-computing | 6 |
| support | 6 |
| finance | 5 |
| healthcare | 3 |
| research | 1 |
| **TOTAL** | **267** |

Divisões presentes: **18** (academic, design, engineering, finance, game-development, gis,
healthcare, marketing, paid-media, product, project-management, research, sales, security,
spatial-computing, specialized, support, testing).

> ❌ **DIVERGÊNCIA MATEMÁTICA:** a ordem executiva cita **264 perfis em 17 divisões**.
> O inventário real fecha em **267 perfis em 18 divisões**. As diferenças são:
> - +1 divisão → `research` (1 perfil).
> - +3 perfis → elevação de 264 → 267.
> Por lei da missão, o relatório deve apresentar o número real e a quantidade de exceção,
> não alterar para "264".

Pastas excluídas da contagem (não são fontes de agentes):
- `integrations/` — saídas de geração (`scripts/convert.sh`), 288 arquivos de valor complementar.
- `examples/`, `scripts/`, `strategy/` — referências/playbooks, nenhum frontmatter de agente.

---

## 2. ESTADO ATUAL DO PAPERCLIP (paperclip — empresa NettosCorp)

Deduzido de `GET /api/companies/88af1dda-ef60-41c4-851e-65e2b1f50a9f/agents`:

| ID | Agente | estado | reportsTo | erro |
|---|---|---|---|---|
| 7cebf5d9 | Orquestrador Global | **error** | NULL | Timed out |
| e8a4cb30 | QA Engineer | **error** | 7cebf5d9 | Timed out |
| cd15e7c6 | Frontend Developer | idle/ready | 7cebf5d9 | None |
| c883cc49 | Backend Architect | idle/ready | 7cebf5d9 | None |
| 3badd366 | Technical Writer | idle/ready | 7cebf5d9 | None |
| 4e4ad0f0 | DevOps Automator | idle/ready | 7cebf5d9 | None |
| f0d7dcc5 | Software Architect | running | 7cebf5d9 | None |
| 6b89630b | Project Manager Senior | running | 7cebf5d9 | None |

- Atualmente **8 agentes** no Paperclip.
- 2 estão com erro (`Timed out`): Orquestrador Global e QA Engineer.
- 1 teve término duro: Frontend Developer (`Hermes exited with code 1`).
- Orquestrador raiz dos 7 demais (as 7 especialistas).

### Limitação imediata de validação
Após criar uma tarefa (`POST /api/companies/{id}/chats/{agentRef}`) e acordar o agente via
`POST /api/agents/{id}/wakeup`, o wakeup retorna `skipped` se a issue não possui
`executionRunId`. Ou seja: o mecanismo de ativação não acorda uma issue inédita isoladamente —
é preciso que a issue esteja vinculada a uma execução. Isso exige validação cuidadosa na Fase 1-2.

---

## 3. AUDITORIA TÉCNICA — API, VOZ, MODELOS

### 3.1 Criação de agentes
- Rota: `POST /api/companies/{companyId}/agents` — usa `createAgentSchema` (`paperclip/packages/shared/src/validators/agent.ts`).
- Campos obrigatórios: `name`, `adapterType`, `adapterConfig`.
- Campos opcionais: `role`, `title`, `icon`, `appearance`, `reportsTo`, `adapterType`, `runner`,
  `instructionsBundle`, `runtimeConfig`, `budgetMonthlyCents`, `permissions`, `metadata`.

### 3.2 Campo `voice` (ordem item 6)
- **Obs.:** `createAgentSchema` **não** possui campo `voice`. A voz não é um campo de agente no Paperclip.
- Existe um serviço separado de voz (`paperclip/server/src/services/voice/`) e sessões de chamada vocal.
- A voz do agente na proposta desta ordem é, portanto, composta por: (A) estilo comunicacional
  derivado da `vibe:` do perfil original + (B) configuração de síntese de voz (caso o sistema a suporte).
- **Limitação:** o catálogo de vozes TTS (Piper, etc.) não está presente nos `env` do processo
  (`pip list`, `ls node_modules` → sem piper Python). A síntese vocal exige configuração de infraestrutura.
  A matriz vocal só poderá ser completada após essa verificação. Não se declara cobertura de vozes sem a infraestrutura confirmada.

### 3.3 Modelos, adaptadores e orçamento
- A ordem exige que o fundador mantenha reservadas decisões de orçamento, adaptador, modelo e políticas de aprovação.
- `configuracoes/*.yaml` documentam `codex_local` + `gpt-5`; o Paperclip está em `hermes_local` + `nvidia/nemotron-3.5-super-vl-120b-a12b`.
- Várias execuções falharam com rate limit / fallback entre provedores (evidenciado na Fase 0 do trabalho anterior).
- **Decisão reservada:** definir matriz de modelos e adaptadores só após autorização do fundador.

---

## 4. RESUMO BARRAMENTOSO

- Fonte: 267 agentes / 18 divisões (não 264 / 17).
- Paperclip atual: 8 agentes experimentais; 2 com erro; 1 falha dura.
- O código do agente (agente-criado etc.) e a administração de voz são novos sistemas.
- Não é possível acordar uma issue inexistente: a execução requer vinculação a uma execução.
- A síntese vocal exige infraestrutura de prover TTS confirmada.

---

## 5. PROCEDIMENTO SUGERIDO (fases — aprovado pela ordem)

| Fase | Conteúdo | Estilo |
|---|---|---|
| 0 (concluída) | Diagnóstico + manifesto | Reversível / apenas leitura |
| 1 | Arquitetura institucional (17 divisões, 267 perfis, organograma) | Documento, reversível |
| 2 | Backup dos 8 agentes, limpeza seletiva, verificação, remoção dos experimentais | Controlado |
| 3 | Prepara 267 perfis (identidade, persona, instruções, voz) | Reversível / lote |
| 4 | Implantação lote a lote no Paperclip | Controlado, com validação |
| 5 | Validação operacional (identidade, instruções, hierarquia, estado, wakeup) | Testes |
| 6 | Exercício A (gestão interna) + B (projeto externo) | Prova de cooperação |
| D | Atualização da documentação oficial | Documento |

**Nota estratégica:** 267 agentes exige implantação parcelada (ex.: 20–30 lotes de 10–15) com
validação de cada lote, conforme a própria ordem exige ("Cada lote será validado antes de iniciar o próximo").

---

## 6. PRÓXIMOS PASSOS (apenas após aprovação da fase 0)

1. Confirmar a expansão da matriz de modelos/adaptadores com o fundador (respeita limite de orçamento).
2. Definição do esquema de voz do agente: usar `voice` como **identidade comunicacional** (`vibe`/personalidade)
   + referência TTS opcional quando a infraestrutura for verificada.
3. Arochar a arquitetura institucional (fase 1), sem criar agentes.
4. A partir daí, prosseguir fase a fase com validação progressiva.

---
*Relatório gerado a partir de leituras reais de API e do repositório. Nenhum número foi alterado para
combinar com a ordem de referência: todas as discrepâncias foram registradas com evidências.*
