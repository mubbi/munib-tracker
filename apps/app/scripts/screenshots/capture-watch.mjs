#!/usr/bin/env node
/**
 * Capture Apple Watch App Store screenshots for Munib Tracker.
 *
 * Uses watchOS Simulator + App Group snapshot seeding (not Maestro — Maestro
 * does not support watchOS). Captures at Ultra 3 size (422×514); Apple scales
 * down to smaller watches when you upload only this set.
 *
 * Prerequisites (macOS):
 *   - Xcode + watchOS Simulator ("Apple Watch Ultra 3 (49mm)")
 *   - Paired iPhone simulator (default: iPhone 17 Pro)
 *   - Watch companion installed via expo run:ios (builds apple-targets watch)
 *
 * Usage (from repo root):
 *   pnpm screenshots:watch
 *   SCENES=schedule,morning pnpm screenshots:watch
 *   SKIP_BUILD=1 SKIP_SIMULATOR=1 pnpm screenshots:watch
 *   VALIDATE_ONLY=1 pnpm screenshots:watch
 *
 * Output:
 *   apps/app/store-assets/captures-native/watch/en/<scene>.png
 *   apps/app/store-assets/ios/screenshots/watch-ultra-3/en/<01-schedule|…>.png
 *
 * Env:
 *   WATCH_SIMULATOR_DEVICE  default "Apple Watch Ultra 3 (49mm)"
 *   IOS_SIMULATOR_DEVICE    phone to pair (default "iPhone 17 Pro")
 *   SCENES                  comma list: schedule, morning, location-denied
 *   SKIP_BUILD / SKIP_SIMULATOR / VALIDATE_ONLY
 */
import fs from "node:fs";
import path from "node:path";
import { APP_ROOT, IOS, TIMING, WORK_DIR } from "./lib/config.mjs";
import {
  bootWatchAndPhone,
  captureWatchScreenshot,
  copyToStoreAssets,
  forceStopWatchApp,
  installWatchApp,
  isWatchAppInstalled,
  launchWatchApp,
  resolvePhoneSimulatorUdid,
  resolveWatchSimulatorUdid,
  WATCH,
  WATCH_BUNDLE_ID,
  writeWatchSnapshot,
} from "./lib/inject-watch-snapshot.mjs";
import { log, run, sleep, warn } from "./lib/shell.mjs";
import { validateWatchStructure } from "./lib/validate-core.mjs";
import { filterWatchScenes, WATCH_STORE_SIZE } from "./lib/watch-scenes.mjs";

const STORE_WATCH_ROOT = path.join(
  APP_ROOT,
  "store-assets",
  "ios",
  "screenshots",
  WATCH_STORE_SIZE.label,
  "en",
);

const NATIVE_WATCH_ROOT = path.join(APP_ROOT, "store-assets", "captures-native", "watch", "en");

async function main() {
  if (process.platform !== "darwin") {
    throw new Error("capture-watch.mjs requires macOS with Xcode Simulator.");
  }

  const validation = validateWatchStructure();
  printValidation(validation);

  if (process.env.VALIDATE_ONLY === "1") {
    process.exit(validation.ok ? 0 : 1);
  }

  if (!validation.ok) {
    throw new Error("Validation failed — fix errors before capturing.");
  }

  const sceneIds = parseSceneFilter();
  const scenes = filterWatchScenes(sceneIds);
  log(
    `Watch capture plan: ${scenes.length} scene(s) → ${WATCH_STORE_SIZE.w}×${WATCH_STORE_SIZE.h} (${WATCH_STORE_SIZE.label})`,
  );
  for (const s of scenes) log(`  · ${s.id} — ${s.title}`);

  const watchName = process.env[WATCH.deviceNameEnv] || WATCH.defaultDeviceName;
  const phoneName =
    process.env[WATCH.phoneDeviceNameEnv] ||
    process.env[IOS.deviceNameEnv] ||
    WATCH.defaultPhoneDeviceName;

  const watchUdid = process.env.WATCH_UDID || resolveWatchSimulatorUdid(watchName);
  const phoneUdid = process.env.IOS_UDID || resolvePhoneSimulatorUdid(phoneName);

  log(`Watch: ${watchName} (${watchUdid})`);
  log(`Phone: ${phoneName} (${phoneUdid})`);
  log(`Watch bundle: ${WATCH_BUNDLE_ID}`);

  if (process.env.SKIP_SIMULATOR !== "1") {
    log("Booting paired iPhone + Watch simulators…");
    bootWatchAndPhone({ watchUdid, phoneUdid });
  }

  if (process.env.SKIP_BUILD !== "1") {
    log("Building & installing iOS Release app (includes watch companion)…");
    run(
      "pnpm",
      [
        "--filter",
        "app",
        "exec",
        "expo",
        "run:ios",
        "--configuration",
        "Release",
        "--no-bundler",
        "--device",
        phoneName,
      ],
      {
        cwd: path.join(APP_ROOT, "..", ".."),
        env: {
          ...process.env,
          EXPO_IOS_SIMULATOR_DEVICE_NAME: phoneName,
          ONLY_ACTIVE_ARCH: "YES",
          EXCLUDED_ARCHS: "x86_64",
        },
      },
    );
    sleep(TIMING.appBootMs);
  } else {
    warn("SKIP_BUILD=1 — reusing installed phone + watch apps.");
  }

  // expo run:ios installs the phone app; the watch companion often needs an explicit push.
  if (!isWatchAppInstalled(watchUdid)) {
    log("Installing MunibTrackerWatch.app onto watch simulator…");
    const installed = installWatchApp(watchUdid);
    log(`Installed: ${installed}`);
  } else {
    log("Watch companion already installed.");
  }

  fs.mkdirSync(WORK_DIR, { recursive: true });
  fs.mkdirSync(NATIVE_WATCH_ROOT, { recursive: true });
  fs.mkdirSync(STORE_WATCH_ROOT, { recursive: true });

  let captured = 0;
  let failed = 0;

  for (const scene of scenes) {
    log(`\n── watch / ${scene.id} ──`);
    try {
      const snapshot = scene.buildSnapshot();
      log("Seeding App Group widget_snapshot_v1…");
      writeWatchSnapshot({
        udid: watchUdid,
        bundleId: WATCH_BUNDLE_ID,
        snapshot,
      });

      log("Launching watch app…");
      forceStopWatchApp({ udid: watchUdid, bundleId: WATCH_BUNDLE_ID });
      launchWatchApp({ udid: watchUdid, bundleId: WATCH_BUNDLE_ID });

      const nativeOut = path.join(NATIVE_WATCH_ROOT, `${scene.id}.png`);
      log(`Capturing → ${nativeOut}`);
      captureWatchScreenshot({ udid: watchUdid, outPath: nativeOut });

      const storeDest = copyToStoreAssets({
        srcPath: nativeOut,
        storeRoot: STORE_WATCH_ROOT,
        storeFile: scene.storeFile,
      });
      log(`Store copy → ${storeDest}`);
      captured += 1;
    } catch (err) {
      failed += 1;
      warn(`${scene.id} failed: ${err.message || err}`);
    }
  }

  forceStopWatchApp({ udid: watchUdid, bundleId: WATCH_BUNDLE_ID });

  log(`\nDone. Captured ${captured}/${scenes.length} watch scene(s). Failed: ${failed}.`);
  log(`Native: ${NATIVE_WATCH_ROOT}`);
  log(`Store:  ${STORE_WATCH_ROOT}`);
  if (failed > 0) process.exit(1);
}

function parseSceneFilter() {
  const raw = (process.env.SCENES ?? "all").trim();
  if (!raw || raw === "all") return null;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function printValidation(validation) {
  log(
    `Watch scenes: ${validation.sceneCount} · Store size: ${WATCH_STORE_SIZE.w}×${WATCH_STORE_SIZE.h}`,
  );
  for (const w of validation.warnings) warn(w);
  for (const e of validation.errors) log(`error: ${e}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
