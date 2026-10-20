# TypeScript React starter

A three-container web app: a React frontend, a Hono API and a Postgres database. It
ships with one example feature (a list of messages) that shows a request going from
React to Hono to Postgres and back. Replace it with your own.

There are matching Python (FastAPI) and Java (Spring Boot) starters with the same API,
the same frontend and the same `mise` tasks.

| Part     | Stack                                                                          |
| -------- | ------------------------------------------------------------------------------ |
| Frontend | React, Vite, a client generated from the API contract by `@hey-api/openapi-ts` |
| Backend  | Hono with `@hono/zod-openapi`, Prisma, pino                                    |
| Database | Postgres 18                                                                    |
| Tooling  | mise, pnpm workspaces, oxlint, oxfmt, strict TypeScript, Docker Compose        |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the pieces connect.

## Layout

```
mise.toml               Tool versions and every task you will run
compose.yaml            The deployed stack: web, backend, db. Coolify reads this file.
compose.override.yaml   Local additions: published ports, a required .env
.env.example            Local settings. Copy it to .env.
backend/
  src/app.ts            The one router: middleware, route registration, error handling
  src/config/           Environment variables, logger and database client
  src/routes/           Route definitions and handlers, one file per resource
  src/middleware/       Request logging
  prisma/schema.prisma  Database tables. The source of truth for the schema.
  prisma/migrations/    Generated SQL migrations. Commit these.
  openapi.json          The API contract, generated from the routes. Commit it.
  scripts/openapi.ts    Writes backend/openapi.json
frontend/
  src/App.tsx           The page
  src/api/generated/    Client generated from the contract (not committed)
  nginx.conf            Deployed web server: serves the app and proxies /api
.agents/rules/          Extra rules for AI agents, per folder
AGENTS.md               Rules for agents and humans
```

## Getting started

You need [mise](https://mise.jdx.dev) and Docker.

```sh
mise install
cp .env.example .env
mise run setup:dev
mise run dev
```

Open <http://localhost:5173> and press the button. The API runs on
<http://localhost:3000/api/v1>.

`mise tasks` lists every task. The ones you will use most:

| Task                                      | What it does                                                    |
| ----------------------------------------- | --------------------------------------------------------------- |
| `mise run dev`                            | Start the db, then run the backend and frontend with hot reload |
| `mise run contract`                       | Regenerate `backend/openapi.json` and the frontend client       |
| `mise run db:dev:migrate:generate <name>` | Write a SQL migration from your changes to `schema.prisma`      |
| `mise run db:dev:migrate:up`              | Apply pending migrations                                        |
| `mise run db:dev:migrate:status`          | Show whether the database is missing migrations                 |
| `mise run db:dev:migrate:down`            | Roll back the latest migration                                  |
| `mise run db:dev:studio`                  | Open Prisma Studio on the dev database (:5555)                  |
| `mise run db:dev:psql`                    | Open psql in the database                                       |
| `mise run check`                          | Run what CI runs: format check, lint, typecheck, contract check |
| `mise run fmt:fix`                        | Format everything                                               |
| `mise run stack:dev:up`                   | Build and run all three containers, as deployed, on :8080       |

## The API contract

The backend's zod schemas are the source of truth. `mise run contract` does two things:

1. `contract:generate` writes `backend/openapi.json` from the routes in
   `backend/src/routes/`. Commit this file.
2. `contract:client` generates a typed client with zod validators in
   `frontend/src/api/generated/`. This folder is gitignored.

`mise run check` fails if `backend/openapi.json` is out of date with the routes.

To add a route, copy `backend/src/routes/messages.ts`, register it in
`backend/src/app.ts` with `app.openapi(route, handler)` and run `mise run contract`.
The frontend then has a new function named after the route's `operationId`.

## The database

`backend/prisma/schema.prisma` describes every table. Migrations are plain SQL that
Prisma generates from it.

1. Edit `backend/prisma/schema.prisma`.
2. Run `mise run db:dev:migrate:generate describe_your_change`. It writes the SQL to a
   new folder under `backend/prisma/migrations/`.
3. Read the SQL, then run `mise run db:dev:migrate:up`.
4. Commit the schema and the migration together.

Each `migration.sql` holds both directions. The top is the up SQL. The bottom, after
`-- migrate:down`, is the SQL that undoes it, commented out so Prisma skips it.
`mise run db:dev:migrate:down` runs that section for the latest migration.

After pulling a teammate's migration, `mise run db:dev:migrate:status` tells you
whether your database is behind, and `mise run db:dev:migrate:up` catches it up. The
backend container applies pending migrations every time it starts, so deployed
environments stay in sync on their own.

Queries are SQL too. Use `prisma.$queryRaw` with a tagged template, as
`backend/src/routes/messages.ts` does, instead of `findMany` and the rest of Prisma's
object API.

`mise run db:dev:studio` opens Prisma Studio on <http://localhost:5555>, already
connected to the dev database, to browse and edit rows. For raw SQL, use
`mise run db:dev:psql`.

`mise run db:dev:reset` wipes the local database and reapplies everything.

## Environment variables

`.env` holds your local values and is never committed. `.env.example` lists every
variable with values that work locally. mise loads `.env` for every task, and Docker
Compose reads it too. If port 5432 is taken, change `POSTGRES_PORT` and the port in
`DATABASE_URL`.

To add a variable, add it to `.env.example`, to the schema in `backend/src/config/env.ts`,
and to the `backend` service in `compose.yaml`. Read it as `env.YOUR_VARIABLE`.
Secrets belong in the backend only: anything the frontend uses ends up in the
browser.

## Deploying on Coolify

1. Create a resource from this repo with the **Docker Compose** build pack, base
   directory `/` and compose file `/compose.yaml`.
2. Give the `web` service a domain that includes its port, for example
   `https://myapp.example.com:8080`. Do not give `backend` or `db` a domain.
3. Deploy. Coolify generates `SERVICE_USER_POSTGRES` and `SERVICE_PASSWORD_POSTGRES`
   once and keeps them for that environment.

## Removing the example

1. Delete `backend/src/routes/messages.ts` and its `app.openapi` line in
   `backend/src/app.ts`.
2. Delete the `Message` model from `backend/prisma/schema.prisma`, run
   `mise run db:dev:migrate:generate remove_messages`, then
   `mise run db:dev:migrate:up`.
3. Replace `frontend/src/App.tsx`, then run `mise run contract`.
