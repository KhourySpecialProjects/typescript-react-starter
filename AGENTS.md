# Working in this repo

Rules for anyone changing code here, human or agent. Before editing `backend/` or
`frontend/`, also read the matching file in `.agents/rules/`.

## Before you start

- Read `README.md` and the code you are about to change.
- Make the smallest change that does the job. No extra abstractions, dependencies or
  config the task does not need.
- Follow the patterns already in the repo before inventing new ones.

## Writing code

- Clear names over comments. Only comment what a reader would otherwise get wrong.
- Guard clauses and early returns instead of nested `if`s.
- Keep functions short and focused on one thing.
- Delete dead code and commented-out code. Git remembers it.
- Validate untrusted input once, with zod, where it enters the system. Trust it after that.
- Write modern TypeScript: arrow functions (`const load = async () => {}`), `type`
  instead of `interface`, no `enum` or `namespace`. oxlint enforces the first two.

## The database

The Prisma schema in `backend/prisma/schema.prisma` is the source of truth for every
table. Change the database only this way:

1. Edit `schema.prisma`.
2. Run `mise run db:dev:migrate:generate <name>`. It writes the SQL for your change to
   a new folder under `backend/prisma/migrations/`.
3. Read the generated SQL, then run `mise run db:dev:migrate:up`.
4. `mise run db:dev:migrate:status` shows whether the database is missing migrations.

Never write schema SQL by hand and never edit a migration that is already on `main`.
The only SQL you add to a migration is seed data.

## Queries

Every query must read as SQL. Use `prisma.$queryRaw` and `prisma.$executeRaw` with
tagged templates, which turn `${value}` into a bound parameter:

```ts
const rows = await prisma.$queryRaw<MessageRow[]>`
  SELECT id, text FROM messages WHERE id = ${id}
`;
```

- Never use Prisma's object query API: `findMany`, `findUnique`, `findFirst`,
  `create`, `update`, `upsert`, `delete` and friends.
- Never build SQL strings yourself or use `$queryRawUnsafe` / `$executeRawUnsafe`.
- Alias snake_case columns to the camelCase names the API returns
  (`created_at AS "createdAt"`).

## The API contract

The zod schemas on each route are the source of truth for the API. `backend/openapi.json`
is generated from them and committed. `frontend/src/api/generated/` is generated from
that file and gitignored. Never edit either by hand. After changing a route, run
`mise run contract` and commit `backend/openapi.json`.

## Finishing

- Run `mise run check` and fix everything it reports.
