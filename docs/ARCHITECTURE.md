# Architecture

## Local development

`mise run dev` runs only Postgres in Docker. The backend and frontend run on your
machine so they reload instantly.

```
browser ──> Vite :5173 ──/api──> Hono :3000 ──> Postgres :5432 (Docker)
```

The frontend always calls relative URLs like `/api/v1/messages`. Vite forwards anything
under `/api` to the backend (see `frontend/vite.config.ts`), so the browser only ever
talks to one origin and there is no CORS to configure.

## Deployed

`compose.yaml` runs three containers. Only `web` is reachable from the internet.

```
browser ──> Coolify proxy (HTTPS) ──> web (nginx :8080) ──/api──> backend :3000 ──> db
```

`web` is nginx serving the built frontend. `frontend/nginx.conf` does two things:

- Requests under `/api/` are forwarded to the `backend` container. This is the same
  job Vite's proxy does locally, so the frontend code does not change between the two.
- Every other path that is not a file falls back to `index.html`, so client-side
  routes still load when you refresh the page.

The containers start in order once each health check passes: `db`, then `backend`
(which applies migrations before it listens), then `web`.

`mise run stack:dev:up` builds and runs this same setup on your machine at
<http://localhost:8080>. Use it to check the deploy build before pushing.
