# HANDOFF — Implantação Render (Paperclip + Hermes) — Plano Grátuito

**Data:** 2026-11-15
**Agente:** Hermes (NettosCorp)
**Autoridade:** Netto Farias (fundador) — decisões técnicas rotineiras são autônomas
**Estado:** PARTIAL — cliente e blueprint prontos; deploy no Render NÃO executado (requer ação manual, sem custos)

---

## 1. O que foi entregue (arquivos)

| Arquivo | Descrição | Estado |
|---------|-----------|--------|
| `render.yaml` (raiz) | Blueprint do Render: 1 Web Service `nettoscorp-paperclip-hermes`, plan `free`, build `pnpm --filter @paperclipai/server build`, start `scripts/render-start.sh`, health `/api/liveness` | ✅ Criado |
| `paperclip/scripts/render-start.sh` | Start contendo Paperclip (`node server/dist/index.js`) + Hermes (instalação best-effort + `hermes serve`) | ✅ Criado, sintaxe `bash -n` OK |
| `scripts/render-client.mts` | Cliente REST seguro do Render (`fetch` nativo, `RENDER_API_KEY` só de `process.env`, chave nunca impressa) | ✅ Criado, `tsc --noEmit` sem erros (após `help: async` e typedefs de `process`) |
| `.github/workflows/keepalive.yml` | GitHub Actions: `GET /api/liveness` a cada 10 min (cron `*/10 * * * *`) | ✅ Criado |
| `paperclip/render.yaml` | (removido — o blueprint ficou na raiz) | ✅ Corrigido |

---

## 2. O que foi verificado (evidências reais)

Cliente REST executado contra a API real (`https://api.render.com/v1`) com `RENDER_API_KEY` no ambiente:

| Endpoint | Status | Resultado |
|----------|--------|-----------|
| `GET /v1/owners` | ✅ | `tea-dbsrjdei0phs73duvr90` — NettosCorp (type: team) |
| `GET /v1/owners/{id}` | ✅ | Detalhes do workspace |
| `GET /v1/services` | ✅ | `[]` — workspace vazio (zero recursos, zero custo) |
| `GET /v1/projects` | ✅ | `[]` |
| `GET /v1/build-sources` | ✅ | `[]` |
| `GET /v1/blueprints` | ✅ | `[]` |
| `GET /v1/webhooks` | ✅ | `[]` |
| `GET /v1/disks` | ✅ | `[]` |
| `GET /v1/postgres` | ✅ | `[]` |
| `GET /v1/keyvalue` | ✅ | `[]` |
| `GET /v1/members/{ownerId}` | ✅ | 1 admin (`nettoscorp@gmail.com`) |
| `GET /v1/logs` | ⚠️ | 400 da própria API — requer filtros de recurso (auth OK) |
| `GET /v1/owners/{id}/audit-logs` | ⚠️ | 400 — `audit logs not available for this plan` |
| `GET /v1/owners/{id}/notification-settings` | ⚠️ | 404 (endpoint não exposto neste plano) |
| `GET /v1/health` | ✅ | `GET /api/health`, `/api/liveness`, `/api/ready` existentes no Paperclip |

**Observação crítica:** `RENDER_API_KEY` nunca foi impressa em logs, mensagens ou saída do comando. O cliente redage a chave em erros (defesa em profundidade).

---

## 3. O que ainda NÃO foi feito

| # | Tarefa | Detalhe | Depende de |
|---|--------|---------|------------|
| 1 | **Deploy no Render** | `render.yaml` pronto, mas o Web Service não foi criado | Fundador (Dashboard Render: New > Web Service > conectar `Tokenizaa/NettosCorp`, rootDir `paperclip`, blueprint `render.yaml`) |
| 2 | **Secrets no Render** | `DATABASE_URL` (Supabase), `BETTER_AUTH_SECRET`, `PAPERCLIP_TOOL_ACTION_SIGNING_SECRET`, `NVIDIA_API_KEY`, `RENDER_API_KEY` | Fundador (Dashboard Render: Environment > Secrets) |
| 3 | **Migrations Paperclip** | `PAPERCLIP_MIGRATION_AUTO_APPLY=true` está no `render.yaml`; o Paperclip aplica no startup | Nenhum (automático no deploy) |
| 4 | **Documentação de limitação** | `docs/ops/RENDER_LIMITACOES_PLANO_GRATUITO.md` | Nenhum (pode ser criado agora) |
| 5 | **Keepalive ativado** | GitHub Actions existe, mas o token/URL precisa ser configurado: `PAPERCLIP_HEALTH_URL` (repo secret) | Fundador |
| 6 | **Monitoramento** | Render dashboard tem métricas básicas (CPU, memória, requests); dashboard do Supabase para DB | Nenhum (disponível na UI) |
| 7 | **Hermes como serviço** | `hermes serve` no start é best-effort; se falhar, o container continua com Paperclip | Fundador (ver LIMITACOES) |

---

## 4. Limitantes do plano gratuito (a ser documentado)

1. **Custa US$ 0** — nenhum plano, disco ou serviço pago. 750 instance-hours/mês (1 serviço rodando 24/7 custa ~720–744h — cabe no limite).
2. **Spin-down após 15 min** de ociosidade → keepalive a cada 10 min (GitHub Actions) impede o fallback.
3. **Filesystem efêmero** → Paperclip não pode usar SQLite/disco local; usa Supabase PostgreSQL (já configurado: `pakzvwpldlkvvdnqgdgq`, sem expiração de 30 dias).
4. **1 Postgres free por workspace, expira em 30 dias** → NÃO usar. Usar Supabase.
5. **Key Value free é in-memory** → não usar para state persistente.
6. **Hermes não é um web service** → roda como processo background no mesmo container; estado `~/.hermes/` é efêmero no Render. Recomendação: não confiar em state persistente do Hermes no plano free.
7. **750 instance-hours** → se o keepalive for executado muito frequentemente, o container pode ficar ligado; gestão de standby possível via webhooks de deploy.

---

## 5. Como continuar (próximos passos)

### Passo 1 — Deploy no Render (fundador, Dashboard)
1. Acessar Render Dashboard → Workspaces → `tea-dbsrjdei0phs73duvr90` → **New** → **Web Service**
2. Conectar repositório `https://github.com/Tokenizaa/NettosCorp.git` (branch `master`)
3. Configurar:
   - Root directory: `paperclip`
   - Build command: `pnpm install && pnpm --filter @paperclipai/server build`
   - Start command: `bash scripts/render-start.sh`
   - Health check path: `/api/liveness`
   - Plan: **Free**
4. Criar secrets (Dashboard → Environment → Secrets):
   - `DATABASE_URL` — connection string do Supabase (sem pooler, usá-lo para migration; ou `DATABASE_MIGRATION_URL`)
   - `BETTER_AUTH_SECRET` — gerar um segredo aleatório
   - `PAPERCLIP_TOOL_ACTION_SIGNING_SECRET` — gerar um segredo aleatório
   - `NVIDIA_API_KEY` — chave da API do modelo
   - `RENDER_API_KEY` — chave do Render (opcional; usado apenas pelo cliente REST)

### Passo 2 — Configurar keepalive
1. No GitHub repo: Settings → Secrets and variables → Actions → New repository secret
2. Nome: `PAPERCLIP_HEALTH_URL`
3. Valor: `https://nettoscorp-paperclip-hermes.onrender.com/api/liveness` (URL do Render após o deploy)

### Passo 3 — Configurar o Supabase (se ainda não estiver)
- Projeto: `pakzvwpldlkvvdnqgdgq`
- Connection string (sem pooler): `postgres://postgres.[PROJECT_REF]@aws-0-[REGION].pooler.supabase.com:5432/postgres`
- Exportar para variável de ambiente `DATABASE_URL` no Render.

### Passo 4 — Verificar o deploy
- Após o deploy, aguardar build e deploy.
- Testar: `curl https://nettoscorp-paperclip-hermes.onrender.com/api/liveness`
- Verificar logs no dashboard e métricas.

---

## 6. O que NÃO foi executado (como estava decidido)

- ⚠️ Deploy do Web Service no Render — NÃO foi criado/ativado sem autorização explícita do fundador (regras de segurança: deployments e secrets são sob autoria do fundador).
- ⚠️ Nenhum recurso custoso foi criado (sem Postgres Render free, sem disk, sem plano pago).
- ⚠️ Configuração de secrets não foi salva no repositório (nunca expor credenciais).
- ⚠️ Dados locais do ambiente do usuário não foram copiados/sobrescritos.

---

## 7. Como reiniciar quando a sessão estiver disponível

1. Ler esse handoff.
2. Rodar `git status` para conferir o estado dos arquivos.
3. Verificar se os arquivos abaixo ainda existem:
   - `render.yaml` (raiz)
   - `paperclip/scripts/render-start.sh`
   - `scripts/render-client.mts`
   - `.github/workflows/keepalive.yml`
4. Executar `paperclip/node_modules/typescript/bin/tsc --noEmit --strict --target ES2022 --module NodeNext --moduleResolution NodeNext --skipLibCheck --ignoreConfig scripts/render-client.mts` para confirmar zero erros.
5. Se necessário, re-executar `node --experimental-strip-types scripts/render-client.mts owners` para verificar a API REST.
6. Documentar novamente se houver mudanças.

---

## 8. Modelo usado

`nvidia/nemotron-3.5-super-vl-120b-a12b` (por meio do provider NVIDIA via NVIDIA API). — **Aviso de segurança**: verificar se o modelo continua disponível.

---

## 9. Contato de emergência

- Fundador: Netto Farias — decisão de autorização para deploy, secrets, persistência e portas.
- Documentação do Render: https://render.com/docs
- Documentação da API: https://api-docs.render.com/
- Supabase: https://pakzvwpldlkvvdnqgdgq.supabase.co
