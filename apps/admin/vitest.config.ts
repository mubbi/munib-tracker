import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["lib/**/*.test.ts", "lib/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "clover"],
      reportsDirectory: "./coverage",
      include: ["lib/**/*.ts"],
      exclude: [
        "lib/**/*.test.ts",
        "lib/**/*.spec.ts",
        // Server actions / Drizzle queries need DB integration tests.
        "lib/actions/**",
        "lib/queries/**",
        "lib/db.ts",
        "lib/db-probe.ts",
        "lib/audit.ts",
        "lib/env.ts",
        "lib/platform.ts",
        "lib/app-versions.ts",
        "lib/filter-options.ts",
        "lib/redis/**",
        // OAuth + Google + session cookie stack — covered by manual/staging checks.
        "lib/auth/**",
        // Broadcast delivery pipeline (push/DB fan-out) — integration territory.
        "lib/notifications/broadcastAudience.ts",
        "lib/notifications/broadcastCompletion.ts",
        "lib/notifications/broadcastConstants.ts",
        "lib/notifications/broadcastCron.ts",
        "lib/notifications/broadcastFilterOptions.ts",
        "lib/notifications/broadcastFilters.ts",
        "lib/notifications/broadcastInAppWriter.ts",
        "lib/notifications/broadcastProcessor.ts",
        "lib/notifications/broadcastPushLoader.ts",
        "lib/notifications/broadcastRouteData.ts",
        "lib/notifications/bulkBroadcast.ts",
        "lib/notifications/pushDelivery.ts",
        "lib/cron/runProcessBroadcastsCron.ts",
      ],
    },
  },
});
