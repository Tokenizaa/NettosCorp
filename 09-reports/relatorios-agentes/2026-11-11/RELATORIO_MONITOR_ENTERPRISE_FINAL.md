# RELATÓRIO — MONITOR ENTERPRISE (net-ag-001)

**Tarefa:** NET-ALIGN-001 — Gap Analysis Enterprise ↔ Paperclip  
**Status:** CONCLUÍDO  
**Data:** 11 de novembro de 2026

## Estado atual do enterprise

| Item | Valor |
|------|-------|
| Local | `D:\NettosCorp\empresa\paperclip\enterprise/` |
| Stack | React 19 + Vite + TypeScript + Supabase |
| `.env` | ✅ Criado (credenciais aplicadas) |
| Supabase URL | https://udeglcdloehagljrrukj.supabase.co |
| Dependências | Não instaladas (sem node_modules) |
| Build | Não executado |

## Gap Analysis — Enterprise vs Paperclip

| Campo Paperclip | Está no enterprise? | Status |
|-----------------|---------------------|--------|
| companies | ❌ Não | Tabela ausente |
| agents | ✅ Sim | Tabela `agents` existe com RLS |
| goals | ❌ Não | Tabela ausente |
| issues | ❌ Não | Tabela ausente |
| reports_to | ❌ Não | Campo ausente |
| budgetMonthlyCents | ❌ Não | Campo ausente |
| adapterType | ❌ Não | Campo ausente |
| capabilities | ❌ Não | Campo ausente |
| lifecycleState | ❌ Não | Campo ausente |
| permissions | ❌ Não | Tabela `role_permissions` existe parcialmente |

## Tabelas faltantes no enterprise

- companies
- goals  
- issues
- environments
- heartbeat_runs
- cost_events
- chat_channels

## Recomendação de execução

1. Instalar dependências (`pnpm install`)
2. Criar projeto Supabase e rodar migration
3. Adicionar tabelas faltantes (companies, goals, issues)
4. Adicionar campos Paperclip na tabela agents
5. Configurar integração com Paperclip API

---

**Assinado:** Monitor Enterprise (net-ag-001)  
**Entregue a:** Hermes
