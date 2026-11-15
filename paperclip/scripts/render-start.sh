#!/usr/bin/env bash
# =============================================================================
# NETTOSCORP — Render start command (plano gratuito, US$ 0)
#
# Inicia no mesmo container:
#   1. Paperclip server (Express) na porta $PORT
#   2. Hermes agent/gateway como processo background
#
# Nenhuma credencial e escrita aqui. Todas as chaves vêm de variaveis de
# ambiente injetadas pelo Render (DATABASE_URL, RENDER_API_KEY, NVIDIA_API_KEY,
# BETTER_AUTH_SECRET, etc.).
# =============================================================================
set -uo pipefail

PORT="${PORT:-10000}"
PAPERCLIP_HOME="${PAPERCLIP_HOME:-$PWD}"
HERMES_HOME="${HERMES_HOME:-/opt/render/.hermes}"
PAPERCLIP_PID=""
HERMES_PID=""

echo "[render-start] Iniciando Paperclip + Hermes (porta $PORT)"

# -----------------------------------------------------------------------------
# 1. Paperclip server
# -----------------------------------------------------------------------------
echo "[render-start] Iniciando Paperclip server (server/dist/index.js)..."
cd "$PAPERCLIP_HOME"

# Garante que o build existe (o Render ja constroi, mas esta seguranca evita
# falha silenciosa se o build falhar por algum motivo)
if [ ! -f "server/dist/index.js" ]; then
  echo "[render-start] Build do servidor nao encontrado. Executando pnpm build..."
  pnpm --filter @paperclipai/server build
fi

# Aplica migrações automaticamente no arranque (plano free: sem disco persistente,
# o schema do Supabase e gerido externamente; o Paperclip apenas garante que as
# tabelas necessarias existem)
export PAPERCLIP_MIGRATION_AUTO_APPLY="${PAPERCLIP_MIGRATION_AUTO_APPLY:-true}"
export PAPERCLIP_MIGRATION_PROMPT="${PAPERCLIP_MIGRATION_PROMPT:-never}"

# Inicia o Paperclip em background, anexado ao stdout/stderr do container
# (Render captura esses fluxos como logs do servico).
node server/dist/index.js > /dev/stdout 2>&1 &
PAPERCLIP_PID=$!
echo "[render-start] Paperclip PID=$PAPERCLIP_PID"

# Aguarda o health check do Paperclip ficar disponível (máx ~60s).
for i in $(seq 1 60); do
  if curl -fsS "http://127.0.0.1:${PORT}/api/liveness" >/dev/null 2>&1; then
    echo "[render-start] Paperclip respondendo em /api/liveness (HTTP 200)."
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "[render-start] AVISO: Paperclip nao respondeu ao health check a tempo."
  fi
  sleep 1
done

# -----------------------------------------------------------------------------
# 2. Hermes (instalacao best-effort no container)
# -----------------------------------------------------------------------------
start_hermes() {
  echo "[render-start] Verificando instalacao do Hermes..."
  if ! command -v hermes >/dev/null 2>&1; then
    echo "[render-start] Hermes nao instalado. Baixando instalador oficial..."
    mkdir -p "$HOME/.cache/hermes-install"
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh \
      -o "$HOME/.cache/hermes-install/install.sh" \
      && bash "$HOME/.cache/hermes-install/install.sh" \
      || { echo "[render-start] Falha ao instalar Hermes (continuando sem ele)"; return; }
  fi

  export HERMES_HOME
  mkdir -p "$HERMES_HOME"

  # Copia configuracoes e skills da NettosCorp se ainda nao existirem
  if [ -d "/opt/render/repo/hermes" ]; then
    if [ ! -f "$HERMES_HOME/config.yaml" ]; then
      cp /opt/render/repo/hermes/config.yaml.example "$HERMES_HOME/config.yaml.example" 2>/dev/null || true
    fi
    if [ -d "/opt/render/repo/hermes/skills" ]; then
      cp -r /opt/render/repo/hermes/skills/* "$HERMES_HOME/skills/" 2>/dev/null || true
    fi
    if [ -d "/opt/render/repo/hermes/cron" ]; then
      cp -r /opt/render/repo/hermes/cron/* "$HERMES_HOME/cron/" 2>/dev/null || true
    fi
  fi

  # Aplica defaults da NettosCorp (nao sobrescreve valores ja definidos pelo operador)
  hermes config set model.provider nvidia 2>/dev/null || true
  hermes config set model.default nvidia/nemotron-3.5-super-vl-120b-a12b 2>/dev/null || true
  hermes config set model.base_url https://integrate.api.nvidia.com/v1 2>/dev/null || true

  # Inicia Hermes como processo background (best-effort).
  # Logs vão para stdout/stderr do container (Render captura como logs).
  echo "[render-start] Iniciando Hermes agent..."
  nohup hermes serve > /dev/stdout 2>&1 &
  HERMES_PID=$!
  echo "[render-start] Hermes PID=$HERMES_PID"
}

start_hermes || true

# -----------------------------------------------------------------------------
# 3. Espera pelo processo principal (Paperclip). O container fica vivo
#    enquanto o Paperclip rodar. Hermes e best-effort: se morrer, nao derruba
#    o servico.
# -----------------------------------------------------------------------------
echo "[render-start] Aguardando o Paperclip (PID=$PAPERCLIP_PID)..."
if [ -n "$PAPERCLIP_PID" ]; then
  wait "$PAPERCLIP_PID" 2>/dev/null
  EXIT_CODE=$?
else
  echo "[render-start] ERRO: PAPERCLIP_PID nao definido."
  EXIT_CODE=1
fi

echo "[render-start] Paperclip encerrou (codigo $EXIT_CODE)."
if [ -n "${HERMES_PID:-}" ] && kill -0 "$HERMES_PID" 2>/dev/null; then
  kill "$HERMES_PID" 2>/dev/null || true
fi
exit "$EXIT_CODE"
