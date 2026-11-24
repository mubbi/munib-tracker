import { resolve } from "node:path";
import { NO_NETWORK_SETUP } from "@munib-tracker/vitest-config/ci";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    // Loopback stays open: supertest drives the in-process Nest server.
    setupFiles: [NO_NETWORK_SETUP],
    root: "./",
    include: ["test/**/*.e2e-spec.ts"],
    environment: "node",
    env: {
      DATABASE_TYPE: "sqlite",
      NODE_ENV: "test",
    },
    hookTimeout: 30_000,
  },
  plugins: [swc.vite()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
});
