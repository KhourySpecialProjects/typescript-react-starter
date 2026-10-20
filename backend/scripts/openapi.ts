import { writeFile } from "node:fs/promises";

// Importing the app validates the environment, but building the spec never connects
// to the database, so a placeholder lets this run in CI and Docker builds.
process.env.DATABASE_URL ??= "postgresql://localhost/placeholder";
const { app } = await import("../src/app.js");

const document = app.getOpenAPI31Document({
  openapi: "3.1.0",
  info: { title: "API", version: "1.0.0" },
});

await writeFile(
  new URL("../openapi.json", import.meta.url),
  `${JSON.stringify(document, null, 2)}\n`,
);
