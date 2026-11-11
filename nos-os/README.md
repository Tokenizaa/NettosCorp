# SISTEMA OPERACIONAL NETTOSCORP (NOS-OS) — ESTRUTURA DE DIRETÓRIOS

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)

Este diretório contém o código, documentação e procedimentos do Sistema Operacional NettosCORP — construído com base nos conhecimentos do Paperclip, mas independente dele.

## Estrutura de Pastas

```
nos-os/
├── docs/                    # Documentação técnica
│   ├── arquitetura.md       # Arquitetura do sistema
│   ├── modelo-dados.md      # Modelo de dados (tabelas, campos, relacionamentos)
│   ├── procedimentos.md     # Procedimentos operacionais padrão
│   └── api-interna.md       # API interna (endpoints, contratos)
├── src/                     # Código fonte (scripts de automação)
│   ├── sync/                # Sincronização Hermes ↔ Supabase
│   ├── reports/             # Geração de relatórios
│   ├── monitor/             # Monitoramento de heartbeat e status
│   └── utils/               # Utilitários compartilhados
├── config/                  # Configurações do sistema
│   ├── settings.json        # Configurações gerais
│   ├── providers.json       # Configuração de provedores (Hermes único)
│   └── routes.json          # Rotas de roteamento de tarefas
├── migrations/              # Novas migrations SQL específicas NettosCorp
│   ├── 0001_nos_os_functions.sql
│   ├── 0002_nos_os_tasks.sql
│   └── 0003_nos_os_monitoring.sql
├── tests/                   # Testes de integração e unidade
│   ├── test_connection.sql
│   ├── test_issues.sql
│   └── test_reports.py
└── README.md                # Guia de uso do sistema operacional
```

## Regras de Uso

- Hermes é o único agente de IA. Nenhum script ou função executa raciocínio autônomo de IA além de Hermes.
- Todas as alterações no banco são feitas via SQL explícito.
- Nenhuma credencial é exposta nos arquivos do repositório.
- O servidor Paperclip não é usado como infraestrutura. Seu código fonte é referência apenas.
