# ARQUIVOS SENSÍVEIS OU JÁ RASTREADOS — NETTOSCORP

Versao: 1.0
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/04-portfolio/ARQUIVOS_SENSIVEIS_RASTREADOS.md
Status: REGISTRO INSTITUCIONAL — atencao requerida da lideranca

---

## 1. Aviso critico

Um `.gitignore` **nao remove arquivos ja rastreados** pelo Git. Arquivos sensiveis que ja estejam versionados permanecem no historico mesmo apos serem adicionados ao `.gitignore`. Para removê-los seria necessario reescrever o historico (operacao destrutiva), o que e proibido pela ordem de trabalho.

Este documento lista arquivos sensiveis identificados que merecem atencao da lideranca.

---

## 2. Arquivos sensiveis identificados

### 2.1 Corre+ — `.env` ja rastreado (CRITICO)

| Item | Detalhe |
|------|---------|
| Arquivo | `.env` |
| Status | JA RASTREADO no Git (aparece como ` M .env` no `git status`) |
| Conteudo identificado | `VITE_SUPABASE_ACESS_TOKEN="***"` (token de acesso do Supabase) |
| Risco | Credencial de acesso a banco de dados esta versionada e pode estar exposta no historico do repositorio remoto |
| Acao recomendada | A lideranca deve avaliar rotacao do token e remocao do arquivo do historico (operacao destrutiva, fora do escopo desta ordem) |

O arquivo `.env` nao consta no `.gitignore` de Corre+ (ou foi modificado de forma a nao cobri-lo adequadamente). Mesmo que fosse adicionado ao `.gitignore`, o arquivo ja estaria versionado e permaneceria no historico.

### 2.2 EmprestaMais — `.gitignore` deletado

| Item | Detalhe |
|------|---------|
| Arquivo | `.gitignore` |
| Status | Deletado no working tree (staged deletion) |
| Consequencia | Arquivos que estavam ignorados podem agora ser acidentalmente adicionados ao Git em futuros commits |
| Historico | O ultimo commit (HEAD) ainda contem um `.gitignore` com regras basicas |
| Acao recomendada | A lideranca deve avaliar restaurar o `.gitignore` do HEAD ou criar um novo adequado |

### 2.3 Arquivos de ambiente em outros projetos

| Projeto | Arquivo .env | Rastreado? | .env.example preservado? |
|---------|-------------|------------|--------------------------|
| agency-agents | Nao encontrado | Nao | Nao |
| BelezaDigital-v2 | .env.example | Sim (como exemplo) | Sim |
| Corre+ | .env | **Sim (com token real)** | Nao |
| Defesai-AdeusMultas-v2 | .env.example | Sim (como exemplo) | Sim |
| DefesaI-Saude-app | .env.example | Sim (como exemplo) | Sim |
| EmprestaMais | Nao encontrado | Nao | Nao |
| hospedamais | .env.example | Sim (como exemplo) | Sim |
| MaisClientes-v3.2 | .env.example | Sim (como exemplo) | Sim |
| paperclip | .env, .env.runner-e2e.example | Sim (exemplo) | Sim |
| Plataforma-Paralegal-Digital | Nao encontrado | Nao | Nao |
| TakeMaster-v2 | .env.example | Sim (como exemplo) | Sim |

**Observacao:** Apenas `Corre+` tem um `.env` com conteúdo real (não exemplo) rastreado no Git. Todos os outros projetos que possuem arquivos de ambiente usam apenas `.env.example` como modelo seguro, que e uma pratica aceitavel.

---

## 3. Arquivos ja rastreados que merecem atencao (outros)

| Projeto | Arquivo | Observacao |
|---------|---------|------------|
| EmprestaMais | LICENSE, README.md, SECURITY_HEADERS.md, bun.lockb, components.json, docs/* | Estão como deletados no working tree. Estao no historico do Git. A delecao em massa pode ser intencional ou acidental. |
| hospedamais | 9 relatorios de auditoria (ACCESSIBILITY_AUDIT_REPORT.md, FRONTEND_PATTERNS_CHECKUP_REPORT.md, etc.) | Untracked (nao estao no Git). Sao relatorios de seguranca e qualidade que podem conter informacoes sensiveis sobre o sistema. |
| MaisClientes-v3.2 | .claude/, origin/, package-lock.json | Untracked. `.claude/` e `origin/` podem conter configuracoes locais de ferramentas. |
| TakeMaster-v2 | .claude/, .opencode/sdd/, .playwright-mcp/, supabase/config.toml | Untracked. `supabase/config.toml` pode conter configuracoes locais do banco. `.playwright-mcp/` pode conter artifacts de teste. |
| Plataforma-Paralegal-Digital | AUDIT_LOCATION.md, AUDIT_REPORT.md, README_AUDIT.md, SUMMARY.md | Untracked. Relatorios de auditoria que podem conter informacoes sensiveis. |

---

## 4. Recomendacoes para a lideranca

1. **Corre+:** Rotular imediatamente o `VITE_SUPABASE_ACESS_TOKEN` exposto. Avaliar remocao do `.env` do historico do Git (operacao destrutiva, requer `git filter-repo` ou similar, fora do escopo desta ordem).
2. **EmprestaMais:** Restaurar o `.gitignore` do ultimo commit ou criar um novo, para evitar que arquivos anteriormente ignorados sejam acidentalmente versionados.
3. **hospedamais, Plataforma-Paralegal-Digital, TakeMaster-v2:** Revisar os arquivos untracked de auditoria e configuracao local antes de qualquer adicao ao Git.
4. **Todos os projetos:** Nao adicionar arquivos `.env` com valores reais ao Git. Usar apenas `.env.example` como modelo.

---

## 5. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/04-portfolio/ARQUIVOS_SENSIVEIS_RASTREADOS.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/04-portfolio/ARQUIVOS_SENSIVEIS_RASTREADOS.md")

---

Nenhum codigo de projeto foi alterado. Nenhum push ou alteracao de branch remota foi executada. Nenhum arquivo foi removido do versionamento.