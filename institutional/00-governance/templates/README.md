# Modelos de Documento — NettosCorp

Versao: 1.0
Data: 14 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/NettosCorp/empresa/00-governance/templates/README.md
Status: APROVADO (como modelo institucional de reuso)
Responsavel: Technical Writer (CIA-007)

A pasta `00-governance/templates/` guarda os modelos reutilizaveis da
documentacao institucional da NettosCorp. Cada modelo e um ponto de partida:
copie o arquivo para a pasta de destino, preencha o cabecalho padrao e adapte
as secoes ao assunto. Nao altere o modelo original para publicar um documento.

## 1. Quando usar cada modelo (sistema Divio)

| Modelo | Tipo Divio | Objetivo | Quando usar |
|---|---|---|---|
| `MODELO_DOCUMENTO_INSTITUCIONAL.md` | Institucional | Registro oficial da empresa | Qualquer documento institucional que nao se encaixe nos tipos abaixo |
| `MODELO_ADR.md` | Explanation / decisao | Decisao de arquitetura com contexto, alternativa e consequencias | Toda decisao tecnica relevante (padrao ADR) |
| `TEMPLATE_TUTORIAL.md` | Tutorial | Aprendizagem guiada do zero ao funcionando | Integracao de novo integrante, primeiro uso de processo |
| `TEMPLATE_HOW-TO.md` | How-to | Resolucao de problema especifico em passos | Tarefa concreta ("como faco X?") |
| `TEMPLATE_REFERENCIA.md` | Reference | Informacao precisa para consulta | Consulta rapida de campos, endpoints, tabelas |
| `TEMPLATE_EXPLICACAO.md` | Explanation | Contexto, por que das decisoes, trade-offs | Decisoes de arquitetura, padroes, politica |

## 2. Regras comuns a todos os modelos

- Preencha o cabecalho padrao: Versao, Data, Local, Status, Responsavel.
- Um conceito por secao (sem paredes de texto misturando instalacao,
  configuracao e uso).
- Cada documento e autonomo ou faz links para pre-requisitos (nunca assume
  contexto).
- Todo snippet de codigo e testado antes de publicar.
- Nenhum documento é publicado sem revisão técnica do responsável pela área.
- Não expor tokens, secrets ou credenciais em nenhum modelo preenchido.

## 3. Fluxo de publicação

1. Copie o modelo para a pasta de destino (tabela em `CONTRIBUTING.md`,
   secao 2).
2. Preencha o cabeçalho e as secoes.
3. Solicite revisão técnica do responsável pela área.
4. Após aprovação, defina `Status: APROVADO` e faça commit diretamente na
   branch `master` (sem branches, sem worktrees, sem Pull Requests, sem force push).
5. Se houver deliberação relevante, registre-a em
   `08-decisions/REGISTRO_DE_DELIBERACOES.md` (formato `DEC-YYYYMMDD-NNN`).

## 4. Mapa de arquivos

| Arquivo | Uso |
|---|---|
| `MODELO_DOCUMENTO_INSTITUCIONAL.md` | Documento oficial da empresa |
| `MODELO_ADR.md` | Decisão de arquitetura (ADR) |
| `TEMPLATE_TUTORIAL.md` | Tutorial (Divio) |
| `TEMPLATE_HOW-TO.md` | Guia passo a passo (Divio) |
| `TEMPLATE_REFERENCIA.md` | Referência (Divio) |
| `TEMPLATE_EXPLICACAO.md` | Explicação de contexto (Divio) |
