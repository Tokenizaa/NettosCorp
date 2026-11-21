---
name: paperclip-telegram-official-plugin
description: Use when adding Telegram to Paperclip via the official plugin (Claude Code Channels). Covers plugin install, MCP server config, access control, and persistent sessions (tmux/systemd). The co-located bot in `agents/<agent-name>/telegram-bot/` is a separate standalone setup — see that directory's README.
category: integration
---

Integrate a Paperclip agent with Telegram using the **official Anthropic plugin** `telegram@claude-plugins-official` via Claude Code Channels.

## Architecture

```
Telegram (BotFather) → MCP Server (Bun + Grammy) → Claude Code Channel → Claude Code Session → Paperclip API
```

## Setup Steps

> ⚠️ **Prerequisite**: Steps 1–3 must complete before any `/telegram:*` slash command works. The plugin must be installed and Claude Code restarted first.

1. **Install plugin** — The `/plugin install telegram@claude-plugins-official` command is unreliable. Instead, manually place the plugin in the marketplace's `plugins/` directory (not `external_plugins/`):
   ```bash
   cp -r ~/.claude/plugins/marketplaces/claude-plugins-official/external_plugins/telegram \
        ~/.claude/plugins/marketplaces/claude-plugins-official/plugins/telegram
   ```
   Then register it in `~/.claude/plugins/installed_plugins.json`:
   ```json
   {
     "telegram@claude-plugins-official": [{
       "scope": "user",
       "installPath": "~/.claude/plugins/marketplaces/claude-plugins-official/plugins/telegram",
       "version": "0.0.7",
       "installedAt": "2026-11-18T21:30:00.000Z",
       "lastUpdated": "2026-11-18T21:30:00.000Z"
     }]
   }
   ```
2. **Restart or reload Claude Code** so the plugin's slash commands become available
3. **Configure token** in a session: `/telegram:configure <BOT_TOKEN>`
4. **Start session with channel**: `claude --channels plugin:telegram@claude-plugins-official`
5. **Pair first user**: Send message to bot → receive 6-char code → `/telegram:access pair <code>`
6. **Set allowlist**: `/telegram:access allow <USER_ID>` then `/telegram:access policy allowlist`

## Critical Operational Notes

- **MCP Server runs as child of Claude Code**: The bot server (`server.ts`) is an MCP server using stdio transport. It **must** be spawned by Claude Code via `--channels`. Running `bun server.ts` directly fails — stdin closes immediately, triggering shutdown ("telegram channel: shutting down").

- **Don't use `--print` with channels**: `claude --channels plugin:telegram@claude-plugins-official --print "..."` times out. The MCP server needs persistent stdin/stdout; `--print` closes the pipe after one turn. Use interactive sessions or persistent `tmux`/`systemd` for production.

- **Channel command**: Defined in `.mcp.json` as `bun run --cwd ${CLAUDE_PLUGIN_ROOT} --shell=bun --silent start` (runs `bun install --no-summary 1>&2 && bun server.ts`).

## Key Files

- `access.json.template` — Allowlist config (see `references/access-json-template.md`)
- `COMMANDS.md` — Quick reference for `/telegram:access` and Paperclip slash commands

## Access Control

- **Pairing flow** (default): New users get 6-char code, must pair via `/telegram:access pair`
- **Allowlist policy**: Only users in `allowFrom` receive responses; others ignored silently
- **Mention patterns**: Bot responds to `^hey claude\b`, `^paperclip\b`, `^/inbox`, `^/issue`, `^/status`

## Persistent Sessions

- **Development**: `tmux` — use this exact command sequence (the generated script may need adjustment):
  ```bash
  # Kill any stale session first
  tmux kill-session -t paperclip-telegram 2>/dev/null; sleep 1
  
  # Start fresh session with channel — plugin MUST be in marketplace's plugins/ dir
  tmux new-session -d -s paperclip-telegram \
    "cd /path/to/paperclip && source /path/to/paperclip-telegram-env.sh && claude --channels plugin:telegram@claude-plugins-official"
  
  # Verify it's running (wait ~15s for Claude Code to fully start)
  sleep 15 && tmux capture-pane -t paperclip-telegram -p
  # Should show "Channels (experimental) messages from plugin:telegram@claude-plugins-official" WITHOUT "plugin not installed"
  ```
- **Production**: `systemd` service via generated `paperclip-telegram.service`

> **Critical**: The tmux session runs a *fresh* Claude Code instance. It only sees plugins installed in the marketplace's `plugins/` directory (step 1 above). Plugins only in `~/.claude/plugins/cache/` or `external_plugins/` will show "plugin not installed" in the tmux session.

## Required Environment

Source generated `paperclip-telegram-env.sh` before starting:
- `PAPERCLIP_API_URL`, `PAPERCLIP_API_KEY`, `PAPERCLIP_COMPANY_ID`, `PAPERCLIP_AGENT_ID`

## Verify Connection

After setup, confirm the integration works:

1. **Check plugin installed in Claude Code**: `/plugin list` → shows `telegram@claude-plugins-official`
2. **Verify tmux session shows plugin loaded**: `tmux capture-pane -t paperclip-telegram -p` → should show `Channels (experimental) messages from plugin:telegram@claude-plugins-official` **without** `plugin not installed`
3. **Test bot responsiveness**: Message the bot `hey claude` → should receive `👀` ack reaction
4. **Pair first user** (required on first use): Bot replies with 6-char code → in tmux: `tmux attach -t paperclip-telegram` → `/telegram:access pair <code>` → `Ctrl+B` `D` to detach
5. **Test Paperclip command**: Message `/status` → should return agent/run status from Paperclip API
6. **Check access state**: `/telegram:access` → shows policy, allowlist, paired users

If any step fails, re-check: plugin in marketplace `plugins/` dir (setup step 1), `installed_plugins.json` updated, tmux session restarted (persistent sessions), token config (setup step 3), channel flag (setup step 4), allowlist includes your user ID (setup step 6).