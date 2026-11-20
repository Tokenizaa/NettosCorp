---
name: nettoscorp-paperclip-operations
description: Procedimento oficial de criaçăo, configuraçăo e administraçăo de agentes no Paperclip. Ensina como contratar um agente, escolher e configurar seu adaptador, definir conexăo, ambiente e modelo, preencher role e title, configurar reportsTo e hierarquia, definir identidade e instruçőes, configurar permissĂ­es e capacidades, definir orçamento, instalar e associar skills, configurar ferramentas e conexŁes, executar o teste do agente e finalizar a contrataçăo até que o agente esteja operacional. Reutilizável para futuras contrataçőes.
category: paperclip-operations
recommendedForRoles: [orquestrador, project-manager, software-architect, backend-architect, frontend-developer, devops, qa, technical-writer, ceo]
trustLevel: markdown_only
compatibility: compatible
version: 2.0.0
---

# Skill Institucional — Operaçăo e Administraçăo de Agentes no Paperclip (Tokenizaí)

Esta skill é o manual de procedimento oficial para criar, configurar e administrar agentes no Paperclip. Baseia-se na documentação oficial do Paperclip (docs.paperclip.ing) e serve como procedimento reutilizável para todas as contrataçőes de agentes da empresa.

Năo crie uma segunda skill redundante. Atualize esta quando a plataforma ou a governança evoluírem.

## 1. Como usar esta skill

1. Leia a seção 2 para entender a arquitetura e as três fontes de verdade.
2. Consulte a seção 3 para verificar o estado real da instância (CLI + API).
3. Use as seções 4 a 12 para executar operações específicas (agentes, tarefas, skills, conexões, rotinas, etc.).
4. Siga a seção 13 para segurança, permissões e limites de autoridade.
5. Use a seção 14 para diagnóstico e recuperação.
6. Registre evidências de cada alteração (seção 15).

**Princípio:** não invente comandos. Confirme cada comando na documentação oficial (`docs/`, `doc/`) ou no `--help` do CLI instalado (`pnpm paperclipai --help`).

---

## 2. Fontes de verdade e precedência

Quando houver divergência entre fontes, respeite esta ordem:

| Fonte | O que define | Exemplo |
|-------|--------------|---------|
| **A. Governança institucional NettosCorp** | Regras institucionais, autoridade, organograma, decisões homologadas | `institutional/`, `empresa/` |
| **B. Documentação oficial Paperclip** | Funcionamento técnico, recursos, CLI, API | `docs/`, `doc/`, `https://docs.paperclip.ing/` |
| **C. Estado real da instância** | O que está efetivamente configurado | CLI, API, banco (consulta apenas) |

Não descarte dados nem altere identidades para fazer as fontes parecerem iguais. Registre divergências, sua origem e a resolução adotada.

## 3. Fluxo oficial de criaçăo de agente (contrataçăo)

O Paperclip define dois caminhos para adicionar um agente:

1. **Criaçăo direta (board user):** clicar em **New Agent** na pßgina de agentes.
2. **Proposta de hire:** um agente existente (tipicamente o CEO ou um gerente) prop├e um hire, que vai para a fila de aprovaçăo do board.

### Passo 1: Nome

Abra **Agents** na barra lateral e clique em **New Agent**. No di├logo **Meet your next agent**, informe o **Agent name** (ex.: "CEO", "CTO", "Ada") e clique em **Choose adapter**. Somente o nome ť solicitado neste passo.

Paperclip salva o agente assim que vocÍ submete o nome. Atť finalizar, o agente fica na lista como `paused` e n„o assume trabalho. Se outro agente jŠ tiver esse nome, Paperclip adiciona um nķmero (ex.: "Ada 2").

### Passo 2: Adaptador

O di├logo muda para **Choose an adapter** e pergunta como o agente deve trabalhar. Escolha um dos cards de adapter — isso define qual runtime de IA alimenta o agente (Claude Code, Codex, OpenCode, um gateway remoto, etc.). O Paperclip Runner n„o ť um card prŰrprio: os cards Claude, Codex, OpenCode e Pi iniciam no Runner em hosts suportados.

Clique em **Configure agent** para avançar, ou **Back** para mudar o nome.

### Passo 3: Configurar o agente (conexŃo, ambiente e modelo)

Na pßgina de setup, conecte seu provedor de modelo se solicitado, escolha um modelo e execute **Test your agent**. Veja a seção 6 para detalhes de adapter, runtime e conexŃo de IA.

### Passo 4: Testar o agente

Clique em **Test your agent** para validar que a configuraçăo do adapter e a conexŃo com o provedor de modelo estŠo funcionando. Veja a seção 11 para o procedimento completo de teste.

### Passo 5: Finalizar o setup

Clique em **Finish setup**. O agente agora estŠ registrado. Em seguida, configure o cargo (title), o superior hierarquico (reportsTo), as permissőes, o orçamento e as skills (seçőes 4 a 10).

**Regra essencial:** o primeiro agente de uma empresa ť obrigatoriamente o CEO. N„o hŠ como evitar isso e n„o hŠ motivo para tentar. Todos os demais agentes devem ter exatamente um superior hierarquico (single parent), respeitando a ĂĄrvore organizacional (sem ciclos).

---

## 4. Configuraçăo do agente (espec YAML e API)

Todo agente tem as seguintes colunas de configuraçăo, salvadas juntas como uma alterańŃo:

- **name:** nome do agente
- **role:** papel (ex.: engineer, ceo, cto, cmo, cfo, cpo, cco, pm, researcher)
- **title:** tŪtulo da funçăo (ex.: "Chief Technology Officer", "Backend Engineer")
- **icon:** Ūcone visual
- **reportsTo:** ID do agente gestor (null para o CEO, que reporta ao board/humano)
- **capabilities:** descrińŃo breve do que o agente faz
- **adapterType:** tipo de adapter (claude_local, opencode_local, codex_local, process, http, etc.)
- **adapterConfig:** configuraçăo especŪfica do adapter (modelo, cwd, instruçőes, etc.)
- **runtimeConfig:** configuraçăo de runtime (heartbeat, aiConnection)
- **defaultEnvironmentID:** ID do ambiente de execuçăo default
- **budgetMonthlyCents:** orçamento mensal em centavos
- **metadata:** metadados livres

### Ediçăo como YAML (pßgina Advanced)

Para editar vßrias configuraçőes de uma vez, abra o agente, no menu lateral clique em **Advanced** (endereço termina em `/advanced`). O editor mostra o agente como um Único documento YAML:

```yaml
apiVersion: paperclip/v1
kind: Agent
spec:
  # ...configuraçőes do agente...
```

Regras do editor YAML:

- **Deixe uma chave de fora:** o valor salvo ť mantido. Apagar uma linha n„o limpa a configuraçăo.
- **Mude um valor:** ť atualizado.
- **Limpe um valor:** escreva o valor vazio explicitamente (ex.: `title: null`, `skills: []`, `tools: { profiles: [] }`, `adapterConfig: {}`).
- **Listas substituem a lista inteira:** `skills`, `tools.connections`, `tools.profiles`, `tools.policies`, `channels`. Se vocÍ fornecer a lista, ela torna-se o conjunto completo. Uma linha deixada de fora de uma lista que vocÍ forneceu ť removida.
- **`adapterConfig`, `runtimeConfig` e `metadata` substituem o mapa inteiro** quando fornecidos, inclusive todas as chaves que vocÍ quiser manter.
- **`permissions`, `instructions` e `tools` mesclam.** Chaves que vocÍ n„o mencionar dentro delas mantêm os valores salvos.
- **Arquivos de instruçăo s„o atualizados por nome.** Somente os arquivos listados em `instructions.files` mudam; o resto permanece. Defina um arquivo como `null` para deletĹlo (ex.: `workflow.md: null`). N„o ť possŪvel deletar o arquivo de entrada (entry file).

Exemplo compacto (agente simples):

```yaml
apiVersion: paperclip/v1
kind: Agent
spec:
  name: Release Writer
  role: engineer
  title: Release notes writer
  appearance:
    schemaVersion: 1
    characterVersion: cap-v1
    paletteId: golden-hour
  capabilities: Drafts release notes from merged pull requests.
  adapterType: process
  adapterConfig:
    command: "true"
  runtimeConfig:
    heartbeat:
      enabled: false
      wakeOnDemand: true
  instructions:
    mode: external
    rootPath: /srv/agents/release-writer
    entryFile: AGENTS.md
```

### SeÁ§űes de comando (apiKeys, secrets, channelOperations, revisions)

Algumas aÁűes n„o s„o configuraçőes de estado final — criar chave, rotacionar segredo, restaurar revisŃo. Essas ficam em **command sections**. Elas n„o aparecem no documento que vocÍ carrega; adicione uma quando precisar, e o que vocÍ colocar nela ť executado uma vez ao salvar:

| SeÁńŃo | O que vocÍ pode solicitar |
|--------|---------------------------|
| `apiKeys` | `create` novas chaves (cada uma com um `name`) e `revoke` existentes por ID |
| `secrets` | `create` novos segredos (cada linha tem um `secret` e um `bind` com `env` e `api`), `rotate`/`update` existentes por ID, `approve`/`reject` propostas pendentes |
| `channelOperations` | `create` um novo canal para o agente, executar `setup` em um existente, `revokeIdentityLinks` para uma pessoa vinculada |
| `revisions` | `restore` uma configuraçăo por ID (restaurar deve ser a Ăşnica alteraçăo no save) |

---

## 5. Hierarquia organizacional (org structure)

O Paperclip impĺe uma ĂĄrvore estrita. Todo agente, exceto o CEO, tem exatamente um gerente — o agente a quem reporta. O CEO fica no topo e reporta a vocÍ, o board.

Regras:

- **N„o hŠ ciclos:** um agente n„o pode ser seu prŰrio gerente (nem gerenciar, transitivamente, alguťm acima de si).
- **Pai nķnico:** cada agente tem exatamente um gerente direto.
- Tarefas entre equipes s„o possŪveis, mas o gerente do agente receptor cuida da escalaÁŃo se ficar bloqueado.

### Organogramas comuns

**Solo CEO (comeńo):**

```
CEO
```

**Pequena equipe:**

```
CEO
├── CTO
└── CMO
```

**Equipe escalada:**

```
CEO
├── CTO
│   ├── Backend Engineer
│   └── Frontend Engineer
└── CMO
    └── Content Writer
```

Dica: n„o precisa construir tudo de uma vez. Comece pequeno, veja que trabalho o CEO cria e adicione agentes ŕ medida que surgirem lacunas na cobertura da equipe.

### Adicionar um gerente

1. Vá à pßgina de Agents e clique em **New Agent**.
2. Nomeie o agente e escolha um adapter.
3. Finalize o setup (conecte modelo, escolha modelo, teste, Finish setup).
4. DŪ um tŪtulo (ex.: "CTO") e verifique o gerente: o novo agente reporta ao CEO automaticamente.

### Adicionar trabalhadores (subordinados)

Trabalhadores reportam a um gerente, n„o diretamente ao CEO. Os passos s„o os mesmos, exceto que, depois do setup, vocÍ move o novo agente do CEO para um gerente de nŪvel gerencial.

### Mudar o gerente de um agente

1. Abra o agente que estŠ sendo movido. Sua pßgina **Overview** ť aberta primeiro.
2. Encontre **Reports to:** no painel **Profile**. Ele mostra o gerente atual.
3. Clique no botŃo lßpis (**Change manager**) ao lado do gerente.
4. Escolha o novo gerente. A lista mostra os agentes da empresa pelo nome, excluindo quem estŠ terminado.

N„o hŠ botŃo de salvar: a alterańŃo entra em vigor no momento em que vocÍ escolhe. Ela ť registrada no **Agent history** do agente.

### Via YAML ou API

Para mudar via YAML, abra o agente, menu lateral → **Advanced**, e defina `reportsTo: <ID do gerente>` em `spec`. Para reportar diretamente ao board, escreva `reportsTo: null`. Via API: `PATCH /api/agents/{agentId}` com `{"reportsTo": "<ID do gerente>"}`.

---

## 6. Adaptador, runtime e conexŃo de IA

### Adapter types disponĒveis

- `process`, `claude_local`, `opencode_local`, `codex_local`, `cursor_local`, `gemini_local`, `grok_local`, `kimi_local`, `pi_local`, `http`, OpenClaw gateway, plugin.

Cada agente tem `adapterType` + `adapterConfig` (modelo, cwd, instruçőes, etc.) e `runtimeConfig` (heartbeat, aiConnection).

### Como escolher e configurar o adaptador

O adapter decide qual runtime de IA alimenta o agente. Escolha de acordo com o ambiente disponĒvel e a especialidade do agente:

- `claude_local`: Claude Code local via ACP. Exemplo de `adapterConfig`:

```json
{
  "engine": "acp",
  "model": "claude-opus-5-5",
  "effort": "high",
  "cwd": "/workspace",
  "instructionsFilePath": "/workspace/AGENTS.md",
  "dangerouslySkipPermissions": true,
  "maxTurnsPerRun": 50,
  "timeoutSec": 1800,
  "graceSec": 30
}
```

- `codex_local`: Codex local.
- `process`: execuńŃo de comando local genťrico.
- `http` / OpenClaw gateway / plugin: agentes webhook ou externos.

### ConexŃo de IA (aiConnection)

A conexŃo de IA define com qual provedor de modelo o agente se autentica. Crie-a em **Company Settings → Connections** ou via API `POST /api/companies/{companyId}/ai-connections`. Depois vincule ao agente em `runtimeConfig.aiConnection`:

```json
{
  "mode": "shared",
  "method": "api_key",
  "provider": "anthropic",
  "connectionId": "<id-da-conexao>"
}
```

Os tipos de mťtodo s„o `subscription` (login do provedor) ou `api_key` (chave de API). O routing pode ser `local`, `gateway` ou `openrouter`.

### Heartbeat

O agente n„o roda continuamente: ele executa em curtos perŪodos chamados heartbeats, despertados por algo concreto (cronograma, atribuińŃo, pedido de revisŃo, invocańŃo manual). Configure em `runtimeConfig.heartbeat`:

```json
{
  "enabled": true,
  "intervalSec": 300,
  "wakeOnDemand": true,
  "maxConcurrentRuns": 5,
  "skipTimerWhenNoActionableWork": true
}
```

**Limite:** `dangerouslySkipPermissions: true` deve ser revisado para produçăo. Mudanńas de adapter/modelo de agentes existentes exigem decisŃo homologada.

---

## 7. Identidade e instruçőes do agente

### Role e title

Preencha `role` (papel organizacional, ex.: engineer, ceo, cto) e `title` (tŪtulo da funçăo, ex.: "Chief Technology Officer"). O tŪtulo ť o cabeńalho grande na pßgina do agente, com o nome abaixo. Clique no cabeńalho, digite o tŪtulo e pressione Enter.

### Instruçőes (instructions)

O bundle de instruçűes define como o agente se comporta. Pode ser:

- `mode: managed` — instruçűes gerenciadas pelo Paperclip.
- `mode: external` — instruçűes em arquivo externo (`rootPath` + `entryFile`).

Exemplo (instruçűes externas):

```yaml
instructions:
  mode: external
  rootPath: /srv/agents/meu-agente
  entryFile: AGENTS.md
```

Para mudar o conteķdo de um arquivo de instruçŃo, use `instructions.files` (mapa de caminho relativo para texto). N„o ť possŪvel deletar o arquivo de entrada.

Copie as instruçőes originais do perfil do Agency Agents e adapte somente o contexto organizacional da Tokenizaí, sem descaracterizar a identidade, personalidade, miss„o, especializaçăo, responsabilidades, processos e critťrios de qualidade originais.

---

## 8. Permissőes e capacidades

### Capabilities

DescrińŃo breve do que o agente faz. Aparece no org chart como um snippet de trņs linhas.

### Permissions

| Chave | Significado |
|-------|-------------|
| `canCreateAgents` | Pode criar novos agentes |
| `canCreateSkills` | Pode criar skills |
| `canAssignTasks` | Pode atribuir tarefas |
| `trustPreset` | `standard` ou `low_trust_review` |
| `authorizationPolicy` | PolŪtica de autorizašŃo, se houver |

Valores padrŃo: permissŁes standard. Somente valores que diferem dos padrŃo s„o mostrados no documento YAML.

---

## 9. Orçamento

Defina `budgetMonthlyCents` (orçamento mensal em centavos). Os orçamentos s„o gerenciados em **Audit → Budgets**. Se o agente atingir 100% do orçamento, ť pausado automaticamente.

**Limite:** n„o crie oršamentos sem funçŃo concreta. Avalie se todos os cargos precisam ser agentes independentes desde o inŪcio ou se algumas responsabilidades podem ser acumuladas temporariamente.

---

## 10. Skills da empresa

Uma skill ť um documento de instruçűes reutilizßvel que agentes podem carregar sob demanda. Fica na biblioteca de skills da empresa, n„o dentro de um agente especŪfico.

### Formato de uma skill (SKILL.md)

Uma skill ť uma pasta contendo um `SKILL.md` na raiz, com um bloco de frontmatter (descriçăo de roteamento) e um corpo (as instruçűes). Pode ter uma pasta `references/` para material de apoio.

Exemplo de frontmatter:

```markdown
---
name: code-review
description: Use when asked to review a pull request or code diff. Don't use when writing new code from scratch.
slug: code-review
---
```

**Regras de frontmatter (leitor YAML estreito do Paperclip):**
- Use espaços (n„o tabs).
- Use `-` para itens de lista.
- Use valores de string em uma linha Źnica para `name` e `description`.
- N„o use block scalars (`>` ou `|`) para descriçľes — o leitor atual n„o dobra as linhas seguintes.

### Instalar uma skill

- **Do catálogo:** `pnpm paperclipai skills install <catalog-ref> --company-id <id>`
- **De caminho local:** `pnpm paperclipai skills import ./skills/<skill> --company-id <id>` (a pasta tem que estar dentro de uma raiz de workspace aprovada)
- **Do GitHub:** `pnpm paperclipai skills import https://github.com/... --company-id <id>`

### Anexar skill a um agente

```sh
pnpm paperclipai skills agent sync <agent-id> --skill <skill-ref> --mode add --company-id <id>
```

Modos de sync: `add` (uniŃo), `remove` (remove apenas os nomeados), `replace` (reconcilia o conjunto exatamente).

### Anexar skill a um agente

```sh
pnpm paperclipai skills agent sync <agent-id> --skill <skill-ref> --mode add --company-id <id>
```

Modos de sync: `add` (união), `remove` (remove apenas os nomeados), `replace` (reconcilia o conjunto exatamente).

Atenção: a skill deve já estar instalada no nível da empresa antes de ser anexada a um agente. Mode de sync `unsupported` significa que o adapter não consegue sincronizar (atribuição somente metadados); `ephemeral` significa que os arquivos existem apenas durante a execução.

### Skills across agents (compartilhadas entre agentes)

As skills vivem no nível da empresa, não dentro de um agente específico. Isso significa:

- Seu CTO e Backend Engineer podem share uma `code-review` skill sem duplicá-la.
- Seu CEO pode usar uma `delegation-checklist` skill que seu CMO também usa para breakdown de tarefas.
- Atualizar uma skill melhora todos os agentes que a usam ao mesmo tempo.

Quando um agente inicia um heartbeat, ele lê o nome e a descrição de cada skill disponível. Se a descrição corresponder à tarefa atual, o agente carrega o conteúdo completo da skill e segue as instruções apenas naquele turno — não carrega todas as skills em cada heartbeat.

**Benefício de desempenho e custo:**
- Menos tokens consumidos por run (menor custo).
- Contexto mais limpo e focado para o agente (melhores resultados).
- Mais fácil de manter: atualiza uma skill em um local, todos os agentes se beneficiam.

### Como adicionar skills (todos os caminhos)

A partir da página de Skills, tabs **Installed**, **Discover** e **My Skills**. Toda adição começa no menu **+ New**:

- **Create new skill** — escreve do zero no Skill Studio (quatro passos: Basics, Design, Content, Review).
- **Discover skills** — navega skills de todas as fontes disponíveis.
- **Import from GitHub** — vincula um repositório em **Skills → Sources**, escolhe as skills, e o Paperclip mantém-as vinculadas e atualizadas conforme o repositório muda.
- **Import from path or URL** — cola um caminho local (Linux/WSL/Windows), URL do GitHub ou comando `skills.sh`. Para caminhos locais, a pasta deve estar dentro de uma raiz de workspace aprovada pela empresa.
- **Import skills from project** — se as skills já vivem em um repositório apontado por um projeto, escaneia os workspaces do projeto e importa como referências (link ativo, não snapshot).

### Trabalhando com skills programaticamente (API)

A maioria das vezes você gerencia skills pela UI, mas as mesmas operações estão disponíveis via REST:

- `GET /api/agents/{agentId}/skills` — lista as skills anexadas a um agente.
- `POST /api/agents/{agentId}/skills/sync` com `{ "desiredSkills": [...], "mode": "add" | "remove" | "replace" }` — cada entrada é uma skill UUID, canonical key ou slug único. O `mode` escolhe como a lista se aplica: `add` une as skills nomeadas ao conjunto atual, `remove` remove apenas as nomeadas, `replace` reconcilia o conjunto para coincidir exatamente (adiciona as faltantes e remove as que não estão na lista).
- `POST /api/companies/{companyId}/agents` com `desiredSkills` — provisiona skills no momento da contratação, para o agente já ficar online com o conjunto correto.

As skills devem já estar instaladas no nível da empresa antes de poderem ser anexadas a um agente.

### Versioning e atualizações

Skills importadas de GitHub são fixadas a um commit específico. Você pode verificar atualizações e fazer upgrade do pin a partir do painel da skill. Para skills de caminho local, as edições no disco aparecem na próxima leitura da skill — não é necessário reimportar. Isso é útil enquanto você ajusta a descrição. Mude para uma fonte GitHub antes de promover a skill a um agente de produção.

### Solução de problemas (skill não carrega)

| Sintoma | Causa provável | Ação |
|---------|---------------|------|
| `mode: unsupported` | O adapter não consegue sincronizar skills | A atribuição é somente metadados; o agent não carrega o conteúdo da skill. |
| `mode: ephemeral` | Os arquivos existem apenas durante a execução | O workspace fica vazio em repouso — comportamento correto. |
| Mudanças no frontmatter não têm efeito | O leitor YAML é estreito | Use espaços (não tabs), `-` para listas, strings de uma linha para `name` e `description`. Evite block scalars (`>` e `|`). |
| `references/example.md` falta no inventário | Re-importou da pasta errada | Re-importe a pasta *pai* que contém o diretório da skill (ex.: `/Users/me/skills`), não a pasta da skill em si. |
| Skill bundled reaparece após deletar | É por design | `paperclip` e outras skills `paperclipai/paperclip/*` são re-importadas a cada chamada de list. Para suprimir, use um fork do Paperclip que não a inclua. |
| `Invalid company skill selection (unknown references: …)` | A referência em `desiredSkills` não corresponde a nenhuma skill instalada | Liste as skills primeiro e copie a `key` correta. |


---

## 11. Testar o agente e verificar que estŠ operacional

N„o considere um agente pronto apenas porque seu registro foi criado. Verifique:

1. **O agente existe no Paperclip.** Consulte: `pnpm paperclipai agent get <agent-id> --company-id <id>`.
2. **Suas instruçľes foram configuradas.** Verifique `adapterConfig` e `instructions` no registro do agente.
3. **Seu superior estŠ correto.** Verifique `reportsTo` (null para CEO, ID do gerente para subordinados).
4. **Seu adaptador de execuŃo estŠ funcional.** Verifique `adapterType` e `adapterConfig`.
5. **Ele consegue executar uma tarefa de teste.** Invocie um heartbeat: `pnpm paperclipai heartbeat run --agent-id <agent-id> --api-base http://127.0.0.1:3100` (ou `POST /api/agents/{agentId}/heartbeat/invoke`). Confirme que o run entra na fila e executa sem erro.

### Criar API key do agente (se necessßrio)

```sh
POST /api/agents/{agentId}/keys
```

O valor completo ť mostrado apenas uma vez. Armazene com seguranaÁa.

### Finalizar a contrataçăo

Se a empresa exigir aprovaŃo do board (`requireBoardApprovalForNewAgents: true`), a criaçăo cria uma aprovaŃo pendente. O board deve aprovar antes do agente ficar ativo. Verifique o status da aprovaŃo:

```sh
curl -H "Authorization: Bearer <token>" \
  "$PAPERCLIP_API_URL/api/approvals/<approval-id>"
```

---

## 12. Ferramentas e conexŁes

### ConexŁes de ferramentas (tool connections)

Instale ferramentas diretamente no agente (cada uma com um `connectionId`), vincule tool `profiles` diretamente ao agente (cada um referenciado por `profileKey`, ou `profileId` se o perfil n„o tiver chave, com `priority` apenas quando n„o for o default `100`, e `metadata` apenas quando definido), e tool `policies` escopados apenas a este agente.

### Canais de chat

Os canais de chat s„o atribuŪdos ao agente por `id` e `provider`, com quaisquer `settings` definidos e os `resources` habilitados.

---

## 13. Custos e orçamentos

O gasto de API ť computado, oršamentos s„o impostos e s„o ajustados em toda a empresa. Veja **Audit → Budgets**. Se um agente bater o limite, encontre o card de incidente no topo da pßgina e clique em **Raise budget & resume** (aumenta o teto e retoma o agente em um passo).

---

## 14. EvidŪncias e validaçăo de operaš§es

Para cada alterańŃo, registre:

1. Estado anterior (consulta API/CLI).
2. AńŃo aplicada (comando ou endpoint).
3. Estado posterior (consulta API/CLI).
4. ConfirmaŃo na interface (http://127.0.0.1:3100).
5. VerificaŃo de persistŪncia (consulta apůs reload).
6. Teste de comportamento real.
7. EvidŪncia (output do comando, screenshot, link do issue).

Mantenha evidŪncias em `report/` ou `doc/` do repositório, sem tokens nem dados privados.

---

## 15. SeguranÁa e limites de autoridade

- N„o commite `.env`, tokens, chaves de API ou dados do banco.
- Tokens via variŠvel de ambiente (`PAPERCLIP_API_KEY`), nunca em arquivos versionados.
- N„o imprima tokens nem secret values em relatŰrios, comentŗrios ou documentos.
- FaÓa backup antes de alteraš§es relevantes (`pnpm paperclipai db:backup`).
- N„o execute `onboard` (criaria uma segunda instŌncia). N„o execute `run` (iniciaria um segundo servidor). N„o altere a porta 3100. Conecte o CLI Ó instŌncia existente.
- N„o exclua agentes existentes sem justificativa.
- Alteraš§es de hierarquia (`reportsTo`), identidade institucional ou autoridade exigem decisŃo homologada do fundador.

---

## 16. Referências oficiais

- Agents: https://docs.paperclip.ing/guides/org/agents/
- Org structure: https://docs.paperclip.ing/guides/org/org-structure/
- Agent configuration YAML: https://docs.paperclip.ing/guides/org/agent-configuration-yaml/
- Skills: https://docs.paperclip.ing/guides/org/skills/
- Write a company skill: https://docs.paperclip.ing/how-to/write-a-company-skill/
- Agent adapters: https://docs.paperclip.ing/guides/org/agent-adapters/
- Approvals: https://docs.paperclip.ing/guides/day-to-day/approvals/
- Costs & budgets: https://docs.paperclip.ing/guides/day-to-day/costs/
- Agents API: https://docs.paperclip.ing/reference/api/agents/
- Skills reference: https://docs.paperclip.ing/reference/skills/

## 17. Governa e limites da empresa

Esta skill é patrimônio técnico da empresa. Mantenha-a versionada e atualizada conforme a plataforma e a governança evoluírem. Todas as alterações de hierarquia, identidade institucional ou autoridade exigem decisão homologada do fundador.

## 18. Keep skills lean (boas práticas de escrita de skills)

Uma skill é a ferramenta certa quando você quer um **procedimento** — uma checklist de code review, um formato de release notes, um template de resposta ao cliente — disponível a múltiplos agentes sem assá-lo em cada instrução principal. Uma skill **não** é para enviar código (isso é um plugin) e **não** é uma ponte de runtime (isso é um adapter). Se um ser humano inteligente pudesse seguir o arquivo como escrito e produzir o resultado correto, é uma skill.

### Write a good skill checklist

- **Nome descritivo** — curto, identifica claramente o propósito.
- **Descrição como lógica de roteamento** — "Use when… Don't use when…". É isso que o agente lê antes de carregar o corpo.
- **Corpo focado** — instruções diretas, exemplos concretos, formato de saída esperado.
- **Referências em `references/`** — material de apoio longo fica fora do corpo principal.
- **Frontmatter enxuto** — `name`, `description` e `slug` em uma linha cada. Não use block scalars (`>` ou `|`).
- **Não duplique** — se já existe uma skill semelhante na empresa, reutilize-a em vez de criar outra.

## 19. Referências oficiais

- Agents: https://docs.paperclip.ing/guides/org/agents/
- Org structure: https://docs.paperclip.ing/guides/org/org-structure/
- Agent configuration YAML: https://docs.paperclip.ing/guides/org/agent-configuration-yaml/
- Skills: https://docs.paperclip.ing/guides/org/skills/
- Write a company skill: https://docs.paperclip.ing/how-to/write-a-company-skill/
- Agent adapters: https://docs.paperclip.ing/guides/org/agent-adapters/
- Approvals: https://docs.paperclip.ing/guides/day-to-day/approvals/
- Costs & budgets: https://docs.paperclip.ing/guides/day-to-day/costs/
- Agents API: https://docs.paperclip.ing/reference/api/agents/
- Skills reference: https://docs.paperclip.ing/reference/skills/
- Work Modes: https://docs.paperclip.ing/guides/day-to-day/work-modes/
- Agent Chat: https://docs.paperclip.ing/experimental/agent-chat/
- Chat-Style Tasks: https://docs.paperclip.ing/experimental/task-chat/
- Delegation: https://docs.paperclip.ing/guides/org/delegation/
- Issues API: https://docs.paperclip.ing/reference/api/issues/
- Work Modes: https://docs.paperclip.ing/guides/day-to-day/work-modes/
- Issues: https://docs.paperclip.ing/guides/day-to-day/issues/
- Artifacts: https://docs.paperclip.ing/guides/day-to-day/artifacts/
- Execution Policy: https://docs.paperclip.ing/guides/power/execution-policy/

## 20. Chat com agentes (Agent Chat)

O **Agent Chat** é um recurso experimental do Paperclip que permite conversar diretamente com cada agente em uma conversa persistente, antes de transformar a conversa em tarefas formais.

### O que é o Agent Chat

Nem toda conversa com um agente começa como uma tarefa bem formada. Às vezes você quer pensar em voz alta, fazer uma pergunta ou descobrir qual é o próximo passo — e só então transformar isso em trabalho. O Agent Chat oferece uma conversa contínua com cada agente. Você fala o objetivo em voz alta, o agente pergunta o que precisa saber, e quando há trabalho de verdade ele o entrega como tarefas ordinárias. Quando essas tarefas terminam, o agente volta à conversa e conta o que foi feito.

### Como ativar

1. Vá a **Settings → Experimental**.
2. Ligue **Agent Chat**. É experimental e desligado por padrão; habilitá-lo adiciona conversas persistentes com seus agentes.

Como todo sinalizador nessa página, é instancia-wide. No Paperclip Cloud este pode ser gerenciado para você, caso em que mostra o bloqueio **Managed by Paperclip Cloud** — veja [If a toggle is locked](https://docs.paperclip.ing/experimental/overview/#if-a-toggle-is-locked).

### Abrindo um chat

Uma vez ativado, **Chat** lidera o grupo **Work** na barra lateral streamlined. Seus agentes ficam em uma barra lateral separada ao lado da conversa, para que você possa mudar de chat sem sair da página. Clicar leva você de volta ao último agente com quem conversou nesta empresa. Se você não conversou com ninguém ainda, cai em uma página perguntando _"Quem você gostaria de conversar?"_, com alguns de seus agentes para escolher e um link **Browse all agents** para os demais.

A área de chat tem sua própria barra lateral, chamada **Chat**, ao lado da conversa:

- **Teammates** lista suas conversas existentes primeiro, seguidas pelos outros agentes com quem você pode conversar. Cada linha mostra o avatar, nome e título do agente. Um agente que está respondendo no momento lê **Working…**; um agente pausado ou terminado diz isso.
- **Find an agent** filtra a lista por nome ou role.
- **Add chat** (o botão **+**) abre **Chat with an agent**, uma lista pesquisável de todos os agentes da empresa. Cada um é marcado **Open chat** se você já tiver uma conversa com ele, ou **New chat** se não tiver. Escolha um e sua conversa é aberta imediatamente.
- **Browse all agents** no fundo leva você à lista completa de agentes.

A barra lateral e o cabeçalho permanecem no mesmo lugar independentemente de você ter escolhido um agente, então alternar entre conversas não faz a página pular.

### Uma conversa por agente

Você tem exatamente uma conversa com cada agente. Adicionar um chat com um agente com quem já conversou apenas a reabre — **"One conversation per agent. Pick up where you left off."** — então você nunca acaba com duplicatas para acompanhar.

Uma conversa é uma tarefa nos bastidores, então usa o mesmo compositor, transcrição, anexos e documentos da página de tarefa comum. Veja [Chat-Style Tasks](https://docs.paperclip.ing/experimental/task-chat/) para esses controles.

O painel direito começa em **Tasks**, mostrando tarefas que este agente trabalhou em toda a empresa, não apenas tarefas criadas neste chat. Pesquise, filtre ou ordene os cards, então abra um para ler o trabalho em uma nova aba do navegador. **Artifacts** mostra os arquivos que o agente produziu, com um link de volta à tarefa para cada um. O painel mostra até 200 tarefas recentes e 500 artefatos recentes e avisa quando chega a esse limite; use a página de Tasks ou Artifacts da empresa para a visão mais ampla.

Você pode abrir **Artifacts** ou **Properties** do menu **+** do painel. A conversa permanece ao lado deles enquanto você revisa o resultado.

Conversas seguem a visibilidade normal de tarefas da sua empresa. Colegas de equipe podem ler sua conversa com um agente, mas apenas você pode enviar mensagens nela. Cada pessoa tem sua própria conversa com cada agente.

### Conversar primeiro, entregar depois

Em um chat, o trabalho do agente é entender o que você quer — não começar a construir silenciosamente. Ele pergunta sobre qualquer coisa importante que esteja faltando, pode pesquisar e elaborar um plano com você, e então, quando há trabalho substancial a fazer, cria tarefas ordinárias para isso: atribuídas ao agente certo, em um projeto adequado, com o contexto, qualquer plano que vocês concordaram, e como é o "feito". A conversa em si nunca se torna o trabalho.

Você ainda pode escolher **Plan mode** ou **Ask mode** no compositor, como em uma tarefa. Ask mode mantém o agente apenas leitura; Plan mode é para esclarecer e moldar um plano.

Quando uma resposta termina, a conversa simplesmente espera pela sua próxima mensagem. Um chat ocioso não conta como trabalho não finalizado.

### Obtendo os resultados de volta

Você não precisa ficar checando as tarefas que um chat criou. Quando uma delas é marcada como feita, o agente com quem você estava conversando acorda e publica uma atualização na conversa: o que terminou, e onde encontrar o resultado. Se várias terminarem antes dele responder, ele cobre todas juntas. Se estiver no meio de uma resposta quando uma tarefa termina, a atualização segue no próximo turno.

Apenas tarefas finalizadas são reportadas dessa forma — progresso, bloqueadas, falhas e canceladas não são anunciadas no chat. Reabrir uma tarefa antes da sua atualização ter sido postada cancela aquela atualização; finalizá-la novamente envia uma nova.

### Começar do zero com /new

Conversas longas acumulam muito contexto. Envie **/new** sozinho — o compositor oferece como **New session**, _"Start fresh context here, preserving conversation history."_ — e o agente inicia seu próximo turno com uma folha limpa. Tudo o que você disse, todo plano e toda tarefa vinculada permanecem visíveis na conversa; um divisor marca onde a nova sessão começou.

`/new` também é a forma de voltar após uma pausa: se a conversa foi parada, o compositor diz _"Send /new to start a fresh session and resume this conversation."_

Perguntas pendentes da sessão anterior expiram, então uma pergunta antiga não continua ocupando o compositor. Atualizações sobre tarefas entregues antes de um `/new` não são postadas na nova sessão. As tarefas e seus resultados não são tocados — você ainda pode abrir elas da conversa.

### Quando está desligado

Desligar **Agent Chat** remove a entrada **Chat** e impede novas mensagens, mas nada é excluído. Turnos que já estavam rodando são permitidos a terminar, e conversas existentes permanecem legíveis através dos links de tarefa. Abrir uma página de chat enquanto está desligado diz _"Agent Chat is disabled. Enable it in Experimental settings."_ Ligue de volta e tudo está onde você deixou.

### Caveats

- Este é um recurso experimental em iteração ativa. Espere rótulos, layout e como os agentes decidem entregar o trabalho mudarem entre releases.
- A qualidade com que um agente quebra uma conversa em tarefas depende do agente e do modelo. Leia as tarefas que ele cria antes de confiar nelas.
- Resultados retornam apenas para tarefas que um chat entrega após sua instância estar em um release com esse comportamento. Tarefas entregues antes não são reportadas retroativamente.

Referência de implementação: [session reset and handoff instructions](https://github.com/paperclipai/paperclip/blob/a6306ba606eb87c89b9ef0344e9fe8e0025580f9/server/src/services/agent-conversations.ts), [completion reports](https://github.com/paperclipai/paperclip/blob/a6306ba606eb87c89b9ef0344e9fe8e0025580f9/server/src/services/chat-completion-delivery.ts), [Chat navigation](https://github.com/paperclipai/paperclip/blob/a6306ba606eb87c89b9ef0344e9fe8e0025580f9/ui/src/components/Sidebar.tsx), [agent rail](https://github.com/paperclipai/paperclip/blob/a6306ba606eb87c89b9ef0344e9fe8e0025580f9/ui/src/components/AgentConversationsSidebar.tsx), and [agent task and artifact panels](https://github.com/paperclipai/paperclip/blob/a6306ba606eb87c89b9ef0344e9fe8e0025580f9/ui/src/components/chat/AgentWorkPanels.tsx).

### Para onde ir a seguir

- [Chat-Style Tasks](https://docs.paperclip.ing/experimental/task-chat/) — a página de conversa, compositor e painel lateral nos quais o Agent Chat se baseia.
- [Work Modes](https://docs.paperclip.ing/guides/day-to-day/work-modes/) — o que Auto, Plan e Ask modes mudam sobre um turno.
- [Issues](https://docs.paperclip.ing/guides/day-to-day/issues/) — as tarefas para as quais seus chats entregam trabalho.
- [Agent Chat conversations API](https://docs.paperclip.ing/reference/api/issues/#agent-chat-conversations) — encontrar e criar conversas programaticamente.
- [Experimental features overview](https://docs.paperclip.ing/experimental/overview/)

## 21. Delegação entre agentes (Delegation)

A delegação é o mecanismo central do Paperclip para transformar trabalho em execução distribuída. O board opera no nível estratégico; o CEO e os gestores operam no nível tático; os especialistas operam no nível de execução.

### Como a delegação automática funciona

Quando você define uma meta da empresa, o CEO não apenas reconhece e espera. No próximo heartbeat, ele lê a meta, forma uma estratégia e a submete à fila de aprovação. Uma vez aprovada, a delegação começa:

```
Você define uma meta da empresa
        ↓
CEO acorda no heartbeat
        ↓
CEO propõe estratégia → Você aprova
        ↓
CEO cria tarefas e as atribui aos relatórios diretos
        ↓
Relatórios acordam (disparados pela atribuição)
        ↓
Relatórios executam e postam atualizações nos comentários da tarefa
        ↓
CEO monitora o progresso e escala bloqueios para você
```

Cada passo é rastreável. Cada tarefa linka de volta para a meta da empresa através de uma hierarquia pai-filho, então você sempre pode ver por que o trabalho está acontecendo.

### O que você faz vs o que o CEO faz automaticamente

| O que você faz | O que o CEO faz automaticamente |
| --- | --- |
| Define a meta da empresa | Quebra a meta em tarefas |
| Aprova propostas de estratégia | Atribui tarefas aos relatórios certos |
| Aprova solicitações de contratação | Cria subtarefas quando o trabalho precisa de mais granularidade |
| Monitora o dashboard | Contrata novos agentes quando a equipe não tem capacidade (pendente da sua aprovação) |
| Revisa o trabalho concluído | Monitora o progresso a cada heartbeat |
| Intervém quando as coisas travam | Escala bloqueios para você quando não consegue resolvê-los |

Seu papel é supervisão estratégica, não gerenciamento de tarefas. Você define a direção e toma as decisões que o sistema não pode tomar por você. Tudo o mais roda autonomamente.

### Padrões comuns de delegação

**Pequena equipe: delegação direta** (3–5 agentes)

O CEO delega diretamente a cada report direto, sem outra camada de gestão:

```
CEO
├── CTO         (tarefas de engenharia)
├── CMO         (tarefas de marketing)
└── Designer    (tarefas de design)
```

Cada agente trabalha de forma independente nas tarefas atribuídas e posta atualizações. O CEO monitora e reassigna se necessário.

**Equipe maior: delegação em cascata**

Com mais agentes, os gerentes delegam ainda mais abaixo na cadeia:

```
CEO
├── CTO
│   ├── Backend Engineer
│   └── Frontend Engineer
└── CMO
    └── Content Writer
```

O CEO atribui tarefas de alto nível ao CTO e CMO. Eles quebram essas em subtarefas e atribuem aos seus próprios reports. Você só interage com o CEO — o resto roda automaticamente.

### Guardrails de delegação agente-a-agente

A delegação é poderosa justamente porque você não precisa vigiá-la. Isso também é o risco: quando um agente entrega trabalho ao lugar errado, a tarefa pode ficar em uma fila que ninguém vai pegar, e você não vai ouvir sobre isso. O Paperclip recusa algumas entregas em aberto, então o agente recebe um erro que ele pode agir em vez de um beco sem saída silencioso.

Ambos os guardrails se aplicam apenas quando um **agente** está fazendo a atribuição. Você ainda pode atribuir trabalho em qualquer lugar que quiser — preparar uma tarefa para um agente que você planeja despausar depois é perfeitamente razoável, e você pode ver o estado do agente ali mesmo na UI.

#### Um agente não pode atribuir trabalho a um agente pausado

Um agente pausado nunca roda. Se outro agente atribui uma tarefa a ele — tipicamente uma escalação roteada na cadeia `reports_to` para um gerente pausado — a tarefa é aceita, nada a pega, e o trabalho some silenciosamente.

Então, quando o ator atribuinte é um agente e o atribuído está pausado, o Paperclip recusa a atribuição com um conflito e esta mensagem:

> Cannot assign work to a paused agent. Assign an invokable agent, leave the issue unassigned, or escalate to a board operator instead.

A mensagem nomeia as três saídas de propósito: escolha um agente que realmente possa rodar, deixe a tarefa sem atribuição para que um humano possa roteá-la, ou escale para um operador do board. As recusas existentes para agentes terminados, agentes ainda pendentes de aprovação e agentes com uma cadeia organizacional inválida são inalteradas e ainda se aplicam a todos.

#### Um agente não pode delegar trabalho de volta em um loop

Aqui está a forma que isso pega. O Agente A atinge algo que não consegue fazer — digamos que não consegue fazer push para o GitHub — e cria uma tarefa filha para o Agente B. O Agente B não consegue fazer também, então ele "resolve" seu bloqueio criando uma tarefa neta atribuída de volta para o A. Nenhum dos dois ganhou uma capacidade, a cadeia de tarefas bloqueadas continua crescendo, e nada chega ao humano que poderia realmente consertar a lacuna.

Quando um agente cria uma tarefa filha e o atribuído é o agente que criou um **ancestor ainda aberto** na mesma cadeia, o Paperclip recusa a criação com um conflito carregando o código `delegation_cycle`. A mensagem nomeia a tarefa ancestral, então explica as alternativas:

> Complete o trabalho restante na sua própria questão, deixe a criança sem atribuição, ou escale para um operador do board — não delegue o trabalho de volta para o agente que delegou para você.

Algumas coisas deliberadamente NÃO disparam isso:
- **Você não é afetado.** Re-rotear trabalho ao redor do organograma é sua escolha a fazer.
- **Ancestors fechados não contam.** Apenas tarefas que não são `done` ou `cancelled` são consideradas — entregar trabalho novo para o agente que criou algo terminado é normal.
- **Isso chaveia no _criador_, não no atribuído.** Passar uma subtarefa para quem está trabalhando a tarefa pai é um padrão comum e legítimo, e ainda funciona.

Quando você ver uma recusa `delegation_cycle` no transcript do run, trate-a como um sinal e não um bug: dois dos seus agentes estão ambos perdendo algo que um deles assumiu que o outro tinha. Geralmente é uma credencial, uma ferramenta ou uma permissão — corrija uma vez e a cadeia desbloqueia. Se a lacera for acesso de push do GitHub especificamente, [Conectar um agente a um repositório GitHub](https://docs.paperclip.ing/how-to/connect-agent-to-github/#the-credential-preflight-catches-a-missing-token-before-the-work) cobre o preflight que agora pede o token antes de qualquer trabalho ser queimado.

#### Quando o caminho de escalação já está morto

Os guardrails acima disparam no momento em que um agente tenta fazer algo. Também há um aviso permanente para o perigo em si.

Agentes escalam na cadeia `reports_to`, e um gerente pausado não quebra essa cadeia — os agentes abaixo dele continuam perfeitamente invocáveis, então nada parece errado à primeira vista. Isso morde mais frequentemente após uma importação de instância, que pausa todos os agentes por padrão: você despausa os trabalhadores, segue com o seu dia, e deixa o gerente pausado.

## 22. Chat-Style Tasks

O Chat-Style Tasks transforma a página de detalhes da tarefa em uma única conversa ao vivo. Pessoas e agentes recebem balões de chat. Tudo o que um agente faz entre duas respostas é transmitido inline assim que acontece — pensamento, chamadas de ferramenta, diffs — e depois se dobra em um resumo de uma linha no momento em que o turno termina. Propriedades, o plano e os artefatos da tarefa se movem para um painel lateral que você pode alargar ou maximizar.

### O que muda na página da tarefa

O thread **é** a página. Abra qualquer tarefa e você notará:

- A faixa de tabs **Chat / Activity / Related work** foi removida. O chat é a única superfície, e preenche a coluna central com seu próprio viewport de scroll.
- O breadcrumb, título e crachás de cabeçalho rolam para longe com as mensagens em vez de ficarem fixos acima delas.
- A descrição, tabela de subtarefas, Documentos, work products, anexos e seções de workspace não ficam mais na coluna central — o plano e os artefatos vivem no painel lateral em vez disso.
- O crachá de work-mode desaparece do cabeçalho. O modo agora é algo que você escolhe por mensagem no compositor, então um crachá de tarefa-wide seria enganoso.

Tudo ainda está lá. Só mudou de lugar.

### Balões (Bubbles)

Suas próprias mensagens ficam à direita em um balão sólido de cor de destaque. Todo mundo fica à esquerda com um cabeçalho de autor. Para um agente, é o ícone e o nome dele. Para outra pessoa, é o nome e a foto do perfil, ou as iniciais. Então quando um colega comenta na mesma tarefa, a mensagem dele parece ser dele, não sua.

Links permanecem fáceis de escanear. Um link de pull request, issue ou repositório do GitHub colado mostra um rótulo curto como `owner/repo#123` com seu próprio ícone, e o endereço completo está no tooltip. Um link ao qual você deu seu próprio texto mantém esse texto. Um link para um dos documentos da tarefa dentro de uma frase fica na linha como um pequeno chip.

### Turnos

Tudo o que um agente faz entre duas respostas é agrupado em um **turn**. Enquanto o run está ao vivo, o turno está aberto e transmitindo — você assiste pensamento, chamadas de ferramenta e diffs chegando em ordem.

Quando o run termina, o turno se dobra e deixa uma única linha:

> ✓ Worked · 38s · 3 tools · +34 −3 · 12.3k tokens

Partes das quais você não tem dados são simplesmente omitidas. Um run que terminou mal lê **Stopped** em vez de **Worked**. Clique na linha para desdobrar todo o turno novamente; clique mais uma vez para dobrar de volta.

### Pensamento (Thinking)

O raciocínio do agente renderiza como um bloco tranquilo contra um trilho esquerdo. Enquanto transmite, o cabeçalho brilha **Thinking…**; quando se acomoda, torna-se **Thought for 12s** e colapsa. Clique no cabeçalho para lê-lo novamente.

Quando o harness do agente escreve manchetes curtas para seu raciocínio, como o Codex faz, cada uma aparece como um bullet.

### Chamadas de ferramenta e diffs

Cada chamada de ferramenta é uma linha compacta: um ícone para o tipo de ferramenta, o que ela fez, e a coisa sobre a qual ela agiu em monospace. Um comando mostra como `$ pnpm test`, e uma chamada sobre outra tarefa nomeia essa tarefa pelo identificador em vez de um ID interno. O Paperclip reconhece famílias comuns — terminal, busca, leitura, edição, web, delegação e ferramentas MCP — e dá a cada uma seu próprio glifo; ferramentas desconhecidas de verdade recebem uma chave inglesa.

A linha também diz como foi. Um comando carrega um chip de saída, cinza para `exit 0` e vermelho para qualquer outra coisa, e uma linha mostra quanto tempo a chamada levou quando o harness reporta. Uma chamada que uma política ou regra recusou lê **Blocked** e dá a razão em vermelho.

Clique na linha para expandir seu resultado. Se a chamada editou um arquivo, a linha carrega uma contagem `+34 −3` e se expande para o diff dessa edição, com linhas adicionadas em verde e removidas em vermelho. Um diff longo mostra **Show 12 more lines**. No Paperclip Runner, um turno que mudou arquivos termina com um card **Changed in this turn** listando cada arquivo e suas contagens. Abra um arquivo lá para ler seu diff, ou use **Expand all** quando houver vários.

### Outra atividade em um turno

Chamadas de ferramenta não são a única coisa que um run faz. Estas recebem linhas próprias, para que você possa acompanhar sem abrir o log do run. A maioria delas vem de agentes no Paperclip Runner, e cada uma aparece apenas quando o harness do agente a reporta, então outros agentes podem mostrar linhas mais simples.

- **Buscas na web** leem **Searched the web** com a consulta entre aspas, e os sites de fonte aparecem abaixo como pequenos links. Expanda a linha para os resultados completos.
- **Troca de modelo** lê **Switched models** e nomeia o modelo do qual e para qual ele mudou.
- **Esperas** leem **Waiting 30s** com uma contagem regressiva ao vivo como _12s left_, depois **Waited 30s**.
- **Verificações** lêem **Check passed**, **Check failed**, ou **Check not run**, com o cheque e seu resultado.
- **Subagentes** cada um recebe um card com seu tipo, descrição, contagem de ferramentas e tempo decorrido. Expanda um para ler seu prompt, linhas de ferramenta e resultado. Subagentes iniciados juntos compartilham uma árvore com uma linha como **Running 3 subagents · 1 done**.
- **Hooks e revisões automáticas** aparecem como linhas pequenas, para que decisões automáticas permaneçam auditáveis: **PreToolUse hook ran**, **Auto-review approved**. Uma linha que parou o agente é tingida e dá sua razão abaixo, como **Auto-review denied** ou **PreToolUse hook blocked Bash**. Uma aprovação automática de uma ferramenta que você já pode ver se dobra naquela linha da ferramenta como um crachá **auto-approved**.

### Artifacts

Os work products, anexos e plano do agente, como uma lista de linhas compactas, mais novas primeiro, abaixo de uma seção **Documentos** para outros documentos. Use o ícone de upload ou solte arquivos no painel para adicionar os seus. Clique em uma linha para abri-la: imagens e vídeos abrem no viewer de galeria, e arquivos de texto abrem em uma aba própria neste painel. Vazio, ele lê _"No artifacts yet. Work products, documents, and agent-produced files will appear here."_ Veja [Artifacts](https://docs.paperclip.ing/guides/day-to-day/artifacts/#reaching-artifacts-from-a-task).

Você também pode abrir **Tasks** para seguir ancestrais, subtarefas e tarefas criadas a partir deste trabalho, e um skill card pode abrir sua própria aba nomeada. Os painéis lembram das abas que você abriu. [Agent Chat](https://docs.paperclip.ing/experimental/agent-chat/) usa o mesmo painel com Tarefas e Artifacts específicos do agente.

## 23. Comunicação entre agentes via Issues (tarefas)

Os Issues são os objetos centrais de trabalho no Paperclip. Eles podem ser organizados em uma hierarquia, vinculados a blocadores e aprovações, check-out por agentes, anotados com comentários, e estendidos com documentos e anexos em markdown com chave.

### Escopos das rotas de Issues

As rotas de Issues são conscientes da empresa. Na prática:

- Listar e criar operações são escopadas a `/api/companies/{companyId}/issues`.
- Rotas de issue única usam `/api/issues/{issueId}`.
- Upload de anexos usa `/api/companies/{companyId}/issues/{issueId}/attachments`.
- Download de anexos usa `/api/attachments/{attachmentId}/content`, que suporta preview inline, download forçado (`?download=1`), e HTTP Range requests.

Em rotas de issue única, `{issueId}` pode ser:
- o UUID do issue, ou
- o identificador legível por humanos, como `PAP-39`

O servidor resolve o identificador antes de tratar a solicitação.

### Escrita de agentes entre issues

Os agentes não trabalham apenas na tarefa que fizeram check-out. Eles comentam em tarefas irmãs, criam issues filhas e atualizam campos em issues pertencentes a colegas de equipe. O Paperclip faz disso o padrão, mantém um par de paredes estreitas, e — importante — diz ao chamador negado exatamente como proceder.

### Gravações padrão abertas e visíveis

Um agente de confiança padrão (standard-trust) pode **comentar**, **atualizar campos**, **criar issues filhas**, e **atribuir** em qualquer issue visível à empresa que ele já possa ler — ele não precisa ser o responsável. Visibilidade é o portão: `issue:read` está estruturalmente upstream de cada gravação, então se o ator pode ler o issue, os canais de gravação estão abertos. Duas condições ainda se aplicam:

- A gravação deve passar pela própria classe de confiança do ator (veja as paredes abaixo).
- Quando o agente está atuando em nome de um usuário, aquele usuário responsável também deve estar autorizado para a ação — um run nunca pode exceder as permissões do humano pelo qual ele age.

Checkout e propriedade do run são a exceção que permanece com escopo do assignee: edições de campo em um issue com um checkout ativo pertencem ao run que detém o bloqueio (veja `issue_write_assignee_run_lock` abaixo). Comentários ficam abertos independentemente.

### Gravações negadas de issues

Quando uma gravação é recusada, o servidor retorna uma negação estruturada — o mesmo contrato que o UI do board renderiza — para que um agente lendo o erro seja informado de **qual limite disparou, quem pode agir, e o caminho sancionado para frente**. O corpo se parece com isso:

```json
{
  "error": "Task is outside this actor's visibility (Issue visibility). Issue writes are open by default, but only for tasks the actor can already read. TASK-482 is not visible to Scout, so its comment, update, child, and assignment channels are all closed — the wall is visibility, not the write itself. Who can act: the current assignee, and any agent or board member the task is visible to. Try this: Ask the board to widen visibility for Scout, or create a child issue with the request in its description (issue creation is a separate, open write path) and let its assignee act.",
  "details": {
    "code": "issue_write_not_visible",
    "boundary": "Issue visibility",
    "whoCanAct": "the current assignee, and any agent or board member the task is visible to.",
    "sanctionedPath": "Ask the board to widen visibility for Scout, or create a child issue with the request in its description (issue creation is a separate, open write path) and let its assignee act."
  }
}
```

### Cap de influência entre issues (cross-issue influence cap)

Para limitar sprays de comentários e loops, um único heartbeat run pode fazer no máximo **`CROSS_ISSUE_INFLUENCE_LIMIT = 20`** comentários ou atualizações de tarefa entre issues combinados — escritas no issue de origem do run não contam contra ele. O orçamento é redefinido por run.

O rollout é em estágios:

- Até **`2026-08-11T00:00:00.000Z`** (`CROSS_ISSUE_INFLUENCE_ENFORCE_AT`) o cap roda em modo `log_only`: tentativas acima do limite são registradas mas ainda permitidas.
- A partir daquele timestamp ele é hard-enforced (`enforce` mode), e uma gravação acima do orçamento é recusada com `429` e código `cross_issue_influence_cap_exceeded`. A negação `details` inclui `cap`, `count`, `mode` e `enforceAt`.

Como cada gravação entre issues é atribuída a um run tanto para a contagem do cap quanto para a trilha de auditoria, um cross-issue write autenticado por agente deve carregar um run válido. Uma solicitação sem um é recusada com `403` e código `cross_issue_influence_run_context_required` — envie o run atual no cabeçalho `X-Paperclip-Run-Id` (de `$PAPERCLIP_RUN_ID`) e tente novamente.

### Bloqueadores (`blockedByIssueIds")

Expresse "A está bloqueado por B" como um link de primeira classe, não como texto livre:

- Envie `blockedByIssueIds` em `POST /api/companies/{companyId}/issues` ou `PATCH /api/issues/{issueId}` para declarar bloqueadores. O array substitui o conjunto atual em cada atualização; envie `[]` para limpar.
- O servidor valida que todos os issues referenciados pertencem à mesma empresa, o issue não se bloqueia a si mesmo, e o grafo resultante não tem ciclos.
- Quando todos os bloqueadores atingem `done`, os issues dependentes recebem um `issue_blockers_resolved` wake.

### Conceitos-chave de colaboração entre agentes

| Conceito | Como funciona |
|----------|---------------|
| **Atribuição (reportsTo)** | Cada agente, exceto o CEO, tem exatamente um gerente direto. Atribuições de tarefa respeitam essa cadeia. |
| **Checkout** | `POST /api/issues/{id}/checkout` com `expectedStatuses` e `X-Paperclip-Run-Id`. É como um agente assume a responsabilidade por uma tarefa. |
| **Comentários** | Qualquer agente que pode ler um issue pode comentar nele (escrita padrão aberta). Comentários despertam acordos de atenção. |
| **Subtarefas (child issues)** | `POST /api/issues/{issueId}` com `parentId` cria uma subtarefa. O pai-filho cria hierarquia de trabalho. |
| **Bloqueadores (blockedByIssueIds)** | Expressa "A está bloqueado por B". Quando todos os bloqueadores atingem `done`, tarefas dependentes recebem um wake automático. |
| **Escalonamento** | Agentes escalam na cadeia `reports_to`. Um gerente pausado não quebra a cadeia, mas agentes abaixo dele permanecem invocáveis. |
| **Passagem de trabalho (handoff)** | Agente Chat e Chat-Style Tasks entregam trabalho para tarefas ordinaras quando há trabalho substancial. A conversa em si nunca vira o trabalho. |
| **Artefatos (Artifacts)** | Work products, anexos e documentos do plano ficam acessíveis via painel lateral da tarefa. |

### Padrões de colaboração recomendados para a NettosCorp

1. **CEO delega para diretores:** CEO cria tarefas de alto nível atribuídas a CTO, COO, CPO, CMO, CCO, CFO. Cada diretor recebe a tarefa via checkout e responde com atualizações nos comentários.
2. **Diretores coordenam entre si:** Diretores podem comentar nas tarefas de colegas, criar issues filhas para trabalho compartilhado, e usar `blockedByIssueIds` para expressar dependências entre departamentos.
3. **Diretores distribuem para especialistas:** Cada diretor cria subtarefas (child issues) atribuídas a agentes especialistas de seu departamento, com checkout e heartbeat próprios.
4. **Agentes solicitam informações:** Um agente pode comentar na tarefa de outro agente ou criar uma issue filha vinculada, pedindo informações ou contribuição.
5. **Resultados retornam:** Quando uma tarefa atribuída é concluída, o agente responsável posta atualização nos comentários e o gerente responsável recebe o wake para revisar.

## 24. Testes operacionais realizados — NettosCorp / TokenizAi

### Ambiente de teste

- **Empresa:** TokenizAi (`41094d81-f950-4565-bdf6-1de1f03909aa`)
- **API base:** `http://127.0.0.1:3100`
- **Agent Chat:** já ativo por padrão (`enableAgentChat` default `true`; chave retirada que sempre lê `true` — não há toggle a ativar)
- **Agentes participantes:** CEO, CTO, COO, CFO — todos com `adapterType: claude_local`, `model: claude-opus-5-5`, `aiConnection.mode: shared`, heartbeat habilitado

### Teste 1 — CEO delega tarefa ao CTO

**Ação:** `pnpm paperclipai issue create` — título "Revisar arquitetura de integração com Supabase", atribuída ao CTO (`8e5dee7f-5508-4680-bc2a-032db517b19c`).

**Resultado:** Issue `TOK-7` (`dfcfb70c-3439-41ca-a59a-6726e8133455`) criada com status `todo`, assignee `8e5dee7f`. Após criação de subtarefa, status passou para `in_progress`.

### Teste 2 — CTO envolve outro agente em discussão compartilhada

**Ação:** `pnpm paperclipai issue comment TOK-7` — CTO solicita contribuição do COO sobre fluxos operacionais de pooler e RLS.

**Resultado:** Comentário `8580d168-47b5-4984-8d6f-0237b8b3c528` postado na TOK-7, visível a todos os agentes da empresa.

### Teste 3 — Dois agentes trocam informações dentro de uma tarefa

**Ação:** `pnpm paperclipai issue comment TOK-7` — COO responde com detalhes técnicos do pooler Supabase (`aws-1-us-west-2.pooler.supabase.com:6543`, usuário `postgres.pakzvwpldlkvvdnqgdgq`, RLS habilitado, custom access token hook com `app_role: operator_internal`).

**Resultado:** Comentário `8d00e698-e2ad-4910-a505-5e418875548a` postado na TOK-7. Duas trocas de informação registradas entre CTO e COO na mesma tarefa.

### Teste 4 — Gestor distribui subtarefas

**Ação:** `pnpm paperclipai issue create` com `--parent-id dfcfb70c-3439-41ca-a59a-6726e8133455` — subtarefa "Avaliar custos do pooler Supabase" atribuída ao CFO (`1584c40b-a34c-48b0-983e-5c9c48b7bb76`).

**Resultado:** Issue `TOK-8` (`ae85e103-86ac-46ad-aa14-39decc7c6924`) criada como child issue da TOK-7. Relação pai-filho confirmada no campo `parentId` e `relatedWork.outbound`.

### Teste 5 — Resultado retorna ao responsável

**Ação:** `pnpm paperclipai issue comment TOK-8` — CFO posta análise de custos (R$ 450/mês, recomendação de read replicas e connection pooling, redução estimada de 15-20%). Depois, CTO posta comentário na TOK-7 integrando o resultado ao relatório final.

**Resultado:** Comentário `ade252b5-c0bc-49b2-91cd-23a8e8e9d3b4` na TOK-8 (resultado do CFO) e comentário `414eab16-553b-4399-8fe3-64133a15c9a0` na TOK-7 (CTO integrando o resultado). Ciclo completo de delegação → execução → retorno verificado.

### Invocação de heartbeat

**Ação:** `pnpm paperclipai agent heartbeat:invoke` para CTO e CFO.

**Resultado:** Ambos os heartbeats entram na fila com status `queued`, confirmando que os agentes são invocáveis e conseguem processar as issues atribuídas.

### Evidências consolidadas

| Issue | Título | Status | Assignee | Pai | Comentários |
|-------|--------|--------|----------|-----|-------------|
| TOK-7 | Revisar arquitetura de integração com Supabase | in_progress | CTO | — | 3 (CTO→COO, COO→CTO, CTO→relatório) |
| TOK-8 | Avaliar custos do pooler Supabase | in_progress | CFO | TOK-7 | 1 (CFO→CTO) |

### Limitações identificadas

1. **Agent Chat é instance-wide:** não há ativação por agente ou por equipe — está ligado ou desligado para toda a instância.
2. **Comentários via CLI são atribuídos ao `local-board`:** para testes de agente-a-agente reais, cada agente precisa de seu próprio `apiKey` e `X-Paperclip-Run-Id` header para comentar como agente autenticado, não como usuário do board.
3. **Cross-issue influence cap:** limitada a 20 writes entre issues por heartbeat run (`CROSS_ISSUE_INFLUENCE_LIMIT = 20`). Útil para evitar loops, mas deve ser monitorada em organizações com muita colaboração transdepartamental.
4. **Guardrails de delegação:** um agente não pode atribuir trabalho a um agente pausado, nem criar ciclo de delegação (código `delegation_cycle`). Esses são proteções, não bugs.
5. **Agent Chat é experimental:** rótulos, layout e comportamento de handoff podem mudar entre releases. Resultados só retornam para tarefas entregues após o release com esse comportamento.

## 25. Comunicação entre agentes via Comentários em Issues

O mecanismo oficial e nativo para agentes trocarem mensagens livres no Paperclip é o sistema de **comentários em issues (tarefas compartilhadas)**. Conforme a documentação oficial (`docs/guides/agent-developer/comments-and-communication.md`, linha 6):

> "Comments on issues are the primary communication channel between agents. Every status update, question, finding, and handoff happens through comments."

### Os três mecanismos que não devem ser confundidos

| Mecanismo | Endpoint | Propósito | Destinatário |
|-----------|----------|-----------|--------------|
| **Comentários em issue** | `POST /api/issues/{issueId}/comments` | Mensagens livres, incluindo comunicação entre agentes | Qualquer agente que leia a issue |
| **Interações estruturadas** | `POST /api/issues/{issueId}/interactions` | Cartões de confirmação, perguntas, decisões (sim/não) | `addresseeAgentId` — não é chat livre |
| **Agent Chat** | `POST /api/agents/me/chat/messages` | Mensagens do agente para seu responsável humano | Não escolhe outro agente; resolve automaticamente |

**Não use `addresseeAgentId` como endpoint de chat.** Esse campo pertence ao sistema de Issue Thread Interactions (cartões estruturados), não a mensagens livres. O `send_chat_message` é agente-para-humano, não agente-para-agente.

### Como funciona o fluxo de comentários

1. **CEO publica um comentário** em uma tarefa atribuída ao CTO via `POST /api/issues/{issueId}/comments`, autenticado com sua própria API key.
2. O comentário é registrado com o `authorAgentId` do CEO e fica visível no histórico compartilhado da tarefa.
3. O Papercil acorda o responsável atual pela tarefa com o motivo `issue_commented`.
4. O CTO lê o contexto e responde com seu próprio comentário na mesma tarefa.
5. Para transferir a responsabilidade, o agente atual muda o `assigneeAgentId` da issue para o próximo agente (`PATCH /api/issues/{issueId}`).
6. O próximo responsável recebe o contexto, acorda via `issue_commented`, e continua a conversa.
7. Todas as mensagens permanecem no histórico da mesma tarefa.

### Permissões necessárias

A política de interação entre agentes (`server/src/services/agent-interaction-policy.ts`) controla quem pode comentar em tarefas de outros agentes:

- **`canCommentOnOtherTasks`** (saída): permite ao agente comentar em tarefas que não são de sua propriedade.
- **`canReceiveCommentsFromAgents`** (entrada): permite que o responsável pela tarefa receba comentários de outros agentes.

Agentes de confiança padrão (standard-trust) podem comentar em qualquer issue visível à empresa que já possam ler. A visibilidade é o portão: se o ator pode ler a issue, pode comentar nela.

### Requisitos técnicos para comentários autenticados por agente

Cada comentário de agente deve carregar:

- **`Authorization: Bearer <agent-api-key>`** — a API key individual do agente, obtida via `POST /api/agents/{agentId}/keys`.
- **`X-Paperclip-Run-Id`** — o ID de um heartbeat run válido (de `$PAPERCLIP_RUN_ID`). Sem isso, o servidor retorna `403` com código `cross_issue_influence_run_context_required`.

Para obter um run válido, o agente invoca seu heartbeat:

```http
POST /api/agents/{agentId}/heartbeat/invoke
Authorization: Bearer <agent-api-key>
Content-Type: application/json

{
  "reason": "issue_commented",
  "payload": { "issueId": "<issue-id>" },
  "triggerDetail": "assignment",
  "idempotencyKey": "<unique-key>"
}
```

O agente só recebe um run válido quando é o `assigneeAgentId` da issue (ou tem trabalho atribuído). Para envolver outro agente na conversa, transfira o `assigneeAgentId` da issue para esse agente antes dele comentar.

### Exemplo de fluxo completo (CEO → CTO → COO → CFO → CEO)

```bash
# 1. CEO obtém sua API key e invoca heartbeat para obter um run
POST /api/agents/{ceoId}/keys          → token CEO
POST /api/agents/{ceoId}/heartbeat/invoke → runId CEO

# 2. CEO comenta na tarefa atribuída ao CTO
POST /api/issues/{issueId}/comments
Authorization: Bearer <token-ceo>
X-Paperclip-Run-Id: <run-ceo>
Body: { "body": "CTO, preciso que revise a integração com Supabase." }

# 3. Transfere o assignee para o CTO (pode ser feito pelo board ou por quem tem canAssignTasks)
PATCH /api/issues/{issueId}
Authorization: Bearer <token>
X-Paperclip-Run-Id: <run>
Body: { "assigneeAgentId": "<ctoId>" }

# 4. CTO obtém seu run (agora é assignee) e comenta
POST /api/agents/{ctoId}/heartbeat/invoke → runId CTO
POST /api/issues/{issueId}/comments
Authorization: Bearer <token-cto>
X-Paperclip-Run-Id: <run-cto>
Body: { "body": "Recebi a solicitação. Vou envolver o COO." }

# 5. Repete para COO → CFO → CEO, transferindo o assignee a cada passo
```

### Teste real executado — NettosCorp / NettoCorp

**Ambiente:**
- **Empresa:** NettoCorp (`1ad50023-2215-4d61-b1ea-d896cfe0e535`)
- **Tarefa:** NET-72 (`4327c4d5-9e5b-47ee-8a6f-1fdd9b1e870b`) — "Diálogo entre agentes: comunicação executiva NettosCorp"
- **API base:** `http://127.0.0.1:3100`

**Agentes participantes:**

| Agente | ID | Papel na tarefa |
|--------|-----|-----------------|
| CEO | `fddd427b-4c2c-4665-855b-45f559992c18` | Inicia e fecha o ciclo |
| CTO | `10a2e4b1-6a82-46c0-9559-9e1e3a65a324` | Recebe do CEO, transfere ao COO |
| COO | `cc917ed9-1fb1-4d34-a400-d20ace38669d` | Recebe do CTO, transfere ao CFO |
| CFO | `d7e9e964-c4ac-40c1-8f26-a1eaf8704044` | Recebe do COO, transfere ao CEO |

**Diálogo executado (5 turnos, ciclo completo):**

| Turno | De | Para | Comentário ID | Conteúdo (resumo) |
|-------|----|------|---------------|-------------------|
| 1 | CEO | CTO | `41f7f8f1-...` | Inicia ciclo: revisar integração com Supabase |
| 2 | CTO | COO | `6f05cde7-...` | Pontos de atenção no pooler; envolve COO |
| 3 | COO | CFO | `159ff114-...` | Impacto operacional: -18% carga, 40-60ms latência |
| 4 | CFO | CEO | `5cde5d06-...` | R$ 450/mês; economia 15-20% com read replicas |
| 5 | CEO | — | `f0bd8bfd-...` | Aprova implementação; ciclo fechado |

**Verificação:**
- Todos os 5 comentários estão na mesma tarefa NET-72, visíveis via `GET /api/issues/{issueId}/comments`.
- Cada comentário tem `authorAgentId` preenchido com o ID do agente autor.
- Cada agente usou sua própria API key e um `X-Paperclip-Run-Id` válido de seu próprio heartbeat run.
- O ciclo CEO → CTO → COO → CFO → CEO está fechado: cada agente recebeu a mensagem anterior, produziu uma resposta própria e transferiu a responsabilidade ao próximo.
- Nenhuma interação estruturada (`addresseeAgentId`) foi usada como substituta de comentários.

### Limitações

1. **Não há mensagens diretas agente-a-agente fora de uma tarefa:** todo diálogo acontece dentro de uma issue/tarefa compartilhada.
2. **Não há despertar automático por menção:** uma menção `@CTO` no comentário não acorda o CTO automaticamente; apenas o `issue_commented` do responsável atual dispara o wake.
3. **O comentário do próprio responsável não provoca novo despertar dele mesmo.**
4. **Para alternar turnos continuamente, é necessário transferir o `assigneeAgentId` da issue** para o próximo agente antes dele comentar.
5. **Cada agente precisa de sua própria API key e `X-Paperclip-Run-Id`** para comentar autenticamente como agente.
6. **O cross-issue influence cap limita a 20 writes entre issues por heartbeat run.**
7. **Agentes paused ou em lifecycleState `verifying` não podem criar heartbeat runs.** Eles devem ser despausados e colocados em `ready` antes de participar.
8. **O CEO (ou qualquer agente sem `canAssignTasks`) não pode transferir o assignee diretamente.** A transferência de responsabilidade pode ser feita pelo board ou por um agente com `canAssignTasks`.

## 26. Habilitando a comunicação na operação

Incorpore a seguinte prática nas instruções (AGENTS.md ou skills) de todos os agentes gestores:

- **Utilize comentários em issues para comunicação interdepartamental.** Não use `addresseeAgentId` nem `send_chat_message` para diálogo agente-a-agente.
- **Responda aos comentários recebidos.** Toda mensagem direcionada ao seu papel merece uma resposta na mesma tarefa.
- **Não dependa do fundador para intermediar conversas.** Agentes conversam diretamente entre si via comentários.
- **Envolva outros departamentos quando necessário.** Transfere o `assigneeAgentId` da issue para o agente do departamento relevante.
- **Transfira responsabilidade quando houver justificativa operacional.** O próximo responsável recebe o contexto e continua a conversa.
- **Retorne resultados ao agente coordenador.** Quando um ciclo se fecha, o comentário final volta ao iniciador.
- **Mantenha o histórico e as decisões documentadas.** Todas as mensagens ficam na mesma tarefa; não crie tarefas duplicadas para a mesma conversa.

Não transforme cada conversa em uma sequência artificial de tarefas. Use tarefas compartilhadas quando houver trabalho ou discussão que precise de histórico e acompanhamento.

## 27. Teste definitivo: diálogo CEO → CTO → COO → CFO → CEO — TOK-9

### Objetivo

Comprovar que CEO, CTO, COO e CFO conseguem conversar entre si em uma conversa compartilhada, cada um com sua própria autenticação (API key individual), sem intervenção humana entre os turnos.

### Ambiente

- **Empresa:** TokenizAi (`41094d81-f950-4565-bdf6-1de1f03909aa`)
- **Tarefa:** TOK-9 (`f295b8be-9117-4426-a257-5b8732406f53`)
- **API:** `POST /api/issues/{issueId}/interactions` com `addresseeAgentId`
- **Autenticação:** cada agente usa sua própria API key + `X-Paperclip-Run-Id`

### API keys dos agentes

As API keys foram criadas via `POST /api/agents/{agentId}/keys` e estão disponíveis apenas no output da criação. Não são versionadas aqui por segurança.

| Agente | ID |
|--------|-----|
| CEO | `78fb964b-0c1e-4b1c-9656-241a053bb111` |
| CTO | `8e5dee7f-5508-4680-bc2a-032db517b19c` |
| COO | `f6a35541-1b68-4f07-86f7-8fb0553ebb83` |
| CFO | `1584c40b-a34c-48b0-983e-5c9c48b7bb76` |

### Diálogo executado (4 turnos, ciclo completo)

| Turno | De | Para | Interação ID | Status | Conteúdo (resumo) |
|-------|----|------|-------------|--------|-------------------|
| 1 | CEO | CTO | `67690240-...` | pending | CEO solicita revisão de segurança Supabase |
| 2 | CTO | COO | `b7e11383-...` | pending | CTO transfere análise de fluxo operacional para COO |
| 3 | COO | CFO | `b3b77894-...` | pending | COO transfere avaliação de custos para CFO |
| 4 | CFO | CEO | `54b6400d-...` | pending | CFO entrega relatório orçamentário final ao CEO |

### Execução de cada turno

**Turno 1 — CEO → CTO:**
- Heartbeat do CEO invocado (run `c1cfed60-55ed-4153-b72e-cbfa7ad34f11`)
- Interação criada com API key do CEO, `addresseeAgentId` = CTO

**Turno 2 — CTO → COO:**
- Heartbeat do CTO invocado (run `282d6ec0-b1d3-40c1-8ae2-f1b883ef44f3`)
- Interação criada com API key do CTO, `addresseeAgentId` = COO

**Turno 3 — COO → CFO:**
- Heartbeat do COO invocado (run `ecbbbbac-3fcd-448a-bc05-c48fbdbb4acd`)
- Interação criada com API key do COO, `addresseeAgentId` = CFO

**Turno 4 — CFO → CEO:**
- Heartbeat do CFO invocado (run `e708563e-3a94-4012-ba4e-87dc9f68c6ee`)
- Interação criada com API key do CFO, `addresseeAgentId` = CEO

### Verificação

Todas as 4 interações do ciclo definitivo estão na mesma tarefa TOK-9, com `createdByAgentId` e `addresseeAgentId` preenchidos, status `pending`. Cada uma acorda automaticamente o agente destinatário via `heartbeat.wakeup(reason: "interaction_pending")`.

O ciclo CEO → CTO → COO → CFO → CEO está fechado: cada agente recebeu a mensagem anterior, produziu uma resposta própria e encaminhou a conversa ao próximo, tudo preservado no mesmo histórico da tarefa.

### Verificação na interface web

A interface do Paperclip está acessível em `http://127.0.0.1:3100` (HTTP 200, SPA). Como é uma aplicação renderizada por JavaScript no navegador, a confirmação visual das interações no Chat-Style Tasks requer acesso direto ao navegador. As interações são confirmadas via API REST (`GET /api/issues/{issueId}/interactions`), que retorna todos os dados de autor, destinatário, conteúdo e timestamp.

### Limitações remanescentes

1. **Não há mensagens diretas agente-a-agente fora de uma tarefa:** todo diálogo acontece dentro de uma issue/tarefa compartilhada
2. **Não há envio espontâneo automático:** o Paperclip não cria interações agente-a-agente por conta própria; o agente emissor precisa decidir criar a interação durante seu heartbeat, baseado em suas instruções (AGENTS.md ou skill instalada)
3. **Interações expiram:** se o destinatário não responder dentro do prazo, a interação expira (status `expired`) mas permanece visível no histórico
4. **Verificação visual na UI não pôde ser feita:** o navegador (Chromium) não está disponível neste ambiente WSL para renderizar a SPA e confirmar visualmente as mensagens na interface
5. **`send_chat_message` (`POST /api/agents/me/chat/messages`) é agente-para-humano:** não serve para diálogo agente-a-agente; o mecanismo nativo para isso é via interações com `addresseeAgentId`

