#!/usr/bin/env bash
# Monitor de tarefas paradas do Paperclip/NettosCorp
# Executa verificação de issues bloqueadas e agents sem movimento
# Uso: ./monitor-tarefas-paradas.sh

set -euo pipefail

DB="postgresql://paperclip:paperclip@localhost:54329/paperclip"
API="http://127.0.0.1:3100"

echo "========================================="
echo "  MONITOR DE TAREFAS PARADAS - NettosCorp"
echo "  $(date '+%d/%m/%Y %H:%M:%S')"
echo "========================================="
echo ""

# 1. Issues bloqueadas ou paradas
echo "--- ISSUES PARADAS/BLOQUEADAS ---"
psql "$DB" -t -A -c "
  SELECT id, title, status, created_at
  FROM issues
  WHERE status IN ('blocked', 'in_progress')
  ORDER BY created_at DESC
  LIMIT 10;
" 2>/dev/null | while IFS='|' read -r id title status created; do
  echo "  [$status] $title (id: $id, criado: $created)"
done

echo ""
echo "--- AGENTS E SEUS ESTADOS ---"
psql "$DB" -t -A -c "
  SELECT a.name, a.title, a.status, ars.last_run_status, ars.last_error, ars.updated_at
  FROM agents a
  LEFT JOIN agent_runtime_state ars ON ars.agent_id = a.id
  ORDER BY a.created_at DESC;
" 2>/dev/null | while IFS='|' read -r name title agent_status last_run last_error updated; do
  echo "  Agent: $name"
  echo "    Título: $title"
  echo "    Status: $agent_status | Último run: $last_run | Última atualização: $updated"
  if [ -n "$last_error" ] && [ "$last_error" != "" ]; then
    echo "    Último erro: $last_error"
  fi
  echo ""
done

echo ""
echo "--- TAREFAS DE AGENT SEM MOVIMENTO (> 30 min) ---"
psql "$DB" -t -A -c "
  SELECT a.name, ats.task_key, ats.goal_status, ats.updated_at
  FROM agent_task_sessions ats
  JOIN agents a ON a.id = ats.agent_id
  WHERE ats.updated_at < NOW() - INTERVAL '30 minutes'
  ORDER BY ats.updated_at DESC;
" 2>/dev/null | while IFS='|' read -r name task goal_status updated; do
  echo "  Agent: $name | Task: $task | Goal: $goal_status | Última atividade: $updated"
done

echo ""
echo "========================================="
echo "  FIM DO MONITOR"
echo "========================================="
