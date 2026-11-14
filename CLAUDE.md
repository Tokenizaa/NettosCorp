# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📋 Visão Geral do Repositório

Este é o monorepo unificado da **NettosCorp** contendo três domínios principais:

| Subpasta | Descrição |
|----------|-----------|
| `paperclip/` | Control plane para empresas autônomas de IA (agentes, metas, tarefas, orçamentos, adapters, heartbeat) |
| `enterprise/` | Plataforma corporativa frontend — React + Vite + Supabase, governança, departamentos, dashboard |
| `institutional/` | Documentação institucional — governança, estratégia, organização, portfólio, tecnologia, operações |

### Estrutura Principal (paperclip/)

```
paperclip/
├── server/              # Express REST API e serviços de orquestração
├── ui/                  # React + Vite board UI
├── cli/                 # paperclipai CLI package (bin publicado, comandos agent-facing)
├── packages/
│   ├── db/              # Drizzle schema, migrations, DB clients
│   ├── shared/          # Tipos, constantes, validadores, API path constants
│   ├── adapters/        # Implementações de agent adapter (Claude, Codex, Cursor, etc.)
│   ├── adapter-utils/   # Utilitários compartilhados de adapter
│   ├── plugins/         # Sistema de plugins
│   ├── skills-catalog/  # Catálogo de skills do app (@paperclipai/skills-catalog)
│   ├── teams-catalog/   # Catálogo de teams do app (@paperclipai/teams-catalog)
│   ├── paperclip-runner/# Runner de agentes
│   └── paperclip-eval-kernel/
├── skills/              # Skills runtime/operacionais do Paperclip
├── doc/                 # Documentação operacional e de produto
├── tests/               # Testes E2E, runner-e2e, storybook, etc.
├── docker/              # Configurações Docker
└── scripts/             # Scripts de build, release, dev, etc.
```

## 🛠️ Comandos Principais

### Root (Monorepo)
```bash
# Instalação
pnpm install

# Build
pnpm run build              # Turbo: build all packages

# Testes
pnpm test                   # Vitest (default)
pnpm test:e2e               # Playwright E2E
pnpm test:release-smoke     # Release smoke tests

# Typecheck
pnpm run typecheck          # TypeScript check all packages

# Lint
pnpm run lint               # ESLint
```

### Paperclip (paperclip/)
```bash
# Dev (usa PGlite embedded - deixar DATABASE_URL unset)
cd paperclip && pnpm dev

# API: http://localhost:3100
# UI: http://localhost:3100 (servida pelo API server em dev middleware mode)

# Quick checks
curl http://localhost:3100/api/health
curl http://localhost:3100/api/companies

# Reset local dev DB
rm -rf data/pglite && pnpm dev

# Database
pnpm db:generate            # Gerar migration (edita packages/db/src/schema/*.ts primeiro)
pnpm db:migrate             # Aplicar migrations

# Verificação completa antes de PR
pnpm -r typecheck
pnpm test:run
pnpm build
```

### Enterprise (enterprise/)
```bash
cd enterprise
pnpm dev                    # Vite dev server porta 3000
pnpm build                  # Vite build
pnpm lint                   # tsc --noEmit
```

## 📌 Convenções e Regras de Engenharia

### 1. Company-Scoped Changes
Toda entidade de domínio deve ser escopada a uma company. Company boundaries devem ser enforcadas em routes/services.

### 2. Contracts Synchronized
Mudanças de schema/API behavior → atualize todas as camadas:
- `packages/db` schema e exports
- `packages/shared` types/constants/validators
- `server` routes/services
- `ui` API clients e pages

### 3. Control-Plane Invariants
- Single-assignee task model
- Atomic issue checkout semantics
- Approval gates para governed actions
- Budget hard-stop auto-pause behavior
- Activity logging para mutating actions

### 4. Three Data Paths (Não Confundir)
| Path | Descrição | Localização | Review Level |
|------|-----------|-------------|--------------|
| **Telemetry** | Paperclip first-party event system (opt-out, envia para endpoint Paperclip) | `packages/shared/src/telemetry/` | Strict (privacy review) |
| **Observability** | OpenTelemetry trace path (operator define OTLP endpoint) | `server/src/instrumentation.ts`, `doc/observability.md` | Lighter |
| **Run Log** | Local `heartbeat_run_events` table (stays in instance DB) | `doc/run-log-events.md`, `packages/db/src/schema/heartbeat_run_events.ts` | No extra review |

### 5. Database Change Workflow
1. Edite `packages/db/src/schema/*.ts`
2. Garanta export em `packages/db/src/schema/index.ts`
3. `pnpm db:generate` (compila packages/db primeiro)
4. `pnpm -r typecheck` para validar compile

### 6. API e Auth
- Base path: `/api`
- Board access = full-control operator context
- Agent access = bearer API keys (`agent_api_keys`), hashed at rest
- Agent keys NÃO acessam outras companies
- Novos endpoints: company access checks, actor permissions, activity log entries, HTTP errors consistentes

### 7. UI Expectations
- Routes e nav alinhados com API surface
- Company selection context para company-scoped pages
- Surface failures claramente (não ignore API errors silenciosamente)
- Form/wizard footers: Save & exit (ou Cancel/Back) left, primary action right, mesma row vertical

## ⚠️ Gotchas Importantes

- **Node version**: `.nvmrc` (use `nvm use`) — paperclip requer Node >=24.11.0
- **Nunca commite `.env`** (em `.gitignore`)
- **Integration tests**: `DATABASE_URL` no `.env.example`
- **Feature flags** mergeadas em `main` antes de deploy
- **Package manager**: pnpm@9.15.4 (paperclip) / pnpm@9.0.0 (root)
- **Patched dependencies** em `pnpm-workspace.yaml` — não remova sem verificar

## 🎯 Definition of Done (Paperclip)

Uma mudança está done quando **todas** são verdadeiras:
1. Behavior matches `doc/SPEC-implementation.md`
2. Typecheck, tests, e build passam
3. Contracts sincronizados (db/shared/server/ui)
4. Docs atualizadas quando behavior ou commands mudam
5. PR description segue [PR template](.github/PULL_REQUEST_TEMPLATE.md) com todas sections preenchidas (incluindo Model Used)

## 📚 Documentação Chave (Paperclip)

Leia na ordem antes de mudanças:
1. `doc/GOAL.md`
2. `doc/PRODUCT.md`
3. `doc/SPEC-implementation.md` (V1 build contract)
4. `doc/DEVELOPING.md`
5. `doc/DATABASE.md`

`doc/SPEC.md` = long-horizon product context

### Skills Hermes Disponíveis
| Skill | Local | Descrição |
|-------|-------|-----------|
| nettoscorp-org | `skills/nettoscorp-org/SKILL.md` | Estrutura organizacional NettosCorp |
| nettoscorp-agents | `skills/nettoscorp-agents/SKILL.md` | 4 agentes básicos no Hermes |

### Agentes Básicos (nettoscorp-agents)
Quatro agentes com `reportsTo: Hermes`, rodando em `adapterType: process`/`hermes-native`:
- Monitor Enterprise (net-ag-001, monitoring)
- Documentação Institucional (net-ag-002, documentation)
- Operacional (net-ag-003, operations)
- Atendimento (net-ag-004, support)

## 🔧 Design System (UI)

`DESIGN.md` na raiz do paperclip = source of truth para UI design decisions.
**Token-only rule**: todo color, spacing, radius, type, shadow, motion em `ui/src/components/**` e `ui/src/pages/**` vem do token layer em `ui/src/index.css` — **sem hex, raw px, arbitrary Tailwind bracket values, ou raw `font-size`/`fontSize`** fora do allowlist documentado.

```bash
pnpm check:tokens           # Verifica token gates
pnpm check:token-gates      # Falha em violations não cobertas pelo allowlist
```

## 🚀 Instalação Reproduzível do Hermes

Veja `SETUP_HERMES.md` para baixar este repositório e instalar o Hermes com voz Piper, skills e agentes já configurados.

Scripts incluídos:
- `install-hermes.ps1` / `install-hermes.sh` — instalação completa (primeira vez)
- `update-hermes.ps1` / `update-hermes.sh` — atualização após cada `git pull`