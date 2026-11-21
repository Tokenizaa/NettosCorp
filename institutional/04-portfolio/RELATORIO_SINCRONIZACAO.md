# RELATÓRIO DE SINCRONIZAÇÃO LOCAL/REMOTO — NETTOSCORP

Versao: 1.0
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/04-portfolio/RELATORIO_SINCRONIZACAO.md
Status: REGISTRO INSTITUCIONAL — estado observado na data da execucao

---

## 1. Metodo

Para cada repositorio, foram verificados:
- Commit local (HEAD)
- Commit remoto (origin/branch principal) via `git ls-remote`
- Presenca de alterações locais nao commitadas (`git status --porcelain`)
- Presenca de commits locais nao enviados (`git log @{u}..HEAD`)
- Presenca de arquivos não rastreados (untracked)

O GitHub nao foi considerado automaticamente sincronizado. Cada repositorio foi verificado individualmente.

---

## 2. Tabela de sincronizacao

| # | Projeto | Branch | Commit local | Commit remoto | Sincronizado? | Alteracoes locais nao commitadas | Commits locais nao enviados |
|---|---------|--------|--------------|---------------|---------------|----------------------------------|------------------------------|
| 1 | agency-agents | main | 4e3ac3ca | b859c515 | NAO (divergem) | Nenhuma | Nao |
| 2 | BelezaDigital-v2 | master | 8998b075 | N/A (sem tracking) | NAO (sem comparacao) | Nenhuma | Nao |
| 3 | Corre+ | main | 05308555 | db19b5a3 | NAO (divergem) | SIM (23 arquivos modificados) | Nao |
| 4 | Defesai-AdeusMultas-v2 | main | 503d34fc | 503d34fc | SIM | SIM (9 modificados + 1 untracked) | Nao |
| 5 | DefesaI-Saude-app | main | e84f5b1f | e84f5b1f | SIM | Nenhuma | Nao |
| 6 | EmprestaMais | main | 9d59b582 | 5901ef5c | NAO (divergem) | SIM (muitos arquivos deletados, incluindo .gitignore) | Nao |
| 7 | hospedamais | main | 43e5422e | 43e5422e | SIM | Nenhuma (9 arquivos untracked) | Nao |
| 8 | MaisClientes-v3.2 | main | 79c25db4 | 79c25db4 | SIM | Nenhuma (3 itens untracked) | Nao |
| 9 | paperclip | master | 124b2cd0 | d1ee25d0 | NAO (divergem) | Nenhuma | Nao |
| 10 | Plataforma-Paralegal-Digital | main | 60df2018 | 60df2018 | SIM | SIM (1 modificado + 4 untracked) | Nao |
| 11 | TakeMaster-v2 | main | 640f6b0b | 640f6b0b | SIM | SIM (12 modificados + varios untracked) | Nao |

**Resumo:** 6 de 11 repositorios estao sincronizados (commit local == commit remoto). 5 estao divergentes ou sem comparacao possivel.

---

## 3. Detalhe por repositorio

### 3.1 agency-agents
- Branch: main
- Commit local: 4e3ac3ca (Merge pull request #1175)
- Commit remoto: b859c515
- Status: **Nao sincronizado** (local e remoto divergem)
- Alteracoes locais nao commitadas: Nenhuma
- Commits locais nao enviados: Nenhum detectado (o repositorio pode estar atras do remoto)
- .gitignore: Existe, abrangente (macOS, Node.js, Python, logs, temporarios, integracoes de agentes)

### 3.2 BelezaDigital-v2
- Branch: master
- Commit local: 8998b075
- Commit remoto: Nao foi possivel obter (sem tracking branch configurado ou erro de acesso)
- Status: **Nao sincronizado** (sem comparacao remota disponível)
- Alteracoes locais nao commitadas: Nenhuma
- Commits locais nao enviados: Nao verificavel sem remote tracking
- .gitignore: Existe, basico (node_modules, build, dist, .env*, .DS_Store, logs)

### 3.3 Corre+
- Branch: main
- Commit local: 05308555 (Lovable update)
- Commit remoto: db19b5a3
- Status: **Nao sincronizado** (local e remoto divergem)
- Alteracoes locais nao commitadas: **SIM — 23 arquivos modificados**, incluindo:
  - .env (ARQUIVO SENSÍVEL — ja rastreado no Git, contem VITE_SUPABASE_ACESS_TOKEN)
  - .gitignore (modificado)
  - README.md, components.json, eslint.config.js, index.html, package-lock.json, package.json, postcss.config.js, public/robots.txt
  - src/App.css, src/App.tsx, e varios componentes src/components/*
- Commits locais nao enviados: Nenhum
- .gitignore: Existe, mas esta entre os arquivos modificados (precisa de revisao)
- **Atencao:** .env ja esta versionado com credenciais. Nao deve ser ignorado agora sem primeiro remover do historico (proibido por esta ordem de trabalho).

### 3.4 Defesai-AdeusMultas-v2
- Branch: main
- Commit local: 503d34fc (remove arquivo temporario de mensagem de commit (etapa 10))
- Commit remoto: 503d34fc
- Status: Sincronizado
- Alteracoes locais nao commitadas: **SIM — 9 arquivos modificados** (package.json, src/core/analysis/case-analysis.ts, src/core/onboarding/*, src/core/rag/rag-pipeline.ts) + 1 untracked (package-lock.json)
- Commits locais nao enviados: Nenhum
- .gitignore: Existe, abrangente (node_modules, .env*, .vercel, *.zip, cobertura, build)

### 3.5 DefesaI-Saude-app
- Branch: main
- Commit local: e84f5b1f
- Commit remoto: e84f5b1f
- Status: Sincronizado
- Alteracoes locais nao commitadas: Nenhuma
- Commits locais nao enviados: Nenhum
- .gitignore: Existe (node_modules, build, dist, .env*, .wrangler/, test-results/, playwright-report/)

### 3.6 EmprestaMais
- Branch: main
- Commit local: 9d59b582 (feat: implement GOV.BR compliance framework)
- Commit remoto: 5901ef5c
- Status: **Nao sincronizado** (local e remoto divergem)
- Alteracoes locais nao commitadas: **SIM — muitos arquivos deletados**, incluindo:
  - .gitignore (deletado, staged)
  - .playwright-mcp/* (2 arquivos deletados)
  - LICENSE, README.md, SECURITY_HEADERS.md, bun.lockb, components.json
  - docs/AGENTS.md, docs/GOVERNANCE/*, docs/api.md, docs/audit-geral.md, docs/audit/prompt/*
- Commits locais nao enviados: Nenhum
- .gitignore: **NAO EXISTE** no working tree (foi deletado). Existe no ultimo commit (HEAD).
- **Atencao:** Delecao em massa de arquivos rastreados, incluindo .gitignore, LICENSE, README.md e documentacao de governanca. Revisar antes de qualquer operacao destrutiva.

### 3.7 hospedamais
- Branch: main
- Commit local: 43e5422e (AGENTS.md)
- Commit remoto: 43e5422e
- Status: Sincronizado
- Alteracoes locais nao commitadas: Nenhuma modificacao, mas **9 arquivos untracked** (relatorios de auditoria: ACCESSIBILITY_AUDIT_REPORT.md, FRONTEND_PATTERNS_CHECKUP_REPORT.md, PRODUCT_CONSISTENCY_CHECK_REPORT.md, SECRETS_AUDIT_REPORT.md, SRE_AUDIT_REPORT.md, UI_FINISH_GATE_REVIEW.md, UX_AUDIT_REPORT_PRODUCAO.md, UX_CHECKUP_REPORT.md)
- Commits locais nao enviados: Nenhum
- .gitignore: Existe, com harding de seguranca (TEST_CREDENTIALS.md, *.zip, .playwright-mcp/, .wrangler/, supabase/.temp/, storage dumps)

### 3.8 MaisClientes-v3.2
- Branch: main
- Commit local: 79c25db4 (feat: implement billing, LGPD, quota enforcement, white-label API, and plans UI)
- Commit remoto: 79c25db4
- Status: Sincronizado
- Alteracoes locais nao commitadas: Nenhuma modificacao, mas **3 itens untracked** (.claude/, origin/, package-lock.json)
- Commits locais nao enviados: Nenhum
- .gitignore: Existe, basico (node_modules, build, dist, .env*, .DS_Store, logs)

### 3.9 paperclip
- Branch: master
- Commit local: 124b2cd0 (fix(server): certify background deadlines for idle tenants (#19001))
- Commit remoto: d1ee25d0
- Status: **Nao sincronizado** (local e remoto divergem)
- Alteracoes locais nao commitadas: Nenhuma
- Commits locais nao enviados: Nao detectado (o repositorio pode estar atras ou adiantado em relacao ao remoto)
- .gitignore: Existe, muito abrangente (monorepo PNPM, node_modules, dist, .env, drizzle, .vite, coverage, editor files, Playwright, Turbo, Vercel, etc.)

### 3.10 Plataforma-Paralegal-Digital
- Branch: main
- Commit local: 60df2018 (docs: consolidar diagnostico integrado e roadmap canonico)
- Commit remoto: 60df2018
- Status: Sincronizado
- Alteracoes locais nao commitadas: **SIM — 1 arquivo modificado** (src/services/legalAnalysisService.ts) + **4 arquivos untracked** (AUDIT_LOCATION.md, AUDIT_REPORT.md, README_AUDIT.md, SUMMARY.md)
- Commits locais nao enviados: Nenhum
- .gitignore: Existe (node_modules, build, dist, .env*, supabase/.temp/, supabase/.branches/)

### 3.11 TakeMaster-v2
- Branch: main
- Commit local: 640f6b0b (Merge: separa Administrador Geral do Administrador de Programa)
- Commit remoto: 640f6b0b
- Status: Sincronizado
- Alteracoes locais nao commitadas: **SIM — 12 arquivos modificados** (index.html, src/App.tsx, src/components/LoginModal.tsx, src/components/Sidebar.tsx, src/domain/types/errors.ts, src/hooks/usePermissions.ts, src/main.tsx, src/server/auth.ts, src/server/persistence.ts, wrangler.jsonc) + **varios untracked** (.claude/, .opencode/sdd/, .playwright-mcp/, docs/MATRIZ_ROLES_DASHBOARDS.md, src/components/LoginForm.tsx, src/components/PublicHome.tsx, src/components/RegisterForm.tsx, supabase/.gitignore, supabase/config.toml)
- Commits locais nao enviados: Nenhum
- .gitignore: Existe (node_modules, build, dist, .wrangler/, .env*, .DS_Store, logs)

---

## 4. Resumo executivo

| Metrica | Valor |
|---------|-------|
| Total de repositorios | 11 |
| Sincronizados (local == remoto) | 6 |
| Nao sincronizados (divergem ou sem comparacao) | 5 |
| Com alteracoes locais nao commitadas | 6 |
| Com arquivos untracked | 5 |
| Com .gitignore ausente/deletado | 1 (EmprestaMais) |
| Com .env ja rastreado no Git | 1 (Corre+) |

---

## 5. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/04-portfolio/RELATORIO_SINCRONIZACAO.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/04-portfolio/RELATORIO_SINCRONIZACAO.md")

---

Nenhum codigo de projeto foi alterado. Nenhum push ou alteracao de branch remota foi executada.