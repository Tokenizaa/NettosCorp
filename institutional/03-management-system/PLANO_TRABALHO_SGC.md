# PLANO DE TRABALHO — SISTEMA DE GESTÃO CORPORATIVA — NETTOSCORP

Versão: 1.0 (proposta, em definição, NÃO aprovada)
Data: 14 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/03-management-system/PLANO_TRABALHO_SGC.md
Responsável: Chefe de Gabinete Executivo (Hermes)
Status: PROPOSTA INSTITUCIONAL — sujeita a revisão e aprovação pela liderança fundadora (Netto Farias).

---

## 1. Propósito

Este documento traduz o **RODREAMAP CORPORATIVO** (empresa/01-strategy/ROADMAP_CORPORATIVO.md) em **tarefas executáveis** para as fases 0 a 3 do Sistema de Gestão Corporativa (SGC), e consolida o plano de trabalho, prioridades e ritmo de relatórios. Ele é o complemento operacional de SISTEMA_GESTAO_CORPORATIVA.md.

Regras de execução (application das regras do roadmap):
- Nenhuma fase inicia antes da fase anterior ser aprovada pelo fundador.
- Nenhuma etapa é marcada como concluída apenas por estar listada.
- Critérios de conclusão e evidências devem ser produzidos para cada fase antes de considerá-la encerrada.
- Todas as decisões de aprovação são registradas em empresa/08-decisions/.

---

## 2. Visão do SGC (Fases 0–3)

Objetivo conjunto das fases 0 a 3: **estabelecer a base institucional, mapear as práticas de gestão, definir a estrutura organizacional e consolidar o SGC**, todas submetidas à aprovação do fundador antes de avançar.

| Fase | Objetivo | Principais entregáveis |
|------|----------|------------------------|
| Fase 0 | Fundamentos da empresa | MEMORIA_INSTITUCIONAL_NETTOSCORP.md, estrutura de pastas, princípios de documentação |
| Fase 1 | Reconhecimento das ferramentas de gestão | Inventário de ferramentas candidatas, matriz de adequação, decisões de seleção |
| Fase 2 | Arquitetura organizacional e modelo operacional | Organograma de seis níveis, modelo de coordenação global-local, matriz RACI |
| Fase 3 | Sistema de Gestão Corporativa | SGC documentado em empresa/03-management-system/, políticas selecionadas, decisões registradas |

Dependências sequenciais: Fase 0 → Fase 1 → Fase 2 → Fase 3. Cada fase requer aprovação explícita do fundador em empresa/08-decisions/ antes de iniciar a seguinte.

---

## 3. Modelo de fase e gate de aprovação

A cada fase implementa o modelo definido em PLANEJAMENTO_IMPLANTACAO.md (seção 3.1):

```
Fase N — [NOME]
Versão: 1.0 (proposta)
Data: DD de mês de AAAA
Responsável: Chefe de Gabinete Executivo (Hermes)
Status: PROPOSTA / EM EXECUCAO / APROVADA / ENCERRADA

Objetivo: <descrição do objetivo>

Subfases:
- N.M — <nome>

Entregáveis: <lista>

Dependências: <fase anterior aprovada>

Critérios de conclusão:
- <critério>
- <critério>

Evidências: <arquivos/itens no repositório>
```

**Gate de aprovação:** após a conclusão de uma fase, o Chefe de Gabinete submete à aprovação do fundador (empresa/08-decisions/). Somente após a aprovação expressa o próximo gate é aberto.

---

## 4. Plano de trabalho por fase

### 4.1 Fase 0 — Fundamentos da empresa

| Subfase | Tarefa Paperclip | Código | Descrição resumida |
|---------|------------------|--------|--------------------|
| 0.1 | NET-30 | F0-1 | Memória institucional (identidade, proposta, autoridade) |
| 0.2 | NET-39 | F0-2 | Estrutura de autoridade (fundador, conselho IA, chefe de gabinete) |
| 0.3 | NET-40 | F0-3 | Repositório institucional de documentação (pastas empresa/) |
| 0.4 | NET-41 | F0-4 | Princípios de governança e documentação |

- **Entregáveis:** MEMORIA_INSTITUCIONAL_NETTOSCORP.md v1.0; pasta empresa/{00-governance..09-reports}; documento de princípios.
- **Criador:** Hermes, com aprovação do fundador.
- **Gate:** F0-5 (NET-42 homologação da Fase 0).

### 4.2 Fase 1 — Reconhecimento das ferramentas de gestão

| Subfase | Tarefa Paperclip | Código | Descrição resumida |
|---------|------------------|--------|--------------------|
| 1.1 | NET-47 | F1-1 | Levantamento de ferramentas PMI/PMBOK |
| 1.2 | NET-50 | F1-2 | Levantamento de ferramentas ITIL 4 |
| 1.3 | NET-62 | F1-3 | Levantamento de ferramentas ISO 9001 |
| 1.4 | NET-65 | F1-4 | Levantamento de ferramentas ISO/IEC 27001 |
| 1.5 | NET-47 | F1-5 | Levantamento de ferramentas TOGAF |
| 1.6 | NET-48 | F1-6 | Levantamento de ferramentas Agile/Scrum/Kanban |
| — | NET-49 | F1-7 | Matriz de adequação e recomendações de seleção |
| — | NET-50 | F1-8 | Registro de decisões de seleção de ferramentas |
| — | NET-51 | F1-9 | Homologação da Fase 1 |

- **Entregáveis:** inventário em empresa/01-strategy/; matriz de adequação; decisões em empresa/08-decisions/.
- **Gate:** F1-9.

### 4.3 Fase 2 — Arquitetura organizacional e modelo operacional

| Subfase | Tarefa Paperclip | Código | Descrição resumida |
|---------|------------------|--------|--------------------|
| 2.1 | NET-52 | F2-1 | Seis níveis hierárquicos |
| 2.2 | NET-53 | F2-2 | Papel dos agentes globais |
| 2.3 | NET-54 | F2-3 | Preservação de agentes locais existentes |
| 2.4 | NET-55 | F2-4 | Hierarquia formal vs. vinculos funcionais/operacionais |
| 2.5 | NET-56 | F2-5 | Matriz RACI simplificada |
| — | NET-57 | F2-6 | Organograma conceitual de seis níveis |
| — | NET-58 | F2-7 | Modelo operacional de coordenação global-local |
| — | NET-59 | F2-8 | Documento de arquitetura organizacional |
| — | NET-60 | F2-9 | Registro de decisões de arquitetura organizacional |
| — | NET-61 | F2-10 | Homologação da Fase 2 |

- **Entregáveis:** organograma, modelo operacional, matriz RACI, documento de arquitetura em empresa/02-organization/.
- **Gate:** F2-10.

### 4.4 Fase 3 — Sistema de Gestão Corporativa

| Subfase | Tarefa Paperclip | Código | Descrição resumida |
|---------|------------------|--------|--------------------|
| 3.1 | NET-62 | F3-1 | Seleção de práticas PMI/PMBOK |
| 3.2 | NET-63 | F3-2 | Seleção de práticas ITIL 4 |
| 3.3 | NET-64 | F3-3 | Seleção de práticas ISO 9001 |
| 3.4 | NET-65 | F3-4 | Seleção de práticas ISO/IEC 27001 |
| 3.5 | NET-66 | F3-5 | Seleção de práticas TOGAF |
| 3.6 | NET-67 | F3-6 | Seleção de práticas Agile/Scrum/Kanban |
| 3.7 | NET-68 | F3-7 | Integração das práticas em sistema coerente |
| — | NET-69 | F3-8 | Documentação do SGC em empresa/03-management-system/ |
| — | NET-70 | F3-9 | Políticas e procedimentos operacionais selecionados |
| — | NET-71 | F3-10 | Registro de decisões do SGC |
| — | NET-72 | F3-11 | Homologação da Fase 3 |

- **Entregáveis:** SGC em empresa/03-management-system/; políticas; decisões registradas.
- **Gate:** F3-11.

---

## 5. Mapeamento das tarefas no Paperclip

Todas as tarefas abaixo já foram criadas no backlog do Paperclip para a empresa NettosCorp (ID 88af1dda-ef60-41c4-851e-65e2b1f50a9f), no projeto **nettoscorp** (ID 46af6d1a-4e69-4ba4-9368-b05d01c69b96). Os identificadores NET-xx são associados aos códigos F0-1 a F3-11 conforme a tabela 4.1.

Fases 0–3 = 35 tarefas (NET-30 a NET-72), todas em status **backlog**.

---

## 6. Planejamento de entregas — próximas 2 semanas (14–28 de novembro de 2026)

Orçamento de 2 semanas, considerando cada tarefa implementável em 30–60 minutos e o foco sequencial por fase.

| Dias | Entregas Número 1 |
|------|-------------------|
| 14–15 | Manter a Fase 0 aberta ao fundador. Verificar que MEMORIA_INSTITUCIONAL_NETTOSCORP.md (F0-1), estrutura de pastas (F0-3) e princípios (F0-4) estão registrados no repositório. Registrar qualquer pendência em empresa/08-decisions/. |
| 16 | Submeter ao fundador: PLANO_TRABALHO_SGC.md (seção 2–4) + TAREFAS_ROADMAP_CORPORATIVO.md. Aguardar aprovação da Fase 0 (F0-5). |
| 17–19 | Em paralelo, confirmar a matriz de adequação (F1-7) e o registro de decisões (F1-8), se o fundador liberar leitura. |
| 20–21 | Após aprovação da Fase 0: iniciar Fase 1. Levantamento das ferramentas (F1-1 a F1-6) e matriz (F1-7). |
| 22 | Registro de decisões (F1-8) e homologação da Fase 1 (F1-9). |
| 23–26 | Em paralelo, iniciar Fase 2: níveis hierárquicos (F2-1), agentes globais (F2-2), matriz RACI (F2-5). |
| 27–28 | Conclusão da Fase 2 (F2-8, F2-9, F2-10) e submissão à aprovação do fundador. |

**Prioridade absoluta** nesta janela: Fase 0 (gate) → Fase 1 (levantamento + homologação) → Fase 2 (estrutura). Fase 3 só inicia após Fase 2 aprovada.

---

## 7. Controle de qualidade e cadência de relatórios

### 7.1 Ritmo de relatórios de status

| Frequência | Produto | Destinatário |
|------------|---------|--------------|
| Diário (09:00) | Resumo de status dos agentes, tarefas em andamento, bloqueios | Fundador (Netto Farias) |
| Semanal (segunda 08:00) | Relatório consolidado: métricas, feitos, em andamento, plano da semana | Fundador |
| Por fábrica | Status das tarefas NET-xx no Paperclip (atualizado a cada alteração) | Casa de apoio |

### 7.2 Métricas de acompanhamento (sugeridas, a serem validadas com dados reais)

- Documentos institucionais versionados.
- Decisões registradas em empresa/08-decisions/.
- Tarefas concluídas por fábrica (F0..F3).
- Tarefas em aberto e bloqueios.
- Prazos de homologação do fundador.

### 7.3 Registro de decisões

Toda decisão de aprovação (início de fase, mudança de documento, aceitação de recomendação) é registrada em empresa/08-decisions/ com: data, autor, decisão, justificativa, efeito (abre fase / aprova documentação / altera plano).

---

## 8. Riscos e pendências

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Fundador não aprovar em prazo | Média | Alto | Submeter o plano e a lista de tarefas de forma concisa; acompanhar no diário. |
| Sobreposição de fases gera gargalo | Alta | Médio | Seguir a regra sequencial de gates; registrar qualquer dependência em 08-decisions/. |
| Falta de interesse do fundador | Baixa | Alto | Manter entregáveis objetivos, sem burocracia. |
| Portfólio existente (Projetos/) não mapeado | Média | Médio | Para a Fase 4; não atrapalhar fases 0–3. |

---

## 9. Evidências e recuperação

Documento completo: /home/lg/workspace/NettosCorp/empresa/03-management-system/PLANO_TRABALHO_SGC.md

Recuperar em novas sessões com:
read_file(path="/home/lg/workspace/NettosCorp/empresa/03-management-system/PLANO_TRABALHO_SGC.md")

---

## 10. Anexo A — Caderno de tarefas (resumo)

| Código | Tarefa | Status (Paperclip) | Paperclip ID | Priority |
|--------|--------|---------------------|--------------|----------|
| F0-1 | MEMORIA_INSTITUCIONAL_NETTOSCORP.md (subfase 0.1) | backlog | NET-30 | high |
| F0-2 | Estrutura de autoridade (subfase 0.2) | backlog | NET-39 | high |
| F0-3 | Repositório de documentação (subfase 0.3) | backlog | NET-40 | medium |
| F0-4 | Princípios de governança (subfase 0.4) | backlog | NET-41 | medium |
| F0-5 | Homologação Fase 0 | backlog | NET-42 | high |
| F1-1 | Levantamento PMI/PMBOK (subfase 1.1) | backlog | NET-47 | medium |
| F1-2 | Levantamento ITIL 4 (subfase 1.2) | backlog | NET-50 | medium |
| F1-3 | Levantamento ISO 9001 (subfase 1.3) | backlog | NET-62 | medium |
| F1-4 | Levantamento ISO/IEC 27001 (subfase 1.4) | backlog | NET-65 | medium |
| F1-5 | Levantamento TOGAF (subfase 1.5) | backlog | NET-47 | medium |
| F1-6 | Levantamento Agile/Scrum/Kanban (subfase 1.6) | backlog | NET-48 | medium |
| F1-7 | Matriz de adequação (subfase 1.7) | backlog | NET-49 | high |
| F1-8 | Registro de decisões (subfase 1.8) | backlog | NET-50 | medium |
| F1-9 | Homologação Fase 1 | backlog | NET-51 | high |
| F2-1 | Seis níveis hierárquicos (subfase 2.1) | backlog | NET-52 | high |
| F2-2 | Agentes globais (subfase 2.2) | backlog | NET-53 | high |
| F2-3 | Preservação de agentes locais (subfase 2.3) | backlog | NET-54 | medium |
| F2-4 | Hierarquia formal vs. vinculos (subfase 2.4) | backlog | NET-55 | medium |
| F2-5 | Matriz RACI simplificada (subfase 2.5) | backlog | NET-56 | high |
| F2-6 | Organograma conceitual (subfase 2.6) | backlog | NET-57 | high |
| F2-7 | Modelo operacional global-local (subfase 2.7) | backlog | NET-58 | high |
| F2-8 | Documento de arquitetura organizacional (subfase 2.8) | backlog | NET-59 | high |
| F2-9 | Registro de decisões de arquitetura (subfase 2.9) | backlog | NET-60 | medium |
| F2-10 | Homologação Fase 2 | backlog | NET-61 | high |
| F3-1 | Seleção PMI/PMBOK (subfase 3.1) | backlog | NET-62 | medium |
| F3-2 | Seleção ITIL 4 (subfase 3.2) | backlog | NET-63 | medium |
| F3-3 | Seleção ISO 9001 (subfase 3.3) | backlog | NET-64 | medium |
| F3-4 | Seleção ISO/IEC 27001 (subfase 3.4) | backlog | NET-65 | medium |
| F3-5 | Seleção TOGAF (subfase 3.5) | backlog | NET-66 | medium |
| F3-6 | Seleção Agile/Scrum/Kanban (subfase 3.6) | backlog | NET-67 | medium |
| F3-7 | Integração de práticas (subfase 3.7) | backlog | NET-68 | high |
| F3-8 | Documentação do SGC (subfase 3.8) | backlog | NET-69 | high |
| F3-9 | Políticas e procedimentos (subfase 3.9) | backlog | NET-70 | high |
| F3-10 | Registro de decisões do SGC (subfase 3.10) | backlog | NET-71 | medium |
| F3-11 | Homologação Fase 3 | backlog | NET-72 | high |

---

## 11. Anexo B — Declaração de estado

Esta é uma **proposta v1.0**. Não marca nenhuma fase como concluída, em execução ou aprovada. A execução começa somente após aprovação expressa do fundador, registrada em empresa/08-decisions/.
