import { TRANSLATIONS as arCompare } from "@/content/i18n/ar/compare";
import { TRANSLATIONS as urCompare } from "@/content/i18n/ur/compare";
import { type ContentTranslations, localizeEntries } from "@/content/localized";
import type { ComparePage } from "@/content/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/routing";
import { vsAthan } from "./athan";
import { bestFreeIslamicApps } from "./best-free-islamic-apps";
import { bestQuranMemorizationApps } from "./best-quran-memorization-apps";
import { bestSalahTrackerApps } from "./best-salah-tracker-apps";
import { vsIslam360 } from "./islam360";
import { islamicHabitTrackerApps } from "./islamic-habit-tracker-apps";
import { vsMuslimPro } from "./muslim-pro";
import { muslimProAlternatives } from "./muslim-pro-alternatives";
import { vsPillars } from "./pillars";
import { vsTarteel } from "./tarteel";

export const COMPARE_PAGES: readonly ComparePage[] = [
  bestSalahTrackerApps,
  vsMuslimPro,
  vsIslam360,
  vsTarteel,
  vsPillars,
  vsAthan,
  islamicHabitTrackerApps,
  muslimProAlternatives,
  bestQuranMemorizationApps,
  bestFreeIslamicApps,
];

/** Translated comparison pages per locale (see `content/localized.ts`). */
const TRANSLATIONS: ContentTranslations<ComparePage> = {
  ar: arCompare,
  ur: urCompare,
};

/** Comparison pages in `locale`, English where a page isn't translated yet. */
export function getComparePages(locale: Locale = DEFAULT_LOCALE): readonly ComparePage[] {
  return localizeEntries(COMPARE_PAGES, TRANSLATIONS, locale, (c) => c.slug);
}

export function getComparison(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): ComparePage | undefined {
  return getComparePages(locale).find((c) => c.slug === slug);
}

export function compareHref(slug: string): string {
  return `/compare/${slug}`;
}
