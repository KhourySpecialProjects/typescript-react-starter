import { createRoute, z } from "@hono/zod-openapi";

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
