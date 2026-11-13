# SISTEMA DE GESTÃO CORPORATIVA — NETTOSCORP

Versao: 1.0 (proposta, em definicao, NAO aprovada)
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/03-management-system/SISTEMA_GESTAO_CORPORATIVA.md
Status: PROPOSTA INSTITUCIONAL — sujeita a revisao e aprovacao pela lideranca fundadora (Netto Farias).

---

## 1. Premissa

Este documento propõe um Sistema de Gestao Corporativa para a NettosCorp, selecionando praticas de referencias reconhecidas (PMI/PMBOK, ITIL 4, ISO 9001, ISO/IEC 27001, TOGAF, Scrum, Kanban, Agile). A adicao e seletiva: sao aproveitados apenas os elementos que agregam valor a uma empresa de software em fundacao operada com agentes de IA. Nao e uma copia integral de nenhuma metodologia e nao cria burocracia desnecessaria.

Nenhuma certificacao, conformidade normativa ou auditoria externa e reivindicada neste documento.

---

## 2. Metodologias de referencia e uso proposto

| Referencia | O que se aproveita | O que se descarta ou adapta |
|------------|-------------------|----------------------------|
| PMI/PMBOK | Gestao de projetos, ciclos de vida, escopo, tempo, custo, qualidade, recursos, comunicacao, riscos, partes interessadas, aquisicoes. | Certificacao PMP, burocracia de artefatos excessivos, gerencia de programas complexos nao aplicavel a porte inicial. |
| ITIL 4 | Gestao de servicos, cadeia de valor de servicos, praticas de operacao, incidente, mudança, problema, continuidade. | Estrutura completa de gestao de servicos de TI para grandes corporacoes; camadas de aprovacao excessivas. |
| ISO 9001 | Qualidade, focno no cliente, lideranca, envolvimento de pessoas, abordagem por processos, melhoria continua, decisoes baseadas em evidencias. | Certificacao ISO 9001, documentacao obrigatoria de sistema de gestao da qualidade completo. |
| ISO/IEC 27001 | Seguranca da informacao, analise de riscos de seguranca, controles de acesso, gerencia de incidentes de seguranca. | Certificacao ISO 27001, Statement of Applicability completo, controles excessivos para porte inicial. |
| TOGAF | Arquitetura empresarial, visao de negocio, arquitetura de dados, aplicacao, tecnologia, metodo de desenvolvimento de arquitetura (ADM). | Ciclo completo ADM para grandes empresas; entregas de artefatos de arquitetura pesados. |
| Agile / Scrum / Kanban | Execucao iterativa, acompanhamento visual (kanban), papoes leves (product owner, scrum master — adaptados), retrospectivas, melhoria continua. | Papoes e cerimoniais rigidos de Scrum para equipes grandes; sprints fixos se nao fizerem sentido ao contexto. |

---

## 3. Propostas de gestao por dominio

### 3.1 Gestao estratégica
- Definicao de objetivos, prioridades e direcionamentos pela lideranca fundadora.
- Acompanhamento periodico do alinhamento entre atividades operacionais e objetivos estrategicos.
- Revisao estrategica semestral (proposta, a ser aprovada).
- Referencia: PMI/PMBOK (gestao de portfolio e programas simplificado), TOGAF (visao de negocio).

### 3.2 Gestão de portfólio
- Catalogo de projetos existentes e produtos da NettosCorp.
- Priorizacao de projetos com base em valor, risco e alinhamento strategico.
- Nao ha portifolio constituido ainda; este dominio se aplica apos a Fase 4 do roadmap (reconhecimento do portifolio existente).
- Referencia: PMI/PMBOK (gestao de portfolio simplificado).

### 3.3 Gestão de projetos
- Ciclos de vida de projetos adaptados a software (inicio, planejamento, execucao, monitoramento, encerramento).
- Artefatos leves: escopo, cronograma simplificado, registro de riscos, registro de decisoes, relatorio de encerramento.
- Uso de Kanban para acompanhamento visual de atividades.
- Referencia: PMI/PMBOK (areas de conhecimento simplificadas), Scrum/Kanban (execucao iterativa e visual).

### 3.4 Engenharia de software
- Documentacao de codigo, arquitetura e decisoes tecnicas como parte do entregavel.
- Padroes de versao e rastreabilidade (a serem definidos na Fase 5 do roadmap).
- Qualidade de codigo e revisao entre pares (proposta, a ser detalhada).
- Nao ha pilha de tecnologia definida neste documento.

### 3.5 Gestão da qualidade
- Focno no cliente e nos requisitos do produto.
- Abordagem por processos para atividades relevantes.
- Melhoria continua baseada em evidencias.
- Nao e um Sistema de Gestao da Qualidade certificado ISO 9001; e uma adaptacao seletiva de seus principios.
- Referencia: ISO 9001 (principios de qualidade), Scrum (retrospectivas).

### 3.6 Segurança da informação
- Seguranca como requisito base, nao opcional.
- Analise de riscos de seguranca simplificada para porte inicial.
- Controles de acesso e permissões (protocolo a ser definido em 00-governance/).
- Gerencia de incidentes de seguranca.
- Nao e um SGSI certificado ISO/IEC 27001; e uma adaptacao seletiva de seus controles.
- Referencia: ISO/IEC 27001 (controles de seguranca simplificados).

### 3.7 Gestão de riscos
- Registro de riscos e pendencias (em 08-decisions/ e 09-reports/).
- Analise de probabilidade e impacto para riscos institucionais e de projetos.
- Plano de mitigacao para riscos altos.
- Referencia: PMI/PMBOK (gestao de riscos), ISO 27001 (riscos de seguranca).

### 3.8 Gestão de mudanças
- Qualquer mudanca em documentos institucionais, politicas, procedimentos ou estrutura de autoridade deve ser registrada em 08-decisions/.
- Mudancas estrategicas exigem aprovacao do fundador.
- Mudancas operacionais de coordenacao podem ser aprovadas pelo Chefe de Gabinete Executivo.
- Referencia: ITIL 4 (gerencia de mudanca simplificada).

### 3.9 Gestão de incidentes
- Registro de incidentes operacionais, de seguranca e de qualidade.
- Classificacao por gravidade (proposta: baixa, media, alta, critica).
- Procedimento de resposta e encerramento de incidente.
- Referencia: ITIL 4 (gerencia de incidentes simplificada).

### 3.10 Operações e continuidade
- Acompanhamento de execucao de atividades e produtos.
- Relatorios periodicos de acompanhamento (09-reports/).
- Plano de continuidade simplificado para atividades críticas (a ser definido).
- Referencia: ITIL 4 (gestao de servicos e operacoes), ISO 27001 (continuidade de negocio simplificada).

### 3.11 Indicadores de desempenho
- Indicadores propostos (a serem validadas com dados reais):
  - Numero de documentos institucionais versionados.
  - Numero de decisoes registradas.
  - Numero de protocolos operacionais em uso.
  - Tempo de resolucao de incidentes.
  - Numero de riscos ativos e mitigados.
- Nao ha dados reais de desempenho neste documento; os indicadores sao placeholders para aprovacao.

### 3.12 Auditoria e melhoria continua
- Revisao periodica de documentos institucionais.
- Auditoria interna simplificada de conformidade com protocolos e principios de documentacao.
- Melhoria continua do Sistema de Gestao Corporativa com base em evidencias.
- Referencia: ISO 9001 (melhoria continua), Scrum (retrospectivas).

---

## 4. Restricoes e limites

- Nao e um sistema de gestao certificado por qualquer entidade externa.
- Nao copia integralmente nenhuma metodologia referencia.
- Nao cria burocracia desnecessaria.
- Todas as praticas selecionadas dependem de aprovacao da lideranca para implementacao.
- Nenhuma metrica, KPI ou dado de desempenho e apresentado como fato consumado.

---

## 5. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/03-management-system/SISTEMA_GESTAO_CORPORATIVA.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/03-management-system/SISTEMA_GESTAO_CORPORATIVA.md")

---

Nenhum codigo de projeto foi alterado. Nenhuma estrutura de organograma foi implantada. Este e apenas uma proposta de sistema de gestao para avaliacao da lideranca.