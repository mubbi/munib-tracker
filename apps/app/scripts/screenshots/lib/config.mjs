import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadAppLocaleCodes, loadStudioLocaleCodes } from "./app-locales.mjs";

const SCRIPT_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const APP_ROOT = path.resolve(SCRIPT_ROOT, "../..");
export const REPO_ROOT = path.resolve(APP_ROOT, "../..");

export const APP_ID = {
  android: "app.munibtracker",
  ios: "app.munibtracker",
};

export const URL_SCHEME = "munib-tracker";

/**
 * Every Expo AppLocale — kept in sync with packages/shared/src/i18n/app-locale.ts.
 * Override with LOCALES=en,ar or LOCALES=all (default).
 */
export const LOCALES = loadAppLocaleCodes();

/**
 * Locales that get STUDIO_ALIASES copies + screenshot-studio decks.
 * From packages/store-screenshots/spec.json (marketing subset).
 */
export const STUDIO_LOCALES = loadStudioLocaleCodes();

export const THEMES = ["light", "dark"];

export const DEFAULT_LOCALE = "en";
export const DEFAULT_THEME = "light";

/**
 * Theme used by screenshot-studio marketing decks (store listing frames).
 * Both light and dark are still written under captures/<platform>/<locale>/<theme>/.
 * Override with STUDIO_THEME=dark if needed.
 */
export const STUDIO_THEME = (process.env.STUDIO_THEME || "light").trim() || "light";

/** Native PNG output (full matrix). */
export const OUTPUT_ROOT = path.join(APP_ROOT, "store-assets", "captures-native");

/** Flat JPEG aliases for screenshot-studio — per platform so iOS/Android do not overwrite each other. */
export const STUDIO_CAPTURE_ROOT = path.join(APP_ROOT, "store-assets", "captures");
export const STUDIO_PLATFORMS = ["android", "ios"];

/** Maestro + temp flow workspace (gitignored). */
export const WORK_DIR = path.join(APP_ROOT, ".screenshots-work");

export const TIMING = {
  /** After cold launch before first interaction. */
  appBootMs: 12_000,
  /** Default settle after navigation / tab switch. */
  settleMs: 900,
  /** Extra wait for Reanimated / Stagger entrance animations. */
  animationMs: 1_400,
  /** Heavy screens (Qur'an mushaf, hadith lists). */
  heavyScreenMs: 2_800,
  /** Modal / bottom sheet open animation. */
  modalMs: 1_100,
  /** Non-English locale switch may trigger native reload. */
  localeReloadMs: 14_000,
  /** Poll interval for ready-marker checks. */
  pollMs: 400,
  /** Max wait for ready markers before failing the scene. */
  readyTimeoutMs: 45_000,
  /** Metro bundler warm-up when starting iOS/Android dev client. */
  metroWarmMs: 8_000,
};

export const ANDROID = {
  avdEnv: "ANDROID_AVD",
  emulatorGpuEnv: "ANDROID_EMULATOR_GPU",
  defaultDeviceName: "Pixel_7_Pro_API_34",
};

export const IOS = {
  deviceNameEnv: "IOS_SIMULATOR_DEVICE",
  /** Prefer a current Xcode default; override with IOS_SIMULATOR_DEVICE. */
  defaultDeviceName: "iPhone 17 Pro",
  /** Portrait phone — store marketing frames crop from this. */
  screenshotScale: 3,
};

/** Map capture scene ids → screenshot-studio JPEG filenames. */
export const STUDIO_ALIASES = {
  home: "home.jpg",
  tracker: "tracker.jpg",
  "tracker-status-sheet": "tracker.jpg",
  qaza: "qaza.jpg",
  zikr: "zikr.jpg",
  quran: "quran.jpg",
  qibla: "qibla.jpg",
  "names-of-allah": "names-of-allah.jpg",
  tasbeeh: "tasbeeh.jpg",
};

export function deepLink(route) {
  const normalized = route.startsWith("/") ? route : `/${route}`;
  return `${URL_SCHEME}://${normalized.replace(/^\//, "")}`;
}

export function outputPath(platform, locale, theme, sceneId, ext = "png") {
  return path.join(OUTPUT_ROOT, platform, locale, theme, `${sceneId}.${ext}`);
}

/** Studio alias path: captures/<platform>/<locale>/<theme>/<file> */
export function studioAliasPath(platform, locale, theme, aliasFile) {
  return path.join(STUDIO_CAPTURE_ROOT, platform, locale, theme, aliasFile);
}

/** Extra boot settle when seeding a non-default UI locale. */
export function localeBootExtraMs(locale) {
  return locale && locale !== DEFAULT_LOCALE ? TIMING.localeReloadMs : 0;
}
