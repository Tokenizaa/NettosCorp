# NOS-OS — Especificação arquitetural dos 10 domínios

Status: especificação de implementação; não representa funcionalidades já existentes.
Repositório: Tokenizaa/NettosCorp.

## 1. Objetivo e regras inegociáveis

Construir no NettosCorp um sistema operacional empresarial próprio, inspirado nos mecanismos úteis do Paperclip, sem integrar, depender ou instalar Paperclip como infraestrutura.

- Hermes é a única IA e o único núcleo de raciocínio e decisão. Não criar agentes autônomos adicionais.
- Departamentos, diretores, especialistas, equipes, cargos e responsáveis são funções organizacionais, não agentes de IA.
- Hermes mantém objetivos em andamento, planeja, decompõe, executa etapas autorizadas, acompanha, registra, avalia e continua sem pedir confirmação a cada etapa técnica já autorizada.
- Escalar ao fundador decisões estratégicas, financeiras, institucionais, irreversíveis ou fora das permissões.
- Governança deve ser aplicada pela infraestrutura, não apenas por prompts.
- Não declarar tarefa concluída sem resultado verificável, critérios de aceitação e evidências.
- Não fabricar heartbeat, atividade, progresso, execução, custo ou saúde.
- Preservar dados, histórico, credenciais e registros existentes. Não executar exclusões destrutivas ou migrações irreversíveis sem autorização.
- Distinguir: planejado, documentado, implementado, commitado, testado e operacional.
- Remover dependências e planos residuais de Paperclip; verificar licenças antes de reutilizar código.

## 2. Arquitetura em camadas

- Camada empresarial: 01 Organização, 02 Estratégia, 03 Trabalho.
- Camada operacional: 04 Orquestração, 05 Execução, 06 Memória.
- Camada transversal de controle: 07 Governança e Segurança, 08 Monitoramento e Confiabilidade.
- Camada de evolução e acesso: 09 Aprendizado e Evolução, 10 Interface e Integrações.

Governança e observabilidade atravessam todos os domínios. O banco NettosCorp é a fonte persistente de verdade. Serviços internos devem acessar dados por API/serviços com validação, autorização, transações e auditoria; evitar SQL espalhado em scripts e clientes.

## 3. Especificação dos dez domínios

### 01 — Organização e organograma
Responsabilidade: empresas, departamentos, unidades, cargos, funções, responsáveis, hierarquia, competências, escopo e relações de reporte.

Entidades sugeridas: Company, Department, OrganizationalUnit, Function, Position, Responsibility, Capability, ReportingLine, FunctionAssignment.

Regras:
- Hermes é a única entidade classificada como IA/executor inteligente.
- Entradas organizacionais existentes devem ser modeladas como funções/cargos, preservando IDs e histórico.
- reports_to descreve hierarquia organizacional, não delegação para outra IA.
- Função marcada como ativa não significa que esteja executando trabalho.

Serviços/API: leitura e atualização do organograma; atribuição de responsáveis; consulta de competências e permissões efetivas.

Aceitação: organograma navegável; integridade referencial; nenhum agente IA adicional; migração preserva registros.

### 02 — Estratégia e objetivos
Responsabilidade: visão, objetivos, resultados-chave, prioridades, indicadores, prazos e alinhamento entre objetivos, projetos e tarefas.

Entidades sugeridas: StrategicPlan, Goal, KeyResult, Metric, Priority, GoalRelation, GoalProgressSnapshot.

Regras:
- Todo objetivo tem responsável funcional, critério mensurável, prioridade e prazo ou justificativa para ausência.
- Objetivos podem ter relações pai/filho e vínculos com projetos.
- Hermes pode decompor objetivos em planos e tarefas dentro de sua autoridade.
- Mudanças de estratégia, orçamento ou compromisso institucional exigem aprovação do fundador.

Serviços/API: CRUD validado de objetivos; árvore de objetivos; cálculo de progresso baseado em evidências; identificação de conflitos e atrasos.

Aceitação: progresso calculado a partir de resultados rastreáveis, nunca de percentuais arbitrários.

### 03 — Gestão de projetos e tarefas
Responsabilidade: projetos, tarefas, subtarefas, dependências, bloqueios, comentários, anexos, entregáveis, revisão e histórico.

Entidades sugeridas: Project, Issue, Subtask, Dependency, Comment, Attachment, Deliverable, AcceptanceCriterion, Review.

Estados recomendados: backlog, todo, in_progress, in_review, done, blocked, cancelled. Mapear estados legados sem perder registros.

Regras:
- Toda tarefa tem descrição, prioridade, responsável funcional, critérios de aceitação e histórico; vincular objetivo/projeto quando aplicável.
- done exige entregável e evidência; revisão pode ser exigida por política.
- Dependências e bloqueios devem ser explícitos.
- Reabrir tarefas preserva o histórico anterior.

Serviços/API: criação e atualização; transições validadas; dependências; comentários; anexos; revisão e entrega.

Aceitação: transições inválidas são recusadas; nenhuma tarefa concluída sem evidência verificável.

### 04 — Orquestração e coordenação
Responsabilidade: transformar objetivos em trabalho executável e manter o ciclo operacional de Hermes.

Entidades sugeridas: WorkQueue, Schedule, Trigger, Assignment, OrchestrationRun, DependencyState, RetryPolicy.

Ciclo: observar eventos e objetivos → priorizar → decompor → verificar permissões e dependências → enfileirar → executar próxima ação autorizada → registrar resultado → atualizar tarefas → avaliar próximo passo → continuar.

Regras:
- Fila persistente e transacional; claim atômico impede dupla reivindicação.
- Gatilhos: agenda, tarefa atribuída, evento, aprovação, falha recuperável ou solicitação explícita.
- Retomadas limitadas, auditáveis e idempotentes quando possível.
- Conflito de claim: interromper a tentativa e reconciliar o estado; não executar em duplicidade.
- Cargos organizacionais não são workers de IA.

Serviços/API: scheduler, event dispatcher, queue, claim/lease, dependency resolver e retry manager.

Aceitação: testar concorrência, reinício, falha, retomada e eventos duplicados sem perda ou duplicação de execução.

### 05 — Motor de execução
Responsabilidade: executar ações concretas de Hermes por ferramentas, comandos e integrações autorizadas; capturar sessões, saídas, erros e custos.

Entidades sugeridas: Execution, ExecutionStep, ToolInvocation, ExecutionArtifact, Session, ExecutionCost, Checkpoint.

Regras:
- Hermes é o único componente de decisão inteligente. Adaptadores são mecanismos determinísticos, não agentes.
- Cada chamada registra ferramenta, parâmetros seguros, autorização, início/fim, resultado, erro e artefatos.
- Segredos nunca aparecem em logs ou relatórios.
- Definir timeout, cancelamento, limites, idempotência e retomada por ferramenta.
- Execução externa exige permissões explícitas e escopo mínimo.

Serviços/API: executor, tool registry, permission gate, session manager, artifact store e captura de custo.

Aceitação: demonstrar fluxo completo de tarefa real, ferramenta autorizada, saída persistida, erro tratado e evidência vinculada.

### 06 — Memória e contexto institucional
Responsabilidade: preservar contexto útil e rastreável para continuidade entre execuções.

Entidades sugeridas: Decision, DecisionRationale, Event, ActivityLog, TaskSession, ContextSnapshot, KnowledgeDocument, WorkProduct, LessonLearned.

Regras:
- Registrar decisões, justificativas, eventos, ações, resultados, falhas, evidências e próxima ação.
- Separar memória operacional, histórico auditável e conhecimento documental versionado.
- Contexto recuperado carrega origem, data e vínculo com projeto/tarefa.
- Não inventar fatos ausentes; marcar incerteza e fonte.

Serviços/API: timeline, busca contextual, snapshots, versionamento documental e recuperação de contexto.

Aceitação: reiniciar uma execução e recuperar estado, decisões e próxima ação sem depender da memória volátil da conversa.

### 07 — Governança e segurança
Responsabilidade: identidade, autorização, aprovações, limites, segredos, orçamento e trilha de auditoria.

Entidades sugeridas: Principal, Role, Permission, Policy, Approval, Budget, SecretReference, AuditEvent, SecurityIncident.

Regras:
- Negar por padrão; menor privilégio.
- Separar permissões de leitura, escrita, execução, publicação, gasto e administração.
- Aprovação humana para decisões estratégicas/financeiras/institucionais, ações destrutivas, alterações de permissões e operações fora da política.
- Orçamento e rate limits aplicados tecnicamente.
- Segredos em armazenamento apropriado; nunca hardcode em scripts, defaults ou exemplos.
- Registrar ator, ação, recurso, decisão de autorização, timestamp e correlação.

Serviços/API: policy engine, authorization middleware, approval workflow, secret provider, budget enforcement e auditoria.

Aceitação: testes positivos e negativos comprovam bloqueio de chamadas não autorizadas; nenhuma credencial padrão ou segredo em código.

### 08 — Monitoramento e confiabilidade
Responsabilidade: observar execução real, saúde dos serviços, filas, falhas, atrasos, retomadas e alertas.

Entidades sugeridas: Heartbeat, HealthCheck, RunMetric, Alert, Incident, RecoveryAttempt, ServiceStatus.

Regras críticas:
- Heartbeat pertence a processo/execução real de Hermes ou serviço identificado, com origem, timestamp, ID de execução e resultado.
- É proibido atualizar last_heartbeat_at de funções organizacionais para simular atividade.
- Separar disponibilidade do serviço, atividade de execução, sucesso da tarefa e estado organizacional.
- Alertar heartbeat vencido, fila parada, execução travada, falhas repetidas, orçamento excedido e inconsistências.
- Recuperação segura, limitada e auditável.

Serviços/API: heartbeat receiver, health probes, watchdog, alert manager, incident manager e recovery controller.

Aceitação: função organizacional inativa não recebe heartbeat artificial; falha real gera alerta rastreável.

### 09 — Aprendizado e evolução
Responsabilidade: melhorar procedimentos e ferramentas com avaliação, testes, versionamento e aprovação proporcional ao risco.

Entidades sugeridas: Skill, SkillVersion, Procedure, Evaluation, TestRun, ImprovementProposal, Regression, Release.

Ciclo: executar → avaliar evidências → identificar falha/oportunidade → propor melhoria → testar em ambiente seguro → comparar resultados → aprovar conforme política → versionar → publicar → monitorar regressões.

Regras:
- Aprendizado não autoriza autoalteração irrestrita de código, políticas, permissões ou segredos.
- Mudanças de baixo risco só seguem fluxo automatizado se explicitamente permitido; mudanças críticas exigem aprovação.
- Manter histórico, origem, diff, testes e rollback.
- Não declarar melhoria sem avaliação comparativa.

Serviços/API: skill registry, version manager, evaluation runner, test harness e release/rollback.

Aceitação: uma melhoria documentada, testada, versionada e comparada com baseline; rollback demonstrável.

### 10 — Interface e integrações
Responsabilidade: interface operacional, API própria, relatórios, CLI e conectores externos.

Entidades sugeridas: ApiClient, Integration, Connector, Webhook, Dashboard, Report, Notification, ApiKeyReference.

Regras:
- API própria como fronteira de validação, autorização, transações e auditoria.
- Frontend nunca contorna a API para gravar diretamente no banco.
- Estado local/fallback deve ser identificado como offline/desatualizado; nunca simular conexão ou sucesso.
- Revisar e remover dependências residuais de Paperclip (paperclipService.ts, variáveis e endpoints) sem quebrar módulos não relacionados.
- Revisar agentService.ts: impedir criação de múltiplas IAs e migrar gestão para funções organizacionais, preservando histórico.
- Integrações têm escopo, credenciais, limites, logs e revogação.

Serviços/API: REST interna versionada, autenticação, schemas, frontend, CLI, webhooks, conectores e relatórios.

Aceitação: operações críticas passam pela API e respeitam permissões; falha de integração é visível; nenhuma dependência operacional de Paperclip.

## 4. Contratos transversais

### Contrato de execução
Cada execução tem execution_id, actor=hermes, origem/gatilho, tarefa/objetivo, estado, timestamps, ferramentas, decisões, resultado, erros, artefatos, custos quando disponíveis e próxima ação.

### Contrato de conclusão
Uma tarefa só vai para done quando os critérios aplicáveis forem verificados, o entregável estiver persistido, evidências estiverem vinculadas, logs/auditoria estiverem completos e a revisão exigida tiver sido aprovada.

### Contrato de heartbeat
Heartbeat comprova atividade real de processo identificado. Deve conter source, process_id ou execution_id, timestamp, status e correlação. Nunca emitir heartbeat em nome de função/cargo apenas por estar ativa.

### Contrato de autorização
Toda ação de escrita, execução externa, publicação, gasto, alteração de política ou operação destrutiva passa por verificação central de permissões e limites antes de executar.

### Contrato de API
Toda operação valida schema, autentica/autoriza, usa transação quando necessário, registra auditoria e devolve erro explícito. Não mascarar falha com fallback silencioso.

## 5. Estrutura de diretórios de referência

Ajustar à estrutura real antes de criar arquivos; não duplicar módulos ou migrations.

    nos-os/
      docs/arquitetura/
        visao-geral.md
        dominios/
          01-organizacao.md
          02-estrategia.md
          03-trabalho.md
          04-orquestracao.md
          05-execucao.md
          06-memoria.md
          07-governanca-seguranca.md
          08-monitoramento-confiabilidade.md
          09-aprendizado-evolucao.md
          10-interface-integracoes.md
      src/
        organization/ strategy/ work/ orchestration/ execution/
        memory/ governance/ monitoring/ learning/ interfaces/
      tests/unit/ tests/integration/ tests/acceptance/
      migrations/

Esta estrutura é referência lógica, não ordem para criar pastas vazias. Implementar somente módulos com conteúdo funcional e testes.

## 6. Dependências e ordem de implementação

1. Inventário e segurança: mapear arquivos, tabelas, migrations, variáveis e credenciais; remover defaults inseguros; corrigir heartbeat artificial; preservar dados.
2. Domínios 01 e 07: identidade única Hermes, organograma funcional, papéis, permissões, políticas e aprovações.
3. Domínios 02 e 03: objetivos, projetos, tarefas, dependências, critérios e entregáveis.
4. Domínios 06 e 08: memória persistente, histórico, auditoria, heartbeat real e observabilidade.
5. Domínios 04 e 05: fila persistente, scheduler, claim atômico, executor, ferramentas, retomada e recuperação.
6. Domínio 09: skills, avaliações, testes, versionamento e rollback.
7. Domínio 10: API própria, frontend, CLI, relatórios e integrações.

Não iniciar etapa dependente antes dos contratos e testes mínimos. Tarefas independentes podem ser paralelizadas somente sem conflito de arquivos, dados ou decisões.

## 7. Plano obrigatório de trabalho do Hermes

Ao receber esta especificação:

1. Fazer git fetch e git pull da branch padrão do repositório Tokenizaa/NettosCorp; confirmar branch e SHA efetivamente baixado.
2. Ler este documento integralmente e reler arquivos atuais do NOS-OS, frontend, serviços, migrations e testes relacionados.
3. Produzir inventário real: caminho, função, estado, dependências, riscos e evidência. Não confiar apenas em README ou relatórios anteriores.
4. Comparar cada domínio com o estado atual: implementado, parcial, apenas documentado, ausente ou bloqueado. Citar caminhos e linhas/commits.
5. Apresentar plano de migração que preserve dados, IDs, histórico e compatibilidade. Não apagar nem sobrescrever registros.
6. Corrigir primeiro riscos críticos já identificados: senha padrão em scripts, heartbeat artificial e dependências residuais de Paperclip. Se uma credencial real puder ter sido exposta, recomendar rotação segura sem reproduzi-la.
7. Implementar por etapas pequenas, cada uma com testes, logs, documentação e commits rastreáveis. Não criar agentes IA adicionais.
8. Não fingir execução, testes, heartbeat, progresso ou conexão. Em bloqueio, registrar causa, evidência e alternativa segura; continuar outras tarefas autorizadas.
9. Não fazer deploy, migração destrutiva, exclusão de dados, gasto ou mudança estratégica sem aprovação aplicável.
10. Ao final de cada etapa, entregar relatório com arquivos alterados, migrations, testes e resultados, commit SHA, riscos remanescentes e próxima ação autorizada.
11. Continuar para a próxima etapa autorizada sem parar para pedir confirmação de rotina. Pedir decisão ao fundador somente para escolha estratégica, financeira, institucional, irreversível ou fora das permissões.

## 8. Critério de homologação do NOS-OS

Só declarar NOS-OS operacional quando houver evidência reproduzível de: Hermes como único núcleo de IA; organograma e permissões aplicadas; objetivos e tarefas persistidos; fila e execução reais com claim atômico; retomada segura; memória e auditoria persistentes; heartbeat verdadeiro; testes unitários, integração e aceitação aprovados; API/interface sem fallback enganoso; ausência de dependência operacional de Paperclip; documentação atualizada e commits identificáveis.

Regra final: arquivos, tabelas, cargos ativos ou documentação não provam operação. Somente implementação executável, testes e evidências verificáveis permitem essa conclusão.
