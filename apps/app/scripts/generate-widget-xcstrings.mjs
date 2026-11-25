#!/usr/bin/env node
/**
 * Regenerates `targets/munib-tracker-widgets/Localizable.xcstrings` (iOS widget
 * gallery names / descriptions + Control Center control names) from the app
 * catalogs in `src/i18n/*.json`, so every app locale is covered and the iOS
 * picker never drifts from the Android one (`plugins/withAndroidWidgetGallery.cjs`).
 *
 *   node scripts/generate-widget-xcstrings.mjs          # write
 *   node scripts/generate-widget-xcstrings.mjs --check  # exit 1 when out of date
 *
 * `widget-xcstrings.test.ts` runs the check in Jest.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(APP, "targets/munib-tracker-widgets/Localizable.xcstrings");

export const WIDGET_XCSTRINGS_LOCALES = [
  "en",
  "ar",
  "az",
  "bn",
  "bs",
  "fa",
  "fr",
  "ha",
  "hi",
  "id",
  "kk",
  "ku",
  "ky",
  "ms",
  "ps",
  "ru",
  "so",
  "sq",
  "sw",
  "tg",
  "tk",
  "tr",
  "ur",
  "uz",
];

/** Apple language ids that differ from the app locale (Kurdish here is Sorani). */
const APPLE_LANGUAGE = { ku: "ckb" };

export const WIDGET_GALLERY_KEYS = [
  "nextPrayer",
  "schedule",
  "progress",
  "streak",
  "qaza",
  "ramadan",
  "khatm",
  "dailyHadith",
  "hijriDate",
  "qibla",
  "tasbeeh",
  "friday",
  "adhkar",
  "events",
];

/** Control copy that has no app catalog key yet (Phase 1 locales; others fall back to English). */
const CONTROL_COPY = {
  "control.markSalah.description": {
    en: "Mark the Salah whose time has begun as prayed.",
    ar: "سجّل الصلاة التي دخل وقتها كمؤدّاة.",
    ur: "جس نماز کا وقت شروع ہو چکا ہے اسے ادا شدہ درج کریں۔",
  },
  "control.open.label": {
    en: "Open in Munib Tracker",
    ar: "فتح في التطبيق",
    ur: "ایپ میں کھولیں",
  },
  "control.open.description": {
    en: "Open Qibla, Tasbeeh, Qur'an or another screen in one tap.",
    ar: "افتح القبلة أو التسبيح أو القرآن أو شاشة أخرى بلمسة واحدة.",
    ur: "ایک ٹیپ میں قبلہ، تسبیح، قرآن یا کوئی اور اسکرین کھولیں۔",
  },
};

const unit = (value) => ({ stringUnit: { state: "translated", value } });

export function buildWidgetXcstrings() {
  const catalogs = Object.fromEntries(
    WIDGET_XCSTRINGS_LOCALES.map((locale) => [
      locale,
      JSON.parse(readFileSync(join(APP, `src/i18n/${locale}.json`), "utf8")),
    ]),
  );
  const strings = {};
  const collect = (read) => {
    const localizations = {};
    for (const locale of WIDGET_XCSTRINGS_LOCALES) {
      const value = read(catalogs[locale]);
      if (typeof value === "string" && value.trim()) {
        localizations[APPLE_LANGUAGE[locale] ?? locale] = unit(value);
      }
    }
    return { localizations };
  };
  for (const key of WIDGET_GALLERY_KEYS) {
    for (const field of ["label", "description"]) {
      const entry = collect((catalog) => catalog.widgets?.gallery?.[key]?.[field]);
      if (!entry.localizations.en)
        throw new Error(`en.json is missing widgets.gallery.${key}.${field}`);
      strings[`widget.gallery.${key}.${field}`] = entry;
    }
  }
  strings["control.markSalah.label"] = collect((catalog) => catalog.widgets?.markSalah);
  for (const [key, copy] of Object.entries(CONTROL_COPY)) {
    strings[key] = {
      localizations: Object.fromEntries(Object.entries(copy).map(([l, v]) => [l, unit(v)])),
    };
  }
  const sorted = Object.fromEntries(Object.entries(strings).sort(([a], [b]) => a.localeCompare(b)));
  return `${JSON.stringify({ sourceLanguage: "en", strings: sorted, version: "1.0" }, null, 2)}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const next = buildWidgetXcstrings();
  if (process.argv.includes("--check")) {
    const current = readFileSync(OUT, "utf8");
    if (current !== next) {
      console.error(
        "Localizable.xcstrings is out of date: run node scripts/generate-widget-xcstrings.mjs",
      );
      process.exit(1);
    }
  } else {
    writeFileSync(OUT, next);
    console.log(`wrote ${OUT}`);
  }
}
