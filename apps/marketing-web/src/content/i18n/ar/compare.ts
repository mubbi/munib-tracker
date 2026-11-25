import { vsAthanAr } from "@/content/i18n/ar/compare/athan";
import { bestSalahTrackerAppsAr } from "@/content/i18n/ar/compare/best-salah-tracker-apps";
import { vsIslam360Ar } from "@/content/i18n/ar/compare/islam360";
import { islamicHabitTrackerAppsAr } from "@/content/i18n/ar/compare/islamic-habit-tracker-apps";
import { vsMuslimProAr } from "@/content/i18n/ar/compare/muslim-pro";
import { vsPillarsAr } from "@/content/i18n/ar/compare/pillars";
import { vsTarteelAr } from "@/content/i18n/ar/compare/tarteel";
import type { ComparePage } from "@/content/types";

/**
 * Arabic translations (compare). Each entry mirrors its English source
 * field for field (same slug, hrefs, dates, statuses, app ids) with
 * translated prose — see `content/localized.ts` and `content/i18n/README.md`.
 * Munib Tracker's cells come from `compare-shared.ts` / `compare-devices.ts`,
 * which follow the English statuses.
 */
export const TRANSLATIONS: readonly ComparePage[] = [
  bestSalahTrackerAppsAr,
  vsMuslimProAr,
  vsIslam360Ar,
  vsTarteelAr,
  vsPillarsAr,
  vsAthanAr,
  islamicHabitTrackerAppsAr,
];
