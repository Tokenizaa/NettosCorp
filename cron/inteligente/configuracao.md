# Configuração — Cron Inteligente

## Jobs ativos

### feedback-diario
- **Cron:** `0 9 * * *` (todo dia 09:00)
- **Comando:** `hermes cron:feedback --type diario`
- **Conteúdo:** Resumo do dia anterior + tarefas do dia atual + bloqueios pendentes

### feedback-semanal
- **Cron:** `0 8 * * 1` (segunda 08:00)
- **Comando:** `hermes cron:feedback --type semanal`
- **Conteúdo:** Relatório consolidado da semana + métricas + próximos passos

### verificacao-agentes
- **Cron:** `0 */6 * * *` (a cada 6 horas)
- **Comando:** `hermes cron:verificar-agentes`
- **Conteúdo:** Status dos agentes (ativo/ocioso/parado), heartbeat, tarefas em andamento

## Como ativar

```bash
hermes cronjob create feedback-diario --schedule "0 9 * * *"
hermes cronjob create feedback-semanal --schedule "0 8 * * 1"
hermes cronjob create verificacao-agentes --schedule "0 */6 * * *"
```

## Desativar

```bash
hermes cronjob disable feedback-diario
hermes cronjob disable feedback-semanal
hermes cronjob disable verificacao-agentes
```
