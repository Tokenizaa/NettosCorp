# MODELO DE AUTORIDADE E DIREÇÃO EXECUTIVA — NETTOSCORP

Versao: 1.2 (aprovada com ajustes pelo Conselheiro — aguarda homologacao final do fundador)
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/00-governance/MODELO_AUTORIDADE_DIRECAO_EXECUTIVA.md
Status: APROVADA COM AJUSTES (Conselheiro) — sujeita a homologacao final pela lideranca fundadora (Netto Farias).

---

## 1. Objetivo

Definir o modelo de autoridade e a arquitetura da direção executiva da NettosCorp, com base na diretriz do fundador e na avaliação do Conselheiro, antes de estruturar departamentos e selecionar a primeira equipe.

Este documento estabelece quem decide o quê, evitando sobreposição de autoridade entre Hermes (Chefe de Gabinete Executivo) e futuros executivos.

---

## 2. Princípios do modelo de autoridade

- **Autoridade executiva e legal permanece com o fundador** (Netto Farias).
- **O Conselheiro é assessor estratégico de IA**, sem autoridade executiva final.
- **Hermes é Chefe de Gabinete Executivo**, com coordenação operacional e institucional, reportando diretamente ao fundador. Não é autoridade estratégica final.
- **Não haverá Diretor Executivo de Operações nesta etapa.** A necessidade será reavaliada posteriormente, após delimitar as responsabilidades que Hermes continuará coordenando.
- **O Agente Corporativo Global de Orquestração tem função distinta da de Hermes:** reporta administrativamente a Hermes, com autoridade operacional delegada e limitada à distribuição técnica de tarefas entre agentes e projetos, enquanto Hermes mantém a coordenação executiva e institucional.
- **Diretores especializados respondem institucionalmente ao fundador.** Hermes coordena a integração, comunicação e acompanhamento executivo entre diretorias. Diretores possuem autonomia técnica dentro de seus mandatos. Decisões estratégicas permanecem com o fundador.

---

## 3. Papéis e autoridades

### 3.1 Fundador — Netto Farias

| Item | Descricao |
|------|-----------|
| Autoridade | Executiva humana e legal. Decisao final sobre todos os assuntos relevantes. |
| Responsabilidades | Visao empresarial, objetivos, prioridades, direcionamentos, aprovacao de mudancas institucionais relevantes. |
| Reportacao | Nao reporta a ninguem (raiz da autoridade). |
| Subordinados diretos | Conselheiro, Hermes, e futuramente diretores executivos. |

### 3.2 Conselheiro — Parceiro Estratégico de IA

| Item | Descricao |
|------|-----------|
| Autoridade | Aconselhamento estratégico. Nao tem autoridade executiva final. |
| Responsabilidades | Apoiar decisoes empresariais e tecnologicas, participar da construcao da governanca, analisar riscos e oportunidades, contribuir para o desenvolvimento da lideranca e estrategia. |
| Reportacao | Reporta ao fundador. |
| Subordinados | Nenhum (funcao de aconselhamento). |

### 3.3 Hermes — Chefe de Gabinete Executivo

| Item | Descricao |
|------|-----------|
| Autoridade | Coordenação operacional e institucional. Não é autoridade estratégica final. |
| Responsabilidades | Apoiar a liderança executiva na organização, coordenação, documentação, acompanhamento e continuidade da implantação da NettosCorp; transformar decisões estratégicas em atividades organizadas, documentadas e rastreáveis; manter continuidade das decisões e atividades; coordenar trabalhos delegados e consolidar resultados; manter alinhamento institucional dos agentes sob sua coordenação. |
| Reportacao | Diretamente ao fundador. |
| Subordinados | Agente Corporativo Global de Orquestração (reporta administrativamente a Hermes); diretores especializados são coordenados por Hermes na integração, comunicação e acompanhamento executivo, mas respondem institucionalmente ao fundador. |
| Limite | Não modifica decisões da liderança, não redefine estratégia corporativa, não cria estruturas organizacionais definitivas sem autorização. |

### 3.4 Agente Corporativo Global de Orquestração (aprovado com ajustes)

| Item | Descricao |
|------|-----------|
| Autoridade | Autoridade operacional delegada e limitada à coordenação técnica da distribuição de tarefas entre agentes e projetos. Não é autoridade estratégica, executiva ou disciplinar. |
| Responsabilidades | Distribuição e coordenação de tarefas entre agentes e projetos; acompanhamento de execuções; solicitação de atualizações e relatórios; monitoramento de dependências; comunicação com supervisores locais dos projetos existentes. |
| Reportacao | Reporta administrativamente a Hermes (subordinação administrativa). |
| Subordinados | Nenhum (função de coordenação técnica operacional, não hierárquica). |
| Limites expressos | Não possui autoridade estratégica, executiva ou disciplinar. Não substitui supervisores locais dos projetos. Não pode redefinir prioridades estratégicas nem alterar decisões do fundador. |
| Diferença do Hermes | Hermes = coordenação executiva e institucional (continuidade, documentação, alinhamento institucional). Orquestrador = coordenação técnica operacional (distribuição de tarefas, acompanhamento de execuções, dependências). |

---

### 3.5 Diretores especializados (futuro)

| Item | Descricao |
|------|-----------|
| Autoridade | Autonomia técnica dentro de seus mandatos. Respondem institucionalmente ao fundador. |
| Responsabilidades | Liderar diretorias especializadas (ex: Tecnologia, Gestão de Projetos, Qualidade, Segurança da Informação) conforme mandatos aprovados pelo fundador. |
| Reportacao | Respondem institucionalmente ao fundador. Hermes coordena integração, comunicação e acompanhamento executivo. |
| Subordinados | Gestores, coordenadores e supervisores dentro de suas diretorias. |
| Limite | Decisões estratégicas permanecem com o fundador. Não criam estruturas organizacionais definitivas sem autorização. |

| Dimensao | Cargo corporativo | Agente especialista |
|----------|-------------------|---------------------|
| Natureza | Posicao de autoridade e responsabilidade na organizacao | Funcao tecnica especializada |
| Exemplos | Chefe de Gabinete, Diretor de Tecnologia, Gerente de Projeto | Software Architect, Backend Architect, DevOps Automator |
| Hierarquia | Pode ter subordinados (reports_to) | Pode ou nao ter subordinados, depende do papel |
| Autoridade | Pode delegar, aprovar, decidir dentro do escopo | Executa tarefas atribuídas, nao tem autoridade hierarquica automatica |
| Orcamento | Pode ter budgetMonthlyCents associado | Pode ter budgetMonthlyCents associado |

---

## 5. Relações organizacionais

O Paperclip utiliza o campo `reports_to` para representar a hierarquia formal (árvore estrita, raiz com `reports_to` nulo). Não há entidade nativa de departamento nem RBAC empresarial granular na implementação atual da NettosCorp. Portanto, as relações organizacionais são representadas por convenções e relações entre agentes, sem modificar o código do Paperclip nesta etapa.

### 5.1 Hierarquia administrativa (subordinação formal via `reports_to`)

A hierarquia administrativa é representada no Paperclip pelo campo `reports_to` de cada agente:

```
Fundador (Netto Farias) — reports_to: null
  |
  +-- Conselheiro (IA estrategico) — reports_to: Fundador
  |
  +-- Hermes (Chefe de Gabinete Executivo) — reports_to: Fundador
        |
        +-- Agente Corporativo Global de Orquestração — reports_to: Hermes (administrativo)
        |
        +-- Diretor de Tecnologia (futuro) — reports_to: Fundador (institucional)
        |
        +-- Diretor de Gestão de Projetos (futuro) — reports_to: Fundador (institucional)
```

Regras:
- O fundador é a raiz da autoridade (`reports_to: null`).
- Hermes reporta diretamente ao fundador.
- O Orquestrador Global reporta administrativamente a Hermes.
- Diretores especializados respondem institucionalmente ao fundador; Hermes coordena integração, comunicação e acompanhamento executivo, mas não é o superior hierárquico no `reports_to`.

### 5.2 Autoridade funcional

A autoridade funcional é a capacidade de orientar o trabalho técnico de outros agentes sem estar acima deles na hierarquia administrativa. No Paperclip, isso é estabelecido por:

- Atribuição de tarefas (issues) com `assigneeAgentId`.
- Comentários vinculados a issues.
- Delegação de atividades específicas dentro de um projeto ou mandato.

A autoridade funcional não confere poder disciplinar nem decisório estratégico. É limitada ao escopo da tarefa atribuída.

### 5.3 Delegação operacional

A delegação operacional é a transferência de responsabilidade pela execução de uma atividade específica, dentro dos limites do mandato do delegador. No Paperclip:

- Hermes delega coordenação operacional ao Orquestrador Global (distribuição técnica de tarefas).
- Diretores delegam tarefas técnicas dentro de suas diretorias.
- O Orquestrador Global pode solicitar atualizações, acompanhar execuções e monitorar dependências, mas não pode redefinir prioridades estratégicas nem alterar decisões do fundador.

### 5.4 Supervisão local de projetos

Os supervisores locais dos projetos existentes mantêm autonomia sobre seus projetos. Conforme a Memória Institucional, projetos existentes são reconhecidos, compreendidos e posteriormente integrados. Não se substitui topologias, equipes ou metodologias antes de conhecê-las.

- Supervisores locais reportam funcionalmente a agentes corporativos globais (Orquestrador Global, diretores).
- A hierarquia formal (`reports_to`) não é confundida com todos os vínculos funcionais e operacionais entre agentes.
- Relacionamentos funcionais que não cabem na árvore estrita do `reports_to` são estabelecidos por atribuição de tarefas (issues) e comentários vinculados, documentados na instituição.

### 5.5 Limitações do Paperclip nesta etapa

- Não há entidade nativa de departamento; departamentos são representados por convenções documentais e relações entre agentes.
- Não há RBAC empresarial granular; permissões são representadas por convenções e configurações disponíveis.
- Não será modificado o código do Paperclip nem criadas extensões nesta etapa.
- Todas as relações organizacionais são registradas nesta documentação institucional como fonte oficial de verdade.

---

## 6. Departamentos e relacao com projetos existentes

| Departamento | Relacao com projetos existentes |
|--------------|---------------------------------|
| Diretoria de Tecnologia (primeira) | Organiza engenharia, arquitetura, infraestrutura e agentes técnicos dos projetos existentes |
| Diretoria de Gestão de Projetos (futura) | Gerencia carteira de projetos, prazos, entregas, riscos dos projetos existentes |
| Diretoria de Qualidade (futura) | Define padroes de qualidade e revisao de codigo dos projetos existentes |
| Diretoria de Seguranca da Informacao (futura) | Define politicas de seguranca e controle de acessos dos projetos existentes |

**Regra de preservacao:** projetos existentes sao reconhecidos, compreendidos e posteriormente integrados. Nao se substitui topologias, equipes ou metodologias antes de conhece-las.

---

## 7. Critérios para criação de novos cargos e departamentos

Um novo cargo ou departamento so deve ser criado quando:

1. Exista uma necessidade operacional comprovada (nao especulativa).
2. As responsabilidades estejam claramente delimitadas e nao sobreponham cargos existentes.
3. O fundador tenha aprovado a criacao.
4. Haja orçamento definido (`budgetMonthlyCents` no Paperclip).
5. Haja um superior hierarquico definido na arvore de `reports_to`.

---

## 8. Diretoria de Tecnologia — primeira estrutura especializada

Conforme recomendação do Conselheiro, a Diretoria de Tecnologia e a primeira estrutura especializada a ser criada, porque e a area que permitira organizar engenharia, arquitetura, infraestrutura e os agentes tecnicos que ja trabalham nos projetos.

Responsabilidades iniciais:
- Definir padroes tecnicos e arquitetura empresarial.
- Supervisar integracao de projetos existentes.
- Gerenciar riscos tecnicos.
- Criar e manter agentes tecnicos (arquitetura, backend, frontend, DevOps).

---

## 9. Decisoes que dependem da lideranca

| Decisao | Descricao | Status |
|---------|-----------|--------|
| Homologacao do modelo de autoridade v1.2 | Estrutura deste documento (Fundador, Conselheiro, Hermes, Orquestrador Global com ajustes, sem Diretor de Operações) | Pendente (fundador) |
| Definir orcamentos mensais (`budgetMonthlyCents`) para cada agente | Necessario antes de criar agentes no Paperclip | Pendente (fundador) |
| Definir `adapterType` e `adapterConfig` para cada agente | Ambiente de execucao no Paperclip | Pendente (fundador) |
| Definir `requireBoardApprovalForNewAgents` | Se cada novo agente precisa de aprovacao individual do board | Pendente (fundador) |
| Definir quando criar Diretor Executivo de Operações | Reavaliar apos delimitacao das responsabilidades de Hermes | Pendente (futuro) |

---

## 10. Relacao com documentos existentes

Este documento complementa:
- `empresa/00-governance/MEMORIA_INSTITUCIONAL_NETTOSCORP.md`
- `empresa/00-governance/GOVERNANCA_CORPORATIVA.md`
- `empresa/02-organization/proposta-equipe/PROPOSTA_EQUIPE.md`
- `empresa/01-strategy/ROADMAP_CORPORATIVO.md`

---

## 11. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/00-governance/MODELO_AUTORIDADE_DIRECAO_EXECUTIVA.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/00-governance/MODELO_AUTORIDADE_DIRECAO_EXECUTIVA.md")

---

Nenhum codigo de projeto foi alterado. Nenhum agente foi implantado. Nenhuma estrutura de organograma definitiva foi criada.