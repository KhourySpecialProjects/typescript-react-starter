import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
import { prisma } from "../config/db.js";

export const getHealth = createRoute({
  operationId: "getHealth",
  method: "get",
  path: "/health",
  responses: {
    200: {
      description: "The API and database are reachable",
      content: { "application/json": { schema: z.object({ status: z.literal("ok") }) } },
    },
  },
});

export const getHealthHandler: RouteHandler<typeof getHealth> = async (c) => {
  await prisma.$queryRaw`SELECT 1`;
  return c.json({ status: "ok" as const }, 200);
};
