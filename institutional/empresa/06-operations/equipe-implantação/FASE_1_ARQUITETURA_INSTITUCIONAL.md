# FASE 1 — ARQUITETURA INSTITUCIONAL
**Data:** 16/11/2026 · **Revisor:** Hermes (Chefe de Gabinete Executivo) · **Plataforma:** Paperclip · **Fonte:** Agency Agents

---

## 1. Visao geral

NettosCorp é reorganizada como uma corporação multidisciplinar de **267 agentes de especialidade**, distribuídos em **18 divisões**, implantados no Paperclip sob a coordenação do Orquestrador Global.

O objetivo não é apenas representar o organograma em documento: cada especialista deve existir, ter funcao, instrucao, superior e ser mobilizavel sob demanda — enviando entregas verificaveis e nao persistindo em modo contínuo.

### Regras de bordagem (nao tocaveis)

- **Agency Agents (fonte):** repository `agency-agents/` é um submodule git. Nenhum arquivo original é modificado ou excluido.
- **Reserva ao fundador:** orcamento, modelos, adaptadores, politicas de aprovação e homologação formal. Hermes prepara a matriz tecnic a, mas não altera sem autorizacao.
- **Documentacao acompanha a realidade:** o relatorio reflete o estado operacional do Paperclip, nao apenas o desenho institucional.
---

## 2. Organograma (5 niveis)

| Nível | Cargo | Papel | Subordinação |
|---|---|---|---|
| **L0** | Fundador (Netto Farias) | Autoridade executiva final. Decisoes de orçamento, modelos, adaptadores, políticas de aprovação e homologação formal. | — (ausente como agente ativo; decide por ação) |
| **L1** | Hermes — Chefe de Gabinete Executivo | Continuidade institucional, coordenação executiva, consolidação de resultados para o fundador. | Relaciona-se com Fundador (L0) e Orquestrador (L2). |
| **L2** | Orquestrador Global | Coordenação operacional: distribuição e acompanhamento das tarefas, priorização, resolução de conflitos de alocação e consolidação dos resultados. | `reportsTo: null` (raiz da hierarquia operacional). |
| **L3** | Diretores de Divisão (18 vagas) | Comando institucional de cada divisão: definição de especialidade, prioridade da área e alinhamento com horizontes estratégicos. | `reportsTo` → Orquestrador Global. |
| **L4** | Especialistas (267) | Implementação de tarefas dentro de sua especialidade. Adormecidos sob demanda; acordados somente quando a competência for necessária. | `reportsTo` → Diretor da divisão (quando disponível) ou OR/backup. |

> Campo interno do Paperclip: `reportsTo` define o vinculo hierárquico real de cada agente implantado. É um campo de configuração da implantação, não apenas de diagramação.
---

## 3. Divisões e especialidades (18 / 267)

| Divisão | Especialistas | Função institucional agregada |
|---|---|---|
| `engineering` | 65 | Arquitetura e desenvolvimento de software |
| `specialized` | 59 | Suporte técnico especializado e integração |
| `marketing` | 37 | Posicionamento e comunicação institucional |
| `gis` | 13 | Sistemas cartográficos e geotecnologias |
| `security` | 12 | Segurança da informação e privacidade |
| `design` | 10 | Identidade, interfaces e experiência |
| `sales` | 9 | Vendas institucionais e comerciais |
| `testing` | 9 | Qualidade, teste e validação |
| `paid-media` | 7 | Mídia paga e aquisição |
| `project-management` | 7 | Gestão de projetos e operação |
| `academic` | 6 | Atualização contínua e inteligência acadêmica |
| `game-development` | 6 | Produção de jogos e experiências interativas |
| `product` | 6 | Gestão de produtos e roadmap |
| `spatial-computing` | 6 | Realidade expandida, GIS e computação espacial |
| `support` | 6 | Suporte ao beneficiário e operação B2C |
| `finance` | 5 | Gestão financeira e orçamentária |
| `healthcare` | 3 | Cobertura, reembolso e processos de saúde |
| `research` | 1 | Pesquisa e inovação (única especialidade) |

### Especialistas (nomes completos no inventário `agencia-agents-inventario-v2.json`)

| Divisão | Especialistas |
|---|---|
| `engineering` | AI Data Remediation Engineer, AI Engineer, API Platform Engineer, ATS Validator Architect, Autonomous Optimization Architect, Backend Architect, CMS Developer, China Network Engineer, Code Reviewer, Codebase Onboarding Engineer, Data Engineer, Data Visualization Engineer, Database Optimizer, Database Reliability Engineer, Desktop App Engineer, DevOps Automator, Developer Tooling Engineer, Drupal Performance Engineer, Drupal Shopping Cart Engineer, Email Intelligence Engineer, Embedded Firmware Engineer, Feishu Integration Developer, Filament Optimization Specialist, FinOps Engineer, Frontend Developer, GaussDB Expert Engineer, Git Workflow Master, IT Service Manager, Identity & Access Engineer, Incident Response Commander, Internationalization Engineer, IoT Fleet Engineer, Knowledge Graph Engineer, LLM Post-Training Engineer, Minimal Change Engineer, Mobile App Builder, Mobile Release Engineer, Multi-Agent Systems Architect, Network Engineer, OrgScript Engineer, PDF Engine Architect, Payments & Billing Engineer, Platform Engineer, Privacy Engineer, Prompt Engineer, RAG Pipeline Engineer, Rapid Prototyper, Realtime Collaboration Engineer, Rust Refactoring Specialist, SRE (Site Reliability Engineer), Search Relevance Engineer, Section 508 Accessibility Specialist, Senior Developer, ServiceNow Developer & Mentor, Software Architect, Solidity Smart Contract Engineer, Technical Writer, USWDS Developer, Universal Document Compiler, Video Streaming Engineer, Voice AI Integration Engineer, WeChat Mini Program Developer, WebAssembly Engineer, WordPress Performance Engineer, WordPress Shopping Cart Engineer |
| `specialized` | Accounts Payable Agent, Agentic Identity & Trust Architect, Agents Orchestrator, Aging Parent Care Companion, Automation Governance Architect, Business Strategist, Change Management Consultant, Chief Financial Officer, Chief of Staff, Civil Engineer, Codebase Archaeologist, Corporate Training Designer, Cultural Intelligence Strategist, Customer Service, Customer Success Manager, Data Consolidation Agent, Data Privacy Officer, Developer Advocate, Document Generator, ESG & Sustainability Officer, FedRAMP & RMF Compliance Engineer, Focus Music Architect, French Consulting Market Navigator, Government Digital Presales Consultant, Grant Writer, HR Onboarding, Healthcare Customer Service, Healthcare Marketing Compliance Specialist, Hospitality Guest Services, Identity Graph Operator, Korean Business Navigator, LSP/Index Engineer, Language Translator, Legal Billing & Time Tracking, Legal Client Intake, Legal Document Review, Loan Officer Assistant, M&A Integration Manager, MCP Builder, Master Plan Architect, Medical Billing & Coding Specialist, Model QA Specialist, Operations Manager, Organizational Psychologist, Personal Growth Mentor, Pricing Analyst, Real Estate Buyer & Seller, Recruitment Specialist, Report Distribution Agent, Resume Tailor, Retail Customer Returns, Sales Data Extraction Agent, Sales Outreach, Salesforce Architect, Strategy Duel Agent, Study Abroad Advisor, Supply Chain Strategist, Workflow Architect, ZK Steward |
| `marketing` | AEO Foundations Architect, AI Citation Strategist, Agentic Search Optimizer, App Store Optimizer, Baidu SEO Specialist, Bilibili Content Strategist, Book Co-Author, Carousel Growth Engine, China E-Commerce Operator, China Market Localization Strategist, Content Creator, Cross-Border E-Commerce Specialist, Developer Community Builder, Douyin Strategist, Email Marketing Strategist, Global Podcast Strategist, Growth Hacker, Instagram Curator, Kuaishou Strategist, LinkedIn Content Creator, Livestream Commerce Coach, Multi-Platform Publisher, PR & Communications Manager, Podcast Strategist, Private Domain Operator, Reddit Community Builder, SEO Specialist, Short-Video Editing Coach, Social Media Strategist, TikTok Strategist, Twitter Engager, Video Optimization Specialist, WeChat Official Account Manager, Weibo Strategist, X/Twitter Intelligence Analyst, Xiaohongshu Specialist, Zhihu Strategist |
| `gis` | 3D & Scene Developer, BIM/GIS Specialist, Cartography Designer, Drone/Reality Mapping Specialist, GIS Analyst, GIS QA Engineer, GeoAI/ML Engineer, Geoprocessing Specialist, Solution Engineer, Spatial Data Engineer, Spatial Data Scientist, Technical Consultant, Web GIS Developer |
| `security` | AI-Generated Code Security Auditor, Application Security Engineer, Blockchain Security Auditor, Cloud Security Architect, Compliance Auditor, Incident Responder, Penetration Tester, Secrets & Credential Hygiene Engineer, Security Architect, Senior SecOps Engineer, Threat Detection Engineer, Threat Intelligence Analyst |
| `design` | Brand Guardian, Image Prompt Engineer, Inclusive Visuals Specialist, Persona Walkthrough Specialist, UI Designer, UI Finish-Gate Reviewer, UX Architect, UX Researcher, Visual Storyteller, Whimsy Injector |
| `sales` | Account Strategist, Deal Strategist, Discovery Coach, Offer & Lead Gen Strategist, Outbound Strategist, Pipeline Analyst, Proposal Strategist, Sales Coach, Sales Engineer |
| `testing` | API Tester, Accessibility Auditor, Evidence Collector, Performance Benchmarker, Reality Checker, Test Automation Engineer, Test Results Analyzer, Tool Evaluator, Workflow Optimizer |
| `paid-media` | Ad Creative Strategist, PPC Campaign Strategist, Paid Media Auditor, Paid Social Strategist, Programmatic & Display Buyer, Search Query Analyst, Tracking & Measurement Specialist |
| `project-management` | Experiment Tracker, Jira Workflow Steward, Meeting Notes Specialist, Project Shepherd, Senior Project Manager, Studio Operations, Studio Producer |
| `academic` | Anthropologist, Geographer, Historian, Narratologist, Psychologist, Statistician |
| `game-development` | Economy Designer, Game Audio Engineer, Game Designer, Level Designer, Narrative Designer, Technical Artist |
| `product` | Behavioral Nudge Engine, DX Engineer, Feedback Synthesizer, Product Manager, Sprint Prioritizer, Trend Researcher |
| `spatial-computing` | Terminal Integration Specialist, XR Cockpit Interaction Specialist, XR Immersive Developer, XR Interface Architect, macOS Spatial/Metal Engineer, visionOS Spatial Engineer |
| `support` | Analytics Reporter, Executive Summary Generator, Finance Tracker, Infrastructure Maintainer, Legal Compliance Checker, Support Responder |
| `finance` | Bookkeeper & Controller, FP&A Analyst, Financial Analyst, Investment Researcher, Tax Strategist |
| `healthcare` | Clinical Evidence Agent, Healthcare Innovation Strategist, Sovereign Health Systems Agent |
| `research` | Research Synthesist |

> O inventário completo de cada especialista (persona, descrição, vibe, nome institucional) fica salvo em `agencia-agents-inventario-v2.json` e será usado na Fase 3 para a configuração do papel de cada agente.
---

## 4. Autoridade e decisões reservadas

1. **Fundador (L0)** — decisões executivas finais, orçamento, modelos, adaptadores, políticas de aprovação e homologação formal. Reserva do Fundador (autoria confirmada pela ordem executiva).
2. **Hermes (L1)** — continuidade institucional, coordenação executiva e consolidação dos resultados da operação para o fundador.
3. **Orquestrador Global (L2)** — coordenação operacional, distribuição de tarefas, priorização e conflitos de alocação. Não pode substituir a autoridade executiva do fundador nem impor diretoria institucional.
4. **Diretores de Divisão (L3)** — comando da especialidade da sua divisão; o Diretor de Tecnologia e o Diretor de Gestão de Projetos permanecem **lacunas institucionais até decisão** (não criar acesso).
5. **Especialistas (L4)** — execução dentro de sua especialidade, subordinados ao diretor da divisão, com autonomia de execução dentro das regras institucionais.

### Decisões reservadas à decisão do fundador (encerradas)

- **Diretor de Tecnologia** — não definido ainda (lacuna institucional).
- **Diretor de Gestão de Projetos** — não definido ainda (lacuna institucional).
- **Matriz de modelos/adaptadores** — Hermes prepara a recomendação; não é alterada sem autorização.
- **Homologação formal do modelo de autoridade** — DELIB-014 homologou o Modelo de Autoridade v1.2 (07/11/2026); outras homologações formais aguardadas.
---

## 5. Mecanismos de coordenação e subordinação

- **Distribuição de tarefas:** o Orquestrador Global recebe a requisição, prioriza e distribui o ciclo mais adequado; pode delegar a subdividos ou diretamente a especialistas de sintonia, sem substituir a decisão do líder de divisão.
- **Conflito de alocação:** registrado no registo de tarefas; o Orquestrador define qual especialista atende primeiro, respeitando a prioridade de empreendimento interno vs. externo.
- **Mobilização sob demanda:** só os agentes necessários a um empreendimento são acordados; a maioria permanece adormecida (`paused`/`ready`), reduzindo custo e rendimento não requerido.
- **Backlog institucional:** cada divisão mantém o seu registo de tarefas; o Orquestrador aplica a ordem e reúne o resultado final.
- **Consolidação:** Hermes reúne os resultados dos agentes para o fundador, com relatórios de entregas e evidências (issues, runs e entregas na estrutura Paperclip).
---

## 6. Estado da Fase 1 e validação

| Verificação | Estado | Evidência |
|---|---|---|
| Inventário real 267 agentes | OK | agencia-agents-inventario-v2.json (267 entradas) |
| 18 divisões mapeadas | OK | divisões e especialistas listados acima |
| 5 níveis do organograma | OK | L0 Fundador; L1 Hermes; L2 Orquestrador; L3 Diretores; L4 Especialistas |
| Lacunas de diretores | OK | Diretor de Tecnologia e Diretor de Gestão de Projetos documentados como lacunas |
| Limpeza da Fase 2 | OK | 8/8 agents experimentais terminados; 0 restantes |
| Empresa preservada | OK | 75 issues; 1 library; status active |

Fase 2 concluída: backup e exclusão segura dos 8 agentes experimentais.
Próxima fase: Fase 3 (preparação das 267 configurações) e Fase 4 (implantação em lotes).
