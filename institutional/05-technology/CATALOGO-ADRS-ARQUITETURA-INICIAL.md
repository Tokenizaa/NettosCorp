# Catálogo de ADRs de Arquitetura Inicial — NettosCorp

Versão: 1.0
Data: 14 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/NettosCorp/empresa/05-technology/CATALOGO-ADRS-ARQUITETURA-INICIAL.md
Status: APROVADO (reorganização documental; conteúdo das ADRs e de
        autoria do Software Architect)
Responsável: Technical Writer (CIA-007), com revisão do Software Architect

Este catálogo indexa os ADRs (Architecture Decision Records) de arquitetura
inicial da NettosCorp, de autoria do Software Architect. Os arquivos-fonte
eram mantidos em `/home/lg/workspace/NettosCorp/docs/`; como esses arquivos
não estavam mais presentes no disco no momento em que este catálogo foi
reconstruído, os artifacts individuais foram recriados a partir do registro
do catálogo (versão 1.1, marca "recuperação documental"). Os textos marcados
com `[a definir com o Software Architect]` são lacunas reconhecidas de
informação, não suposições.

Este catálogo é um índice documental; não substitui nem altera o conteúdo dos
ADRs.

## 1. ADRs do conjunto inicial

| ADR | Título | Status | Data | Autor | Resumo | Local |
|---|---|---|---|---|---|---|
| ADR-001 | Arquitetura Inicial da NettosCorp | Aprovada | 2026-11-09 | Software Architect | Bounded contexts (DCE-01 a DCE-09), padrões arquiteturais (monolito modular, hexagonal, multi-tenant por RLS + JWT, BFF, eventos, contratos canônicos + mappers), padrões técnicos, estrutura de pastas, portões de qualidade, integração com o Sistema de Gestão Corporativa e revisão preliminar dos projetos existentes. | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-001-Arquitetura-Inicial-NettosCorp.md` |
| ADR-002 | Linguagem e Runtime | Aprovada | 2026-11-09 | Software Architect | TypeScript strict (`strict: true`, `noUncheckedIndexedAccess`) para lógica e API; React 19 + TypeScript + Vite no frontend; Hono sobre Cloudflare Workers (ou Node equivalente) na API; Postgres/Supabase na camada de dados. | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-002-Linguagem-e-Runtime.md` |
| ADR-003 | Persistência: PostgreSQL / Supabase multi-tenant com RLS | Aprovada | 2026-11-09 | Software Architect | Banco PostgreSQL gerenciado via Supabase; uma base compartilhada multi-tenant; controle de acesso por policies de RLS filtradas a partir do papel resolvido do JWT; cliente com chave anônima, management via serviço de API sem acesso direto ao banco. | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-003-Persistencia.md` |
| ADR-004 | Autenticação e Autorização (JWT, rolagem, privilégio mínimo) | Aprovada | 2026-11-09 | Software Architect | JWT assinado com chave privada (RS/Ed), validado via chave pública na API; claims `sub`, `org`, `role`; papéis `beneficiary`, `operator`, `admin`, `external`; verificação sempre via claim do JWT, nunca por id de usuário. | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-004-Autenticacao.md` |
| ADR-005 | Infraestrutura e Deploy (Cloudflare Workers + Supabase + CI gate) | Aprovada | 2026-11-09 | Software Architect | API/borda em Cloudflare Workers; banco Supabase com migrações e RLS; frontend em Vite build estático; pipeline CI com typecheck, testes, build e smoke do worker; secretos no runtime, nunca no repositório nem em logs; migrações remotas e provisionamento em produção são portões autorizados ao fundador. | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-005-Infraestrutura.md` |
| ADR-006 | Estrutura de pastas, convenções de nomenclatura e testes | Aprovada | 2026-11-09 | Software Architect | Estrutura por repositório: `src/domain/`, `src/application/`, `src/interface/`, `src/infrastructure/`, `src/shared/`, `docs/`, `supabase/`, `scripts/`, `tests/`, `e2e-tests/`, `public/`. Domínio livre de framework; mappers explícitos; nomenclatura camelCode/PascalCase/UPPER_SNAKE_CASE; SQL `snake_case` singular; migrações `YYYYMMDDHHMMSS_` por DCE; contratos `feature.verb.VERSION`; portões: typecheck, teste, build, smoke. | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-006-Estrutura-e-Convecoes.md` |
| ADR-007 | Integração com o Sistema de Gestão Corporativa | Aprovada (com portões do fundador) | 2026-11-09 | Software Architect | Consumo via API publicada (BFF + serviços), nunca acesso direto ao banco; contratos canônicos versionados como contrato de integração; fluxos assíncronos por eventos no canal de integração; portões para dados reais, secretos, migração remota e deploy em produção. | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-007-Integracao-com-Gestao.md` |

## 2. Separação de esferas

- **Arquitetura da empresa (NettosCorp):** este catálogo e as ADR-001 a
  ADR-007 acima. Aplicam-se a todos os produtos da NettosCorp (DefesaI
  Saúde, Defesai-AdeusMultas, Plataforma Paralegal Digital e outros).
- **Arquitetura do produto DefesaI Saúde:** suas próprias ADR-0001 a ADR-0013
  vivem em
  `/home/lg/workspace/NettosCorp/NettosCorp/Projetos/DefesaI-Saude-app/docs/decisions/`
  e são regidas pelo `AGENTS.md` daquele repositório. Decisões de produto
  não substituem decisões de empresa; em caso de sobreposição, a ADR de
  empresa prevalece para padrões transversais e a de produto para escopo
  específico do DefesaI Saúde.

## 3. Regra de uso

- Não alterar decisão `Aprovada` silenciosamente; criar nova ADR ou registrar
  substituição (`superseded`).
- Implementações devem respeitar os contratos canônicos definidos nas ADRs.
- Decisões críticas (segurança, dados reais, deploy, portões) são escaladas ao
  fundador; decisões técnicas rotineiras são de autoria do Software
  Architect.

## 4. ADRs individuais

Os arquivos-fonte das ADRs estão neste diretório:

| ADR | Arquivo |
|---|---|
| ADR-001 | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-001-Arquitetura-Inicial-NettosCorp.md` |
| ADR-002 | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-002-Linguagem-e-Runtime.md` |
| ADR-003 | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-003-Persistencia.md` |
| ADR-004 | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-004-Autenticacao.md` |
| ADR-005 | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-005-Infraestrutura.md` |
| ADR-006 | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-006-Estrutura-e-Convecoes.md` |
| ADR-007 | `CATALOGO-ADRS-ARQUITETURA-INICIAL/ADR-007-Integracao-com-Gestao.md` |
