#!/usr/bin/env bash
# Hire Paperclip Operations Agent via Paperclip API
# Usage: ./hire-agent.sh <company-id> [api-key]

set -euo pipefail

COMPANY_ID="${1:-}"
API_KEY="${2:-${PAPERCLIP_API_KEY:-}}"
API_URL="${PAPERCLIP_API_URL:-http://localhost:3100}"

if [[ -z "$COMPANY_ID" ]]; then
  echo "Usage: $0 <company-id> [api-key]"
  echo "  COMPANY_ID: Paperclip company UUID"
  echo "  API_KEY:    Paperclip API key (or set PAPERCLIP_API_KEY env)"
  echo "  API_URL:    Paperclip API URL (default: http://localhost:3100, or set PAPERCLIP_API_URL)"
  exit 1
fi

if [[ -z "$API_KEY" ]]; then
  echo "Error: API key required. Set PAPERCLIP_API_KEY or pass as second argument."
  exit 1
fi

PAYLOAD_FILE="$(dirname "$0")/hire-payload.json"

if [[ ! -f "$PAYLOAD_FILE" ]]; then
  echo "Error: hire-payload.json not found at $PAYLOAD_FILE"
  exit 1
fi

echo "Hiring Paperclip Operations Agent..."
echo "Company: $COMPANY_ID"
echo "API: $API_URL"
echo ""

# Read payload and substitute environment variables
PAYLOAD=$(cat "$PAYLOAD_FILE" | \
  sed "s|{{PAPERCLIP_API_URL}}|$API_URL|g" | \
  sed "s|{{PAPERCLIP_API_KEY}}|$API_KEY|g" | \
  sed "s|{{PAPERCLIP_COMPANY_ID}}|$COMPANY_ID|g" | \
  sed "s|{{PAPERCLIP_AGENT_ID}}|{{PAPERCLIP_AGENT_ID}}|g" | \
  sed "s|{{PAPERCLIP_RUN_ID}}|{{PAPERCLIP_RUN_ID}}|g")

# Create the hire request
RESPONSE=$(curl -sS -X POST "${API_URL}/api/companies/${COMPANY_ID}/agent-hires" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -H "X-Paperclip-Run-Id: $(uuidgen)" \
  -d "$PAYLOAD")

echo "$RESPONSE" | jq .

# Check for approval
APPROVAL_ID=$(echo "$RESPONSE" | jq -r '.approval?.id // empty')
if [[ -n "$APPROVAL_ID" ]]; then
  echo ""
  echo "Hire request created with approval: $APPROVAL_ID"
  echo "Waiting for board approval..."
  echo "Check approval status: curl -H \"Authorization: Bearer \$PAPERCLIP_API_KEY\" ${API_URL}/api/approvals/${APPROVAL_ID}"
fi

AGENT_ID=$(echo "$RESPONSE" | jq -r '.agent?.id // empty')
if [[ -n "$AGENT_ID" ]]; then
  echo ""
  echo "Agent created: $AGENT_ID"
  echo "Agent URL: ${API_URL}/api/agents/${AGENT_ID}"
fi