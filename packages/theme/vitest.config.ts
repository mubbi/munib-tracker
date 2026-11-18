import { ciReporting } from "@munib-tracker/vitest-config/ci";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    ...ciReporting,
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "clover"],
      reportsDirectory: "./coverage",
      exclude: ["**/test-support/**"],
    },
  },
});
