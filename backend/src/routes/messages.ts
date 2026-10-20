import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
import { prisma } from "../config/db.js";

const Message = z
  .object({
    id: z.number().int(),
    text: z.string(),
    createdAt: z.iso.datetime(),
  })
  .openapi("Message");

export const listMessages = createRoute({
  operationId: "listMessages",
  method: "get",
  path: "/messages",
  responses: {
    200: {
      description: "The 50 most recent messages",
      content: { "application/json": { schema: z.array(Message) } },
    },
  },
});

type MessageRow = { id: number; text: string; createdAt: Date };

export const listMessagesHandler: RouteHandler<typeof listMessages> = async (c) => {
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
