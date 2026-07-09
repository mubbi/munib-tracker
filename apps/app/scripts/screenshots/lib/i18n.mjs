import fs from "node:fs";
import path from "node:path";
import { APP_ROOT } from "./config.mjs";

const I18N_DIR = path.join(APP_ROOT, "src", "i18n");

const cache = new Map();

/** Load en/ar/ur JSON once. */
export function loadLocaleBundle(locale) {
  if (cache.has(locale)) return cache.get(locale);
  const file = path.join(I18N_DIR, `${locale}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing i18n file: ${file}`);
  }
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  cache.set(locale, json);
  return json;
}

/** Dot-path lookup: t("tabs.home") */
export function translate(locale, key) {
  const bundle = loadLocaleBundle(locale);
  const parts = key.split(".");
  let node = bundle;
  for (const part of parts) {
    if (node == null || typeof node !== "object") return null;
    node = node[part];
  }
  return typeof node === "string" ? node : null;
}

export function tabLabels(locale) {
  return {
    home: translate(locale, "tabs.home"),
    tracker: translate(locale, "tabs.tracker"),
    library: translate(locale, "tabs.library"),
    settings: translate(locale, "tabs.settings"),
  };
}

export function appearanceModeLabels(locale) {
  return {
    light: translate(locale, "appearance.modeLight"),
    dark: translate(locale, "appearance.modeDark"),
    system: translate(locale, "appearance.modeSystem"),
  };
}

export function onboardingLabels(locale) {
  return {
    next: translate(locale, "common.next"),
    begin: translate(locale, "onboarding.begin"),
    skip: translate(locale, "common.skip"),
  };
}

export function prayerNames(locale) {
  return {
    fajr: translate(locale, "prayers.fajr"),
    dhuhr: translate(locale, "prayers.dhuhr"),
    asr: translate(locale, "prayers.asr"),
    maghrib: translate(locale, "prayers.maghrib"),
    isha: translate(locale, "prayers.isha"),
  };
}

export function prayerStatusLabels(locale) {
  return {
    completed: translate(locale, "prayerStatus.completed"),
    missed: translate(locale, "prayerStatus.missed"),
    delayed: translate(locale, "prayerStatus.delayed"),
    pending: translate(locale, "prayerStatus.pending"),
  };
}

/** Validate that every i18n key referenced by automation exists in all locales. */
export function validateI18nKeys(keys) {
  const missing = [];
  for (const locale of ["en", "ar", "ur"]) {
    for (const key of keys) {
      const value = translate(locale, key);
      if (!value) missing.push(`${locale}:${key}`);
    }
  }
  return missing;
}
