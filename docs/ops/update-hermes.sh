#!/bin/bash
# ============================================================
# NETTOSCORP — ATUALIZAÇÃO DO HERMES (Linux/WSL2)
# Wrapper que chama hermes/update.sh (nova estrutura)
# ============================================================
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -f "$REPO_DIR/hermes/update.sh" ]; then
    echo "AVISO: hermes/update.sh não encontrado. As configurações foram movidas para a pasta hermes/."
    exit 1
fi

echo "Executando atualização do Hermes (NettosCorp)..."
"$REPO_DIR/hermes/update.sh"
