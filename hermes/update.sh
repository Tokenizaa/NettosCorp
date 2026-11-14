#!/bin/bash
# =============================================================================
# NETTOSCORP — ATUALIZAÇÃO DO HERMES (Linux / WSL2)
# Executa após cada `git pull` para manter skills, config e cron sincronizados.
# =============================================================================
set -euo pipefail

echo "[1/4] Sincronizando skills da NettosCorp..."
SKILLS_DIR="$HOME/.hermes/skills"
mkdir -p "$SKILLS_DIR"
if [ -d "hermes/skills" ]; then
    cp -r hermes/skills/* "$SKILLS_DIR/"
    echo "Skills atualizados em $SKILLS_DIR"
else
    echo "AVISO: hermes/skills não encontrado. Pulando cópia de skills."
fi

echo "[2/4] Verificando configuração de voz..."
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

echo "[3/4] Aplicando configurações padrão..."
hermes config set tts.provider piper
hermes config set tts.piper.voice "$VOICE_FILE"
hermes config set model.provider nvidia
hermes config set model.default nvidia/nemotron-3.5-super-vl-120b-a12b
hermes config set model.base_url https://integrate.api.nvidia.com/v1

echo "[4/4] Verificando instalação..."
hermes doctor

echo ""
echo "Atualização do Hermes concluída."
