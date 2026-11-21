# PROCEDIMENTO INSTITUCIONAL PARA AUDITORIAS TÉCNICAS VIA GITHUB — NETTOSCORP

Versao: 1.0 (proposta, em definicao, NAO aprovada)
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/04-portfolio/PROCEDIMENTO_AUDITORIA_GITHUB.md
Status: PROPOSTA — sujeita a revisao e aprovacao pela lideranca fundadora (Netto Farias)

---

## 1. Finalidade

Estabelecer um procedimento padronizado para que a NettosCorp utilize o GitHub como fonte central de consulta, rastreabilidade e auditoria tecnica de seus projetos de software. O procedimento preserva o historico, branches, commits, issues e evidencias de cada repositorio.

---

## 2. Escopo

Aplica-se a todos os 11 repositorios Git identificados na estrutura `/home/lg/workspace/NettosCorp/`:

1. agency-agents (main)
2. BelezaDigital-v2 (master)
3. Corre+ (main)
4. Defesai-AdeusMultas-v2 (main)
5. DefesaI-Saude-app (main)
6. EmprestaMais (main)
7. hospedamais (main)
8. MaisClientes-v3.2 (main)
9. paperclip (master)
10. Plataforma-Paralegal-Digital (main)
11. TakeMaster-v2 (main)

---

## 3. Principios

- **Leitura so:** auditorias tecnicas sao baseadas em consultas (`git log`, `git show`, `git diff`, `git ls-remote`, issues do GitHub). Nenhuma alteracao de codigo, histórico, branches ou remotos e executada durante a auditoria.
- **Nao destrutivo:** nenhum comando que reescreva historico, remova arquivos rastreados ou altere branches remotas sera executado.
- **Rastreavel:** toda auditoria deve ser documentada com data, repositorio analisado, comandos executados e evidencias coletadas.
- **Segura:** tokens de acesso, credenciais e chaves privadas contidos em arquivos de configuracao (.git/config, .env) nao devem ser extraidos, compartilhados ou publicados.

---

## 4. Etapas do procedimento

### Etapa 1 — Preparacao da auditoria

1. Definir o objetivo da auditoria (ex: verificar qualidade de codigo, rastrear alteracoes, avaliar dependencias, checar seguranca).
2. Selecionar o(s) repositorio(s) a ser(em) auditado(s) no catalogo (`empresa/04-portfolio/CATALOGO_PROJETOS_REPOSITORIOS.md`).
3. Verificar o status de sincronizacao local/remoto (`empresa/04-portfolio/RELATORIO_SINCRONIZACAO.md`).
4. Registrar a auditoria em `empresa/08-decisions/` ou `empresa/09-reports/` com identificador, data, responsavel e objetivo.

### Etapa 2 — Coleta de evidencias (apenas leitura)

Para cada repositorio, executar apenas comandos de consulta:

| Informacao desejada | Comando de consulta (exemplo) |
|---------------------|------------------------------|
| Historico de commits | `git log --oneline -n 50` |
| Detalhe de um commit | `git show <hash> --stat` |
| Diff entre branches | `git diff branch1..branch2 --stat` |
| Status local vs remoto | `git status --porcelain` e `git ls-remote origin <branch>` |
| Arquivos rastreados | `git ls-files` |
| Arquivos ignorados | `git check-ignore -v <arquivo>` |
| Remoto configurado | `git remote -v` |
| Branch atual | `git branch --show-current` |
| Tags | `git tag` |
| Stash | `git stash list` |

Nenhum comando de escrita (`git commit`, `git push`, `git reset`, `git rebase`, `git filter-branch`, `git rm`) deve ser executado.

### Etapa 3 — Analise de evidencias

- Comparar commit local com commit remoto para identificar divergencias.
- Identificar arquivos sensiveis rastreados (ex: `.env` com tokens).
- Verificar existencia e adequacao do `.gitignore`.
- Revisar mensagens de commit para rastreabilidade de decisoes.
- Identificar branches longas vivas ou merge commits pendentes.

### Etapa 4 — Registro da auditoria

Criar um relatorio de auditoria em `empresa/09-reports/` contendo:

```
# RELATORIO DE AUDITORIA — NETTOSCORP

Identificador: AUD-YYYYMMDD-NNN
Data: DD de mes de AAAA
Responsavel: [NOME OU CARGO]
Repositorio: [NOME DO PROJETO]
Caminho: /home/lg/workspace/NettosCorp/<projeto>/
Branch analisada: [main/master]
Objetivo: [descricao]

Commit local (HEAD): [hash]
Commit remoto (origin): [hash]
Sincronizado: [SIM/NAO]

Alteracoes locais nao commitadas: [arquivos ou "nenhuma"]
Arquivos untracked: [arquivos ou "nenhum"]

Arquivos sensiveis rastreados: [arquivos ou "nenhum"]
.gitignore adequado: [SIM/NAO]

Conclusao: [resumo]
Recomendacoes: [lista]
Aprovacao: [pendente/aprovado/rejeitado]
```

### Etapa 5 — Arquivamento

O relatorio de auditoria deve ser arquivado em `empresa/09-reports/` e o registro da decisao em `empresa/08-decisions/`, se houver mudancas recomendadas que exijam aprovacao da lideranca.

---

## 5. Repositorio como fonte de verdade

O GitHub (remote `origin` de cada repositorio) e considerado a fonte central de consulta para:
- Historico de alteracoes de codigo-fonte
- Mensagens de commit e associacao com issues/pull requests
- Branches de feature, correcao e release
- Tags de versao
- Issues e discussoes tecnicas

O repositorio local e considerado uma copia de trabalho. Em caso de divergencia entre local e remoto, o remoto prevalece como referencia de auditoria, salvo evidencia em contrario.

---

## 6. Limitacoes

- Este procedimento nao concede acesso a repositorios privados sem autorizacao do titular.
- Tokens de acesso contidos nas URLs remotas (x-access-token) nao devem ser extraidos ou compartilhados.
- Auditorias nao alteram o estado de nenhum repositorio.
- Arquivos ja rastreados com conteudo sensível (ex: `.env` em Corre+) permanecem no historico; o procedimento apenas os identifica e reporta.

---

## 7. Relacao com documentos existentes

Este procedimento complementa:
- `empresa/00-governance/MEMORIA_INSTITUCIONAL_NETTOSCORP.md`
- `empresa/00-governance/GOVERNANCA_CORPORATIVA.md`
- `empresa/00-governance/ARQUITETURA_DOCUMENTAL.md`
- `empresa/04-portfolio/CATALOGO_PROJETOS_REPOSITORIOS.md`
- `empresa/04-portfolio/RELATORIO_SINCRONIZACAO.md`
- `empresa/04-portfolio/GITIGNORE_PADRONIZACAO.md`
- `empresa/04-portfolio/ARQUIVOS_SENSIVEIS_RASTREADOS.md`

---

## 8. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/04-portfolio/PROCEDIMENTO_AUDITORIA_GITHUB.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/04-portfolio/PROCEDIMENTO_AUDITORIA_GITHUB.md")

---

Nenhum codigo de projeto foi alterado. Nenhum push ou alteracao de branch remota foi executada.