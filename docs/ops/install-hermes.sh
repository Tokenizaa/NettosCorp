#!/bin/bash
# ============================================================
# NETTOSCORP — INSTALAÇÃO DO HERMES (Linux/WSL2)
# Wrapper que chama hermes/install.sh (nova estrutura)
# ============================================================
set -euo pipefail

# Resolve o diretório do repositório (onde está este script)
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -f "$REPO_DIR/hermes/install.sh" ]; then
    echo "AVISO: hermes/install.sh não encontrado. As configurações foram movidas para a pasta hermes/."
    echo "Rode manualmente: cd $REPO_DIR && chmod +x hermes/install.sh && ./hermes/install.sh"
    exit 1
fi

echo "Executando instalação do Hermes (NettosCorp)..."
"$REPO_DIR/hermes/install.sh"
