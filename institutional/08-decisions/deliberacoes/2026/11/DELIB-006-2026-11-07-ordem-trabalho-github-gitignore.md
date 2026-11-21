---
identificador: DELIB-006-2026-11-07
data_emissao: 2026-11-07
autoridade_emisora: Liderança Fundadora
destinatario: Hermes — Chefe de Gabinete Executivo
assunto: ORDEM DE TRABALHO — INTEGRAÇÃO GITHUB E PADRONIZAÇÃO GITIGNORE
origem: Ordem de Trabalho da Liderança Fundadora
status_execucao: Executado (catálogo de 11 repositórios, relatório de sincronização, padronização .gitignore, relatório de arquivos sensíveis, procedimento de auditoria, pendências e impedimentos criados)
---

# ORDEM DE TRABALHO — INTEGRAÇÃO GITHUB E PADRONIZAÇÃO GITIGNORE

**Responsável:** Hermes — Chefe de Gabinete Executivo  
**Organização:** NettosCorp  
**Diretório principal:** `/home/lg/workspace/NettosCorp/`

## Objetivo

Preparar a estrutura de projetos da NettosCorp para utilizar o GitHub como fonte central de consulta, rastreabilidade e auditoria técnica, além de padronizar a proteção de arquivos não versionáveis por meio de `.gitignore`.

Executar as duas frentes de forma coordenada.

### FRENTE 1 — INVENTÁRIO E PREPARAÇÃO DO GITHUB PARA AUDITORIAS

1. Examinar os diretórios existentes em `/home/lg/workspace/NettosCorp/`.
2. Identificar todos os projetos migrados do antigo diretório `projects/`.
3. Identificar o repositório GitHub correspondente a cada projeto.
4. Verificar, para cada projeto:
   - Caminho local.
   - Nome do projeto.
   - URL do repositório remoto.
   - Branch principal.
   - Estado de sincronização entre local e remoto.
   - Existência de alterações locais não commitadas.
   - Existência de commits ainda não enviados ou alterações remotas não recebidas.
   - Disponibilidade de acesso ao repositório.
5. Não criar repositórios duplicados. Todos os projetos já possuem repositórios.
6. Identificar projetos sem correspondência clara entre diretório local e repositório remoto e apresentar as divergências.
7. Criar um catálogo institucional dos projetos e respectivos repositórios em `empresa/04-portfolio/`.
8. Propor um procedimento para futuras auditorias técnicas utilizando o GitHub como referência, preservando histórico, branches, commits, issues e evidências.

**Importante:** não considerar automaticamente o GitHub como sincronizado ou atualizado. Verificar a situação real de cada repositório.

### FRENTE 2 — PADRONIZAÇÃO DOS ARQUIVOS .GITIGNORE

1. Examinar individualmente cada repositório.
2. Identificar linguagens, frameworks, ferramentas e ambientes utilizados.
3. Verificar se já existe `.gitignore`.
4. Se existir, revisar e preservar regras válidas.
5. Se não existir, criar um arquivo adequado à tecnologia identificada.
6. Ignorar, quando aplicável:
   - Dependências instaladas.
   - Builds e artefatos gerados.
   - Arquivos temporários e caches.
   - Logs.
   - Arquivos de ambiente com segredos.
   - Credenciais, tokens e chaves privadas.
   - Configurações locais que não devem ser compartilhadas.
   - Arquivos temporários de IDE e sistema operacional.
7. Preservar exemplos seguros, como `.env.example`, quando existentes.
8. Não ignorar migrations, código-fonte, testes, documentação, configurações necessárias ao build ou arquivos essenciais à execução.
9. Verificar arquivos sensíveis que já estejam versionados. Um `.gitignore` não remove arquivos já rastreados.
10. Não excluir arquivos, não remover histórico e não executar comandos destrutivos para corrigir o versionamento.

### REGRAS DE EXECUÇÃO

- Trabalhar somente nos repositórios identificados dentro da estrutura da NettosCorp.
- Não modificar funcionalidades, arquitetura ou código-fonte dos projetos.
- Não alterar configurações de produção.
- Não modificar remotes ou trocar a titularidade dos repositórios.
- Não criar novos repositórios.
- Não sobrescrever `.gitignore` existentes sem analisar seu conteúdo.
- Não publicar, fazer push ou alterar branches remotas sem autorização.
- Preservar alterações locais existentes.
- Caso haja risco de perda de dados ou exposição de segredos, interromper somente a operação afetada e registrar a ocorrência.
- Não considerar um projeto concluído sem evidências verificáveis.

### DOCUMENTAÇÃO E RESULTADO

Entregar:

1. Catálogo dos projetos e repositórios GitHub.
2. Relatório de sincronização local/remoto.
3. Relação dos `.gitignore` existentes, criados ou corrigidos.
4. Justificativa técnica das regras específicas por projeto.
5. Relação de arquivos sensíveis ou já rastreados que mereçam atenção.
6. Procedimento institucional para auditorias técnicas via GitHub.
7. Lista de pendências e impedimentos.

Salvar a documentação em:

`/home/lg/workspace/NettosCorp/empresa/04-portfolio/`

Atualizar o README institucional para apontar para o catálogo, sem misturar documentação empresarial com arquivos de implementação da plataforma.

### CRITÉRIO DE CONCLUSÃO

As duas frentes serão consideradas concluídas somente quando houver:

- Inventário verificável dos projetos e seus respectivos repositórios.
- Situação de sincronização documentada.
- `.gitignore` revisado individualmente em cada repositório aplicável.
- Ausência de alterações indevidas no código ou histórico.
- Relatório consolidado com evidências e pendências.

Ao terminar, apresentar um relatório executivo único à liderança fundadora.

**Prioridade:** preparar a infraestrutura de auditoria e organização antes de iniciar as próximas investigações técnicas da NettosCorp.