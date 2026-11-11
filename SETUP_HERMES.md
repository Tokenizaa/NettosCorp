# NETTOSCORP — HERMES SETUP (instalação reproduzível)

Este guia permite baixar este repositório e instalar o Hermes com toda a estrutura organizacional da NettosCorp já configurada: voz Piper (pt-BR), skills, agentes básicos e perfis.

## 1. Pré-requisitos

- Windows 10/11 ou WSL2 Ubuntu 24.04
- Node.js 18+ e npm/pnpm
- Python 3.10+
- ffmpeg (para conversão de áudio)
- PostgreSQL (opcional, apenas se for usar o servidor Paperclip)

## 2. Clonar o repositório

```bash
git clone https://github.com/Tokenizaa/NettosCorp.git
cd NettosCorp
```

## 3. Instalar o Hermes (automático)

Após clonar, execute o script de instalação para ter o Hermes com voz Piper, skills e agentes já configurados:

**Windows (PowerShell):**
```powershell
.\install-hermes.ps1
```

**WSL2 / Linux:**
```bash
chmod +x install-hermes.sh
./install-hermes.sh
```

O script faz:
1. Instala o Hermes Agent via instalador oficial
2. Instala Piper TTS e faster-whisper
3. Baixa o modelo de voz brasileira (pt_BR-faber-medium)
4. Configura `tts.provider = piper` e `tts.piper.voice`
5. Copia os skills da NettosCorp para o diretório do Hermes

## 4. Atualizar após cada `git pull`

Sempre que der pull no repositório, rode o script de atualização para sincronizar skills e configuração:

**Windows (PowerShell):**
```powershell
.\update-hermes.ps1
```

**WSL2 / Linux:**
```bash
./update-hermes.sh
```

## 5. Configurar provider e modelo

Execute o setup interativo:

```bash
hermes setup
```

Escolha:
- Provider: NVIDIA (ou outro de sua preferência)
- Modelo: nvidia/nemotron-3.5-super-vl-120b-a12b

## 5. Configurar voz (TTS Piper — português brasileiro)

O Hermes vem com Edge TTS por padrão. Para usar a voz Piper (mais natural, pt-BR):

```bash
# Instalar Piper TTS
uv pip install piper-tts

# Baixar modelo de voz brasileira (faber - masculina)
mkdir -p ~/.hermes/voices
cd ~/.hermes/voices
curl -sL -o pt_BR-faber-medium.onnx "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx"
curl -sL -o pt_BR-faber-medium.onnx.json "https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json"
```

Configurar no Hermes:

```bash
hermes config set tts.provider piper
hermes config set tts.piper.voice "$HOME/.hermes/voices/pt_BR-faber-medium.onnx"
```

## 6. Configurar STT (transcrição de áudio)

Mensagens de voz no Telegram são auto-transcritas. Para STT local com faster-whisper:

```bash
uv pip install faster-whisper
```

## 7. Instalar os skills da NettosCorp

Os skills já estão neste repositório em `skills/`. Copie para o diretório de skills do Hermes:

```bash
# No Windows (PowerShell)
Copy-Item -Recurse skills/* $env:LOCALAPPDATA\hermes\skills\

# No WSL2/Linux
cp -r skills/* ~/.hermes/skills/
```

Skills disponíveis:
- `nettoscorp-org` — Estrutura organizacional (companies, agents, goals, issues)
- `nettoscorp-agents` — 4 agentes básicos com perfis individuais

## 8. Verificar instalação

```bash
hermes doctor
hermes config get tts
hermes skills list
```

## 9. Estrutura do repositório

```
NettosCorp/
├── skills/
│   ├── nettoscorp-org/          # Estrutura organizacional
│   └── nettoscorp-agents/       # 4 agentes básicos + perfis
├── enterprise/                  # Frontend React/Vite/Supabase
├── institutional/               # Documentação institucional
├── packages/                    # Paperclip adapters (TypeScript)
├── server/                      # Paperclip server
├── cli/                         # Paperclip CLI
└── README.md                    # Este guia
```

## 10. Agentes básicos incluídos

Quatro agentes configurados com `reportsTo: Hermes`:

| Agente | ID | Role | Função |
|--------|----|------|--------|
| Monitor Enterprise | net-ag-001 | monitoring | Monitora plataforma enterprise |
| Documentação Institucional | net-ag-002 | documentation | Mantém docs atualizadas |
| Operacional | net-ag-003 | operations | Tarefas rotineiras e prazos |
| Atendimento | net-ag-004 | support | Filtra mensagens, responde dúvidas |

## 11. Comandos de voz

```bash
/her voice on    # Ativa voz-a-voz
/her voice tts   # Responde sempre com áudio
/her voice off   # Desativa áudio
```

## 12. Próximos passos após instalação

1. Homologar o modelo de autoridade v1.2 com o fundador
2. Definir orçamentos mensais por agente (`budgetMonthlyCents`)
3. Ativar os agentes via delegação de tarefas
4. Integrar com o servidor Paperclip (opcional, se precisar do control plane completo)

---

**Repositório unificado:** https://github.com/Tokenizaa/NettosCorp  
**Base:** Parâmetros do Paperclip (companies, agents, goals, issues) rodando nativamente no Hermes
