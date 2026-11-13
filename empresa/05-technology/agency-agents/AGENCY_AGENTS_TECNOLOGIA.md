# ESTUDO TECNOLOGICO — AGENCY AGENTS — NETTOSCORP

Versao: 1.0
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/05-technology/agency-agents/AGENCY_AGENTS_TECNOLOGIA.md
Fonte: /home/lg/workspace/NettosCorp/agency-agents/
Status: REGISTRO TECNOLOGICO — evidencia coletada, sem alteracao de codigo

---

## 1. Visao geral tecnologica

O Agency Agents e um repositorio de agentes de IA especializados distribuidos como arquivos Markdown com frontmatter YAML. Nao e uma aplicacao executavel por si; e um catalogo de conteudo de instrucao para agentes.

---

## 2. Formato de arquivo de agente

Cada agente e um arquivo `.md` com:

### 2.1 Frontmatter YAML

```yaml
---
name: Software Architect
description: Expert software architect specializing in system design...
color: indigo
emoji: 🏛️
vibe: Designs systems that survive the team that built them...
---
```

### 2.2 Corpo Markdown

- Identidade e memoria
- Misao principal
- Regras criticas
- Processos e fluxos de trabalho
- Estilo de comunicacao
- Exemplos de codigo e entregaveis
- Metricas de sucesso

---

## 3. Scripts de instalacao e conversao

### 3.1 `./scripts/install.sh`

Instala agentes em ferramentas de destino. Suporta:
- `--tool <ferramenta>` — especificar ferramenta (claude-code, cursor, codex, gemini-cli, opencode, qwen, osaurus, hermes, copilot, antigravity, aider, windsurf, kimi, vibe, dsh, mistral, deepseek-harness)
- `--division <divisao>` — instalar apenas uma divisao
- `--agent <slug>` — instalar agente individual
- `--agents-file <arquivo>` — instalar lista de slugs
- `--list teams` / `--list agents` — listar disponiveis
- `--dry-run` — simulacao sem instalacao

### 3.2 `./scripts/convert.sh`

Gera arquivos de integracao para cada ferramenta suportada, convertendo o formato .md do Agency Agents para o formato esperado por cada ferramenta.

### 3.3 `./scripts/check-divisions.sh`

Valida que `divisions.json` esta sincronizado com os diretorios em disco. Usado no CI.

---

## 4. Integracao com ferramentas

| Ferramenta | Metodo de instalacao | Limite observado |
|------------|---------------------|------------------|
| Claude Code | Copia .md para ~/.claude/agents/ | Sem limite conhecido |
| Cursor | Conversao via scripts | Sem limite conhecido |
| Codex | Conversao via scripts | Sem limite conhecido |
| Gemini CLI | Conversao via scripts | Sem limite conhecido |
| OpenCode | Conversao via scripts | ~119 agentes (bug upstream, descarta o restante) |
| Qwen | Conversao via scripts | Sem limite conhecido |
| Osaurus | Conversao via scripts | Sem limite conhecido |
| Hermes | Conversao via scripts | Sem limite conhecido |
| GitHub Copilot | Conversao via scripts | Sem limite conhecido |
| Antigravity | Conversao via scripts | Sem limite conhecido |
| Aider | Conversao via scripts | Sem limite conhecido |
| Windsurf | Conversao via scripts | Sem limite conhecido |
| Kimi Code | Conversao via scripts | Sem limite conhecido |
| Vibe | Conversao via scripts | Sem limite conhecido |
| Mistral Vibe | Conversao via scripts | Sem limite conhecido |
| DeepSeek Harness | Conversao via scripts | Sem limite conhecido |

**Observacao:** OpenCode tem limite de ~119 agentes. Recomendacao: instalar por divisao para manter-se abaixo do limite.

---

## 5. App nativa

**Agency Agents App** (agencyagents.app):
- nativa para macOS, Linux, Windows
- navega todo o roster de agentes
- instala em Claude Code, Cursor, Codex, Gemini, OpenCode, Qwen, Osaurus
- atualizacao automatica
- sem clone, sem terminal

---

## 6. Estrutura de diretorias (divisoes)

17 diretorias definidas em `divisions.json`:

| Divisao | Agentes |
|---------|---------|
| engineering | 65 |
| specialized | 59 |
| marketing | 37 |
| design | 10 |
| security | 12 |
| gis | 13 |
| testing | 9 |
| sales | 9 |
| paid-media | 7 |
| project-management | 7 |
| academic | 6 |
| game-development | 6 |
| spatial-computing | 6 |
| support | 6 |
| product | 6 |
| finance | 5 |
| healthcare | 3 |
| research | 1 |

**Total:** 264 agentes.

---

## 7. Runbooks e rosters

`strategy/runbooks.json` define equipes prontas para cenarios:

- **startup-mvp** (4-6 semanas): Core Team + Growth Team + Support Team
- **enterprise-feature** (6-12 semanas): Core Team + Compliance & Governance + Quality Assurance
- **marketing-campaign** (2-4 semanas): Campaign Core + Platform Specialists + Support
- **incident-response** (minutos a horas): P0 Critical Response + Verification & Post-Mortem

Cada runbook tem: slug, titulo, modo (NEXUS-Sprint / NEXUS-Micro), duracao, resumo, documento de referencia, e roster agrupado por equipe com modo de ativacao (always / semana X+ / sob demanda / post-fix).

---

## 8. Limitacoes tecnicas

| Limite | Descricao |
|--------|-----------|
| Sem banco de dados | Conteudo esta apenas em arquivos .md |
| Sem estado persistente | Cada ativacao e independente |
| Sem heartbeat | Nao ha monitoramento de liveness |
| Sem orcamento | Nao ha controle de custos por agente |
| Sem delegacao entre agentes | Cada agente e independente |
| Sem hierarquia | Nao ha reports_to entre agentes |
| Dependencia de scripts | Instalacao depende de shell scripts |
| Limite OpenCode (~119) | Instalar tudo pode exceder o limite |
| Nao e control plane | Nao gerencia tarefas, aprovacoes, orcamentos |

---

## 9. Avaliacao para NettosCorp

O Agency Agents e um **catalogo de conteudo de instrucao** excelente para agentes especialistas. Pode ser usado como fonte de identidade, misao, regras e entregaveis para agentes que serao gerenciados pelo Paperclip. Nao substitui o control plane organizacional.

---

## 10. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/05-technology/agency-agents/AGENCY_AGENTS_TECNOLOGIA.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/05-technology/agency-agents/AGENCY_AGENTS_TECNOLOGIA.md")

---

Nenhum codigo do Agency Agents foi alterado. Nenhuma instalacao de ferramenta foi executada.