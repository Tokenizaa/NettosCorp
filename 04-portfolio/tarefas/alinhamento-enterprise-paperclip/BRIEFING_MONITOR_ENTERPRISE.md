# BRIEFING — MONITOR ENTERPRISE (net-ag-001)

**Tarefa:** NET-ALIGN-001 — Alinhamento enterprise ↔ Paperclip  
**Delegado por:** Hermes (Chefe de Gabinete Executivo)  
**Data:** 11 de novembro de 2026

## Sua missão

Mapear tecnicamente o que falta na plataforma enterprise (`enterprise/`) para espelhar o modelo do Paperclip (control plane para empresas autônomas de IA).

## O que você deve comparar

| Enterprise (atual) | Paperclip (referência) |
|--------------------|------------------------|
| `enterprise/supabase/migrations/20261107000001_initial_schema.sql` | `PAPERCLIP_INVESTIGACAO.md` (tabelas companies, agents, goals, issues) |
| `enterprise/src/services/paperclipService.ts` | Adapter types: process, http, local CLI/session |
| `.env.example` | Variáveis: PAPERCLIP_API_URL, PAPERCLIP_API_KEY |
| Tabelas com RLS | Campos: reports_to, budgetMonthlyCents, adapterType, capabilities |

## O que você deve entregar

**Relatório de gap analysis** contendo:
1. Campos do Paperclip que faltam no enterprise
2. Tabelas do Paperclip que não existem no enterprise
3. Adapter types que precisam ser implementados
4. Variáveis de ambiente obrigatórias para integração
5. Recomendação de ordem de execução

## Relatório de referência

Use como base o `RELATORIO_MONITOR_ENTERPRISE.md` já criado em `09-reports/relatorios-agentes/2026-11-11/`.

## Como reportar

Entregue o relatório a Hermes (Chefe de Gabinete) em formato markdown. Não tome decisões de implementação — apenas mapeie e recomende.

---

**Reports to:** Hermes  
**Orçamento:** Dentro do budgetMonthlyCents do agente (0 = sem limite até homologação)
