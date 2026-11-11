# ============================================================
# NETTOSCORP — INSTALAÇÃO DO HERMES (Windows PowerShell)
# Executa após clonar o repositório para ter o Hermes pronto
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host "[1/5] Verificando pré-requisitos..." -ForegroundColor Cyan

# Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js não encontrado. Instale em https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python não encontrado. Instale em https://python.org/" -ForegroundColor Red
    exit 1
}

# Verificar ffmpeg
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "ffmpeg não encontrado. Instale via winget: winget install ffmpeg" -ForegroundColor Yellow
}

Write-Host "[2/5] Instalando Hermes Agent..." -ForegroundColor Cyan

$installScript = "https://hermes-agent.nousresearch.com/install.sh"
Invoke-WebRequest -Uri $installScript -OutFile "$env:TEMP\hermes-install.sh"
bash "$env:TEMP\hermes-install.sh"

Write-Host "[3/5] Configurando voz Piper (português brasileiro)..." -ForegroundColor Cyan

# Instalar Piper TTS via uv ou pip
if (Get-Command uv -ErrorAction SilentlyContinue) {
    uv pip install piper-tts faster-whisper
} else {
    python -m pip install piper-tts faster-whisper
}

# Criar diretório de vozes
$voicesDir = "$env:LOCALAPPDATA\hermes\voices"
New-Item -ItemType Directory -Path $voicesDir -Force | Out-Null

# Baixar modelo de voz brasileira (faber - masculina, pt-BR)
$voiceUrl = "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx"
$voiceJsonUrl = "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json"

Invoke-WebRequest -Uri $voiceUrl -OutFile "$voicesDir\pt_BR-faber-medium.onnx"
Invoke-WebRequest -Uri $voiceJsonUrl -OutFile "$voicesDir\pt_BR-faber-medium.onnx.json"

Write-Host "[4/5] Configurando Hermes (TTS Piper + STT whisper)..." -ForegroundColor Cyan

hermes config set tts.provider piper
hermes config set tts.piper.voice "$voicesDir\pt_BR-faber-medium.onnx"

Write-Host "[5/5] Instalando skills da NettosCorp..." -ForegroundColor Cyan

$hermesSkillsDir = "$env:LOCALAPPDATA\hermes\skills"
New-Item -ItemType Directory -Path $hermesSkillsDir -Force | Out-Null

# Copiar skills do repositório para o diretório do Hermes
$repoSkillsDir = Join-Path (Get-Location) "skills"
if (Test-Path $repoSkillsDir) {
    Copy-Item -Recurse -Path "$repoSkillsDir\*" -Destination $hermesSkillsDir -Force
    Write-Host "Skills copiados para $hermesSkillsDir" -ForegroundColor Green
}

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "  HERMES INSTALADO COM SUCESSO!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. hermes setup          # configurar provider e modelo"
Write-Host "  2. hermes doctor         # verificar instalação"
Write-Host "  3. hermes                # iniciar o agente"
Write-Host ""
Write-Host "Comandos de voz:" -ForegroundColor Cyan
Write-Host "  /voice on    # voz-a-voz"
Write-Host "  /voice tts   # sempre responder em áudio"
Write-Host "  /voice off   # desativar áudio"
Write-Host ""
