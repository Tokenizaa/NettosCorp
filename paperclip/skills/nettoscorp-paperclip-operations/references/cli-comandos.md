# Referência — Comandos CLI paperclipai (v0.3.1)

Contexto já configurado: `pnpm paperclipai context show` → apiBase `http://127.0.0.1:3100`, companyId `1ad50023-2215-4d61-b1ea-d896cfe0e535`.

## Setup / Diagnóstico

```sh
pnpm paperclipai --version
pnpm paperclipai context set --api-base http://127.0.0.1:3100 --company-id <id>
pnpm paperclipai context show
pnpm paperclipai context list
pnpm paperclipai doctor [--repair]
pnpm paperclipai env
pnpm paperclipai configure --section server|secrets|storage
pnpm paperclipai db:backup
```

## Empresa

```sh
pnpm paperclipai company list
pnpm paperclipai company get <company-id>
pnpm paperclipai company current [--company-id <id>]
```

## Agentes

```sh
pnpm paperclipai agent list --company-id <company-id>
pnpm paperclipai agent get <agent-id> [--company-id <company-id>]
```

## Issues (tarefas)

```sh
pnpm paperclipai issue list [--status todo,in_progress] [--assignee-agent-id <id>] [--company-id <company-id>]
pnpm paperclipai issue get <issue-id-or-identifier>
pnpm paperclipai issue create --title "..." [--description "..."] [--status todo] [--priority high] [--company-id <company-id>]
pnpm paperclipai issue update <issue-id> [--status in_progress] [--comment "..."]
pnpm paperclipai issue comment <issue-id> --body "..."
pnpm paperclipai issue checkout <issue-id> --agent-id <agent-id>
pnpm paperclipai issue release <issue-id>
```

## Projetos / Objetivos

```sh
pnpm paperclipai project list --company-id <company-id>
pnpm paperclipai project get <project-id>
pnpm paperclipai goal list --company-id <company-id>
pnpm paperclipai goal get <goal-id>
```

## Skills

```sh
pnpm paperclipai skills list --company-id <company-id>
pnpm paperclipai skills show <skill-ref> --company-id <company-id>
pnpm paperclipai skills browse [--kind bundled|optional] [--category <cat>]
pnpm paperclipai skills search "<query>" [--json]
pnpm paperclipai skills inspect <catalog-ref>
pnpm paperclipai skills install <catalog-ref> --company-id <company-id>
pnpm paperclipai skills import ./skills/<skill> --company-id <company-id>
pnpm paperclipai skills agent sync <agent-id> --skill <skill-ref> --mode add --company-id <company-id>
pnpm paperclipai skills audit <skill-ref> [--company-id <id>]
```

## Aprovações

```sh
pnpm paperclipai approval list [--status pending]
pnpm paperclipai approval get <approval-id>
pnpm paperclipai approval create --type hire_agent --payload '{"name":"..."}' [--issue-ids <id1,id2>]
pnpm paperclipai approval approve <approval-id> [--decision-note "..."]
pnpm paperclipai approval reject <approval-id> [--decision-note "..."]
```

## Atividade / Dashboard / Heartbeat

```sh
pnpm paperclipai activity list [--agent-id <id>] [--entity-type issue] [--entity-id <id>]
pnpm paperclipai dashboard get
pnpm paperclipai heartbeat run --agent-id <agent-id> [--api-base http://127.0.0.1:3100]
```

## Org

```sh
# via API (não há subcomando org dedicado no CLI nesta versão)
curl -s "http://127.0.0.1:3100/api/companies/<company-id>/org"
```

## Segurança de invocação

Use `npx paperclipai` para argumentos com conteúdo não confiável (texto, comentários, Markdown). Dentro do monorepo, para argumentos com conteúdo, use:
`node cli/node_modules/tsx/dist/cli.mjs cli/src/index.ts <comando> <args>`

Não use `pnpm paperclipai <comando> <argumento-com-conteúdo>` (o pnpm passa o valor por um shell).
