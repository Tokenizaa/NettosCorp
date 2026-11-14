#!/bin/bash
# ============================================================
# NETTOSCORP — INSTALAÇÃO DO HERMES (Linux/WSL2)
# Executa após clonar o repositório para ter o Hermes pronto
# ============================================================
set -euo pipefail

echo "[1/5] Verificando pré-requisitos..."

command -v node >/dev/null 2>&1 || { echo "Node.js não encontrado. Instale em https://nodejs.org/"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Python3 não encontrado. Instale em https://python.org/"; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg não encontrado. Instale: sudo apt install ffmpeg"; exit 1; }

echo "[2/5] Instalando Hermes Agent..."
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

echo "[3/5] Configurando voz Piper (português brasileiro)..."

if command -v uv >/dev/null 2>&1; then
    uv pip install piper-tts faster-whisper
else
    pip3 install piper-tts faster-whisper
fi

VOICES_DIR="$HOME/.hermes/voices"
mkdir -p "$VOICES_DIR"

curl -sL -o "$VOICES_DIR/pt_BR-faber-medium.onnx" \
    "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx"
curl -sL -o "$VOICES_DIR/pt_BR-faber-medium.onnx.json" \
    "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json"

echo "[4/5] Configurando Hermes (TTS Piper + STT whisper)..."

hermes config set tts.provider piper
hermes config set tts.piper.voice "$VOICES_DIR/pt_BR-faber-medium.onnx"

echo "[5/5] Instalando skills da NettosCorp..."

HERMES_SKILLS_DIR="$HOME/.hermes/skills"
mkdir -p "$HERMES_SKILLS_DIR"

if [ -d "./skills" ]; then
    cp -r ./skills/* "$HERMES_SKILLS_DIR/"
    echo "Skills copiados para $HERMES_SKILLS_DIR"
fi

echo ""
echo "================================================"
echo "  HERMES INSTALADO COM SUCESSO!"
echo "================================================"
echo ""
echo "Próximos passos:"
echo "  1. hermes setup          # configurar provider e modelo"
echo "  2. hermes doctor         # verificar instalação"
echo "  3. hermes                # iniciar o agente"
echo ""
echo "Comandos de voz:"
echo "  /voice on    # voz-a-voz"
echo "  /voice tts   # sempre responder em áudio"
echo "  /voice off   # desativar áudio"
