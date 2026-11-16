# Tutorial — Publicar um documento no portal institucional da NettosCorp (MkDocs)

Versao: 1.0
Data: 14 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/NettosCorp/empresa/00-governance/00-TUTORIAL_PUBLICAR_DOCUMENTO_MKDOCS_14N2026.md
Status: PROPOSTA
Responsavel: Technical Writer (CIA-007)

Tutorial do tipo Divio (aprendizagem orientada a resultado). Não misture com
referência ou explicação. Todo snippet de código foi executado antes de
publicar (mkdocs build validado neste ambiente).

## Objetivo

Ao final deste tutorial o leitor consegue adicionar um novo documento
institucional ao repositório da NettosCorp e publicá-lo no portal de
documentação MkDocs, do zero ao site estático gerado em `site/`.

## Pre-requisitos

- Acesso ao filesystem do repositório: `/home/lg/workspace/NettosCorp/NettosCorp/`.
- Python 3 e `pip` instalados.
- `mkdocs` e `mkdocs-material` instalados.
  Versões verificadas neste ambiente: mkdocs **1.6.1**, mkdocs-material **9.8.1**
  (ambiente: venv `/home/lg/.hermes/cache/scratch/nettoscorp/docs/venv`).
- O documento-fonte já escrito em `empresa/`, seguindo o cabeçalho padrão de
  `CONTRIBUTING.md` (secao 3).

## Passo a passo

1. **Escreva o documento.** Em `empresa/XX-pasta/NOME_DO_ARQUIVO.md`, usando
   o cabeçalho padrão (`Versao`, `Data`, `Local`, `Status`, `Responsavel`) e
   um modelo de `00-governance/templates/`. Resultado esperado: arquivo
   Markdown válido criado na pasta de destino.

2. **Registre o documento no menu.** Adicione uma entrada ao bloco `nav` do
   arquivo `/home/lg/workspace/NettosCorp/NettosCorp/mkdocs.yml` (configuração
   canônica do site; `docs_dir: empresa`). O caminho no `nav` é relativo a
   `docs_dir`, sem o prefixo `empresa/`. Resultado esperado: o documento
   aparece na navegação do portal.

3. **Gere o site estático.** A partir da raiz do repositório:
   `mkdocs build --clean` (com o ambiente verificado acima). Resultado
   esperado: o terminal imprime `INFO - Documentation built in XX segundos`
   e o comando sai com código 0.

4. **Confirme a saída.** `ls site/index.html` — resultado esperado:
   `site/index.html` existe (o site estático foi construído).

5. **Visualize localmente (opcional).** `mkdocs serve` — resultado
   esperado: servidor de desenvolvimento sobe em `http://127.0.0.1:8000` e o
   documento aparece na navegação.

## Resultado esperado

Evidência verificável de sucesso: o comando `mkdocs build` finaliza com
`Documentation built` e código de saída 0, e a pasta
`/home/lg/workspace/NettosCorp/NettosCorp/site/` contém o HTML gerado,
incluindo `index.html`.

## Solução de problemas

- `mkdocs: comando não encontrado`: instale com `pip install mkdocs
  mkdocs-material` ou chame o binário diretamente em
  `/home/lg/.local/bin/mkdocs`.
- `WARNING - The configuration file ... cannot be found`: você está
  executando fora da raiz do repositório. Rode os comandos a partir de
  `/home/lg/workspace/NettosCorp/NettosCorp`, onde fica o `mkdocs.yml`.
- O documento não aparece na navegação: verifique se o caminho foi adicionado
  ao `nav` do `mkdocs.yml`, relativo a `docs_dir: empresa` (sem o prefixo
  `empresa/`).

## Recuperação

Documento completo: `/home/lg/workspace/NettosCorp/NettosCorp/empresa/00-governance/00-TUTORIAL_PUBLICAR_DOCUMENTO_MKDOCS_14N2026.md`
