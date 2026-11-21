# INVENTÁRIO DO AGENCY AGENTS — NETTOSCORP

Versão: 1.0
Data: 15 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/INVENTARIO_AGENCY_AGENTS.md
Status: DOCUMENTO INSTITUCIONAL OFICIAL — inventário verificado contra clone oficial

---

## 1. Identificação da fonte

| Item | Valor |
|------|-------|
| **Repositório oficial** | https://github.com/msitarzewski/agency-agents |
| **Clone local** | `/home/lg/workspace/NettosCorp/agency-agents/` |
| **Método de incorporação** | Git clone direto (não submodule, não subtree) |
| **Branch** | `main` |
| **Commit atual** | `4e3ac3c` (Merge PR #1175, 20 out 2026) |
| **Status vs upstream** | Atualizado ("Your branch is up to date with 'origin/main'") |
| **Licença** | MIT (arquivo `LICENSE` no repositório) |
| **Última auditoria** | 15 nov 2026 — Hermes |

**Observação:** O clone é um repositório Git independente com remote `origin` apontando para o upstream oficial. Não há submodules nem subtrees configurados. A sincronização futura deve ser feita via `git pull origin main` seguido de auditoria de diff.

---

## 2. Estrutura de diretórios (divisões)

O Agency Agents organiza agentes em **17 divisões** (definidas em `divisions.json`). Cada divisão é um diretório de nível superior contendo arquivos `.md` de agentes.

| Divisão | Label | Ícone (Lucide) | Cor | Qtd Agentes | Foco principal |
|---------|-------|----------------|-----|-------------|----------------|
| `academic` | Academic | GraduationCap | #8B5CF6 | 6 | Pesquisa acadêmica, antropologia, geografia, história, psicologia, estatística |
| `design` | Design | PenTool | #EC4899 | 10 | Marca, UX, UI, visual, acessibilidade, storytelling |
| `engineering` | Engineering | Code | #3B82F6 | 65 | Software, backend, frontend, mobile, DevOps, IA, dados, segurança, redes |
| `finance` | Finance | DollarSign | #22C55E | 5 | Finanças, faturamento, pagamentos |
| `game-development` | Game Development | Gamepad2 | #A855F7 | 6 | Desenvolvimento de jogos |
| `gis` | GIS | Map | #14B8A6 | 13 | Sistemas de informação geográfica, mapas |
| `healthcare` | Healthcare | Stethoscope | #0D9488 | 3 | Saúde |
| `marketing` | Marketing | Megaphone | #F97316 | 37 | Conteúdo, crescimento, redes sociais, marca |
| `paid-media` | Paid Media | Target | #EAB308 | 7 | Mídia paga |
| `product` | Product | Box | #D946EF | 6 | Gestão de produto |
| `project-management` | Project Management | ClipboardList | #0EA5E9 | 7 | Gestão de projetos, priorização |
| `research` | Research | Search | #7C3AED | 1 | Pesquisa |
| `sales` | Sales | TrendingUp | #10B981 | 9 | Vendas |
| `security` | Security | ShieldCheck | #EF4444 | 12 | Segurança da informação, aplicação |
| `spatial-computing` | Spatial Computing | Boxes | #06B6D4 | 6 | Computação espacial |
| `specialized` | Specialized | Sparkles | #6366F1 | 59 | Agentes orquestrador, multi-agente, C-level, operações |
| `support` | Support | LifeBuoy | #84CC16 | 6 | Suporte, infraestrutura, relatórios analíticos |
| `testing` | Testing | FlaskConical | #F59E0B | 9 | Testes, QA, realidade, desempenho, API |

**Total:** 264 agentes (soma das contagens por divisão).

**Diretórios NÃO-divisão (excluídos do catálogo de agentes):**
- `integrations/` — saídas de conversão por ferramenta (scripts/convert.sh)
- `strategy/` — playbooks e runbooks (não agentes instaláveis)
- `examples/` — exemplos de uso
- `scripts/` — scripts de instalação, conversão, validação

---

## 3. Modelo de definição de agente

Cada agente é um arquivo Markdown com **frontmatter YAML** + **corpo estruturado**.

### 3.1 Frontmatter (campos padrão)

```yaml
---
name: Nome de Exibição
description: Descrição curta da especialidade (uma linha)
color: nome-da-cor-ou-hex  # ex: indigo, blue, #3B82F6
emoji: 🎯                  # emoji de identificação visual
vibe: Frase de personalidade curta e memorável
---
```

### 3.2 Corpo estruturado (seções típicas)

1. **Identidade & Memória** — Role, personalidade, memória, experiência
2. **Missão Principal** — Objetivos centrais, responsabilidades
3. **Regras Críticas** — Princípios operacionais inegociáveis
4. **Processos / Fluxos de Trabalho** — Passos, templates, exemplos (ex: ADR template)
5. **Estilo de Comunicação** — Tom, formato, preferências
6. **Exemplos de Código/Entregáveis** — Snippets, documentos de referência
7. **Métricas de Sucesso** — Como medir qualidade da entrega

---

## 4. Agentes de engenharia (divisão `engineering`) — 65 agentes

A divisão `engineering` é a mais relevante para a NettosCorp. Lista completa:

| Arquivo (slug) | Name (frontmatter) | Descrição resumida |
|----------------|-------------------|-------------------|
| engineering-ai-data-remediation-engineer | AI Data Remediation Engineer | Correção e limpeza de dados para IA |
| engineering-ai-engineer | AI Engineer | ML, deploy de modelos, integração de IA |
| engineering-api-platform-engineer | API Platform Engineer | Plataformas de API, gateways, ciclo de vida |
| engineering-ats-validator-architect | ATS Validator Architect | Validação de sistemas ATS |
| engineering-autonomous-optimization-architect | Autonomous Optimization Architect | Otimização autônoma de sistemas |
| **engineering-backend-architect** | **Backend Architect** | **APIs, arquitetura de banco, escalabilidade** |
| engineering-china-network-engineer | China Network Engineer | Rede e conectividade China |
| engineering-cms-developer | CMS Developer | Sistemas de gestão de conteúdo |
| engineering-codebase-onboarding-engineer | Codebase Onboarding Engineer | Onboarding em bases de código existentes |
| engineering-code-reviewer | Code Reviewer | Revisão de código, segurança, manutenibilidade |
| engineering-database-optimizer | Database Optimizer | Design de schema, otimização de queries |
| engineering-database-reliability-engineer | Database Reliability Engineer | Confiabilidade de banco de dados |
| engineering-data-engineer | Data Engineer | Pipelines de dados, ETL, warehousing |
| engineering-data-visualization-engineer | Data Visualization Engineer | Visualização de dados, dashboards |
| engineering-desktop-app-engineer | Desktop App Engineer | Aplicações desktop (Electron, Tauri, etc.) |
| engineering-developer-tooling-engineer | Developer Tooling Engineer | Ferramentas de desenvolvedor, DX |
| **engineering-devops-automator** | **DevOps Automator** | **CI/CD, infraestrutura, cloud ops** |
| engineering-drupal-performance | Drupal Performance Specialist | Otimização Drupal |
| engineering-drupal-shopping-cart | Drupal Shopping Cart Engineer | E-commerce Drupal |
| engineering-email-intelligence-engineer | Email Intelligence Engineer | Processamento de email, NLP |
| engineering-embedded-firmware-engineer | Embedded Firmware Engineer | Firmware, sistemas embarcados |
| engineering-feishu-integration-developer | Feishu Integration Developer | Integração Feishu/Lark |
| engineering-filament-optimization-specialist | Filament Optimization Specialist | Otimização Filament (Laravel) |
| engineering-finops-engineer | FinOps Engineer | Otimização de custos cloud |
| **engineering-frontend-developer** | **Frontend Developer** | **React/Vue/Angular, implementação UI** |
| engineering-gaussdb-expert | GaussDB Expert | Banco GaussDB (Huawei) |
| engineering-git-workflow-master | Git Workflow Master | Workflows Git, branching strategies |
| engineering-i18n-engineer | i18n Engineer | Internacionalização, localização |
| engineering-identity-access-engineer | Identity & Access Engineer | IAM, autenticação, autorização |
| engineering-incident-response-commander | Incident Response Commander | Resposta a incidentes, guerra-room |
| engineering-iot-fleet-engineer | IoT Fleet Engineer | Frotas IoT, device management |
| engineering-it-service-manager | IT Service Manager | Gestão de serviços TI (ITIL) |
| engineering-knowledge-graph-engineer | Knowledge Graph Engineer | Grafos de conhecimento, RDF, SPARQL |
| engineering-llm-post-training-engineer | LLM Post-Training Engineer | Pós-treinamento de LLMs |
| engineering-minimal-change-engineer | Minimal Change Engineer | Mudanças mínimas, baixo risco |
| engineering-mobile-app-builder | Mobile App Builder | Apps móveis (iOS/Android/Flutter) |
| engineering-mobile-release-engineer | Mobile Release Engineer | Release mobile, stores |
| **engineering-multi-agent-systems-architect** | **Multi-Agent Systems Architect** | **Topologia, contexto, confiança, recuperação** |
| engineering-network-engineer | Network Engineer | Redes, protocolos, infraestrutura |
| engineering-orgscript-engineer | OrgScript Engineer | OrgScript (linguagem organizacional) |
| engineering-payments-billing-engineer | Payments & Billing Engineer | Pagamentos, faturamento, subscriptions |
| engineering-platform-engineer | Platform Engineer | Plataformas internas, developer platforms |
| engineering-privacy-engineer | Privacy Engineer | Privacidade, LGPD/GDPR, data protection |
| engineering-prompt-engineer | Prompt Engineer | Design e otimização de prompts |
| engineering-rag-pipeline-engineer | RAG Pipeline Engineer | Pipelines RAG, retrieval, embeddings |
| engineering-rapid-prototyper | Rapid Prototyper | Prototipagem rápida, validação |
| engineering-realtime-collaboration-engineer | Real-time Collaboration Engineer | Colaboração tempo real, CRDTs |
| engineering-rust-refactoring-specialist | Rust Refactoring Specialist | Refatoração Rust, segurança memória |
| engineering-search-relevance-engineer | Search Relevance Engineer | Busca, ranking, relevância |
| engineering-section-508-specialist | Section 508 Specialist | Acessibilidade (Section 508 US) |
| engineering-senior-developer | Senior Developer | Desenvolvimento sênior, boas práticas |
| engineering-servicenow-developer-mentor | ServiceNow Developer Mentor | ServiceNow, mentoria |
| **engineering-software-architect** | **Software Architect** | **Sistemas escaláveis, DDD, ADRs** |
| engineering-solidity-smart-contract-engineer | Solidity Smart Contract Engineer | Smart contracts, blockchain |
| engineering-sre | SRE | SLOs, error budgets, observabilidade, chaos |
| **engineering-technical-writer** | **Technical Writer** | **Documentação dev, API refs, tutoriais** |
| engineering-universal-document-compiler | Universal Document Compiler | Compilação de documentos universais |
| engineering-uswds-developer | USWDS Developer | US Web Design System |
| engineering-video-streaming-engineer | Video Streaming Engineer | Streaming de vídeo, codecs, CDN |
| engineering-voice-ai-integration-engineer | Voice AI Integration Engineer | Voice AI, STT/TTS, conversacional |
| engineering-webassembly-engineer | WebAssembly Engineer | WASM, performance, portabilidade |
| engineering-wechat-mini-program-developer | WeChat Mini Program Developer | Mini programs WeChat |
| engineering-wordpress-performance | WordPress Performance Specialist | Otimização WordPress |
| engineering-wordpress-shopping-cart | WordPress Shopping Cart Engineer | WooCommerce, e-commerce WP |

**Em negrito:** agentes mapeados para cargos iniciais da NettosCorp (ver `MATRIZ_CORRESPONDENCIA.md`).

---

## 5. Agentes de gestão de projetos (divisão `project-management`) — 7 agentes

| Arquivo (slug) | Name | Descrição resumida |
|----------------|------|-------------------|
| project-management-experiment-tracker | Experiment Tracker | Rastreamento de experimentos, A/B testing |
| project-management-jira-workflow-steward | Jira Workflow Steward | Workflows Jira, automações |
| project-management-meeting-notes-specialist | Meeting Notes Specialist | Atas, action items, follow-up |
| project-management-project-shepherd | Project Shepherd | Shepherding de projetos, guardrails |
| project-management-studio-operations | Studio Operations | Operações de estúdio criativo |
| project-management-studio-producer | Studio Producer | Produção de estúdio, delivery |
| **project-manager-senior** | **Senior Project Manager** | **Specs → tasks, scope realista, memória persistente** |

---

## 6. Agentes especializados (divisão `specialized`) — 59 agentes

Seleção relevante para governança e coordenação:

| Arquivo (slug) | Name | Descrição resumida |
|----------------|------|-------------------|
| **agents-orchestrator** | **Agents Orchestrator** | **Pipeline autônomo: PM → Architect → Dev↔QA → Integration** |
| **specialized-chief-of-staff** | **Specialized Chief of Staff** | **Coordenação executiva, continuidade, alinhamento** |
| automation-governance-architect | Automation Governance Architect | Governança de automação |
| business-strategist | Business Strategist | Estratégia de negócio |
| change-management-consultant | Change Management Consultant | Gestão de mudança organizacional |
| chief-financial-officer | Chief Financial Officer | CFO, finanças corporativas |
| corporate-training-designer | Corporate Training Designer | Treinamento corporativo |
| customer-service | Customer Service | Atendimento ao cliente |
| customer-success-manager | Customer Success Manager | Sucesso do cliente |
| data-consolidation-agent | Data Consolidation Agent | Consolidação de dados |
| data-privacy-officer | Data Privacy Officer | DPO, privacidade |
| esg-sustainability-officer | ESG Sustainability Officer | ESG, sustentabilidade |
| government-digital-presales-consultant | Gov Digital Presales Consultant | Pré-vendas gov digital |
| grant-writer | Grant Writer | Escrita de grants/propostas |
| healthcare-aging-parent-care-companion | Aging Parent Care Companion | Cuidado idosos (healthcare) |
| healthcare-customer-service | Healthcare Customer Service | Atendimento healthcare |
| healthcare-marketing-compliance | Healthcare Marketing Compliance | Compliance marketing saúde |
| hospitality-guest-services | Hospitality Guest Services | Hospitalidade |
| hr-onboarding | HR Onboarding | Onboarding RH |
| identity-graph-operator | Identity Graph Operator | Grafos de identidade |
| language-translator | Language Translator | Tradução multilíngue |
| legal-billing-time-tracking | Legal Billing Time Tracking | Faturamento jurídico |
| legal-client-intake | Legal Client Intake | Intake clientes jurídicos |
| legal-document-review | Legal Document Review | Revisão docs jurídicos |
| loan-officer-assistant | Loan Officer Assistant | Assistente empréstimos |
| lsp-index-engineer | LSP Index Engineer | Language Server Protocol indexing |
| ma-integration-manager | MA Integration Manager | M&A integração |
| medical-billing-coding-specialist | Medical Billing Coding Specialist | Faturamento médico |
| operations-manager | Operations Manager | Gestão de operações |
| organizational-psychologist | Organizational Psychologist | Psicologia organizacional |
| personal-growth-mentor | Personal Growth Mentor | Mentoria crescimento pessoal |
| real-estate-buyer-seller | Real Estate Buyer Seller | Imobiliária |
| recruitment-specialist | Recruitment Specialist | Recrutamento |
| report-distribution-agent | Report Distribution Agent | Distribuição de relatórios |
| resume-tailor | Resume Tailor | Customização currículos |
| sales-data-extraction-agent | Sales Data Extraction Agent | Extração dados vendas |
| sales-outreach | Sales Outreach | Outreach vendas |
| specialized-codebase-archaeologist | Codebase Archaeologist | Arqueologia de codebase |
| specialized-cultural-intelligence-strategist | Cultural Intelligence Strategist | Inteligência cultural |
| specialized-developer-advocate | Developer Advocate | Developer advocacy |
| specialized-document-generator | Document Generator | Geração de documentos |
| specialized-fedramp-rmf-compliance | FedRAMP RMF Compliance | Compliance FedRAMP |
| specialized-focus-music-architect | Focus Music Architect | Música para foco |
| specialized-french-consulting-market | French Consulting Market | Mercado consultoria FR |
| specialized-korean-business-navigator | Korean Business Navigator | Negócios Coreia |
| specialized-master-plan-architect | Master Plan Architect | Plano mestre, arquitetura |
| specialized-mcp-builder | MCP Builder | Model Context Protocol builder |
| specialized-model-qa | Model QA | QA de modelos ML |
| specialized-pricing-analyst | Pricing Analyst | Análise de pricing |
| specialized-salesforce-architect | Salesforce Architect | Arquitetura Salesforce |
| specialized-strategy-duel-agent | Strategy Duel Agent | Duelo de estratégias |
| specialized-workflow-architect | Workflow Architect | Arquitetura de workflows |
| study-abroad-advisor | Study Abroad Advisor | Intercâmbio estudos |
| supply-chain-strategist | Supply Chain Strategist | Cadeia suprimentos |
| zk-steward | ZK Steward | Zero-knowledge steward |

**Em negrito:** agentes mapeados para cargos da NettosCorp.

---

## 7. Outras divisões relevantes (resumo)

| Divisão | Agentes notáveis para NettosCorp |
|---------|----------------------------------|
| `design` | design-ux-architect, design-brand-guardian, design-ui-designer, design-ux-researcher |
| `security` | security-engineer, security-incident-responder, security-auditor |
| `testing` | testing-evidence-collector, testing-reality-checker, testing-api-tester, testing-performance-benchmarker |
| `product` | product-sprint-prioritizer, product-trend-researcher |
| `support` | support-analytics-reporter, support-infrastructure-maintainer, support-executive-summary-generator |
| `marketing` | marketing-growth-hacker, marketing-content-creator, marketing-social-media-strategist |

---

## 8. Runbooks / Rosters (cenários prontos)

Definidos em `strategy/runbooks.json` (machine-readable) e `strategy/runbooks/*.md` (prosa):

| Runbook | Modo | Duração | Core Team (sempre ativo) |
|---------|------|---------|--------------------------|
| `startup-mvp` | NEXUS-Sprint | 4-6 sem | agents-orchestrator, project-manager-senior, product-sprint-prioritizer, design-ux-architect, engineering-frontend-developer, engineering-backend-architect, engineering-devops-automator, testing-evidence-collector, testing-reality-checker |
| `enterprise-feature` | NEXUS-Sprint | 6-12 sem | Core maior + Compliance & Governance + QA |
| `marketing-campaign` | NEXUS-Sprint | 2-4 sem | Marketing core + Platform specialists + Support |
| `incident-response` | NEXUS-Micro | Min-horas | P0 Critical Response + Verification & Post-Mortem |

---

## 9. Ferramentas de descoberta e carregamento

| Comando | Função |
|---------|--------|
| `./scripts/install.sh --list teams` | Lista todas as equipes e contagem de agentes |
| `./scripts/install.sh --list agents` | Lista todos os agentes (slug + name) |
| `./scripts/install.sh --tool <ferramenta>` | Instala todos os agentes na ferramenta |
| `./scripts/install.sh --tool <ferramenta> --division <div>` | Instala por divisão |
| `./scripts/install.sh --tool <ferramenta> --agent <slug>` | Instala agente individual |
| `./scripts/install.sh --tool <ferramenta> --agents-file <arquivo>` | Instala lista de slugs |
| `divisions.json` | Fonte de verdade do conjunto de divisões |
| `strategy/runbooks.json` | Rosters machine-readable para cenários |

**Ferramentas suportadas:** Claude Code, Cursor, Codex, Gemini CLI, OpenCode, Qwen, Osaurus, Hermes, GitHub Copilot, Antigravity, Aider, Windsurf, Kimi Code, Vibe, Mistral Vibe, DeepSeek Harness.

**Limite OpenCode:** ~119 agentes (instalar subset por divisão recomendado).

---

## 10. Limitações conhecidas do catálogo

| Limitação | Impacto para NettosCorp |
|-----------|------------------------|
| Sem mecanismo nativo de delegação entre agentes | Paperclip fornece `issues` + `assigneeAgentId` + `reportsTo` |
| Sem sistema de skills compartilháveis | Paperclip tem `company_skills`, `company_skill_sources` |
| Sem orçamento ou controle de custos por agente | Paperclip tem `budgetMonthlyCents`, `cost_events` |
| Sem heartbeat ou monitoramento de liveness | Paperclip tem `lastHeartbeatAt`, `heartbeat_runs`, `lifecycleState` |
| Sem persistência de contexto entre sessões | Paperclip tem `agent_config_revisions`, `metadata` JSONB |
| Sem hierarquia organizacional | Paperclip tem `reportsTo` (árvore estrita) + convenções documentais |
| Não é control plane | Paperclip É o control plane |

---

## 11. Recuperação e validação

**Documento completo:** `/home/lg/workspace/NettosCorp/institutional/empresa/02-organization/integracao-agency-agents/INVENTARIO_AGENCY_AGENTS.md`

**Validação executada em 15 nov 2026:**
- ✅ Clone localizado e auditado (caminho, URL, branch, commit, método)
- ✅ 17 divisões confirmadas via `divisions.json` + contagem de arquivos `.md`
- ✅ 264 agentes contabilizados (soma por divisão)
- ✅ Modelo de agente documentado (frontmatter + corpo)
- ✅ Divisão `engineering` (65 agentes) listada completamente
- ✅ Divisão `project-management` (7 agentes) listada completamente
- ✅ Divisão `specialized` (59 agentes) listada com seleção relevante
- ✅ Runbooks/rosters documentados
- ✅ Ferramentas de descoberta listadas
- ✅ Limitações conhecidas mapeadas para capacidades do Paperclip

**Fonte upstream:** https://github.com/msitarzewski/agency-agents (MIT License)
**Clone local:** `/home/lg/workspace/NettosCorp/agency-agents/` (main, commit 4e3ac3c)