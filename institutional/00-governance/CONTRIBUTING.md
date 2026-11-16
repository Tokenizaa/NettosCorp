# Guia de Contribuição — NettosCorp

Versao: 1.0
Data: 14 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/NettosCorp/empresa/00-governance/CONTRIBUTING.md
Status: PROPOSTA — sujeito a revisao e aprovacao da lideranca fundadora
        (Netto Farias)
Responsavel: Technical Writer (CIA-007)

Este guia estabelece como qualquer pessoa ou agente da NettosCorp contribui
com documentos, decisoes e relatorios institucionalizados. Aplica-se a todos
os documentos sob:

```text
/home/lg/workspace/NettosCorp/NettosCorp/empresa/
```

## 1. Objetivo

Garantir que toda atividade relevante seja documentada, versionada,
rastreável e verificável, sem que nenhum agente dependa exclusivamente da
memoria de uma conversa.

## 2. Onde contribuir

| Pasta | Conteudo | Tipo de contribuicao |
|---|---|---|
| `00-governance/` | Governanca, memoria institucional, autoridade, protocolos operacionais, modelos de documento | Novos modelos, atualizacao de protocolos |
| `01-strategy/` | Visao empresarial, objetivos, roadmap corporativo | Ajustes de roadmap sob aprovação da lideranca |
| `02-organization/` | Organograma, departamentos, papeis, diretorias | Mudanca de estrutura organizacional |
| `03-management-system/` | Sistema de Gestao Corporativa, politicas e procedimentos | Novas politicas e procedimentos |
| `04-portfolio/` | Catalogo de projetos, repositorios, auditoria | Inclusão ou atualização de projetos |
| `05-technology/` | Arquitetura empresarial, pilha de tecnologia, padrões técnicos, catalogo de ADRs | Novos padrões técnicos e catalogo de ADRs |
| `06-operations/` | Operaçao, servicos, suporte, equipe de implantação | Rotinas operacionais |
| `08-decisions/` | Histórico de decisões, registro de alterações | Novas deliberações (formato DEC-YYYYMMDD-NNN) |
| `09-reports/` | Relatórios de acompanhamento, evidências, riscos | Relatórios de etapa e evidências de execução |

Nenhum documento institucional deve ser criado fora desse caminho.

## 3. Padrão de documento

Todo documento institucional deve conter, no mínimo, este cabeçalho:

```text
# TITULO DO DOCUMENTO — NETTOSCORP

Versao: X.Y (status)
Data: DD de mes de AAAA
Local: /home/lg/workspace/NettosCorp/NettosCorp/empresa/XX-pasta/NOME_DO_ARQUIVO.md
Status: PROPOSTA / EM DEFINICAO / APROVADO / OBSOLETO
Responsavel: Nome ou cargo
```

Regras:
- Cada documento tem exatamente uma versão (ex.: 1.0). Revisões menores
  incrementam 1.1; revisões maiores, 2.0.
- O status deve ser declarado no cabeçalho: PROPOSTA, EM DEFINICAO, APROVADO
  ou OBSOLETO.
- Documentos obsoletos não são excluídos: são movidos para subpasta de
  histórico ou marcados como OBSOLETO no cabeçalho, mantendo a versão anterior
  para auditoria.
- Nomenclatura proposta para novos documentos:
  `[AA]-[DESCRITOR]_[DD]M[AAAA].md`, onde `[AA]` é o número da pasta destino
  (00 a 09) e `[DESCRITOR]` em maiúsculas sem espaços, usando underline.
  Documentos já criados mantêm seus nomes atuais para não quebrar referências.
- Referências cruzadas usam o caminho absoluto do documento-fonte de verdade.

## 4. Sistema de conteúdo (Divio)

A documentação segue o sistema Divio e nunca mistura, em um único documento,
estes quatro tipos:

| Tipo | Objetivo | Abordagem | Quando usar |
|---|---|---|---|
| Tutorial | Aprendizagem orientada a objetivo | Passos concretos do zero ao funcionando | Integração de novo integrante ou novo processo |
| How-to | Resolução de problema específico | "Como faço X?" | Tarefa específica com resultado esperado |
| Reference | Informação sobre a máquina | Tabelas, contratos, assinaturas, campos | Consulta rápida e precisa |
| Explanation | Compreensão do contexto | Por que, alternativas, trade-offs | Decisões de arquitetura e padrões |

- Um conceito por seção (sem paredes de texto misturando instalação,
  configuração e uso).
- Cada documento é autônomo ou faz links para pré-requisitos (nunca assume
  contexto).
- Todo snippet de código é testado antes de publicar.

## 5. Como contribuir (passo a passo)

1. Identifique a pasta destino (tabela na secao 2) e o documento-fonte de
   verdade para o assunto.
2. Leia o documento-fonte e os pré-requisitos vinculados antes de escrever.
3. Escreva usando o modelo adequado em `00-governance/templates/`
   (documento institucional, ADR, tutorial, how-to, reference ou explanation).
4. Preencha o cabeçalho padrao (versao, data, local, status, responsavel).
5. Teste todo snippet de código antes de publicar.
6. Solicite revisão técnica do responsável pela área. Nenhum documento é
   publicado sem revisão técnica.
7. Após aprovação, altere o status para APROVADO e registre a decisão em
   `08-decisions/REGISTRO_DE_DELIBERACOES.md` quando houver deliberação
   relevante.
8. Commit diretamente na branch `master` (sem branches, sem worktrees, sem
   Pull Requests, sem force push).

## 6. Regras técnicas e de segurança

- Não expor tokens, chaves de serviço, secrets ou credenciais em documentos,
  logs ou comentários.
- Desenvolvimento e demonstrações usam exclusivamente dados sintéticos.
  Nunca inserir documentos reais de saúde, dados pessoais ou credenciais no
  repositório.
- Não alterar código de produção sem revisão do Software Architect
  (responsabilidade do Technical Writer: não alterar código de produção).
- Alterações proporcionais, justificadas e reconciliadas com a arquitetura
  existente (ADRs em `05-technology/` e em
  `/home/lg/workspace/NettosCorp/NettosCorp/Projetos/DefesaI-Saude-app/docs/decisions/`).
- Nenhum serviço, conta, recurso pago, credencial, integração externa,
  migração remota ou recurso de produção é provisionado sem autorização
  expressa do fundador.

## 7. Escalonamento

Conflito de prioridade, bloqueio persistente após 3 tentativas, ou
necessidade de recurso fora da competência: escale para Hermes (Chefe de
Gabinete Executivo). Não usar escalonamento como substituto para investigação
ou decisão técnica rotineira.

## 8. Modelos disponíveis

Todos em `/home/lg/workspace/NettosCorp/NettosCorp/empresa/00-governance/templates/`:

- `MODELO_DOCUMENTO_INSTITUCIONAL.md` — documento oficial da empresa
- `MODELO_ADR.md` — decisão de arquitetura (ADR)
- `TEMPLATE_TUTORIAL.md` — tutorial (Divio)
- `TEMPLATE_HOW-TO.md` — guia passo a passo (Divio)
- `TEMPLATE_REFERENCIA.md` — referência (Divio)
- `TEMPLATE_EXPLICACAO.md` — explicação de contexto (Divio)

Consulte `templates/README.md` para saber quando usar cada modelo.
