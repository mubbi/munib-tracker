/**
 * Shared TV capture helpers (Apple TV simctl / Android TV adb screencap).
 *
 * These helpers are used by capture-tvos.mjs and capture-android-tv.mjs.
 * Real device I/O only runs when RUN_CAPTURE=1 — otherwise scripts validate only.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { APP_ID, APP_ROOT, OUTPUT_ROOT, URL_SCHEME } from "./config.mjs";
import { log, run, warn } from "./shell.mjs";
import { TV_STORE_SIZE } from "./tv-scenes.mjs";

export const TV = {
  /** Set to "1" to actually boot devices and write PNGs. */
  runCaptureEnv: "RUN_CAPTURE",
  androidAvdEnv: "ANDROID_TV_AVD",
  defaultAndroidAvd: "Android_TV_1080p_API_34",
  appleTvDeviceEnv: "APPLE_TV_SIMULATOR_DEVICE",
  defaultAppleTvDevice: "Apple TV 4K (3rd generation)",
  expoTv: "1",
};

export function isTvCaptureEnabled() {
  return process.env[TV.runCaptureEnv] === "1";
}

export function assertCaptureAllowed(scriptName) {
  if (isTvCaptureEnabled()) return;
  throw new Error(
    `${scriptName}: capture is prepared but disabled by default.\n` +
      `  Validate only:  VALIDATE_ONLY=1 pnpm screenshots:tvos\n` +
      `  Run for real:   RUN_CAPTURE=1 pnpm screenshots:tvos\n` +
      `  (Requires EXPO_TV=1 prebuild + Apple TV / Android TV emulator.)`,
  );
}

/** Deep link for a TV scene (same scheme as phone). */
export function tvDeepLink(scene) {
  if (scene.type === "tab") {
    // Empty host (`munib-tracker://`) fails simctl openurl on tvOS — use explicit `/`.
    if (scene.tab === "index") return `${URL_SCHEME}:///`;
    return `${URL_SCHEME}://${scene.tab}`;
  }
  const route = (scene.route || "/").replace(/^\//, "");
  return `${URL_SCHEME}://${route}`;
}

export function tvNativeOutputRoot(platform) {
  return path.join(OUTPUT_ROOT, platform);
}

export function tvStoreOutputRoot(platform) {
  const base =
    platform === "tvos"
      ? path.join(APP_ROOT, "store-assets", "ios", "screenshots", "apple-tv-1080p")
      : path.join(APP_ROOT, "store-assets", "android", "screenshots", "android-tv-1080p");
  return base;
}

/**
 * Resize/crop a screenshot to TV_STORE_SIZE with sips (macOS) or skip if missing.
 * @returns {boolean} true if resized
 */
export function resizeToTvStoreSize(pngPath) {
  const { w, h } = TV_STORE_SIZE;
  if (process.platform !== "darwin") {
    warn(`sips resize skipped on ${process.platform} — ensure capture is ${w}×${h}`);
    return false;
  }
  const result = spawnSync("sips", ["-z", String(h), String(w), pngPath, "--out", pngPath], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    warn(`sips failed: ${result.stderr || result.stdout}`);
    return false;
  }
  return true;
}

/**
 * Capture Apple TV simulator framebuffer via simctl.
 * @param {{ udid: string, outPath: string }} opts
 */
export function captureAppleTvScreenshot({ udid, outPath }) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  run("xcrun", ["simctl", "io", udid, "screenshot", outPath]);
  resizeToTvStoreSize(outPath);
  log(`Wrote ${outPath}`);
}

/**
 * Capture Android TV via adb exec-out screencap.
 * @param {{ serial?: string, outPath: string }} opts
 */
export function captureAndroidTvScreenshot({ serial, outPath }) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const adb = serial ? ["-s", serial] : [];
  const result = spawnSync("adb", [...adb, "exec-out", "screencap", "-p"], {
    encoding: "buffer",
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`adb screencap failed: ${result.stderr?.toString() || result.status}`);
  }
  fs.writeFileSync(outPath, result.stdout);
  resizeToTvStoreSize(outPath);
  log(`Wrote ${outPath}`);
}

export function openTvDeepLinkAndroid(scene, serial) {
  const link = tvDeepLink(scene);
  const adb = serial ? ["-s", serial] : [];
  run("adb", [
    ...adb,
    "shell",
    "am",
    "start",
    "-a",
    "android.intent.action.VIEW",
    "-d",
    link,
    APP_ID.android,
  ]);
}

export function openTvDeepLinkIos(scene, udid) {
  const link = tvDeepLink(scene);
  // Warm openurl on tvOS shows a system “Open in …?” sheet that blocks capture.
  // Cold-start (terminate → openurl) delivers the URL as the initial launch link.
  run("xcrun", ["simctl", "terminate", udid, APP_ID.ios], { allowFail: true });
  run("xcrun", ["simctl", "openurl", udid, link]);
}

export function printTvCapturePlan(platform, scenes) {
  log(
    `TV ${platform} plan: ${scenes.length} scene(s) → ${TV_STORE_SIZE.w}×${TV_STORE_SIZE.h} (${TV_STORE_SIZE.label})`,
  );
  for (const s of scenes) log(`  · ${s.id} → ${s.storeFile}.png — ${s.title}`);
  log(`Deep-link scheme: ${URL_SCHEME}://…`);
  log(`EXPO_TV=1 prebuild required before RUN_CAPTURE=1.`);
}
