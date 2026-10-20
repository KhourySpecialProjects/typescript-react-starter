import { createMiddleware } from "hono/factory";
import { logger } from "../config/logger.js";

const levelFor = (status: number) => {
  if (status >= 500) return "error";
  if (status >= 400) return "warn";
  return "info";
};

export const requestLogger = createMiddleware(async (c, next) => {
  const start = performance.now();
  await next();

  const { status } = c.res;

  // no logs for healthchecks to reduce unnecessary noise
  if (c.req.path === "/api/v1/health" && status < 400) return;

  const durationMs = Math.round(performance.now() - start);
  logger[levelFor(status)](`${c.req.method} ${c.req.path} ${status} ${durationMs}ms`);
});
