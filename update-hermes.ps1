# ============================================================
# NETTOSCORP — ATUALIZAÇÃO DO HERMES (Windows PowerShell)
# Executa após cada git pull para manter o Hermes atualizado
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host "[1/3] Atualizando skills da NettosCorp..." -ForegroundColor Cyan

$hermesSkillsDir = "$env:LOCALAPPDATA\hermes\skills"
$repoSkillsDir = Join-Path (Get-Location) "skills"

if (Test-Path $repoSkillsDir) {
    Copy-Item -Recurse -Path "$repoSkillsDir\*" -Destination $hermesSkillsDir -Force
    Write-Host "Skills atualizados." -ForegroundColor Green
}

Write-Host "[2/3] Verificando configuração de voz..." -ForegroundColor Cyan

$voicesDir = "$env:LOCALAPPDATA\hermes\voices"
$voiceFile = "$voicesDir\pt_BR-faber-medium.onnx"

if (-not (Test-Path $voiceFile)) {
    Write-Host "Modelo de voz não encontrado. Baixando..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $voicesDir -Force | Out-Null
    Invoke-WebRequest -Uri "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx" -OutFile $voiceFile
    Invoke-WebRequest -Uri "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json" -OutFile "$voiceFile.json"
}

hermes config set tts.provider piper
hermes config set tts.piper.voice "$voiceFile"

Write-Host "[3/3] Verificando instalação..." -ForegroundColor Cyan
hermes doctor

Write-Host "`nAtualização concluída." -ForegroundColor Green
