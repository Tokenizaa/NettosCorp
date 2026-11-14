# HERMES — Configurações da NettosCorp

Toda a estrutura de configuração, skills, perfis e cron do Hermes usado pela NettosCorp está aqui, pronta para ser clonada e instalada em qualquer máquina.

## Estrutura

```
hermes/
├── config.yaml.example        # Configuração de referência (sem segredos)
├── .env.example               # Variáveis de ambiente de exemplo
├── install.sh                 # Instalação (Linux/WSL2)
├── install.ps1                # Instalação (Windows PowerShell)
├── update.sh                  # Atualização (Linux/WSL2)
├── update.ps1                 # Atualização (Windows PowerShell)
├── README.md                  # Este arquivo
├── skills/                    # Skills e perfis da NettosCorp
│   ├── nettoscorp-org/
│   └── nettoscorp-agents/
│       └── profiles/
└── cron/
    └── JOBS_ATIVOS.md
```

## O que está incluído

- **config.yaml** — Configuração padrão do Hermes (provider NVIDIA Nemotron, fallback Nous, Skinner, timeouts, MCP servers).
- **.env.example** — Exemplo de variáveis de ambiente (sem chaves reais).
- **Skills**:
  - `nettoscorp-org` — Estrutura organizacional da NettosCorp (companies, agents, goals, issues)
  - `nettoscorp-agents` — 4 agentes de suporte + 6 especialistas previstos, com perfis
  - `monitor-enterprise`, `documentacao-institucional`, `operacional`, `atendimento` — perfis individuais
- **Cron** — 3 jobs ativos (feedback diário, feedback semanal, verificação de agentes).
- **Scripts** — `install.sh`/`install.ps1` e `update.sh`/`update.ps1` para instalação e atualização.

## Como instalar (Linux/WSL2)

```bash
# 1. Clone este repositório
git clone -b master https://github.com/Tokenizaa/NettosCorp.git
cd NettosCorp

# 2. Rode a instalação
chmod +x hermes/install.sh
./hermes/install.sh
```

O script faz:
1. Verifica pré-requisitos (Node.js, Python3, ffmpeg, curl)
2. Instala o Hermes Agent via instalador oficial
3. Copia config.yaml.example → ~/.hermes/config.yaml.example
4. Copia .env.example → ~/.hermes/.env.example
5. Instala Piper TTS + faster-whisper
6. Baixa modelo de voz brasileira (pt_BR-faber-medium)
7. Copia skills da NettosCorp para ~/.hermes/skills
8. Aplica configurações padrão via `hermes config set`

## Como instalar (Windows PowerShell)

```powershell
git clone -b master https://github.com/Tokenizaa/NettosCorp.git
cd NettosCorp
.\hermes\install.ps1
```

O script Windows executa as mesmas etapas (positivo do ambiente, instala Piper TTS e configurações padrão).

## Como atualizar

```bash
# Raiz do repositório
git pull origin master
# Atualiza skills, config e cron
./hermes/update.sh
```

A atualização só atualiza o que está neste diretório (`hermes/skills`, config e cron) — não reinstala o Hermes.

## Pós-instalação (obrigatório)

1. Edite `~/.hermes/.env` e preencha `NVIDIA_API_KEY` (ou outro provider)
2. Rode `hermes setup` para confirmar provider e modelo
3. Rode `hermes doctor` para verificar tudo está ok
4. Liste skills: `hermes skills list`
5. Inicie: `hermes`

## Nota sobre segredos

Este diretório contém `.env.example` (exemplo) e `config.yaml.example` (exemplo). **Nunca commite** `~/.hermes/.env` com chaves reais. Os segredos ficam apenas no seu ambiente, fora do repositório.
