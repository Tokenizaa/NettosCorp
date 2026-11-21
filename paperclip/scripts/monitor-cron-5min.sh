#!/usr/bin/env bash
# Monitor transversal da NettosCorp - executa a cada 5 minutos via cron
# Participa ativamente da recuperacao: detecta falhas, aciona gestores via API,
# registra evidencias e verifica se a recuperacao ocorreu.
set -uo pipefail

API="http://127.0.0.1:3100"
COMPANY_ID="1ad50023-2215-4d61-b1ea-d896cfe0e535"
DB="postgresql://paperclip:paperclip@localhost:54329/paperclip"
LOG_DIR="/home/lg/.hermes/cache/scratch"
REPORT_FILE="$LOG_DIR/monitor_cron_report.txt"
STATE_FILE="$LOG_DIR/monitor_cron_state.json"
TS="$(date '+%Y-%m-%d %H:%M:%S')"
NOW_EPOCH="$(date +%s)"

PREV_STATE="{}"
if [ -f "$STATE_FILE" ]; then
    PREV_STATE="$(cat "$STATE_FILE")"
fi

RECOVERY_ACTIONS=()
HEARTBEAT_LATE_MANAGERS=()
STUCK_TASKS=()
BLOCKED_ISSUES=()

echo "=========================================" > "$REPORT_FILE"
echo "  MONITOR TRANSVERSAL NETTOSCORP - $TS" >> "$REPORT_FILE"
echo "=========================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

HEALTH="$(curl -s --max-time 5 "$API/api/health" 2>/dev/null || echo '{}')"
LIVENESS="$(curl -s --max-time 5 "$API/api/liveness" 2>/dev/null || echo '{}')"
READY="$(curl -s --max-time 5 "$API/api/ready" 2>/dev/null || echo '{}')"
echo "--- SERVIDOR PAPERCLIP ---" >> "$REPORT_FILE"
echo "  health: $HEALTH | liveness: $LIVENESS | ready: $READY" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo "--- HEARTBEATS DE GESTORES ---" >> "$REPORT_FILE"
MANAGERS_JSON="$(curl -s --max-time 10 "$API/api/companies/$COMPANY_ID/agents" 2>/dev/null)"
echo "$MANAGERS_JSON" | python3 -c "
import json,sys,time
from datetime import datetime, timezone
data=json.load(sys.stdin)
now=datetime.now(timezone.utc)
for a in data:
    hb=a.get('runtimeConfig',{}).get('heartbeat',{})
    if not hb.get('enabled'):
        continue
    lhb=a.get('lastHeartbeatAt')
    if not lhb:
        continue
    try:
        dt=datetime.fromisoformat(lhb.replace('Z','+00:00'))
        lag=(now-dt).total_seconds()
    except Exception:
        continue
    name=a['name']
    if lag>1900:
        print(f\"LATE|{name}|{a['id']}|{int(lag)}|{lhb}\")
    else:
        print(f\"OK|{name}|{a['id']}|{int(lag)}|{lhb}\")
" 2>/dev/null | while IFS='|' read -r kind name id lag lhb; do
    echo "  [$kind] $name | ultimo heartbeat: $lhb | atraso: $lag s" >> "$REPORT_FILE"
    if [ "$kind" = "LATE" ]; then
        HEARTBEAT_LATE_MANAGERS+=("$id")
        echo "  >>> GESTOR COM HEARTBEAT ATRASADO: $name ($id)" >> "$REPORT_FILE"
    fi
done
echo "" >> "$REPORT_FILE"

echo "--- TAREFAS PARADAS / BLOQUEADAS ---" >> "$REPORT_FILE"
STUCK_JSON="$(curl -s --max-time 10 "$API/api/companies/$COMPANY_ID/issues" 2>/dev/null)"
echo "$STUCK_JSON" | python3 -c "
import json,sys
from datetime import datetime, timezone
data=json.load(sys.stdin)
now=datetime.now(timezone.utc)
for i in data:
    st=i.get('status')
    if st not in ('blocked','in_progress','todo'):
        continue
    upd=i.get('updatedAt')
    if not upd:
        continue
    try:
        dt=datetime.fromisoformat(upd.replace('Z','+00:00')).astimezone(timezone.utc)
        lag_min=(now-dt).total_seconds()/60
    except Exception:
        continue
    if st=='blocked' or lag_min>30:
        print(f\"{st}|{i.get('identifier')}|{i.get('title')}|{i.get('assigneeAgentId','-')}|{upd}\")
" 2>/dev/null | while IFS='|' read -r st ident title assignee upd; do
    echo "  [$st] $ident | $title | assignee: ${assignee:0:8} | atualizado: $upd" >> "$REPORT_FILE"
    if [ "$st" = "blocked" ]; then
        BLOCKED_ISSUES+=("$ident")
    else
        STUCK_TASKS+=("$ident")
    fi
done
echo "" >> "$REPORT_FILE"

echo "--- ESTADO DE RUNTIME DOS AGENTES ---" >> "$REPORT_FILE"
psql "$DB" -t -A -c "
SELECT a.name, a.status, ars.last_run_status, ars.updated_at
FROM agents a
LEFT JOIN agent_runtime_state ars ON ars.agent_id = a.id
WHERE a.status NOT IN ('terminated')
ORDER BY a.name;
" 2>/dev/null | while IFS='|' read -r name st last_run upd; do
    echo "  [$st] $name | ultimo run: $last_run | $upd" >> "$REPORT_FILE"
done
echo "" >> "$REPORT_FILE"

if [ ${#HEARTBEAT_LATE_MANAGERS[@]} -gt 0 ]; then
    echo "--- RECUPERACAO: REINICIACAO DE HEARTBEATS ATRASADOS ---" >> "$REPORT_FILE"
    for mid in "${HEARTBEAT_LATE_MANAGERS[@]}"; do
        ALREADY="$(echo "$PREV_STATE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('last_invoke_$mid','0'))" 2>/dev/null)"
        if [ -n "$ALREADY" ] && [ "$((NOW_EPOCH - ALREADY))" -lt 600 ]; then
            echo "  $mid: ja invocado recentemente, pulando (evitar duplicacao)" >> "$REPORT_FILE"
            continue
        fi
        RESP="$(curl -s -X POST --max-time 20 "$API/api/agents/$mid/heartbeat/invoke" -H 'Content-Type: application/json' -d '{}' 2>/dev/null)"
        STATUS="$(echo "$RESP" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status','?'))" 2>/dev/null)"
        RUN_ID="$(echo "$RESP" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('id','?'))" 2>/dev/null)"
        echo "  $mid: heartbeat/invoke -> status=$STATUS run=$RUN_ID" >> "$REPORT_FILE"
        RECOVERY_ACTIONS+=("heartbeat_invoke|$mid|$STATUS|$RUN_ID")
        python3 -c "
import json
d={}
try:
    d=json.load(open('$STATE_FILE'))
except Exception:
    pass
d['last_invoke_$mid']=$NOW_EPOCH
json.dump(d, open('$STATE_FILE','w'))
" 2>/dev/null
    done
    echo "" >> "$REPORT_FILE"
fi

echo "--- ACOES DE RECUPERACAO EXECUTADAS ---" >> "$REPORT_FILE"
if [ ${#RECOVERY_ACTIONS[@]} -gt 0 ]; then
    for a in "${RECOVERY_ACTIONS[@]}"; do
        echo "  $a" >> "$REPORT_FILE"
    done
else
    echo "  Nenhuma acao de recuperacao necessaria neste ciclo." >> "$REPORT_FILE"
fi
echo "" >> "$REPORT_FILE"

echo "=========================================" >> "$REPORT_FILE"
echo "  FIM DO MONITOR - $TS" >> "$REPORT_FILE"
echo "=========================================" >> "$REPORT_FILE"

exit 0
