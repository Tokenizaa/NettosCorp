#!/usr/bin/env bash
# Setup Paperclip Operations Agent for local CLI development
# This installs the Paperclip skills for Claude/Codex and prints required env vars

set -euo pipefail

AGENT_ID="${1:-paperclip-operations}"
COMPANY_ID="${2:-}"
API_URL="${PAPERCLIP_API_URL:-http://localhost:3100}"

if [[ -z "$COMPANY_ID" ]]; then
  echo "Usage: $0 <agent-id-or-shortname> <company-id>"
  echo "  AGENT_ID: Agent shortname (default: paperclip-operations)"
  echo "  COMPANY_ID: Paperclip company UUID (required)"
  echo "  PAPERCLIP_API_URL: Paperclip API URL (default: http://localhost:3100)"
  exit 1
fi

echo "Setting up local CLI for agent: $AGENT_ID"
echo "Company: $COMPANY_ID"
echo "API: $API_URL"
echo ""

# Run paperclipai agent local-cli to install skills and get env vars
npx paperclipai agent local-cli "$AGENT_ID" --company-id "$COMPANY_ID"

echo ""
echo "========================================="
echo "Environment variables to export:"
echo "========================================="
echo "# Add these to your shell or .env file:"
echo "export PAPERCLIP_API_URL=\"$API_URL\""
echo "export PAPERCLIP_COMPANY_ID=\"$COMPANY_ID\""
echo "export PAPERCLIP_AGENT_ID=\"<agent-id-from-output-above>\""
echo "export PAPERCLIP_API_KEY=\"<api-key-from-output-above>\""
echo "export PAPERCLIP_RUN_ID=\"<run-id-from-output-above>\""
echo ""
echo "Then you can run the agent locally with:"
echo "  claude --dangerously-skip-permissions"
echo ""
echo "Or use the Paperclip CLI to wake it:"
echo "  npx paperclipai agent wake <agent-id> --company-id $COMPANY_ID"