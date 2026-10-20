---
paths:
  - "backend/**"
---

# Backend

- Each feature is a folder in `src/modules/` with two files:
  - `routes.ts` is the contract: zod schemas and `createRoute` definitions, each with
    an `operationId` (it becomes the function name in the frontend client).
  - `index.ts` is the implementation: a typed handler per route
    (`const listMessagesHandler: RouteHandler<typeof listMessages>`) and one exported
    router, `createRouter().openapi(listMessages, listMessagesHandler)`.
- Add a `repository.ts` for a module's SQL only once its handlers have several queries.
- `src/app.ts` sets the `/api/v1` prefix and mounts each module's router with
  `app.route("/", router)`. Add one line there per new module.
- Define every route with zod schemas for its params, body and responses. The OpenAPI
  contract is built from these.
- Query the database with `prisma.$queryRaw` / `prisma.$executeRaw` tagged templates
  only. See "Queries" in `AGENTS.md`.
- Change tables only through `prisma/schema.prisma` and
  `mise run db:dev:migrate:generate <name>`.
- Read environment variables through `env` from `src/config/env.ts`, never `process.env`.
  Add new ones to its schema and to `.env.example`.
- Log with `logger` from `src/config/logger.ts`, never `console.log`.
