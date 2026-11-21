# Referência — Segurança, permissões e limites de autoridade (NettosCorp)

## Regras de segurança obrigatórias

1. Nunca commite `.env`, tokens, chaves de API, `secrets/master.key` nem dados do banco.
2. Tokens via variável de ambiente (`PAPERCLIP_API_KEY`), nunca em arquivos versionados.
3. Nunca imprima tokens nem secret values em relatórios, comentários, documentos ou logs.
4. Em strict mode, use secret refs, não valores inline.
5. Faça backup antes de alterações relevantes: `pnpm paperclipai db:backup`.
6. Não execute `onboard` (cria segunda instância). Não execute `run` (segundo servidor). Não altere a porta 3100.

## Limites de autoridade (governança NettosCorp)

Sem decisão homologada do fundador, NÃO:

- Recriar a organização nem criar segunda instância.
- Apagar agentes existentes.
- Alterar identidades, nome, título, ícone, aparência de agentes sem respaldo documental.
- Alterar hierarquia (`reportsTo`) ou cadeia de comando.
- Substituir conexões de IA existentes sem necessidade comprovada.
- Modificar banco de produção de forma destrutiva.
- Declarar sucesso sem testes e evidências.

## Permissões por papel (conforme cadastros CIA-001 a CIA-008)

- Orquestrador Global: coordena a equipe; cria/atualiza agentes dentro de sua alçada.
- Especialistas (PM, Arquitetos, DevOps, QA, Technical Writer): executam suas áreas; não criam/modificam agentes nem definem orçamentos/adapters sem autorização.
- Board (local-board): instance admin, aprovações, gestão da empresa.

## Estado atual vs limites

Todos os 19 agentes da NettoCorp têm `canCreateAgents: true` e `canCreateSkills: true`, o que excede os limites dos cadastros CIA (especialistas não devem criar agentes sem autorização). Essa divergência deve ser apresentada ao fundador antes de qualquer ajuste.

## Backup

Diretório: `~/.paperclip/instances/default/data/backups/`
Comando: `pnpm paperclipai db:backup`
Limite de staleness: 26h.
