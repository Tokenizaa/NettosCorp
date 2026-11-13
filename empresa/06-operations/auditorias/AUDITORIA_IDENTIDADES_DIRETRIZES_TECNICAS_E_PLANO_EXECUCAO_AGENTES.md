# AUDITORIA DE IDENTIDADES, DIRETRIZES TÉCNICAS E PLANO DE EXECUÇÃO DOS AGENTES

**Versão:** 1.0  
**Data:** 13 de novembro de 2026  
**Repositório:** `Tokenizaa/NettosCorp`  
**Status:** Auditoria documental consolidada; execução técnica pendente  
**Branch de documentação:** `audit/identidades-agentes-plano-execucao-2026-11-13`

---

## 1. Objetivo e decisão de governança

Este documento consolida a auditoria dos documentos institucionais, cadastros individuais, perfis e configurações Paperclip localizados no repositório, e estabelece um plano controlado para alinhar os agentes existentes às diretrizes institucionais de identidade, personalidade, comunicação, voz, imagem, atribuições, autoridade e execução técnica.

A auditoria não autoriza, por si só, criar ou excluir agentes, substituir identidades, alterar IDs, hierarquia, permissões, adaptadores, orçamentos, credenciais ou infraestrutura. Essas mudanças dependem das aprovações previstas na governança e, quando reservadas, de autorização expressa do fundador.

**Regra central:** documentação, configuração cadastrada e funcionamento validado são estados diferentes. Nenhum agente será considerado alinhado ou operacional apenas porque existe uma ficha, um YAML ou um estado `READY`.

## 2. Escopo, fontes e método

Foram examinados no repositório:

1. `empresa/02-organization/PLANO_IDENTIDADES_AGENTES_E_COMUNICACAO_TELEGRAM.md` (v1.1, 13/11/2026).
2. `empresa/02-organization/proposta-equipe/PROPOSTA_EQUIPE.md` (v1.2, proposta institucional).
3. `empresa/05-technology/paperclip/PAPERCLIP_TECNOLOGIA.md`.
4. `empresa/05-technology/integracao-arquitetura/INTEGRACAO_ARQUITETURA.md` (proposta de arquitetura).
5. `empresa/06-operations/equipe-implantação/cadastros/CIA-001` a `CIA-008`.
6. Os oito perfis correspondentes em `empresa/06-operations/equipe-implantação/perfis/`.
7. Os oito YAMLs em `empresa/06-operations/equipe-implantação/configuracoes/`.

Método: confronto entre mandato institucional, composição proposta, cadastro individual, perfil, YAML e modelo técnico documentado do Paperclip. Foram procurados também caminhos relativos ao catálogo original Agency Agents e aos recursos de identidade vocal/visual.

**Limite de evidência:** a árvore consultada do repositório não apresentou a pasta `agency-agents/` referenciada pelos cadastros. Assim, os perfis locais podem ser auditados como registros internos, mas a fidelidade integral ao conteúdo e à versão do catálogo original ainda não foi contraprova. Também não foi feita, nesta auditoria documental, leitura direta do banco/estado atual do Paperclip, teste dos agentes, inventário do host Piper, inspeção do Telegram ou teste de bots. Esses itens estão explicitamente no plano de execução.

## 3. Conclusão executiva

A NettosCorp já possui uma base documental significativa: oito cadastros CIA, oito perfis e oito arquivos YAML. Os documentos definem missão, personalidade profissional, comunicação, responsabilidades, competências, limites, relações e referências de configuração.

Entretanto, a base ainda não está reconciliada o suficiente para uma alteração em massa. Foram identificadas divergências de composição e reporte formal, lacunas de comprovação sobre fontes originais, voz e imagem, e ausência de validação técnica dos parâmetros cadastrados.

**Decisão recomendada:** congelar mudanças estruturais até a conclusão do inventário de estado real e da matriz canônica; depois executar um piloto com agentes existentes; só então expandir agente por agente.

## 4. Achados e divergências

### 4.1 Composição da equipe

A proposta da primeira equipe descreve Hermes, o Orquestrador Global e seis especialistas prioritários: Software Architect, Backend Architect, Frontend Developer, DevOps Automator, Project Manager Senior e Technical Writer. O plano de identidades amplia a reconciliação e exige considerar a autorização mais recente do fundador e os agentes realmente existentes.

Os cadastros CIA-001 a CIA-008 incluem também QA Engineer. A equipe operacional relatada nas deliberações recentes inclui CEO e QA/Tester, além de outros agentes. Esses nomes e funções não podem ser automaticamente equiparados aos cadastros CIA: é necessário obter o inventário ao vivo do Paperclip e mapear cada registro por ID, nome, papel, empresa e histórico.

**Ação:** produzir inventário único com estados separados: existente no Paperclip, cadastrado no repositório, aprovado institucionalmente, proposto, futuro e não reconciliado. Não criar, excluir, renomear ou substituir agentes para forçar uma contagem.

### 4.2 Hierarquia e relações de reporte

O plano de identidades determina que:
- Hermes é Chefe de Gabinete Executivo e reporta diretamente ao fundador.
- O Orquestrador Global exerce autoridade operacional delegada e limitada, reportando administrativamente a Hermes.
- Diretores especializados, quando aprovados, respondem institucionalmente ao fundador; Hermes coordena integração e acompanhamento executivo.
- `reports_to` representa hierarquia formal no Paperclip e não deve ser confundido com coordenação funcional, delegação por tarefa ou reporte de execução.

Divergência concreta: o YAML `project-manager-senior.yaml` define `reportsTo: fundador-netto-farias`, enquanto o perfil e o cadastro CIA-002 descrevem reporte de acompanhamento executivo a Hermes e relação institucional com Diretor de Gestão de Projetos (vago) / Fundador. O perfil e o cadastro do Orquestrador definem subordinação administrativa a Hermes, e seu YAML usa `reportsTo: hermes-chefe-de-gabinete`. Os especialistas técnicos usam `reportsTo: orquestrador-global`, embora seus perfis indiquem superior institucional Diretor de Tecnologia (vago) / Fundador e reporte de execução ao Orquestrador.

Essas diferenças não podem ser corrigidas por simples uniformização de YAML. É preciso confirmar o organograma homologado, distinguir reporte formal de reporte funcional e verificar os IDs reais aceitos pelo Paperclip.

### 4.3 Identidade, personalidade e comunicação

Os cadastros CIA contêm arquétipo profissional, personalidade, comunicação, estilo de trabalho, competências, pontos fortes, limitações, tomada de decisão, relacionamento, liderança e responsabilidades. São uma boa base, mas devem ser tratados como identidade profissional, não como uma especificação completa de comportamento conversacional.

O plano de identidades exige ficha individual mais ampla: nome próprio e funcional, identificador estável, posição e status de aprovação, mandato, personalidade, estilo colaborativo, comportamento sob pressão, comunicação adaptativa, competências, ferramentas, permissões, limites, delegação, voz, Telegram, Paperclip, desempenho e persistência.

A personalidade jamais altera autoridade, permissão, escopo ou critérios de aceite.

### 4.4 Voz e comunicação por áudio

O plano determina que a voz seja atribuída somente depois de inventariar os modelos/vozes Piper realmente instalados e testar a cadeia real até o Telegram. Cada atribuição deve registrar identificador exato, idioma, variante, parâmetros e amostra validada.

Requisitos de comunicação:
- entrada por áudio: priorizar resposta por áudio, mantendo conversa natural;
- entrada por texto: priorizar texto e evitar áudio desnecessário;
- relatórios longos ou decisões importantes: texto completo e áudio quando útil;
- respostas operacionais, código, tabelas, links e consultas: formato mais legível;
- texto e áudio devem ser coerentes;
- falha de áudio não pode eliminar a resposta textual nem gerar declaração falsa de envio;
- só declarar áudio enviado após confirmação efetiva da API do Telegram.

**Achado:** não foi localizada matriz canônica agente-voz nem evidência de teste real de cada voz. Nenhuma voz deve ser considerada atribuída/validada por enquanto, salvo comprovação posterior no ambiente.

### 4.5 Imagem e identidade visual

Os YAMLs possuem ícones funcionais, mas ícone não equivale a avatar oficial. O modelo técnico do Paperclip documenta o campo `appearance` como JSONB e `icon` como campo próprio; isso não comprova, por si só, o formato aceito pela versão instalada, os requisitos de imagem, nem que o avatar esteja renderizado no frontend.

**Ação:** localizar diretriz visual canônica, inventariar imagens/ativos existentes, validar campos e formatos suportados na versão real do Paperclip e só então propor ou aplicar imagens. Não inventar avatares oficiais nem sobrescrever recursos existentes.

### 4.6 Configurações técnicas Paperclip

Os oito YAMLs seguem um padrão recorrente:
- `apiVersion: paperclip/v1`, `kind: Agent`;
- nome, role, title, icon e reportsTo;
- metadata com departamento, regime e referência de perfil;
- `adapterType: codex_local`;
- `adapterConfig.model: gpt-5` e diretórios `cwd` específicos;
- heartbeat habilitado com intervalo de 300 segundos;
- orçamento mensal cadastrado em zero;
- instruções gerenciadas com `AGENTS.md`;
- skill `paperclip`;
- perfis de ferramentas `engineering` ou `project-management`;
- trust boundary com `projectIds: []`.

Isso descreve o conteúdo versionado, não prova que cada campo seja aceito, que o diretório exista, que as permissões sejam suficientes ou seguras, que o modelo esteja disponível, nem que o heartbeat e a execução funcionem.

O orçamento zero deve ser interpretado e confirmado no contexto da implementação, não alterado por suposição. O significado operacional de `projectIds: []` e a política efetiva de permissões também precisam ser verificados no código/instância.

### 4.7 Fonte original Agency Agents

Os perfis internos referenciam caminhos como `engineering/engineering-software-architect.md`, `project-management/project-manager-senior.md` e `testing/testing-test-automation-engineer.md`. A pasta original não apareceu na árvore consultada. É necessário localizar o repositório/versão de origem, recuperar os arquivos exatos e comparar o conteúdo integral com os registros internos. Até essa contraprova, não declarar os perfis como cópias fiéis e atualizadas.

### 4.8 Framework Universal dos 13 Domínios

O plano v1.1 determina aplicação transversal dos 13 domínios, sem transformar domínios em cargos ou agentes:
1. Produto & Jornada;
2. Frontend & UX;
3. Backend & Regras;
4. Dados & Isolamento;
5. Segurança & Auth;
6. Inteligência de Domínio;
7. Pagamentos & Billing;
8. Posicionamento & Copy;
9. Aquisição & Canais;
10. IP & Licenças;
11. Privacidade & Conformidade;
12. Infra & Observabilidade;
13. QA & Validação.

A responsabilidade atravessa áreas. Cada atividade deve ter responsável principal, colaboradores, critério de conclusão e evidência. O Fundador decide prioridades e matérias reservadas; Hermes garante integração e acompanhamento executivo; diretores aprovados respondem por suas áreas; especialistas executam; o Orquestrador distribui e acompanha tarefas dentro de seu mandato; validadores verificam com independência quando o risco exigir.

Não criar 13 agentes, não omitir domínios sem justificativa e não atribuir um domínio inteiro a um único especialista quando houver trabalho multidisciplinar.

## 5. Matriz individual — requisitos a preservar

A matriz abaixo consolida os mandatos registrados. Ela não declara validação operacional.

| Registro | Agente | Mandato e diretrizes técnicas principais | Limites centrais |
|---|---|---|---|
| CIA-001 | Orquestrador Global | Distribuição técnica de tarefas; acompanhamento de execução e dependências; fluxo Dev↔QA; status baseado em evidências; escalonamento após até três tentativas | Sem autoridade estratégica, executiva ou disciplinar; não substitui supervisores locais; não cria/altera agentes, orçamento ou adaptadores sem autorização |
| CIA-002 | Project Manager Senior | Decompor especificações em tarefas acionáveis de 30–60 min; critérios de aceite; cronograma, backlog, prioridades e dependências; estimativas realistas | Não adiciona requisitos; não executa desenvolvimento; não cria agentes nem define orçamento/adaptador |
| CIA-003 | Software Architect | Arquitetura geral; bounded contexts; ADRs; padrões de código e dependências; trade-offs explícitos; revisão arquitetural | Não cria agentes nem define orçamento/adaptador; não implanta em produção sem aprovações exigidas |
| CIA-004 | Backend Architect | Banco e índices; APIs REST/GraphQL e OpenAPI; Auth/RLS; segurança por menor privilégio; migrações expand-and-contract; cache, resiliência e observabilidade | Não altera arquitetura geral sem Software Architect; não define orçamento/adaptador; deploy depende de DevOps |
| CIA-005 | Frontend Developer | Interfaces responsivas; WCAG 2.1 AA; design system; integração de APIs; Core Web Vitals; code splitting; testes de componentes e cross-browser | Não altera arquitetura sem Software Architect; não define orçamento/adaptador; não faz deploy sem aprovação operacional exigida |
| CIA-006 | DevOps Automator | IaC; CI/CD; Docker; deploy blue-green/canary/rolling; rollback; monitoramento, logs e alertas; scanning e secrets management | Não altera estratégia de infraestrutura sem aprovação; não expõe segredos; orçamento depende do fundador |
| CIA-007 | Technical Writer | Docs-as-code; sistema Divio; READMEs, API reference e tutoriais; exemplos testados; documentação autônoma e sincronizada com releases | Não publica sem revisão técnica; não altera produção; não cria agentes nem define orçamento/adaptador |
| CIA-008 | QA Engineer | Playwright/Cypress; testes determinísticos; sem hard sleeps; dados próprios via API; seletores por papel; CI/sharding/traces; pass rate, duração e flake rate | Não altera produção sem aprovação; não bloqueia merge sem evidência; não cria agentes nem define orçamento/adaptador |

Para cada registro, a implementação deve preservar o cadastro CIA, o perfil e as referências existentes, corrigindo divergências somente após aprovação. O conteúdo integral desses arquivos permanece a fonte detalhada das responsabilidades e instruções específicas.

## 6. Matriz de configuração técnica a verificar por agente

| Agente | Perfil de ferramentas registrado | `cwd` registrado |
|---|---|---|
| Orquestrador Global | engineering | `/home/lg/.hermes/cache/scratch/nettoscorp/orquestrador` |
| Project Manager Senior | project-management | `/home/lg/.hermes/cache/scratch/nettoscorp/pm` |
| Software Architect | engineering | `/home/lg/.hermes/cache/scratch/nettoscorp/arquitetura` |
| Backend Architect | engineering | `/home/lg/.hermes/cache/scratch/nettoscorp/backend` |
| Frontend Developer | engineering | `/home/lg/.hermes/cache/scratch/nettoscorp/frontend` |
| DevOps Automator | engineering | `/home/lg/.hermes/cache/scratch/nettoscorp/infra` |
| Technical Writer | engineering | `/home/lg/.hermes/cache/scratch/nettoscorp/docs` |
| QA Engineer | engineering | `/home/lg/.hermes/cache/scratch/nettoscorp/qa` |

Padrão comum cadastrado: `codex_local`, modelo `gpt-5`, heartbeat de 300 s, `AGENTS.md` gerenciado, skill `paperclip`, orçamento zero e trust boundary `projectIds: []`. Cada parâmetro precisa ser comparado com o estado real, esquema da versão instalada, diretórios existentes, permissões e execução real. Não aplicar esse padrão automaticamente a CEO, QA/Tester ou qualquer agente não incluído nos oito YAMLs.

## 7. Plano de execução

### Fase 0 — Preservação e baseline

1. Registrar commit/branch, IDs, nomes, configuração e estado atual dos agentes.
2. Fazer export/backup recuperável dos registros e configurações relevantes, respeitando segredos fora do repositório.
3. Capturar hierarquia, tarefas, revisões de configuração, heartbeats e evidências recentes.
4. Não usar SQL direto para forçar `READY` ou qualquer estado de lifecycle.
5. Não alterar agentes durante a coleta do baseline.

**Aceite:** inventário reproduzível; IDs e histórico preservados; backup verificado; divergências registradas.

### Fase 1 — Reconciliação institucional e documental

1. Ler a memória institucional, governança corporativa, modelo de autoridade, proposta de equipe e plano de identidades v1.1.
2. Recuperar a deliberação mais recente do fundador sobre composição, cargos e agentes.
3. Inventariar Paperclip real e cruzar por ID com CIA-001 a CIA-008 e com todos os demais agentes existentes.
4. Recuperar o catálogo Agency Agents original e comparar cada perfil integralmente, incluindo versão e origem.
5. Resolver divergências de hierarquia separando `reports_to`, reporte institucional, reporte executivo e coordenação funcional.
6. Preparar matriz canônica com status: existente, aprovado, proposto, futuro ou não reconciliado.
7. Submeter decisões reservadas à homologação do fundador.

**Aceite:** cada registro real mapeado ou explicitamente não reconciliado; nenhuma aprovação presumida; matriz de autoridade sem ambiguidade.

### Fase 2 — Identidade individual e diretrizes técnicas

Para cada agente aprovado/existente, completar uma ficha canônica contendo:
- nome próprio e funcional, ID Paperclip e CIA, cargo, departamento e status;
- missão, resultados esperados, responsabilidades e entregáveis;
- personalidade profissional, colaboração, comportamento sob pressão e tom;
- comunicação adaptativa texto/áudio;
- competências, práticas técnicas, ferramentas e skills;
- permissões mínimas, trust boundary, ações proibidas e escalonamentos;
- relações formais e funcionais, delegação e limites;
- métricas, critérios de aceite e evidências;
- voz, imagem e referências persistentes;
- YAML efetivo, instruções, modelo/adaptador e runtime suportados.

**Aceite:** ficha consistente com governança, catálogo original e configuração real; sem campos inventados; itens pendentes explicitamente marcados.

### Fase 3 — Auditoria técnica Paperclip e runtime

1. Confirmar versão/commit do Paperclip e consultar schema, validação YAML, documentação e código da versão efetivamente instalada.
2. Verificar campos suportados: identidade, `appearance`, `icon`, `reportsTo`, adapter, adapterConfig, runtimeConfig, instructions, skills, tools, permissions e trust boundary.
3. Validar os IDs de `reportsTo` e a hierarquia no banco/API oficial.
4. Verificar `cwd`, arquivos `AGENTS.md`, disponibilidade do modelo, variáveis de ambiente e dependências.
5. Testar cada perfil de ferramenta com menor privilégio e validar acesso a projetos/repos autorizados.
6. Verificar heartbeat, execução, logs, timeout, falha, retomada e lifecycle nativo.
7. Conferir orçamento e semântica de zero; não alterar sem aprovação.
8. Registrar estado antes/depois e revisar mudanças por diff.

**Aceite:** configuração validada pela aplicação e runtime real; nenhum lifecycle forçado via SQL; execução observável; permissões justificadas.

### Fase 4 — Voz, imagem e comunicação

1. Inventariar modelos/vozes Piper instalados e compatíveis.
2. Registrar identificador, idioma, variante, parâmetros e licença/condições quando aplicável.
3. Testar amostra por agente e envio real ao Telegram; registrar evidência de áudio recebido.
4. Validar resposta por áudio após entrada de áudio e resposta textual após entrada textual.
5. Testar falha de geração/envio, preservação do texto, confirmação da API, duplicidade e consistência texto-áudio.
6. Inspecionar diretrizes visuais e ativos oficiais; validar dimensões, formato, armazenamento e suporte de `appearance`/avatar na versão instalada.
7. Aplicar voz/imagem somente após atribuição aprovada e teste real.

**Aceite:** cada voz atribuída tem teste real; cada avatar deriva de diretriz/ativo aprovado; falhas não geram falsas confirmações.

### Fase 5 — Piloto controlado

1. Selecionar Hermes e um pequeno grupo de agentes já existentes e autorizados, incluindo ao menos um especialista técnico.
2. Atualizar apenas as fichas e configurações aprovadas.
3. Executar uma delegação ponta a ponta: solicitação → tarefa Paperclip → atribuição → execução → revisão/QA → conclusão → registro.
4. Testar texto, áudio, falha de áudio, retomada, timeout, mensagens duplicadas e limites de interação entre bots.
5. Validar ausência de loops, respostas duplicadas e atribuições fora do escopo.
6. Registrar logs, IDs de tarefas, commits, resultados e evidências.
7. Corrigir problemas antes de expandir.

**Aceite:** ciclo ponta a ponta concluído com evidências; lifecycle nativo; nenhuma violação de autoridade ou permissão; fundador aprova expansão.

### Fase 6 — Expansão gradual e Framework dos 13 Domínios

1. Expandir somente para agentes e cargos homologados.
2. Aplicar a matriz dos 13 domínios por projeto, com maturidade, lacunas, riscos, prioridade, responsável, dependências e evidências.
3. Converter ações aprovadas em tarefas Paperclip rastreáveis.
4. Validar separadamente implementação e qualidade.
5. Criar/ajustar tópicos Telegram somente após teste de permissões, privacidade e bot-to-bot.
6. Manter GitHub como fonte de verdade documental, Paperclip como controle operacional, Telegram como comunicação e Piper como geração de áudio.
7. Publicar relatório final com evidências, riscos residuais e pendências.

**Aceite:** cada agente implantado está identificado, autorizado e validado; matriz de domínios atualizada; tarefas rastreáveis; decisões documentadas; homologação final.

## 8. Testes obrigatórios por agente

Nenhum agente recebe status de alinhado/validado sem passar, no mínimo, por:

1. **Identidade:** nome, ID, cargo e persona coerentes entre cadastro, Paperclip e comunicação.
2. **Mandato:** consegue explicar sua missão e recusar/escalar atividades fora do escopo.
3. **Hierarquia:** superior formal e relações funcionais corretos, sem confundir coordenação com autoridade.
4. **Instruções:** lê as instruções corretas e preserva diretrizes técnicas do perfil.
5. **Ferramentas:** usa apenas ferramentas autorizadas e demonstra limites de acesso.
6. **Execução:** recebe tarefa Paperclip, executa, registra progresso e conclui com evidências.
7. **Qualidade:** entrega passa por critérios técnicos do papel e validação independente quando necessária.
8. **Comunicação:** responde no canal/formato esperado, sem duplicidade ou falsa confirmação.
9. **Voz/imagem:** somente se atribuídas; recursos testados no fluxo real.
10. **Lifecycle:** transições realizadas pelo mecanismo nativo, com logs e heartbeat coerentes.

## 9. Riscos e controles

| Risco | Controle obrigatório |
|---|---|
| Agente existente omitido ou duplicado na matriz | Inventário Paperclip por ID e reconciliação com CIA |
| Hierarquia errada por YAML divergente | Homologar modelo e validar `reportsTo` por API/schema |
| Perfil interno desatualizado | Contraprova com fonte original Agency Agents |
| Voz escolhida sem suporte real | Inventário Piper e teste de ponta a ponta |
| Avatar inventado ou não suportado | Fonte visual oficial e validação do frontend/schema |
| Estado READY forçado sem verificação | Proibir SQL para lifecycle; usar fluxo nativo e evidências |
| Permissões excessivas | Menor privilégio, testes negativos e revisão de trust boundary |
| Segredos expostos | Segredos fora do GitHub/Telegram; rotação se exposição confirmada |
| Loop/duplicidade entre bots | Testes de idempotência, rate limit e prevenção de loops |
| Expansão antes do piloto | Gate de aceite e autorização expressa do fundador |

## 10. Decisões reservadas ao fundador

Permanecem reservadas, conforme os documentos institucionais:
- composição final e quantidade de agentes;
- homologação de cargos, departamentos e hierarquia;
- atribuição de autoridade e delegações;
- orçamentos e política de gastos;
- `adapterType`, modelo e configurações com impacto operacional;
- permissões administrativas e acesso externo;
- atribuição oficial de voz e imagem, quando houver escolhas institucionais;
- criação/alteração de bots, supergrupo e tópicos;
- autorização para expansão após piloto.

## 11. Instrução operacional para Hermes

Hermes deve coordenar a execução deste plano sem antecipar fases. Primeiro deve ler integralmente este documento e as fontes institucionais listadas; em seguida, produzir o baseline e a matriz de reconciliação com evidências do Paperclip real.

Hermes não deve:
- criar agentes substitutos ou completar contagem por suposição;
- alterar IDs ou apagar histórico;
- forçar lifecycle por SQL;
- alterar hierarquia, orçamento, adapter, permissões, voz ou imagem sem autorização;
- marcar agente como validado sem teste funcional e evidência;
- avançar para expansão antes do piloto aprovado.

Cada entrega deve conter: objetivo, arquivos/registros examinados, IDs envolvidos, estado anterior, ação executada, evidência verificável, resultado dos testes, riscos e pendências. Em caso de divergência documental ou técnica, parar a alteração afetada, registrar o conflito e solicitar decisão quando reservada ao fundador.

## 12. Critério de encerramento da auditoria e do programa

A **auditoria documental** está consolidada neste documento, com limitações de evidência explicitadas. A **implantação** somente poderá ser declarada concluída quando todas as fases aplicáveis forem aceitas, cada agente implantado passar nos testes, vozes/imagens atribuídas forem comprovadas, a hierarquia estiver homologada, as permissões forem verificadas, as tarefas forem rastreáveis e o fundador homologar as decisões reservadas.

---

## Referências internas

- `empresa/02-organization/PLANO_IDENTIDADES_AGENTES_E_COMUNICACAO_TELEGRAM.md`
- `empresa/02-organization/proposta-equipe/PROPOSTA_EQUIPE.md`
- `empresa/05-technology/paperclip/PAPERCLIP_TECNOLOGIA.md`
- `empresa/05-technology/integracao-arquitetura/INTEGRACAO_ARQUITETURA.md`
- `empresa/06-operations/equipe-implantação/cadastros/CIA-001` a `CIA-008`
- `empresa/06-operations/equipe-implantação/perfis/`
- `empresa/06-operations/equipe-implantação/configuracoes/`

**Registro de versão:** v1.0 — consolidação inicial da auditoria documental e do plano de execução, 13/11/2026.
