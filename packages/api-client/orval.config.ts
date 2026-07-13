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
      // Overwrite in place — wipe+rewrite races Metro's FileMap on Windows
      // ("Failed to get the SHA-1 for …/generated/…").
      clean: false,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: "./src/mutator.ts",
          name: "apiFetch",
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
