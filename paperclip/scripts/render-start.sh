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
set -euo pipefail

PORT="${PORT:-10000}"
PAPERCLIP_HOME="${PAPERCLIP_HOME:-$PWD}"
HERMES_HOME="${HERMES_HOME:-/opt/render/.hermes}"

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

# Inicia o Paperclip em background, anexado ao log de saida
node server/dist/index.js > /tmp/paperclip.log 2>&1 &
PAPERCLIP_PID=$!
echo "[render-start] Paperclip PID=$PAPERCLIP_PID"

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

  # Inicia Hermes como processo background (gateway/servidor)
  echo "[render-start] Iniciando Hermes agent..."
  nohup hermes serve > /tmp/hermes.log 2>&1 &
  HERMES_PID=$!
  echo "[render-start] Hermes PID=$HERMES_PID"
}

start_hermes || true

# -----------------------------------------------------------------------------
# 3. Espera pelos processos (o container fica vivo enquanto qualquer um rodar)
# -----------------------------------------------------------------------------
echo "[render-start] Ambos os processos iniciados. Aguardando..."
wait -n $PAPERCLIP_PID $HERMES_PID 2>/dev/null || true

# Se um processo morrer, encerra o outro e sai (o Render reinicia o container)
EXIT_CODE=$?
echo "[render-start] Um processo encerrou (codigo $EXIT_CODE). Encerrando o outro..."
kill $HERMES_PID 2>/dev/null || true
kill $PAPERCLIP_PID 2>/dev/null || true
exit $EXIT_CODE
