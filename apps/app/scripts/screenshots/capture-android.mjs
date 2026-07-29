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
 *   LOCALES=en,ar,ur THEMES=dark SCENES=home,tracker pnpm screenshots:android
 *   LOCALES=all THEMES=all  # default: every AppLocale × light/dark
 *   GROUPS=tabs,track pnpm screenshots:android
 *   VALIDATE_ONLY=1 pnpm screenshots:android
 *   SKIP_EMULATOR=1 SKIP_BUILD=1 pnpm screenshots:android
 *
 * Output:
 *   apps/app/store-assets/captures-native/android/<locale>/<theme>/<scene>.png
 */
import fs from "node:fs";
import path from "node:path";
import { buildAndInstallScreenshotApk, launchScreenshotApp } from "./lib/build-screenshot-apk.mjs";
import { APP_ID, APP_ROOT, LOCALES, localeBootExtraMs, TIMING, WORK_DIR } from "./lib/config.mjs";
import {
  injectDemoStorageAndroid,
  listAndroidDevices,
  resolveAdbBinary,
} from "./lib/inject-storage-android.mjs";
import { maestroAvailable } from "./lib/maestro.mjs";
import { runMaestroSceneBatches } from "./lib/run-maestro-batches.mjs";
import { log, run, sleep, warn } from "./lib/shell.mjs";
import {
  parseRuntimeFilters,
  plannedOutputPaths,
  syncStudioAliases,
  validateStructure,
} from "./lib/validate-core.mjs";

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
  log(`App locales available: ${LOCALES.join(", ")}`);

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
  let failed = 0;

  for (const locale of locales) {
    for (const theme of themes) {
      log(`\n── ${locale} / ${theme} ──`);
      const sessionDir = path.join(WORK_DIR, "android", locale, theme);

      log("Seeding demo AsyncStorage…");
      injectDemoStorageAndroid({ adb, packageId, locale, theme, clearFirst: true });

      log("Launching screenshot APK (MainActivity, no Metro)…");
      launchScreenshotApp({ adb, packageId });
      sleep(TIMING.appBootMs + localeBootExtraMs(locale));

      if (useMaestro) {
        const outDir = path.join(
          APP_ROOT,
          "store-assets",
          "captures-native",
          "android",
          locale,
          theme,
        );
        const result = runMaestroSceneBatches({
          platform: "android",
          locale,
          theme,
          scenes,
          outDir,
          sessionDir,
          deviceId: serial,
        });
        captured += result.captured;
        failed += result.failedBatches;
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
  log(`Captured via Maestro: ${captured} scene slot(s). Failed batches: ${failed}.`);
  if (failed > 0) {
    warn("Some batches failed — re-run with SCENES=… for missing ids, or check Maestro logs.");
  }
}

function printValidation(validation) {
  log(
    `Scenes: ${validation.sceneCount} · Locales: ${validation.localeCount} · Full matrix: ${validation.matrixSize} PNGs`,
  );
  for (const w of validation.warnings) warn(w);
  for (const e of validation.errors) log(`error: ${e}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
