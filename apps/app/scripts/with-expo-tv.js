#!/usr/bin/env node
/**
 * Cross-platform EXPO_TV=1 wrapper (Windows cmd cannot use VAR=value prefix).
 *
 * Usage:
 *   node scripts/with-expo-tv.js expo run:ios
 *   node scripts/with-expo-tv.js node scripts/run-android.js
 */
const { spawnSync } = require("node:child_process");

const args = process.argv.slice(2);
if (!args.length) {
  console.error("Usage: node scripts/with-expo-tv.js <command> [args…]");
  process.exit(1);
}

const env = { ...process.env, EXPO_TV: "1" };
const [cmd, ...rest] = args;
const result = spawnSync(cmd, rest, {
  stdio: "inherit",
  env,
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
