import path from "node:path";
import { reactConfig } from "@munib-tracker/vitest-config";
import { mergeConfig } from "vitest/config";

export default mergeConfig(reactConfig, {
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    setupFiles: ["./src/setup.ts"],
    // Full-page feature tests render many sections and can exceed 5s under turbo parallelism.
    testTimeout: 15_000,
    // next-intl's ESM build imports `next/navigation` without an extension,
    // which Node's resolver rejects; inlining lets Vite resolve it.
    server: { deps: { inline: ["next-intl"] } },
  },
});
