import { OpenAPIHono } from "@hono/zod-openapi";

// Every router shares this hook, so an invalid request gets the same 400 response
// no matter which file its route lives in.
export const createRouter = () =>
  new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json({ error: "Invalid request", issues: result.error.issues }, 400);
      }
    },
  });
