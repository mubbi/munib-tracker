import { resolve } from "node:path";
import { ciReporting, NO_NETWORK_SETUP } from "@munib-tracker/vitest-config/ci";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    ...ciReporting,
    setupFiles: [NO_NETWORK_SETUP],
    globals: true,
    root: "./",
    include: ["src/**/*.spec.ts"],
    environment: "node",
    env: {
      DATABASE_TYPE: "sqlite",
      NODE_ENV: "test",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "clover"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.spec.ts",
        "src/test-support/**",
        "src/main.ts",
        "src/**/*.module.ts",
        "src/database/migrations/**",
        "src/database/data-source.ts",
        "src/vercel-handler.ts",
        "src/create-app.ts",
      ],
    },
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
});
