---
name: nettoscorp-paperclip-operations
description: >
  Skill institucional de operação e administração do Paperclip para a NettosCorp.
  Ensina agentes autorizados a consultar e administrar a plataforma Paperclip
  (instância http://127.0.0.1:3100, empresa NettoCorp) seguindo a documentação
  oficial e a governança institucional. Use quando precisar inspecionar a empresa,
  agentes, tarefas, projetos, skills, conexões, rotinas, heartbeats, permissões,
  auditoria e backups. Não altere identidades, hierarquia nem dados de produção
  sem decisão homologada do fundador.
category: paperclip-operations
recommendedForRoles: [orquestrador, project-manager, software-architect, backend-architect, frontend-developer, devops, qa, technical-writer, ceo]
trustLevel: markdown_only
compatibility: compatible
version: 1.0.0
---

# Skill Institucional — Operação e Administração do Paperclip (NettosCorp)

Esta skill é o manual de operação do control plane Paperclip para a organização NettoCorp. Ela ensina qualquer agente autorizado a compreender, consultar, configurar e validar a plataforma, respeitando a governança institucional da NettosCorp e os limites de autoridade de cada papel.

## 1. Como usar esta skill

1. Leia a seção 2 para entender a arquitetura e as três fontes de verdade.
2. Consulte a seção 3 para verificar o estado real da instância (CLI + API).
3. Use as seções 4 a 12 para executar operações específicas (agentes, tarefas, skills, conexões, rotinas, etc.).
4. Siga a seção 13 para segurança, permissões e limites de autoridade.
5. Use a seção 14 para diagnóstico e recuperação.
6. Registre evidências de cada alteração (seção 15).

**Princípio:** não invente comandos. Confirme cada comando na documentação oficial (`docs/`, `doc/`) ou no `--help` do CLI instalado (`pnpm paperclipai --help`).

---

## 2. Fontes de verdade e precedência

Quando houver divergência entre fontes, respeite esta ordem:

| Fonte | O que define | Exemplo |
|-------|--------------|---------|
| **A. Governança institucional NettosCorp** | Regras institucionais, autoridade, organograma, decisões homologadas | `institutional/`, `empresa/` |
| **B. Documentação oficial Paperclip** | Funcionamento técnico, recursos, CLI, API | `docs/`, `doc/`, `https://docs.paperclip.ing/` |
| **C. Estado real da instância** | O que está efetivamente configurado | CLI, API, banco (consulta apenas) |

Não descarte dados nem altere identidades para fazer as fontes parecerem iguais. Registre divergências, sua origem e a resolução adotada.

## 3. Identificar a instância e seu estado real

### 3.1 CLI — contexto já configurado

O CLI `paperclipai` (v0.3.1) está instalado no monorepo e conectado à instância existente.

```sh
# Verificar versão
pnpm paperclipai --version

# Contexto atual (deve apontar para http://127.0.0.1:3100 e empresa NET)
pnpm paperclipai context show

# Listar empresas (board/instance admin)
pnpm paperclipai company list

# Detalhes da empresa NettoCorp
pnpm paperclipai company get 1ad50023-2215-4d61-b1ea-d896cfe0e535
```

### 3.2 API — endpoints base

Base URL: `http://127.0.0.1:3100/api`

Todas as requisições usam `Authorization: Bearer <token>` (board operator via cookie de sessão da UI, ou token de agente).

```sh
# Health da instância
curl http://127.0.0.1:3100/api/health

# Empresas acessíveis
curl http://127.0.0.1:3100/api/companies

# Detalhe da empresa NettoCorp
curl http://127.0.0.1:3100/api/companies/1ad50023-2215-4d61-b1ea-d896cfe0e535
```

### 3.3 Estado real — inventário rápido

```sh
# Agentes da empresa
pnpm paperclipai agent list --company-id 1ad50023-2215-4d61-b1ea-d896cfe0e535

# Skills instaladas
pnpm paperclipai skills list --company-id 1ad50023-2215-4d61-b1ea-d896cfe0e535

# Projetos
curl -s "http://127.0.0.1:3100/api/companies/1ad50023-2215-4d61-b1ea-d896cfe0e535/projects"

# Objetivos
curl -s "http://127.0.0.1:3100/api/companies/1ad50023-2215-4d61-b1ea-d896cfe0e535/goals"

# Issues (tarefas)
curl -s "http://127.0.0.1:3100/api/companies/1ad50023-2215-4d61-b1ea-d896cfe0e535/issues"

# Rotinas
curl -s "http://127.0.0.1:3100/api/companies/1ad50023-2215-4d61-b1ea-d896cfe0e535/routines"

# Conexões de IA
curl -s "http://127.0.0.1:3100/api/companies/1ad50023-2215-4d61-b1ea-d896cfe0e535/ai-connections"

# Atividade (audit log)
curl -s "http://127.0.0.1:3100/api/companies/1ad50023-2215-4d61-b1ea-d896cfe0e535/activity"

# Organograma
curl -s "http://127.0.0.1:3100/api/companies/1ad50023-2215-4d61-b1ea-d896cfe0e535/org"
```

**Não execute `onboard`** (criaria uma segunda instância). **Não execute `run`** (iniciaria um segundo servidor). **Não altere a porta 3100.** Conecte o CLI à instância existente.

---

## 4. Consultar a API e o CLI

### 4.1 Comandos CLI úteis (control plane)

| Operação | Comando |
|----------|---------|
| Versão | `pnpm paperclipai --version` |
| Contexto (set/show/list/use) | `pnpm paperclipai context set --api-base <url> --company-id <id>` |
| Empresas | `pnpm paperclipai company list\|get <id>\|current` |
| Agentes | `pnpm paperclipai agent list --company-id <id>\|agent get <id>` |
| Issues | `pnpm paperclipai issue list\|get <id>\|create\|update <id>` |
| Projetos | `pnpm paperclipai project list --company-id <id>\|get <id>` |
| Objetivos | `pnpm paperclipai goal list --company-id <id>\|get <id>` |
| Skills | `pnpm paperclipai skills list\|show\|import\|create --company-id <id>` |
| Aprovações | `pnpm paperclipai approval list\|get <id>\|create...` |
| Atividade | `pnpm paperclipai activity list [--agent-id <id>]` |
| Dashboard | `pnpm paperclipai dashboard get` |
| Heartbeat | `pnpm paperclipai heartbeat run --agent-id <id>` |
| Diagnóstico | `pnpm paperclipai doctor [--repair]` |
| Backup | `pnpm paperclipai db:backup` |

**Regra de segurança (CLI):** use `npx paperclipai` para argumentos que contenham conteúdo não confiável (texto de issues, comentários, Markdown). Não use `pnpm paperclipai` com tais argumentos (o pnpm passa o valor por um shell). Dentro do monorepo, use `node cli/node_modules/tsx/dist/cli.mjs cli/src/index.ts <comando> <args>` para executar o fonte local com segurança.

### 4.2 Autenticação API

- Board operator: cookie de sessão da web UI (localhost:3100).
- Agente: bearer token (API key de longa duração ou run JWT `PAPERCLIP_API_KEY` injetado durante heartbeat).
- Nunca armazene tokens em arquivos versionados nem imprima tokens em relatórios. Use variáveis de ambiente (`PAPERCLIP_API_KEY`).

---

## 5. Inspecionar empresas e agentes

### 5.1 Empresa NettoCorp

ID: `1ad50023-2215-4d61-b1ea-d896cfe0e535` | Prefixo: `NET` | Status: `active` | Orçamento: 0

### 5.2 Agentes (19 cadastrados)

Dois agentes estão `idle`/`ready` (FCC Agent e CEO); 17 estão `paused` com hold `setup` (adapter pendente). Todos têm `reportsTo: null` (hierarquia plana) e `permissions: {canCreateAgents: true, canCreateSkills: true}`.

```sh
# Detalhe de um agente específico
pnpm paperclipai agent get <agent-id> --company-id 1ad50023-2215-4d61-b1ea-d896cfe0e535
# ou via API:
curl -s "http://127.0.0.1:3100/api/agents/<agent-id>"
```

### 5.3 Organograma

```sh
curl -s "http://127.0.0.1:3100/api/companies/1ad50023-2215-4d61-b1ea-d896cfe0e535/org"
```

**Limite de autoridade:** não altere `reportsTo`, nome, adapter, modelo nem permissões de agentes sem decisão homologada do fundador (governança institucional `institutional/`).

---

## 6. Criar e configurar agentes

### 6.1 Criar agente (via API)

```
POST /api/companies/{companyId}/agents
{
  "name": "Nome do Agente",
  "role": "general|engineer|pm|qa|devops|designer|researcher",
  "title": "Título da função",
  "reportsTo": "{managerAgentId ou null}",
  "capabilities": "descrição das capacidades",
  "adapterType": "claude_local|opencode_local|process|http",
  "adapterConfig": { ... },
  "budgetMonthlyCents": 0
}
```

### 6.2 Atualizar agente

```
PATCH /api/agents/{agentId}
```

### 6.3 Pausar / Resumir / Limpar erro / Terminar

```
POST /api/agents/{agentId}/pause
POST /api/agents/{agentId}/resume
POST /api/agents/{agentId}/clear-error
POST /api/agents/{agentId}/terminate   # irreversível
```

### 6.4 Criar API key do agente

```
POST /api/agents/{agentId}/keys
```

O valor completo é mostrado apenas uma vez. Armazene com segurança.

**Limite:** contratação de novos agentes pode exigir aprovação do board (`requireBoardApprovalForNewAgents`). Confirme antes de criar.

---

## 7. Administrar projetos, objetivos e tarefas

### 7.1 Objetivos (Goals)

```
GET    /api/companies/{companyId}/goals
POST   /api/companies/{companyId}/goals   {title, description, level, status}
GET    /api/goals/{goalId}
PATCH  /api/goals/{goalId}                {status: planned|active|achieved|cancelled}
```

### 7.2 Projetos (Projects)

```
GET    /api/companies/{companyId}/projects
POST   /api/companies/{companyId}/projects   {name, description, goalIds, status, workspace}
GET    /api/projects/{projectId}
PATCH  /api/projects/{projectId}
POST   /api/projects/{projectId}/workspaces   {name, cwd, repoUrl, repoRef, isPrimary}
```

### 7.3 Issues / Tarefas

```
GET    /api/companies/{companyId}/issues[?status=todo,in_progress][&assigneeAgentId=<id>]
GET    /api/issues/{issueId}
POST   /api/companies/{companyId}/issues   {title, description, status, priority, assigneeAgentId, parentId, projectId, goalId}
PATCH  /api/issues/{issueId}               {status, priority, ...}
POST   /api/issues/{issueId}/checkout --agent-id <id>   # via CLI: issue checkout
POST   /api/issues/{issueId}/release
POST   /api/issues/{issueId}/comment --body "..."
```

Status: `todo`, `in_progress`, `blocked`, `done`, `cancelled`.
Prioridade: `critical`, `high`, `medium`, `low`.

**Invariante de single-assignee:** uma tarefa tem um único responsável. Não atribua a dois agentes simultaneamente.

**Limite:** não crie projetos, objetivos ou tarefas que violem o portfólio ou a autoridade da NettosCorp sem decisão homologada.

---

## 8. Configurar identidade e hierarquia

### 8.1 Identidade da empresa

```
PATCH /api/companies/{companyId}   {name, description, budgetMonthlyCents, logoAssetId}
POST  /api/companies/{companyId}/logo   (multipart imagem)
POST  /api/companies/{companyId}/archive
```

### 8.2 Hierarquia (reportsTo)

A cadeia de comando é definida por `reportsTo` (UUID do agente gestor). Use `GET /api/companies/{companyId}/org` para visualizar a árvore.

**Regra da NettosCorp:** alterações de hierarquia, identidade institucional ou autoridade exigem decisão homologada do fundador. Não altere unilateralmente.

---

## 9. Gerenciar conexões e provedores de IA

### 9.1 Listar conexões

```
GET /api/companies/{companyId}/ai-connections
```

Conexões atuais na NettoCorp:
- Company Local endpoint (openai, api_key, local, http://localhost:8082/v1)
- Company integrate.api.nvidia.com (openai, api_key, gateway, https://integrate.api.nvidia.com/v1)
- Company Local endpoint (anthropic, api_key, local, http://127.0.0.1:8082)

Nenhuma marcada como default.

### 9.2 Criar / atualizar conexão

Use a UI (`Company Settings → Connections`) ou a API de ai-connections. O CLI `paperclipai connections` suporta interações a partir de um heartbeat run.

### 9.3 Secrets

```
GET  /api/agents/me/secrets                              # listar refs (run JWT)
POST /api/agents/me/secrets/{key}/value                  # buscar valor (run JWT)
```

Nunca imprima valores de secrets. Use secret refs, não valores inline, em produção (strict mode).

---

## 10. Administrar adapters e runtimes

Adapter types disponíveis: `process`, `claude_local`, `opencode_local`, `codex_local`, `cursor_local`, `gemini_local`, `grok_local`, `kimi_local`, `pi_local`, `http`, OpenClaw gateway, plugin.

Cada agente tem `adapterType` + `adapterConfig` (modelo, cwd, instruções, etc.) e `runtimeConfig` (heartbeat, aiConnection).

Exemplo de configuração claude_local:
```json
{
  "adapterType": "claude_local",
  "adapterConfig": {
    "model": "claude-3-5-sonnet-20241022",
    "graceSec": 15,
    "timeoutSec": 0,
    "maxTurnsPerRun": 1000,
    "dangerouslySkipPermissions": true,
    "instructionsFilePath": ".../AGENTS.md",
    "instructionsEntryFile": "AGENTS.md"
  },
  "runtimeConfig": {
    "heartbeat": {"enabled": false, "intervalSec": 300, "maxConcurrentRuns": 20},
    "aiConnection": {"mode": "shared", "method": "api_key", "provider": "anthropic", "connectionId": "..."}
  }
}
```

**Limite:** `dangerouslySkipPermissions: true` deve ser revisado para produção. Mudanças de adapter/modelo de agentes existentes exigem decisão homologada.

---

## 11. Administrar skills

### 11.1 Listar skills da empresa

```sh
pnpm paperclipai skills list --company-id 1ad50023-2215-4d61-b1ea-d896cfe0e535
```

### 11.2 Navegar catálogo

```sh
pnpm paperclipai skills browse [--kind bundled|optional] [--category software-development]
pnpm paperclipai skills search "<query>" [--json]
pnpm paperclipai skills inspect <catalogRef>
```

### 11.3 Instalar skill do catálogo

```sh
pnpm paperclipai skills install <catalogRef> --company-id <company-id>
```

### 11.4 Importar skill externa (local/GitHub/URL)

```sh
pnpm paperclipai skills import ./skills/nettoscorp-paperclip-operations --company-id <company-id>
```

### 11.5 Anexar skill a um agente

```sh
pnpm paperclipai skills agent sync <agent-id> --skill <skillRef> --mode add --company-id <company-id>
```

### 11.6 Auditar skill

```sh
pnpm paperclipai skills audit <skillRef> [--company-id <id>]
```

**Esta skill (`nettoscorp-paperclip-operations`) está localizada em `skills/nettoscorp-paperclip-operations/` e pode ser importada para a empresa via `skills import`.**

---

## 12. Gerenciar rotinas e heartbeats

### 12.1 Rotinas (tarefas recorrentes)

```
GET    /api/companies/{companyId}/routines
GET    /api/routines/{routineId}
POST   /api/companies/{companyId}/routines   {title, description, assigneeAgentId, projectId, goalId, priority, status, concurrencyPolicy, catchUpPolicy}
```

Agentes só podem criar rotinas atribuídas a si mesmos. Board operators podem atribuir a qualquer agente.

### 12.2 Heartbeat

```sh
# Invocar heartbeat manual de um agente
pnpm paperclipai heartbeat run --agent-id <agent-id> --api-base http://127.0.0.1:3100
# ou via API:
POST /api/agents/{agentId}/heartbeat/invoke

# Cancelar um run
POST /api/heartbeat-runs/{runId}/cancel   # board only
```

Heartbeats dos agentes da NettoCorp estão `enabled: false` (17 paused) ou desabilitados (2 idle). Ative apenas após decidir o modelo de operação.

---

## 13. Segurança, permissões e limites de autoridade

### 13.1 Regras de segurança

- Nunca commite `.env`, tokens, chaves de API, master.key ou dados do banco.
- Tokens via variável de ambiente (`PAPERCLIP_API_KEY`), nunca em arquivos versionados.
- Não imprima tokens nem secret values em relatórios, comentários ou documentos.
- Em strict mode, use secret refs, não valores inline.
- Faça backup antes de alterações relevantes (`pnpm paperclipai db:backup`).

### 13.2 Permissões por papel (NettosCorp)

Os cadastros CIA-001 a CIA-008 definem limites por papel. Respeite:

- **Orquestrador Global:** coordena a equipe, pode criar/atualizar agentes dentro de sua alçada.
- **Especialistas (PM, Arquitetos, DevOps, QA, Technical Writer):** executam suas áreas; não criam/modificam agentes nem definem orçamentos/adapters sem autorização.
- **Board (local-board):** instance admin, aprovações, empresa.

Todos os 19 agentes atuais têm `canCreateAgents: true` e `canCreateSkills: true` — isso excede os limites dos cadastros CIA e deve ser revisado com o fundador.

### 13.3 O que NÃO fazer (sem decisão homologada)

- Recriar a organização ou criar segunda instância.
- Apagar agentes existentes.
- Alterar identidades, hierarquia (`reportsTo`) ou autoridade.
- Substituir conexões existentes sem necessidade comprovada.
- Modificar banco de forma destrutiva.
- Executar `onboard` de segunda instância.
- Alterar porta 3100.
- Declarar sucesso sem testes.

---

## 14. Diagnóstico e recuperação

### 14.1 Doctor

```sh
pnpm paperclipai doctor          # diagnóstico
pnpm paperclipai doctor --repair # diagnóstico com auto-reparo
```

### 14.2 Env e configuração

```sh
pnpm paperclipai env             # ambiente resolvido
pnpm paperclipai configure --section server|secrets|storage
```

### 14.3 Backup

```sh
pnpm paperclipai db:backup       # backup sob demanda
```

Backup automático: `/home/lg/.paperclip/instances/default/data/backups/` (retencão 26h). Verifique que o backup não está stale (>26h).

### 14.4 Logs

- Instância: `~/.paperclip/instances/default/logs/`
- Atividade API: `GET /api/companies/{companyId}/activity`
- Runtime services: `~/.paperclip/instances/default/runtime-service-logs/`

### 14.5 Recuperação de agente em erro

```sh
POST /api/agents/{agentId}/clear-error   # move error -> idle
```

---

## 15. Evidências e validação de operações

Para cada alteração, registre:

1. Estado anterior (consulta API/CLI).
2. Ação aplicada (comando ou endpoint).
3. Estado posterior (consulta API/CLI).
4. Confirmação na interface (http://127.0.0.1:3100).
5. Verificação de persistência (consulta após reload).
6. Teste de comportamento real.
7. Evidência (output do comando, screenshot, link do issue).

Mantenha evidências em `report/` ou `doc/` do repositório NettosCorp, sem tokens nem dados privados.

---

## 16. Referências oficiais

- CLI Overview: `docs/cli/overview.md`
- Setup Commands: `docs/cli/setup-commands.md`
- Control-Plane Commands: `docs/cli/control-plane-commands.md`
- API Overview: `docs/api/overview.md`
- API Companies: `docs/api/companies.md`
- API Agents: `docs/api/agents.md`
- API Goals and Projects: `docs/api/goals-and-projects.md`
- API Issues: `docs/api/issues.md`
- API Routines: `docs/api/routines.md`
- API Secrets: `docs/api/secrets.md`
- Writing a Skill: `docs/guides/agent-developer/writing-a-skill.md`
- Skills Store: `docs/guides/agent-developer/skills-store.md`
- Skills and Teams Catalog: `doc/skills-and-teams-catalog.md`
- Developing: `doc/DEVELOPING.md`
- Paperclip Docs (online): `https://docs.paperclip.ing/`

## 17. Governança institucional NettosCorp (referências)

- Identidade e estratégia: `institutional/01-strategy/IDENTIDADE_ESTRATEGIA_EMPRESARIAL.md`
- Tecnologia Paperclip: `institutional/05-technology/paperclip/PAPERCLIP_TECNOLOGIA.md`
- Baseline de agentes: `institutional/09-reports/BASELINE_ESTADO_REAL_AGENTES_PAPERCLIP.md`
- Cadastros CIA-001 a CIA-008: `empresa/06-operations/equipe-implantação/cadastros/`
- Perfis: `empresa/06-operations/equipe-implantação/perfis/`
- Configurações YAML: `empresa/06-operations/equipe-implantação/configuracoes/`

---

**Fim da skill.** Esta skill é patrimônio técnico da NettosCorp. Mantenha-a versionada e atualizada conforme a plataforma e a governança evoluírem.
