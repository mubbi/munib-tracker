import fs from "node:fs";
import path from "node:path";
import { APP_ROOT, LOCALES } from "./config.mjs";

const I18N_DIR = path.join(APP_ROOT, "src", "i18n");

const cache = new Map();

/** Load a locale JSON catalog (falls back to en when a key lookup needs a base). */
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

/** Dot-path lookup: t("tabs.home") — falls back to English when missing. */
export function translate(locale, key) {
  const value = lookup(loadLocaleBundle(locale), key);
  if (typeof value === "string") return value;
  if (locale !== "en") {
    const en = lookup(loadLocaleBundle("en"), key);
    if (typeof en === "string") return en;
  }
  return null;
}

function lookup(bundle, key) {
  const parts = key.split(".");
  let node = bundle;
  for (const part of parts) {
    if (node == null || typeof node !== "object") return null;
    node = node[part];
  }
  return node;
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

/**
 * Validate that every i18n key referenced by automation exists for each locale
 * (English fallback is allowed at runtime, but catalogs should still define keys).
 */
export function validateI18nKeys(keys, locales = LOCALES) {
  const missing = [];
  for (const locale of locales) {
    const file = path.join(I18N_DIR, `${locale}.json`);
    if (!fs.existsSync(file)) {
      missing.push(`${locale}:(missing catalog file)`);
      continue;
    }
    for (const key of keys) {
      const value = lookup(loadLocaleBundle(locale), key);
      if (typeof value !== "string" || !value.trim()) {
        // Soft: English fallback covers runtime; only hard-fail when en is missing.
        if (locale === "en") missing.push(`${locale}:${key}`);
      }
    }
  }
  return missing;
}
