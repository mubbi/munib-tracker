#!/usr/bin/env node
/**
 * Capture native iPhone Duo App Store screenshots (iOS 27.1+ simulator).
 *
 * The Duo has two displays — inner (unfolded, 2007×2853) and outer (folded,
 * 1398×2034) — and App Store Connect has a slot per display × orientation:
 *
 *   inner portrait  2007×2853 → iphone-duo/portrait/
 *   inner landscape 2853×2007 → iphone-duo/landscape/
 *   outer portrait  1398×2034 → iphone-duo/portrait-compact/
 *   outer landscape 2034×1398 → iphone-duo/landscape-compact/
 *
 * Not Maestro: Maestro's screenshot always reads the inner display (black while
 * folded), and neither Maestro nor simctl can fold or rotate the Duo. Set the
 * posture in Xcode's DeviceHub first, then run once per posture. The slot is
 * derived from the captured size, so the run cannot land in the wrong folder.
 *
 * Prerequisites (macOS):
 *   - Xcode 27.1+ with the Duo iOS runtime (`xcodebuild -downloadPlatform iOS`; the
 *     Duo needs the iPhone19,4 build — `simctl runtime list` shows it separately)
 *   - A simulator named "iPhone Duo" with a Release build installed (embedded JS):
 *       pnpm screenshots:duo            # builds + installs unless SKIP_BUILD=1
 *
 * Usage (from repo root):
 *   DUO_SCREEN=inner pnpm screenshots:duo                   # unfolded
 *   DUO_SCREEN=outer SKIP_BUILD=1 pnpm screenshots:duo      # folded
 *   LOCALES=en SCENES=home,qaza DUO_SCREEN=inner SKIP_BUILD=1 pnpm screenshots:duo
 *
 * Output:
 *   apps/app/store-assets/captures-native/ios-duo/<slot>/<locale>/<theme>/<scene>.png
 *   apps/app/store-assets/ios/screenshots/iphone-duo/<slot>/<locale>/<NN-name>.png
 *
 * Env:
 *   DUO_SCREEN             inner | outer (default inner) — must match DeviceHub posture
 *   DUO_SIMULATOR_DEVICE   simulator name (default "iPhone Duo"); DUO_UDID overrides
 *   LOCALES / THEMES / SCENES / SKIP_BUILD
 */
import fs from "node:fs";
import path from "node:path";
import {
  APP_ID,
  APP_ROOT,
  DEFAULT_THEME,
  deepLink,
  localeBootExtraMs,
  OUTPUT_ROOT,
  STUDIO_LOCALES,
  TIMING,
} from "./lib/config.mjs";
import { forceStopIosApp, injectDemoStorageIos } from "./lib/inject-storage-ios.mjs";
import { getSceneById } from "./lib/scenes.mjs";
import { log, run, runCapture, sleep, warn } from "./lib/shell.mjs";

const DEFAULT_DEVICE = "iPhone Duo";
const TAB_ROUTES = { home: "/", tracker: "/tracker", library: "/library", settings: "/settings" };

/** Store slide → capture scene. Same order as the iPhone / iPhone Duo studio decks. */
const SLIDES = [
  ["01-home", "home"],
  ["02-salah", "tracker"],
  ["03-qaza", "qaza"],
  ["04-library", "quran"],
  ["05-qibla", "qibla"],
  ["06-names", "names-of-allah"],
  ["07-more", "tasbeeh"],
];

/** Captured size → App Store Connect slot folder. */
const SLOTS = {
  "2007x2853": "portrait",
  "2853x2007": "landscape",
  "1398x2034": "portrait-compact",
  "2034x1398": "landscape-compact",
};

const STORE_ROOT = path.join(APP_ROOT, "store-assets", "ios", "screenshots", "iphone-duo");

function parseList(name, fallback) {
  const raw = (process.env[name] ?? "").trim();
  if (!raw) return [...fallback];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function resolveDuoUdid(name) {
  if (process.env.DUO_UDID) return process.env.DUO_UDID;
  const listed = runCapture("xcrun", ["simctl", "list", "devices", "available", "-j"]);
  if (!listed.ok) throw new Error("xcrun simctl not available (macOS + Xcode required)");
  for (const devices of Object.values(JSON.parse(listed.stdout).devices)) {
    const match = devices.find((d) => d.name === name);
    if (match) return match.udid;
  }
  throw new Error(
    `Simulator "${name}" not found. Install the iOS 27.1+ Duo runtime, then:\n` +
      `  xcrun simctl create "${name}" com.apple.CoreSimulator.SimDeviceType.iPhone-Duo <runtime-id>`,
  );
}

/**
 * Display ids for the Duo's two screens. simctl lists them when asked for a
 * screenshot without `--display` ("--display=3  LCD-1 (primary-1) 2007x2853").
 */
function resolveDisplayId(udid, screen) {
  const probe = runCapture("xcrun", ["simctl", "io", udid, "screenshot", "/dev/null"]);
  const displays = [...`${probe.stderr}${probe.stdout}`.matchAll(/--display=(\S+).*?(\d+)x(\d+)/g)]
    .map(([, id, w, h]) => ({ id, area: Number(w) * Number(h) }))
    .sort((a, b) => b.area - a.area);
  if (displays.length < 2) {
    throw new Error(`Expected the Duo's two displays, simctl reported:\n${probe.stderr}`);
  }
  return (screen === "outer" ? displays[displays.length - 1] : displays[0]).id;
}

function pngSize(file) {
  const probe = runCapture("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file]);
  const w = /pixelWidth:\s*(\d+)/.exec(probe.stdout)?.[1];
  const h = /pixelHeight:\s*(\d+)/.exec(probe.stdout)?.[1];
  return `${w}x${h}`;
}

function screenshot(udid, displayId, outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  run(
    "xcrun",
    ["simctl", "io", udid, "screenshot", "--type=png", `--display=${displayId}`, outPath],
    { quiet: true },
  );
}

function sceneRoute(scene) {
  return scene.type === "tab" ? (TAB_ROUTES[scene.tab] ?? `/${scene.tab}`) : scene.route;
}

function main() {
  if (process.platform !== "darwin") throw new Error("capture-duo.mjs requires macOS + Xcode.");

  const screen = (process.env.DUO_SCREEN || "inner").trim();
  if (screen !== "inner" && screen !== "outer") {
    throw new Error(`DUO_SCREEN must be "inner" or "outer" (got "${screen}").`);
  }
  const deviceName = process.env.DUO_SIMULATOR_DEVICE || DEFAULT_DEVICE;
  const udid = resolveDuoUdid(deviceName);
  const bundleId = APP_ID.ios;
  const locales = parseList("LOCALES", STUDIO_LOCALES);
  const themes = parseList("THEMES", [DEFAULT_THEME]);
  const sceneFilter = parseList("SCENES", []);
  const slides = SLIDES.filter(([, id]) => !sceneFilter.length || sceneFilter.includes(id));

  log(`Duo: ${deviceName} (${udid}) · ${screen} screen`);
  run("xcrun", ["simctl", "boot", udid], { allowFail: true, quiet: true });
  run("xcrun", ["simctl", "bootstatus", udid, "-b"], { quiet: true });

  if (process.env.SKIP_BUILD !== "1") {
    log("Building & installing iOS Release app (embedded JS, no Metro)…");
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
        deviceName,
      ],
      {
        cwd: path.join(APP_ROOT, "..", ".."),
        env: { ...process.env, ONLY_ACTIVE_ARCH: "YES", EXCLUDED_ARCHS: "x86_64" },
      },
    );
  }

  const displayId = resolveDisplayId(udid, screen);
  // Store-clean status bar (the app's own clock still shows the real time).
  run("xcrun", [
    "simctl",
    "status_bar",
    udid,
    "override",
    "--time",
    "9:41",
    "--batteryState",
    "charged",
    "--batteryLevel",
    "100",
    "--wifiBars",
    "3",
    "--cellularBars",
    "4",
  ]);

  let slot = null;
  let captured = 0;
  for (const locale of locales) {
    for (const theme of themes) {
      log(`\n── ${locale} / ${theme} ──`);
      injectDemoStorageIos({ udid, bundleId, locale, theme, resetApp: true });
      // Two cold starts: the first hydrates the seeded locale (and runs the native
      // RTL reload for ar/ur), the second starts settled in it.
      for (let i = 0; i < 2; i++) {
        forceStopIosApp({ udid, bundleId });
        run("xcrun", ["simctl", "openurl", udid, deepLink("/")], { quiet: true });
        sleep(Math.max(15_000, TIMING.appBootMs) + localeBootExtraMs(locale));
      }

      for (const [storeFile, sceneId] of slides) {
        const scene = getSceneById(sceneId);
        // Warm navigation (URL schemes pre-approved by the seed) — a cold start per
        // scene lands on the splash screen on the Duo.
        run("xcrun", ["simctl", "openurl", udid, deepLink(sceneRoute(scene))], { quiet: true });
        sleep((scene.waitMs ?? 0) + 5_000);

        const tmp = path.join(OUTPUT_ROOT, "ios-duo", ".tmp.png");
        screenshot(udid, displayId, tmp);
        const size = pngSize(tmp);
        const shotSlot = SLOTS[size];
        if (!shotSlot) {
          fs.rmSync(tmp, { force: true });
          throw new Error(`Unexpected Duo capture size ${size} — is the ${screen} screen active?`);
        }
        if (slot && slot !== shotSlot) {
          throw new Error(`Posture changed mid-run (${slot} → ${shotSlot}). Re-run.`);
        }
        slot = shotSlot;

        const nativeOut = path.join(OUTPUT_ROOT, "ios-duo", slot, locale, theme, `${sceneId}.png`);
        fs.mkdirSync(path.dirname(nativeOut), { recursive: true });
        fs.renameSync(tmp, nativeOut);
        // Store slots carry the studio theme only (light by default).
        if (theme === DEFAULT_THEME) {
          const storeOut = path.join(STORE_ROOT, slot, locale, `${storeFile}.png`);
          fs.mkdirSync(path.dirname(storeOut), { recursive: true });
          fs.copyFileSync(nativeOut, storeOut);
        }
        captured += 1;
        log(`  ✓ ${slot}/${locale}/${storeFile} (${sceneId})`);
      }
    }
  }

  forceStopIosApp({ udid, bundleId });
  run("xcrun", ["simctl", "status_bar", udid, "clear"], { allowFail: true, quiet: true });
  if (!captured) warn("No scenes captured — check SCENES.");
  log(`\nDone. ${captured} capture(s) → ${slot ?? "—"} (${path.relative(APP_ROOT, STORE_ROOT)})`);
}

try {
  main();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
