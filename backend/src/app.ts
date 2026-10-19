import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { logger } from "./config/logger.js";
import { requestLogger } from "./middleware/logger.js";
import { getHealth, getHealthHandler } from "./routes/health.js";
import { listMessages, listMessagesHandler } from "./routes/messages.js";

export const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid request", issues: result.error.issues }, 400);
    }
  },
}).basePath("/api/v1");

app.use(requestLogger);

app.openapi(getHealth, getHealthHandler);
app.openapi(listMessages, listMessagesHandler);

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  logger.error({ err }, "unhandled error");
  return c.json({ error: "Internal server error" }, 500);
});
