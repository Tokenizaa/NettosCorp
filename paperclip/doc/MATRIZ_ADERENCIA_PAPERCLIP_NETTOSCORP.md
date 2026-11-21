# MATRIZ DE ADERÊNCIA — PAPERCLIP × GOVERNANÇA NETTOSCORP

**Etapa:** Mapeamento entre recursos do Paperclip e decisões institucionais homologadas da NettosCorp  
**Data:** 18/11/2026  
**Instância:** http://127.0.0.1:3100 | Empresa: NettoCorp (`1ad50023-2215-4d61-b1ea-d896cfe0e535`)  
**Fontes:** `institutional/`, `empresa/`, `doc/BASELINE_PAPERCLIP_NETTOSCORP.md`

---

## 1. Identidade institucional

| Item | Governança NettosCorp (decisão homologada) | Estado real Paperclip | Aderência | Ação necessária |
|------|--------------------------------------------|-----------------------|-----------|-----------------|
| Nome da empresa | NettoCorp / NettosCorp | "NettoCorp" | Parcial | Nome confere; descrição vazia — preencher com propósito institucional |
| ID da empresa | CIA documentos declaram `da110a22...` (não existe no real) | `1ad50023-2215-4d61-b1ea-d896cfe0e535` | Divergente | IDs dos cadastros CIA não existem nesta instância. Preservar ID real; alinhar documentos ao real (não o inverso) |
| Prefixo de issues | `NET` | `NET` | OK | — |
| Status | active | active | OK | — |
| Descrição | Propósito: desenvolver software de qualidade com suporte de agentes IA | vazia | Baixa | Preencher descrição institucional |
| Orçamento mensal | 0 (em fundação) | 0 centavos | OK | — |
| Logo | Não definida | null | Baixa | Opcional |

**Divergência D1:** Os cadastros CIA-001 a CIA-008 declaram `company_id = da110a22-ca31-412d-be28-5caddcabb801`, que não existe nesta instância. A empresa real é `1ad50023-2215-4d61-b1ea-d896cfe0e535`. **Resolução:** preservar o ID real do banco; atualizar os documentos institucionais para refletir o ID real. Não recriar a empresa.

---

## 2. Estrutura organizacional e hierarquia

| Item | Governança NettosCorp | Estado real Paperclip | Aderência | Ação necessária |
|------|----------------------|-----------------------|-----------|-----------------|
| Fundador / autoridade final | Netto Farias (fundador) | `local-board` (board operator) | Parcial | `local-board` é o board operator da instância local |
| Chefe de Gabinete Executivo | Hermes (reporta ao fundador) | Não existe como agente | Ausente | Não criar sem decisão do fundador |
| Orquestrador Global | CIA-001, reporta a Hermes/chefe de gabinete | `FCC Agent` (idle, reportsTo: null) | Divergente | Nome e papel diferentes; não alterar sem decisão |
| Hierarquia (`reportsTo`) | Orquestrador → Hermes; PM → Fundador; especialistas → Orquestrador | Todos `reportsTo: null` (plano) | Divergente | Hierarquia plana; definir conforme organograma homologado |
| Departamento | Não há tabela de departamentos (Paperclip V1) | N/A | OK | Organizar via reportsTo, role, capabilities |

**Divergência D4:** Hierarquia real não espelha o organograma documentado. **Resolução:** aguardar homologação do fundador antes de definir `reportsTo`. Não alterar unilateralmente.

---

## 3. Agentes — identidade, papel e atribuições

| Agente CIA (documentado) | Papel documentado | Adapter documentado | Modelo documentado | reportsTo documentado | Estado real (instância atual) | Aderência |
|--------------------------|-------------------|---------------------|--------------------|-----------------------|-------------------------------|-----------|
| Orquestrador Global (CIA-001) | orquestrador | codex_local | gpt-5 | Hermes | Não existe com esse nome/ID | Ausente |
| Project Manager Senior (CIA-002) | pm | codex_local | gpt-5 | Fundador | Não existe com esse nome/ID | Ausente |
| Software Architect (CIA-003) | engineer | codex_local | gpt-5 | Orquestrador | Não existe com esse nome/ID | Ausente |
| Backend Architect (CIA-004) | engineer | codex_local | gpt-5 | Orquestrador | Não existe com esse nome/ID | Ausente |
| Frontend Developer (CIA-005) | engineer | codex_local | gpt-5 | Orquestrador | Não existe com esse nome/ID | Ausente |
| DevOps Automator (CIA-006) | devops | codex_local | gpt-5 | Orquestrador | Não existe com esse nome/ID | Ausente |
| Technical Writer (CIA-007) | engineer | codex_local | gpt-5 | Orquestrador | Não existe com esse nome/ID | Ausente |
| QA Engineer (CIA-008) | qa | codex_local | gpt-5 | Orquestrador | Não existe com esse nome/ID | Ausente |

**Estado real da instância:** 19 agentes com nomes do tipo "FCC Agent N", "CEO", adapter misto (claude_local / process), modelo variado, todos `reportsTo: null`, 17 paused em `setup`, 2 idle/ready.

**Divergência D2/D5:** Nenhum ID de agente dos cadastros CIA existe no real. Adapter/modelo divergem (documentado: codex_local/gpt-5; real: claude_local/process + nemotron ou claude-3-5-sonnet). **Resolução:** não recriar nem apagar agentes. A instância atual foi recriada com agentes FCC. Os documentos institucionais devem ser atualizados para refletir o estado real, ou o fundador deve decidir qual ID é canônico.

**Agente não cadastrado:** nenhum agente "agente de teste" nesta instância (esse agente existia no baseline anterior com company ID `88af1dda...`).

---

## 4. Permissões e autoridade

| Item | Governança NettosCorp (CIA) | Estado real | Aderência | Ação |
|------|----------------------------|-------------|-----------|------|
| canCreateAgents | Especialistas: não sem autorização | true (todos 19) | Divergente | Revisar com fundador |
| canCreateSkills | Especialistas: não sem autorização | true (todos 19) | Divergente | Revisar com fundador |
| requireBoardApprovalForNewAgents | Não especificado claramente | false | OK | Confirmar com fundador |
| Orçamento por agente | 0 (fundação) | 0 centavos | OK | — |

**Divergência D11:** Todas as permissões `true` excedem os limites dos cadastros CIA. Apresentar ao fundador antes de ajustar.

---

## 5. Operação — projetos, objetivos, tarefas, rotinas

| Recurso | Governança NettosCorp | Estado real | Aderência | Ação |
|---------|----------------------|-------------|-----------|------|
| Projetos | Portfólio a ser definido | 0 | Baixa | Criar conforme portfólio homologado |
| Objetivos | Hierarquia de objetivos | 0 | Baixa | Criar conforme estratégia |
| Issues/Tarefas | Tarefas distribuídas (tarefas-distribuidas.json) | 0 | Baixa | Criar conforme plano de execução |
| Rotinas | Automação recorrente | 0 | Baixa | Criar após definir processos recorrentes |
| Heartbeats | Habilitado com intervalo | enabled: false (17 paused) | Baixa | Ativar após definir modelo de operação |

---

## 6. Integrações

| Integração | Governança NettosCorp | Estado real | Aderência | Ação |
|------------|----------------------|-------------|-----------|------|
| FCC | Não especificado no Paperclip | N/A (instância local) | N/A | — |
| OpenCode | Adapter opencode_local disponível | Não configurado | Baixa | Configurar se necessário |
| Hermes | Chefe de gabinete (não é adapter Paperclip) | hermes_local não existe nesta instância | N/A | — |
| MCP | Assistant Connections (experimental) | Não configurado | Baixa | Avaliar recurso experimental |
| GitHub | Conector disponível | Não configurado | Baixa | Avaliar |
| Telegram | Não especificado no Paperclip | Não configurado | N/A | — |

---

## 7. Orçamentos e controles

| Item | Governança | Estado real | Aderência | Ação |
|------|------------|-------------|-----------|------|
| Orçamento empresa | 0 (fundação) | 0 centavos | OK | — |
| Orçamento agente | 0 | 0 centavos | OK | — |
| Auto-pausa em limite | Não especificado | Não configurado | OK | — |

---

## 8. Auditoria e observabilidade

| Recurso | Estado real | Ação |
|---------|-------------|------|
| Activity log | Populado (criação empresa, agentes, conexões, atualizações) | Revisar periodicamente |
| Observabilidade trace export | Não configurado | Avaliar necessidade |
| Backup automático | Enabled, último backup 5.8h (dentro do limite 26h) | Manter monitoramento |
| Configurações ausentes | Projetos, objetivos, issues, rotinas, conexão default, descrição empresa | Parametrizar conforme FASE 5 |

---

## 9. Decisões que dependem do fundador (não tomar unilateralmente)

Conforme `institutional/09-reports/BASELINE_ESTADO_REAL_AGENTES_PAPERCLIP.md` seção 7:

1. Qual ID de empresa é canônico: real (`1ad50023...`) ou dos cadastros CIA (`da110a22...`)?
2. Hierarquia e `reportsTo`: Orquestrador como superior de todos, ou PM reporta ao fundador?
3. Adapter e modelo padrão: manter real (claude_local/process + modelos atuais) ou migrar para codex_local/gpt-5?
4. Permissões: todos `canCreateAgents/Skills: true` ou restringir por papel?
5. AGENTS.md placeholders: autorizar preenchimento dos 6 agentes (não se aplica diretamente — instância atual é diferente)
6. Composição final da equipe: confirmar se os agentes FCC atuais são a equipe aprovada

---

## 10. Resumo de aderência

| Dimensão | Aderência | Principais gaps |
|----------|-----------|-----------------|
| Identidade empresa | Parcial | Descrição vazia; ID dos cadastros CIA não existe no real |
| Estrutura organizacional | Baixa | Hierarquia plana; sem reportsTo definido |
| Agentes | Baixa | Agentes CIA não existem nesta instância; 19 agentes FCC com nomes/papel diferentes |
| Permissões | Baixa | Todas `true`, excedendo limites CIA |
| Operação (projetos/tarefas) | Baixa | Zero projetos, objetivos, issues, rotinas |
| Integrações | Baixa | Nenhuma conexão default configurada |
| Auditoria/backup | Alta | Activity log populado; backup automático em dia |

**Conclusão:** A plataforma está tecnicamente operacional, mas não parametrizada conforme a governança NettosCorp. A parametrização deve respeitar as decisões homologadas e aguardar o fundador para decisões de autoridade, hierarquia e identidade.
