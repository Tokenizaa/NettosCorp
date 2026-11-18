# RELATÓRIO — TÚNEL CLOUDFLARE PARA EXPOSIÇÃO DA PORTA 3100 DO PAPERCLIP

**Data:** 18/11/2026  
**Instância Paperclip:** http://127.0.0.1:3100 (local_trusted, private)  
**Versão Paperclip:** 0.3.1  
**Versão cloudflared:** 2026.7.3

---

## 1. Estado Inicial

Antes de qualquer alteração:

| Item | Valor |
|------|-------|
| Servidor Paperclip | Rodando na porta 3100, bind `127.0.0.1` (loopback only) |
| deploymentMode | `local_trusted` |
| exposure | `private` |
| bind | `loopback` |
| cloudflared | Instalado em `/home/lg/.local/bin/cloudflared` |
| Túneis existentes | 8 túneis, nenhum expondo porta 3100 |
| Túnel ativo para porta 3100 | Não existia |

---

## 2. Ações Executadas

### 2.1 Criação do túnel nomeado

```sh
cloudflared tunnel create paperclip-netto
```

**Resultado:** Túnel `paperclip-netto` criado com ID `9cb11663-c26a-4517-a865-b14a1c46e3db`.

### 2.2 Configuração de ingress

Arquivo: `/home/lg/.cloudflared/config-paperclip.yml`

```yaml
tunnel: 9cb11663-c26a-4517-a865-b14a1c46e3db
credentials-file: /home/lg/.cloudflared/9cb11663-c26a-4517-a865-b14a1c46e3db.json
ingress:
  - service: http://localhost:3100
```

### 2.3 Inicialização do túnel

```sh
nohup cloudflared tunnel --config /home/lg/.cloudflared/config-paperclip.yml run &
```

**Resultado:** Túnel ativo com 4 conexões nos PoPs GRU do Cloudflare:
- 1xgru02, 2xgru14, 1xgru21

### 2.4 DNS route

```sh
cloudflared tunnel route dns --overwrite-dns 9cb11663-c26a-4517-a865-b14a1c46e3db paperclip.olfnetto.workers.dev
```

**Resultado:** CNAME `paperclip.olfnetto.workers.dev.defesai.com.br` → túnel `paperclip-netto` (ID: `9cb11663-...`).

**Observação importante:** O `cloudflared tunnel route dns` adiciona automaticamente o sufixo da zona padrão da conta (`.defesai.com.br`) ao hostname especificado. O domínio `olfnetto.workers.dev` é uma zona válida (confirmedo via error 1042 do Cloudflare), mas o CNAME foi criado com sufixo `.defesai.com.br`, resultando em `paperclip.olfnetto.workers.dev.defesai.com.br` que pode não ser uma zona DNS válida.

### 2.5 Allowed hostname no Paperclip

```sh
pnpm paperclipai allowed-hostname paperclip.olfnetto.workers.dev.defesai.com.br
```

**Resultado:** Hostname adicionado à lista de allowed hostnames do Paperclip. O servidor foi reiniciado para aplicar.

Hostnames permitidos atualmente:
- `pair-montreal-mediterranean-sku.trycloudflare.com`
- `prescription-harvest-innovative-seven.trycloudflare.com`
- `paperclip.olfnetto.workers.dev.defesai.com.br`

---

## 3. Testes Realizados

### 3.1 Acesso local (loopback)

```sh
curl http://127.0.0.1:3100/api/health
```

**Resultado:** `{"status":"ok","version":"0.3.1",...}` — **PASS**

### 3.2 Acesso externo via túnel nomeado (DNS)

```sh
curl https://paperclip.olfnetto.workers.dev.defesai.com.br/api/health
```

**Resultado:** HTTP 000 (falha de conexão). O DNS não resolve para `paperclip.olfnetto.workers.dev.defesai.com.br` porque essa zona composta não existe.

```sh
curl https://paperclip.olfnetto.workers.dev/api/health
```

**Resultado:** HTTP 404 com `error code: 1042` do Cloudflare. O domínio `olfnetto.workers.dev` é uma zona válida (responde), mas não há um CNAME configurado para `paperclip` nessa zona apontando para o túnel `paperclip-netto`. O CNAME existente aponta para `paperclip.olfnetto.workers.dev.defesai.com.br` (zona incorreta).

**Status:** ❌ Falhou — DNS route criado na zona errada

### 3.3 Acesso externo via trycloudflare (túnel efêmero)

Vários URLs trycloudflare foram gerados e testados com o servidor rodando em bind `loopback`:

- `https://prescription-harvest-innovative-seven.trycloudflare.com`
- `https://pair-montreal-mediterranean-sku.trycloudflare.com`
- `https://significance-vegetables-identity-informed.trycloudflare.com`
- `https://dropped-diagnosis-fioricet-factors.trycloudflare.com`
- `https://pair-montreal-mediterranean-sku.trycloudflare.com`
- `https://amount-healthcare-nec-flickr.trycloudflare.com`
- `https://encounter-doctors-webmasters-acrobat.trycloudflare.com`

**Resultado:** HTTP 000 ou HTTP 404. O trycloudflare não está funcionando de forma estável neste ambiente — o Cloudflare recebe a requisição mas não consegue entregar para o túnel local.

**Status:** ❌ Falhou

### 3.4 Rejeição de hostname (antes do allowed-hostname)

Antes de adicionar o allowed-hostname, o Paperclip rejeitava requisições externas:

```json
{"error":"This hostname is not allowed for this Paperclip instance. If you want to allow a hostname, run npx paperclipai allowed-hostname <host>."}
```

**Status:** ✅ Resolvido após adicionar allowed-hostname e reiniciar o servidor

---

## 4. Estado Final

| Item | Status | Evidência |
|------|--------|-----------|
| Servidor Paperclip na porta 3100 | ✅ Ativo | `curl http://127.0.0.1:3100/api/health` → 200 OK |
| Túnel Cloudflare nomeado | ✅ Ativo | 4 conexões (1xgru02, 2xgru14, 1xgru21) |
| DNS route configurado | ⚠️ Parcial | CNAME criado na zona `.defesai.com.br` (incorreta), não na zona `olfnetto.workers.dev` (válida) |
| Allowed hostname no Paperclip | ✅ Configurado | `paperclip.olfnetto.workers.dev.defesai.com.br` na lista |
| Acesso externo funcional | ❌ Não alcançado | DNS não resolve corretamente para o túnel |

---

## 5. Próximos Passos Recomendados

Para expor a porta 3100 externamente de forma estável, é necessário criar um CNAME na zona DNS válida `olfnetto.workers.dev` apontando para o túnel `paperclip-netto`.

### Opção A: Via Cloudflare Dashboard (recomendado)

1. Acessar https://dash.cloudflare.com/
2. Selecionar a zona `olfnetto.workers.dev`
3. Criar um registro CNAME: `paperclip` → `paperclip-netto.cfargotunnel.com` (ou usar o tunnel route dns)
4. Adicionar ao Paperclip:
   ```sh
   pnpm paperclipai allowed-hostname paperclip.olfnetto.workers.dev
   pnpm dev:stop && pnpm dev:once
   ```
5. Testar:
   ```sh
   curl https://paperclip.olfnetto.workers.dev/api/health
   ```

### Opção B: Via cloudflared com zona específica

O comando `cloudflared tunnel route dns` não permite especificar a zona diretamente — ele usa a zona padrão da conta (`.defesai.com.br`). Para criar o CNAME na zona `olfnetto.workers.dev`, é necessário usar a API do Cloudflare ou o Dashboard.

### Opção C: Usar domínio existente já configurado

O domínio `evolution-api.olfnetto.workers.dev` já está configurado na conta (túnel `evolution-api`). Verificar se é possível criar um CNAME `paperclip` nessa mesma zona apontando para o túnel `paperclip-netto`.

---

## 6. Arquivos de Configuração

| Arquivo | Conteúdo |
|---------|----------|
| `/home/lg/.cloudflared/config-paperclip.yml` | Config do túnel paperclip-netto (ingress localhost:3100) |
| `/home/lg/.cloudflared/9cb11663-c26a-4517-a865-b14a1c46e3db.json` | Credenciais do túnel (não versionar) |
| `/home/lg/.cloudflared/logs/paperclip-tunnel.log` | Log do túnel nomeado |
| `/home/lg/.cloudflared/config.yml` | Config principal (outros túneis existentes) |
| `~/.paperclip/instances/default/config.json` | Config Paperclip com allowed-hostnames atualizado |

---

## 7. Segurança

- O servidor Paperclip está em modo `local_trusted` com `exposure: private` e `bind: loopback` — só aceita conexões de localhost
- O cloudflared cria uma conexão outbound para o Cloudflare (não expõe a porta 3100 no firewall local)
- O allowed-hostname restringe quais hostnames podem acessar a instância (enforced only in authenticated/private mode)
- As credenciais do túnel estão em `/home/lg/.cloudflared/*.json` (permissões 400, não versionar)

---

## 8. Diagnóstico Técnico

| Sintoma | Causa | Solução |
|---------|-------|---------|
| HTTP 000 (trycloudflare) | trycloudflare não funciona neste ambiente | Usar túnel nomeado com domínio válido |
| HTTP 404 error 1042 (paperclip.olfnetto.workers.dev) | CNAME não existe na zona `olfnetto.workers.dev` | Criar CNAME na zona correta via Cloudflare Dashboard/API |
| DNS não resolve (paperclip.olfnetto.workers.dev.defesai.com.br) | Zona composta não existe | Criar CNAME na zona `olfnetto.workers.dev` válida |
| Rejeição de hostname | allowed-hostname não configurado | `pnpm paperclipai allowed-hostname <host>` (já feito) |

---

**Fim do relatório.** O túnel Cloudflare está tecnicamente ativo e conectado ao Cloudflare (4 conexões nos PoPs GRU), mas o acesso externo requer a criação de um CNAME na zona DNS válida `olfnetto.workers.dev` apontando para o túnel `paperclip-netto`.
