# Deploy e rollback — NettosCorp

## Estrategia
- O CI (`.github/workflows/ci.yml`) constroi a imagem `nettoscorp:<sha>` e `nettoscorp:latest` a cada push em `master`, apos lint -> typecheck -> testes -> build.
- O deploy (`.github/workflows/deploy.yml`) e disparado apos o CI verde ou manualmente (`workflow_dispatch`).
- A concurrency `deploy-nettoscorp` impede deploys paralelos.

## Rollback
- Reimplantar a imagem anterior estavel: reexecutar o deploy com a tag/SHA do deploy anterior conhecido-bom.
- Como nao ha registro de container configurado, o rollback hoje eh operacional: reverter o commit em `master` (`git revert <sha>` + push), o que aciona o CI e implanta a versao anterior.
- Nenhum deploy automatico eh feito sem aprovacao do fundador.

## Credenciais necessarias (fundador)
- REGISTRY_USER e REGISTRY_TOKEN (ou equivalente) como secrets do GitHub.
- Alvo de deploy (host/cluster) e variaveis de ambiente de producao.

## Bloqueio
- Protecao de branch de `master` nao pode ser configurada por este agente: nao ha token GitHub autenticado (`gh` nao esta logado; `.git-credentials` e placeholder). Configurar via GitHub pelo fundador.
