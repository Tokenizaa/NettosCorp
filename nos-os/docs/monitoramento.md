# MONITORAMENTO — SISTEMA OPERACIONAL NETTOSCORP

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)

Este documento descreve o procedimento de monitoramento do Sistema Operacional NettosCorp.

## 1. Monitoramento de Heartbeat

Cada função organizacional cadastrada na tabela `agents` possui um campo `last_heartbeat_at`. Hermes verifica periodicamente se as funções estão ativas.

### Consulta de Heartbeat

```sql
SELECT code, name, role, status, last_heartbeat_at
FROM agents
WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
ORDER BY last_heartbeat_at;
```

### Critérios de Alerta

| Condição | Ação |
|----------|------|
| `last_heartbeat_at` é NULL | Função nunca reportou heartbeat; investigar |
| `last_heartbeat_at` > 24 horas atrás | Função possivelmente inativa; notificar |
| `status` = 'paused' | Função pausada; verificar motivo |
| `status` = 'terminated' | Funcão encerrada; verificar se foi autorizado |

---

## 2. Monitoramento de Issues (Tarefas)

Hermes monitora o status das issues na tabela `issues`.

### Consulta de Issues por Status

```sql
-- Issues em andamento
SELECT code, name, title, status, priority
FROM issues i
JOIN agents a ON i.assignee_agent_id = a.id
WHERE i.company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
AND i.status = 'in_progress'
ORDER BY i.created_at;

-- Issues em backlog
SELECT code, name, title, status, priority
FROM issues i
JOIN agents a ON i.assignee_agent_id = a.id
WHERE i.company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
AND i.status = 'backlog'
ORDER BY i.created_at;

-- Issues concluídas nas últimas 24 horas
SELECT code, name, title, status, updated_at
FROM issues i
JOIN agents a ON i.assignee_agent_id = a.id
WHERE i.company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
AND i.status = 'concluido'
AND i.updated_at >= CURRENT_DATE
ORDER BY i.updated_at DESC;
```

---

## 3. Cron Jobs Configurados

Os seguintes jobs estão ativos no Hermes:

| Job | Schedule | Descrição |
|-----|----------|-----------|
| feedback-diario | Todo dia 09:00 | Resumo do andamento das tarefas, relatórios dos agentes, bloqueios |
| feedback-semanal | Segunda 08:00 | Relatório consolidado da semana, métricas, próximos passos |
| verificacao-agentes | A cada 6 horas | Verifica se os agentes estão ativos, heartbeat, status das tarefas delegadas |

---

## 4. Alertas e Escalonamento

| Situação | Ação de Hermes |
|----------|----------------|
| Função sem heartbeat por > 24h | Gerar alerta ao fundador |
| Issue em backlog por > 7 dias | Verificar se há bloqueio; reportar ao fundador |
| Issue em in_progress por > 7 dias | Verificar se está travada; reportar ao fundador |
| Erro de conexão com Supabase | Tentar novamente em 5 minutos; se falhar, reportar ao fundador |

---

**Assinado:** Hermes (Chefe de Gabinete Executivo)
