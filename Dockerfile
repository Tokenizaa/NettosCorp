# syntax=docker/dockerfile:1
# Imagem NettosCorp — Paperclip no Render (plano Free, US$ 0).
# Contexto de build: raiz do repositorio. O codigo do Paperclip vive em paperclip/.
# Build: pnpm workspace do paperclip/ + servidor @paperclipai/server.
# Start: scripts/render-start.sh (Paperclip API na porta $PORT).
#
# Causa corrigida: o Dockerfile anterior copiava packages/, ui/ e enterprise/
# da raiz e rodava pnpm install --frozen-lockfile no lockfile da raiz, que nao
# contem as dependencias de enterprise/ (ERR_PNPM_OUTDATED_LOCKFILE).
# Agora usa o workspace e o lockfile proprio de paperclip/, que ja registra
# @paperclipai/server.

FROM node:24-alpine AS base
RUN apk add --no-cache python3 make g++
WORKDIR /app
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

FROM base AS deps
WORKDIR /app
# Copia apenas o workspace do Paperclip (lockfile proprio).
COPY paperclip/package.json paperclip/pnpm-workspace.yaml paperclip/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
WORKDIR /app
COPY paperclip/packages ./packages
COPY paperclip/server ./server
COPY paperclip/ui ./ui
COPY paperclip/cli ./cli
COPY paperclip/scripts ./scripts
COPY paperclip/patches ./patches
RUN pnpm --filter @paperclipai/server build

FROM base AS run
WORKDIR /app
COPY --from=build /app /app
# Porta injetada pelo Render via variavel de ambiente PORT.
EXPOSE 10000
CMD ["bash", "scripts/render-start.sh"]
