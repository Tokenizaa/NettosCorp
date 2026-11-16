# ORGANOGRAMA RECONCILIADO — NETTOSCORP (PAPERCLIP + INSTITUCIONAL)

**Data:** 16/11/2026  ·  **Versão:** 1.0  ·  **Autor:** Hermes (Chefe de Gabinete)  ·  **Base:** DELIB-014 (homologada 07/11/2026) + implantação Paperclip real

---

## 1. Princípios de Reconciliação

1. **Autoridade institucional ≠ hierarquia operacional no Paperclip.** O Fundador e Hermes não são agentes ativos no Paperclip; governam por decisão e consolidação.
2. **Hierarquia `reportsTo` no Paperclip = coordenação operacional.** Define quem acorda quem, quem distribui tarefas, quem consolida resultados.
3. **Funções executivas (CTO, etc.) não têm `reportsTo` no Paperclip.** Exercem autoridade via ADRs, políticas, interação com Orquestrador/Hermes.
4. **DELIB-014 homologa Modelo de Autoridade v1.2.** Este organograma respeita essa homologação.
5. **Nenhuma relação artificial, ciclos ou subordinações incompatíveis.**

---

## 2. Organograma Completo (4 Camadas Executivas + Operacional)

```
┌─────────────────────────────────────────────────────────────────────┐
│ L0 — FUNDADOR (Netto Farias)                                        │
│    Autoridade executiva final                                       │
│    Decisões: orçamento, modelos, adaptadores, políticas, homologação│
│    NÃO é agente Paperclip                                           │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ decide / homologa
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ L1 — HERMES — Chefe de Gabinete Executivo                           │
│    Continuidade institucional, coordenação executiva                │
│    Consolida resultados para Fundador                               │
│    Relaciona-se com Fundador (L0) e Orquestrador (L2)              │
│    NÃO é agente Paperclip ativo                                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ coordena / consolida
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ L2 — ORQUESTRADOR GLOBAL (Paperclip: 67b2b280)                      │
│    reportsTo: null  │  lifecycle: verifying  │  role: general       │
│    Coordenação operacional: distribuição, priorização, conflitos   │
│    Consolida resultados dos 18 Diretores → Hermes                  │
│    NÃO substitui autoridade do Fundador nem Hermes                 │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ reportsTo (coordenação operacional)
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ L3 — 18 DIRETORES│ │   (reportsTo │ │              │ │              │
│ DE DIVISÃO       │ │  → Orquest.) │ │              │ │              │
└───────┬──────────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
        │                   │                  │                 │
        ▼                   ▼                  ▼                 ▼
   ┌─────────┐         ┌─────────┐        ┌─────────┐       ┌─────────┐
   │Engineer.│         │Specializ│        │Marketing│       │   GIS   │
   │ 65 esp. │         │  59 esp.│        │ 37 esp. │       │ 13 esp. │
   └─────────┘         └─────────┘        └─────────┘       └─────────┘
        │                   │                  │                 │
        ▼                   ▼                  ▼                 ▼
   ┌─────────┐         ┌─────────┐        ┌─────────┐       ┌─────────┐
   │Security │         │ Design  │        │  Sales  │       │Testing  │
   │ 12 esp. │         │ 10 esp. │        │  9 esp. │       │  9 esp. │
   └─────────┘         └─────────┘        └─────────┘       └─────────┘
        │                   │                  │                 │
        ▼                   ▼                  ▼                 ▼
   ┌─────────┐         ┌─────────┐        ┌─────────┐       ┌─────────┐
   │Paid-Med │         │Proj-Mgmt│        │Academic │       │Game-Dev │
   │  7 esp. │         │  7 esp. │        │  6 esp. │       │  6 esp. │
   └─────────┘         └─────────┘        └─────────┘       └─────────┘
        │                   │                  │                 │
        ▼                   ▼                  ▼                 ▼
   ┌─────────┐         ┌─────────┐        ┌─────────┐       ┌─────────┐
   │ Product │         │Spatial-C│        │ Support │       │Finance  │
   │  6 esp. │         │  6 esp. │        │  6 esp. │       │  5 esp. │
   └─────────┘         └─────────┘        └─────────┘       └─────────┘
        │                   │                  │                 │
        ▼                   ▼                  ▼                 ▼
   ┌─────────┐         ┌─────────┐        ┌─────────┐       
   │Healthc. │         │Research │        │  (outros)         │
   │  3 esp. │         │  1 esp. │        │                   │
   └─────────┘         └─────────┘        └───────────────────┘
```

---

## 3. Tabela de Agentes Paperclip (Confirmados via API)

| Camada | Agente | ID (prefixo) | Role | Division | Especialistas | lifecycleState | reportsTo |
|---|---|---|---|---|---|---|---|
| L2 | Orquestrador Global | 67b2b280 | general | — | — | verifying | **null (raiz)** |
| L3 | Diretor de Engenharia | 86343eea | cto | engineering | 65 | verifying | 67b2b280 |
| L3 | Diretor de Especialidades Técnicas | 5b06fc7e | engineer | specialized | 59 | verifying | 67b2b280 |
| L3 | Diretor de Marketing | b6450858 | cmo | marketing | 37 | verifying | 67b2b280 |
| L3 | Diretor de Geoespacial | 6ba42e7e | engineer | gis | 13 | verifying | 67b2b280 |
| L3 | Diretor de Segurança | 01f38171 | security | security | 12 | verifying | 67b2b280 |
| L3 | Diretor de Design | c48ac62e | designer | design | 10 | verifying | 67b2b280 |
| L3 | Diretor de Vendas | 8d6868ea | general | sales | 9 | verifying | 67b2b280 |
| L3 | Diretor de Qualidade | aa133ffa | qa | testing | 9 | verifying | 67b2b280 |
| L3 | Diretor de Mídia Paga | 86813dad | general | paid-media | 7 | verifying | 67b2b280 |
| L3 | Diretor de Gestão de Projetos | 2c78e8be | pm | project-management | 7 | verifying | 67b2b280 |
| L3 | Diretor de Inteligência Acadêmica | 58895bbb | researcher | academic | 6 | verifying | 67b2b280 |
| L3 | Diretor de Desenvolvimento de Jogos | 4070bf52 | engineer | game-development | 6 | verifying | 67b2b280 |
| L3 | Diretor de Produto | 1ce53595 | pm | product | 6 | verifying | 67b2b280 |
| L3 | Diretor de Computação Espacial | 90f50ccb | engineer | spatial-computing | 6 | verifying | 67b2b280 |
| L3 | Diretor de Suporte | 7b3f4948 | general | support | 6 | verifying | 67b2b280 |
| L3 | Diretor Financeiro | 983546ec | cfo | finance | 5 | verifying | 67b2b280 |
| L3 | Diretor de Saúde | 02cca0cc | researcher | healthcare | 3 | verifying | 67b2b280 |
| L3 | Diretor de Pesquisa | f6f740f7 | researcher | research | 1 | verifying | 67b2b280 |
| L4 | 267 Especialistas | (diversos) | (diversos) | (18 divs) | — | verifying/paused | seus Diretores |

**Total confirmado:** 286 agentes (1 + 18 + 267) — zero duplicados — hierarquia `reportsTo` válida.

---

## 4. Funções Executivas (Não Operacionais no Paperclip)

| Função | Titular / Status | Autoridade | Relaciona-se com |
|---|---|---|---|
| **Fundador** | Netto Farias | Executiva final | — |
| **Chefe de Gabinete** | Hermes | Continuidade, coordenação exec. | Fundador, Orquestrador |
| **CTO** | *Proposta em análise* (Diretor Eng. *ad interim*) | Técnica transversal | Fundador, Hermes, Orquestrador |
| **CISO** | *Não definida* (lacuna) | Segurança corporativa | Fundador, CTO, Orquestrador |
| **CPO** | *Não definida* (lacuna) | Produto corporativo | Fundador, CTO, Orquestrador |

> Estas funções **não têm `reportsTo` no Paperclip**. Exercem autoridade via ADRs, políticas, reuniões de alocação e relatórios consolidados.

---

## 5. Lacunas Identificadas (Reservadas ao Fundador)

| Lacuna | Descrição | Status |
|---|---|---|
| **Diretor de Tecnologia (CTO)** | Função executiva técnica transversal | Proposta `CTO_PROPOSTA.md` — aguarda decisão |
| **Diretor de Gestão de Projetos** | Função executiva de PM transversal | Não proposta ainda |
| **CISO** | Segurança da informação corporativa | Não proposta |
| **CPO** | Produto corporativo | Não proposta |
| **CEO (agente)** | Documentação previa, mas estrutura usa Orquestrador como raiz | Não aplicável — Orquestrador ocupa posição raiz operacional |

---

## 6. Correções de Inconsistências Documentais

| Documento | Inconsistência Original | Correção Aplicada |
|---|---|---|
| `INTEGRACAO.md` | CEO como raiz (`reportsTo: null`) | Orquestrador Global é raiz operacional; CEO não é agente |
| `MATRIZ_CORRESPONDENCIA.md` | 8 cargos iniciais misturados | Separados: 6 especialistas + 2 operacionais (Orquestrador, Hermes) + 2 lacunas (CTO, Dir. Projetos) |
| `REGISTRO_PENDENCIAS` | PEND-001 (Modelo Autoridade) como bloqueio | DELIB-014 homologou v1.2 (07/11/2026) — removido de bloqueios |
| Status docs | "Homologado" vs "Aguardando homologação" | Padronizado: Elaborado → Em revisão → Aprovado doc. → Homologado |

---

## 6. Matriz de Subordinação `reportsTo` (Paperclip)

| Agente (ID) | reportsTo | Tipo |
|---|---|---|
| Orquestrador Global (67b2b280) | **null** | Raiz operacional |
| 18 Diretores | 67b2b280 | L3 → L2 |
| 267 Especialistas | ID do Diretor da divisão | L4 → L3 |
| Fundador / Hermes / CTO | **N/A** | Não operacionais |

> **Regra:** Todo agente Paperclip ativo tem `reportsTo` válido (exceto raiz). Não há ciclos. Não há órfãos.

---

## 7. Validação da DELIB-014

| Item DELIB-014 | Conformidade |
|---|---|
| Modelo de Autoridade v1.2 homologado | ✅ Fundador L0, Hermes L1, Orquestrador L2, Diretores L3, Especialistas L4 |
| Autoridade executiva final no Fundador | ✅ Reservadas: orçamento, modelos, adaptadores, homologação |
| Hermes como Chefe de Gabinete | ✅ Coordenação executiva, consolidação para Fundador |
| Orquestrador coordenação operacional | ✅ Raiz `reportsTo: null`, 18 diretores subordinados |
| Diretores comandam divisões | ✅ 18 diretores, 267 especialistas subordinados |
| Especialistas mobilizáveis sob demanda | ✅ `lifecycle: paused` padrão, acordados via wakeup |

---

**Este organograma reflete o estado REAL do Paperclip (286 agentes confirmados via API) e a governança institucional homologada (DELIB-014). Não cria relações artificiais. Lacunas documentadas e reservadas ao Fundador.**