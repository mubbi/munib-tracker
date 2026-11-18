#!/usr/bin/env node
/**
 * Print Android signing report via Gradle (parity with iOS signing report).
 */
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const androidDir = path.join(__dirname, "..", "android");
// Absolute path: cmd.exe skips the current directory when
// NoDefaultCurrentDirectoryInExePath is set (hardened shells/CI), so a bare
// `gradlew.bat` is "not recognized". Quoted because Windows spawns via the shell.
const gradlew =
  process.platform === "win32"
    ? `"${path.join(androidDir, "gradlew.bat")}"`
    : path.join(androidDir, "gradlew");

const fs = require("node:fs");
if (!fs.existsSync(androidDir)) {
  console.error(
    "\nMissing apps/app/android/ — generate the native project first:\n" +
      "  pnpm prebuild:app:android\n",
  );
  process.exit(1);
}

console.log("\n--- Android signing report (Gradle signingReport) ---\n");

const result = spawnSync(gradlew, ["signingReport"], {
  cwd: androidDir,
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
