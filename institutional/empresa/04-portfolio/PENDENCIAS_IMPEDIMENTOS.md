# PENDÊNCIAS E IMPEDIMENTOS — NETTOSCORP

Versao: 1.0
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/04-portfolio/PENDENCIAS_IMPEDIMENTOS.md
Status: REGISTRO INSTITUCIONAL — itens requerendo atencao da lideranca

---

## 1. Pendências críticas (seguranca)

| ID | Projeto | Descricao | Impacto | Acao recomendada |
|----|---------|-----------|---------|------------------|
| P-001 | Corre+ | Arquivo `.env` ja rastreado no Git contendo `VITE_SUPABASE_ACESS_TOKEN`. Credencial exposta no historico. | Alto — exposicao de credencial de banco de dados | Rotular o token imediatamente. Avaliar remocao do `.env` do historico (operacao destrutiva, fora do escopo desta ordem). |
| P-002 | EmprestaMais | `.gitignore` deletado no working tree. Arquivos previamente ignorados podem ser acidentalmente versionados. | Medio — risco de versionamento acidental de dependencias, builds e segredos | Restaurar `.gitignore` do HEAD ou criar novo adequado. |
| P-003 | EmprestaMais | Delecao em massa de arquivos rastreados (LICENSE, README.md, SECURITY_HEADERS.md, docs/*, .gitignore, etc.) no working tree. | Alto — perda de rastreabilidade de documentos importantes | Revisar se a delecao e intencional. Restaurar arquivos se for acidental. |

---

## 2. Pendências de sincronização

| ID | Projeto | Descricao | Impacto | Acao recomendada |
|----|---------|-----------|---------|------------------|
| P-004 | agency-agents | Commit local (4e3ac3ca) diverge do remoto (b859c515). | Medio — local pode estar atras ou adiantado do remoto | Verificar direcao da divergencia com `git log` e `git ls-remote`. |
| P-005 | BelezaDigital-v2 | Nao foi possivel obter commit remoto (sem tracking branch ou erro de acesso). | Medio — impossivel verificar sincronizacao | Verificar configuracao de remote e acesso ao repositorio. |
| P-006 | Corre+ | Commit local (05308555) diverge do remoto (db19b5a3). 23 arquivos modificados localmente (incluindo .env e .gitignore). | Alto — divergencia + modificacoes locais nao commitadas | Revisar modificacoes locais antes de qualquer sincronizacao. |
| P-007 | EmprestaMais | Commit local (9d59b582) diverge do remoto (5901ef5c). | Medio — local e remoto divergem | Verificar direcao da divergencia. |
| P-008 | paperclip | Commit local (124b2cd0) diverge do remoto (d1ee25d0). | Medio — local e remoto divergem | Verificar direcao da divergencia. |

---

## 3. Pendências de documentação (.gitignore)

| ID | Projeto | Descricao | Impacto | Acao recomendada |
|----|---------|-----------|---------|------------------|
| P-009 | EmprestaMais | `.gitignore` nao existe no working tree (deletado). | Medio — sem protecao contra versionamento de dependencias e segredos | Criar ou restaurar `.gitignore` adequado a Node.js/Bun/Playwright. |
| P-010 | Corre+ | `.gitignore` esta modificado localmente (entre os 23 arquivos alterados). | Baixo/Medio — revisao necessaria para confirmar se as modificacoes sao intencionais | Revisar o conteúdo modificado do `.gitignore`. |

---

## 4. Pendências de arquivos untracked (revisao necessaria)

| ID | Projeto | Arquivos untracked | Observacao |
|----|---------|-------------------|------------|
| P-011 | hospedamais | 9 relatorios de auditoria (ACCESSIBILITY_AUDIT_REPORT.md, SRE_AUDIT_REPORT.md, SECRETS_AUDIT_REPORT.md, etc.) | Podem conter informacoes sensiveis de seguranca. Revisar antes de adicionar ao Git. |
| P-012 | Plataforma-Paralegal-Digital | AUDIT_LOCATION.md, AUDIT_REPORT.md, README_AUDIT.md, SUMMARY.md | Relatorios de auditoria. Revisar antes de adicionar ao Git. |
| P-013 | TakeMaster-v2 | .claude/, .opencode/sdd/, .playwright-mcp/, supabase/config.toml, docs/MATRIZ_ROLES_DASHBOARDS.md, componentes novos | Configuracoes locais de ferramentas e possiveis segredos do Supabase. Revisar antes de adicionar ao Git. |
| P-014 | MaisClientes-v3.2 | .claude/, origin/, package-lock.json | `.claude/` e `origin/` podem ser configuracoes locais. Revisar. |

---

## 5. Impedimentos identificados

| ID | Descricao | Motivo | Impacto nas auditorias |
|----|-----------|--------|------------------------|
| I-001 | Nao foi possivel obter commit remoto de BelezaDigital-v2 | Erro de acesso ou falta de tracking branch | Nao e possivel confirmar se o repositorio local esta sincronizado com o remoto |
| I-002 | Nao e possivel remover `.env` rastreado do historico do Corre+ | Ordem de trabalho proibe comandos destrutivos (`git filter-branch`, `git filter-repo`) | Credencial permanece exposta no historico ate que a lideranca autorize operacao destrutiva |
| I-002 | Nao e possivel restaurar arquivos deletados do EmprestaMais | Ordem de trabalho proibe comandos que alterem o working tree de forma destrutiva | Arquivos importantes (LICENSE, README.md, docs) permanecem deletados no working tree ate aprovacao |

---

## 6. Itens para aprovacao da lideranca

1. Rotulacao do `VITE_SUPABASE_ACESS_TOKEN` exposto em Corre+.
2. Decisao sobre remocao de `.env` do historico do Git em Corre+ (operacao destrutiva).
3. Restauracao ou recriacao do `.gitignore` em EmprestaMais.
4. Restauracao dos arquivos deletados em EmprestaMais (se a delecao for acidental).
5. Direcao da divergencia local/remoto em agency-agents, Corre+, EmprestaMais e paperclip.
6. Inclusao ou exclusao dos arquivos untracked listados em P-011 a P-014.

---

## 7. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/04-portfolio/PENDENCIAS_IMPEDIMENTOS.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/04-portfolio/PENDENCIAS_IMPEDIMENTOS.md")

---

Nenhum codigo de projeto foi alterado. Nenhum push ou alteracao de branch remota foi executada.