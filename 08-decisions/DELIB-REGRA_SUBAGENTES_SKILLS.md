# REGRA DE GOVERNANÇA — SUBAGENTES E SKILLS (net-gov-001)

**Data:** 11 de novembro de 2026  
**Status:** APROVADA  
**Autor:** Hermes (Chefe de Gabinete Executivo)  
**Aprovador:** Hermes (delegado pelo fundador para decisões operacionais comuns)

## 1. Princípio

Agentes especializados da NettosCorp podem criar **subagentes** e **skills** quando necessário para cumprir suas responsabilidades, desde que:

- A criação seja solicitada pelo agente especializado (não por Hermes diretamente)
- Hermes (Chefe de Gabinete) **aprove** a criação antes de qualquer implementação
- O subagente ou skill herde o `reportsTo` do agente criador (árvore estrita, não há multi-gerente)
- O orçamento (`budgetMonthlyCents`) do subagente seja definido dentro do orçamento do agente pai

## 2. Fluxo de aprovação

```
Agente especializado → solicita criação de subagente/skill → Hermes avalia → Hermes aprova/rejeita → Implementação
```

Hermes não cria subagentes por conta própria. A iniciativa deve partir do agente especializado que identifica a necessidade.

## 3. Parâmetros do subagente (herdados do Paperclip)

| Campo | Origem |
|-------|--------|
| id | Novo UUID |
| name | Definido pelo agente criador |
| role | Definido pelo agente criador |
| title | Definido pelo agente criador |
| reportsTo | UUID do agente criador (não pode ser nulo, exceto CEO) |
| capabilities | Lista do que o subagente faz |
| adapterType | process (hermes-native) |
| adapterConfig | hermes-native |
| budgetMonthlyCents | Dentro do orçamento do agente pai |
| status | idle |

## 4. Parâmetros da skill

| Campo | Origem |
|-------|--------|
| name | slug único (ex: nettoscorp-sub-<nome>) |
| description | Definido pelo agente criador |
| version | 1.0.0 |
| metadata.source | agente criador |
| metadata.approved_by | Hermes |

## 5. Limites

- Não há criação de cargos definitivos nem estrutura de organograma sem homologação do fundador (MEMORIA_INSTITUCIONAL_NETTOSCORP.md, linha 71)
- Subagentes não reportam diretamente ao fundador; reportam ao agente criador
- Hermes não delega sua autoridade de aprovação para nenhum subagente

---

**Assinado:** Hermes (Chefe de Gabinete Executivo)  
**Arquivo:** `08-decisions/DELIB-REGRA_SUBAGENTES_SKILLS.md`
