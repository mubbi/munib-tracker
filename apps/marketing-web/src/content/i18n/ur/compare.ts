import type { ComparePage } from "@/content/types";
import { vsAthanUr } from "./compare/athan";
import { bestFreeIslamicAppsUr } from "./compare/best-free-islamic-apps";
import { bestQuranMemorizationAppsUr } from "./compare/best-quran-memorization-apps";
import { bestSalahTrackerAppsUr } from "./compare/best-salah-tracker-apps";
import { vsIslam360Ur } from "./compare/islam360";
import { islamicHabitTrackerAppsUr } from "./compare/islamic-habit-tracker-apps";
import { vsMuslimProUr } from "./compare/muslim-pro";
import { muslimProAlternativesUr } from "./compare/muslim-pro-alternatives";
import { vsPillarsUr } from "./compare/pillars";
import { vsTarteelUr } from "./compare/tarteel";

/**
 * Urdu translations (compare). Each entry mirrors its English source
 * field for field (same slug, hrefs, dates, screenshot keys, Arabic text) with
 * translated prose — see `content/localized.ts` and `content/i18n/README.md`.
 */
export const TRANSLATIONS: readonly ComparePage[] = [
  bestSalahTrackerAppsUr,
  vsMuslimProUr,
  vsIslam360Ur,
  vsTarteelUr,
  vsPillarsUr,
  vsAthanUr,
  islamicHabitTrackerAppsUr,
  muslimProAlternativesUr,
  bestQuranMemorizationAppsUr,
  bestFreeIslamicAppsUr,
];
