#!/bin/bash
# =============================================================================
# NETTOSCORP — INSTALAÇÃO DO HERMES (Linux / WSL2)
# Executa após clonar o repositório para ter o Hermes com as configurações
# da NettosCorp já aplicadas (voz Piper pt-BR, skills, agentes e cron).
# =============================================================================
set -euo pipefail

echo "[1/6] Verificando pré-requisitos..."
command -v node >/dev/null 2>&1 || { echo "Node.js não encontrado. Instale em https://nodejs.org/"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Python3 não encontrado. Instale em https://python.org/"; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg não encontrado. Instale: sudo apt install ffmpeg"; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "curl não encontrado. Instale: sudo apt install curl"; exit 1; }

echo "[2/6] Instalando o Hermes Agent (instalador oficial)..."
if ! command -v hermes >/dev/null 2>&1; then
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
else
    echo "Hermes já instalado. Pulando."
fi

echo "[3/6] Aplicando configurações da NettosCorp..."
HERMES_HOME="${HOME}/.hermes"
mkdir -p "$HERMES_HOME"

# Copia config de exemplo se não existir
if [ ! -f "$HERMES_HOME/config.yaml" ]; then
    cp hermes/config.yaml.example "$HERMES_HOME/config.yaml.example"
    echo "config.yaml.example copiado para $HERMES_HOME (não sobrescreve config.yaml existente)."
fi

# Copia .env.example se não existir
if [ ! -f "$HERMES_HOME/.env" ]; then
    cp hermes/.env.example "$HERMES_HOME/.env.example"
    echo ".env.example copiado para $HERMES_HOME (preencha com suas chaves)."
fi

echo "[4/6] Configurando voz Piper (português brasileiro)..."
if command -v uv >/dev/null 2>&1; then
    uv pip install piper-tts faster-whisper 2>/dev/null || pip3 install piper-tts faster-whisper
else
    pip3 install piper-tts faster-whisper
fi

VOICES_DIR="$HERMES_HOME/voices"
mkdir -p "$VOICES_DIR"
curl -sL -o "$VOICES_DIR/pt_BR-faber-medium.onnx" \
    "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx"
curl -sL -o "$VOICES_DIR/pt_BR-faber-medium.onnx.json" \
    "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json"

echo "[5/6] Instalando skills da NettosCorp..."
SKILLS_DIR="$HERMES_HOME/skills"
mkdir -p "$SKILLS_DIR"
if [ -d "hermes/skills" ]; then
    cp -r hermes/skills/* "$SKILLS_DIR/"
    echo "Skills copiados para $SKILLS_DIR"
fi

echo "[6/6] Aplicando configuração padrão via CLI..."
hermes config set tts.provider piper
hermes config set tts.piper.voice "$VOICES_DIR/pt_BR-faber-medium.onnx"
hermes config set model.provider nvidia
hermes config set model.default nvidia/nemotron-3.5-super-vl-120b-a12b
hermes config set model.base_url https://integrate.api.nvidia.com/v1

echo ""
echo "============================================================"
echo "  HERMES INSTALADO COM SUCESSO! (NettosCorp)"
echo "============================================================"
echo ""
echo "Próximos passos:"
echo "  1. Edite ~/.hermes/.env e preencha NVIDIA_API_KEY (ou outro provider)"
echo "  2. hermes setup            # configurar provider e modelo (se necessário)"
echo "  3. hermes doctor           # verificar instalação"
echo "  4. hermes skills list      # confirmar skills da NettosCorp"
echo "  5. hermes                  # iniciar o agente"
echo ""
echo "Comandos de voz:"
echo "  /voice on    # voz-a-voz"
echo "  /voice tts   # sempre responder em áudio"
echo "  /voice off   # desativar áudio"
