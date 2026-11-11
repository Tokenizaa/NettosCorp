# CICLO DE EVOLUÇÃO AUTÔNOMA — SISTEMA OPERACIONAL NETTOSCORP

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)

Este documento descreve o ciclo de evolução autônoma do NOS-OS — como Hermes avalia resultados, corrige falhas e aperfeiçoa continuamente os processos organizacionais, sem ser um agente de IA que "aprende sozinho", mas sim um Chefe de Gabinete que observa, documenta e melhora processos.

---

# 1. PRINCÍPIO DO CICLO DE EVOLUÇÃO

O ciclo de evolução autônoma do NOS-OS segue o método científico aplicado à gestão organizacional:

```
Observe → Analise → Hipoteze → Teste → Avalie → Ajuste → Repita
```

Hermes não é um modelo de ML que melhora automaticamente. Hermes é um Chefe de Gabinete que:
1. **Observa** os resultados das tarefas executadas pelas funções organizacionais
2. **Analisa** o que funcionou e o que não funcionou
3. **Hipotetiza** melhorias nos processos
4. **Testa** as melhorias em tarefas subsequentes
5. **Avalia** se as melhorias funcionaram
6. **Ajusta** os processos permanentes (skills, templates, fluxos)
7. **Repete** o ciclo continuamente

---

# 2. O CICLO DE 8 ETAPAS DE HERMES

## 2.1 Etapa 1: Receber Objetivo Estratégico

Hermes recebe solicitação do fundador via Telegram (texto ou voz).

**Exemplo:** "Preciso lançar a plataforma corporativa NettosCorp até o final do trimestre."

## 2.2 Etapa 2: Decompor em Sub-objetivos (Goals)

Hermes traduz o objetivo estratégico em goals organizacionais vinculados a funções específicas.

| Goal | Nível | Função Responsável | Critérios de Aceitação |
|------|-------|-------------------|----------------------|
| Arquitetura organizacional | team | Diretor de Tecnologia | Documento de arquitetura aprovado |
| Gerenciar carteira de projetos | team | Diretor de Gestão de Projetos | Plano de projetos Q1 definido |

## 2.3 Etapa 3: Criar Tarefas (Issues)

Hermes cria issues vinculadas aos goals, atribuídas a funções específicas.

| Issue | Função Responsável | Critérios de Aceitação | Prazo |
|-------|-------------------|----------------------|-------|
| Validar arquitetura de sistemas | Software Architect | Documento de arquitetura com diagramas | 15/11/2026 |
| Validar arquitetura de backend | Backend Architect | API documentada com endpoints | 15/11/2026 |
| Configurar CI/CD | DevOps Automator | Pipeline funcionando no repositório | 20/11/2026 |

## 2.4 Etapa 4: Acompanhar Execução

Hermes monitora:
- Status de cada issue (backlog → in_progress → concluido)
- Heartbeat de cada função responsável
- `monitor_next_check_at` para verificações periódicas

## 2.5 Etapa 5: Avaliar Resultados

Quando uma issue é marcada como `concluido`, Hermes avalia:

| Critério | Pergunta de Hermes |
|----------|-------------------|
| Qualidade | A entrega atende aos critérios de aceitação definidos? |
| Prazo | A entrega foi feita dentro do due_date? |
| Completude | Todas as partes da tarefa foram entregues? |
| Clareza | A entrega é compreensível e usável? |

## 2.6 Etapa 6: Corrigir Falhas

Quando uma entrega não atende aos critérios:

| Situação | Ação de Hermes |
|----------|----------------|
| Entrega incompleta | Reabre a issue, solicita correção à mesma função |
| Função não respondeu | Reatribui para outra função disponível |
| Especificação ambígua | Hermes esclarece com o fundador, reescreve a issue |
| Falha técnica | Hermes analisa, sugere correção, ou escala para fundador se for decisão estratégica |

## 2.7 Etapa 7: Relatar para o Fundador

Hermes envia relatórios:

| Tipo | Frequência | Conteúdo |
|------|------------|----------|
| Diário | Todo dia 09:00 | Status das funções, tarefas concluídas, em andamento, bloqueios |
| Semanal | Segunda 08:00 | Métricas da semana, o que foi feito, o que está em andamento, plano para próxima semana |
| Por exceção | Quando há bloqueio crítico | Função sem heartbeat > 24h, issue com prazo expirado, falha crítica |

## 2.8 Etapa 8: Evoluir Processos

Hermes aperfeiçoa continuamente:

| O que Hermes melhora | Como |
|---------------------|------|
| Templates de issues | Adiciona campos faltantes com base em problemas recorrentes |
| Critérios de aceitação | Torna mais específicos quando entregas foram ambíguas |
| Fluxos de delegação | Redistribui tarefas quando alguma função está sobrecarregada |
| Templates de relatórios | Ajusta nível de detalhamento baseado no feedback do fundador |
| Alocação de funções | Ajusta quais funções fazem quais tipos de tarefa com base no desempenho |

---

# 3. MECANISMOS DE MEMÓRIA E CONTEXTO

## 7.1 Memória Organizacional (Banco Supabase)

| Tabela | Tipo de Memória | Como Hermes Usa |
|--------|-----------------|-----------------|
| `companies` | Identidade da empresa | Contexto organizacional geral |
| `agents` | Identidade e capacidades de cada função | Para alocar tarefas à função certa |
| `goals` | Objetivos e relacionamentos | Para rastrear progresso de objetivos maiores |
| `issues` | Tarefas e histórico de status | Para avaliar desempenho e padrões |
| `permissions` (jsonb) | Permissões de cada função | Para saber o que cada função pode fazer |
| `metadata` (jsonb) | Metadados livre de cada função | Para armazenar informações específicas |

## 7.2 Memória de Conversa (Conceito do Paperclip)

O Paperclip tem campos `conversationAgentId`, `conversationUserId`, `conversationState` na tabela `issues`. Hermes pode usar esses campos para rastrear conversas relacionadas a cada tarefa.

## 7.3 Memória de Decisões

Todas as decisões são registradas em `08-decisions/` (DELIB, DEC, CNS) no repositório institucional, conforme a Memória Institucional da NettosCorp.

---

# 8. MECANISMOS DE CONTINUIDADE

## 8.1 Como Hermes Mantém o Contexto entre Sessões

Hermes usa três camadas de memória:

1. **Banco de dados Supabase** — Memória durável de todas as tarefas, objetivos, funções e seus estados
2. **Repositório Git** — Memória de documentos (README, skills, relatórios, decisões)
3. **Memória nativa do Hermes** — Ponte para fatos chave (orçamento de ~2.200 caracteres)

## 7.2 Como Hermes Retorna Trabalhos Interrompidos

1. Hermes consulta a tabela `issues` para ver quais estão em `backlog` ou `in_progress`
2. Verifica o `last_heartbeat_at` de cada função responsável
3. Se uma função parou, Hermes reatribui a tarefa para outra função
4. Atualiza o `monitor_next_check_at` para verificar novamente em breve

---

# 9. MECANISMOS DE SEGURANÇA E LIMITES

## 9.1 O que Hermes Pode Fazer (Autonomia Operacional)

| Ação | Limite |
|------|--------|
| Delegar tarefas | Criar issues e atribuir a funções |
| Criar goals | Definir objetivos organizacionais |
| Atualizar heartbeats | Manter `last_heartbeat_at` atualizado |
| Gerar relatórios | Diário, semanal, por exceção |
| Corrigir falhas operacionais | Reatribuir tarefas, reescopo |
| Manter documentação | Atualizar skills, README, relatórios |
| Executar ciclos de melhoria | Aprimorar processos continuamente |

## 9.2 O que Hermes NÃO Pode Fazer (Reserva do Fundador)

| Ação | Motivo |
|------|--------|
| Criar cargos definitivos | Estrutura organizacional requer aprovação |
| Nomear diretores | Decisão estratégica de pessoal |
| Definir orçamentos (budget_monthly_cents > 0) | Controle financeiro executivo |
| Definir permissions granulares | Governança de contratação |
| Definir requireBoardApprovalForNewAgents | Governança de contratação |
| Alterar estratégia corporativa | Autoridade estratégica final |
| Criar novos departamentos | Criação de estrutura organizacional |

---

# 10. CICLO DE EVOLUÇÃO AUTÔNOMA — DETALHAMENTO

## 10.1 Como Hermes Melhora Continuamente

Hermes não é um modelo de ML que "aprende sozinho". Hermes é um Chefe de Gabinete que:

1. **Observa** o que funcionou e o que não funcionou nas entregas
2. **Documenta** lições aprendidas em skills e relatórios
3. **Ajusta** templates de issues, critérios de aceitação, fluxos de delegação
4. **Propõe** melhorias ao fundador (que decide se implementa)

## 10.2 Exemplo Prático de Evolução

| Situação | Problema Detectado | Ação de Hermes | Melhoria Implementada |
|----------|-------------------|----------------|----------------------|
| Semana 1 | Issues sem critérios de aceitação claros | Funções entregam trabalho incompleto | Hermes adiciona campo "critérios de aceitação" a todas as issues |
| Semana 2 | Algumas funções sobrecarregadas | Hermes redistribui tarefas | Cria regra de limite máximo de issues por função |
| Semana 3 | Entregas de arquitetura inconsistentes | Hermes cria template padrão | Template de issue de arquitetura com seções obrigatórias |
| Semana 4 | Funções não reportam heartbeat | Hermes cria verificação automática | Alerta quando função sem heartbeat > 24h |

## 10.3 Métricas de Melhoria

Hermes acompanha:

| Métrica | Como Mede | Meta |
|---------|-----------|------|
| Taxa de conclusão | Issues concluídas / Issues criadas | > 80% |
| Tempo médio de conclusão | Diferença entre created_at e updated_at de issues concluídas | < 5 dias |
| Taxa de reatribuição | Issues reatribuídas / Total de issues | < 10% |
| Satisfação do fundador | Feedback do fundador nos relatórios | Positivo |

---

# 11. IMPLEMENTAÇÃO NO BANCO DE DADOS

## 7.1 Tabelas Existentes (Reaproveitadas)

| Tabela | Uso no NOS-OS |
|--------|---------------|
| `companies` | Empresa NettosCorp |
| `agents` | Funções organizacionais + Hermes |
| `goals` | Objetivos organizacionais |
| `issues` | Tarefas operacionais |
| `environments` | Ambientes de execução (futuro) |
| `heartbeat_runs` | Monitoramento (futuro) |
| `cost_events` | Custos operacionais (futuro) |
| `chat_channels` | Canais de comunicação (futuro) |

## 7.2 Novas Tabelas Planejadas (Não Implementadas)

| Tabela | Propósito |
|--------|-----------|
| `nos_os_functions` | Registro detalhado de funções organizacionais |
| `nos_os_task_executions` | Histórico de execução de tarefas |
| `nos_os_reports` | Relatórios gerados automaticamente |
| `nos_os_audit_log` | Log de alterações no sistema operacional |

---

# 12. INTEGRAÇÃO COM O PAPERCLIP (ESTUDO, NÃO USO)

O código-fonte do Paperclip está no repositório como referência de estudo:

| Componente Paperclip | Uso no NOS-OS |
|---------------------|---------------|
| OpenAPI (818 endpoints) | Referência de endpoints possíveis |
| Tabelas `companies`, `agents`, `goals`, `issues` | Reaproveitadas como modelo de dados |
| Conceito de `reports_to` | Usado para hierarquia organizacional |
| Conceito de `adapter_type`/`adapter_config` | Usado para definir como funções executam |
| Conceito de `budget_monthly_cents` | Usado para orçamento (até definir pelo fundador) |
| Conceito de `permissions` | Usado para permissões (vazio até definir) |
| Conceito de `lifecycle_state` | Usado para ciclo de vida das funções |
| Servidor Paperclip | NÃO USADO — não há integração com API |

---

# 13. PRÓXIMOS PASSOS DE IMPLEMENTAÇÃO

| Prioridade | Ação | Responsável |
|------------|------|-------------|
| Alta | Criar documentação detalhada de cada função organizacional | Hermes |
| Alta | Implementar script de sincronização automática Hermes ↔ Supabase | Hermes |
| Alta | Implementar geração automática de relatórios diários | Hermes |
| Média | Criar mecanismo de registro de execução de tarefas (`nos_os_task_executions`) | Hermes |
| Média | Criar mecanismo de avaliação de resultados e correção de falhas | Hermes |
| Baixa | Popular ambientes (`environments` table) | Hermes |
| Baixa | Criar canais de comunicação (`chat_channels` table) | Hermes |

---

**Assinado:** Hermes (Chefe de Gabinete Executivo)  
**Repositório:** Tokenizaa/NettosCorp, branch master
