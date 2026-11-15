# SISTEMA OPERACIONAL NETTOSCORP (NOS-OS) — ESTRUTURA DE DIRETÓRIOS

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)

Este diretório contém o código, documentação e procedimentos do Sistema Operacional NettosCorp — **padronizado para o Hermes como único agente de IA**. O Paperclip é usado apenas como referência de estrutura organizacional (organograma, companies, teams, agents, tasks), nunca como infraestrutura operacional.

## Estrutura de Pastas

```
nos-os/
├── docs/                    # Documentação técnica (padronizada para Hermes)
│   ├── referencia-estrutura-paperclip.md  # Paperclip como exemplo de estrutura apenas
│   ├── arquitetura-organizacional.md      # Arquitetura Hermes como único agente de IA
│   ├── modelo-dados.md                    # Modelo de dados (tabelas, campos, relacionamentos)
│   ├── procedimentos.md                   # Procedimentos operacionais padrão
│   ├── api-interna.md                     # API interna (endpoints, contratos)
│   ├── monitoramento.md                   # Monitoramento de heartbeat e status
│   ├── mecanismo-coordenacao.md           # Mecanismo de coordenação Hermes ↔ funções
│   └── ciclo-evolucao-autonoma.md         # Ciclo de evolução autônoma de Hermes
├── src/                     # Código fonte (scripts de automação Hermes)
│   ├── sync/                # Sincronização Hermes ↔ Supabase
│   ├── reports/             # Geração de relatórios
│   ├── monitor/             # Monitoramento de heartbeat e status
│   └── utils/               # Utilitários compartilhados
├── migrations/              # Migrations SQL específicas NettosCorp
│   └── ...
├── tests/                   # Testes de integração e unidade
└── README.md                # Este arquivo
```

## Regras de Uso (obrigatórias)

1. **Hermes é o único agente de IA.** Nenhum script ou função executa raciocínio autônomo de IA além de Hermes.
2. **O Paperclip é referência de estrutura apenas.** Seu código-fonte, OpenAPI e modelo organizacional servem de exemplo para desenhar o organograma (companies → teams → agents → tasks), mas **não é instalado, não é usado como servidor e não há migração para ele**.
3. **Todas as alterações no banco são feitas via SQL explícito.**
4. **Nenhuma credencial é exposta nos arquivos do repositório.**

## Como usar este diretório

- Consulte `docs/referencia-estrutura-paperclip.md` para entender como o modelo organizacional do Paperclip inspira o desenho de funções, hierarquia e tarefas — **sem instalar o Paperclip**.
- Consulte `docs/arquitetura-organizacional.md` para a arquitetura definitiva baseada em Hermes.
- Consulte `docs/procedimentos.md` para os procedimentos operacionais padrão de Hermes.
- Os scripts em `src/` automatizam tarefas de Hermes (sync Supabase, relatórios, monitoramento).
