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
      clean: true,
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
