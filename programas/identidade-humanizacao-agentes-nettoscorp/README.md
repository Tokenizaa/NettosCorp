# Programa de Identidade e Humanização dos Agentes NettosCorp

**Frente 2 — Pesquisa e humanização** do trabalho dual de implantação dos 267 agentes Agency Agents no Paperclip.
**Responsável:** agente dedicado à pesquisa, sob supervisão do Hermes principal (Chefe de Gabinete Executivo).
**Local dos artefatos:** `programas/identidade-humanizacao-agentes-nettoscorp/` (este repositório / GitHub).

## 1. Objetivo

Construir uma camada de identidade profissional sobre os 267 perfis das 18 divisões da Agency Agents, sem se limitar a trocar nomes:

- pesquisar referências profissionais de cada divisão/profissão;
- identificar padrões de excelência por profissão;
- compor personalidades originais e originais por agente;
- sugerir nomes humanizados e diretrizes de comunicação;
- revisar missão, comportamento e comunicação dos 267 perfis;
- produzir uma matriz de recomendações para implantação posterior.

## 2. Regra de não-conflito (obrigatória)

O agente de pesquisa **NÃO modifica agentes diretamente no Paperclip** enquanto a Frente 1 (implantação e parametrização, liderada pelo Hermes principal) estiver ativa.

- Frente 1 (Hermes principal): corrige estados dos agentes, confere hierarquia `reportsTo`, valida execução/heartbeat/entrega, ajusta parâmetros, deixa agentes prontos (`ready` / `idle`).
- Frente 2 (pesquisa): trabalha exclusivamente na matriz independente deste programa.
- Integração dos resultados no Paperclip acontece apenas depois de a matriz estar documentada, revisada e validada — nunca misturando pesquisa, parametrização e implantação.

## 3. Matriz de identidade

Arquivo: `matriz-identidade-agentes.csv` (267 linhas, uma por agente, extraídas da fonte real `institutional/empresa/06-operations/equipe-implantação/fase3_configs_267.json`).

Colunas:

| Coluna | Preenchido por | Origem |
|---|---|---|
| `id_agente_agency_agents` | Pesquisa | inventário Agency Agents (a preencher) |
| `perfil_original` | Base (extraído) | `name` do `fase3_configs_267.json` |
| `divisao` | Base (extraído) | `division` do `fase3_configs_267.json` |
| `descricao_original` | Base (extraído) | `description` do `fase3_configs_267.json` |
| `vibe_original` | Base (extraído) | `vibe` do `fase3_configs_267.json` |
| `voz_padrao_fase3` | Base (extraído) | `voice_personality_id` da Fase 3 |
| `profissao` | Pesquisa | a identificar por divisão |
| `referencias_profissionais_e_fontes` | Pesquisa | fontes web/documentais |
| `caracteristicas_comportamentais_identificadas` | Pesquisa | padrões de excelência |
| `personalidade_composta_proposta` | Pesquisa | personalidade original e composta |
| `nome_humanizado_sugerido` | Pesquisa | nome profissional humanizado |
| `diretrizes_de_comunicacao` | Pesquisa | tom, estilo, canais |
| `justificativa_e_evidencias` | Pesquisa | por que essa identidade |
| `estado_da_revisao` | Hermes principal | pendente \| em_revisao \| aprovado \| integrado |

Todos os 267 agentes iniciam com `estado_da_revisao = pendente`.

## 4. Divisões de referência (18)

| Divisão | Agentes | Voz padrão (Fase 3) |
|---|---|---|
| academic | 6 | audiobook_uk_narrator |
| design | 10 | storyteller |
| engineering | 65 | narrator |
| finance | 5 | corporate |
| game-development | 6 | storyteller |
| gis | 13 | news_anchor |
| healthcare | 3 | news_anchor |
| marketing | 37 | storyteller |
| paid-media | 7 | energetic |
| product | 6 | corporate |
| project-management | 7 | corporate |
| research | 1 | audiobook_uk_narrator |
| sales | 9 | energetic |
| security | 12 | corporate |
| spatial-computing | 6 | narrator |
| specialized | 59 | corporate |
| support | 6 | indian_support_agent |
| testing | 9 | narrator |
| **Total** | **267** | |

Fontes: `agency-agents/divisions.json` e `fase3_configs_267.json`. Contagens validadas linha a linha contra a Fase 3 (sem divergências).

## 5. Fluxo de integração (gate)

1. Pesquisa preenche a matriz para uma divisão e marca `estado_da_revisao = em_revisao`.
2. Hermes principal revisa evidências e aprova ou devolve para correção.
3. Aprovado: `estado_da_revisao = aprovado`.
4. Integração no Paperclip (Frente 1, após sua janela de parametrização/validação): aplicar nomes, personalidades e diretrizes de comunicação nas instruções/AGENTS.md dos agentes — nunca alterar `reportsTo`, `adapterType`, modelo ou orçamento sem decisão do fundador.

## 6. Progresso atual (Frente 2)

Pesquisa concluída em 16/11/2026 — referenciou as 18 divisões e preencheu a matriz (267/267 linhas) em `matriz-identidade-agentes.csv`:

| Categoria | Detalhe |
|---|---|
| Verificadas | 13/18 divisões (academic, design, engineering, finance, game-development, gis, healthcare, marketing, project-management, research, security, spatial-computing, support, testing) |
| Parcialmente verificadas | 3/18 (paid-media, sales, product — associação de classe sem fonte verificável) |
| Pendente | 1/18 (specialized — sem corpo profissional unificado; recomenda pesquisa por sub-cargo) |

Cada linha da matriz agora traz: `profissao`, `referencias_profissionais_e_fontes` (fontes verificáveis com títulos e tipos), `caracteristicas_comportamentais_identificadas`, `personalidade_composta_proposta` (modelo por divisão), `nome_humanizado_sugerido` (5 sugestões em PT-BR), `diretrizes_de_comunicacao` (tom/estilo), `justificativa_e_evidencias` e `estado_da_revisao = pendente` (aguardando revisão do Hermes principal).

## 7. Próximos passos (Frente 2)

1. Hermes principal revisa os achados por divisão e marca `em_revisao`/`aprovado` na matriz.
2. O agente de pesquisa aprofunda apenas a specialized (sub-cargos) e conclui paid-media, sales e product (associação de classe pendente).
3. Matriz completa aprovada → entrega ao fundador com recomendação de integração.
4. Integração no Paperclip na janela da Frente 1: apenas identidade/comunicação (nomes, personalidades, diretrizes em AGENTS.md/instruções). `reportsTo`, `adapterType`, modelo e orçamento ficam intactos (decisão do fundador).

Nenhum agente do Paperclip é tocado nesta frente até o gate de integração ser aberto pelo Hermes principal.
