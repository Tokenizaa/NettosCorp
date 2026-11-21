# FASE 3 — PREPARAÇÃO DAS 267 CONFIGURAÇÕES

**Data:** 16/11/2026  ·  **Revisor:** Hermes  ·  **Fonte:** `agencia-agents-inventario-v2.json` + VoiceStudio (OmniVoice)

---

## 1. Objetivo

Preparar as 267 configurações individuais para implantação no Paperclip, com:

- Identidade (nome, divisão, descrição, vibe)
- Instruções e persona
- Mapeamento de voz (VoiceStudio / OmniVoice)
- Hierarquia `reportsTo` (diretor da divisão → Orquestrador Global)
- Estado inicial `paused` (adormecido sob demanda)
- Modelo/adaptador padrão (reservado ao fundador — não alterado)

---

## 2. Fonte de dados

| Origem | Arquivo | Registros |
|---|---|---|
| Agency Agents (submodule) | `agencia-agents-inventario-v2.json` | 267 agentes / 18 divisões |
| VoiceStudio API | `http://127.0.0.1:3900` | 12 personalities · engine `omnivoice` · modelo `k2-fsa/OmniVoice` |

---

## 3. Catálogo de identidades vocais (VoiceStudio)

| Personality ID | Instruct (voz) | Uso sugerido | Licença |
|---|---|---|---|
| `narrator` | middle-aged, low pitch | Documentação, relatórios, autoridade | experimental |
| `casual` | young adult, moderate pitch | Comunicação interna, amigável | experimental |
| `news_anchor` | middle-aged, moderate pitch, american accent | Relatórios formais, status | experimental |
| `storyteller` | middle-aged, moderate pitch, british accent | Apresentações, narrativas | experimental |
| `corporate` | middle-aged, moderate pitch | Contexto corporativo, formal | experimental |
| `energetic` | young adult, high pitch | Engajamento, vendas, marketing | experimental |
| `audiobook_uk_narrator` | female, middle-aged, low pitch, british accent | Documentação longa, treinamento | experimental |
| `us_news_anchor` | male, middle-aged, moderate pitch, american accent | Briefings executivos | experimental |
| `indian_support_agent` | female, young adult, moderate pitch, indian accent | Suporte B2C, atendimento | experimental |
| `gravelly_villain` | male, elderly, very low pitch | Conteúdo de impacto/dramático | experimental |
| `aussie_podcaster` | female, young adult, high pitch, australian accent | Podcasts, informal | experimental |
| `bedtime_storyteller` | young adult, high pitch | Tutoriais relaxados | experimental |

> **Classificação:** todas as vozes estão marcadas como **experimental**. A validação técnica (Fase 5) promoverá para *validada tecnicamente*. Homologação para uso comercial futuro será decisão do fundador.

---

## 4. Mapeamento divisão → voz padrão

| Divisão | Especialistas | Personality padrão | Justificativa |
|---|---|---|---|
| engineering | 65 | narrator | Documentação técnica, autoridade |
| specialized | 59 | corporate | Suporte técnico, formal |
| marketing | 37 | storyteller | Narrativa de marca, engajamento |
| gis | 13 | news_anchor | Dados geo, precisão |
| security | 12 | corporate | Segurança, formalidade |
| design | 10 | storyteller | Visual, narrativo |
| sales | 9 | energetic | Vendas, energia |
| testing | 9 | narrator | QA, documentação de testes |
| paid-media | 7 | energetic | Mídia paga, alta energia |
| project-management | 7 | corporate | Gestão, formal |
| academic | 6 | audiobook_uk_narrator | Pesquisa, profundidade |
| game-development | 6 | storyteller | Criativo, imersivo |
| product | 6 | corporate | Produto, roadmap |
| spatial-computing | 6 | narrator | Técnico, documentação |
| support | 6 | indian_support_agent | Atendimento, acolhedor |
| finance | 5 | corporate | Financeiro, formal |
| healthcare | 3 | news_anchor | Saúde, precisão |
| research | 1 | audiobook_uk_narrator | Inovação, profundidade |

---

## 5. Estrutura de configuração por agente (JSON)

Arquivo: `fase3_configs_267.json` — 267 objetos com campos:

```json
{
  "name": "AI Data Remediation Engineer",
  "division": "engineering",
  "description": "Specialist in self-healing data pipelines...",
  "vibe": "Fixes your broken data with surgical AI precision...",
  "voice_personality_id": "narrator",
  "voice_instruct": "middle-aged, low pitch",
  "voice_language": "pt-BR",
  "voice_engine": "omnivoice",
  "reports_to": null,
  "lifecycle": "paused",
  "adapter_type": "hermes_local",
  "adapter_config": {"model": "nvidia/nemotron-3.5-super-vl-120b-a12b"}
}
```

> `reports_to` será preenchido na Fase 4 com o UUID do diretor da divisão correspondente (após criação dos 18 diretores no Paperclip).

---

## 6. Estado e validação

| Verificação | Estado | Evidência |
|---|---|---|
| 267 configs geradas | OK | `fase3_configs_267.json` |
| 18 divisões mapeadas | OK | divisão + voz |
| 12 personalities VoiceStudio | OK | `/personalities` |
| API `/generate` funcional | OK | WAV 24kHz mono gerado |
| Licença marcada | OK | todas `experimental` |
| Não alterou modelos/budget | OK | reservado ao fundador |

---

## 7. Próxima fase

**Fase 4 — Implantação em lotes no Paperclip**

1. Criar 18 Diretores de Divisão (L3) — `reportsTo` → Orquestrador Global.
2. Para cada divisão, criar seus especialistas (L4) — `reportsTo` → Diretor da divisão.
3. Validar cada lote: agente criado, `wakeup` responde, hierarquia ok, instruções carregadas.
4. Não criar todos de uma vez — lote a lote com validação.

---

**Arquivos gerados:**
- `institutional/empresa/06-operations/equipe-implantação/fase3_configs_267.json`
- `institutional/empresa/06-operations/equipe-implantação/FASE_3_PREPARACAO.md` (este documento)