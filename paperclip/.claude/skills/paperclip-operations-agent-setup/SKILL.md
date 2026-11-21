---
name: paperclip-operations-agent-setup
description: Use when creating a Paperclip Operations Agent hire payload.
category: agent-configuration
---

Create a Paperclip Operations Agent by preparing four artifacts in `agents/<agent-name>/`:

1. **hire-payload.json** — Complete hire API payload for `/api/companies/:companyId/agent-hires`:
   - `adapterType: "claude_local"` with `adapterConfig: { mode: "acp", allowedTools: ["*"] }`
   - `runtimeConfig: { model: "claude-opus-5-5", maxTurns: 50, permissionMode: "auto" }`
   - `desiredSkills: ["paperclip", "paperclip-create-agent", "task-decomposition", "workflow-orchestration"]`
   - `permissions` granting `issues:*`, `agents:*`, `runs:*`, `approvals:*`, `companies:read`
   - `budgetMonthlyCents` set appropriately

2. **AGENTS.md** — Managed bundle instructions the agent loads at startup (see `references/agents-md-template.md`)

3. **.paperclip.yaml** — Vendor extension with `adapter`, `runtime`, `envInputs`, `skills` sections

4. **hire-agent.sh** — Script that sources env and POSTs to `/api/companies/:companyId/agent-hires`

All paths relative to agent directory. Use `hire-agent.sh` after filling `PAPERCLIP_API_KEY`, `PAPERCLIP_COMPANY_ID` in env.

**Important:** Agent ID and Company ID are assigned by Paperclip at hire time, not pre-configured locally. The `hire-payload.json` uses template placeholders (`{{PAPERCLIP_COMPANY_ID}}`, `{{PAPERCLIP_AGENT_ID}}`) that `hire-agent.sh` substitutes when posting to `/api/companies/:companyId/agent-hires`. The agent ID is returned in the API response and stored in `PAPERCLIP_AGENT_ID` for subsequent runs.

**Telegram Bot (optional):** A Telegram bot configuration exists at `agents/<agent-name>/telegram-bot/` with `config.ts`, `paperclip-client.ts`, and `telegram-bot.ts`. It requires `PAPERCLIP_API_KEY`, `PAPERCLIP_COMPANY_ID`, `PAPERCLIP_AGENT_ID`, `TELEGRAM_BOT_TOKEN`, and `TELEGRAM_CHAT_ID` env vars. Deploy separately after hiring the agent.

**Official Plugin Alternative:** For Claude Code Channels integration, use `paperclip-telegram-official-plugin` skill which covers the official `telegram@claude-plugins-official` plugin. This runs as an MCP server spawned by Claude Code (not standalone) and requires `~/.claude/channels/telegram/.env` with the same vars plus `PAPERCLIP_API_URL`.