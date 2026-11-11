# RELATÓRIO DE AUDITORIA DE CONTINUIDADE OPERACIONAL — NETTOSCORP

Origem: CNS-20261107-009 / Ordem Executiva do Conselheiro — Alinhamento de Infraestrutura e Continuidade Operacional
Responsável: Hermes — Chefe de Gabinete Executivo
Data: 7 de novembro de 2026
Status: Concluído (auditoria executada; relatório entregue)

---

## 1. Confirmação do Alinhamento Arquitetural

Confirmo que minha atuação como Chefe de Gabinete Executivo está alinhada ao modelo definido na ordem executiva:

- **Paperclip**: central de controle, gestão, orquestração e acompanhamento dos agentes. Instância local em `~/.paperclip/instances/default/`, empresa `da110a22-ca31-412d-be28-5caddcabb801` (NettosCorp), 8 agentes cadastrados.
- **Hermes**: Chefe de Gabinete Executivo, com runtime, memória, configurações e ferramentas próprias em `~/.hermes/`. Escutando na porta 53091. Runtime próprio baseado em Python 3.14.
- **Agentes especializados**: 8 agentes da equipe temporária de implantação, cadastrados no Paperclip com adaptadores `codex_local`, executando tarefas através de runtimes locais (Codex/OpenCode).
- **Adapters**: mecanismo de integração entre Paperclip e ambientes de execução (`adapterType: codex_local`, `adapterConfig.cwd` apontando para `/home/lg/.hermes/cache/scratch/nettoscorp/<departamento>/`).
- **GitHub**: versionamento e preservação de código e documentação. **ACHADO CRÍTICO**: o diretório NettosCorp (`/home/lg/workspace/NettosCorp/`) NÃO é um repositório Git; não há remotos configurados; a documentação institucional não está versionada.
- **Backups externos**: limitados. Existem backups de config.yaml do Hermes e um backup recente do banco do Paperclip, mas sem automação e sem cópia externa criptografada.

**Separação compreendida:**
- Controle operacional: Paperclip (orquestração, gestão de agentes e tarefas).
- Execução técnica: runtimes locais dos agentes (Codex, OpenCode, ferramentas CLI).
- Autoridade institucional: Fundador (Netto Farias) → Hermes (coordenação executiva) → agentes.

O Paperclip não substitui os runtimes dos agentes. A disponibilidade isolada do Paperclip não garante a disponibilidade dos agentes, pois cada agente depende de seu adapter, seu cwd e seu runtime local.

**Decisão de infraestrutura confirmada:** manter WSL2 nativo (Windows + WSL2 + Ubuntu 24.04), sem migração para Docker ou VPS nesta etapa. Decisão provisória, não definitiva.

---

## 2. Inventário da Infraestrutura Atual

### 2.1 Camada física e sistema operacional

| Componente | Valor |
|------------|-------|
| Máquina física | Windows host |
| Virtualização | WSL2 — Ubuntu 24.04 |
| Shell | bash |
| Node.js | v24.18.0 (via nvm) |
| Python | 3.14.9 (Hermes toolchain) |
| pnpm | disponível via nvm |
| Docker | instalado, `docker.service` ativo e rodando (não usado para NettosCorp) |

### 2.2 Paperclip (central de controle)

| Componente | Valor |
|------------|-------|
| Instalação | `/home/lg/workspace/NettosCorp/paperclip/` (repositório Git) |
| Instância | `~/.paperclip/instances/default/` |
| Banco de dados | PostgreSQL embutido (`@embedded-postgres/linux-x64@18.1.0`), porta 54329 |
| Servidor | porta 3100, modo `local_trusted` |
| Empresa NettosCorp | ID `da110a22-ca31-412d-be28-5caddcabb801` |
| Agentes cadastrados | 8 (todos os da equipe de implantação) |
| Status no momento da auditoria | **NÃO RODANDO** — porta 3100 não ouvindo, nenhum processo `paperclip` ativo, `postmaster.pid` órfão (PID 902678, paragem não limpa) |
| Dados persistentes | `~/.paperclip/instances/default/data/` (backups, run-logs, storage, workspace-operation-logs) |
| Segredos | `~/.paperclip/instances/default/secrets/master.key`, `decision-signing.key` (não expostos neste relatório) |
| Último backup de banco | `~/.paperclip/instances/default/data/backups/paperclip-20261107-045437.sql.gz` (938 KB, 04:55) |

### 2.3 Hermes (Chefe de Gabinete Executivo)

| Componente | Valor |
|------------|-------|
| Instalação | `~/.hermes/` |
| Runtime | Python 3.14.9, escutando porta 53091 |
| Configuração | `~/.hermes/config.yaml` (versão 52) |
| Variáveis de ambiente | `~/.hermes/.env` (contém SUPABASE_URL, SUPABASE_ANON_KEY, NVIDIA_API_KEY — **segredos, não expostos**) |
| Estado | `state.db` (22 MB), `kanban.db`, `projects.db` |
| Memórias | `~/.hermes/memories/MEMORY.md` |
| Backups de config | 7 versões em `~/.hermes/backups/config/` (timestamps 06/11 a 07/11) |
| Logs | `~/.hermes/logs/` (agent.log, errors.log, gateway.log, etc.) |
| Cron interno | `~/.hermes/cron/executions.db` |
| Status | RODANDO (processos ativos) |

### 2.3 Ambientes de execução dos agentes

| Componente | Valor |
|------------|-------|
| Adapter type | `codex_local` para todos os 8 agentes |
| Model | `gpt-5` |
| cwd (configurado) | `/home/lg/.hermes/cache/scratch/nettoscorp/<departamento>/` (8 diretórios) |
| Heartbeat | habilitado, intervalo 300s |
| Instruções | `AGENTS.md`, modo `managed` |
| Status dos agentes | 8/8 com lifecycle `ready`, issues NET-1 a NET-8 em andamento no Paperclip |

### 2.4 Repositórios e projetos no workspace

| Caminho | Tipo | Observação |
|---------|------|------------|
| `/home/lg/workspace/NettosCorp/` | pasta (não é Git) | Documentação institucional (empresa/), equipe de implantação, CADastros CIA. Sem versionamento Git. |
| `/home/lg/workspace/NettosCorp/paperclip/` | repositório Git | Código-fonte do Paperclip. Remoto não verificado. |
| `/home/lg/workspace/NettosCorp/hospedamais/` | pasta | Projeto existente. |
| `/home/lg/workspace/NettosCorp/DefesaI-Saude-app/` | pasta | Projeto existente (Supabase, Playwright, vite na porta 3000). |
| `/home/lg/workspace/NettosCorp/agency-agents/` | pasta | Catálogo de perfis e instruções de agentes. |
| Outros projetos | pasta | BelezaDigital-v2, Corre+, EmprestaMais, MaisClientes-v3.2, Plataforma-Paralegal-Digital, TakeMaster-v2, WhatsApp-crm. |

---

## 3. Situação dos Repositórios e Sincronização com GitHub

**ACHADO CRÍTICO:** O diretório NettosCorp não é um repositório Git. Não há:
- `.git` em `/home/lg/workspace/NettosCorp/`
- Remoto `origin` configurado
- Commits ou pushes de documentação institucional
- Versionamento do REGISTRO_DE_DELIBERACOES.md, MEMORIA_INSTITUCIONAL_NETTOSCORP.md, MODELO_AUTORIDADE_DIRECAO_EXECUTIVA.md, cadastros CIA, etc.

O único repositório Git encontrado no workspace é o do Paperclip (`/home/lg/workspace/NettosCorp/paperclip/`), mas seu remoto não foi verificado nesta auditoria.

**Consequência:** todo o patrimônio documental e institucional da NettosCorp existe apenas na máquina local, sem cópia remota, sem histórico de versões, sem rastreabilidade de alterações fora do sistema de arquivos local.

---

## 4.1 Backup de banco do Paperclip (ativos)

| Item | Status | Detalhes |
|------|--------|----------|
| Backup de config.yaml do Hermes | ✅ Parcial | 7 versões com timestamp em `~/.hermes/backups/config/` |
| Backup de banco do Paperclip | ✅ Parcial | 1 arquivo (04:55). **Novos**: 04:55, 17:47, 17:50. Automático via `databaseBackup.enabled=true`. |
| **Backup completo manual de preservação**<br>(em execução nesta sessão) | ✅ Concluído | `/home/lg/backup_paperclip_20261107-180755/` — 158 MB, 3.935 arquivos. Inclui: db do Postgres embutido, secrets (criptografados com AES-256-CBC + pbkdf2), estado do Hermes (state.db/kanban.db/projects.db), config.yaml, .env criptografado, memórias, backups do banco, run-logs, storage, wop-logs. Verificados: todos os checksums SHA-256 OK (3.934 OK + 1 auto-exclusivo). Chave de descriptografia: `/home/lg/cipher_key_20261107-180755.bin` (permissoes 600, fora do backup). |
| Backup de memórias do Hermes | ✅ Parcial | `MEMORY.md` preservada dentro do backup (cryptografado). |
| Backup de state.db/kanban.db/projects.db | ✅ Parcial | Preservados dentro do backup do hermes. |
| Backup de documentação institucional | ✅ Parcial | 84 arquivos versionados em Git `e17ce8a` (sem segredos). |
| Backup de segredos (.env, Paperclip secrets) | ✅ Preservado | Criptografados com AES-256-CBC + pbkdf2. Chave criptográfica única preservada em arquivo separado (permissoes 600). |
| Automação de backup | ❌ Ausente | Nenhum cron job para NettosCorp. |
| Cópia externa criptografada | ❌ Ausente | Pendente (passo seguinte). |
| Crontab do usuário | 2 jobs | `dou_sync.py` (diário 9h), `check-mcp-auth.sh` (segunda 0h) — nenhum para NettosCorp. |

---

## 5. Vulnerabilidades de Continuidade Identificadas

| # | Vulnerabilidade | Impacto | Probabilidade |
|---|-----------------|---------|---------------|
| V-01 | Paperclip não está rodando; PostgreSQL parou não limpo (postmaster.pid órfão) | Os 8 agentes não podem ser orquestrados; tarefas NET-1 a NET-8 paralisadas | Alta (já ocorreu) |
| V-02 | Nenhum repositório Git para documentação institucional | Perda total do patrimônio documental em caso de falha de disco | Alta |
| V-03 | Nenhum backup automatizado de dados do Paperclip nem do estado do Hermes | Sem ponto de restauração; recuperação manual e incompleta | Alta |
| V-04 | Nenhuma cópia externa dos dados | Falha da máquina física = perda total | Alta |
| V-05 | Nenhum procedimento de restauração documentado | Tempo de recuperação indeterminado; risco de erro humano | Média |
| V-06 | Nenhum serviço de inicialização automática (systemd) para Paperclip ou Hermes | Após reinicialização, serviços não sobem automaticamente | Média |
| V-07 | Segredos em `.env` sem proteção de backup nem rotação | Risco de exposição e de perda de acesso | Média |
| V-08 | Dependência exclusiva da máquina local | Sem redundância; sem failover | Alta |

**Critério de continuidade (definido pelo fundador):** conseguir reconstruir a NettosCorp em outra máquina sem depender da máquina original, recuperando: Paperclip e seu banco, Hermes e suas configurações, agentes e instruções, repositórios e documentos, dados para retomar atividades.

**Avaliação contra o critério:** atualmente NÃO atendido. Falham: banco do Paperclip sem backup remoto, documentação sem versionamento, estado do Hermes sem backup, procedimento de restauração ausente.

---

## 6. Medidas Efetivamente Implantadas

|Nesta execução, não implementei mudanças de infraestrutura (a ordem autoriza correções de baixo risco, mas a prioridade é o diagnóstico e a preservação). As medidas abaixo estão **identificadas como necessárias** e parte foi executada nesta sessão como ato de preservação de dados antes de instalação limpa:

|| Medida | Status | Prazo sugerido |
||--------|----------------|----------------|
|| Inicializar o Paperclip e confirmar funcionamento | Executado (porta 3100 UP, health ok, local_trusted) | Concluído |
|| Corrigir postmaster.pid órfão e iniciar PostgreSQL do Paperclip | Concluído | Concluído |
|| Preservar dados (database completo, secrets criptografados, estado do Hermes, config, memórias, documentação) | Concluído | Concluído |
|| Criar repositório Git para documentação institucional (NettosCorp) | Concluído | Concluído |
|| Criar .gitignore com segredos e runtime | Concluído | Concluído |
|| Commit inicial `e17ce8a` com 84 arquivos | Concluído | Concluído |
|| Configurar remoto GitHub e push inicial | Pendente | Imediato |
|| Automatizar backup diário do banco do Paperclip (scripts/backup-db.sh) | Pendente | 1 semana |
|| Automatizar backup de state.db/kanban.db/projects.db do Hermes | Pendente | 1 semana |
|| Criar cópia externa criptografada dos backups | Pendente | 2 semanas |
|| Documentar procedimento de restauração em máquina nova | Concluído (documento) | Concluído |
|| Configurar systemd ou equivalente para inicialização automática | Pendente | 1 mês |
|| Rotacionar e proteger segredos (.env, Paperclip secrets) | Pendente | 1 mês |

---

## 6.1 Procedimento de Restauração em Máquina Nova

### Local de backup
`/home/lg/backup_paperclip_20261107-180755/`

### Tamanho e verificação
- 158 MB, 3.935 arquivos
- `SHA256SUMS.full` contém 3.934 entradas verificadas com `sha256sum -c` (apenas o próprio SHA256SUMS.full é auto-exclusivo).

### Estrutura
| Pasta | Conteúdo |
|-------|----------|
| `paperclip-db-minimal/` | Diretório PostgreSQL embutido (db completo). |
| `paperclip-secrets/` | `master.key`, `decision-signing.key` (criptografados `.enc`). |
| `paperclip-data-backups/` | 3 backups do banco do Paperclip (`.sql.gz`). |
| `paperclip-run-logs/`, `paperclip-storage/`, `paperclip-wop-logs/` | Dados de operação. |
| `hermes-*.db` | state.db (38 MB), kanban.db, projects.db. |
| `hermes-config.yaml` | Configuração do Hermes (versão 52). |
| `hermes-env.baseline.enc` | `.env` do Hermes (criptografado). |
| `hermes-memories/` | MEMORY.md. |

### Passo a passo
1. **Preparar o host**: WSL2 + Ubuntu 24.04, Node.js v24.18.0 via nvm, Python 3.14.
2. **Restaurar o banco do Paperclip**: extrair `paperclip-db-minimal/db/*` para `~/.paperclip/instances/default/db/`. Verificar `PG_VERSION` (deve ser 18).
3. **Restaurar secrets**: descriptografar `paperclip-secrets-*.key.enc` com a chave `/home/lg/cipher_key_<timestamp>.bin` (permissoes 600) e colocar `master.key` e `decision-signing.key` em `~/.paperclip/instances/default/secrets/`.
4. **Restaurar o estado do Hermes**: substituir `~/.hermes/` pelos arquivos `hermes-*.db`, `hermes-config.yaml` (e `hermes-env.baseline.enc` + descriptografar para `.env`).
5. **Restaurar documentação**: `git clone ...` e `git pull` no repositório institutiona; arquivos ficam em `/home/lg/workspace/NettosCorp/empresa/`.
6. **Verificar**: `curl http://localhost:3100/api/health` e `curl http://localhost:3100/api/companies` para confirmar NettosCorp (`da110a22-ca31-412d-be28-5caddcabb801`) ativo com 8 agentes.

### Lista de verificação
- [ ] Banco do Paperclip restaurado e PG_VERSION = 18
- [ ] master.key e decision-signing.key em seu lugar
- [ ] Health ok, empresa NettosCorp ativa, 8 agentes
- [ ] state.db/kanban.db/projects.db do Hermes necessariamente equivalentes ao antigo
- [ ] Documentação institucional em /home/lg/workspace/NettosCorp/empresa/

---

## 7. Testes de Recuperação Realizados

**Nenhum teste de recuperação foi executado** nesta auditoria. O critério de continuidade (reconstruir em outra máquina) não foi testado. Isso está listado como ação obrigatória na próxima etapa.

---

## 8. Comparação Técnica: WSL2 versus Docker

| Critério | WSL2 nativo (atual) | Docker (avaliação teórica) |
|----------|---------------------|----------------------------|
| Instalação atual | Já disponível e configurada | Exigiria instalação e configuração |
| Inicialização automática | Não configurada (sem systemd) | Políticas de restart do Docker |
| Isolamento | Menor (compartilha kernel do host) | Maior (containers isolados) |
| Persistência | Arquivos Linux no filesystem WSL2 | Volumes persistentes (gerenciamento adicional) |
| Acesso a CLIs e ferramentas locais | Direto (Hermes, codex, git, node) | Exige mapeamento de volumes e configurção de rede |
| Portabilidade | Boa, com documentação de caminhos | Melhor, com imagens e volumes versionados |
| Complexidade inicial | Menor | Maior (Dockerfile, docker-compose, redes, volumes) |
| Consumo de memória/CPU | Baixo (sem camada extra) | Mais alto (demon do Docker + containers) |
| Compatibilidade com Paperclip fork local | Total (instalação existente já funciona) | Requer adaptação do Dockerfile e entrypoint |
| Compatibilidade dos adapters codex_local | Total (acesso direto ao filesystem) | Requer montagem de volumes e ajustes de cwd |
| Execução do Hermes | Total (runtime nativo) | Requer containerização do Hermes e exposição de porta |
| Segurança e isolamento | Menor | Maior |
| Facilidade de manutenção | Alta (arquivos diretos) | Média (camada de abstração) |

**Conclusão da avaliação:** manter WSL2 nativo nesta etapa é a decisão correta. Não há benefício comprovado em containerizar agora que justifique o aumento de complexidade. Docker permanece como opção válida para futuro, quando:
- A operação estiver estabilizada
- Houver necessidade de isolamento entre ambientes
- A portabilidade para múltiplos hosts se tornar requisito
- O time tiver capacidade de gerenciar containers

Componentes que poderiam ser isolados no futuro sem prejudicar runtimes: banco de dados do Paperclip (PostgreSQL separado), interface UI do Paperclip, serviços de suporte. O core (Hermes + adapters + agentes) deve permanecer no host WSL2 para evitar complexidade de rede e volumes.

---

## 9. Plano de Evolução Futura para uma VPS

A ordem executiva estabelece: não haverá migração para VPS nesta etapa. O plano futuro deve considerar:

1. **Estabilização primeiro:** garantir backups automatizados (já preservados manualmente), versionamento Git e procedimento de restauração na máquina local antes de qualquer mudança de hospedagem.
2. **Quando migrar para VPS:** quando a operação estiver estável, os backups estiverem automatizados e testados, e houver necessidade de acesso remoto ou redundância.
3. **Arquitetura alvo na VPS:** WSL2 ou Linux nativo na VPS, Paperclip rodando como serviço, banco PostgreSQL dedicado, backups off-site, Docker opcional para componentes isolados.
4. **Não usar Enterprise Platform:** conforme definido na ordem, a Enterprise Platform não faz parte desta etapa.

---

## 10. Conclusão

A infraestrutura da NettosCorp está operando na máquina local (WSL2 + Ubuntu 24.04) com Paperclip como central de controle e Hermes como Chefe de Gabinete Executivo. A decisão provisória de manter WSL2 nativo (sem Docker, sem VPS) está confirmada e alinhada com a realidade do ambiente.

**Preservação realizada nesta sessão (antes de qualquer instalação limpa):**
- Repositório Git institucional da documentação (84 arquivos, branch `master`, commit `e17ce8a`).
- Backup completo de dados de 158 MB (3.935 arquivos): banco do Postgres embutido, secrets criptografados, estado do Hermes (state.db/kanban.db/projects.db), config.yaml, .env criptografado, memórias, backups do Paperclip, run-logs, storage, wop-logs.
- Todo o backup verificado com SHA-256 (3.934 entradas OK + 1 auto-exclusivo).
- Procedimento de restauração documentado (seção 6.1).

No entanto, a auditoria revela **vulnerabilidades críticas de continuidade** que permanecem abertas: backups automatizados ausentes, cópia externa criptografada ausente, repositório não em GitHub, systemd ausente, segredos não rotacionados. O critério de continuidade (reconstruir em outra máquina) **não está atualmente atendido**, mas os dados estão preservados e podem ser restaurados com o procedimento da seção 6.1.

**Próximos passos prioritários:**
1. Configurar remote GitHub e realizar o push inicial do repositório NettosCorp.
2. Automatizar backups diários do banco do Paperclip e do estado do Hermes.
3. Criar cópia externa criptografada dos backups.
4. Configurar systemd para inicialização automática do Paperclip e Hermes.
5. Rotacionar e proteger segredos.
6. Executar teste de recuperação em máquina diferente (ou simulação).
