# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📋 Visão Geral do Projeto

**BotWhats / WA Connect** — Plataforma completa de gestão WhatsApp Business com CRM, automações, campanhas, catálogo de produtos, chatbot IA e integração dual-provider (Meta Cloud API oficial + Baileys Web).

## 🏗️ Arquitetura

### Stack
- **Frontend**: React 19 + Vite 8 + TypeScript 7 + TailwindCSS 4
- **Backend**: Express + TypeScript (tsx) — single-file server em `server.ts`
- **Database**: In-memory SQLite-like store (`db.ts`) — persistência em arquivos JSON
- **Real-time**: Server-Sent Events (SSE) em `/api/events`
- **WhatsApp Providers**: 
  - `baileys` — Web/Multi-Device (QR Code)
  - `cloud_api` — Meta WhatsApp Business API oficial (WABA)

### Estrutura
```
BotWhats/
├── server.ts              # Express server + todos os endpoints REST + SSE
├── src/
│   ├── App.tsx            # App principal com state global e roteamento por tabs
│   ├── main.tsx           # Entry point React
│   ├── index.css          # TailwindCSS 4 imports
│   ├── components/        # 18 view components (Dashboard, Chat, Kanban, etc.)
│   ├── server/
│   │   ├── db.ts          # In-memory DB com JSON persistence (54KB)
│   │   ├── whatsapp-engine.ts  # Motor dual-provider + event bus + webhooks
│   │   └── ai-service.ts  # Google GenAI para sugestões de chatbot
│   ├── services/
│   │   └── api.ts         # Cliente API frontend (fetch wrappers)
│   └── types/
│       └── index.ts       # Tipos TypeScript compartilhados
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

## 🛠️ Comandos Principais

```bash
# Instalação
npm install

# Desenvolvimento (backend + frontend via Vite middleware)
npm run dev          # tsx server.ts (porta 3000)

# Produção
npm run build        # vite build
npm start            # tsx server.ts (serve dist/)

# Lint / Typecheck
npm run lint         # tsc --noEmit

# Preview build
npm run preview      # vite preview
```

### Variáveis de Ambiente (.env)
```bash
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=      # Para AI Copilot suggestions
```

## 📌 Convenções e Padrões

### 1. State Management (App.tsx)
- **Single source of truth**: Todo state global em `App.tsx` (useState + useEffect)
- **refreshAll()**: Recarrega todas as entidades via `Promise.all` de 14 chamadas API
- **SSE Live Updates**: `EventSource` em `/api/events` dispara `refreshAll()` on message
- **Modais globais**: `newInstanceModal`, `newLeadModal` no App root

### 2. API Client (src/services/api.ts)
- Wrapper `fetch` com base URL relativa (`/api`)
- Tipado com interfaces de `src/types/index.ts`
- Tratamento de erro básico + JSON parsing

### 3. Database (src/server/db.ts)
- **In-memory arrays** + persistência automática em `data/*.json`
- Entidades: Instances, Messages, Conversations, Contacts, Leads, Pipelines, Products, Templates, Flows, Campaigns, Automations, Webhooks, Users, ApiKeys, Logs, ChatbotConfig, Analytics
- Métodos CRUD + queries filtradas (getById, getByInstanceId, etc.)
- `broadcast()` via `eventBus` para SSE real-time

### 4. WhatsApp Engine (src/server/whatsapp-engine.ts)
- **Dual Provider**: `BaileysProvider` + `CloudApiProvider` implementam `WhatsAppProvider`
- `WhatsAppEngine` gerencia instâncias, conexões, mensagens, webhooks
- `EventBus` para SSE + webhook dispatch
- Simulação de mensagens incoming/outgoing para desenvolvimento

### 5. Componentes (src/components/)
- **Views**: Uma por tab (Dashboard, Chat, Kanban, Instances, Contacts, Catalog, Templates, Flows, Campaigns, Profile, Automations, Chatbot, Webhooks, SDK Docs, Users, Logs, Settings)
- **Layout.tsx**: Sidebar + header + tab routing
- **ChatView.tsx** (49KB): Maior componente — chat em tempo real, composer, anexos, templates, flows, produtos
- **KanbanView.tsx**: Drag-and-drop leads entre stages do pipeline

### 6. Tipos Compartilhados (src/types/index.ts)
Interfaces para todas as entidades + `ActiveTab` union type para routing

## ⚠️ Gotchas Importantes

1. **Single-file backend**: Todo Express server em `server.ts` (1100+ linhas) — rotas, middleware, SSE, Vite dev integration
2. **No real DB**: `db.ts` usa arrays em memória + JSON files — não usar em produção sem migração
3. **Dual provider logic**: Verificar `instance.provider` ('baileys' | 'cloud_api') em engine methods
4. **SSE connection**: Frontend reconecta automaticamente; backend faz heartbeat 25s
5. **QR Code Baileys**: `/api/instances/:id/qrcode` retorna base64 PNG
6. **Meta Cloud API setup**: `/api/instances/meta-setup` cria instância pré-configurada
7. **AI Service**: Requer `GEMINI_API_KEY` — fallback mock se não configurado

## 🔄 Fluxos Principais

### Nova Instância WhatsApp
1. Modal `newInstanceModal` → escolha provider (Cloud API / Baileys)
2. Cloud API: POST `/api/instances/meta-setup` (wabaId, phoneNumberId, accessToken)
3. Baileys: POST `/api/instances` + GET `/api/instances/:id/qrcode` → scan QR
3. Engine conecta → status `connected` → SSE broadcast

### Envio de Mensagem
1. ChatView composer → POST `/api/messages/send` (instanceId, to, text/type/mediaUrl)
2. Engine roteia para provider correto → simula envio → cria message no DB
3. SSE broadcast `message.sent` → UI atualiza via refreshAll()

### Lead no Kanban
1. Modal `newLeadModal` → POST `/api/leads` (title, stageId, pipelineId, contact, product)
2. Drag stage → POST `/api/leads/:id/move` (stageId) → broadcast `lead.moved`
3. Webhook dispatch `lead.created` / `lead.moved` se configurado

### Campanhas
1. CampaignsView → POST `/api/campaigns` (name, templateId, instanceId, audience)
2. POST `/api/campaigns/:id/start` → simula progresso assíncrono (3s) → completed

## 🧪 Testes e Qualidade

```bash
# Typecheck only (sem test runner configurado)
npm run lint

# Build verification
npm run build
```

## 📝 Definition of Done

- [ ] `npm run lint` passa (tsc --noEmit)
- [ ] `npm run build` gera `dist/` sem erros
- [ ] `npm run dev` inicia backend + frontend na porta 3000
- [ ] SSE conecta e recebe eventos (`/api/events`)
- [ ] CRUD básico funciona: Instances, Messages, Leads, Contacts, Products
- [ ] Dual provider: Cloud API setup + Baileys QR flow