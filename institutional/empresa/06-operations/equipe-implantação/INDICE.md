# ÍNDICE — EQUIPE DE IMPLANTAÇÃO DA NETTOSCORP

Versao: 1.1
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/06-operations/equipe-implantação/

Este índice organiza os 8 agentes da equipe temporária de implantação da NettosCorp, autorizada pelo fundador em 07/11/2026 e efetivamente ativada no Paperclip.

---

## 1. Empresa no Paperclip

| Campo | Valor |
|-------|-------|
| Nome | NettosCorp |
| ID | da110a22-ca31-412d-be28-5caddcabb801 |
| Status | active |
| Orçamento mensal | 0 centavos (provisório) |
| Aprovação de novos agentes | Não exigida |
| Criado em | 2026-11-07T06:56:32.779Z |

Servidor Paperclip: http://127.0.0.1:3100 (modo local_trusted, porta 3100)

---

## 2. Composição da Equipe — 8 Agentes Ativados

| # | Função | ID no Paperclip | Perfil Base | Departamento | Status | Lifecycle | Issue Ativa |
|---|--------|-----------------|-------------|--------------|--------|-----------|-------------|
| 1 | Orquestrador Global | f17a8bf5-4631-4add-870b-6286eaecba59 | agents-orchestrator | Direção Executiva | idle | ready | 28348f41-25d9-4a67-8e02-f2bef3e0d67e |
| 2 | Project Manager Senior | dd81019c-0ffa-4115-a555-c699399b4323 | project-manager-senior | Gestão de Projetos | idle | ready | 60abb557-4dae-44eb-ac2a-97fc33e1097f |
| 3 | Software Architect | 0d8d1c17-eb14-4cc6-a2d9-7f79fc88bacd | engineering-software-architect | Tecnologia | idle | ready | c445b347-e9ba-4aa1-9519-710a7ae48560 |
| 4 | Backend Architect | df988cdf-e894-47c7-b34b-296f8f2960eb | engineering-backend-architect | Tecnologia | idle | ready | 3d21a5ad-02fd-4b0d-bbf9-2c803a1fb755 |
| 5 | Frontend Developer | a8088f13-4573-43f8-9654-be716218e262 | engineering-frontend-developer | Tecnologia | idle | ready | a4ef3fff-a0ff-44f7-b1f1-4d713e0e0cc8 |
| 6 | DevOps Automator | 12be1a99-84af-45d5-b90f-fd236a6773f7 | engineering-devops-automator | Tecnologia | idle | ready | 3c0bc201-0923-4179-8ea6-f92814cb7c4e |
| 7 | Technical Writer | 1b037f76-530d-47bf-988b-66f41a8d2463 | engineering-technical-writer | Tecnologia (compartilhado) | idle | ready | 5df279db-b11f-4687-893e-830710a391cc |
| 8 | QA Engineer | 708497eb-d506-41c4-99ba-a059f2b41096 | testing-test-automation-engineer | Tecnologia | idle | ready | b4f1ac11-a91b-4282-b935-7b0094c96843 |

Todos os 8 agentes estão com lifecycle **ready** e status **idle** — operacionais e aguardando tarefas.

---

## 3. Tarefas Distribuídas (em execução)

| Agente | Issue ID | Título | Status |
|--------|----------|--------|--------|
| Orquestrador Global | 28348f41-25d9-4a67-8e02-f2bef3e0d67e | Mapear projetos existentes e supervisores locais | in_progress |
| Project Manager Senior | 60abb557-4dae-44eb-ac2a-97fc33e1097f | Converter Roadmap Corporativo em lista de tarefas detalhadas | in_progress |
| Software Architect | c445b347-e9ba-4aa1-9519-710a7ae48560 | Criar ADR-001: Arquitetura inicial da NettosCorp | in_progress |
| Backend Architect | 3d21a5ad-02fd-4b0d-bbf9-2c803a1fb755 | Definir esquema inicial do banco de dados | in_progress |
| Frontend Developer | a4ef3fff-a0ff-44f7-b1f1-4d713e0e0cc8 | Criar design system base da NettosCorp | in_progress |
| DevOps Automator | 3c0bc201-0923-4179-8ea6-f92814cb7c4e | Configurar repositório Git principal com branch protection | in_progress |
| Technical Writer | 5df279db-b11f-4687-893e-830710a391cc | Criar README institucional da NettosCorp | in_progress |
| QA Engineer | b4f1ac11-a91b-4282-b935-7b0094c96843 | Configurar Playwright com fixtures de autenticação via API | in_progress |

---

## 4. Perfis Detalhados

Cada agente tem um perfil detalhado em `perfis/<nome>.md` contendo:

- Missão e responsabilidades principais
- Limites de autoridade
- Relações de trabalho (reporta, coordena, solicita)
- Instruções baseadas no catálogo Agency Agents
- Primeiras tarefas
- Configuração Paperclip (YAML)

---

## 5. Configurações Paperclip (YAML)

Cada agente tem um arquivo de configuração YAML em `configuracoes/<nome>.yaml` no formato `paperclip/v1` com:

- Identidade (nome, role, título, ícone)
- Relacionamento hierárquico (reportsTo)
- Adaptador (adapterType: codex_local, adapterConfig com cwd e model)
- Runtime (heartbeat enabled, interval 300s)
- Orçamento (budgetMonthlyCents: 0 — provisório)
- Instruções (modo: managed, entryFile: AGENTS.md)
- Skills (paperclip)
- Ferramentas (perfis de engineering ou project-management)
- Permissões (trustBoundary com projectIds vazios)

**Nota:** O campo `cwd` de cada agente foi atualizado para `/home/lg/.hermes/cache/scratch/nettoscorp/<departamento>/` pois o diretório `/workspace/nettoscorp/` não estava acessível.

---

## 6. Relações de Trabalho

```
FUNDADOR (Netto Farias)
  │
  ├── CONSELHEIRO — estratégia e direção técnica
  │
  └── HERMES (Chefe de Gabinete Executivo)
        │
        ├── ORQUESTRADOR GLOBAL (reporta admin. a Hermes)
        │     ├── Coordena funcionalmente: todos os 7 especialistas
        │     └── Solicita atualizações a: supervisores locais
        │
        ├── DIRETOR DE TECNOLOGIA (vago — responde ao fundador)
        │     ├── Software Architect
        │     ├── Backend Architect
        │     ├── Frontend Developer
        │     ├── DevOps Automator
        │     ├── Technical Writer (compartilhado)
        │     └── QA Engineer
        │
        └── DIRETOR DE GESTÃO DE PROJETOS (vago — responde ao fundador)
              └── Project Manager Senior
```

---

## 7. Limites Respeitados

- ✅ Modelo de Autoridade v1.2 NÃO reaberto (já homologado pelo fundador em 07/11/2026)
- ✅ 8 agentes criados e persistidos no Paperclip com IDs reais
- ✅ Agentes executando tarefas reais (8 issues em status in_progress)
- ✅ Nenhum departamento cadastrado no Paperclip (apenas documentação)
- ✅ Nenhum código de projeto alterado
- ✅ Orçamento mensal zero (provisório, aguarda definição do fundador)
- ✅ Regime temporário de implantação (não efetivação permanente)
- ✅ Hermes permanece como Chefe de Gabinete Executivo, não como executor universal

---

## 8. Critérios de Efetivação — ATINGIDOS

Um agente é considerado efetivamente contratado quando:

1. ✅ Seu cadastro é criado no Paperclip — 8/8 criados
2. ✅ Seu adaptador está configurado e funcional — 8/8 com lifecycle ready
3. ✅ Ele consegue executar trabalho real através do adaptador configurado — 8/8 com issues em execução

---

## 9. Recuperação

Empresa no Paperclip: `da110a22-ca31-412d-be28-5caddcabb801`
Servidor: http://127.0.0.1:3100
Perfis: `/home/lg/workspace/NettosCorp/empresa/06-operations/equipe-implantação/perfis/`
Configurações: `/home/lg/workspace/NettosCorp/empresa/06-operations/equipe-implantação/configuracoes/`
Tarefas: `/home/lg/workspace/NettosCorp/empresa/06-operations/equipe-implantação/tarefas-iniciais/`
Issues distribuídas: `/home/lg/workspace/NettosCorp/empresa/06-operations/equipe-implantação/tarefas-distribuidas.json`
Agentes criados: `/home/lg/workspace/NettosCorp/empresa/06-operations/equipe-implantação/agentes-criados.json`
Agentes configurados: `/home/lg/workspace/NettosCorp/empresa/06-operations/equipe-implantação/agentes-configurados.json`

---

## 10. Próximos Passos

1. Acompanhar a execução das 8 tarefas iniciais através dos agentes
2. Verificar entregas de cada especialista
3. Avaliar quais posições devem se tornar permanentes conforme definido pelo fundador
4. Orçamento mensal (`budgetMonthlyCents`) ainda não definido — aguarda decisão do fundador
5. Departamentos de Qualidade e Segurança da Informação permanecem como estruturas futuras (médio prazo)