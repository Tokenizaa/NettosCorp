---
name: nettoscorp-skill-discovery-and-governance
description: >
  Protocolo institucional de pesquisa, seleção, auditoria e atribuição de skills
  para a NettosCorp. Obriga a consulta ao skills.sh como fonte permanente de
  descoberta, define classificação (APROVADA / REVISÃO / REJEITADA) e regras de
  segurança para integrar skills aos agentes da empresa. Use sempre que houver
  necessidade de avaliar, instalar ou atribuir uma skill a um agente Paperclip.
category: paperclip-operations
recommendedForRoles: [orquestrador, project-manager, ceo, technical-writer, devops, qa]
trustLevel: markdown_only
compatibility: compatible
version: 1.0.0
---

# Skill Institucional — Descoberta e Governança de Skills (NettosCorp)

Esta skill define o **protocolo obrigatório** de pesquisa, seleção, auditoria e atribuição de skills para todos os agentes da NettosCorp, incluindo o CEO e quaisquer futuras contratações.

Ela transforma o `skills.sh` em uma **fonte oficial e obrigatória** de descoberta de skills, ao lado da biblioteca interna da empresa e do catálogo do Paperclip.

---

## 1. Objetivo e escopo

Garantir que toda skill considerada para uso na NettosCorp passe por um processo institucional de:

- descoberta em fontes autorizadas (biblioteca interna, Paperclip, skills.sh)
- avaliação de aderência, compatibilidade, qualidade e segurança
- classificação formal (APROVADA / REVISÃO / REJEITADA)
- atribuição seletiva ao agente correto
- teste de utilização no runtime

Aplica-se ao CEO, a todos os agentes existentes e a quaisquer futuras contratações de agentes.

---

## 2. Fontes obrigatórias de descoberta (ordem de consulta)

Sempre nesta ordem:

### 2.1 Biblioteca interna NettosCorp

Verificar se a empresa já possui a skill instalada na company library (`GET /api/companies/{companyId}/skills` ou `pnpm paperclipai skills list --company-id <id>`).

Se já existir e estiver atribuída ao agente adequado, não duplicar.

### 2.2 Catálogo oficial do Paperclip

Consultar skills disponíveis e compatíveis com o ambiente instalado (`pnpm paperclipai skills browse`, `pnpm paperclipai skills search "<query>"`, `pnpm paperclipai skills inspect <catalogRef>`).

Verificar compatibilidade com a versão 0.3.1 e com o harness do agente destino.

### 2.3 skills.sh (FONTE OBRIGATÓRIA)

Pesquisar no **[skills.sh](https://www.skills.sh/)** por competências e procedimentos necessários.

O skills.sh é uma fonte oficial de descoberta de skills da NettosCorp a partir desta skill. Não é opcional.

Utilizar a CLI oficial `npx skills find` quando apropriado para buscar por especialidade.

---

## 3. Protocolo de avaliação (8 etapas obrigatórias)

Para cada skill candidata, executar todas as etapas:

### Etapa 1 — Pesquisar na biblioteca interna

Confirmar se a skill já está instalada na empresa.

### Etapa 2 — Consultar o Paperclip

Verificar se há skill equivalente no catálogo oficial, sua categoria, trust level e compatibilidade.

### Etapa 3 — Pesquisar no skills.sh

Buscar alternativas por especialidade e necessidade. Registrar nome, origem, versão/hash e URL.

### Etapa 4 — Examinar o repositório original

Ler `SKILL.md`, scripts, referências, dependências e licença da skill candidata.

### Etapa 5 — Auditoria de segurança

Consultar os resultados de auditoria de segurança disponíveis no skills.sh.

> **Atenção:** o próprio skills.sh alerta que não garante a qualidade nem a segurança de todas as skills listadas. Popularidade ou posição no ranking **não** é garantia de qualidade ou segurança. Ausência de auditoria **não** significa aprovação de segurança.

### Etapa 6 — Avaliar aderência

Comparar:
- compatibilidade com o harness do agente destino (claude_local, opencode_local, process, etc.)
- dependências e requisitos de execução
- licença e termos de uso
- permissões exigidas pela skill
- possíveis efeitos colaterais
- sobreposição com skills já instaladas

### Etapa 7 — Decisão

Classificar em uma das três categorias:

| Classificação | Significado | Ação |
|---------------|-------------|------|
| **APROVADA** | Pode ser integrada à empresa e atribuída ao agente | Instalar na company library e atribuir |
| **REVISÃO** | Exige análise adicional ou autorização institucional | Apresentar ao fundador/Hermes antes de instalar |
| **REJEITADA** | Risco, incompatibilidade ou inadequação | Não instalar; registrar motivo |

### Etapa 8 — Integrar e testar

Se aprovada:

1. Instalar na company library (`pnpm paperclipai skills install <ref> --company-id <id>` ou `skills import`/`skills create`).
2. Atribuir ao agente correto (`pnpm paperclipai skills agent sync <agent-id> --skill <ref> --mode add --company-id <id>`).
3. Verificar via API que o runtime reconheceu a skill (`GET /api/agents/{agentId}/skills`, `supported: true`).
4. Testar utilização real no runtime.
5. Registrar fonte, repositório, versão/hash, auditoria e decisão.

---

## 4. Regras de segurança

- Nunca instalar automaticamente por popularidade ou posição no ranking do skills.sh.
- Nunca pular a auditoria de segurança. Ausência de auditoria não significa aprovação.
- Nunca conceder permissões adicionais a um agente apenas para viabilizar uma skill.
- Não instalar skills que exijam `dangerouslySkipPermissions: true` sem revisão de segurança.
- Registrar todas as decisões, mesmo as de rejeição, com justificativa.
- Manter evidências de instalação e atribuição (output do CLI, resposta da API).

---

## 5. Classificação e registro

Toda avaliação deve gerar um registro com:

| Campo | Conteúdo |
|-------|----------|
| Nome da skill | slug/key |
| Origem | biblioteca interna / Paperclip / skills.sh / repositório original |
| Repositório | URL |
| Versão ou hash | versão ou content hash |
| Auditoria de segurança | resultado disponível no skills.sh ou "não disponível" |
| Classificação | APROVADA / REVISÃO / REJEITADA |
| Justificativa | motivo da decisão |
| Agente destino | ID do agente a quem será atribuída (se aprovada) |
| Data | data da avaliação |
| Avaliador | agente ou pessoa responsável |

---

## 6. Exemplo de fluxo completo

```sh
# 1. Biblioteca interna
pnpm paperclipai skills list --company-id 1ad50023-2215-4d61-b1ea-d896cfe0e535

# 2. Catálogo Paperclip
pnpm paperclipai skills search "project management" --json
pnpm paperclipai skills inspect issue-triage

# 3. skills.sh (fonte obrigatória)
npx skills find "project management" --json

# 4. Instalar se aprovada
pnpm paperclipai skills install <catalogRef> --company-id 1ad50023-2215-4d61-b1ea-d896cfe0e535
# ou
pnpm paperclipai skills import ./caminho/da/skill --company-id 1ad50023-2215-4d61-b1ea-d896cfe0e535

# 5. Atribuir ao agente
pnpm paperclipai skills agent sync <agent-id> --skill <skill-ref> --mode add --company-id 1ad50023-2215-4d61-b1ea-d896cfe0e535

# 6. Verificar no runtime
curl -s "http://127.0.0.1:3100/api/agents/<agent-id>/skills"
```

---

## 7. Diferença entre skill e outras coisas

Não confundir **skill** com:
- **ferramenta** (ex: curl, git)
- **integração** (ex: GitHub, Slack, MCP)
- **plugin** (extensão do runtime)
- **conexão** (provedor de IA)
- **competência profissional** (habilidade do agente)

Uma skill é um documento de procedimento reutilizável (`SKILL.md`) que ensina o agente a executar um tipo específico de trabalho.

---

## 8. Atualização de protocolos institucionais

Esta skill deve ser incorporada a:

- Protocolo institucional de contratação e homologação de agentes (`PROCEDIMENTO_ADOCAO_AGENTES.md`)
- Procedimento institucional de gestão de skills da NettosCorp
- Instruções do CEO (`AGENTS.md`) como referência obrigatória para seleção de skills

---

## 9. Referências oficiais

- skills.sh: https://www.skills.sh/
- Paperclip skills store: `docs/guides/agent-developer/skills-store.md`
- Writing a Skill: `docs/guides/agent-developer/writing-a-skill.md`
- Skills and Teams Catalog: `doc/skills-and-teams-catalog.md`
- CLI skills: `docs/cli/control-plane-commands.md` (seção Skills)
- API company skills: `docs/api/` (rotas `company-skills.ts`)

---

**Fim da skill.** Este protocolo é obrigatório para todos os agentes da NettosCorp que participem de descoberta, seleção ou atribuição de skills.
