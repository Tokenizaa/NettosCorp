# MATRIZ DE CORRESPONDÊNCIA — AGENCY AGENTS ↔ NETTOSCORP ↔ PAPERCLIP

Versão: 1.0
Data: 15 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/MATRIZ_CORRESPONDENCIA.md
Status: DOCUMENTO INSTITUCIONAL OFICIAL — matriz verificada, aguarda homologação de cargos

---

## 1. Legenda da matriz

| Coluna | Significado |
|--------|-------------|
| **#** | Número de ordem |
| **Especialidade (Agency Agents)** | Divisão/arquivo de origem no catálogo |
| **Slug (origem)** | Stem do arquivo `.md` (ex: `engineering-software-architect`) |
| **Especialidade Original** | `name` + `description` do frontmatter |
| **Cargo Institucional (NettosCorp)** | Cargo proposto na estrutura organizacional |
| **Departamento** | Diretoria/departamento na NettosCorp |
| **Nome Institucional** | Nome humanizado aprovado (se houver) — *pendente* |
| **Persona/Instruções Preservadas** | Quais elementos do agente original são mantidos |
| **Adaptações Realizadas** | Ajustes para contexto institucional (justificativa) |
| **Agente Paperclip (quando existente)** | UUID ou identificador no control plane |
| **ID Técnico (Paperclip)** | UUID do agente (quando criado) |
| **Situação** | `identificado` \| `proposto` \| `aprovado` \| `implementado` \| `validado` |
|| **Pendências/Decisões** | O que falta para avançar |

---

> **Nota de categorização — leia antes de consultar as tabelas.**
> Esta matriz agrupa 8 registros em **3 categorias** distintas. Não trate todos os registros como "cargos institucionais" no mesmo nível:
>
> - **Especialistas com correspondência direta** (itens 1 a 6): agentes reais do catálogo Agency Agents, mapeados 1:1 para cargos institucionais já definidos. São eles: Software Architect, Backend Architect, Frontend Developer, DevOps Automator, Project Manager Senior, Technical Writer.
> - **Agentes operacionais já existentes/implantados** (itens 7 a 8): Agente Corporativo Global de Orquestração (item 7) e Chefe de Gabinete Executivo — Hermes (item 8). Não são cargos de direção: o Orquestrador reporta administrativamente à Hermes, e esta ao Fundador.
> - **Cargos de direção previstos, sem agente correspondente** (ver seção 4): Diretor de Tecnologia e Diretor de Gestão de Projetos. Estão registrados como lacunas (GAP-001, GAP-002) até sua definição institucional.
>
> A nomenclatura segue a regra: **especialidade → cargo → departamento → agente Paperclip**; as três camadas nunca devem ser confundidas.

## 2. Categorias de registros previstos na documentação institucional (fase 0-1)

Estas 8 entradas são agrupadas em 3 categorias: especialistas com correspondência direta, agentes operacionais já existentes/implantados, e cargos de direção sem agente correspondente (lacunas).

| # | Especialidade (Agency Agents) | Slug | Especialidade Original | Cargo Institucional | Departamento | Nome Inst. | Persona Preservada | Adaptações | Agente Paperclip | ID Técnico | Situação | Pendências |
|---|-------------------------------|------|------------------------|---------------------|--------------|------------|-------------------|------------|------------------|------------|----------|------------|
| 1 | engineering/software-architect | engineering-software-architect | Software Architect — Expert em system design, DDD, architectural patterns, ADRs | **Software Architect** | Diretoria de Tecnologia | — | Identidade, missão, regras críticas, ADR template, vibe "Designs systems that survive the team that built them" | Adicionar `reportsTo` → Diretor de Tecnologia; `budgetMonthlyCents`; `adapterType`; `capabilities` mapeado de description | — | — | **identificado** | Homologação do cargo; orçamento; adapter; aprovação board |
| 2 | engineering/backend-architect | engineering-backend-architect | Backend Architect — Senior backend architect: scalable system design, database architecture, API development, cloud infrastructure | **Backend Architect** | Diretoria de Tecnologia | — | Identidade, missão (data/schema, architecture, reliability, performance/security), regras críticas, vibe "Designs the systems that hold everything up" | Adicionar `reportsTo` → Diretor de Tecnologia; `budgetMonthlyCents`; `adapterType`; `capabilities` | — | — | **identificado** | Homologação do cargo; orçamento; adapter; aprovação board |
| 3 | engineering/frontend-developer | engineering-frontend-developer | Frontend Developer — Expert em React/Vue/Angular, UI implementation, performance optimization | **Frontend Developer** | Diretoria de Tecnologia | — | Identidade, missão (editor integration, web apps, performance, code quality), regras críticas, vibe "Builds responsive, accessible web apps with pixel-perfect precision" | Adicionar `reportsTo` → Diretor de Tecnologia; `budgetMonthlyCents`; `adapterType`; `capabilities` | — | — | **identificado** | Homologação do cargo; orçamento; adapter; aprovação board |
| 4 | engineering/devops-automator | engineering-devops-automator | DevOps Automator — Expert em infrastructure automation, CI/CD, cloud operations | **DevOps Automator** | Diretoria de Tecnologia | — | Identidade, missão (infra automation, reliability, cost optimization), regras críticas, vibe "Automates infrastructure so your team ships faster and sleeps better" | Adicionar `reportsTo` → Diretor de Tecnologia; `budgetMonthlyCents`; `adapterType`; `capabilities` | — | — | **identificado** | Homologação do cargo; orçamento; adapter; aprovação board |
| 5 | project-management/project-manager-senior | project-manager-senior | Senior Project Manager — Converts specs to tasks, realistic scope, persistent memory | **Project Manager Senior** | Diretoria de Gestão de Projetos | — | Identidade, responsabilidades (spec analysis, task creation, tech stack), regras críticas (realistic scope, learning), vibe "Converts specs to tasks with realistic scope — no gold-plating" | Adicionar `reportsTo` → Diretor de Gestão de Projetos; `budgetMonthlyCents`; `adapterType`; `capabilities`; ajustar referências a `ai/memory-bank/` para contexto Paperclip | — | — | **identificado** | Homologação do cargo; orçamento; adapter; aprovação board |
| 6 | engineering/technical-writer | engineering-technical-writer | Technical Writer — Expert em developer documentation, API references, READMEs, tutorials | **Technical Writer** | Compartilhável (todas diretorias) | — | Identidade, missão (dev docs, docs-as-code, content quality), regras críticas (code examples must run, no assumption of context, version everything), vibe "Writes the docs that developers actually read and use" | Adicionar `reportsTo` funcional → múltiplos diretores; `budgetMonthlyCents`; `adapterType`; `capabilities`; cargo transversal | — | — | **identificado** | Homologação do cargo; orçamento; adapter; aprovação board; modelo de relatório funcional |
| 7 | specialized/agents-orchestrator | agents-orchestrator | Agents Orchestrator — Autonomous pipeline manager: PM → Architect → Dev↔QA → Integration | **Agente Corporativo Global de Orquestração** | Nível 2 — Direção Executiva | — | Identidade, missão (orchestrate pipeline, quality loops, autonomous operation), regras críticas (quality gates, retry limits, state management), vibe "The conductor who runs the entire dev pipeline from spec to ship" | **Subordinação administrativa a Hermes** (não hierárquica funcional); `reportsTo` → Hermes; `budgetMonthlyCents`; `adapterType`; `capabilities`; autoridade operacional delegada e limitada | — | — | **identificado** | Homologação do modelo autoridade v1.2; orçamento; adapter; aprovação board |
| 8 | specialized/specialized-chief-of-staff | specialized-chief-of-staff | Specialized Chief of Staff — Coordenação executiva, continuidade, alinhamento institucional | **Chefe de Gabinete Executivo (Hermes)** | Nível 2 — Direção Executiva | **Hermes** | **Já implantado** — identidade, missão, regras, vibe institucional definidos em `MEMORIA_INSTITUCIONAL.md` e `MODELO_AUTORIDADE.md` | **Já implementado no Paperclip** (agent Hermes existente); `reportsTo` → Fundador; coordena Orquestrador administrativamente | **Existente** | **UUID do Hermes no Paperclip** | **validado** | Nenhuma — já operacional |

---

## 3. Agentes adicionais do catálogo (expansão futura — fase 3+)

Estes agentes existem no Agency Agents e são relevantes para a NettosCorp, mas **não** fazem parte da composição inicial. Registrados para rastreabilidade futura.

| # | Especialidade (Agency Agents) | Slug | Especialidade Original | Cargo Institucional Proposto | Departamento | Situação | Observação |
|---|-------------------------------|------|------------------------|------------------------------|--------------|----------|------------|
| 9 | engineering/sre | engineering-sre | SRE — SLOs, error budgets, observabilidade, chaos engineering | SRE / Reliability Engineer | Diretoria de Tecnologia / Qualidade | identificado | Médio prazo |
| 10 | engineering/code-reviewer | engineering-code-reviewer | Code Reviewer — Revisão de código, segurança, manutenibilidade | Code Reviewer | Diretoria de Qualidade / Tecnologia | identificado | Compartilhável |
| 11 | engineering/identity-access-engineer | engineering-identity-access-engineer | Identity & Access Engineer — IAM, auth, authorization | Identity & Access Engineer | Diretoria de Segurança da Informação | identificado | Médio prazo |
| 12 | engineering/incident-response-commander | engineering-incident-response-commander | Incident Response Commander — Resposta a incidentes, war-room | Incident Response Commander | Diretoria de Segurança / Operações | identificado | Médio prazo |
| 13 | design/design-ux-architect | design-ux-architect | UX Architect — Experiência do usuário, research, design systems | UX Architect | Diretoria de Tecnologia / Produto | identificado | Médio prazo |
| 14 | design/design-brand-guardian | design-brand-guardian | Brand Guardian — Identidade visual, guidelines, compliance | Brand Guardian | Compartilhável (Marketing, Produto) | identificado | Compartilhável |
| 15 | support/support-analytics-reporter | support-analytics-reporter | Analytics Reporter — Relatórios de suporte, métricas | Analytics Reporter | Diretoria de Gestão de Projetos / Operações | identificado | Baixa prioridade |
| 16 | engineering/ai-engineer | engineering-ai-engineer | AI Engineer — ML, deploy modelos, integração IA | AI Engineer | Diretoria de Tecnologia | identificado | Fase 5+ |
| 17 | engineering/multi-agent-systems-architect | engineering-multi-agent-systems-architect | Multi-Agent Systems Architect — Topologia, contexto, confiança, recuperação | Multi-Agent Systems Architect | Diretoria de Tecnologia / Orquestração | identificado | Fase 5+ |
| 18 | engineering/prompt-engineer | engineering-prompt-engineer | Prompt Engineer — Design e otimização de prompts | Prompt Engineer | Diretoria de Tecnologia | identificado | Fase 5+ |
| 19 | engineering/database-optimizer | engineering-database-optimizer | Database Optimizer — Schema design, query optimization | Database Optimizer | Diretoria de Tecnologia / Qualidade | identificado | Compartilhável |
| 20 | engineering/platform-engineer | engineering-platform-engineer | Platform Engineer — Plataformas internas, developer platforms | Platform Engineer | Diretoria de Tecnologia | identificado | Fase 5+ |
| 21 | security/security-engineer | security-engineer | Security Engineer — Segurança de aplicação, threat modeling | Security Engineer | Diretoria de Segurança da Informação | identificado | Médio prazo |
| 22 | testing/testing-evidence-collector | testing-evidence-collector | Evidence Collector — Coleta de evidências de teste | Test Evidence Collector | Diretoria de Qualidade | identificado | Runbook startup-mvp |
| 23 | testing/testing-reality-checker | testing-reality-checker | Reality Checker — Validação de realidade, smoke tests | Reality Checker | Diretoria de Qualidade | identificado | Runbook startup-mvp |
| 24 | product/product-sprint-prioritizer | product-sprint-prioritizer | Sprint Prioritizer — Priorização de sprint, backlog | Sprint Prioritizer | Diretoria de Gestão de Projetos / Produto | identificado | Compartilhável, runbook startup-mvp |
| 25 | marketing/marketing-growth-hacker | marketing-growth-hacker | Growth Hacker — Crescimento, aquisição, experimentação | Growth Hacker | Diretoria de Marketing (futura) | identificado | Fase 5+ |
| 26 | specialized/operations-manager | operations-manager | Operations Manager — Gestão de operações | Operations Manager | Diretoria de Operações (futura) | identificado | Reavaliar necessidade Dir. Operações |

---

## 4. Lacunas identificadas (sem equivalência direta no Agency Agents)

| Cargo Institucional Necessário | Lacuna | Proposta Fundamentada |
|-------------------------------|--------|----------------------|
| **Diretor de Tecnologia** | Não existe agente "Director of Engineering" ou "CTO" no catálogo | Criar cargo institucional **sem** agente Agency Agents correspondente; o Diretor é autoridade, não especialista. O agente Paperclip seria configurado com `role: "director"`, `capabilities` de liderança técnica, instruções derivadas da governança NettosCorp |
| **Diretor de Gestão de Projetos** | Não existe agente "Director of Project Management" | Mesmo padrão: cargo institucional, agente Paperclip com `role: "director"`, instruções de governança |
| **Diretor de Qualidade** | Não existe agente "Director of Quality" | Cargo institucional futuro (fase 3) |
| **Diretor de Segurança da Informação** | Não existe agente "CISO" ou "Security Director" | Cargo institucional futuro (fase 3) |
| **Gerente de Arquitetura** | Não existe agente "Architecture Manager" | Cargo Nível 4, subordinado a Diretor de Tecnologia |
| **Gerente de Segurança da Informação** | Não existe agente "Security Manager" | Cargo Nível 4, subordinado a Diretor de Segurança |
| **Gerentes de Projeto (por projeto)** | `project-manager-senior` existe, mas é sênior único | Clonar/adaptar `project-manager-senior` para múltiplas instâncias com `reportsTo` → Diretor de Gestão de Projetos |
| **Coordenador de QA** | Não existe agente "QA Coordinator" | Cargo Nível 4 futuro |

**Regra:** Não inventar correspondências. Quando não há equivalência direta, registrar a lacuna e apresentar proposta fundamentada (como acima).

---

## 5. Agentes compartilháveis (transversais)

| Agente Agency Agents | Departamentos Atendidos | Justificativa | Modelo Paperclip |
|----------------------|------------------------|---------------|------------------|
| Software Architect | Tecnologia, Gestão de Projetos, Qualidade | Arquitetura afeta todas as áreas técnicas | `reportsTo` → Diretor de Tecnologia; `permissions` para consultar issues cross-dept |
| Technical Writer | **Todas** | Documentação necessária em todos os departamentos | `reportsTo` funcional múltiplo; `permissions` amplas de leitura |
| Code Reviewer | Tecnologia, Qualidade | Revisão de código relevante para qualidade e desenvolvimento | `reportsTo` → Diretor de Qualidade; atua em issues de engenharia |
| Product Sprint Prioritizer | Gestão de Projetos, Estratégia | Priorização relevante para planejamento e estratégia | `reportsTo` → Diretor de Gestão de Projetos; colaboração com Produto |
| Design Brand Guardian | Marketing, Produto, Tecnologia | Identidade visual transversal | `reportsTo` → Diretor de Marketing (futuro); consulta cross-dept |

---

## 6. Mapeamento de divisões → diretorias

| Divisão Agency Agents | Diretoria NettosCorp (proposta) | Observação |
|----------------------|--------------------------------|------------|
| `engineering` | Diretoria de Tecnologia | 65 agentes — principal fonte |
| `project-management` | Diretoria de Gestão de Projetos | 7 agentes |
| `security` | Diretoria de Segurança da Informação | 12 agentes |
| `testing` | Diretoria de Qualidade | 9 agentes |
| `design` | Diretoria de Tecnologia / Produto (futura) | 10 agentes |
| `product` | Diretoria de Produto (futura) | 6 agentes |
| `support` | Operações / Gestão de Projetos | 6 agentes |
| `specialized` | Nível 2 (Orquestração, Chief of Staff) + especialistas | 59 agentes |
| `marketing`, `paid-media`, `sales` | Diretoria de Marketing/Vendas (futura) | 53 agentes |
| `finance` | Diretoria Financeira (futura) | 5 agentes |
| `academic`, `research`, `gis`, `healthcare`, `game-development`, `spatial-computing` | Especializados por projeto | Sob demanda |

---

## 7. Rastreabilidade de decisão por agente

Para cada agente implementado no Paperclip, registrar:

```markdown
## Registro de Implementação — [Cargo/Agente]

- **Origem Agency Agents:** division/slug (ex: engineering/engineering-software-architect)
- **Commit origem:** 4e3ac3c (ou commit específico do arquivo)
- **Cargo institucional:** [Nome do cargo]
- **Departamento:** [Diretoria]
- **Homologação:** Decisão XX/2026 — Fundador Netto Farias
- **Orçamento:** R$ X.XXX,XX / mês (budgetMonthlyCents: XXXXXX)
- **Adapter:** [tipo/config] — ex: process/claude-code, http/openclaw
- **ReportsTo:** [UUID do supervisor]
- **Implementado em:** YYYY-MM-DD
- **Implementado por:** Hermes / [responsável]
- **Validado em:** YYYY-MM-DD
- **Validador:** [nome]
- **Evidência validação:** Issue #XXX, heartbeat OK, instruções carregadas
```

---

## 8. Validação da matriz

**Executada em 15 nov 2026 por Hermes:**

- ✅ 8 cargos iniciais mapeados com origem, cargo, departamento, persona, adaptações, situação
- ✅ 18 agentes adicionais de expansão futura catalogados
- ✅ 5 lacunas sem equivalência direta registradas com propostas
- ✅ 5 agentes compartilháveis mapeados com justificativa e modelo Paperclip
- ✅ 11 divisões mapeadas para diretorias propostas
- ✅ Template de rastreabilidade de implementação definido
- ✅ **Situação atual:** 7 `identificado`, 1 `validado` (Hermes), 0 `aprovado`, 0 `implementado`, 0 `proposto` (aguarda homologação liderança)

**Próxima validação:** Após homologação do modelo de autoridade v1.2 e definição de orçamentos/adapters.

---

## 9. Recuperação

**Documento completo:** `/home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/MATRIZ_CORRESPONDENCIA.md`

**Documentos base:**
- `institutional/empresa/02-organization/proposta-equipe/PROPOSTA_EQUIPE.md`
- `institutional/empresa/02-organization/agency-agents-investigacao/AGENCY_AGENTS_INVESTIGACAO.md`
- `institutional/empresa/05-technology/integracao-arquitetura/INTEGRACAO_ARQUITETURA.md`
- `agency-agents/divisions.json`
- `agency-agents/strategy/runbooks.json`