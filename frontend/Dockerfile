FROM node:24-slim AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN pnpm install --frozen-lockfile
COPY backend backend
COPY frontend frontend
RUN pnpm --filter backend exec prisma generate \
  && pnpm --filter backend exec tsx scripts/openapi.ts \
  && pnpm --filter frontend exec openapi-ts \
  && pnpm --filter frontend run build

FROM nginxinc/nginx-unprivileged:1.30-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 8080
