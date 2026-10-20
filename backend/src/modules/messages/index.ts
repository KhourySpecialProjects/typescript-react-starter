import type { RouteHandler } from "@hono/zod-openapi";
import { prisma } from "../../config/db.js";
import { createRouter } from "../../router.js";
import { listMessages } from "./routes.js";

type MessageRow = { id: number; text: string; createdAt: Date };

const listMessagesHandler: RouteHandler<typeof listMessages> = async (c) => {
  const rows = await prisma.$queryRaw<MessageRow[]>`
    SELECT id, text, created_at AS "createdAt"
    FROM messages
    ORDER BY created_at DESC, id DESC
    LIMIT 50
  `;
  return c.json(
    rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })),
    200,
  );
};

export const messages = createRouter().openapi(listMessages, listMessagesHandler);
