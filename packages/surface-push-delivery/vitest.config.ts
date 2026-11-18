import { ciReporting } from "@munib-tracker/vitest-config/ci";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    ...ciReporting,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
