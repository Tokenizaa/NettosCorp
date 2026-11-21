# POLÍTICA DE SINCRONIZAÇÃO — AGENCY AGENTS ↔ NETTOSCORP

Versão: 1.0
Data: 15 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/POLITICA_SINCRONIZACAO.md
Status: DOCUMENTO INSTITUCIONAL OFICIAL — política vinculante após homologação

---

## 1. Princípios fundamentais

| Princípio | Descrição |
|-----------|-----------|
| **Origem preservada** | O Agency Agents permanece reconhecido como projeto independente (MIT License). A NettosCorp preserva a referência à origem e à licença em todos os documentos e agentes derivados. |
| **Não sobrescrita silenciosa** | Personalizações institucionais **não** sobrescrevem silenciosamente o conteúdo original. Toda adaptação deve ser explícita, rastreável e justificada. |
| **Comparação antes de incorporação** | Atualizações do upstream (msitarzewski/agency-agents) devem ser comparadas com a versão local antes de qualquer incorporação. |
| **Rastreabilidade de mudanças** | Alterações de personalidade, competências, processos ou instruções precisam ser rastreáveis (origem, destino, autor, data, justificativa). |
| **Conflitos → autoridade competente** | Conflitos entre conteúdo original e decisões institucionais devem ser registrados e submetidos à autoridade competente (Fundador/Conselheiro/Hermes). |
| **Adaptações aprovadas preservadas** | A atualização nunca deve eliminar adaptações institucionais aprovadas. Merge deve preservar customizações. |

---

## 2. Método técnico de manutenção da relação

### 2.1 Mecanismo atual: Git Clone Direto

O clone em `/home/lg/workspace/NettosCorp/agency-agents/` é um **repositório Git independente** com:
- Remote `origin` → `https://github.com/msitarzewski/agency-agents`
- Branch `main` tracking `origin/main`
- Histórico local preservado
- Working tree limpo (sem modificações locais no código-fonte do Agency Agents)

**Vantagens:** Simples, preserva histórico upstream, permite `git pull` direto, diff nativo.
**Desvantagens:** Requer disciplina manual para sincronização; não isola modificações locais do upstream.

### 2.2 Método recomendado para evolução: Branch de Integração + Merge Controlado

```bash
# 1. Branch de integração institucional (protegida)
git checkout -b nettoscorp/integration main

# 2. Aplicar customizações institucionais apenas nesta branch
#    - Arquivos .md de agentes: ADICIONAR seção "## 🏛️ Adaptação NettosCorp" ao final
#    - NUNCA modificar seções originais (Identidade, Missão, Regras, Processos)
#    - Documentar adaptações em MATRIZ_CORRESPONDENCIA.md

# 3. Sincronização periódica com upstream
git fetch origin
git diff main..origin/main -- agency-agents/  # Auditoriar diff
# Se mudanças relevantes: merge controlado preservando seção de adaptação
git merge origin/main -X ours  # Preserva customizações locais em conflitos
# OU merge manual seletivo por arquivo

# 4. Atualizar MATRIZ_CORRESPONDENCIA.md e REGISTRO_PENDENCIAS_DECISOES.md
# 5. Commit com mensagem Conventional Commits
# 6. PR para revisão (Hermes + Fundador se estratégico)
```

### 2.3 Estrutura de adaptação por agente (padrão obrigatório)

Todo agente do Agency Agents que for adotado institucionalmente deve receber **apenas adições** no arquivo original, no formato:

```markdown
<!-- ... conteúdo original completo preservado ... -->

---

## 🏛️ Adaptação NettosCorp (institucional)

**Cargo institucional:** [Nome do cargo na NettosCorp]
**Departamento:** [Diretoria/Departamento]
**ReportsTo administrativo:** [Cargo/UUID do supervisor]
**Orçamento mensal:** [budgetMonthlyCents aprovado]
**Adapter:** [tipo/configuração aprovada]
**Homologação:** [Decisão XX/YYYY — Fundador]
**Implementação Paperclip:** [UUID do agente / "pendente"]
**Responsável pela adaptação:** Hermes
**Data da adaptação:** YYYY-MM-DD
**Justificativa:** [Por que esta adaptação foi necessária]
**Elementos preservados do original:** [Lista: identidade, missão, regras, vibe, etc.]
**Elementos adaptados:** [Lista: reportsTo, budget, adapter, capabilities, etc.]
**Conflitos conhecidos:** [Se houver — ex: regra original vs política institucional]
```

**Regra de ouro:** O conteúdo original **nunca** é editado. Apenas seções institucionais são **adicionadas** ao final.

---

## 3. Processo de sincronização (ciclo de vida)

### 3.1 Gatilhos de sincronização

| Gatilho | Frequência | Responsável | Ação |
|---------|------------|-------------|------|
| Release/tag novo no upstream | Semanal (monitorar) | Hermes | Verificar `git fetch origin && git log --oneline main..origin/main` |
| Novo agente adicionado no upstream | Por evento | Hermes | Avaliar relevância para NettosCorp → `MATRIZ_CORRESPONDENCIA.md` |
| Mudança em agente já adotado | Por evento | Hermes | Comparar diff → registrar em `REGISTRO_PENDENCIAS_DECISOES.md` |
| Solicitação de diretoria | Sob demanda | Diretor + Hermes | Avaliar necessidade de atualização da instrução |
| Auditoria trimestral | Trimestral | Hermes | Revisão completa de divergências |

### 3.2 Fluxo de sincronização passo a passo

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    CICLO DE SINCRONIZAÇÃO AGENCY AGENTS                    │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │ 1. DETECÇÃO DE MUDANÇA │
                        │    (git fetch + diff)   │
                        └───────────┬─────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │ Novo agente │ │ Agente      │ │ Mudança em  │
            │ no upstream │ │ removido    │ │ arquivo     │
            └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
                   │               │               │
                   ▼               ▼               ▼
            ┌─────────────────────────────────────────────┐
            │ 2. AVALIAÇÃO DE RELEVÂNCIA (Hermes)         │
            │    • Afeta cargo mapeado na MATRIZ?         │
            │    • Nova especialidade relevante?          │
            │    • Conflito com política institucional?   │
            └────────────────────┬────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
            ┌─────────────┐           ┌─────────────┐
            │ NÃO RELEVANTE│           │ RELEVANTE   │
            │ → Registrar  │           │ → Prosseguir│
            │   no log     │           └──────┬──────┘
            └─────────────┘                  │
                                             ▼
                                  ┌───────────────────────┐
                                  │ 3. COMPARAÇÃO DETALHADA│
                                  │    (diff lado a lado)  │
                                  │    • Frontmatter       │
                                  │    • Identidade/Missão │
                                  │    • Regras Críticas   │
                                  │    • Processos         │
                                  │    • Vibes/Persona     │
                                  └───────────┬─────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
            ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
            │ MUDANÇA     │           │ MUDANÇA     │           │ CONFLITO    │
            │ MENOR       │           │ MAIOR       │           │ INSTITUCIONAL│
            │ (typos,     │           │ (nova regra,│           │ (regra orig │
            │ formatação) │           │ nova miss)  │           │ vs política) │
            └──────┬──────┘           └──────┬──────┘           └──────┬──────┘
                   │                         │                         │
                   ▼                         ▼                         ▼
            ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
            │ Auto-merge  │           │ Merge       │           │ ESCALAR para │
            │ preservando │           │ seletivo +  │           │ Fundador/    │
            │ adaptação   │           │ atualizar   │           │ Conselheiro  │
            │ → Commit    │           │ MATRIZ      │           │ → Decisão   │
            └─────────────┘           └─────────────┘           └─────────────┘
                   │                         │                         │
                   └─────────────────────────┼─────────────────────────┘
                                             │
                                             ▼
                                  ┌───────────────────────┐
                                  │ 4. REGISTRO E COMMIT   │
                                  │    • Atualizar MATRIZ  │
                                  │    • Atualizar REGISTRO│
                                  │    • Conventional Commit│
                                  │    • PR se estratégico │
                                  └───────────┬─────────────┘
                                              │
                                             ▼
                                  ┌───────────────────────┐
                                  │ 5. PROPAGAR PARA      │
                                  │    PAPERCLIP (se      │
                                  │    implementado)      │
                                  │    • Atualizar        │
                                  │      instructions     │
                                  │    • Nova revisão     │
                                  │      agent_config_    │
                                  │      revisions        │
                                  └───────────────────────┘
```

---

## 4. Versionamento e histórico

### 4.1 Versionamento da integração

| Componente | Esquema de versão | Onde registrado |
|------------|-------------------|-----------------|
| Clone Agency Agents | Git commit SHA (ex: `4e3ac3c`) | `INTEGRACAO_INSTITUCIONAL.md`, `INVENTARIO_AGENCY_AGENTS.md` |
| Matriz de correspondência | Versão semântica (v1.0, v1.1...) | `MATRIZ_CORRESPONDENCIA.md` header |
| Políticas de sincronização | Versão semântica | `POLITICA_SINCRONIZACAO.md` header |
| Adaptações por agente | Data + commit da adaptação | Seção `🏛️ Adaptação NettosCorp` no agente |
| Configuração Paperclip | `agent_config_revisions` (tabela nativa) | Paperclip DB + `MATRIZ_CORRESPONDENCIA.md` |

### 4.2 Histórico de sincronizações (log institucional)

| Data | Commit Upstream | Commit Integração | Agentes Afetados | Tipo | Responsável | Decisão |
|------|-----------------|-------------------|------------------|------|-------------|---------|
| 2026-11-15 | 4e3ac3c | (inicial) | — | Baseline | Hermes | Criação da integração documental |

**Regra:** Toda sincronização gera entrada nesta tabela (manter em `REGISTRO_PENDENCIAS_DECISOES.md` ou arquivo dedicado `HISTORICO_SINCRONIZACAO.md`).

---

## 5. Tratamento de conflitos

### 5.1 Tipos de conflito

| Tipo | Exemplo | Resolução |
|------|---------|-----------|
| **Regra original vs Política institucional** | Agente original: "Nunca use X" | Institucional: "X é padrão aprovado" | Escalar → Fundador decide; registrar exceção ou adaptação |
| **Missão original vs Cargo institucional** | Agente: "Foco em código" | Cargo: "Foco em arquitetura + gestão" | Adicionar escopo institucional; preservar missão original como base |
| **Persona original vs Identidade visual NettosCorp** | Agente: `color: indigo`, `emoji: 🏛️` | NettosCorp: padrões visuais próprios | Manter original no Agency Agents; definir identidade visual separada no Paperclip/NettosCorp |
| **Processo original vs Workflow Paperclip** | Agente: "Entrega via PR GitHub" | Paperclip: "Entrega via Issue + Heartbeat" | Documentar mapeamento; instrução Paperclip referencia processo original |

### 5.2 Matriz de autoridade para conflitos

| Nível de Conflito | Autoridade Decisória | Prazo |
|-------------------|---------------------|-------|
| Menor (formatação, typos, exemplos) | Hermes (autonomia operacional) | Imediato |
| Médio (nova regra, mudança de processo, nova skill) | Hermes + Diretor da área | 48h |
| Maior (mudança de missão, identidade, regra crítica) | Fundador (Netto Farias) | Conforme agenda |
| Estratégico (nova divisão, remoção de agente base, licença) | Fundador + Conselheiro | Conforme agenda |

---

## 6. Ferramentas recomendadas

### 6.1 Scripts de apoio (a desenvolver)

| Script | Função | Prioridade |
|--------|--------|------------|
| `scripts/sync-agency-agents.sh` | Fetch upstream, diff, relatório de mudanças | Alta |
| `scripts/compare-agent.sh <slug>` | Diff lado a lado de um agente específico | Alta |
| `scripts/validate-adaptations.sh` | Verifica se todas as adaptações `🏛️` estão presentes e consistentes | Média |
| `scripts/generate-matrix.sh` | Regenera `MATRIZ_CORRESPONDENCIA.md` a partir de fonte única | Média |
| `scripts/push-to-paperclip.sh <slug>` | Atualiza `instructions` do agente no Paperclip via API | Média |

### 6.2 Ferramentas existentes

- `git diff`, `git log`, `git merge` — diff e merge nativos
- `scripts/check-divisions.sh` (Agency Agents) — valida consistência divisões
- `scripts/check-runbooks.sh` (Agency Agents) — valida runbooks
- Paperclip API `/api/agents/{id}/config` — atualização de instruções
- `agent_config_revisions` — histórico de versões no Paperclip

---

## 7. Checklist de conformidade por sincronização

Antes de considerar uma sincronização concluída:

- [ ] `git fetch origin` executado
- [ ] `git diff main..origin/main -- agency-agents/` analisado
- [ ] Mudanças classificadas: irrelevante / menor / maior / conflito
- [ ] Para cada mudança relevante: comparação detalhada lado a lado
- [ ] Conflitos institucionais escalados e decididos
- [ ] Seção `🏛️ Adaptação NettosCorp` atualizada nos agentes afetados
- [ ] `MATRIZ_CORRESPONDENCIA.md` atualizada (versão, situação, pendências)
- [ ] `REGISTRO_PENDENCIAS_DECISOES.md` atualizado (se houver decisões)
- [ ] Commit com mensagem Conventional Commits (`chore(sync): ...`)
- [ ] PR criado para revisão (se mudança maior/estratégica)
- [ ] Se agente implementado no Paperclip: `instructions` atualizadas via API
- [ ] `agent_config_revisions` registra nova versão no Paperclip
- [ ] Validação: agente Paperclip em `ready`, heartbeat OK, instruções carregadas

---

## 8. Recuperação e referências

**Documento completo:** `/home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/POLITICA_SINCRONIZACAO.md`

**Documentos correlatos:**
- `INTEGRACAO_INSTITUCIONAL.md` (arquitetura e princípios)
- `INVENTARIO_AGENCY_AGENTS.md` (catálogo completo)
- `MATRIZ_CORRESPONDENCIA.md` (mapeamento agente-a-agente)
- `PROCEDIMENTO_ADOCAO_AGENTES.md` (como adotar novos agentes)
- `REGISTRO_PENDENCIAS_DECISOES.md` (conflitos e decisões pendentes)
- `agency-agents/divisions.json` (fonte de verdade divisões)
- `paperclip/packages/db/src/schema/agent_config_revisions.ts` (schema revisões)

**Upstream:** https://github.com/msitarzewski/agency-agents (MIT License)
**Clone:** `/home/lg/workspace/NettosCorp/agency-agents/` (main, tracking origin/main)