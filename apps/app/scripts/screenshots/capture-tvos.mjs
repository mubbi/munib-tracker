#!/usr/bin/env node
/**
 * Capture Apple TV store screenshots for Munib Tracker.
 *
 * Prepared pipeline — does **not** write images unless RUN_CAPTURE=1.
 * Default / CI: structure validation only (same as VALIDATE_ONLY=1).
 *
 * Prerequisites (macOS, when capturing):
 *   - Xcode + Apple TV simulator
 *   - EXPO_TV=1 clean prebuild + tvOS build installed on the sim
 *   - Demo storage seeded (reuse phone inject-storage-ios patterns)
 *
 * Usage (from repo root):
 *   pnpm screenshots:tvos                    # validate only
 *   VALIDATE_ONLY=1 pnpm screenshots:tvos    # same
 *   RUN_CAPTURE=1 pnpm screenshots:tvos      # real capture (manual opt-in)
 *   SCENES=home,tracker RUN_CAPTURE=1 pnpm screenshots:tvos
 *
 * Output (when RUN_CAPTURE=1):
 *   apps/app/store-assets/captures-native/tvos/<locale>/<theme>/<scene>.png
 *   apps/app/store-assets/ios/screenshots/apple-tv-1080p/<locale>/<01-home|…>.png
 *
 * Env:
 *   APPLE_TV_SIMULATOR_DEVICE  default "Apple TV 4K (3rd generation)"
 *   LOCALES / THEMES / SCENES / SKIP_BUILD / SKIP_SIMULATOR / VALIDATE_ONLY / RUN_CAPTURE
 */
import fs from "node:fs";
import path from "node:path";
import { APP_ID, APP_ROOT, DEFAULT_LOCALE, DEFAULT_THEME } from "./lib/config.mjs";
import { approveIosUrlSchemes } from "./lib/inject-storage-ios.mjs";
import { log, sleep, warn } from "./lib/shell.mjs";
import {
  assertCaptureAllowed,
  captureAppleTvScreenshot,
  isTvCaptureEnabled,
  openTvDeepLinkIos,
  printTvCapturePlan,
  TV,
  tvNativeOutputRoot,
  tvStoreOutputRoot,
} from "./lib/tv-capture.mjs";
import { filterTvScenes, TV_STORE_SIZE } from "./lib/tv-scenes.mjs";
import { validateTvStructure } from "./lib/validate-core.mjs";

/** Cold-start settle per scene (override with TV_COLD_START_MS). */
const TV_COLD_START_MS = Number(process.env.TV_COLD_START_MS || 16_000);

function parseSceneFilter() {
  const raw = (process.env.SCENES ?? "all").trim();
  if (raw === "all") return null;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseList(name, fallback) {
  const raw = (process.env[name] ?? "all").trim();
  if (raw === "all") return [...fallback];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function printValidation(validation) {
  log(`TV structure: ${validation.ok ? "OK" : "FAILED"} (${validation.sceneCount} scenes)`);
  for (const w of validation.warnings) warn(w);
  for (const e of validation.errors) log(`error: ${e}`);
}

async function main() {
  if (process.platform !== "darwin" && isTvCaptureEnabled()) {
    throw new Error("capture-tvos.mjs RUN_CAPTURE requires macOS + Xcode Simulator.");
  }

  const validation = validateTvStructure();
  printValidation(validation);

  const validateOnly = process.env.VALIDATE_ONLY === "1" || !isTvCaptureEnabled();
  if (validateOnly) {
    log(
      isTvCaptureEnabled()
        ? "VALIDATE_ONLY=1 — skipping capture."
        : "Capture disabled (set RUN_CAPTURE=1 to write PNGs). Validation only.",
    );
    process.exit(validation.ok ? 0 : 1);
  }

  if (!validation.ok) {
    throw new Error("Validation failed — fix errors before capturing.");
  }

  assertCaptureAllowed("capture-tvos.mjs");

  const scenes = filterTvScenes(parseSceneFilter());
  const locales = parseList("LOCALES", [DEFAULT_LOCALE]);
  const themes = parseList("THEMES", [DEFAULT_THEME]);
  printTvCapturePlan("tvos", scenes);

  const deviceName = process.env[TV.appleTvDeviceEnv] || TV.defaultAppleTvDevice;
  log(`Apple TV device: ${deviceName}`);
  log(`Store size: ${TV_STORE_SIZE.w}×${TV_STORE_SIZE.h}`);

  // Capture loop is intentionally explicit — operator must have EXPO_TV build installed.
  warn("Ensure EXPO_TV=1 prebuild + tvOS app is installed on the Apple TV simulator.");

  const { resolvePhoneSimulatorUdid } = await import("./lib/inject-watch-snapshot.mjs").catch(
    () => ({}),
  );
  // Prefer a dedicated Apple TV UDID resolver when available; fall back to name lookup via simctl.
  let udid = process.env.APPLE_TV_UDID || "";
  if (!udid) {
    const { spawnSync } = await import("node:child_process");
    const listed = spawnSync("xcrun", ["simctl", "list", "devices", "available", "-j"], {
      encoding: "utf8",
    });
    if (listed.status === 0) {
      const data = JSON.parse(listed.stdout);
      for (const runtime of Object.values(data.devices || {})) {
        for (const d of runtime) {
          if (d.name === deviceName && d.isAvailable !== false) {
            udid = d.udid;
            break;
          }
        }
        if (udid) break;
      }
    }
  }
  if (!udid) {
    throw new Error(
      `Apple TV simulator not found: "${deviceName}". Set APPLE_TV_UDID or create the device in Xcode.`,
    );
  }
  log(`UDID: ${udid}`);

  // tvOS asks "Open in Munib Tracker?" for every `simctl openurl` unless the scheme is
  // pre-approved — and its LaunchServices only reads the approval plist at boot, so
  // approve first, then (re)boot. Without this every capture is the system prompt.
  approveIosUrlSchemes(udid, APP_ID.ios);
  if (process.env.SKIP_SIMULATOR !== "1") {
    const { run } = await import("./lib/shell.mjs");
    run("xcrun", ["simctl", "shutdown", udid], { allowFail: true });
    run("xcrun", ["simctl", "boot", udid], { allowFail: true });
    run("xcrun", ["simctl", "bootstatus", udid], { allowFail: true });
    await sleep(3_000);
  } else {
    warn("SKIP_SIMULATOR=1 — URL scheme approval only applies after the Apple TV sim reboots.");
  }

  void resolvePhoneSimulatorUdid;

  for (const locale of locales) {
    for (const theme of themes) {
      for (const scene of scenes) {
        openTvDeepLinkIos(scene, udid);
        // Each scene is a cold start (openTvDeepLinkIos terminates first); a Release
        // tvOS build is still on the splash at ~10s, so wait for the bundle to settle.
        await sleep(Math.max(scene.settleMs ?? 2_000, TV_COLD_START_MS));
        const nativeDir = path.join(tvNativeOutputRoot("tvos"), locale, theme);
        const nativePath = path.join(nativeDir, `${scene.id}.png`);
        captureAppleTvScreenshot({ udid, outPath: nativePath });

        const storeDir = path.join(tvStoreOutputRoot("tvos"), locale);
        fs.mkdirSync(storeDir, { recursive: true });
        const storePath = path.join(storeDir, `${scene.storeFile}.png`);
        fs.copyFileSync(nativePath, storePath);
        log(`Store copy → ${path.relative(APP_ROOT, storePath)}`);
      }
    }
  }

  log("Apple TV capture complete.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
