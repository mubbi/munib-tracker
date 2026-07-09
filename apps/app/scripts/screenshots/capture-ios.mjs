#!/usr/bin/env node
/**
 * Capture native iOS Simulator screenshots for Munib Tracker.
 *
 * Prerequisites (macOS):
 *   - Xcode + iOS Simulator
 *   - Debug dev build installed: pnpm --filter app ios
 *   - Maestro CLI (recommended): https://maestro.mobile.dev
 *   - host sqlite3 (for demo storage injection)
 *
 * Usage (from repo root):
 *   pnpm screenshots:ios
 *   LOCALES=en THEMES=light,dark SCENES=home,quran pnpm screenshots:ios
 *   VALIDATE_ONLY=1 pnpm screenshots:ios
 *   SKIP_SIMULATOR=1 SKIP_BUILD=1 pnpm screenshots:ios
 *
 * Output:
 *   apps/app/store-assets/captures-native/ios/<locale>/<theme>/<scene>.png
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { APP_ID, APP_ROOT, deepLink, IOS, TIMING, WORK_DIR } from "./lib/config.mjs";
import {
  bootSimulator,
  forceStopIosApp,
  injectDemoStorageIos,
  launchIosApp,
  resolveSimulatorUdid,
} from "./lib/inject-storage-ios.mjs";
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

  const bundleId = APP_ID.ios;
  const deviceName = process.env[IOS.deviceNameEnv] || IOS.defaultDeviceName;
  const udid = process.env.IOS_UDID || resolveSimulatorUdid(deviceName);

  if (process.env.SKIP_SIMULATOR !== "1") {
    log(`Booting simulator: ${deviceName} (${udid})`);
    bootSimulator(udid);
  }

  if (process.env.SKIP_BUILD !== "1") {
    log("Building & installing dev client (expo run:ios)…");
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
  for (const locale of locales) {
    for (const theme of themes) {
      log(`\n── ${locale} / ${theme} ──`);
      const sessionDir = path.join(WORK_DIR, "ios", locale, theme);
      fs.mkdirSync(sessionDir, { recursive: true });

      log("Seeding demo AsyncStorage…");
      injectDemoStorageIos({ udid, bundleId, locale, theme, resetApp: true });

      log("Launching app…");
      forceStopIosApp({ udid, bundleId });
      launchIosApp({ udid, bundleId, deepLink: deepLink("/") });
      sleep(TIMING.appBootMs + (locale === "ar" || locale === "ur" ? TIMING.localeReloadMs : 0));

      if (useMaestro) {
        const flowPath = path.join(sessionDir, "capture.yaml");
        const outDir = path.join(APP_ROOT, "store-assets", "captures-native", "ios", locale, theme);
        const yaml = buildCaptureFlowYaml({
          platform: "ios",
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
        captured += scenes.length;
      }

      const aliases = syncStudioAliases("ios", locale, theme);
      if (aliases.length) log(`Synced ${aliases.length} screenshot-studio alias(es).`);
    }
  }

  log(
    `\nDone. Planned ${plannedOutputPaths("ios", locales, themes, scenes).length} files under store-assets/captures-native/ios/`,
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
