FROM node:24-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN pnpm install --frozen-lockfile --filter backend
COPY backend backend
RUN pnpm --filter backend exec prisma generate \
  && pnpm --filter backend run build \
  && pnpm --filter backend deploy --prod /out

FROM base AS deploy
COPY --from=build --chown=node:node /out ./
COPY --from=build --chown=node:node /app/backend/dist ./dist
USER node
EXPOSE 3000
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && exec node dist/server.js"]
