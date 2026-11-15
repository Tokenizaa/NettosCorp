# PLANO DE MIGRAÇÃO PARA PAPERCLIP — CANCELADO

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)  
**Status:** CANCELADO — Não há plano de migração para o Paperclip.

## 1. Decisão

O Sistema Operacional NettosCorp (NOS-OS) é **padronizado para o Hermes**. Não haverá migração da arquitetura, dados, funções organizacionais ou qualquer componente do NOS-OS para o Paperclip original.

O Paperclip permanece como **referência de estrutura organizacional apenas** (consulte `docs/referencia-estrutura-paperclip.md`).

## 2. Justificativa

| Motivo | Explicação |
|--------|------------|
| Hermes é o único agente de IA | O modelo do Paperclip pressupõe múltiplos agentes autônomos, o que contradiz a regra da NettosCorp |
| Não há infraestrutura Paperclip | O servidor Paperclip não é instalado nem usado como infraestrutura operacional |
| Dados no Supabase | O NOS-OS já opera com tabelas próprias no Supabase (companies, agents, goals, issues) |
| Independência operacional | O sistema funciona sem depender de instalação ou API do Paperclip |

## 3. O que foi descontinuado

Qualquer plano anterior de migração para o Paperclip está **descontinuado**. O documento `plano-migracao-paperclip.md` original foi substituído por este aviso de cancelamento e por `referencia-estrutura-paperclip.md`, que documenta apenas a referência de estrutura.

## 4. Arquitetura definitiva

Consulte `docs/arquitetura-organizacional.md` para a arquitetura definitiva baseada em Hermes.
