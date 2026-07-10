#!/usr/bin/env node
/**
 * Capture native Android screenshots for Munib Tracker.
 *
 * Prerequisites:
 *   - Android SDK (adb, emulator)
 *   - Maestro CLI: https://maestro.mobile.dev
 *
 * Builds a self-contained release APK (embedded JS, temporarily debuggable)
 * so captures do not depend on Metro / Expo Dev Client.
 *
 * Usage (from repo root):
 *   pnpm screenshots:android
 *   LOCALES=en,ar THEMES=dark SCENES=home,tracker pnpm screenshots:android
 *   GROUPS=tabs,track pnpm screenshots:android
 *   VALIDATE_ONLY=1 pnpm screenshots:android
 *   SKIP_EMULATOR=1 SKIP_BUILD=1 pnpm screenshots:android
 *
 * Output:
 *   apps/app/store-assets/captures-native/android/<locale>/<theme>/<scene>.png
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAndInstallScreenshotApk, launchScreenshotApp } from "./lib/build-screenshot-apk.mjs";
import { APP_ID, APP_ROOT, TIMING, WORK_DIR } from "./lib/config.mjs";
import {
  injectDemoStorageAndroid,
  listAndroidDevices,
  resolveAdbBinary,
} from "./lib/inject-storage-android.mjs";
import {
  buildCaptureFlowYaml,
  maestroAvailable,
  runMaestro,
  writeFlowFile,
} from "./lib/maestro.mjs";
import { log, run, sleep, warn } from "./lib/shell.mjs";
import {
  parseRuntimeFilters,
  plannedOutputPaths,
  syncStudioAliases,
  validateStructure,
} from "./lib/validate-core.mjs";

const _SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Maestro writes takeScreenshot basenames under ~/.maestro/tests/<run>/ — copy into outDir. */
function collectMaestroScreenshots(outDir, sceneIds) {
  const testsRoot = path.join(os.homedir(), ".maestro", "tests");
  if (!fs.existsSync(testsRoot)) return 0;
  const runs = fs
    .readdirSync(testsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      name: d.name,
      mtime: fs.statSync(path.join(testsRoot, d.name)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime);

  let copied = 0;
  fs.mkdirSync(outDir, { recursive: true });
  for (const sceneId of sceneIds) {
    const dest = path.join(outDir, `${sceneId}.png`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      copied += 1;
      continue;
    }
    for (const run of runs.slice(0, 5)) {
      const candidate = path.join(testsRoot, run.name, `${sceneId}.png`);
      if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
        fs.copyFileSync(candidate, dest);
        copied += 1;
        break;
      }
    }
  }
  return copied;
}

async function main() {
  const validation = validateStructure();
  printValidation(validation);

  if (process.env.VALIDATE_ONLY === "1") {
    process.exit(validation.ok ? 0 : 1);
  }

  if (!validation.ok) {
    throw new Error("Validation failed — fix errors before capturing.");
  }

  const { locales, themes, scenes } = parseRuntimeFilters();
  log(
    `Android capture plan: ${locales.length} locale(s) × ${themes.length} theme(s) × ${scenes.length} scene(s) = ${locales.length * themes.length * scenes.length} PNGs`,
  );

  const adb = resolveAdbBinary();
  const packageId = APP_ID.android;

  if (process.env.SKIP_EMULATOR !== "1") {
    log("Starting Android emulator (Quick Boot)…");
    run("node", [path.join(APP_ROOT, "scripts", "android-emulator.js")], { cwd: APP_ROOT });
  }

  const devices = listAndroidDevices(adb);
  if (!devices.length) {
    throw new Error("No adb device in 'device' state. Start an emulator or connect hardware.");
  }
  const serial = process.env.ANDROID_SERIAL || devices[0];
  log(`Using device: ${serial}`);

  // Always prefer a self-contained APK (embedded JS). SKIP_BUILD reuses an existing APK.
  buildAndInstallScreenshotApk({
    adb,
    serial,
    skipBuild: process.env.SKIP_BUILD === "1",
  });

  fs.mkdirSync(WORK_DIR, { recursive: true });

  const useMaestro = maestroAvailable();
  if (!useMaestro) {
    warn("Maestro not installed — cannot automate navigation captures.");
  }

  let captured = 0;
  for (const locale of locales) {
    for (const theme of themes) {
      log(`\n── ${locale} / ${theme} ──`);
      const sessionDir = path.join(WORK_DIR, "android", locale, theme);
      fs.mkdirSync(sessionDir, { recursive: true });

      log("Seeding demo AsyncStorage…");
      injectDemoStorageAndroid({ adb, packageId, locale, theme, clearFirst: true });

      log("Launching screenshot APK (MainActivity, no Metro)…");
      launchScreenshotApp({ adb, packageId });
      sleep(TIMING.appBootMs);

      if (useMaestro) {
        const flowPath = path.join(sessionDir, "capture.yaml");
        const outDir = path.join(
          APP_ROOT,
          "store-assets",
          "captures-native",
          "android",
          locale,
          theme,
        );
        fs.mkdirSync(outDir, { recursive: true });
        const yaml = buildCaptureFlowYaml({
          platform: "android",
          locale,
          scenes,
          outputDir: outDir,
        });
        writeFlowFile(flowPath, yaml);
        log(`Running Maestro flow (${scenes.length} scenes)…`);
        const result = runMaestro(flowPath);
        if (!result.ok) {
          throw new Error(`Maestro capture failed:\n${result.stderr || result.stdout}`);
        }
        const collected = collectMaestroScreenshots(
          outDir,
          scenes.map((s) => s.id),
        );
        log(`Collected ${collected}/${scenes.length} PNG(s) → ${outDir}`);
        captured += collected;
      } else {
        warn("Skipping automated navigation — install Maestro to capture all scenes.");
      }

      const aliases = syncStudioAliases("android", locale, theme);
      if (aliases.length) log(`Synced ${aliases.length} screenshot-studio alias(es).`);
    }
  }

  log(
    `\nDone. Planned ${plannedOutputPaths("android", locales, themes, scenes).length} files under store-assets/captures-native/android/`,
  );
  log(`Captured via Maestro: ${captured} scene(s).`);
}

function printValidation(validation) {
  log(`Scenes: ${validation.sceneCount} · Full matrix: ${validation.matrixSize} PNGs`);
  for (const w of validation.warnings) warn(w);
  for (const e of validation.errors) log(`error: ${e}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
