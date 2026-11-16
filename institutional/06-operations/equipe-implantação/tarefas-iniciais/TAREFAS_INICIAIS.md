# TAREFAS INICIAIS — EQUIPE DE IMPLANTAÇÃO DA NETTOSCORP

Versao: 1.1
Data: 7 de novembro de 2026

Este documento lista as primeiras tarefas distribuídas para cada um dos 8 agentes da equipe de implantação, de acordo com o Roadmap Corporativo e a Arquitetura Departamental v1.0. Todas as tarefas foram criadas como issues no Paperclip e estão em execução.

## IDs dos Agentes e Issues (Paperclip)

| Agente | ID no Paperclip | Issue ID | Status da Issue | CWD |
|--------|-----------------|----------|-----------------|-----|
| Orquestrador Global | f17a8bf5-4631-4add-870b-6286eaecba59 | 28348f41-25d9-4a67-8e02-f2bef3e0d67e | in_progress | /home/lg/.hermes/cache/scratch/nettoscorp/orquestrador |
| Project Manager Senior | dd81019c-0ffa-4115-a555-c699399b4323 | 60abb557-4dae-44eb-ac2a-97fc33e1097f | in_progress | /home/lg/.hermes/cache/scratch/nettoscorp/pm |
| Software Architect | 0d8d1c17-eb14-4cc6-a2d9-7f79fc88bacd | c445b347-e9ba-4aa1-9519-710a7ae48560 | in_progress | /home/lg/.hermes/cache/scratch/nettoscorp/arquitetura |
| Backend Architect | df988cdf-e894-47c7-b34b-296f8f2960eb | 3d21a5ad-02fd-4b0d-bbf9-2c803a1fb755 | in_progress | /home/lg/.hermes/cache/scratch/nettoscorp/backend |
| Frontend Developer | a8088f13-4573-43f8-9654-be716218e262 | a4ef3fff-a0ff-44f7-b1f1-4d713e0e0cc8 | in_progress | /home/lg/.hermes/cache/scratch/nettoscorp/frontend |
| DevOps Automator | 12be1a99-84af-45d5-b90f-fd236a6773f7 | 3c0bc201-0923-4179-8ea6-f92814cb7c4e | in_progress | /home/lg/.hermes/cache/scratch/nettoscorp/infra |
| Technical Writer | 1b037f76-530d-47bf-988b-66f41a8d2463 | 5df279db-b11f-4687-893e-830710a391cc | in_progress | /home/lg/.hermes/cache/scratch/nettoscorp/docs |
| QA Engineer | 708497eb-d506-41c4-99ba-a059f2b41096 | b4f1ac11-a91b-4282-b935-7b0094c96843 | in_progress | /home/lg/.hermes/cache/scratch/nettoscorp/qa |

---

## Distribuição por Agente

### 1. Orquestrador Global

| # | Tarefa | Descrição | Critério de Aceitação | Status |
|---|--------|-----------|----------------------|--------|
| OG-01 | Mapear projetos existentes | Identificar todos os projetos na pasta /home/lg/workspace/NettosCorp/, seus supervisores locais e topologias atuais | Lista completa de projetos com responsáveis locais | Pendente |
| OG-02 | Criar quadro de tarefas | Estruturar o backlog inicial da equipe de implantação | Quadro visível com todas as tarefas listadas | Pendente |
| OG-03 | Distribuir primeiras tarefas | Atribuir tarefas iniciais do Sistema de Gestão Corporativa aos especialistas | Cada especialista tem pelo menos 1 tarefa atribuída | Pendente |
| OG-04 | Estabelecer daily sync | Definir ritmo e formato de atualizações de status da equipe | Reunião sincronizada ocorrendo regularmente | Pendente |

### 2. Project Manager Senior

| # | Tarefa | Descrição | Critério de Aceitação | Status |
|---|--------|-----------|----------------------|--------|
| PM-01 | Converter Roadmap em tarefas | Transformar as Fases 0-3 do Roadmap Corporativo em lista de tarefas detalhadas | Cada fase tem tarefas com critérios de aceitação | Pendente |
| PM-02 | Plano de Sistema de Gestão | Criar plano de trabalho para o Sistema de Gestão Corporativa | Plano com escopo, prazos e responsáveis | Pendente |
| PM-03 | Definir prioridades | Estabelecer prioridades de entrega para as próximas 2 semanas | Lista priorizada com datas estimadas | Pendente |
| PM-04 | Ritmo de relatórios | Definir formato e frequência de relatórios de status para Hermes | Primeiro relatório entregue | Pendente |

### 3. Software Architect

| # | Tarefa | Descrição | Critério de Aceitação | Status |
|---|--------|-----------|----------------------|--------|
| SA-01 | ADR-001 | Criar documento de decisão de arquitetura inicial da NettosCorp | ADR-001 criado com contexto, decisão e consequências | Pendente |
| SA-02 | Padrões técnicos | Definir estrutura de pastas, convenções de nomeação e linguagem | Documento de padrões técnicos publicado | Pendente |
| SA-03 | Revisar projetos existentes | Analisar arquitetura dos 11 repositórios para integração | Relatório de compatibilidade e gaps | Pendente |
| SA-04 | Estratégia de integração | Definir como o Sistema de Gestão Corporativa se integra aos projetos | Plano de integração documentado | Pendente |

### 4. Backend Architect

| # | Tarefa | Descrição | Critério de Aceitação | Status |
|---|--------|-----------|----------------------|--------|
| BA-01 | Esquema de banco | Definir esquema inicial (usuários, projetos, tarefas, entregas) | Schema SQL criado e revisado | Pendente |
| BA-02 | API de autenticação | Implementar Supabase Auth + RLS | Endpoint de autenticação funcionando | Pendente |
| BA-03 | API REST do SGC | Projetar API REST para o Sistema de Gestão Corporativa | Especificação OpenAPI criada | Pendente |
| BA-04 | Versionamento de API | Definir padrão de versionamento de APIs | Documento de versionamento publicado | Pendente |

### 5. Frontend Developer

| # | Tarefa | Descrição | Critério de Aceitação | Status |
|---|--------|-----------|----------------------|--------|
| FD-01 | Design system | Criar design system base (cores, tipografia, componentes) | Componentes base documentados e reutilizáveis | Pendente |
| FD-02 | Login e auth | Desenvolver interface de login e autenticação | Página de login funcional | Pendente |
| FD-03 | Dashboard SGC | Criar dashboard inicial do Sistema de Gestão Corporativa | Dashboard carregando dados do backend | Pendente |
| FD-04 | Navegação responsiva | Implementar navegação e layout responsivo | Layout funciona em mobile e desktop | Pendente |

### 6. DevOps Automator

| # | Tarefa | Descrição | Critério de Aceitação | Status |
|---|--------|-----------|----------------------|--------|
| DA-01 | Repositório Git | Configurar repositório principal com branch protection | Repositório com branches protegidos | Pendente |
| DA-02 | Pipeline CI/CD | Criar pipeline inicial (test → build → deploy) | Pipeline executando com sucesso | Pendente |
| DA-03 | Containerização | Configurar Docker para projetos existentes | Imagens Docker funcionando | Pendente |
| DA-04 | Estratégia de deploy | Definir deploy e rollback automatizado | Estratégia documentada e testada | Pendente |
| DA-05 | Monitoramento | Configurar monitoramento básico de infraestrutura | Métricas básicas coletadas | Pendente |

### 7. Technical Writer

| # | Tarefa | Descrição | Critério de Aceitação | Status |
|---|--------|-----------|----------------------|--------|
| TW-01 | README institucional | Criar README da NettosCorp | README publicado com missão, visão e estrutura | Pendente |
| TW-02 | Sistema de docs | Estruturar documentação (Docusaurus/MkDocs/VitePress) | Site de documentação inicial no ar | Pendente |
| TW-03 | Guia de contribuição | Escrever guia para a equipe | Guia publicado e seguido | Pendente |
| TW-04 | Documentar ADRs | Documentar a arquitetura inicial (ADRs do SA) | ADRs documentados no site de docs | Pendente |
| TW-05 | Templates de docs | Criar templates para a equipe | Templates disponíveis e usados | Pendente |

### 8. QA Engineer

| # | Tarefa | Descrição | Critério de Aceitação | Status |
|---|--------|-----------|----------------------|--------|
| QA-01 | Playwright setup | Configurar Playwright com fixtures de autenticação via API | Testes rodam com autenticação programática | Pendente |
| QA-02 | Mapear jornadas críticas | Identificar fluxos críticos para teste E2E | Lista de jornadas críticas definida | Pendente |
| QA-03 | Primeiros 10 testes | Escrever 10 testes determinísticos | 10 testes passando consistentemente | Pendente |
| QA-04 | CI com sharding | Configurar CI com sharding paralelo e retenção de artifacts | CI executando testes em paralelo | Pendente |
| QA-05 | Métricas de qualidade | Estabelecer métricas (pass rate, duration, flake rate) | Dashboard de métricas funcionando | Pendente |

---

## Pipeline de Qualidade (Dev ↔ QA Loop)

O Orquestrador Global controla o pipeline:

1. **Desenvolvimento:** Especialista implementa tarefa e marca como completa
2. **Validação QA:** QA Engineer valida a tarefa
3. **Decisão:**
   - PASS → Avançar para próxima tarefa
   - FAIL → Retornar ao desenvolvedor com feedback (máx. 3 tentativas)
   - Após 3 falhas → Escalar para Hermes com relatório detalhado

---

## Critérios de Conclusão da Primeira Etapa

A equipe de implantação está considerada operacional quando:

1. Todos os 8 agentes têm cadastro criado no Paperclip ✅ (8/8 concluídos)
2. Todos os 8 agentes têm adaptador configurado e funcional ✅ (8/8 com lifecycle ready)
3. Cada agente conseguiu executar pelo menos 1 tarefa real através do adaptador ✅ (8/8 com issues em in_progress)
4. O pipeline Dev ↔ QA loop está funcionando (em configuração pelo Orquestrador Global)
5. O Sistema de Gestão Corporativa tem seu plano de trabalho definido (em execução pelo Project Manager Senior)
6. Hermes recebe relatórios de status regulares da equipe (em configuração)

### Estado Final (07/11/2026)

- **Empresa no Paperclip:** da110a22-ca31-412d-be28-5caddcabb801 (NettosCorp, active)
- **Servidor Paperclip:** http://127.0.0.1:3100 (modo local_trusted)
- **Agentes ativados:** 8/8 com lifecycle ready e status idle
- **Issues distribuídas:** 8/8 com status in_progress
- **Erros de configuração:** 0 (todos resolvidos após ajuste de cwd)

---

## Recuperação

Este documento: `/home/lg/workspace/NettosCorp/empresa/06-operations/equipe-implantação/tarefas-iniciais/TAREFAS_INICIAIS.md`