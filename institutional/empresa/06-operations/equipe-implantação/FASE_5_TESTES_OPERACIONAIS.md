# FASE 5 — TESTES OPERACIONAIS (PLANEJADA)

**Data:** 16/11/2026  ·  **Status:** Planejada — execução sob demanda dos 267 especialistas

---

## 1. Objetivo

Validar que cada agente implantado no Paperclip:

1. **Recebe** uma tarefa real (issue) via API.
2. **Executa** a tarefa (wakeup + heartbeat run).
3. **Entrega** um resultado verificável (comentário, arquivo, decisão).
4. **Respeita** a hierarquia (`reportsTo` → Diretor → Orquestrador → Hermes → Fundador).
5. **Retorna** ao estado `paused` após conclusão (mobilização sob demanda).

---

## 2. Critérios de validação por agente (conforme Ordem Executiva)

| Critério | Como testar | Evidência esperada |
|---|---|---|
| **Identidade correta** | `GET /agents/{id}` → name, role, title, icon, division | JSON confere com `fase3_configs_267.json` |
| **Função e instruções** | `instructionsBundle.AGENTS.md` carregado | Conteúdo inclui especialidade, vibe, identidade vocal |
| **Superior configurado** | `reportsTo` aponta para Diretor da divisão | Hierarquia L4→L3→L2→L1→L0 |
| **Operacional** | `POST /agents/{id}/wakeup` + issue assignment | `executionRunId` gerado, heartbeat run inicia |
| **Executa tarefa** | Atribuir issue real via `POST /companies/{id}/chats/{agentRef}` | Heartbeat run roda, produz output |
| **Entrega verificável** | Comentário na issue / arquivo gerado / decisão registrada | Resultado persistido no Paperclip |
| **Mobilização sob demanda** | Após tarefa, agente retorna a `paused` | Lifecycle não fica `active` permanentemente |

---

## 3. Cenários de teste por camada

### 3.1 Especialistas (L4) — 267 agentes
- **Teste unitário:** 1 issue por divisão (ex.: "Produza relatório de status da divisão X").
- **Teste de voz:** Solicitar síntese via VoiceStudio (`instruct` + `personality`).
- **Teste de hierarquia:** Verificar se resposta sobe para Diretor (L3).

### 3.2 Diretores (L3) — 18 agentes
- **Teste de coordenação:** Atribuir issue que requer delegação a 2+ especialistas.
- **Teste de priorização:** Múltiplas issues simultâneas → Diretor prioriza e distribui.
- **Teste de relatório:** Diretor consolida resultados dos especialistas e entrega ao Orquestrador.

### 3.3 Orquestrador Global (L2) — 1 agente
- **Teste de distribuição:** Issue transversal (ex.: "Planejamento estratégico Q1") → Orquestrador distribui entre múltiplas divisões.
- **Teste de conflito:** Duas divisões disputam mesmo especialista → Orquestrador resolve.
- **Teste de consolidação:** Recebe relatórios dos 18 Diretores → consolida para Hermes.

---

## 4. Exercícios multidisciplinares (Fase 6)

### 4.1 Gestão interna da NettosCorp (Exemplo A)
- **Cenário:** "Planejamento orçamentário 2027"
- **Divisões envolvidas:** Finance (Diretor Financeiro + 5 especialistas), Project Management (Diretor PM + 7), Engineering (Diretor Eng + 65), Security (Diretor Seg + 12).
- **Fluxo:** Fundador → Hermes → Orquestrador → 4 Diretores → Especialistas → consolidação.

### 4.2 Desenvolvimento de projeto externo (Exemplo B)
- **Cenário:** "Desenvolvimento de SaaS de gestão de saúde (B2C)"
- **Divisões envolvidas:** Product, Engineering, Design, Healthcare, Security, Marketing, Support, GIS, Finance, Legal.
- **Fluxo:** Cliente → Hermes → Orquestrador → Diretores relevantes → Especialistas → entrega.

---

## 5. Evidências de validação (a produzir)

| Artefato | Formato | Local |
|---|---|---|
| Relatório de testes L4 | JSON + Markdown | `FASE_5_TESTES_L4.md` |
| Relatório de testes L3 | JSON + Markdown | `FASE_5_TESTES_L3.md` |
| Relatório de testes L2 | JSON + Markdown | `FASE_5_TESTES_L2.md` |
| Exercício A (interno) | Issue + runs + entregas | Paperclip issues |
| Exercício B (externo) | Issue + runs + entregas | Paperclip issues |
| Matriz de validação completa | CSV/JSON | `validacao_286_agentes.json` |

---

## 6. Critério de "Done" da Fase 5

- [ ] 100% dos 267 especialistas testados (recebe + executa + entrega).
- [ ] 100% dos 18 diretores testados (coordena + delega + consolida).
- [ ] Orquestrador Global testado (distribui + resolve conflito + consolida).
- [ ] Hierarquia respeitada em todos os fluxos.
- [ ] Agentes retornam a `paused` após tarefa.
- [ ] Zero falhas de comunicação (wakeup/heartbeat).
- [ ] Relatório consolidado entregue ao Fundador via Hermes.

---

## 7. Próxima ação

Executar testes prioritários:
1. **Smoke test:** 1 especialista por divisão (18 testes).
2. **Coordenação:** 3 diretores com delegação cruzada.
3. **Orquestrador:** 1 issue transversal.

---

**Nota:** Fase 5 será executada sob demanda, respeitando o princípio de mobilização sob demanda — agentes não ficam ativos permanentemente.