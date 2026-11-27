import { ciReporting, NO_NETWORK_SETUP } from "@munib-tracker/vitest-config/ci";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    ...ciReporting,
    setupFiles: [NO_NETWORK_SETUP],
    environment: "node",
    include: ["src/**/*.{test,spec}.ts"],
  },
});
