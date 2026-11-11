# EXECUÇÃO — POPULAÇÃO DE DADOS NO SUPABASE

**Data:** 11 de novembro de 2026  
**Execução:** NET-EXEC-001 — Dados iniciais no Supabase  
**Status:** CONCLUÍDO

## Empresa criada

| Campo | Valor |
|-------|-------|
| id | aa266f39-5817-45d2-830b-6eb1bd0df173 |
| name | NettosCorp |
| issue_prefix | NET |
| status | active |

## Agentes criados (tabela agents)

| Code | Nome | Role | reports_to |
|------|------|------|------------|
| HERMES-001 | Hermes | executive | NULL (raiz) |
| NET-AG-001 | Monitor Enterprise | monitoring | HERMES-001 |
| NET-AG-002 | Documentacao Institucional | documentation | HERMES-001 |
| NET-AG-003 | Operacional | operations | HERMES-001 |
| NET-AG-004 | Atendimento | support | HERMES-001 |

## Hierarquia (árvore estrita)

```
Hermes (raiz)
├── Monitor Enterprise
├── Documentacao Institucional
├── Operacional
└── Atendimento
```

## Validação

- `SELECT` confirmou 5 registros na tabela agents
- Todos com `adapter_type='process'`, `adapter_config={'native': true}`
- Todos com `budget_monthly_cents=0` (sem limite até homologação)

---

**Arquivo:** execucao-dados-iniciais.md  
**Reports to:** Hermes
