import { resolve } from "node:path";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
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
      "@": resolve(__dirname, "./src"),
    },
  },
});
