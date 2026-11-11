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

## Skill Hermes — nettoscorp-org

Localizado em `skills/nettoscorp-org/SKILL.md`. Mapeia a estrutura do Paperclip (companies, agents, goals, issues) para recursos nativos do Hermes. Estrutura organizacional da NettosCorp definida, aguardando homologação do fundador para implantação definitiva.

## Unificação

Repositórios originais mantidos como referência:
- `Tokenizaa/NettosCorp`
- `Tokenizaa/NettosCorp-Enterprise`
- `Tokenizaa/NettosCorp-institutional`

Este repositório é a cópia unificada para trabalho integrado.
