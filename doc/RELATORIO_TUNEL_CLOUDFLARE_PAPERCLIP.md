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

### 2.5 Allowed hostname no Paperclip

```sh
pnpm paperclipai allowed-hostname paperclip.olfnetto.workers.dev.defesai.com.br
```

**Resultado:** Hostname adicionado à lista de allowed hostnames do Paperclip. O servidor foi reiniciado para aplicar.

Hostnames permitidos atualmente:
- `prescription-harvest-innovative-seven.trycloudflare.com`
- `pair-montreal-mediterranean-sku.trycloudflare.com`
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

**Resultado:** DNS não resolveu. O CNAME foi criado no Cloudflare mas não está resolvendo via DNS público. Possíveis causas:
- Zona DNS `olfnetto.workers.dev.defesai.com.br` pode não estar configurada corretamente
- Propagação DNS pendente
- O subdomínio `olfnetto.workers.dev` pode não existir dentro da zona `defesai.com.br`

**Status:** ⚠️ Pendente — DNS não resolve

### 3.3 Acesso externo via trycloudflare (túnel efêmero)

Vários URLs trycloudflare foram gerados:
- `https://prescription-harvest-innovative-seven.trycloudflare.com`
- `https://pair-montreal-mediterranean-sku.trycloudflare.com`
- `https://significance-vegetables-identity-informed.trycloudflare.com`

**Resultado:** HTTP 000 (falha de conexão) em todos os testes. O trycloudflare não está funcionando neste ambiente.

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
| DNS route configurado | ✅ Criado | CNAME `paperclip.olfnetto.workers.dev.defesai.com.br` → túnel |
| Allowed hostname no Paperclip | ✅ Configurado | `paperclip.olfnetto.workers.dev.defesai.com.br` na lista |
| Acesso externo funcional | ❌ Não validado | DNS não resolve / trycloudflare falha |

---

## 5. Próximos Passos Recomendados

Para expor a porta 3100 externamente de forma estável, é necessário:

1. **Verificar a zona DNS:** Confirmar que `defesai.com.br` (ou `olfnetto.workers.dev`) é uma zona DNS válida na conta Cloudflare do usuário.

2. **Criar DNS route com hostname válido:** Usar um domínio que já esteja configurado na conta Cloudflare, por exemplo:
   ```sh
   cloudflared tunnel route dns --overwrite-dns 9cb11663-c26a-4517-a865-b14a1c46e3db <seu-dominio>.com.br
   ```

3. **Adicionar allowed-hostname:** Após escolher o hostname definitivo:
   ```sh
   pnpm paperclipai allowed-hostname <seu-dominio>.com.br
   pnpm dev:stop && pnpm dev:once
   ```

4. **Testar acesso externo:**
   ```sh
   curl https://<seu-dominio>.com.br/api/health
   ```

5. **Considerar produção:** O trycloudflare é para testes temporários. Para produção, use um túnel nomeado com domínio próprio e certificado SSL gerenciado pelo Cloudflare.

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

- O servidor Paperclip está em modo `local_trusted` com `exposure: private`
- O cloudflared cria uma conexão outbound para o Cloudflare (não expõe a porta 3100 no firewall local)
- O allowed-hostname restringe quais hostnames podem acessar a instância
- As credenciais do túnel estão em `/home/lg/.cloudflared/*.json` (permissões 400, não versionar)

---

**Fim do relatório.** O túnel está tecnicamente ativo e conectado ao Cloudflare, mas o acesso externo depende de um hostname DNS válido que resolva corretamente.
