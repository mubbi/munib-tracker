import { defineConfig } from "vitest/config";

/** Windows `fs.rename` cannot replace an existing Vite SSR cache file (EPERM). */
const serializeOnWindows = process.platform === "win32";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // coverage.test.ts (content barrel) and terminology.test.ts (per-file imports)
    // otherwise transform the same modules in parallel and race the cache.
    ...(serializeOnWindows ? { fileParallelism: false, maxWorkers: 1 } : {}),
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "clover"],
      reportsDirectory: "./coverage",
    },
  },
});
