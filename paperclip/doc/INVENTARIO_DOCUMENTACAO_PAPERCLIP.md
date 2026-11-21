# INVENTÁRIO DA DOCUMENTAÇÃO PAPERCLIP — NETTOSCORP

**Etapa:** Inventário da documentação oficial do Paperclip (fonte B — documentação oficial)  
**Data:** 18/11/2026  
**Versão da plataforma:** 0.3.1 (commit 7685b7a4fc)  
**Instância:** http://127.0.0.1:3100 (local_tusted, private)

---

## 1. Documentação local do repositório (`doc/`) — operações e produto

| Arquivo | Assunto | Relevância NettosCorp |
|---------|---------|-----------------------|
| doc/DEVELOPING.md | Setup, comandos, testes, worktrees, CLI client operations | Alta — setup do dia a dia |
| doc/DATABASE.md | Schema, migrations, DB clients | Alta — banco e persistência |
| doc/CLI.md | Referência completa do CLI (setup, lifecycle, control-plane, auth, segurança de invocação) | Alta — CLI principal |
| doc/AGENT-ARTIFACTS.md | Entregáveis de agentes | Média |
| doc/AGENT-IDENTITY.md | Identidade de agentes | Alta — identidade e hierarquia |
| doc/AGENT-LIFECYLE.md | Ciclo de vida do agente | Alta |
| doc/agent-configuration-yaml.md | Configuração YAML de agente (apiVersion: paperclip/v1, kind: Agent) | Alta |
| doc/agent-instruction-revisions.md | Revisões de instruções | Média |
| doc/agent-interaction-permissions.md | Permissões de interação | Alta — segurança |
| doc/agent-permission-defaults.md | Defaults de permissão | Alta |
| doc/agent-personas.md | Personas de agente | Média |
| doc/agent-observability.md | Observabilidade de agentes | Média |
| doc/heartbeat-internals.md | Serviço de heartbeat e background workers | Alta — heartbeats/rotinas |
| doc/RUNNER-INTEGRATION-PLAYBOOK.md | Paperclip Runner | Média |
| doc/runner-internals.md | Internos do Runner | Média |
| doc/skills-and-teams-catalog.md | Catálogo de skills e equipes | Alta — skills compartilhadas |
| doc/worktrees.md | Worktree commands e seeding | Média |
| doc/ci-workflows.md | CI routing, trusted PR, lockfiles | Baixa (infra) |
| doc/test-infrastructure.md | Testes, benchmarks, smoke | Baixa (QA) |
| doc/database-backups.md | Backups de banco | Alta — backup |
| doc/hot-restart-deploys.md | Restarts e deploys | Média |
| doc/instance-configuration.md | Configuração de instância | Alta |
| doc/integration-api-notes.md | Contratos de API de integração | Média |
| doc/ISSUE-PRIVACY.md | Tarefas e projetos privados | Média |
| doc/connection-intents.md | Intents de conexão | Média |
| doc/connection-review-counts.md | Contagem de review de conexão | Baixa |
| doc/ACP-RUN-LIFECYCLE.md | Ciclo de vida ACP | Média |
| doc/agent-commentary.md | Comentário de agente | Baixa |
| doc/agent-files.md | Arquivos de agente | Baixa |

## 2. Documentação de referência pública (`docs/`)

### 2.1 CLI (`docs/cli/`)
| Arquivo | Assunto | Relevância |
|---------|---------|------------|
| docs/cli/overview.md | Instalação, contexto, categorias de comando | Alta |
| docs/cli/setup-commands.md | onboard, run, doctor, configure, env, allowed-hostname | Alta |
| docs/cli/control-plane-commands.md | issue, company, agent, skills, approval, activity, dashboard, heartbeat | Alta |

### 2.2 API (`docs/api/`)
| Arquivo | Assunto | Relevância |
|---------|---------|------------|
| docs/api/overview.md | Auth, base URL, códigos de erro, paginação, rate limit | Alta |
| docs/api/companies.md | CRUD de empresas, logo, archive, observabilidade | Alta |
| docs/api/agents.md | Lifecycle, create/update/pause/resume/terminate, keys, heartbeat, org chart, adapter models, config revisions | Alta |
| docs/api/goals-and-projects.md | Goals hierarchy, projects, workspaces | Alta |
| docs/api/issues.md | Issue CRUD, checkout/release, comments, documents, attachments, summaries | Alta |
| docs/api/routines.md | Rotinas recorrentes, triggers, run history | Alta |
| docs/api/secrets.md | Secrets CRUD, fetch value, delivery modes | Alta — segurança |
| docs/api/approvals.md | Aprovações (hire_agent etc.) | Alta — governança |
| docs/api/activity.md | Activity log | Alta — auditoria |
| docs/api/authentication.md | Autenticação | Alta |
| docs/api/dashboard.md | Dashboard | Média |
| docs/api/costs.md | Custos e financeiro | Média |
| docs/api/attention.md | Attention / inbox | Média |
| docs/api/secrets-remote-import.md | Import remoto de secrets | Média |
| docs/api/tailscale.md | Tailscale connections | Baixa (infra) |
| docs/api/tool-gateway-tokens.md | Tokens de tool gateway | Baixa |

### 2.3 Guias para desenvolvedores de agente (`docs/guides/agent-developer/`)
| Arquivo | Assunto | Relevância |
|---------|---------|------------|
| docs/guides/agent-developer/writing-a-skill.md | Formato SKILL.md, frontmatter, best practices | Alta — criação de skills |
| docs/guides/agent-developer/skills-store.md | Camadas catalog vs company library, trust levels | Alta — skills compartilhadas |

### 2.4 Start / Conceitos (`docs/start/`)
| Arquivo | Assunto | Relevância |
|---------|---------|------------|
| docs/start/quickstart.md | Onboard, run, primeiros passos | Alta |
| docs/start/core-concepts.md | Conceitos fundamentais | Alta |
| docs/start/architecture.md | Arquitetura | Alta |
| docs/start/what-is-paperclip.md | O que é o Paperclip | Média |

### 2.5 Adapters (`docs/adapters/`)
| Arquivo | Assunto | Relevância |
|---------|---------|------------|
| (ver diretório) | Adapters, criação de adapter, harnesses, runtimes | Alta — adapters e runtimes |

### 2.6 Empresas (`docs/companies/`)
| Arquivo | Assunto | Relevância |
|---------|---------|------------|
| docs/companies/companies-spec.md | Especificação de empresas | Alta |

### 2.7 Deploy (`docs/deploy/`)
| Arquivo | Assunto | Relevância |
|---------|---------|------------|
| (ver diretório) | Deployment modes, secrets provider vaults | Média — infra |

### 2.8 Outros
| Arquivo | Assunto | Relevância |
|---------|---------|------------|
| docs/docs.json | Índice da documentação | Média |
| docs/built-in-agents.md | Built-in agents | Média — experimental |
| docs/performance.md | Performance | Baixa |
| docs/plans/ | Planos datados | Baixa |

---

## 3. Recursos técnicos da plataforma (inventário de funcionalidades)

| Categoria | Recurso | Disponível | Como configurar | Limitação |
|-----------|---------|------------|-----------------|-----------|
| Empresa | CRUD, logo, archive, orçamento | Sim | API companies / UI Company Settings | Multi-company por instância |
| Agentes | Create, update, pause, resume, terminate, keys, config revisions | Sim | API agents / UI | RBAC granular fora do escopo V1 |
| Hierarquia | reportsTo, org chart | Sim | API / org endpoint | Não há tabela de departamentos |
| Objetivos | Hierarquia company → team → agent | Sim | API goals | — |
| Projetos | Workspaces, repo, cwd | Sim | API projects | Storage fixo na criação |
| Issues/Tarefas | CRUD, checkout/release, comments, documents, attachments | Sim | API issues / UI | Single-assignee |
| Skills | Catálogo, company library, install, import, agent sync, audit | Sim | CLI skills / UI Skills Store | Bundled skills são read-only |
| Rotinas | Agendamento, triggers, concurrency, catch-up | Sim | API routines / UI | — |
| Heartbeats | Invoke manual, cancel run, monitorNextCheckAt | Sim | API / CLI heartbeat | — |
| Conexões IA | API key, local/gateway routing, providers | Sim | UI Company Settings → Connections | Vault per-company no UI, não no CLI |
| Secrets | Env/api/both delivery, secret refs | Sim | API agents/me/secrets | Server-owned credentials excluídos |
| Aprovações | hire_agent e outros tipos, approve/reject/resubmit | Sim | API approvals / UI | — |
| Atividade/Auditoria | Activity log por empresa | Sim | API activity / UI | — |
| Backup | Automático (26h) + sob demanda | Sim | db:backup / UI | Chave master + banco juntos |
| Observabilidade | Trace export status (OTLP) | Sim | API observability | Credentials não expostos |
| Deployment modes | local_trusted / authenticated | Sim | Configure | Cloud marketplace fora do escopo V1 |

---

## 4. Recursos experimentais (tela Experimental da instância)

Recursos observados na interface Experimental: Assistant Connections (MCP), Chat Connectors, Durable App Actions, Environments, Isolated Workspaces, Memory Connectors, Paperclip Runner, Status Cards, Summaries, Smoke Lab, Developer Mode, Built-in Agents, Cases, External Objects, GitHub review bots, Task Plan Decomposition.

**Recomendação geral:** recursos experimentais podem quebrar ou ser removidos sem aviso. Adotar apenas os de baixo risco e benefício comprovado para a NettosCorp. Avaliar individualmente antes de habilitar.

---

## 5. Dependências da plataforma

| Dependência | Versão | Observação |
|-------------|--------|------------|
| Node.js | >=24.11.0 | Instalado: v24.18.0 ✓ |
| pnpm | 9+ | Instalado: 9.15.4 ✓ |
| Banco | PostgreSQL embedded (PgLite) | Sem Docker necessário em dev |
| CLI | paperclipai 0.3.1 | Via `pnpm paperclipai` (tsx), sem dist standalone funcional |
| Storage | local_disk (dev) | `~/.paperclip/instances/default/data/storage` |
| Secrets key | local_encrypted | `~/.paperclip/instances/default/secrets/master.key` |

---

## 6. Como cada documentação deve ser usada pela NettosCorp

- **Setup e operação diária:** `doc/DEVELOPING.md`, `doc/CLI.md`, `docs/cli/*`
- **Criação de skills compartilhadas:** `docs/guides/agent-developer/writing-a-skill.md`, `docs/guides/agent-developer/skills-store.md`, `doc/skills-and-teams-catalog.md`
- **Configuração de agentes:** `docs/api/agents.md`, `doc/agent-configuration-yaml.md`
- **Empresas e governança:** `docs/api/companies.md`, `doc/AGENT-IDENTITY.md`
- **Tarefas/projetos/objetivos:** `docs/api/issues.md`, `docs/api/goals-and-projects.md`
- **Rotinas/heartbeats:** `docs/api/routines.md`, `doc/heartbeat-internals.md`
- **Segurança/secrets:** `docs/api/secrets.md`, `doc/agent-interaction-permissions.md`
- **Backup:** `doc/database-backups.md`

---

## 7. Conclusão do inventário

A documentação oficial cobre completamente: empresas, agentes, identidade, hierarquia, skills, adapters, conexões IA, projetos, objetivos, issues, rotinas, heartbeats, secrets, aprovações, atividade, backup e deployment. A skill `nettoscorp-paperclip-operations` criada referencia as seções relevantes para cada operação.

**Não confunda documentação lida com funcionalidade validada.** Cada recurso deve ser testado na instância local antes de ser considerado operacional.
