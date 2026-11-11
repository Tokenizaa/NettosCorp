# CRON JOBS ATIVOS — HERMES NETTOSCORP

**Data:** 11 de novembro de 2026  
**Perfil:** default  
**Delivery:** origin (volta para este chat do Telegram)

| Job ID | Nome | Schedule | Próxima execução | Status |
|--------|------|----------|------------------|--------|
| 8a53d44a0cbe | feedback-diario | 0 9 * * * | 2026-11-11T09:00:00-03:00 | active |
| 78e472c459e2 | feedback-semanal | 0 8 * * 1 | 2026-11-16T08:00:00-03:00 | active |
| 46df72141ae1 | verificacao-agentes | 0 */6 * * * | 2026-11-11T06:00:00-03:00 | active |

## O que cada job faz

### feedback-diario (todo dia 09:00)
Verifica status dos agentes, tarefas delegadas, relatórios pendentes e bloqueios. Entrega resumo conciso em português brasileiro.

### feedback-semanal (segunda 08:00)
Relatório consolidado da semana: métricas, o que foi feito, o que está em andamento, plano para próxima semana.

### verificacao-agentes (a cada 6 horas)
Checa status de cada agente (ativo/ocioso/parado), último heartbeat, tarefas em andamento, relatórios pendentes. Alerta sobre bloqueios.

## Aprendizado

Cada interação com esses feedbacks é registrada em `cron/feedback/interacoes.jsonl` para ajustar tom, frequência e detalhamento conforme suas reações.

## Comandos úteis

```bash
hermes cron list                    # listar todos os jobs
hermes cron status                  # verificar se o scheduler está rodando
hermes cron pause <job-id>          # pausar um job
hermes cron resume <job-id>         # retomar um job pausado
hermes cron remove <job-id>         # remover um job
hermes cron runs                    # histórico de execuções
hermes cron incidents               # incidentes de falha