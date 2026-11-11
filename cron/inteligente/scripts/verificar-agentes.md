# Script — Verificação de Agentes

**Comando:** `hermes cron:verificar-agentes`

## O que verifica

1. Status de cada agente (ativo / ocioso / parado)
2. Último heartbeat (se passou de 6 horas sem resposta, alertar)
3. Tarefas em andamento vs concluídas
4. Relatórios pendentes dos agentes

## Output esperado

```
📊 Verificação de Agentes — NettosCorp
─────────────────────────────────────
🟢 Monitor Enterprise — Ativo — Último heartbeat: 2h atrás
🟡 Documentação Institucional — Ocioso — Sem tarefas pendentes
🔴 Operacional — Parado — Aguardando credenciais do fundador
🟢 Atendimento — Ativo — 0 mensagens na fila

📋 Tarefas em andamento: 1 (NET-ALIGN-001)
⚠️ Bloqueio: Operacional parado aguardando .env do enterprise

💡 Ação sugerida: Fornecer credenciais para desbloquear o Operacional
```
