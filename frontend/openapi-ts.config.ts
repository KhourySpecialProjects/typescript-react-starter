import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../backend/openapi.json",
  output: "src/api/generated",
  plugins: ["@hey-api/client-fetch", "zod", { name: "@hey-api/sdk", validator: true }],
});
