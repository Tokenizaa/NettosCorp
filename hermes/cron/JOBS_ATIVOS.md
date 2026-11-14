# CRON JOBS ATIVOS — HERMES NETTOSCORP

| Job ID | Nome | Schedule | Próxima execução | Status |
|--------|------|----------|------------------|--------|
| 8a53d44a0cbe | feedback-diario | 0 9 * * * | 2026-11-11T09:00:00-03:00 | active |
| 78e472c459e2 | feedback-semanal | 0 8 * * 1 | 2026-11-16T08:00:00-03:00 | active |
| 46df72141ae1 | verificacao-agentes | 0 */6 * * * | 2026-11-11T06:00:00-03:00 | active |

## O que cada job faz

- **feedback-diario** (todo dia 09:00) — Verifica status dos agentes, tarefas delegadas, relatórios pendentes e bloqueios. Entrega resumo conciso em português.
- **feedback-semanal** (segunda 08:00) — Relatório consolidado da semana: métricas, o que foi feito, o que está em andamento, plano para próxima semana.
- **verificacao-agentes** (a cada 6 horas) — Checa status de cada agente, último heartbeat, tarefas em andamento, relatórios pendentes. Alerta sobre bloqueios.

## Configuração de schedulers

- `hermes cron list` — Listar todos os jobs
- `hermes cron status` — Verificar se o scheduler está rodando
- `hermes cron pause <job-id>` — Pausar
- `hermes cron resume <job-id>` — Retomar
- `hermes cron remove <job-id>` — Remover
- `hermes cron runs` — Histórico de execuções
- `hermes cron incidents` — Incidentes de falha
