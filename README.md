# NettosCorp — Monorepo Unificado

Repositorio unificado da NettosCorp. Reune, em um unico `main`, tres areas de trabalho:

| Area | Local | O que e |
|------|-------|---------|
| Control Plane (Paperclip) | `paperclip/` | Plataforma de agentes de IA: server (Express), UI (React+Vite), CLI, pacotes (db, shared, adapters, runner), skills, scripts e docs. |
| Plataforma Enterprise | `enterprise/` | Frontend corporativo (React + Vite + Supabase): governanca, departamentos, dashboard. |
| Documentacao Institucional | `institutional/` | Governanca, estrategia, organizacao, portfólio, tecnologia e operacoes (numerado 00-governance a 09-reports). |
| Sistema Operacional | `nos-os/` | Codigo de automacao interna (sync Hermes <-> Supabase, relatorios, monitor, migrations SQL). |
| Projetos Clientes | `Projetos/` | Repositorios de projetos operacionais (DefesaI-Saude-app, BelezaDigital-v2, botwhats, agency-agents). |

## O que mudou nesta organizacao

- `packages/` da raiz removido (era vazio/orfaos; os pacotes reais vivem em `paperclip/packages/`).
- Scripts soltos da raiz movidos para `scripts/` (`find_issues.js`, `test-agent.ts`).
- Scripts de instalacao/atualizacao do Hermes movidos para `docs/ops/` (`install-hermes.*`, `update-hermes.*`, `SETUP_HERMES.md`).
- `pnpm-workspace.yaml` da raiz ajustado: nao aponta mais para `server`/`cli`/`ui`/`packages/*` que nao existem na raiz.
- `package.json` da raiz renomeado de `paperclip` para `nettoscorp` (reflete o escopo unificado).

## Regras de trabalho (obrigatorias)

- Trabalhar exclusivamente na branch `main`. Nao criar branches, worktrees nem Pull Requests.
- Commit direto na main, sem force push.
- Nao expor tokens, service-role keys ou credenciais nos logs.
- Nao commitar `.env` (esta no `.gitignore`).
- Dados reais de saude/beneficiarios: so com autorizacao expressa do fundador (gates juridicos/LGPD).

## Como desenvolver

A raiz eh orquestracao; cada area tem seu proprio gerenciador de dependencias:

```
# Raiz (turbo, quando houver workspaces validos)
pnpm install
pnpm run build
pnpm run test
pnpm run typecheck
pnpm run lint

# Paperclip (control plane)
cd paperclip && pnpm install && pnpm dev

# Enterprise
cd enterprise && pnpm install && pnpm dev

# DefesaI Saude (projeto cliente)
cd Projetos/DefesaI-Saude-app && pnpm install && pnpm run dev
```

## Estrutura de nivel raiz

```
NettosCorp/
├── paperclip/           # Control plane Paperclip (repo completo importado)
├── enterprise/          # Plataforma frontend corporativa
├── institutional/       # Documentacao institucional
├── nos-os/              # Sistema operacional NettosCorp (automacao)
├── Projetos/            # Projetos clientes (DefesaI-Saude-app, etc.)
├── scripts/             # Scripts soltos da raiz (find_issues.js, test-agent.ts)
├── docs/ops/            # Instalacao/atualizacao Hermes, deploy, monitoring
├── 04-portfolio/        # Portifolio operacional (tarefas)
├── 08-decisions/        # Deliberacoes de governance
├── 09-reports/          # Relatorios de agentes e tecnicos
├── .github/workflows/   # CI
├── openapi.json         # Especificacao OpenAPI (Paperclip)
├── Dockerfile           # Imagem do monorepo (base node 22 + pnpm + turbo)
├── package.json         # Orquestracao raiz (turbo)
├── tsconfig.json        # TypeScript base
├── turbo.json           # Pipeline turbo
├── pnpm-workspace.yaml  # Workspaces da raiz
├── vitest.config.ts     # Vitest base
├── .gitignore
└── README.md            # este arquivo
```

## Sub-repositorios com README proprio

Cada area mantem sua documentacao detalhada:
- `paperclip/AGENTS.md` e `paperclip/README.md` — contribuicao Paperclip.
- `enterprise/README.md` — plataforma enterprise.
- `institutional/README.md` — indice documental institucional.
- `nos-os/README.md` — sistema operacional.
- `Projetos/DefesaI-Saude-app/README.md` — projeto DefesaI Saude.
- `Projetos/BelezaDigital-v2/` e `Projetos/botwhats/` — projetos clientes.

## Cron (Hermes)

Rotinas automaticas configuradas em `cron/JOBS_ATIVOS.md` (feedback diario, feedback semanal, verificacao de agentes a cada 6h).
