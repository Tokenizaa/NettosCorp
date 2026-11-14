#!/bin/bash
# ============================================================
# NETTOSCORP — ATUALIZAÇÃO DO HERMES (Linux/WSL2)
# Executa após cada git pull para manter o Hermes atualizado
# ============================================================
set -euo pipefail

echo "[1/3] Atualizando skills da NettosCorp..."

HERMES_SKILLS_DIR="$HOME/.hermes/skills"
mkdir -p "$HERMES_SKILLS_DIR"

if [ -d "./skills" ]; then
    cp -r ./skills/* "$HERMES_SKILLS_DIR/"
    echo "Skills atualizados."
fi

echo "[2/3] Verificando configuração de voz..."

VOICES_DIR="$HOME/.hermes/voices"
VOICE_FILE="$VOICES_DIR/pt_BR-faber-medium.onnx"

if [ ! -f "$VOICE_FILE" ]; then
    echo "Modelo de voz não encontrado. Baixando..."
    mkdir -p "$VOICES_DIR"
    curl -sL -o "$VOICE_FILE" \
        "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx"
    curl -sL -o "$VOICE_FILE.json" \
        "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json"
fi

hermes config set tts.provider piper
hermes config set tts.piper.voice "$VOICE_FILE"

echo "[3/3] Verificando instalação..."
hermes doctor

echo ""
echo "Atualização concluída."
