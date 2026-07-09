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
  studioAliasPath,
  THEMES,
  TIMING,
  WORK_DIR,
} from "./config.mjs";
import { demoReadyMarkers } from "./demo-data.mjs";
import { validateI18nKeys } from "./i18n.mjs";
import { filterScenes, SCENES, sceneCount } from "./scenes.mjs";
import { commandExists } from "./shell.mjs";

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
    "validate.mjs",
    "lib/config.mjs",
    "lib/demo-data.mjs",
    "lib/scenes.mjs",
    "lib/maestro.mjs",
    "lib/inject-storage-android.mjs",
    "lib/inject-storage-ios.mjs",
  ]) {
    const full = path.join(APP_ROOT, "scripts", "screenshots", file);
    if (!fs.existsSync(full)) errors.push(`Missing file: ${file}`);
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

  const missingI18n = validateI18nKeys(REQUIRED_I18N);
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
    if (!commandExists("xcrun")) warnings.push("xcrun not on PATH (required for capture-ios.mjs)");
  } else {
    warnings.push("capture-ios.mjs requires macOS + Xcode Simulator");
  }
  if (!commandExists("maestro")) {
    warnings.push("maestro not on PATH — install for automated navigation captures");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    sceneCount: sceneCount(),
    matrixSize: LOCALES.length * THEMES.length * sceneCount(),
    outputRoot: OUTPUT_ROOT,
    studioRoot: STUDIO_CAPTURE_ROOT,
    workDir: WORK_DIR,
    timing: TIMING,
    appIds: APP_ID,
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

export function syncStudioAliases(platform, locale, theme) {
  if (theme !== "dark") return [];
  const copied = [];
  for (const [sceneId, aliasFile] of Object.entries(STUDIO_ALIASES)) {
    const src = outputPath(platform, locale, theme, sceneId, "png");
    const dest = studioAliasPath(locale, aliasFile);
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      copied.push(dest);
    }
  }
  return copied;
}
