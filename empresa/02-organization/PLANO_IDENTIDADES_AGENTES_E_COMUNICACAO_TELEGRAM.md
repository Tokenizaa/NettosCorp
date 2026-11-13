# PLANO DE IDENTIDADES DOS AGENTES E AMBIENTE DE COMUNICACAO — NETTOSCORP

Versao: 1.0
Data: 13 de novembro de 2026
Status: PROPOSTA PARA DELIBERACAO DO FUNDADOR — nao autoriza, por si so, criacao de cargos, agentes, grupos, bots ou alteracoes tecnicas.
Repositorio: Tokenizaa/NettosCorp
Caminho: empresa/02-organization/PLANO_IDENTIDADES_AGENTES_E_COMUNICACAO_TELEGRAM.md

---

## 1. Objetivo

Registrar integralmente a proposta de trabalho para a proxima etapa de estruturacao da NettosCorp: consolidar as identidades dos agentes, suas personalidades, competencias, vozes e relacoes organizacionais; e projetar um ambiente no Telegram no qual fundador, Hermes e agentes possam se comunicar e colaborar.

Este documento complementa, mas nao substitui:
- `empresa/00-governance/MEMORIA_INSTITUCIONAL_NETTOSCORP.md`
- `empresa/00-governance/GOVERNANCA_CORPORATIVA.md`
- `empresa/00-governance/MODELO_AUTORIDADE_DIRECAO_EXECUTIVA.md`
- `empresa/02-organization/proposta-equipe/PROPOSTA_EQUIPE.md`

Em caso de conflito, prevalecem as decisoes institucionais mais recentes formalmente homologadas pelo fundador. Este plano e uma proposta de desenho e validacao, nao uma aprovacao automatica de organograma.

## 2. Principios obrigatorios

1. A autoridade executiva e legal final permanece com o fundador.
2. O Conselheiro exerce funcao de assessoramento estrategico, sem autoridade executiva final.
3. Hermes e Chefe de Gabinete Executivo, reportando diretamente ao fundador. Sua funcao e coordenacao executiva e institucional; nao substitui a autoridade do fundador nem a funcao tecnica do Orquestrador Global.
4. O Agente Corporativo Global de Orquestracao exerce autoridade operacional delegada e limitada a distribuicao tecnica e acompanhamento de tarefas entre agentes e projetos. Administrativamente, reporta a Hermes.
5. Diretores especializados respondem institucionalmente ao fundador. Hermes coordena integracao, comunicacao e acompanhamento executivo, sem se tornar superior institucional dos diretores.
6. Preservar agentes, equipes, topologias e metodologias dos projetos existentes ate que sejam reconhecidos e compreendidos. Nao substituir estruturas funcionais prematuramente.
7. Distinguir hierarquia formal (`reports_to`) de relacoes funcionais e delegacoes por tarefa.
8. Nenhum cargo ou agente proposto deve ser tratado como existente ou aprovado sem registro explicito da decisao do fundador.
9. Toda identidade, permissao, delegacao, decisao e entrega relevante deve ser documentada, versionada, rastreavel e verificavel.
10. Nao criar uma arquitetura paralela ao Paperclip. Usar as capacidades existentes e documentadas das ferramentas; qualquer limitacao deve ser registrada antes de propor extensoes.

## 3. Escopo do trabalho a consolidar

A etapa deve produzir uma matriz canonica da equipe, reconciliada com:
- a memoria institucional;
- o modelo de autoridade e direcao executiva;
- a proposta da primeira equipe;
- as deliberacoes mais recentes do fundador;
- os agentes e perfis que ja existem no repositorio e nos projetos incorporaveis;
- a estrutura real do Paperclip e os recursos efetivamente disponiveis no ambiente Telegram.

### 3.1 Reconciliacao da composicao

A proposta da primeira equipe atualmente documenta Hermes, o Orquestrador Global como funcao corporativa e seis especialistas prioritarios:
- Software Architect;
- Backend Architect;
- Frontend Developer;
- DevOps Automator;
- Project Manager Senior;
- Technical Writer.

A composicao final deve ser confrontada com a autorizacao mais recente do fundador e com os registros atuais do repositorio. Se houver divergencia de quantidade, nomes, cargos ou escopo, apresentar a divergencia explicitamente e solicitar homologacao; nao inventar agentes para completar uma contagem nem descartar autorizacoes anteriores.

Diretorias e cargos futuros descritos em documentos institucionais continuam sujeitos ao status de aprovacao indicado em cada documento. A Diretoria de Tecnologia esta indicada como primeira estrutura especializada proposta, mas sua implantacao deve respeitar as aprovacoes e pre-condicoes registradas.

## 4. Ficha institucional obrigatoria de cada agente

Antes de cadastrar ou alterar um agente no Paperclip, produzir uma ficha com os campos abaixo:

| Campo | Conteudo exigido |
|---|---|
| Identidade | Nome proprio, nome funcional e identificador estavel |
| Posicao | Cargo, nivel, departamento ou unidade; indicar se aprovado, proposto ou existente |
| Reporte | `reports_to` formal e justificativa; indicar separadamente relacoes funcionais |
| Mandato | Missao, resultados esperados e escopo de responsabilidade |
| Personalidade | Temperamento profissional, postura, estilo de colaboracao e comportamento sob pressao |
| Comunicacao | Tom, nivel de detalhe, quando usar texto, audio ou ambos |
| Competencias | Habilidades tecnicas e organizacionais, com nivel esperado e limites |
| Ferramentas | Ferramentas, conectores, repositorios e ambientes autorizados |
| Permissoes | Acessos minimos necessarios e operacoes permitidas |
| Limites | Decisoes que pode tomar, que deve escalar e que estao proibidas |
| Delegacao | A quem pode delegar, em quais condicoes e com quais limites |
| Voz | Perfil Piper efetivamente disponivel, identificador do modelo/voz, idioma, parametros e amostra validada |
| Telegram | Bot/identidade de comunicacao, se aplicavel, e topicos autorizados |
| Paperclip | Agente, papel, projeto, superior formal, adapter e configuracao efetivamente suportados |
| Desempenho | Entregaveis, criterios de aceitacao, indicadores e evidencias |
| Persistencia | Arquivos canonicos que definem sua identidade e instrucoes |

Nao inventar atributos tecnicos indisponiveis. Diferenciar claramente capacidades verificadas, configuracoes candidatas e itens pendentes de teste.

## 5. Personalidades e vozes

### 5.1 Principio de identidade vocal

Cada agente que utilizar voz deve ter uma identidade vocal consistente e reconhecivel. A voz e um atributo relativamente estavel do agente; o ritmo, a extensao e a escolha entre texto e audio podem adaptar-se ao contexto.

Atribuir voz somente apos inventariar as vozes/modelos Piper realmente instalados e testar a compatibilidade tecnica. Registrar o identificador exato do modelo, idioma, variante, parametros relevantes e resultado de uma amostra. Nao registrar uma voz como atribuida se ela nao foi testada no fluxo real do Telegram.

### 5.2 Comunicacao adaptativa

O comportamento de comunicacao deve considerar:
- Se o fundador iniciou a interacao por audio, priorizar resposta por audio, mantendo a conversa natural.
- Se o fundador esta interagindo por texto, priorizar texto e evitar audio desnecessario.
- Em relatorios extensos, analises importantes e decisoes estrategicas, disponibilizar o texto completo e uma versao em audio quando isso agregar valor.
- Em respostas curtas, operacionais ou que exigem consulta, links, codigo ou tabelas, preferir o formato mais legivel e util.
- Texto e audio enviados juntos devem ser coerentes e transmitir a mesma conclusao.
- Nao anunciar mecanicamente a escolha de formato; simplesmente comunicar-se de forma adequada.
- Preservar a resposta textual se a geracao ou o envio de audio falhar. Registrar a falha e nunca declarar que o audio foi enviado sem confirmacao efetiva da API do Telegram.

### 5.3 Personalidade nao substitui mandato

A personalidade deve tornar a interacao distinguivel, mas nao pode alterar autoridade, permissao, escopo ou criterios de aceitacao. Nenhum agente pode reivindicar identidade, voz, cargo ou autoridade de outro.

## 6. Ambiente de colaboracao no Telegram

### 6.1 Proposta

Avaliar a criacao de um supergrupo privado da NettosCorp com topicos ativados, como central de comunicacao humana e colaboracao entre agentes. O supergrupo seria uma interface de comunicacao; nao seria a fonte oficial do organograma, das tarefas ou das decisoes.

Topicos candidatos, sujeitos a validacao:
1. Presidencia e Conselho — comunicacao do fundador, Conselheiro e Hermes.
2. Gabinete e Orquestracao — coordenacao, delegacoes e dependencias.
3. Tecnologia — arquitetura, engenharia, infraestrutura e agentes tecnicos.
4. Gestao de Projetos — planejamento, prazos, riscos e entregas.
5. Qualidade e Seguranca — revisoes, testes e controles, quando implantados.
6. Colaboracao entre Agentes — discussao tecnica e resolucao de problemas.
7. Relatorios e Decisoes — sinteses, resultados e referencias aos registros oficiais.

Os topicos nao criam departamentos nem conferem autoridade aos participantes. A estrutura de canais deve acompanhar os departamentos e agentes efetivamente aprovados, evitando salas vazias ou duplicadas.

### 6.2 Interacao entre bots

Antes de depender de conversas bot-a-bot, realizar uma verificacao tecnica no Telegram e na configuracao de cada bot:
- confirmar as regras atuais de privacidade, permissao e administracao para receber mensagens de outros bots;
- confirmar se cada bot pode ler e responder nos topicos pretendidos;
- testar mencoes, respostas, encaminhamento de tarefas e identificacao inequívoca do remetente;
- verificar limites, rate limits, tratamento de erros e prevencao de loops;
- confirmar como mensagens, arquivos e audios sao associados a tarefas no Paperclip.

Nao presumir que todos os bots podem ler todas as mensagens ou conversar livremente. Registrar os requisitos e as limitacoes observados em testes reais antes de definir a arquitetura final.

### 6.3 Regras de convivencia e coordenacao

- Hermes permanece o ponto de coordenacao executiva e institucional e reporta ao fundador.
- O Orquestrador Global coordena tecnicamente a distribuicao e o acompanhamento das tarefas dentro de seu mandato.
- Especialistas participam das conversas pertinentes ao seu escopo, sem responder indiscriminadamente a todas as mensagens.
- Toda delegacao relevante deve ter responsavel, objetivo, prazo quando aplicavel e criterio de conclusao.
- Discussao nao equivale a decisao. Decisoes institucionais devem ser registradas no repositorio; tarefas e execucoes devem permanecer rastreaveis no Paperclip.
- Evitar respostas duplicadas, conversas circulares, mensagens em excesso e notificacoes sem valor.
- Escalar conflitos de autoridade, riscos relevantes, mudancas de escopo e decisoes estrategicas conforme o modelo institucional.

## 7. Arquitetura de responsabilidades entre ferramentas

| Sistema | Responsabilidade principal | Nao deve ser tratado como |
|---|---|---|
| GitHub NettosCorp | Fonte de verdade documental: governanca, identidades, politicas, decisoes e historico versionado | Chat operacional ou memoria informal |
| Paperclip | Organograma operacional, agentes, tarefas, atribuicoes, execucao e acompanhamento | Substituto da governanca institucional |
| Telegram | Comunicacao, notificacoes, conversas e interface de colaboracao | Fonte unica de verdade ou substituto do Paperclip |
| Piper | Geracao de audio para os agentes, conforme perfis vocais validados | Sistema de identidade ou autoridade |

A integracao deve reutilizar os fluxos existentes e comprovados. Nao construir um sistema paralelo ao Paperclip ou duplicar desnecessariamente o estado das tarefas.

## 8. Seguranca e controle de acesso

- Manter tokens, chaves, credenciais e segredos fora do repositorio e das mensagens.
- Se uma credencial de bot tiver sido exposta em historico ou documento, revoga-la e emitir outra; atualizar o segredo no ambiente seguro e validar o funcionamento.
- Conceder a cada bot e agente somente os acessos necessarios ao seu mandato.
- Nao compartilhar credenciais entre agentes quando identidades separadas forem necessarias para auditoria.
- Registrar quem pode criar bots, adicionar participantes, alterar topicos, modificar instrucoes e executar acoes externas.
- Validar as permissoes de administradores e a politica de privacidade de cada bot antes de adiciona-lo ao supergrupo.
- Nao inserir tokens ou credenciais em fichas de agentes, arquivos Markdown, issues ou logs.

## 9. Plano de implantacao recomendado

### Etapa 1 — Auditoria e matriz canonica
1. Ler os documentos institucionais e a proposta da primeira equipe.
2. Inventariar agentes existentes, perfis, instrucoes, nomes, cargos, ferramentas e estado real no Paperclip.
3. Conferir a autorizacao mais recente do fundador e reconciliar a composicao da equipe.
4. Inventariar modelos Piper e vozes disponiveis.
5. Examinar o chatbot e a integracao Telegram existentes, sem reconstruir o que ja funciona.
6. Entregar matriz consolidada, divergencias, riscos e recomendacoes para revisao do fundador.

### Etapa 2 — Validacao piloto
1. Selecionar Hermes e um pequeno conjunto de agentes ja autorizados, incluindo ao menos um especialista tecnico.
2. Criar ou ajustar suas fichas institucionais e configuracoes, somente apos aprovacao.
3. Validar identidade, hierarquia, permissao, voz e comunicacao adaptativa.
4. Testar uma delegacao completa: solicitacao, atribuicao, execucao, revisao, consolidacao e registro.
5. Testar o fluxo Telegram com texto, audio, falha de audio, mensagens duplicadas e interacao entre bots.
6. Registrar evidencias e corrigir problemas antes de expandir.

### Etapa 3 — Expansao controlada
1. Expandir apenas para agentes e cargos aprovados.
2. Configurar identidades e vozes individuais testadas.
3. Criar o supergrupo e os topicos aprovados.
4. Integrar notificacoes e comunicacao ao Paperclip sem duplicar o controle das tarefas.
5. Publicar relatorio de implantacao, pendencias e criterios de operacao.

## 10. Entregaveis obrigatorios

1. Matriz canonica da equipe, com status de cada cargo/agente (existente, aprovado, proposto ou futuro).
2. Ficha institucional individual de cada agente autorizado.
3. Matriz de hierarquia formal e relacoes funcionais.
4. Matriz de competencias, ferramentas, permissoes e limites.
5. Inventario de vozes Piper e matriz agente-voz com evidencias de teste.
6. Projeto do supergrupo e topicos do Telegram, com permissao e finalidade de cada espaco.
7. Desenho do fluxo de comunicacao Telegram-Paperclip-GitHub.
8. Plano de testes e criterios de aceitacao.
9. Registro de riscos, divergencias e decisoes pendentes.
10. Relatorio final com evidencias de funcionamento.

## 11. Criterios de aceitacao

A etapa nao pode ser considerada concluida ate que:
- cada agente implantado tenha identidade, mandato, superior ou relacao funcional e limites documentados;
- nenhum cargo proposto tenha sido promovido silenciosamente a cargo aprovado;
- cada voz atribuida tenha sido identificada e testada no envio real;
- a comunicacao adaptativa funcione de acordo com o canal de entrada e a relevancia da resposta;
- o Telegram nao substitua o Paperclip como controle de tarefas;
- a colaboracao entre bots tenha sido validada com limites contra loops e duplicacoes;
- as decisoes e entregas relevantes estejam registradas no GitHub;
- o fundador tenha revisado e homologado os itens que exigem sua autoridade.

## 12. Deliberacoes reservadas ao fundador

Continuam dependentes de decisao expressa do fundador, conforme os documentos institucionais:
- homologacao final do modelo de autoridade, quando ainda pendente;
- composicao e quantidade final da equipe, diante de eventuais divergencias entre deliberacoes e documentos;
- aprovacao de novos cargos, diretorias e agentes;
- orcamento mensal de cada agente;
- `adapterType` e `adapterConfig` de cada agente;
- politica de aprovacao para criacao de novos agentes;
- permissao para bots interagirem no supergrupo e escopo de administracao;
- aprovacao da implantacao e expansao do ambiente Telegram.

Este documento nao toma essas decisoes em nome do fundador.

## 13. Instrucao de coordenacao recomendada ao Hermes

Hermes deve coordenar a Etapa 1 e entregar primeiro a matriz canonica, sem iniciar a criacao em massa de agentes, cargos, bots ou grupos. Deve trabalhar a partir dos documentos e configuracoes reais, apontar divergencias, preservar o que ja funciona e apresentar recomendacoes com evidencias. A implantacao piloto e as etapas seguintes dependem de revisao e autorizacao do fundador.

## 14. Historico

- v1.0 — 13/11/2026: registro inicial da proposta de identidades, vozes, comunicacao adaptativa e ambiente colaborativo Telegram, alinhada aos documentos institucionais consultados.

---

**Nota de governanca:** este plano organiza uma proposta de trabalho. Nao constitui, isoladamente, aprovacao de organograma, criacao de agentes, atribuicao de autoridade, autorizacao de gastos ou implantacao tecnica.
