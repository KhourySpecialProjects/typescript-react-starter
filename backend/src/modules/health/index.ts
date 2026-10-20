import type { RouteHandler } from "@hono/zod-openapi";
import { createRouter } from "../../router.js";
import { getHealth } from "./routes.js";

const getHealthHandler: RouteHandler<typeof getHealth> = (c) => {
  return c.json({ status: "ok" }, 200);
};

export const health = createRouter().openapi(getHealth, getHealthHandler);
