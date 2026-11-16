# PROPOSTA INSTITUCIONAL — CTO (CHIEF TECHNOLOGY OFFICER)

**Data:** 16/11/2026  ·  **Autor:** Hermes (Chefe de Gabinete)  ·  **Status:** Proposta para decisão do Fundador

---

## 1. Contexto

A estrutura implantada no Paperclip possui:
- **Orquestrador Global** (L2, raiz operacional, `reportsTo: null`)
- **18 Diretores de Divisão** (L3), incluindo **Diretor de Engenharia** com `role: cto` (ID `86343eea`, 65 especialistas)
- **Hermes** (L1, Chefe de Gabinete Executivo, não agente ativo no Paperclip)
- **Fundador** (L0, autoridade executiva final)

**Ausência:** não existe agente/função **CTO (Chief Technology Officer)** distinto do Diretor de Engenharia. O Diretor de Engenharia atua como líder técnico da divisão, mas não há autoridade técnica transversal corporativa.

---

## 2. Missão e Atribuições do CTO

| Atribuição | Descrição |
|---|---|
| **Estratégia tecnológica corporativa** | Definir roadmap técnico de longo prazo alinhado à estratégia do Fundador; escolher padrões arquiteturais, stacks, plataformas e padrões de engenharia. |
| **Governança de arquitetura** | Aprovar decisões arquiteturais transversais (microserviços vs monolito, cloud vs on-prem, APIs, dados, segurança). |
| **Qualidade técnica e excelência** | Estabelecer padrões de código, revisão, testes, observabilidade, CI/CD, SRE, performance, segurança. |
| **Inovação e P&D tecnológico** | Identificar, avaliar e adotar tecnologias emergentes (IA, quantum, edge, novos paradigmas). |
| **Gestão de risco técnico** | Dívida técnica, dependências críticas, single points of failure, vendor lock-in, compliance técnico. |
| **Orçamento técnico** | Preparar recomendações de orçamento para infraestrutura, ferramentas, licenças, nuvem, hardware — submissão ao Fundador. |
| **Liderança da comunidade de engenharia** | Cultura técnica, contratação (quando houver), mentoria, carreira, retenção de talentos técnicos. |
| **Interface com Orquestrador Global** | Traduzir prioridades estratégicas em alocação técnica; resolver conflitos de alocação entre divisões técnicas. |
| **Relatório ao Fundador/Hermes** | Consolidar status técnico, riscos, oportunidades, métricas (DORA, SRE, security posture). |

---

## 3. Autoridade e Limites de Decisão

| Domínio | Autoridade do CTO | Requer Aprovação do Fundador |
|---|---|---|
| Stack tecnológico padrão | Sim (definir padrões) | Mudança de stack principal |
| Arquitetura de sistemas | Sim (aprovar ADRs) | Novas plataformas cloud/on-prem |
| Orçamento infraestrutura | Recomendar | Aprovar (> threshold) |
| Contratação técnica | Recomendar perfil/necessidade | Aprovar headcount/orçamento |
| Políticas de segurança | Definir baseline | Certificações formais (SOC2, ISO) |
| Adoção de IA/ML | Avaliar e recomendar | Modelos proprietários caros |
| Padrões de código/CI/CD | Obrigatório | — |

> **Princípio:** CTO decide *como* executar tecnicamente; Fundador decide *o quê* e *quanto* (orçamento, prioridade estratégica).

---

## 4. Relação Hierárquica e Funcional

```
L0 Fundador (Netto Farias)
  │
  ├── L1 Hermes — Chefe de Gabinete Executivo
  │       │
  │       ├── L2 Orquestrador Global (coordenação operacional)
  │       │       │
  │       │       ├── L3 Diretor de Engenharia (execução divisão engineering)
  │       │       ├── L3 Diretor de Segurança
  │       │       ├── L3 Diretor de Geoespacial
  │       │       └── ... (18 diretores)
  │       │
  │       └── L2.5 CTO (autoridade técnica transversal)
  │               │
  │               ├── Relaciona-se com Orquestrador Global (alocação técnica)
  │               ├── Aconselha Hermes (continuidade institucional)
  │               ├── Reporta ao Fundador (estratégia técnica)
  │               └── Não tem `reportsTo` no Paperclip (função executiva, não operacional)
  │
  └── Decisões de orçamento, modelos, adaptadores, homologação
```

**No Paperclip:**
- CTO **não** é um agente com `reportsTo` na árvore operacional.
- CTO é uma **função executiva** exercida por um agente designado (pode ser o Diretor de Engenharia acumulando, ou agente dedicado).
- A autoridade técnica é exercida via **ADRs (Architecture Decision Records)**, **políticas institucionais** e **interação com Orquestrador/Hermes**.

---

## 5. Relação com Diretor de Engenharia

| Aspecto | CTO | Diretor de Engenharia |
|---|---|---|
| **Escopo** | Corporativo (transversal) | Divisão `engineering` (65 especialistas) |
| **Foco** | Estratégia, governança, risco, inovação | Execução, delivery, gestão da divisão |
| **Autoridade** | Aprova ADRs, define padrões | Executa dentro dos padrões |
| **ReportsTo** | Fundador / Hermes (executivo) | Orquestrador Global (operacional) |
| **Pode ser a mesma pessoa?** | Sim (acúmulo temporário) | Sim, mas papéis distintos |

> **Recomendação:** Inicialmente, o Diretor de Engenharia (`86343eea`) acumula a função de CTO *ad interim*, com mandato definido e revisão trimestral. Futuro: agente dedicado se volume justificar.

---

## 6. Perfil e Competências do Agente CTO

| Competência | Descrição |
|---|---|
| **Arquitetura empresarial** | TOGAF, microserviços, event-driven, domain-driven design |
| **Engenharia de plataformas** | Kubernetes, cloud (AWS/GCP/Azure), serverless, edge |
| **Segurança e compliance** | Zero-trust, SOC2, LGPD, supply chain security |
| **Dados e IA/ML** | MLOps, feature stores, vector DBs, RAG, fine-tuning |
| **Observabilidade/SRE** | SLO/SLI, error budgets, distributed tracing, chaos engineering |
| **Liderança técnica** | Mentoria, code review culture, RFC/ADR process, tech radar |
| **Gestão de risco** | Dívida técnica, vendor assessment, business continuity |
| **Comunicação executiva** | Traduzir técnico para negócio, board reporting |

**Agent Paperclip sugerido:**
```json
{
  "name": "CTO — Chief Technology Officer",
  "role": "cto",
  "title": "Chief Technology Officer",
  "icon": "cpu",
  "adapterType": "hermes_local",
  "adapterConfig": {"model": "nvidia/nemotron-3.5-super-vl-120b-a12b"},
  "reportsTo": null,  // função executiva, não operacional
  "lifecycle": "active",
  "instructionsBundle": { ... }  // baseada em MEMORIA_INSTITUCIONAL + MODELO_AUTORIDADE
}
```

---

## 7. Próximos Passos (sujeitos à decisão do Fundador)

1. **Decisão:** Aprovar criação da função CTO (distinta de Diretor de Engenharia).
2. **Designação:** Nomear titular (inicialmente Diretor de Engenharia *ad interim*).
3. **ADR Inicial:** CTO publica ADR-001 "Estrutura de Governança Técnica Corporativa".
4. **Integração:** CTO passa a participar de reuniões de alocação com Orquestrador Global.
5. **Métricas:** Definir KPIs técnicos (DORA, MTTR, deployment freq, security posture).
6. **Revisão:** Trimestral com Fundador/Hermes.

---

## 8. Decisões Reservadas ao Fundador (não alteradas)

- Orçamento para CTO (headcount, ferramentas, nuvem)
- Modelo/adapter do agente CTO
- Homologação formal da função
- Nomeação definitiva do titular

---

**Esta proposta não cria agente no Paperclip nem altera hierarquia `reportsTo` sem autorização. Aguarda decisão do Fundador.**