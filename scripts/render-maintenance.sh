#!/usr/bin/env bash
# =============================================================================
# NETTOSCORP — Manutenção Render: Paperclip + Hermes
#
# Executa verificacoes de saude e manutencao que funcionam tanto localmente
# quanto no container do Render (plano gratuito).
#
#   1. Health do Paperclip (GET /api/liveness, GET /api/health)
#   2. Processo do Hermes (hermes doctor / processo em execucao)
#   3. Backup do Paperclip (existe e e recente)
#   4. Espaco em disco (alerta se abaixo do limiar)
#
# Sem credenciais escritas aqui. Tudo vem de variaveis de ambiente.
# =============================================================================
set -uo pipefail

# -----------------------------------------------------------------------------
# Configuracao (variaveis de ambiente com defaults locais)
# -----------------------------------------------------------------------------
PAPERCLIP_BASE_URL="${PAPERCLIP_BASE_URL:-http://127.0.0.1:3100}"
PAPERCLIP_HEALTH_TIMEOUT="${PAPERCLIP_HEALTH_TIMEOUT_SECONDS:-15}"
HERMES_HOME="${HERMES_HOME:-$HOME/.hermes}"
BACKUP_DIR="${PAPERCLIP_BACKUP_DIR:-$HOME/.paperclip/instances/default/data/backups}"
DISK_WARN_PCT="${DISK_WARN_PCT:-85}"   # avisa acima de 85% usado
DISK_CRIT_PCT="${DISK_CRIT_PCT:-95}"   # critico acima de 95% usado
MAX_BACKUP_AGE_HOURS="${MAX_BACKUP_AGE_HOURS:-26}"  # alinhado ao retention do Paperclip

LOG_FILE="${MAINTENANCE_LOG_FILE:-/tmp/nettoscorp-maintenance.log}"
TS="$(date +%Y%m%d_%H%M%S)"

FAIL_CRIT=0
FAIL_WARN=0
CHECKS=0

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE" 2>/dev/null || echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

check() {
  CHECKS=$((CHECKS + 1))
  local name="$1" status="$2" detail="$3" severity="${4:-warn}"
  case "$status" in
    ok)   log "OK   [$name] $detail" ;;
    warn) FAIL_WARN=$((FAIL_WARN + 1)); log "WARN [$name] $detail" ;;
    crit) FAIL_CRIT=$((FAIL_CRIT + 1)); log "CRIT [$name] $detail" ;;
  esac
}

# -----------------------------------------------------------------------------
# 1. Health do Paperclip
# -----------------------------------------------------------------------------
check_paperclip() {
  local http_code
  http_code="$(curl --silent --show-error --output /dev/null \
    --write-out '%{http_code}' \
    --max-time "$PAPERCLIP_HEALTH_TIMEOUT" \
    "${PAPERCLIP_BASE_URL}/api/liveness" 2>/dev/null || true)"

  if [[ "$http_code" == "200" ]]; then
    check "paperclip-liveness" ok "GET /api/liveness HTTP 200 em ${PAPERCLIP_BASE_URL}"
  elif [[ -z "$http_code" || "$http_code" == "000" ]]; then
    check "paperclip-liveness" crit "Paperclip nao respondeu em ${PAPERCLIP_BASE_URL}/api/liveness (sem conexao)"
  else
    check "paperclip-liveness" crit "Paperclip respondeu HTTP $http_code em /api/liveness"
  fi

  local health_code
  health_code="$(curl --silent --show-error --output /dev/null \
    --write-out '%{http_code}' \
    --max-time "$PAPERCLIP_HEALTH_TIMEOUT" \
    "${PAPERCLIP_BASE_URL}/api/health" 2>/dev/null || true)"
  if [[ "$health_code" == "200" ]]; then
    check "paperclip-health" ok "GET /api/health HTTP 200"
  elif [[ -n "$health_code" && "$health_code" != "000" ]]; then
    check "paperclip-health" warn "GET /api/health HTTP $health_code (esperado 200)"
  fi
}

# -----------------------------------------------------------------------------
# 2. Hermes
# -----------------------------------------------------------------------------
check_hermes() {
  if command -v hermes >/dev/null 2>&1; then
    if hermes doctor >/dev/null 2>&1; then
      check "hermes" ok "hermes doctor OK"
    else
      check "hermes" warn "hermes doctor falhou (verificar ~/.hermes)"
    fi
  else
    check "hermes" warn "Hermes nao instalado (sem comando 'hermes')"
  fi

  # Processo do gateway (se estiver rodando)
  if pgrep -f "gateway run" >/dev/null 2>&1 || pgrep -f "hermes serve" >/dev/null 2>&1; then
    check "hermes-process" ok "Processo do Hermes/gateway em execucao"
  else
    check "hermes-process" warn "Nenhum processo Hermes/gateway detectado"
  fi
}

# -----------------------------------------------------------------------------
# 3. Backup do Paperclip
# -----------------------------------------------------------------------------
check_backup() {
  if [[ ! -d "$BACKUP_DIR" ]]; then
    check "paperclip-backup" warn "Diretorio de backup nao encontrado: $BACKUP_DIR"
    return
  fi

  local latest latest_mtime now age_hours
  latest="$(find "$BACKUP_DIR" -type f \( -name 'paperclip-*.sql.gz' -o -name 'paperclip_db_*.tar.gz' \) 2>/dev/null | sort -r | head -n 1)"

  if [[ -z "$latest" ]]; then
    check "paperclip-backup" warn "Nenhum arquivo de backup encontrado em $BACKUP_DIR"
    return
  fi

  now="$(date +%s)"
  latest_mtime="$(stat -c %Y "$latest" 2>/dev/null || stat -f %m "$latest" 2>/dev/null || echo 0)"
  age_hours="$(( (now - latest_mtime) / 3600 ))"

  if (( age_hours <= MAX_BACKUP_AGE_HOURS )); then
    local size
    size="$(du -h "$latest" | cut -f1)"
    check "paperclip-backup" ok "Backup recente: $(basename "$latest") ($size, ${age_hours}h atras)"
  else
    check "paperclip-backup" warn "Backup desatualizado: $(basename "$latest") (${age_hours}h atras, limite ${MAX_BACKUP_AGE_HOURS}h)"
  fi
}

# -----------------------------------------------------------------------------
# 4. Espaco em disco
# -----------------------------------------------------------------------------
check_disk() {
  local target="${1:-$HOME}"
  if ! command -v df >/dev/null 2>&1; then
    check "disk-space" warn "df nao disponível; pulando verificacao de disco"
    return
  fi

  local used_pct avail
  used_pct="$(df -P "$target" | awk 'NR==2 {gsub(/%/,"",$5); print $5}')"
  avail="$(df -h -P "$target" | awk 'NR==2 {print $4}')"

  if [[ -z "$used_pct" || ! "$used_pct" =~ ^[0-9]+$ ]]; then
    check "disk-space" warn "Nao foi possivel ler percentual de uso do disco em $target"
    return
  fi

  if (( used_pct >= DISK_CRIT_PCT )); then
    check "disk-space" crit "Disco em $target: ${used_pct}% usado (critico >= ${DISK_CRIT_PCT}%), livre: $avail"
  elif (( used_pct >= DISK_WARN_PCT )); then
    check "disk-space" warn "Disco em $target: ${used_pct}% usado (aviso >= ${DISK_WARN_PCT}%), livre: $avail"
  else
    check "disk-space" ok "Disco em $target: ${used_pct}% usado, livre: $avail"
  fi
}

# -----------------------------------------------------------------------------
# Execucao
# -----------------------------------------------------------------------------
main() {
  mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null || true
  log "=== Iniciando manutencao NettosCorp (Paperclip + Hermes) ==="
  log "Paperclip: ${PAPERCLIP_BASE_URL} | Hermes home: ${HERMES_HOME} | Backup: ${BACKUP_DIR}"

  check_paperclip
  check_hermes
  check_backup
  check_disk "$HOME"

  log "=== Manutencao concluida: ${CHECKS} verificacoes, ${FAIL_CRIT} critico(s), ${FAIL_WARN} aviso(s) ==="

  if (( FAIL_CRIT > 0 )); then
    exit 2
  elif (( FAIL_WARN > 0 )); then
    exit 1
  fi
  exit 0
}

main "$@"
