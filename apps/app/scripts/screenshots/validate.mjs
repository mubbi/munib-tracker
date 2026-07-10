#!/usr/bin/env node
/**
 * Validate screenshot capture scripts without running emulators.
 *
 * Usage:
 *   pnpm screenshots:validate
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { APP_ROOT } from "./lib/config.mjs";
import { buildDemoStoragePairs } from "./lib/demo-data.mjs";
import { buildCaptureFlowYaml } from "./lib/maestro.mjs";
import { SCENES } from "./lib/scenes.mjs";
import { log, warn } from "./lib/shell.mjs";
import { parseRuntimeFilters, validateStructure } from "./lib/validate-core.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

function syntaxCheck(file) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  return { file, ok: result.status === 0, detail: result.stderr?.trim() };
}

function main() {
  const checks = [];

  for (const rel of [
    "capture-android.mjs",
    "capture-ios.mjs",
    "validate.mjs",
    "lib/config.mjs",
    "lib/app-locales.mjs",
    "lib/demo-data.mjs",
    "lib/db-keys.mjs",
    "lib/i18n.mjs",
    "lib/scenes.mjs",
    "lib/shell.mjs",
    "lib/maestro.mjs",
    "lib/run-maestro-batches.mjs",
    "lib/inject-storage-android.mjs",
    "lib/inject-storage-ios.mjs",
    "lib/validate-core.mjs",
    "lib/build-screenshot-apk.mjs",
  ]) {
    checks.push(syntaxCheck(path.join(ROOT, rel)));
  }

  const failedSyntax = checks.filter((c) => !c.ok);
  if (failedSyntax.length) {
    for (const f of failedSyntax) log(`syntax error: ${f.file}\n${f.detail}`);
    process.exit(1);
  }

  const validation = validateStructure();
  log(`Structure: ${validation.ok ? "OK" : "FAILED"}`);
  log(`Scenes: ${validation.sceneCount}`);
  log(`App locales (${validation.localeCount}): ${validation.locales.join(", ")}`);
  log(`Studio locales (${validation.studioLocaleCount}): ${validation.studioLocales.join(", ")}`);
  log(
    `Full native matrix (${validation.localeCount} locales × light/dark × ${validation.sceneCount} scenes): ${validation.matrixSize} PNGs`,
  );
  for (const w of validation.warnings) warn(w);
  for (const e of validation.errors) log(`error: ${e}`);

  const filters = parseRuntimeFilters();
  log(
    `Default filter slice: ${filters.locales.join(",")} × ${filters.themes.join(",")} × ${filters.scenes.length} scenes`,
  );

  const pairs = buildDemoStoragePairs({ locale: "en", theme: "dark" });
  log(`Demo storage keys: ${pairs.length}`);

  const sampleYaml = buildCaptureFlowYaml({
    platform: "android",
    locale: "en",
    scenes: SCENES.slice(0, 3),
    outputDir: path.join(APP_ROOT, "store-assets", "captures-native", "android", "en", "dark"),
  });
  if (!sampleYaml.includes("takeScreenshot")) {
    log("error: Maestro YAML generator did not produce takeScreenshot steps");
    process.exit(1);
  }
  log("Maestro YAML generator: OK");

  process.exit(validation.ok ? 0 : 1);
}

main();
