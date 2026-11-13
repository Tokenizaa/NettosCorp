# ÍNDICE — PORTFÓLIO E AUDITORIA GITHUB — NETTOSCORP

Versao: 1.0
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/04-portfolio/INDICE.md

Este diretório contém a documentação da Frente 1 (Inventário e Preparação do GitHub para Auditorias) e da Frente 2 (Padronização dos Arquivos .gitignore), executadas sob a Ordem de Trabalho de Integração GitHub e Padronização Gitignore.

---

## Documentos deste diretório

| # | Documento | Descricao |
|---|-----------|-----------|
| 1 | CATALOGO_PROJETOS_REPOSITORIOS.md | Catálogo institucional dos 11 repositórios Git identificados na estrutura da NettosCorp, com caminhos locais, nomes, URLs remotos, branches e status de correspondência local/remoto |
| 2 | RELATORIO_SINCRONIZACAO.md | Relatório de sincronização local/remoto por repositório: commits locais vs remotos, alterações não commitadas, commits não enviados, divergências |
| 3 | GITIGNORE_PADRONIZACAO.md | Relação dos arquivos .gitignore existentes, revisados ou ausentes por projeto, com justificativa técnica das regras específicas |
| 4 | ARQUIVOS_SENSIVEIS_RASTREADOS.md | Relação de arquivos sensíveis já rastreados no Git que merecem atenção (ex: .env com tokens) |
| 5 | PROCEDIMENTO_AUDITORIA_GITHUB.md | Procedimento institucional para futuras auditorias técnicas utilizando o GitHub como referência |
| 6 | PENDENCIAS_IMPEDIMENTOS.md | Lista de pendências e impedimentos identificados durante a execução das duas frentes |

---

## Repositorios identificados

Total: 11 repositorios Git em /home/lg/workspace/NettosCorp/

| # | Projeto | Caminho local | Branch | .gitignore |
|---|---------|---------------|--------|------------|
| 1 | agency-agents | /home/lg/workspace/NettosCorp/agency-agents/ | main | EXISTE |
| 2 | BelezaDigital-v2 | /home/lg/workspace/NettosCorp/BelezaDigital-v2/ | master | EXISTE |
| 3 | Corre+ | /home/lg/workspace/NettosCorp/Corre+/ | main | EXISTE (modificado) |
| 4 | Defesai-AdeusMultas-v2 | /home/lg/workspace/NettosCorp/Defesai-AdeusMultas-v2/ | main | EXISTE |
| 5 | DefesaI-Saude-app | /home/lg/workspace/NettosCorp/DefesaI-Saude-app/ | main | EXISTE |
| 6 | EmprestaMais | /home/lg/workspace/NettosCorp/EmprestaMais/ | main | NAO EXISTE (deletado) |
| 7 | hospedamais | /home/lg/workspace/NettosCorp/hospedamais/ | main | EXISTE |
| 8 | MaisClientes-v3.2 | /home/lg/workspace/NettosCorp/MaisClientes-v3.2/ | main | EXISTE |
| 9 | paperclip | /home/lg/workspace/NettosCorp/paperclip/ | master | EXISTE |
| 10 | Plataforma-Paralegal-Digital | /home/lg/workspace/NettosCorp/Plataforma-Paralegal-Digital/ | main | EXISTE |
| 11 | TakeMaster-v2 | /home/lg/workspace/NettosCorp/TakeMaster-v2/ | main | EXISTE |

---

## Diretórios não-Git na estrutura

| Diretorio | Motivo |
|-----------|--------|
| empresa/ | Repositorio de documentacao institucional (nao e projeto de software) |
| old/ | Diretorio vazio |
| WhatsApp-crm/ | Nao e repositorio Git (contem apenas pasta supabase/) |
| .wrangler/ | Diretorio de configuracao da Cloudflare |

---

## Relacao com documentos existentes

Este índice complementa:
- `empresa/00-governance/MEMORIA_INSTITUCIONAL_NETTOSCORP.md`
- `empresa/01-strategy/ROADMAP_CORPORATIVO.md`

Nenhum código de projeto foi alterado. Nenhum push ou alteração de branch remota foi executada. Nenhum novo repositório foi criado.