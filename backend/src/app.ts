import { HTTPException } from "hono/http-exception";
import { logger } from "./config/logger.js";
import { requestLogger } from "./middleware/logger.js";
import { createRouter } from "./router.js";
import { health } from "./modules/health/index.js";
import { messages } from "./modules/messages/index.js";

export const app = createRouter().basePath("/api/v1");

app.use(requestLogger);

// One line per module in modules/.
app.route("/", health);
app.route("/", messages);

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  logger.error({ err }, "unhandled error");
  return c.json({ error: "Internal server error" }, 500);
});
