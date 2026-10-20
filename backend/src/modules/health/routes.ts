import { createRoute, z } from "@hono/zod-openapi";

const Health = z.object({ status: z.literal("ok") }).openapi("Health");

export const getHealth = createRoute({
  operationId: "getHealth",
  method: "get",
  path: "/health",
  responses: {
    200: {
      description: "The API is reachable",
      content: { "application/json": { schema: Health } },
    },
  },
});
