---
paths:
  - "frontend/**"
---

# Frontend

- Call the backend only through the generated SDK in `src/api/generated`. No raw
  `fetch` to `/api`.
- If the SDK is missing a route or a field, change the backend and run
  `mise run contract`. Do not hand-write types for API responses.
- Use relative `/api/...` URLs. Vite proxies them in dev and nginx proxies them when
  deployed.
- Use arrow functions for components and handlers: `export const App = () => {}`.
