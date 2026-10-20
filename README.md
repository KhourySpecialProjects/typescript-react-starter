# TypeScript React starter

React, Hono and Postgres. `mise tasks` lists every task.

## Install mise

```sh
curl https://mise.run | sh
```

Then follow the printed step to activate it in your shell. See
<https://mise.jdx.dev/getting-started.html> for other installers. You also need
Docker.

## Set up

```sh
mise install
cp .env.example .env
mise run setup
```

## Run

```sh
mise run dev
```

Open <http://localhost:5173>. The API is on <http://localhost:3000/api/v1>.

## Migrations

Tables are defined in `backend/prisma/schema.prisma`. Change them there, then generate a migration.

```sh
mise run db:dev:migrate:generate add_something   # write SQL from your model changes
mise run db:dev:migrate:up                       # apply pending migrations
mise run db:dev:migrate:status                   # is the database behind?
mise run db:dev:migrate:down                     # undo the latest migration
```

Read the generated SQL before committing it.

`mise run db:dev:studio` opens Prisma Studio on <http://localhost:5555>.
