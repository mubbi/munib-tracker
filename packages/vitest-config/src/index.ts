import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export const baseConfig = defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});

export const reactConfig = defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/*.{test,spec,feature.test}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "dist"],
  },
});
