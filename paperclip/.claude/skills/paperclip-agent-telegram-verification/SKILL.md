---
name: paperclip-agent-telegram-verification
description: Use when user asks for Paperclip agent ID via Telegram.
category: integration
---
When a user tests a Paperclip Operations Agent via Telegram asking for agent ID and API access: the agent ID is assigned by Paperclip at hire time (not pre-configured locally). Load `paperclip-operations-agent-setup` to understand the hire payload structure, and check `agents/<agent-name>/` for existing configuration. API access is confirmed by successful skill loading and directory presence.