# PADRONIZAÇÃO DOS ARQUIVOS .GITIGNORE — NETTOSCORP

Versao: 1.0
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/04-portfolio/GITIGNORE_PADRONIZACAO.md
Status: REGISTRO INSTITUCIONAL — estado observado e acoes realizadas

---

## 1. Metodo

Cada repositorio Git na estrutura `/home/lg/workspace/NettosCorp/` foi examinado individualmente:
- Verificacao de existencia de `.gitignore`
- Analise do conteudo quando existente
- Identificacao de linguagens, frameworks, ferramentas e ambientes utilizados
- Verificacao de arquivos sensiveis ja rastreados

**Regra de execucao respeitada:** nenhum `.gitignore` existente foi sobrescrito sem analise. Nenhum arquivo foi excluido. Nenhum historico foi removido. Nenhum comando destrutivo foi executado.

---

## 2. Situacao dos .gitignore por repositorio

| # | Projeto | Tecnologia identificada | .gitignore | Acao tomada |
|---|---------|------------------------|------------|-------------|
| 1 | agency-agents | Agentes IA, Node.js, Python | EXISTE (abrangente) | Nenhuma — ja esta completo e adequado |
| 2 | BelezaDigital-v2 | Node.js | EXISTE (basico) | Nenhuma — cobriu dependencias, build, .env, logs |
| 3 | Corre+ | TypeScript, React | EXISTE (modificado no working tree) | Nenhuma sobrescricao — arquivo esta modificado localmente e precisa de revisao pela lideranca |
| 4 | Defesai-AdeusMultas-v2 | TypeScript | EXISTE | Nenhuma — cobriu node_modules, .env*, build, cobertura |
| 5 | DefesaI-Saude-app | Node.js, Wrangler, Supabase | EXISTE | Nenhuma — cobriu node_modules, build, .env*, .wrangler/, relatorios de teste |
| 6 | EmprestaMais | Node.js, Bun, Playwright | NAO EXISTE (deletado no working tree) | Nao foi recriado — a ordem de trabalho proibe sobrescrever ou recriar sem analise; o ultimo commit ainda contem um .gitignore |
| 7 | hospedamais | Node.js, Supabase, Wrangler | EXISTE (com harding de seguranca) | Nenhuma — ja inclui regras de seguranca (TEST_CREDENTIALS.md, *.zip, .playwright-mcp/, storage dumps) |
| 8 | MaisClientes-v3.2 | Node.js | EXISTE (basico) | Nenhuma — cobriu dependencias, build, .env, logs |
| 9 | paperclip | Node.js, PNPM, monorepo | EXISTE (muito abrangente) | Nenhuma — ja cobre node_modules, dist, .env, drizzle, .vite, Playwright, Turbo, Vercel, editor files |
| 10 | Plataforma-Paralegal-Digital | Node.js, Supabase | EXISTE | Nenhuma — cobriu node_modules, build, .env*, supabase/.temp/, supabase/.branches/ |
| 11 | TakeMaster-v2 | TypeScript, React, Supabase, Wrangler | EXISTE | Nenhuma — cobriu node_modules, build, dist, .wrangler/, .env*, logs |

**Resumo:** 10 de 11 repositorios possuem `.gitignore`. Apenas `EmprestaMais` nao possui o arquivo no working tree (foi deletado).

---

## 3. Justificativa tecnica das regras por projeto

### 3.1 agency-agents
- **Node.js/Python:** `node_modules/`, `__pycache__/`, `*.py[cod]`, `venv/`, `.venv` — dependencias instaladas nao devem ser versionadas
- **Logs:** `*.log`, `logs/` — arquivos de log gerados em tempo de execucao
- **Temporarios:** `*.tmp`, `*.temp`, `.cache/` — arquivos temporarios de sistema e aplicacao
- **Build:** `dist/`, `build/`, `*.egg-info/` — artefatos gerados pelo build
- **IDE/OS:** `.vscode/`, `.idea/`, `.DS_Store`, `Thumbs.db` — configuracoes locais de editor e sistema operacional
- **Cobertura de teste:** `coverage/`, `.nyc_output/`, `*.lcov` — relatiorios de cobertura gerados
- **Notas pessoais:** `scratch/`, `notes/`, `TODO.md`, `NOTES.md` — arquivos pessoais que nao fazem parte do codigo
- **Integracoes de agentes:** `integrations/*/agents/`, `integrations/*/skills/` — arquivos gerados por scripts de conversao; somente READMEs e scripts sao commitados
- **Saida do graphify:** `graphify-out/` — output gerado localmente

### 3.2 BelezaDigital-v2
- **Node.js:** `node_modules/`, `build/`, `dist/` — dependencias e artefatos de build
- **Cobertura:** `coverage/` — relatiorios de teste
- **OS/Logs:** `.DS_Store`, `*.log` — arquivos do sistema e log
- **Ambiente:** `.env*` (exceto `.env.example`) — arquivos de ambiente com possiveis segredos; `.env.example` preservado como modelo seguro

### 3.3 Corre+
- **Logs:** `logs/`, `*.log`, `npm-debug.log*`, `yarn-debug.log*`, `pnpm-debug.log*`, `lerna-debug.log*` — logs de execucao e gerenciadores de pacote
- **Dependencias:** `node_modules`, `dist`, `dist-ssr` — dependencias instaladas e build
- **Local:** `*.local` — configuracoes locais
- **Editor:** `.vscode/*` (exceto `extensions.json`), `.idea`, `.DS_Store`, `*.sw?` — configuracoes de editor e sistema operacional
- **Observacao:** o arquivo esta modificado no working tree (23 modificacoes no repo incluem o proprio `.gitignore`). A revisao do conteudo modificado deve ser feita pela lideranca antes de qualquer aprovacao.

### 3.4 Defesai-AdeusMultas-v2
- **Dependencias:** `/node_modules`, `/.pnp`, `.pnp.js` — gerenciadores de pacote
- **Testes:** `/coverage` — relatiorios de cobertura
- **Build:** `/dist`, `/.local` — artefatos de build
- **Seguranca:** `*.pem` — chaves privadas (importante para nao versionar)
- **Ambiente:** `.env`, `.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local` — arquivos de ambiente com segredos
- **Vercel:** `.vercel` — configuracao local da plataforma
- **TypeScript:** `*.tsbuildinfo` — informacoes de build do TypeScript
- **Backups:** `*.zip` — arquivos compactados de backup

### 3.5 DefesaI-Saude-app
- **Node.js/Wrangler:** `node_modules/`, `build/`, `dist/`, `.wrangler/` — dependencias, build e configuracao local da Cloudflare
- **Cobertura/testes:** `coverage/`, `test-results/`, `playwright-report/` — relatiorios de teste e cobertura
- **Logs/OS:** `.DS_Store`, `*.log`
- **Ambiente:** `.env*` (exceto `.env.example`) — arquivos de ambiente com segredos; `.env.example` preservado

### 3.6 EmprestaMais
- **Situacao:** `.gitignore` deletado no working tree. O ultimo commit (HEAD) ainda contem um `.gitignore` com regras basicas de logs e dependencias.
- **Acao:** nenhum arquivo foi recriado ou sobrescrito, respeitando a ordem de trabalho. A lideranca deve avaliar se restaura o `.gitignore` do HEAD ou cria um novo.

### 3.7 hospedamais
- **Logs/Dependencias:** `logs/`, `*.log`, `node_modules`, `dist`, `dist-ssr` — padrao Node.js
- **Editor:** `.vscode/*` (exceto `extensions.json`), `.idea`, `.DS_Store`
- **Ambiente:** `.env`, `.env.*` — arquivos de ambiente com segredos
- **Backup/Banco:** `*.backup`, `*.sql` (exceto `supabase/migrations/*.sql`), `*.dump` — backups e dumps de banco; migrations SQL do Supabase sao preservadas (essenciais ao build/execucao)
- **Seguranca (harding 2026-09-29):** `TEST_CREDENTIALS.md`, `*.zip`, `*.backup.gz`, `wlduufwibywetlmdmheg.storage.zip`, `.playwright-mcp/`, `.wrangler/`, `supabase/.temp/` — credenciais de teste, arquivos compactados, storage temporario
- **Dumps comprometidos:** `wlduufwibywetlmdmheg.storage/`, `temp_test_assets/` — dumps de storage e assets de teste commitados por engano anteriormente

### 3.8 MaisClientes-v3.2
- **Node.js:** `node_modules/`, `build/`, `dist/` — dependencias e build
- **Cobertura:** `coverage/` — relatiorios de teste
- **OS/Logs:** `.DS_Store`, `*.log`
- **Ambiente:** `.env*` (exceto `.env.example`) — arquivos de ambiente com segredos; `.env.example` preservado

### 3.9 paperclip (monorepo PNPM)
- **Dependencias:** `node_modules`, `**/node_modules`, `.pnpm-store/` — dependencias em monorepo
- **Build:** `dist/`, `dist-preview/`, `server/ui-dist/`, `server/dist-runtime/`, `server/src/**/*.js`, `server/src/**/*.d.ts` — artefatos de build em multiple pacotes
- **Storybook:** `ui/storybook-static/`, `ui/storybook/generated/` — artefatos de documentacao visual
- **Banco:** `drizzle/meta/`, `maps/generated/` — metadados do ORM e mapas gerados
- **Ambiente:** `.env`, `*.tsbuildinfo`, `.env.local` — arquivos de ambiente e build do TypeScript
- **Cobertura:** `coverage/`, `diagnostics/` — relatiorios de teste
- **OS/Editor:** `.DS_Store`, `._*`, `.vscode/`, `/.idea/`, `/.agents/` — arquivos do sistema e configuracoes de editor
- **Playwright:** `tests/e2e/test-results/`, `tests/e2e/playwright-report/` e varios caminhos de resultado de teste
- **Scripts temporarios:** `check-*.mjs`, `seed-*.mjs`, `new-agent*.json`, `newcompany.json` (com excecoes específicas para scripts do GitHub)
- **Vercel/Turbo:** `.vercel/`, `.turbo/` — configuracao e cache de CI/CD
- **Agentes locais:** `/.claude/worktrees/`, `.herenow`, `.superset/`, `.superpowers/` — estado local de ferramentas de agente

### 3.10 Plataforma-Paralegal-Digital
- **Node.js:** `node_modules/`, `build/`, `dist/` — dependencias e build
- **Cobertura:** `coverage/` — relatiorios de teste
- **OS/Logs:** `.DS_Store`, `*.log`
- **Ambiente:** `.env*` (exceto `.env.example`, `.env.development.example`, `.env.production.example`) — arquivos de ambiente com segredos; exemplos preservados
- **Supabase:** `supabase/.temp/`, `supabase/.branches/` — branches e temporarios locais do Supabase

### 3.11 TakeMaster-v2
- **Node.js/Wrangler:** `node_modules/`, `build/`, `dist/`, `.wrangler/` — dependencias, build e configuracao local da Cloudflare
- **Profiling:** `worker-startup.cpuprofile` — perfil de CPU do worker
- **OS/Logs:** `.DS_Store`, `*.log`
- **Ambiente:** `.env*` (exceto `.env.example`) — arquivos de ambiente com segredos; `.env.example` preservado

---

## 4. Regras comuns aplicadas (todos os projetos)

Quando aplicavel, os seguintes tipos de arquivo foram identificados como candidatos a ignoracao (ja cobertos pelos .gitignore existentes):

| Categoria | Exemplos | Motivo |
|-----------|----------|--------|
| Dependencias | node_modules/, **/node_modules, .pnpm-store/ | Instaladas via gerenciador de pacote, nao sao codigo-fonte |
| Build/artefatos | dist/, build/, *.js (gerado), *.tsbuildinfo | Gerados durante o build, nao devem ser versionados |
| Temporarios/cache | *.tmp, *.temp, .cache/, .vite/, .turbo/ | Gerados em tempo de execucao ou CI |
| Logs | *.log, logs/, npm-debug.log* | Gerados durante a execucao |
| Ambiente/segredos | .env, .env.local, *.pem, TEST_CREDENTIALS.md | Contem credenciais, tokens e chaves privadas |
| IDE/OS | .vscode/, .idea/, .DS_Store, Thumbs.db, *.sw? | Configuracoes locais, nao fazem parte do projeto |
| Testes/cobertura | coverage/, test-results/, playwright-report/ | Relatorios gerados, nao codigo-fonte |
| Backups | *.zip, *.backup, *.dump | Arquivos compactados e dumps, nao sao fonte |

**Nao foram ignorados (preservados):** codigo-fonte, testes, documentacao, configuracoes necessarias ao build, migrations SQL (`supabase/migrations/*.sql` em hospedamais), arquivos `.env.example` como modelos seguros.

---

## 5. Acoes nao realizadas (por restricao da ordem de trabalho)

- Nenhum `.gitignore` existente foi sobrescrito.
- Nenhum `.gitignore` foi criado para `EmprestaMais` (arquivo foi deletado; recriacao exigiria analise da lideranca).
- Nenhum arquivo ja rastreado foi removido do Git (ex: `.env` em Corre+ continua rastreado; `.gitignore` em EmprestaMais continua no historico).
- Nenhum push ou alteracao de branch remota foi executada.

---

## 6. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/04-portfolio/GITIGNORE_PADRONIZACAO.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/04-portfolio/GITIGNORE_PADRONIZACAO.md")

---

Nenhum codigo de projeto foi alterado. Nenhum push ou alteracao de branch remota foi executada.