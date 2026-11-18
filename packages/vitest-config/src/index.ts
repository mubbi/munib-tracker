import { ciReporting } from "@munib-tracker/vitest-config/ci";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export const baseConfig = defineConfig({
  test: {
    ...ciReporting,
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "clover"],
      reportsDirectory: "./coverage",
      // Shared test helpers/fixtures are not product code.
      exclude: ["**/test-support/**"],
    },
  },
});

export const reactConfig = defineConfig({
  plugins: [react()],
  test: {
    ...ciReporting,
    globals: true,
    environment: "jsdom",
    include: ["**/*.{test,spec,feature.test}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "clover"],
      reportsDirectory: "./coverage",
      // Shared test helpers/fixtures are not product code.
      exclude: ["**/test-support/**"],
    },
  },
});
