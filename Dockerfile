# syntax=docker/dockerfile:1
# Imagem do monorepo NettosCorp (plataforma Paperclip).
# Base: node 22 + pnpm 9. Build via turbo (turbo run build).
#
# ACHADOS / PENDENTES (fundador):
# - workspaces 'cli' e 'server' declarados em pnpm-workspace.yaml NAO existem na raiz do repositorio.
# - Nenhum ponto de entrada de runtime unico esta definido; ajustar CMD para o servico alvo
#   (paperclip server, ui ou enterprise) antes de habilitar o deploy de producao.
# - Nao foi possivel validar `docker build` localmente: o daemon Docker nao esta rodando nesta
#   maquina (unix:///var/run/docker.sock inacessivel). Validar em CI ou com o daemon disponivel.
FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++
WORKDIR /app
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY ui ./ui
COPY enterprise ./enterprise
RUN pnpm install --frozen-lockfile

FROM deps AS build
RUN pnpm run build

FROM base AS run
WORKDIR /app
COPY --from=build /app /app
# TODO(fundador): ajustar CMD para o servico a containerizar.
# Exemplo (server): CMD ["node", "dist/server/index.js"]
CMD ["sh", "-c", "echo 'NettosCorp container. Defina CMD para o servico alvo (paperclip server / ui / enterprise).' && exit 0"]
EXPOSE 3000
