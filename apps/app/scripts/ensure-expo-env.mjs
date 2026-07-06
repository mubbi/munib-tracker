#!/usr/bin/env node
/**
 * Expo CLI normally writes expo-env.d.ts on first `expo start`. That file is
 * gitignored but tsconfig includes it for expo/types (web ViewStyle, Metro, etc.).
 * CI and fresh clones typecheck without running Expo — create the stub when missing.
 */
import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expoEnvPath = path.join(appRoot, "expo-env.d.ts");

if (!existsSync(expoEnvPath)) {
  writeFileSync(expoEnvPath, '/// <reference types="expo/types" />\n');
}
