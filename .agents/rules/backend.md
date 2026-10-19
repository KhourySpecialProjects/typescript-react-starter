---
paths:
  - "backend/**"
---

# Backend

- `src/app.ts` holds the only router. It sets the `/api/v1` prefix and registers every
  route with `app.openapi(route, handler)`.
- A file in `src/routes/` exports route definitions and their handlers. It never
  creates its own router.
- Define every route with `createRoute` and zod schemas for its params, body and
  responses. The OpenAPI contract is built from these.
- Read environment variables through `env` from `src/config/env.ts`, never `process.env`.
  Add new ones to its schema and to `.env.example`.
- Log with `logger` from `src/config/logger.ts`, never `console.log`.
