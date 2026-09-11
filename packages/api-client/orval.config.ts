import { defineConfig } from "orval";

export default defineConfig({
  munibApi: {
    input: {
      target: "../api-contract/openapi.json",
    },
    output: {
      mode: "tags-split",
      target: "./src/generated/endpoints",
      schemas: "./src/generated/models",
      client: "react-query",
      // Keep the axios-style mutator argument (`{ url, method, ... }`) so
      // `apiFetch` and hand-written callers stay compatible after Orval 8.
      httpClient: "axios",
      // Overwrite in place — wipe+rewrite races Metro's FileMap on Windows
      // ("Failed to get the SHA-1 for …/generated/…").
      clean: false,
      override: {
        mutator: {
          path: "./src/mutator.ts",
          name: "apiFetch",
        },
      },
    },
  },
});
