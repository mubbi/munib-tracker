import path from "node:path";
import { reactConfig } from "@munib-tracker/vitest-config";
import { mergeConfig } from "vitest/config";

export default mergeConfig(reactConfig, {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    setupFiles: ["./src/setup.ts"],
  },
});
