#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
/**
 * Expo CLI normally writes expo-env.d.ts and .expo/types/router.d.ts on
 * `expo start`. Those files are gitignored but tsconfig includes them for
 * expo/types and typed routes. CI and fresh clones typecheck without running
 * Expo — create the stub and regenerate route types when missing/stale.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expoEnvPath = path.join(appRoot, "expo-env.d.ts");
const appDir = path.join(appRoot, "src/app");
const typesDir = path.join(appRoot, ".expo/types");
const routerTypesPath = path.join(typesDir, "router.d.ts");

if (!existsSync(expoEnvPath)) {
  writeFileSync(expoEnvPath, '/// <reference types="expo/types" />\n');
}

try {
  process.env.EXPO_ROUTER_APP_ROOT = appDir;
  const { requireContext } = require("expo-router/internal/testing");
  const {
    getTypedRoutesDeclarationFile,
  } = require("@expo/router-server/build/typed-routes/generate");
  const { EXPO_ROUTER_CTX_IGNORE } = require("expo-router/_ctx-shared");
  const ctx = requireContext(appDir, true, EXPO_ROUTER_CTX_IGNORE);
  const file = getTypedRoutesDeclarationFile(ctx, {});
  if (file) {
    mkdirSync(typesDir, { recursive: true });
    writeFileSync(routerTypesPath, file);
  }
} catch (error) {
  // Typed routes are best-effort; leave any existing router.d.ts in place.
  if (!existsSync(routerTypesPath)) {
    console.warn(
      "[ensure-expo-env] Could not regenerate typed routes:",
      error instanceof Error ? error.message : error,
    );
  }
}
