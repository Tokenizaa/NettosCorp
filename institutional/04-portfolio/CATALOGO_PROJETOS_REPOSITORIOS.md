# CATÁLOGO DE PROJETOS E REPOSITÓRIOS GITHUB — NETTOSCORP

Versao: 1.0
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/04-portfolio/CATALOGO_PROJETOS_REPOSITORIOS.md
Status: REGISTRO INSTITUCIONAL — inventário de estado atual, sujeito a atualizacao

---

## 1. Metodo de identificacao

O inventario foi obtido por inspecao direta do diretorio `/home/lg/workspace/NettosCorp/`, verificando a existencia de pasta `.git` em cada subdiretorio e coletando informacoes via comandos `git remote`, `git branch`, `git log` e `git status`.

Nenhum repositorio duplicado foi criado. Todos os projetos ja possuem repositorios remotos associados.

---

## 2. Catalogo de repositorios

| # | Projeto | Caminho local | URL do repositorio remoto | Branch principal | Remote configurado |
|---|---------|---------------|---------------------------|------------------|--------------------|
| 1 | agency-agents | /home/lg/workspace/NettosCorp/agency-agents/ | https://x-access-token:ghp_do...ents | main | Sim (origin) |
| 2 | BelezaDigital-v2 | /home/lg/workspace/NettosCorp/BelezaDigital-v2/ | https://x-access-token:ghp_do....git | master | Sim (origin) |
| 3 | Corre+ | /home/lg/workspace/NettosCorp/Corre+/ | https://x-access-token:ghp_do....git | main | Sim (origin) |
| 4 | Defesai-AdeusMultas-v2 | /home/lg/workspace/NettosCorp/Defesai-AdeusMultas-v2/ | https://x-access-token:ghp_do....git | main | Sim (origin) |
| 5 | DefesaI-Saude-app | /home/lg/workspace/NettosCorp/DefesaI-Saude-app/ | https://x-access-token:ghp_do....git | main | Sim (origin) |
| 6 | EmprestaMais | /home/lg/workspace/NettosCorp/EmprestaMais/ | https://x-access-token:ghp_do....git | main | Sim (origin) |
| 7 | hospedamais | /home/lg/workspace/NettosCorp/hospedamais/ | https://x-access-token:ghp_do...mais | main | Sim (origin) |
| 8 | MaisClientes-v3.2 | /home/lg/workspace/NettosCorp/MaisClientes-v3.2/ | https://x-access-token:ghp_do...v3.2 | main | Sim (origin) |
| 9 | paperclip | /home/lg/workspace/NettosCorp/paperclip/ | https://x-access-token:ghp_do....git | master | Sim (origin) |
| 10 | Plataforma-Paralegal-Digital | /home/lg/workspace/NettosCorp/Plataforma-Paralegal-Digital/ | https://x-access-token:ghp_do...ital | main | Sim (origin) |
| 11 | TakeMaster-v2 | /home/lg/workspace/NettosCorp/TakeMaster-v2/ | https://x-access-token:ghp_do...r-v2 | main | Sim (origin) |

**Observacao:** As URLs remotas contem tokens de acesso (x-access-token) e foram parcialmente mascaradas neste relatorio por seguranca. Os tokens completos estao nos arquivos de configuracao `.git/config` de cada repositorio e nao devem ser compartilhados.

---

## 3. Correspondencia local/remoto

Todos os 11 repositorios possuem remote `origin` configurado e branch principal definida (10 em `main`, 1 em `master` para `paperclip`, 1 em `master` para `BelezaDigital-v2`).

Nenhum projeto esta sem correspondencia clara entre diretorio local e repositorio remoto. Todos os 11 repositorios locais possuem remote associado.

Nao foram identificados projetos sem repositorio remoto.

---

## 4. Tecnologias identificadas por projeto (preliminar)

| Projeto | Indicios de tecnologia |
|---------|------------------------|
| agency-agents | Node.js, Python, integracao com agentes de IA (Claramente um repositorio de agentes) |
| BelezaDigital-v2 | Node.js (node_modules, build, dist, .env) |
| Corre+ | TypeScript, React (src/App.tsx, src/components/*, package.json, eslint.config.js, postcss.config.js, index.html) |
| Defesai-AdeusMultas-v2 | TypeScript (src/core/**, .ts files, package.json) |
| DefesaI-Saude-app | Node.js, Wrangler/Cloudflare (.wrangler/ in .gitignore), Supabase |
| EmprestaMais | Node.js, Bun (bun.lockb), Playwright, docs de governanca |
| hospedamais | Node.js, Supabase (.sql migrations referenced in .gitignore), Wrangler |
| MaisClientes-v3.2 | Node.js (package-lock.json) |
| paperclip | Node.js, PNPM, monorepo (packages/, server/, ui/, cli/), drizzle ORM |
| Plataforma-Paralegal-Digital | Node.js, Supabase (supabase/.temp/ in .gitignore) |
| TakeMaster-v2 | TypeScript, React, Supabase (supabase/ directory), Wrangler (wrangler.jsonc) |

---

## 5. Relacao com o roadmap corporativo

Este catalogo suporta a Fase 4 do Roadmap Corporativo (Reconhecimento do portifolio existente), fornecendo o ponto de partida para catalogacao dos projetos existentes que serao incorporados a organizacao corporativa.

---

## 6. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/04-portfolio/CATALOGO_PROJETOS_REPOSITORIOS.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/04-portfolio/CATALOGO_PROJETOS_REPOSITORIOS.md")

---

Nenhum codigo de projeto foi alterado. Nenhum push ou alteracao de branch remota foi executada.