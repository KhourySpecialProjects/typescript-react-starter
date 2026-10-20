-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

INSERT INTO "messages" ("text") VALUES
    ('Hello from the database'),
    ('These rows come from the first migration');

-- migrate:down
-- -- DropTable
-- DROP TABLE "public"."messages";
