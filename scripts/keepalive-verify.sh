#!/usr/bin/env bash
set -Eeuo pipefail

HEALTH_URL="${PAPERCLIP_HEALTH_URL:-https://nettoscorp.onrender.com/api/liveness}"
MAX_TIME="${PAPERCLIP_HEALTH_TIMEOUT_SECONDS:-15}"

if [[ ! "$MAX_TIME" =~ ^[0-9]+$ ]] || (( MAX_TIME < 1 )); then
  echo "FALHA: PAPERCLIP_HEALTH_TIMEOUT_SECONDS deve ser um inteiro positivo." >&2
  exit 2
fi

http_code="$(curl --silent --show-error --output /dev/null \
  --write-out '%{http_code}' \
  --max-time "$MAX_TIME" \
  "$HEALTH_URL" || true)"

if [[ "$http_code" == "200" ]]; then
  echo "OK: Paperclip respondeu HTTP 200 em $HEALTH_URL"
  exit 0
fi

if [[ -z "$http_code" || "$http_code" == "000" ]]; then
  echo "FALHA: Paperclip não respondeu dentro de ${MAX_TIME}s (HTTP 000)." >&2
else
  echo "FALHA: Paperclip respondeu HTTP $http_code em $HEALTH_URL." >&2
fi
exit 1
