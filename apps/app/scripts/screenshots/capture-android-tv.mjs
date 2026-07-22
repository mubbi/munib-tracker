#!/usr/bin/env node
/**
 * Capture Android TV / Fire TV store screenshots for Munib Tracker.
 *
 * Prepared pipeline — does **not** write images unless RUN_CAPTURE=1.
 * Same Leanback APK serves Android TV and Fire TV; Amazon console uses
 * 1920×1080 screenshots from this output (plus Fire TV banner assets from
 * generate-brand-assets.py → assets/images/tv/firetv-*).
 *
 * Usage (from repo root):
 *   pnpm screenshots:android-tv                 # validate only
 *   VALIDATE_ONLY=1 pnpm screenshots:android-tv
 *   RUN_CAPTURE=1 pnpm screenshots:android-tv   # real capture (manual opt-in)
 *   SCENES=home,quran RUN_CAPTURE=1 pnpm screenshots:android-tv
 *
 * Output (when RUN_CAPTURE=1):
 *   apps/app/store-assets/captures-native/android-tv/<locale>/<theme>/<scene>.png
 *   apps/app/store-assets/android/screenshots/android-tv-1080p/<locale>/<01-home|…>.png
 *
 * Env:
 *   ANDROID_TV_AVD   default "Android_TV_1080p_API_34"
 *   LOCALES / THEMES / SCENES / SKIP_EMULATOR / SKIP_BUILD / VALIDATE_ONLY / RUN_CAPTURE
 */
import fs from "node:fs";
import path from "node:path";
import { APP_ROOT, DEFAULT_LOCALE, DEFAULT_THEME } from "./lib/config.mjs";
import { log, sleep, warn } from "./lib/shell.mjs";
import {
  assertCaptureAllowed,
  captureAndroidTvScreenshot,
  isTvCaptureEnabled,
  openTvDeepLinkAndroid,
  printTvCapturePlan,
  TV,
  tvNativeOutputRoot,
  tvStoreOutputRoot,
} from "./lib/tv-capture.mjs";
import { filterTvScenes, TV_STORE_SIZE } from "./lib/tv-scenes.mjs";
import { validateTvStructure } from "./lib/validate-core.mjs";

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

  assertCaptureAllowed("capture-android-tv.mjs");

  const scenes = filterTvScenes(parseSceneFilter());
  const locales = parseList("LOCALES", [DEFAULT_LOCALE]);
  const themes = parseList("THEMES", [DEFAULT_THEME]);
  printTvCapturePlan("android-tv", scenes);

  const avd = process.env[TV.androidAvdEnv] || TV.defaultAndroidAvd;
  log(`Android TV AVD: ${avd}`);
  log(`Store size: ${TV_STORE_SIZE.w}×${TV_STORE_SIZE.h}`);
  warn("Ensure EXPO_TV=1 Leanback APK is installed on a running Android TV emulator.");
  warn("Fire TV store screenshots reuse these 1920×1080 PNGs in the Amazon console.");

  if (process.env.SKIP_EMULATOR !== "1") {
    warn(
      `Start the TV emulator yourself if needed: emulator -avd ${avd} (or Android Studio Device Manager).`,
    );
  }

  const serial = process.env.ANDROID_SERIAL || undefined;

  for (const locale of locales) {
    for (const theme of themes) {
      for (const scene of scenes) {
        openTvDeepLinkAndroid(scene, serial);
        await sleep(scene.settleMs ?? 2_000);
        const nativeDir = path.join(tvNativeOutputRoot("android-tv"), locale, theme);
        const nativePath = path.join(nativeDir, `${scene.id}.png`);
        captureAndroidTvScreenshot({ serial, outPath: nativePath });

        const storeDir = path.join(tvStoreOutputRoot("android-tv"), locale);
        fs.mkdirSync(storeDir, { recursive: true });
        const storePath = path.join(storeDir, `${scene.storeFile}.png`);
        fs.copyFileSync(nativePath, storePath);
        log(`Store copy → ${path.relative(APP_ROOT, storePath)}`);
      }
    }
  }

  log("Android TV capture complete.");
  log(
    "Amazon Fire TV: upload android-tv-1080p PNGs + assets/images/tv/firetv-* in Appstore Details.",
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
