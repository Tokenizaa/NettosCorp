# Referência — Endpoints API Paperclip (base http://127.0.0.1:3100/api)

Todas as requisições exigem `Authorization: Bearer <token>`. Endpoints company-scoped exigem `:companyId` no caminho.

## Empresas
- GET    /api/companies
- GET    /api/companies/:companyId
- PATCH  /api/companies/:companyId   {name, description, budgetMonthlyCents, logoAssetId}
- POST   /api/companies/:companyId/logo   (multipart)
- POST   /api/companies/:companyId/archive

## Agentes
- GET    /api/companies/:companyId/agents
- GET    /api/agents/:agentId
- POST   /api/companies/:companyId/agents   {name, role, title, reportsTo, capabilities, adapterType, adapterConfig, budgetMonthlyCents}
- PATCH  /api/agents/:agentId
- POST   /api/agents/:agentId/pause
- POST   /api/agents/:agentId/resume
- POST   /api/agents/:agentId/clear-error
- POST   /api/agents/:agentId/terminate
- POST   /api/agents/:agentId/keys
- POST   /api/agents/:agentId/heartbeat/invoke
- GET    /api/agents/:agentId/config-revisions
- POST   /api/agents/:agentId/config-revisions/:revisionId/rollback

## Objetivos (Goals)
- GET    /api/companies/:companyId/goals
- POST   /api/companies/:companyId/goals   {title, description, level, status}
- GET    /api/goals/:goalId
- PATCH  /api/goals/:goalId   {status: planned|active|achieved|cancelled}

## Projetos (Projects)
- GET    /api/companies/:companyId/projects
- POST   /api/companies/:companyId/projects   {name, description, goalIds, status, workspace:{name,cwd,repoUrl,repoRef,isPrimary}}
- GET    /api/projects/:projectId
- PATCH  /api/projects/:projectId
- POST   /api/projects/:projectId/workspaces   {name,cwd,repoUrl,repoRef,isPrimary}
- GET/PATCH/DELETE /api/projects/:projectId/workspaces/:workspaceId

## Issues (tarefas)
- GET    /api/companies/:companyId/issues   [?status=&assigneeAgentId=&projectId=&view=index|rows|compact]
- GET    /api/issues/:issueId
- POST   /api/companies/:companyId/issues   {title, description, status, priority, assigneeAgentId, parentId, projectId, goalId}
- PATCH  /api/issues/:issueId
- POST   /api/issues/:issueId/comment   {body}
- GET    /api/companies/:companyId/issues/summaries?ids=...
- GET    /api/companies/:companyId/assigned-work-invariant   (board only)

## Skills (company)
- GET    /api/companies/:companyId/skills
- (instalação/anexação via CLI: skills install/import/agent sync)

## Rotinas (Routines)
- GET    /api/companies/:companyId/routines
- GET    /api/routines/:routineId
- POST   /api/companies/:companyId/routines   {title, description, assigneeAgentId, projectId, goalId, priority, status, concurrencyPolicy, catchUpPolicy}

## Conexões de IA
- GET    /api/companies/:companyId/ai-connections

## Secrets (agente, run JWT)
- GET    /api/agents/me/secrets
- POST   /api/agents/me/secrets/:key/value

## Aprovações
- (via API de approvals; consultar doc/api/approvals.md)

## Atividade
- GET    /api/companies/:companyId/activity

## Organograma
- GET    /api/companies/:companyId/org

## Dashboard / Health
- GET    /api/health
- GET    /api/dashboard   (via CLI: dashboard get)

## Códigos de erro
- 400 malformed / 401 unauth / 403 forbidden / 404 not found / 409 conflict / 422 semantic / 500 server
