# Protocolo Obrigatório — Descoberta de Skills via skills.sh (NettosCorp)

Este documento torna o skills.sh uma fonte oficial e obrigatória de descoberta de skills para a NettosCorp.

---

## Ordem obrigatória de consulta

1. Biblioteca interna NettosCorp (company library)
2. Catálogo oficial do Paperclip
3. **skills.sh** (fonte obrigatória a partir desta skill)
4. Repositório original da skill candidata
5. Auditoria de segurança (skills.sh)
6. Avaliação de aderência
7. Decisão (APROVADA / REVISÃO / REJEITADA)
8. Integração e teste no runtime

---

## Comandos de referência

```sh
# Buscar skills no skills.sh
npx skills find "<especialidade>" --json

# Navegar catálogo Paperclip
pnpm paperclipai skills browse
pnpm paperclipai skills search "<query>" --json
pnpm paperclipai skills inspect <catalogRef>

# Instalar na empresa
pnpm paperclipai skills install <catalogRef> --company-id <id>
pnpm paperclipai skills import ./caminho/da/skill --company-id <id>

# Atribuir ao agente
pnpm paperclipai skills agent sync <agent-id> --skill <skill-ref> --mode add --company-id <id>

# Verificar no runtime
curl -s "http://127.0.0.1:3100/api/agents/<agent-id>/skills"
```

---

## Regras críticas

- Popularidade no skills.sh != qualidade nem segurança.
- Ausência de auditoria no skills.sh != aprovação de segurança.
- Nunca instalar automaticamente por ranking.
- Nunca conceder permissões adicionais apenas para viabilizar uma skill.
- Registrar toda decisão (inclusive rejeições) com justificativa.

---

## Classificações válidas

| Classificação | Ação |
|---------------|------|
| APROVADA | Instalar na company library e atribuir ao agente |
| REVISÃO | Apresentar ao fundador/Hermes antes de instalar |
| REJEITADA | Não instalar; registrar motivo |

---

## Referência

- skills.sh: https://www.skills.sh/
- Paperclip skills store: docs/guides/agent-developer/skills-store.md
- Writing a Skill: docs/guides/agent-developer/writing-a-skill.md
