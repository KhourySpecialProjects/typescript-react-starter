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

## Generated files and the database

- Never edit `backend/src/generated/`, `backend/openapi.json` or
  `frontend/src/api/generated/`. Change the source and run `mise run contract`.
- Change the database by editing `backend/prisma/schema.prisma` and running
  `mise run db:dev:migrate <name>`. Never write or edit migration SQL by hand.

## Finishing

- Run `mise run check` and fix everything it reports.
