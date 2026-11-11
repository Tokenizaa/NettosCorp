# NettosCorp — Repositório Unificado

Este repositório unifica os três repositórios da NettosCorp em um único monorepo:

| Subpasta | Repositório original | Descrição |
|----------|---------------------|-----------|
| `.` (raiz) | `Tokenizaa/NettosCorp` | Paperclip — Control plane para empresas autônomas de IA (agentes, metas, tarefas, orçamentos, adapters, heartbeat) |
| `enterprise/` | `Tokenizaa/NettosCorp-Enterprise` | Plataforma corporativa frontend — React + Vite + Supabase, governança, departamentos, dashboard |
| `institutional/` | `Tokenizaa/NettosCorp-institutional` | Documentação institucional — governança, estratégia, organização, portfólio, tecnologia, operações |

## Estrutura

```
NettosCorp/
├── packages/          # Paperclip adapters (TypeScript)
├── server/            # Paperclip server (TypeScript)
├── cli/               # Paperclip CLI
├── skills/            # Hermes skills (inclui nettoscorp-org)
├── openapi.json       # Paperclip OpenAPI spec
├── enterprise/        # Frontend plataforma corporativa (React/Vite/Supabase)
│   ├── src/
│   ├── docs/
│   ├── supabase/
│   └── package.json
└── institutional/     # Documentação institucional (Python/Markdown)
    ├── empresa/
    │   ├── 00-governance/
    │   ├── 01-strategy/
    │   ├── 02-organization/
    │   ├── 03-management-system/
    │   ├── 04-portfolio/
    │   └── ...
```

## Skills Hermes

| Skill | Local | Descrição |
|-------|-------|-----------|
| nettoscorp-org | `skills/nettoscorp-org/SKILL.md` | Estrutura organizacional da NettosCorp (companies, agents, goals, issues) mapeada para Hermes |
| nettoscorp-agents | `skills/nettoscorp-agents/SKILL.md` | 4 agentes básicos rodando nativamente no Hermes (Monitor Enterprise, Documentação Institucional, Operacional, Atendimento) |

## Agentes Básicos (nettoscorp-agents)

Quatro agentes configurados com `reportsTo: Hermes`, rodando em `adapterType: process`/`hermes-native`:

| Agente | ID | Role | reportsTo |
|--------|----|------|-----------|
| Monitor Enterprise | net-ag-001 | monitoring | Hermes |
| Documentação Institucional | net-ag-002 | documentation | Hermes |
| Operacional | net-ag-003 | operations | Hermes |
| Atendimento | net-ag-004 | support | Hermes |

Estrutura organizacional definida, aguardando homologação do fundador para implantação definitiva.

## Unificação

Repositórios originais mantidos como referência:
- `Tokenizaa/NettosCorp`
- `Tokenizaa/NettosCorp-Enterprise`
- `Tokenizaa/NettosCorp-institutional`

Este repositório é a cópia unificada para trabalho integrado.
