# INVESTIGAÇÃO — AGENCY AGENTS — NETTOSCORP

Versao: 1.0
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/02-organization/agency-agents-investigacao/AGENCY_AGENTS_INVESTIGACAO.md
Fonte: /home/lg/workspace/NettosCorp/agency-agents/
Status: REGISTRO DE INVESTIGACAO — evidencia coletada, sem alteracao de codigo

---

## 1. O que o Agency Agents oferece

O Agency Agents e um repositorio aberto (MIT) de agentes de IA especializados, organizados como "uma agencia completa de IA ao alcance das maos". Cada agente e uma personalidade craftada com dominio profundo, voz unica, processos e entregas mensuraveis.

### 1.1 Filosofia

- **Especializado**: dominio profundo, nao templates genericos de prompt
- **Personalidade**: voz unica, estilo de comunicacao, abordagem propria
- **Entregavel**: codigo real, processos, metricas de sucesso
- **Producao**: fluxos de trabalho testados em producao

### 1.2 Modo de distribuicao

- App nativa (macOS, Linux, Windows) — agencyagents.app — instala agentes em Claude Code, Cursor, Codex, Gemini, OpenCode, Qwen, Osaurus e mais, com atualizacao automatica
- Scripts de linha de comando (`./scripts/install.sh`, `./scripts/convert.sh`)
- Copia manual de arquivos `.md` para diretorias de agentes de cada ferramenta
- Uso como referencia: leitura direta dos arquivos de agente

---

## 2. Modelo de definicao de agente

Cada agente e um arquivo Markdown com frontmatter YAML e corpo estruturado.

### 2.1 Frontmatter (exemplo)

```yaml
---
name: Software Architect
description: Expert software architect specializing in system design...
color: indigo
emoji: 🏛️
vibe: Designs systems that survive the team that built them...
---
```

### 2.2 Corpo do agente

- Identidade e memoria (role, personalidade, experiencia)
- Misao principal (objetivos, o que faz)
- Regras criticas (principios operacionais)
- Processos / fluxos de trabalho (passos, templates, ex: ADR template)
- Estilo de comunicacao
- Exemplos de codigo e entregaveis
- Metricas de sucesso

### 2.3 Campo de identidade

- `name`: nome de exibicao
- `description`: descricao curta da especialidade
- `color`: cor da marca (hex ou nome)
- `emoji`: emoji de identificacao visual
- `vibe`: frase de personalidade

---

## 3. Especialidades e competencias disponiveis

O repositorio contem 17 diretorias (divisoes) e 264 agentes no total.

| Divisao | Label | Qtd agentes | Foco principal |
|---------|-------|-------------|----------------|
| academic | Academic | 6 | Pesquisa academica, antropologia, geografia, historia, psicologia, estatistica |
| design | Design | 10 | Marca, UX, UI, visual, acessibilidade, storytelling |
| engineering | Engineering | 65 | Software, backend, frontend, mobile, DevOps, IA, dados, seguranca, redes |
| finance | Finance | 5 | Financas, faturamento, pagamentos |
| game-development | Game Development | 6 | Desenvolvimento de jogos |
| gis | GIS | 13 | Sistemas de informacao geografica, mapas |
| healthcare | Healthcare | 3 | Saude |
| marketing | Marketing | 37 | Conteudo, crescimento, redes sociais, marca |
| paid-media | Paid Media | 7 | Mídia paga |
| product | Product | 6 | Gestao de produto |
| project-management | Project Management | 7 | Gestao de projetos, prioritizacao |
| research | Research | 1 | Pesquisa |
| sales | Sales | 9 | Vendas |
| security | Security | 12 | Seguranca da informacao, aplicacao |
| spatial-computing | Spatial Computing | 6 | Computacao espacial |
| specialized | Specialized | 59 | Agentes orquestrador, orquestracao multi-agente, etc. |
| support | Support | 6 | Suporte, infraestrutura, relatorios analiticos |
| testing | Testing | 9 | Testes, QA, realidade, desempenho, API |

**Observacao**: A divisao `engineering` contem 65 agentes, incluindo Software Architect, Backend Architect, Frontend Developer, DevOps Automator, AI Engineer, SRE, Code Reviewer, Database Optimizer, Multi-Agent Systems Architect, Prompt Engineer, entre outros.

### 3.1 Exemplos de agentes de engenharia (relevantes para NettosCorp)

- Software Architect — projetar sistemas escalaveis, DDD, ADRs
- Backend Architect — design de APIs, arquitetura de banco, escalabilidade
- Frontend Developer — React/Vue/Angular, implementacao de UI
- DevOps Automator — CI/CD, infraestrutura, cloud ops
- AI Engineer — ML, deploy de modelos, integracao de IA
- SRE — SLOs, error budgets, observabilidade, chaos engineering
- Multi-Agent Systems Architect — topologia, contexto, confianca, recuperacao de falhas
- Prompt Engineer — design e otimizacao de prompts
- Code Reviewer — revisao de codigo, seguranca, manutenibilidade
- Database Optimizer — design de schema, otimizacao de queries

---

## 4. Departamentos e divisoes

O Agency Agents usa o conceito de "divisoes" (divisions), definidas em `divisions.json`. Cada divisao tem:
- Label (nome de exibicao)
- Icone (nome PascalCase do Lucide)
- Cor da marca (hex)

Nao ha hierarquia entre divisoes; sao categorias planas de especialidade.

Nao ha conceito de "departamento" interno ao Agency Agents; cada divisao e independente.

---

## 5. Identidade, instrucoes e responsabilidades

Cada arquivo de agente contem:

- **Identidade**: nome, papel, personalidade, experiencia
- **Instrucoes**: misao principal, regras criticas, fluxo de trabalho passo a passo
- **Responsabilidades**: o que o agente e responsavel por entregar, quando e acionado
- **Exemplos de entregaveis**: templates de codigo, documentos, ADRs, etc.

Exemplo (Software Architect): responsabilidade por projetar arquiteturas, criar ADRs, avaliar trade-offs, definir estrategia de evolucao do sistema.

---

## 6. Skills, ferramentas e integracao

### 6.1 Skills

O Agency Agents nao possui um sistema formal de "skills" como pacotes compartilháveis. Cada agente e autocontido em seu arquivo `.md`. Nao ha biblioteca de skills reutilizaveis entre agentes.

### 6.2 Ferramentas suportadas (via scripts)

O script `./scripts/install.sh` instala agentes nas seguintes ferramentas:
- Claude Code
- Cursor
- Codex
- Gemini CLI
- OpenCode
- Qwen
- Osaurus
- Hermes
- GitHub Copilot
- Antigravity
- Aider
- Windsurf
- Kimi Code
- Vibe
- Mistral Vibe
- DeepSeek Harness
- Mistral

O script `./scripts/convert.sh` gera arquivos de integracao para cada ferramenta.

### 6.3 Limites por ferramenta

- OpenCode: registra apenas ~119 agentes e silenciosamente descarta o restante (bug upstream). Recomendacao: instalar subset por divisao.

---

## 7. Processos de descoberta e carregamento de agentes

### 7.1 Descoberta

- `./scripts/install.sh --list teams` — lista todas as equipes e contagem de agentes
- `./scripts/install.sh --list agents` — lista todos os agentes
- `divisions.json` — fonte de verdade do conjunto de divisoes
- `strategy/runbooks.json` — rosters maquina-legivel para cenarios (startup-mvp, enterprise-feature, marketing-campaign, incident-response)

### 7.2 Carregamento

- Copia de arquivos `.md` para diretorio de agentes da ferramenta destino
- Execucao de `./scripts/install.sh --tool <ferramenta>` para instalacao automatizada
- Execucao de `./scripts/install.sh --tool <ferramenta> --division <divisao>` para instalacao por divisao
- Execucao de `./scripts/install.sh --tool <ferramenta> --agent <slug>` para agente individual
- Execucao de `./scripts/install.sh --tool <ferramenta> --agents-file <arquivo>` para lista de slugs

### 7.3 Runbooks / Rosters

O `strategy/runbooks.json` define equipes prontas para cenarios:

**startup-mvp (4-6 semanas):**
- Core Team: agents-orchestrator, project-manager-senior, product-sprint-prioritizer, design-ux-architect, engineering-frontend-developer, engineering-backend-architect, engineering-devops-automator, testing-evidence-collector, testing-reality-checker
- Growth Team (semana 3+): marketing-growth-hacker, marketing-content-creator, marketing-social-media-strategist
- Support Team (sob demanda): design-brand-guardian, support-analytics-reporter, engineering-rapid-prototyper, engineering-ai-engineer, testing-performance-benchmarker, support-infrastructure-maintainer

**enterprise-feature (6-12 semanas):** Core Team maior + Compliance & Governance + Quality Assurance

**incident-response (minutos a horas):** P0 Critical Response + Verification & Post-Mortem

---

## 8. Delegacao e colaboração entre especialistas

O Agency Agents nao possui mecanismo nativo de delegacao entre agentes. Cada agente e independente. A colaboração e implicita: o usuario humano (ou o orquestrador da ferramenta destino) decide qual agente ativar para cada tarefa.

O agente `agents-orchestrator` (divisao specialized) parece ser um orquestrador, mas sua funcao exata precisa de confirmacao na leitura do arquivo correspondente.

Nao ha mecanismo de "reports_to" entre agentes do Agency Agents.

---

## 9. Compatibilidade com diferentes agentes e harnesses

O Agency Agents e compatível com qualquer ferramenta que aceite arquivos de instrucao de agente no formato Markdown. A camada de adaptacao e feita pelos scripts `convert.sh` e `install.sh`.

Compatibilidade comprovada com: Claude Code, Cursor, Codex, Gemini CLI, OpenCode, Qwen, Osaurus, Hermes, GitHub Copilot, Antigravity, Aider, Windsurf, Kimi Code, Vibe, Mistral Vibe, DeepSeek Harness.

---

## 10. Possibilidades de criacao de agentes próprios

Qualquer pessoa pode criar um novo agente:
1. Criar diretorio em uma divisao existente (ou nova divisao)
2. Criar arquivo `.md` com frontmatter YAML e corpo estruturado
3. Atualizar `divisions.json` se criar nova divisao
4. Executar `scripts/check-divisions.sh` para validar

Nao ha esquema formal de versao ou aprovacao para novos agentes.

---

## 11. Limitacoes, dependencias e riscos

| Limite / Risco | Descricao |
|----------------|-----------|
| Sem mecanismo nativo de delegacao entre agentes | Cada agente e independente; nao ha reports_to entre eles |
| Sem sistema de skills compartilháveis | Cada agente e autocontido; nao ha biblioteca de skills reutilizaveis |
| Sem orcamento ou controle de custos por agente | Nao há rastreamento de token/custo |
| Sem heartbeat ou monitoramento de liveness | Nao ha mecanismo de saber se o agente esta "vivo" ou "preso" |
| Sem persistencia de contexto entre sessoes | Cada ativacao e independente; nao ha memoria duravel do agente |
| Sem hierarchy organizacional | Nao ha conceito de departamento, gestor, supervision |
| Limite do OpenCode (~119 agentes) | Instalar todas as divisoes pode exceder o limite do OpenCode |
| Dependencia de scripts de instalacao | A distribuicao depende de scripts shell e conversao de arquivos |
| Nao e um control plane | O Agency Agents nao gerencia tarefas, orcamentos, aprovacoes, org chart |

---

## 12. Avaliacao para uso na NettosCorp

O Agency Agents e um **catalogo de especialistas digitais** pronto para uso. Pode servir como fonte de agentes especialistas para a NettosCorp, mas **nao e um sistema de gerenciamento organizacional**. Para construir uma empresa com departamentos, diretorias, gestores, supervisores, orcamentos e heartbeats, e necessario um control plane como o Paperclip.

A integracao proposta: usar o Agency Agents como catalogo de agentes especialistas (conteudo de instrucao, identidade, habilidades) e o Paperclip como control plane (organizacao, tarefas, orcamento, heartbeats, aprovacoes).

---

## 13. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/02-organization/agency-agents-investigacao/AGENCY_AGENTS_INVESTIGACAO.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/02-organization/agency-agents-investigacao/AGENCY_AGENTS_INVESTIGACAO.md")

---

Nenhum codigo do Agency Agents foi alterado. Nenhum agente foi instalado ou implantado.