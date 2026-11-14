# Monitoramento basico — NettosCorp

## Health check
- Nenhum endpoint de producao definido ainda para o monorepo NettosCorp.
- Quando houver um servico exposto, adicionar `.github/workflows/monitor.yml` com probe agendado (cron) ao endpoint de health, seguindo o modelo de DefesaI-Saude-app/.github/workflows/monitor.yml (probe a cada 6h de / e /api/health, falhando em HTTP != 200).

## Logs
- Logging estruturado ja existe no worker do DefesaI Saude (commit ea31cdf). Padronizar para o monorepo quando houver runtime de producao.

## Alertas
- Nenhum alerta configurado. Definir apos o primeiro deploy de producao.
