import fs from "node:fs";
import path from "node:path";
import {
  APP_ID,
  APP_ROOT,
  LOCALES,
  OUTPUT_ROOT,
  outputPath,
  STUDIO_ALIASES,
  STUDIO_CAPTURE_ROOT,
  STUDIO_LOCALES,
  STUDIO_THEME,
  studioAliasPath,
  THEMES,
  TIMING,
  WORK_DIR,
} from "./config.mjs";
import { demoReadyMarkers } from "./demo-data.mjs";
import { validateI18nKeys } from "./i18n.mjs";
import { filterScenes, SCENES, sceneCount } from "./scenes.mjs";
import { commandExists } from "./shell.mjs";
import { TV_SCENES, TV_STORE_SIZE, tvSceneCount } from "./tv-scenes.mjs";
import { WATCH_SCENES, WATCH_STORE_SIZE } from "./watch-scenes.mjs";

const REQUIRED_I18N = [
  "tabs.home",
  "tabs.tracker",
  "tabs.library",
  "tabs.settings",
  "appearance.modeLight",
  "appearance.modeDark",
  "prayers.fajr",
  "prayers.dhuhr",
  "prayers.asr",
  "prayerStatus.completed",
  "prayerStatus.missed",
];

export function validateStructure() {
  const errors = [];
  const warnings = [];

  for (const file of [
    "capture-android.mjs",
    "capture-ios.mjs",
    "capture-watch.mjs",
    "capture-tvos.mjs",
    "capture-android-tv.mjs",
    "validate.mjs",
    "lib/config.mjs",
    "lib/app-locales.mjs",
    "lib/demo-data.mjs",
    "lib/scenes.mjs",
    "lib/tv-scenes.mjs",
    "lib/tv-capture.mjs",
    "lib/maestro.mjs",
    "lib/run-maestro-batches.mjs",
    "lib/inject-storage-android.mjs",
    "lib/inject-storage-ios.mjs",
    "lib/inject-watch-snapshot.mjs",
    "lib/watch-scenes.mjs",
    "lib/build-screenshot-apk.mjs",
  ]) {
    const full = path.join(APP_ROOT, "scripts", "screenshots", file);
    if (!fs.existsSync(full)) errors.push(`Missing file: ${file}`);
  }

  if (!LOCALES.length) errors.push("LOCALES is empty — failed to load AppLocale codes");
  for (const studioLocale of STUDIO_LOCALES) {
    if (!LOCALES.includes(studioLocale)) {
      errors.push(`Studio locale "${studioLocale}" is not an AppLocale`);
    }
  }

  const ids = new Set();
  for (const scene of SCENES) {
    if (ids.has(scene.id)) errors.push(`Duplicate scene id: ${scene.id}`);
    ids.add(scene.id);
    if (scene.type === "tab" && !scene.tab) errors.push(`Tab scene missing tab: ${scene.id}`);
    if (scene.type !== "tab" && !scene.route) errors.push(`Route scene missing route: ${scene.id}`);
    if (!scene.group) errors.push(`Scene missing group: ${scene.id}`);
    const markers = demoReadyMarkers(scene.id);
    if (!markers.length) warnings.push(`Scene ${scene.id} has no ready markers`);
  }

  const missingI18n = validateI18nKeys(REQUIRED_I18N, LOCALES);
  if (missingI18n.length) {
    errors.push(
      `Missing i18n keys: ${missingI18n.slice(0, 8).join(", ")}${missingI18n.length > 8 ? "…" : ""}`,
    );
  }

  for (const sceneId of Object.keys(STUDIO_ALIASES)) {
    if (!ids.has(sceneId)) {
      warnings.push(`Studio alias references unknown scene: ${sceneId}`);
    }
  }

  if (!commandExists("adb")) warnings.push("adb not on PATH (required for capture-android.mjs)");
  if (process.platform === "darwin") {
    if (!commandExists("xcrun")) {
      warnings.push("xcrun not on PATH (required for capture-ios.mjs / capture-watch.mjs)");
    }
    if (!commandExists("sips")) {
      warnings.push("sips not on PATH (required to resize watch screenshots to 422×514)");
    }
  } else {
    warnings.push("capture-ios.mjs / capture-watch.mjs require macOS + Xcode Simulator");
  }
  if (!commandExists("maestro")) {
    warnings.push("maestro not on PATH — install for automated navigation captures");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    sceneCount: sceneCount(),
    localeCount: LOCALES.length,
    studioLocaleCount: STUDIO_LOCALES.length,
    matrixSize: LOCALES.length * THEMES.length * sceneCount(),
    locales: LOCALES,
    studioLocales: STUDIO_LOCALES,
    outputRoot: OUTPUT_ROOT,
    studioRoot: STUDIO_CAPTURE_ROOT,
    workDir: WORK_DIR,
    timing: TIMING,
    appIds: APP_ID,
    watchSceneCount: WATCH_SCENES.length,
    watchStoreSize: WATCH_STORE_SIZE,
    tvSceneCount: tvSceneCount(),
    tvStoreSize: TV_STORE_SIZE,
  };
}

/** Structure checks for Apple TV / Android TV capture scaffolding. */
export function validateTvStructure() {
  const base = validateStructure();
  const errors = [...base.errors];
  const warnings = [...base.warnings];

  if (!TV_SCENES.length) errors.push("TV_SCENES is empty");
  const ids = new Set();
  for (const scene of TV_SCENES) {
    if (!scene.id) errors.push("TV scene missing id");
    if (!scene.storeFile) errors.push(`TV scene ${scene.id} missing storeFile`);
    if (!scene.group) errors.push(`TV scene ${scene.id} missing group`);
    if (scene.type === "tab" && !scene.tab) errors.push(`TV tab scene missing tab: ${scene.id}`);
    if (scene.type === "route" && !scene.route) {
      errors.push(`TV route scene missing route: ${scene.id}`);
    }
    if (ids.has(scene.id)) errors.push(`Duplicate TV scene id: ${scene.id}`);
    ids.add(scene.id);
  }

  if (TV_STORE_SIZE.w !== 1920 || TV_STORE_SIZE.h !== 1080) {
    warnings.push(
      `TV store size is ${TV_STORE_SIZE.w}×${TV_STORE_SIZE.h} (default marketing size is 1920×1080)`,
    );
  }

  const fireTvDir = path.join(APP_ROOT, "assets", "images", "tv");
  for (const name of [
    "android-banner.png",
    "android-icon.png",
    "firetv-background-1920x1080.png",
    "firetv-icon-1280x720.png",
    "firetv-icon-512.png",
    "firetv-icon-114.png",
  ]) {
    const full = path.join(fireTvDir, name);
    if (!fs.existsSync(full)) {
      warnings.push(
        `TV brand asset missing (run pnpm generate:app:brand-assets): assets/images/tv/${name}`,
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    sceneCount: TV_SCENES.length,
    storeSize: TV_STORE_SIZE,
  };
}

/** Structure checks specific to Apple Watch capture (also covered by validateStructure files list). */
export function validateWatchStructure() {
  const base = validateStructure();
  const errors = [...base.errors];
  const warnings = [...base.warnings];

  if (!WATCH_SCENES.length) errors.push("WATCH_SCENES is empty");
  const ids = new Set();
  for (const scene of WATCH_SCENES) {
    if (!scene.id) errors.push("Watch scene missing id");
    if (!scene.storeFile) errors.push(`Watch scene ${scene.id} missing storeFile`);
    if (typeof scene.buildSnapshot !== "function") {
      errors.push(`Watch scene ${scene.id} missing buildSnapshot`);
    }
    if (ids.has(scene.id)) errors.push(`Duplicate watch scene id: ${scene.id}`);
    ids.add(scene.id);
    try {
      const snap = scene.buildSnapshot();
      if (snap?.version !== 1) errors.push(`Watch scene ${scene.id} snapshot version must be 1`);
      if (typeof snap?.locationDenied !== "boolean") {
        errors.push(`Watch scene ${scene.id} snapshot missing locationDenied`);
      }
    } catch (err) {
      errors.push(`Watch scene ${scene.id} buildSnapshot failed: ${err.message || err}`);
    }
  }

  if (WATCH_STORE_SIZE.w !== 422 || WATCH_STORE_SIZE.h !== 514) {
    warnings.push(
      `Watch store size is ${WATCH_STORE_SIZE.w}×${WATCH_STORE_SIZE.h} (expected Ultra 3 422×514)`,
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    sceneCount: WATCH_SCENES.length,
    storeSize: WATCH_STORE_SIZE,
  };
}

export function parseRuntimeFilters() {
  const locales = parseListEnv("LOCALES", LOCALES);
  const themes = parseListEnv("THEMES", THEMES);
  const scenes = parseListEnv("SCENES", null);
  const groups = parseListEnv("GROUPS", null);
  const unknownLocales = locales.filter((l) => !LOCALES.includes(l));
  const unknownThemes = themes.filter((t) => !THEMES.includes(t));
  if (unknownLocales.length) throw new Error(`Unknown LOCALES: ${unknownLocales.join(", ")}`);
  if (unknownThemes.length) throw new Error(`Unknown THEMES: ${unknownThemes.join(", ")}`);
  const sceneList = filterScenes({ scenesFilter: scenes, groupsFilter: groups });
  if (!sceneList.length) throw new Error("No scenes matched filters");
  return { locales, themes, scenes: sceneList };
}

function parseListEnv(name, fallbackAll) {
  const raw = (process.env[name] ?? "all").trim();
  if (raw === "all") return fallbackAll ? [...fallbackAll] : null;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function plannedOutputPaths(platform, locales, themes, scenes) {
  const paths = [];
  for (const locale of locales) {
    for (const theme of themes) {
      for (const scene of scenes) {
        paths.push(outputPath(platform, locale, theme, scene.id, "png"));
      }
    }
  }
  return paths;
}

/**
 * Copy marketing scenes into captures/<platform>/<locale>/<theme>/ for both light and dark.
 * Screenshot-studio syncs from STUDIO_THEME (default: light).
 */
export function syncStudioAliases(platform, locale, theme) {
  if (!THEMES.includes(theme)) return [];
  if (!STUDIO_LOCALES.includes(locale)) return [];
  const copied = [];
  for (const [sceneId, aliasFile] of Object.entries(STUDIO_ALIASES)) {
    const src = outputPath(platform, locale, theme, sceneId, "png");
    const dest = studioAliasPath(platform, locale, theme, aliasFile);
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      copied.push(dest);
    }
  }
  return copied;
}

/** Theme folder screenshot-studio should load (default light). */
export function studioThemeForSync() {
  return THEMES.includes(STUDIO_THEME) ? STUDIO_THEME : "light";
}
