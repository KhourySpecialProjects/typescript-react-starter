import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { prisma } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  logger.info(`listening on http://localhost:${info.port}`);
});

function shutdown() {
  server.close(() => void prisma.$disconnect());
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
