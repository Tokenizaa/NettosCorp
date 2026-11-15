# Plano de Execução — Integração dos Agentes Paperclip ao Telegram

**Data:** 15 de novembro de 2026  
**Status:** Em execução — Etapa B concluída; piloto pelo router independente decidido  
**Repositório:** `Tokenizaa/NettosCorp`  
**Branch:** `docs/telegram-paperclip-integration-plan`

## 1. Objetivo

Disponibilizar no grupo Telegram já criado pela NettosCorp a participação dos agentes reais que já existem no Paperclip, permitindo ao fundador conversar com agentes individualmente e acompanhar a colaboração da equipe.

A solução deve preservar os dois sistemas e suas responsabilidades:

- **Hermes:** mantém seu agente, Gateway, bot, sessões, voz e integração Telegram atuais. Sua comunicação individual já funcional não deve ser interrompida.
- **Paperclip:** continua sendo o plano de controle dos agentes, hierarquia, atribuições, tarefas, execução e acompanhamento. Deve usar sua própria integração/bot Telegram, se tecnicamente compatível.
- **Telegram:** interface compartilhada de comunicação; não substitui o Paperclip como fonte operacional das tarefas nem o GitHub como fonte documental institucional.
- **GitHub:** fonte versionada de arquitetura, decisões, documentação, código e evidências.

Não criar agentes duplicados, uma organização paralela ou um novo sistema de orquestração. Reutilizar os agentes Paperclip existentes.

## 2. Arquitetura-alvo e limites

### 2.1 Separação dos gateways

A arquitetura preferencial é:

1. Hermes continua conectado ao Telegram pelo Gateway que já funciona.
2. Paperclip utiliza conector Telegram próprio, com bot/token separado.
3. Os dois bots participam do mesmo grupo existente, sujeitos às permissões e limitações da Bot API.
4. As mensagens endereçadas a um agente Paperclip são associadas ao agente e ao fluxo de trabalho real do Paperclip.
5. Respostas devem identificar claramente o agente que as produziu.

**Regra crítica:** não reutilizar o token do bot Hermes no conector Paperclip. Um bot Telegram possui um único webhook configurado por vez; configurar outro webhook para o mesmo bot pode substituir o anterior e interromper o Gateway existente.

### 2.2 O que não se deve presumir

- Uma menção textual não prova que um agente executou uma tarefa.
- Uma resposta de confirmação do router (“acionado”) não é a resposta final do agente.
- Acordar um agente via API não comprova que ele recebeu contexto, executou e respondeu no grupo.
- Conectar um bot a um agente não significa automaticamente que todos os agentes estarão disponíveis no mesmo grupo.
- Não presumir que bots podem ler mensagens uns dos outros ou todas as mensagens de grupo.
- Não presumir que o conector nativo suporta todos os fluxos de grupo, tópicos, respostas coletivas ou continuidade desejados. Validar na versão instalada.
- Não marcar a integração como concluída com base apenas em testes unitários ou status visual “live”.

## 3. Descobertas técnicas que orientam a execução

A documentação oficial do Paperclip consultada para este plano informa que:

- Chat Connectors são uma funcionalidade experimental e precisam estar habilitados na instalação.
- A integração Telegram documentada associa uma conexão a um bot e a um agente.
- O conector utiliza webhook HTTPS público, configurado por `PAPERCLIP_CHAT_WEBHOOK_PUBLIC_URL`; a URL precisa ser alcançável pelo Telegram.
- A documentação lista as portas aceitas para webhook: 443, 80, 88 e 8443.
- O Telegram mantém um único webhook por bot.
- Em grupos, a configuração padrão de privacidade do Telegram limita quais mensagens o bot recebe; o comportamento efetivo deve ser testado com menções e permissões reais.

Referências oficiais:
- Paperclip — Telegram connector: https://docs.paperclip.ing/connectors/telegram/
- Paperclip — Connectors: https://docs.paperclip.ing/connectors/
- Telegram Bot API: https://core.telegram.org/bots/api

Estas referências descrevem o comportamento documentado, mas não comprovam que o recurso esteja habilitado ou disponível na instalação atual da NettosCorp. A versão instalada e a configuração real precisam ser verificadas pelo agente local.

## 4. Estado conhecido no início deste plano

### 4.1 Fatos confirmados no contexto do projeto

- O grupo Telegram já foi criado pelo fundador.
- O Hermes já conversa normalmente com o fundador pelo Telegram; preservar esse funcionamento é requisito obrigatório.
- Os agentes da equipe já existem no Paperclip; a tarefa é conectá-los, não recriá-los.
- Hermes consegue consultar a API do Paperclip.
- Foi relatada a implementação de um MVP independente com parser de menções `@AgentName`, wakeup via `POST /api/agents/{id}/wakeup`, router e bot Telegram independente.
- O fundador relatou ter invocado Ernst pelo Telegram e observado resposta. Isso é evidência operacional relatada, mas não substitui auditoria do código e teste ponta a ponta documentado.

### 4.2 O que a auditoria GitHub encontrou em 15/11/2026

- O plano institucional `empresa/02-organization/PLANO_IDENTIDADES_AGENTES_E_COMUNICACAO_TELEGRAM.md` existe e documenta identidade dos agentes, governança, comunicação Telegram, tópicos, segurança e integração com Paperclip.
- A busca no branch padrão por `independent_telegram_router_final.py` e `independent_telegram_bot.py` não encontrou esses arquivos.
- A busca por commits recentes relacionados à implementação do router também não identificou um commit específico.
- Portanto, o MVP deve ser tratado como **relatado/observado no ambiente local, mas ainda não localizado e auditado no repositório**. Não afirmar que está versionado até localizar os arquivos ou o commit correspondente.
- O histórico recente do repositório contém trabalho de implantação Paperclip/Hermes no Render, mas os commits, por si só, não comprovam que o serviço esteja implantado e publicamente alcançável agora.

Documento institucional relacionado:
- [Plano de identidades e comunicação Telegram](../../empresa/02-organization/PLANO_IDENTIDADES_AGENTES_E_COMUNICACAO_TELEGRAM.md)

## 5. Plano de execução

### Etapa A — Auditoria do código e documentação (GitHub)

Responsável principal: ChatGPT, com revisão e apoio de Hermes quando necessário.

1. Localizar o handoff local referido como `/home/lg/HANDOFF.md` e confirmar onde estão os arquivos do MVP.
2. Confirmar se os arquivos estão apenas no ambiente local, em branch não padrão, em outro repositório ou ainda não foram commitados.
3. Auditar parser, aliases, descoberta de agentes, chamadas Paperclip API, tratamento de erros, logs e prevenção de duplicidade/loops.
4. Comparar o MVP com o plano institucional e com a arquitetura-alvo deste documento.
5. Identificar o que pode ser mantido e o que precisa ser corrigido; não reescrever componentes funcionais sem evidência.
6. Adicionar testes automatizados para descoberta dinâmica dos agentes, múltiplas menções, identidade do remetente, erros de API, deduplicação e roteamento.
7. Documentar decisões técnicas e atualizar este plano com evidências, commits e pendências.

**Critério de saída:** código relevante localizado, auditado e rastreável; lacunas e correções identificadas. Não declarar integração operacional nesta etapa.

### Etapa B — Diagnóstico do ambiente real (Hermes/agente local)

Responsável principal: Hermes.

1. Consultar a instalação Paperclip em execução e registrar versão/commit.
2. Consultar a API e produzir inventário dos agentes reais: IDs, nomes, estado, hierarquia e disponibilidade. Não criar nem excluir agentes.
3. Verificar se Chat Connectors está disponível e habilitado na versão instalada.
4. Verificar se o conector Telegram nativo está presente e quais recursos de DM, grupo, menções, tópicos e respostas são realmente suportados.
5. Verificar a URL pública HTTPS do Paperclip e sua alcançabilidade pelo Telegram.
6. Confirmar se o ambiente atual é local, Render ou outro; não inferir a topologia a partir de documentos antigos.
7. Identificar o local seguro de configuração de segredos. Nunca imprimir, enviar ao GitHub ou registrar tokens no relatório.
8. Verificar a configuração do Gateway Hermes sem alterar seu bot, token, webhook, sessões ou comportamento.
9. Verificar o estado do MVP local e apresentar caminhos/commits para que possa ser auditado.

**Critério de saída:** diagnóstico com comandos/consultas executados, resultados observáveis, versão, limitações e recomendação técnica. Não incluir segredos.

### Etapa C — Escolha técnica

A escolha deve se basear no diagnóstico e na auditoria:

1. **Preferência:** conector nativo Paperclip, se a versão instalada oferecer o fluxo necessário no grupo.
2. **Complemento:** aproveitar o router MVP se preencher lacunas reais sem duplicar controle de tarefas ou respostas.
3. **Alternativa:** avaliar integração comunitária ou extensão somente se o conector nativo não suportar os requisitos essenciais.
4. Não criar uma camada paralela de estado de agentes/tarefas. Paperclip continua sendo a autoridade operacional.
5. Se o conector nativo exigir um bot por agente, estimar e validar essa limitação com um agente-piloto antes de decidir a expansão.
6. Se a instalação não tiver HTTPS público, resolver primeiro a exposição segura do webhook ou escolher uma alternativa oficialmente suportada. Não expor a API administrativa sem autenticação.

**Critério de saída:** decisão técnica curta, com evidências, limitações, riscos e componentes a reutilizar.

### Etapa D — Piloto com um agente Paperclip existente

Responsável principal: Hermes, acompanhado por auditoria independente.

1. Escolher um agente já existente e autorizado, preferencialmente um especialista técnico.
2. Criar/configurar um bot dedicado ao Paperclip, sem reutilizar o bot do Hermes.
3. Conectar o bot ao agente-piloto conforme o mecanismo suportado pela versão instalada.
4. Adicionar o bot ao grupo existente e configurar permissões mínimas necessárias.
5. Testar uma mensagem endereçada ao agente.
6. Confirmar no Paperclip que a mensagem foi associada ao agente correto e que houve execução real.
7. Confirmar que a resposta do agente chegou ao grupo e identifica corretamente sua origem.
8. Testar resposta a mensagem, menção, erro de execução, repetição da mensagem e reinício do serviço.
9. Verificar que Hermes continua respondendo pelo Gateway original.
10. Guardar evidências sem expor tokens, dados pessoais ou conteúdo sensível.

**Critério de saída:** demonstração ponta a ponta reproduzível, com correlação entre mensagem Telegram, agente/tarefa Paperclip, execução e resposta no grupo.

### Etapa E — Expansão controlada

Somente após aprovação do piloto:

1. Inventariar a estratégia de conexão para todos os agentes existentes.
2. Automatizar descoberta dos agentes pela API; evitar aliases hardcoded como fonte primária.
3. Configurar conexões adicionais de acordo com os limites reais do conector.
4. Definir regras de menção, participação por tópico e prevenção de respostas duplicadas.
5. Testar interações coletivas e entre agentes, sem presumir que bots podem conversar diretamente.
6. Manter a tarefa, atribuição e progresso registrados no Paperclip.
7. Publicar documentação de operação, recuperação de falhas e manutenção.

## 6. Critérios de aceitação finais

A integração somente poderá ser declarada concluída quando todos os itens aplicáveis forem comprovados:

- [ ] Hermes Gateway original continua operacional e sem regressão.
- [ ] O grupo existente é utilizado; não foi criado um grupo paralelo sem necessidade.
- [ ] Um agente real e preexistente do Paperclip recebe uma solicitação endereçada a ele.
- [ ] A solicitação chega ao agente correto, sem depender apenas de alias fixo não reconciliado.
- [ ] Existe registro verificável da execução no Paperclip.
- [ ] A resposta efetiva do agente retorna ao grupo e tem identidade inequívoca.
- [ ] O usuário consegue distinguir mensagem de confirmação do router de resposta final do agente.
- [ ] Erros, timeouts, duplicações e reentregas são tratados sem loops.
- [ ] O fluxo de grupo e tópicos foi validado na configuração real.
- [ ] A estratégia de acesso dos demais agentes está documentada e testada.
- [ ] Nenhum token ou segredo foi exposto no repositório ou logs.
- [ ] Código, documentação, commits e testes correspondem ao comportamento demonstrado.

## 7. Divisão de responsabilidades

| Responsável | Responsabilidade | Evidência esperada |
|---|---|---|
| **ChatGPT** | Auditoria independente do GitHub, análise de código/documentos, correções versionadas quando viáveis, testes, revisão de commits/PR e contraprova | Links de arquivos/commits/PR, diff revisado, resultados de testes e lista de pendências |
| **Hermes/agente local** | Inspeção do ambiente, acesso à API Paperclip, diagnóstico de versão e conectores, configuração Telegram, execução ponta a ponta, correções locais, commits e PR | Relatório técnico com comandos/resultados, IDs não secretos, logs sanitizados, IDs de tarefas e evidência de mensagem/resposta |
| **Fundador** | Definir prioridades, acompanhar evidências e deliberar sobre decisões reservadas e homologação da implantação | Decisão explícita quando necessária; aprovação do piloto/expansão |

A revisão do ChatGPT não substitui a contraprova do fundador. Da mesma forma, um relatório de Hermes não substitui evidência observável do funcionamento.

## 8. Próxima solicitação operacional a Hermes

Executar a **Etapa B em paralelo à Etapa A**, sem esperar a auditoria do GitHub terminar.

Entregar:

1. versão/commit da instalação Paperclip;
2. inventário atual dos agentes reais (ID, nome, estado e hierarquia);
3. estado e disponibilidade do conector Telegram nativo;
4. confirmação de URL HTTPS pública e webhook alcançável, sem revelar segredos;
5. confirmação de que o Gateway Hermes permanece intacto;
6. localização e estado dos arquivos do MVP e do `/home/lg/HANDOFF.md`;
7. recomendação de agente-piloto e procedimento exato de validação.

Não criar agentes, não excluir agentes, não trocar tokens/webhooks do Hermes e não iniciar implantação em massa nesta etapa. Diagnosticar e preparar o piloto; preservar serviços existentes.

## 9. Registro de execução

| Data | Etapa | Estado | Evidência / observação |
|---|---|---|---|
| 15/11/2026 | Auditoria GitHub inicial | Em andamento | Plano institucional localizado; arquivos do MVP não encontrados no branch padrão; commits recentes de Render identificados, sem comprovação de deploy atual. |
| 15/11/2026 | Diagnóstico local (Etapa B) | Concluída | Paperclip 2026.1106.0 / commit 6e6ba2ec58c24f258c6620aacc45251bab8077c0; 8 agentes inventariados; conector nativo presente no código, sem chat-endpoint; deployment private, sem túnel HTTPS/webhook; Hermes Gateway PID 213870 conectado; MVP e handoffs localizados fora do Git. |
| 15/11/2026 | Decisão técnica | Concluída | Priorizar piloto pelo router independente existente; adiar conector nativo até haver necessidade e HTTPS público. |\n| 15/11/2026 | Piloto Telegram | Aguardando execução | Orquestrador Global recomendado como piloto; exige prova de execução e resposta identificada no grupo. |

## 10. Histórico

- **v1.0 — 15/11/2026:** plano de execução, arquitetura-alvo, responsabilidades, descobertas iniciais, critérios de aceitação e sequência de implantação.

---

**Regra de conclusão:** priorizar fazer funcionar, mas não confundir velocidade com declarar sucesso sem prova. Trabalhar em paralelo, preservar as integrações existentes, testar primeiro um agente real e expandir somente com evidência.


## 11. Resultado do diagnóstico local — Etapa B (15/11/2026)

Diagnóstico executado por Hermes no ambiente local, em paralelo à auditoria GitHub. Resultados fornecidos com evidências operacionais; credenciais foram omitidas.

### 11.1 Paperclip em execução

- Versão reportada pela API `/api/health`: **2026.1106.0**.
- Commit: `6e6ba2ec58c24f258c6620aacc45251bab8077c0` (short `6e6ba2ec5`), branch `master`.
- Repositório local: `/home/lg/workspace/NettosCorp/NettosCorp/paperclip`.
- Servidor: PID `1591`, escutando em `127.0.0.1:3100`.
- Health: `status=ok`, `bootstrapStatus=ready`, `authReady=true`.
- Empresa NettosCorp: `88af1dda-ef60-41c4-851e-65e2b1f50a9f`.

### 11.2 Inventário dos agentes

Endpoint consultado: `GET /api/companies/{companyId}/agents`. Foram retornados **8 agentes**, todos com `adapterType=hermes_local`. O Orquestrador Global é a raiz (`reportsTo=null)); os outros sete reportam a ele.

| Agente | ID (prefixo) | Estado |
|---|---|---|
| Orquestrador Global | `7cebf5d9` | running |
| Frontend Developer | `cd15e7c6` | running |
| Software Architect | `f0d7dcc5` | running |
| Technical Writer | `3badd366` | running |
| Backend Architect | `c883cc49` | running |
| DevOps Automator | `4e4ad0f0` | idle |
| QA Engineer | `e8a4cb30` | running |
| Project Manager Senior | `6b89630b` | running |

Os estados acima são o snapshot reportado no momento da consulta, não uma garantia de disponibilidade contínua.

### 11.3 Conector Paperclip nativo

- Implementação Telegram presente em `packages/shared/src/app-definitions/telegram.json` e `server/src/services/chat-channels/telegram/`, registrada em `server/src/services/chat-channels/configuration.ts`.
- `GET /api/companies/{companyId}/chat-endpoints` retornou lista vazia: nenhum endpoint de chat Telegram foi provisionado para a empresa.
- Portanto, **código do conector presente não equivale a canal ativo/configurado**.

### 11.4 Rede e webhook

- `deploymentExposure=private`.
- Nenhum processo `cloudflared` ou `ngrok` estava ativo.
- Existe configuração local `.cloudflared/config.yml`, mas sem túnel em execução.
- `PAPERCLIP_CHAT_WEBHOOK_PUBLIC_URL` não está definida no ambiente.
- Conclusão: não há HTTPS público/webhook Telegram operacional neste ambiente no momento do diagnóstico.

### 11.5 Gateway Hermes

- Gateway ativo: PID `213870`.
- `HERMES_HOME=/home/lg/.hermes`.
- Socket e PID files presentes.
- Estado reportado: `gateway_state=running`, versão `0.23.0`, plataforma Telegram `connected`.
- **Requisito de preservação atendido no snapshot:** não foi relatada alteração no bot, token ou webhook do Gateway.

### 11.6 MVP e handoffs locais

Localizados, mas fora do repositório e sem versionamento Git:

- `/home/lg/HANDOFF.md`
- `/home/lg/HANDOFF_INDEPENDENT_ROUTER.md`
- `/home/lg/independent_telegram_router_final.py`
- `/home/lg/independent_telegram_bot.py`
- variantes `independent_telegram_router_v1.py`, `v2.py`, `v3.py`
- `/tmp/agent_mention_parser.py`

O diagnóstico reporta que `git ls-files | grep -i telegram` não encontrou arquivos rastreados. O MVP deve ser incorporado ao repositório somente depois de inspeção de conteúdo, remoção de credenciais/dados locais e confirmação de quais arquivos são a versão canônica. Não copiar cegamente todas as variantes.

### 11.7 Decisão técnica após Etapa B

**Decisão: avançar primeiro com um piloto pelo router independente existente; adiar o provisionamento do conector nativo Paperclip.**

Justificativas:
1. O Paperclip local está saudável e os agentes já existem.
2. O Hermes Gateway já está conectado ao Telegram e deve ser preservado.
3. O conector nativo não tem endpoint provisionado para a empresa.
4. A instalação está privada, sem túnel HTTPS ativo e sem `PAPERCLIP_CHAT_WEBHOOK_PUBLIC_URL`; ativar o webhook nativo agora exige trabalho adicional de infraestrutura.
5. O router independente já foi implementado e há relato de teste funcional, mas seu código ainda precisa ser auditado e versionado.

**Agente-piloto recomendado:** Orquestrador Global (`7cebf5d9-b9c1-4db8-85fc-5bec8e7e9299`), por ser a raiz hierárquica (`reportsTo=null`) e ponto natural de entrada para encaminhamento à equipe. Esta é uma recomendação operacional, não uma validação de que o fluxo de resposta esteja correto.

### 11.8 Condições obrigatórias para aprovar o piloto

O router não será considerado solução concluída apenas por chamar `POST /api/agents/{id}/wakeup` ou enviar uma confirmação “acionado”. O teste precisa demonstrar:

1. mensagem no grupo identificando o Orquestrador Global;
2. wakeup do ID correto no Paperclip;
3. execução real do agente, com evidência no Paperclip/logs;
4. resposta final entregue ao grupo, identificada como produzida pelo agente correto;
5. distinção inequívoca entre confirmação do router e resposta do agente;
6. ausência de regressão no Gateway Hermes;
7. ausência de loops, respostas duplicadas ou confusão entre identidades.

**Ponto de atenção arquitetural:** o diagnóstico relata que o agente usa `hermes_local` e que a resposta assíncrona pode chegar pelo Gateway Hermes existente. Antes de aprovar, deve-se comprovar que o grupo identifica a autoria real do agente e não apresenta uma resposta do Hermes como se fosse diretamente do agente Paperclip. Se essa distinção não puder ser garantida, o router atual será considerado apenas um mecanismo de acionamento, e não a integração final desejada.

### 11.9 Próxima ação operacional

Hermes deve prosseguir com a inspeção do MVP e preparar o piloto do Orquestrador Global, sem implantação em massa. Antes de executar o teste no grupo:

- identificar qual dos arquivos locais é a versão canônica;
- revisar aliases, descoberta de agentes, wakeup, contexto enviado, callback/resposta, tratamento de falhas e deduplicação;
- confirmar como a resposta final é publicada no grupo e como a identidade do agente é preservada;
- apresentar o diff/arquivos para versionamento em branch de trabalho;
- executar o piloto com evidências correlacionadas.

Não provisionar ainda o conector nativo, não iniciar túnel público e não alterar o Gateway Hermes nesta fase.

