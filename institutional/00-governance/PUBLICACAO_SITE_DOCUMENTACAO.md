# Publicação do site de documentação — NettosCorp

Versao: 1.0
Data: 14 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/NettosCorp/empresa/00-governance/PUBLICACAO_SITE_DOCUMENTACAO.md
Status: PROPOSTA
Responsavel: Technical Writer (CIA-007)

Explica como gerar, visualizar localmente e publicar o site institucional de
documentação da NettosCorp, construído com MkDocs (tema Material) e
configurado em `mkdocs.yml` na raiz do repositório.

## Objetivo

Resultado esperado: uma pasta `site/` com HTML estático, pronta para ser
servida por qualquer servidor web estático ou publicada em hospedagem
estática autorizada.

## Escopo

- Apenas publicação do site institucional (documentação em
  `/home/lg/workspace/NettosCorp/NettosCorp/empresa/`).
- Não altera o conteúdo dos documentos, apenas gera o site estático a partir
  deles.
- Não envolve provisionamento de serviço pago, conta externa ou recurso de
  produção sem autorização do fundador.

## Pre-requisitos

- Acesso ao repositório: `/home/lg/workspace/NettosCorp/NettosCorp/`.
- Python 3 e `pip` instalados.
- `mkdocs` e `mkdocs-material` instalados (Passo 1).
- Destino de hospedagem estática e credenciais de acesso, autorizados pelo
  fundador (Netto Farias), só para o Passo 4.

## Passo 1 — Instalar o MkDocs

No diretório raiz do repositório:

```text
pip install mkdocs mkdocs-material
```

Ambiente verificado: `mkdocs` 1.6.1 + `mkdocs-material` 9.8.1 (venv
`/home/lg/.hermes/cache/scratch/nettoscorp/docs/venv`).

## Passo 2 — Gerar o site estático

```text
mkdocs build --clean
```

O comando lê `mkdocs.yml` (configuração canônica no repositório:
`/home/lg/workspace/NettosCorp/NettosCorp/mkdocs.yml`, com `docs_dir:
empresa`) e gera a saída em `site/` (pasta configurada como `site_dir:
../site` relativa à raiz do repositório). O site gerado equivale ao site
publicado que está disponível em `https://nettoscorp.example.com/docs`.

## Passo 3 — Visualizar localmente

```text
mkdocs serve
```

Acesse `http://localhost:8000/`. Para parar o servidor: `Ctrl+C`.

## Passo 4 — Publicar

Copie o conteúdo de `site/` para o destino de hospedagem estática
autorizado pelo fundador. Nenhum serviço externo, conta paga ou recurso de
produção é provisionado sem autorização expressa do fundador (Netto Farias).

## Validação da navegação

O bloco `nav` de `mkdocs.yml` referencia 39 arquivos em `empresa/`. O
build em modo estrito (`mkdocs build --clean --strict`) valida que todos os
arquivos existem e que as referências cruzadas estão corretas. Resultado:
`OK` (sem arquivos faltando, sem links quebrados).

## Notas deste ambiente

- O build do site foi verificado neste ambiente com o venv
  `/home/lg/.hermes/cache/scratch/nettoscorp/docs/venv` (mkdocs 1.6.1 +
  mkdocs-material 9.8.1): `mkdocs build --clean` concluiu com exit 0 em ~60s.
- A configuração `site_url` aponta para
  `https://nettoscorp.example.com/docs`, valor placeholder da configuração
  inicial. Alterar somente quando o domínio real de hospedagem estiver
  definido e aprovado.
- O repositório possui duas configurações de site: a canônica no repositório
  (`mkdocs.yml` na raiz de `/home/lg/workspace/NettosCorp/NettosCorp/`) e um
  espelho no diretório pai (`/home/lg/workspace/NettosCorp/mkdocs.yml`),
  mantido para que o site já publicado continue sendo reconstruído a partir da
  raiz do diretório de trabalho. O conteúdo é idêntico; a versão canônica é
  a do repositório.

Documento mantido pela Technical Writer (CIA-007). Não expor tokens,
secrets ou credenciais neste documento.
