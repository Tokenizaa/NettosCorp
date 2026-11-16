# ÍNDICE — ORGANIZAÇÃO E TECNOLOGIA — NETTOSCORP

Versão: 1.1
Data: 15 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/institutional/empresa/02-organization/INDICE.md

Este índice organiza a investigação organizacional e tecnológica executada sob a Ordem de Trabalho de Investigação Organizacional e Tecnológica, **incluindo a integração institucional do Agency Agents**.

---

## 02-organization/ — Estudo Organizacional

### Investigação Base (fase anterior)

| Documento | Descrição |
|-----------|-----------|
| `agency-agents-investigacao/AGENCY_AGENTS_INVESTIGACAO.md` | Investigação integral do Agency Agents: modelo de agentes, especialidades, diretorias, skills, integração, processos, compatibilidade, limitações |
| `paperclip-investigacao/PAPERCLIP_INVESTIGACAO.md` | Investigação da implementação local do Paperclip: empresas, ciclo de vida de agentes, hierarquia reports_to, departamentos, tarefas, orçamentos, permissões, integração, APIs |
| `integracao/INTEGRACAO.md` | Estudo de integração entre Agency Agents e Paperclip: representação de agentes, competências, departamentos, delegação, colaboração, supervisores locais, entregas, duplicação, desenvolvimento próprio |
| `proposta-equipe/PROPOSTA_EQUIPE.md` | Proposta inicial da primeira equipe corporativa: liderança, direção, diretorias, departamentos, gestores, supervisores, agentes especialistas, prioridade de implantação |
| `arquitetura-departamental/ARQUITETURA_DEPARTAMENTAL.md` | Proposta de arquitetura departamental: departamentos, missões, responsabilidades, relações entre diretorias e departamentos, posições de liderança, relações administrativas e funcionais, integração dos seis especialistas, organograma conceitual, decisões reservadas ao fundador |

### Integração Institucional Agency Agents → NettosCorp (esta missão)

| Documento | Descrição |
|-----------|-----------|
| `integracao-agency-agents/INTEGRACAO_INSTITUCIONAL.md` | **Documento central** — Arquitetura de 4 camadas (Agency Agents, NettosCorp, Paperclip, Hermes), princípios, responsabilidades, estrutura documental, validação |
| `integracao-agency-agents/INVENTARIO_AGENCY_AGENTS.md` | Inventário completo do catálogo: 17 divisões, 264 agentes, modelo de definição, lista completa engineering (65), project-management (7), specialized (59), runbooks, ferramentas, limitações |
| `integracao-agency-agents/MATRIZ_CORRESPONDENCIA.md` | Matriz de rastreabilidade: especialidade → cargo → departamento → agente Paperclip. 8 correspondências documentadas: 6 especialistas com correspondência direta, 1 orquestrador, 1 chefe de gabinetes já implantado + 18 expansão futura + 5 lacunas + 5 compartilháveis + mapeamento divisões→diretorias |
| `integracao-agency-agents/POLITICA_SINCRONIZACAO.md` | Política de manutenção da relação com upstream: método Git (branch integração), ciclo de sincronização, versionamento, tratamento de conflitos, autoridade decisória, scripts recomendados, checklist |
| `integracao-agency-agents/PROCEDIMENTO_ADOCAO_AGENTES.md` | Procedimento oficial de adoção: 5 etapas (Identificação → Avaliação → Proposta+Homologação → Implementação Paperclip → Validação), templates, prazos, casos especiais, checklist mestre |
| `integracao-agency-agents/REGISTRO_PENDENCIAS_DECISOES.md` | Registro vivo de 6 decisões estruturais (1 homologada via DELIB-014, 5 em aberto), 8 adoções, 5 conflitos conhecidos, 8 lacunas de cargos, 4 decisões de sincronização, 5 decisões já tomadas, próximas ações agendadas |

---

## 05-technology/ — Estudo Tecnológico

| Documento | Descrição |
|-----------|-----------|
| `agency-agents/AGENCY_AGENTS_TECNOLOGIA.md` | Detalhes técnicos do Agency Agents: formato de arquivo, scripts de instalação, integração com ferramentas, limites por ferramenta, app nativa |
| `paperclip/PAPERCLIP_TECNOLOGIA.md` | Detalhes técnicos do Paperclip: stack, banco de dados, schemas (agents, companies, goals, issues), adaptadores, heartbeats, orçamentos, ciclos de vida, APIs |
| `integracao-arquitetura/INTEGRACAO_ARQUITETURA.md` | Proposta de arquitetura de integração entre Agency Agents e Paperclip para a NettosCorp |

---

## Relação com o Roadmap Corporativo

Esta investigação e integração suportam:

- **Fase 2** — Arquitetura organizacional e modelo operacional (modelo autoridade, diretorias, cargos)
- **Fase 3** — Sistema de Gestão Corporativa (orçamentos, adapters, aprovações, procedimentos)
- **Fase 4** — Reconhecimento do portfólio existente (supervisores locais, projetos incorporados)
- **Fase 5+** — Canonização e padronização (expansão de agentes, sincronização contínua)

---

## Estado da Missão de Integração (15 nov 2026)

| Entregável | Status | Evidência |
|------------|--------|-----------|
| Auditoria clone Agency Agents | ✅ Concluída | `INTEGRACAO_INSTITUCIONAL.md` seção 7, `INVENTARIO_AGENCY_AGENTS.md` |
| Estudo documentação institucional existente | ✅ Concluída | Referências cruzadas em todos os documentos |
| Arquitetura 4 camadas definida | ✅ Concluída | `INTEGRACAO_INSTITUCIONAL.md` seções 1-4 |
| Matriz de rastreabilidade (8 cargos + expansão) | ✅ Concluída | `MATRIZ_CORRESPONDENCIA.md` |
| Política de sincronização com upstream | ✅ Concluída | `POLITICA_SINCRONIZACAO.md` |
| Procedimento de adoção de agentes | ✅ Concluída | `PROCEDIMENTO_ADOCAO_AGENTES.md` |
| Registro de pendências e decisões | ✅ Concluída | `REGISTRO_PENDENCIAS_DECISOES.md` |
| Índices e referências cruzadas atualizados | ✅ Concluída | Este arquivo (`INDICE.md`) |
| **Validação: Paperclip inalterado** | ✅ Confirmado | `git status` em `paperclip/` — working tree clean |
| **Validação: Telegram/gateway inalterado** | ✅ Confirmado | Fora do escopo — nenhuma alteração |
| **Commit em branch própria + PR** | ⏳ Pendente | Próximo passo após esta validação |

---

## Recuperação Rápida — Documentos-Chave

| Necessidade | Documento |
|-------------|-----------|
| Visão geral da integração | `integracao-agency-agents/INTEGRACAO_INSTITUCIONAL.md` |
| Qual agente do Agency Agents corresponde a qual cargo? | `integracao-agency-agents/MATRIZ_CORRESPONDENCIA.md` |
| Como sincronizar com upstream no futuro? | `integracao-agency-agents/POLITICA_SINCRONIZACAO.md` |
| Como adotar um novo agente? | `integracao-agency-agents/PROCEDIMENTO_ADOCAO_AGENTES.md` |
| O que está pendente de decisão do Fundador? | `integracao-agency-agents/REGISTRO_PENDENCIAS_DECISOES.md` |
| Catálogo completo de 264 agentes | `integracao-agency-agents/INVENTARIO_AGENCY_AGENTS.md` |
| Governança e autoridade (modelo v1.2) | `../00-governance/MODELO_AUTORIDADE_DIRECAO_EXECUTIVA.md` |
| Proposta de equipe (6 especialistas + diretores) | `proposta-equipe/PROPOSTA_EQUIPE.md` |
| Paperclip como control plane | `../05-technology/paperclip/PAPERCLIP_TECNOLOGIA.md` |
| Clone Agency Agents (local) | `/home/lg/workspace/NettosCorp/agency-agents/` (main, 4e3ac3c) |
| Upstream Agency Agents | https://github.com/msitarzewski/agency-agents (MIT) |

---

**Nota:** Nenhum código foi alterado. Nenhum agente foi implantado no Paperclip (exceto Hermes, já pré-existente). Nenhuma estrutura de organograma definitiva foi criada além do modelo de autoridade v1.2 (aguarda homologação). Esta integração é **documental e arquitetural** — a implementação operacional será etapa posterior sujeita à governança.