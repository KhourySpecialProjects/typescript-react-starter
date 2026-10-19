-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Message" ("text") VALUES
    ('Hello from the database'),
    ('These rows come from the first migration');

-- migrate:down
-- -- DropTable
-- DROP TABLE "public"."Message";
