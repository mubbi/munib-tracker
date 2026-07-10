#!/usr/bin/env node
/**
 * Capture native iOS Simulator screenshots for Munib Tracker.
 *
 * Prerequisites (macOS):
 *   - Xcode + iOS Simulator
 *   - Debug / screenshot build installed (`pnpm --filter app ios` or prebuilt)
 *   - Maestro CLI: https://maestro.mobile.dev
 *   - host sqlite3 (for demo storage injection)
 *
 * Usage (from repo root):
 *   pnpm screenshots:ios
 *   LOCALES=en,ar,ur THEMES=dark SCENES=home,quran pnpm screenshots:ios
 *   LOCALES=all THEMES=all  # default: every AppLocale × light/dark
 *   VALIDATE_ONLY=1 pnpm screenshots:ios
 *   SKIP_SIMULATOR=1 SKIP_BUILD=1 pnpm screenshots:ios
 *
 * Output:
 *   apps/app/store-assets/captures-native/ios/<locale>/<theme>/<scene>.png
 *
 * Navigation / batching matches capture-android.mjs (deep links + SCENE_BATCH).
 */
import fs from "node:fs";
import path from "node:path";
import {
  APP_ID,
  APP_ROOT,
  deepLink,
  IOS,
  LOCALES,
  localeBootExtraMs,
  TIMING,
  WORK_DIR,
} from "./lib/config.mjs";
import {
  bootSimulator,
  forceStopIosApp,
  injectDemoStorageIos,
  launchIosApp,
  resolveSimulatorUdid,
} from "./lib/inject-storage-ios.mjs";
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
  if (process.platform !== "darwin") {
    throw new Error("capture-ios.mjs requires macOS with Xcode Simulator.");
  }

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
    `iOS capture plan: ${locales.length} locale(s) × ${themes.length} theme(s) × ${scenes.length} scene(s) = ${locales.length * themes.length * scenes.length} PNGs`,
  );
  log(`App locales available: ${LOCALES.join(", ")}`);

  const bundleId = APP_ID.ios;
  const deviceName = process.env[IOS.deviceNameEnv] || IOS.defaultDeviceName;
  const udid = process.env.IOS_UDID || resolveSimulatorUdid(deviceName);

  if (process.env.SKIP_SIMULATOR !== "1") {
    log(`Booting simulator: ${deviceName} (${udid})`);
    bootSimulator(udid);
  }

  if (process.env.SKIP_BUILD !== "1") {
    log("Building & installing iOS app (expo run:ios)…");
    run("pnpm", ["--filter", "app", "ios"], {
      cwd: path.join(APP_ROOT, "..", ".."),
      env: { ...process.env, EXPO_IOS_SIMULATOR_DEVICE_NAME: deviceName },
    });
    sleep(TIMING.metroWarmMs);
  }

  fs.mkdirSync(WORK_DIR, { recursive: true });

  const useMaestro = maestroAvailable();
  if (!useMaestro) {
    warn("Maestro not installed — cannot automate navigation on iOS.");
  }

  let captured = 0;
  let failed = 0;

  for (const locale of locales) {
    for (const theme of themes) {
      log(`\n── ${locale} / ${theme} ──`);
      const sessionDir = path.join(WORK_DIR, "ios", locale, theme);

      log("Seeding demo AsyncStorage…");
      injectDemoStorageIos({ udid, bundleId, locale, theme, resetApp: true });

      log("Launching app…");
      forceStopIosApp({ udid, bundleId });
      launchIosApp({ udid, bundleId, deepLink: deepLink("/") });
      sleep(TIMING.appBootMs + localeBootExtraMs(locale));

      if (useMaestro) {
        const outDir = path.join(APP_ROOT, "store-assets", "captures-native", "ios", locale, theme);
        const result = runMaestroSceneBatches({
          platform: "ios",
          locale,
          theme,
          scenes,
          outDir,
          sessionDir,
        });
        captured += result.captured;
        failed += result.failedBatches;
      } else {
        warn("Skipping automated navigation — install Maestro to capture all scenes.");
      }

      const aliases = syncStudioAliases("ios", locale, theme);
      if (aliases.length) log(`Synced ${aliases.length} screenshot-studio alias(es).`);
    }
  }

  log(
    `\nDone. Planned ${plannedOutputPaths("ios", locales, themes, scenes).length} files under store-assets/captures-native/ios/`,
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
