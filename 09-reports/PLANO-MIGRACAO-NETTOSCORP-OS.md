# PLANO DE MIGRAÇÃO — SISTEMA OPERACIONAL NETTOSCORP (NOS-OS)

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)  
**Princípio:** Hermes = ÚNICO agente de IA. Nada mais é agente autônomo. Nenhuma exclusão sem autorização.

---

## 1. Estado Atual (Inventário Confirmado)

| Componente | Estado | Observação |
|------------|--------|------------|
| Empresa NettosCorp (Supabase) | 2 registros (duplicata) | Manter ambos; não excluir sem autorização |
| Agentes (tabela agents) | 14 registros | 1 IA (Hermes) + 13 funções organizacionais |
| Goals | 8 registros | Objetivos organizacionais |
| Issues | 10 registros | 4 concluídas, 2 em_progress, 4 backlog |
| Tabelas auxiliares | 8 tabelas criadas | Ambientes, heartbeats, custos, canais, etc. |
| Código Paperclip | packages/ | Mantido como referência, não usado |
| Skills Hermes | skills/ | nettoscorp-org, nettoscorp-agents |
| Cron jobs | 3 jobs ativos | feedback-diario, feedback-semanal, verificacao-agentes |
| Frontend enterprise | React + Vite + Supabase | Mantido, funciona localmente |

---

## 2. Princípios da Migração

| Princípio | Ação |
|-----------|------|
| **Não excluir nada** | Todas as tabelas, registros, migrations e documentos permanecem |
| **Hermes = único IA** | Outros 13 registros na tabela agents são funções organizacionais, não IA |
| **Não usar API Paperclip** | O código fonte do Paperclip é referência apenas; não há integração ativa |
| **Reaproveitar código existente** | Adapter Hermes, shared types, db schema, skills, cron são reaproveitados |
| **Construir próprio sistema** | Novos scripts, documentação, procedimentos específicos da NettosCorp |

---

## 3. Fases de Execução

### Fase 1: Auditoria e Documentação (CONCLUÍDA)
| Item | Status |
|------|--------|
| Inventário do repositório | ✅ Feito |
| Auditoria do banco Supabase | ✅ Feito |
| Relatório técnico do Orquestrador | ✅ Feito (commit `5beaf9592`) |
| Relatório de auditoria e reconciliação | ✅ Feito (commit `1887e7a6f`) |
| Relatório técnico completo | ✅ Feito (commit `5beaf9592`) |

### Fase 2: Reinterpretação dos Agentes (EXECUTANDO)
| Item | Ação | Status |
|------|------|--------|
| Reinterpretar 13 não-Hermes como funções organizacionais | Atualizar metadados no banco | Em andamento |
| Manter Hermes como único agente de IA | Não alterar Hermes | Manter |
| Atualizar capabilities dos agentes para refletir função organizacional | Atualizar tabela agents | Em andamento |
| Manter Orquestrador Global como função de coordenação (não IA) | Atualizar metadados | Em andamento |

### Fase 3: Construção do Sistema Operacional (INICIANDO)
| Item | Ação | Status |
|------|------|--------|
| Criar diretório nos-os/ | Criar estrutura de pastas | Em andamento |
| Criar documentação de arquitetura | ARQUITETURA-ALVO-NETTOSCORP-OS.md | ✅ Feito |
| Criar script de sincronização Hermes-Supabase | novo script Python | Em andamento |
| Criar script de geração de relatórios | novo script Python | Planejado |
| Criar script de monitoramento de heartbeat | novo script Python | Planejado |
| Adaptar frontend enterprise | Remover dependência Paperclip API | Planejado |
| Criar documentação de procedimentos operacionais | novos arquivos markdown | Planejado |

### Fase 4: Testes e Evidências (PLANEJADO)
| Item | Ação | Status |
|------|------|--------|
| Verificar conectividade Supabase | Testar consulta SQL | Planejado |
| Verificar execução de issues via Hermes | Atualizar status de issues | Planejado |
| Verificar geração de relatórios | Gerar relatório automático | Planejado |
| Verificar cron jobs | Verificar 3 jobs ativos | Planejado |

### Fase 5: Relatório Final (PLANEJADO)
| Item | Ação | Status |
|------|------|--------|
| O que foi reaproveitado | Listar componentes reaproveitados | Pendente |
| O que foi construído | Listar novos arquivos e código | Pendente |
| Arquivos alterados | Listar modificações | Pendente |
| Testes realizados | Listar testes e resultados | Pendente |
| Pendências | Listar o que falta | Pendente |

---

## 4. Cronograma Estimado

| Fase | Duração | Data Prevista |
|------|---------|---------------|
| Fase 1 (Auditoria) | Concluída | 11/11/2026 |
| Fase 2 (Reinterpretação) | Em andamento | 11/11/2026 |
| Fase 3 (Construção) | 2-3 sessões | 11-12/11/2026 |
| Fase 4 (Testes) | 1 sessão | 12/11/2026 |
| Fase 5 (Relatório) | 1 sessão | 12/11/2026 |

---

## 5. Regras de Execução

| Regra | Descrição |
|-------|-----------|
| Sem pedir confirmação a cada etapa | Trabalhar com autonomia nas etapas autorizadas |
| Não parar para decisões do fundador | Apenas decisões estratégicas, orçamentárias, de segurança e contratações exigem fundador |
| Preservar dados existentes | Nada é excluído sem autorização específica |
| Não confundi projetos/departamentos com agentes de IA | Funções organizacionais ≠ agentes de IA |
| Documentar tudo | Cada ação gera arquivo ou registro no banco |

---

**Assinado:** Hermes (Chefe de Gabinete Executivo)  
**Repositório:** Tokenizaa/NettosCorp, branch master
