{
  "dmPolicy": "allowlist",
  "allowFrom": [
    "<YOUR_TELEGRAM_USER_ID>"
  ],
  "groups": {},
  "mentionPatterns": [
    "^hey claude\\b",
    "^paperclip\\b",
    "^\\/inbox",
    "^\\/issue",
    "^\\/status"
  ],
  "ackReaction": "👀",
  "replyToMode": "first",
  "textChunkLimit": 4096,
  "chunkMode": "newline"
}

---
Replace `<YOUR_TELEGRAM_USER_ID>` with output from `@userinfobot`.

**Policies**:
- `allowlist` — Only `allowFrom` users get responses (silent ignore)
- `pairing` — New users pair via 6-char code (default)
- `disabled` — Blocks all messages

**Commands** (run in Claude Code session with channel):
- `/telegram:access` — View current state
- `/telegram:access pair <code>` — Complete pairing
- `/telegram:access allow <id>` / `remove <id>` — Manage allowlist
- `/telegram:access policy <allowlist|pairing|disabled>` — Set policy
- `/telegram:access group add <id> [--no-mention]` — Add group
- `/telegram:access set <key> <value>` — Config (ackReaction, replyToMode, etc.)