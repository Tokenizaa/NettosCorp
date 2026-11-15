# REFERÊNCIA DE ESTRUTURA — PAPERCLIP (EXEMPLO APENAS)

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)  
**Status:** Referência de estrutura organizacional. Não é infraestrutura, não é destino de migração.

## 1. Princípio fundamental

O **Paperclip é usado apenas como exemplo de estrutura organizacional**. Seu modelo (companies → teams → agents → tasks, organograma rígido, heartbeats, orçamentos, aprovações) inspira o desenho das funções organizacionais da NettosCorp, mas:

- **O Paperclip não é instalado** como servidor ou infraestrutura operacional.
- **Não há plano de migração para o Paperclip.** O sistema operacional da NettosCorp roda nativamente no Hermes.
- **Hermes permanece como o único agente de IA.** Nenhuma outra função ou entidade executa raciocínio autônomo de IA.

## 2. O que é aproveitado do Paperclip (apenas como referência)

| Conceito Paperclip | Uso no NOS-OS (apenas referência) |
|--------------------|-----------------------------------|
| `companies` → empresa | Estrutura de empresa única (NettosCorp) |
| `teams` → departamentos | Agrupamento lógico de funções |
| `agents` → funções organizacionais | Registros na tabela `agents` (não são IA autônoma) |
| `tasks` / `issues` | Tarefas operacionais atribuídas a funções |
| `reports_to` | Hierarquia estrita de supervisão |
| `adapter_type` / `adapter_config` | Como cada função executa (hermes-native) |
| `budget_monthly_cents` | Orçamento mensal (0 até definição do fundador) |
| `permissions` | Permissões da função (vazio até definição do fundador) |
| `heartbeats` | Monitoramento de atividade das funções |

## 3. O que NÃO é feito com o Paperclip

| Não-fazer | Justificativa |
|-----------|---------------|
| Instalar o servidor Paperclip | Não é infraestrutura operacional da NettosCorp |
| Migrar dados do NOS-OS para o Paperclip | Não há destino de migração |
| Usar a API REST do Paperclip | O sistema opera de forma independente via SQL/Hermes |
| Criar múltiplos agentes de IA | Hermes é o único agente de IA |
| Usar adapters do Paperclip (Claude, Codex, etc.) | As funções usam `adapter_type = process`, `adapter_config = hermes-native` |

## 4. Arquitetura adotada

O NOS-OS é um **sistema operacional de gestão organizacional** onde:

- **Hermes** = único agente de IA, Chefe de Gabinete Executivo
- **Funções organizacionais** = registros na tabela `agents` (diretores, especialistas, suporte), não IA autônoma
- **Banco Supabase** = memória compartilhada (companies, agents, goals, issues)
- **Repositório Git** = memória de documentos (README, skills, relatórios)

## 5. Regras respeitadas

- ✅ Paperclip como referência de estrutura apenas
- ✅ Não há instalação do servidor Paperclip
- ✅ Não há migração para o Paperclip
- ✅ Hermes permanece como único núcleo de inteligência
- ✅ Nenhuma outra IA é criada
- ✅ Comunicação em português, direta, sem filler
