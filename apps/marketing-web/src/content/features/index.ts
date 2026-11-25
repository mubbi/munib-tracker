import { TRANSLATIONS as arFeatures1 } from "@/content/i18n/ar/features-1";
import { TRANSLATIONS as arFeatures2 } from "@/content/i18n/ar/features-2";
import { TRANSLATIONS as urFeatures1 } from "@/content/i18n/ur/features-1";
import { TRANSLATIONS as urFeatures2 } from "@/content/i18n/ur/features-2";
import { type ContentTranslations, localizeEntries } from "@/content/localized";
import type { FeaturePage, FeatureSlug } from "@/content/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/routing";
import { dailyIslamicHabits } from "./daily-islamic-habits";
import { familyAndFriends } from "./family-and-friends";
import { fastingTracker } from "./fasting-tracker";
import { hadith } from "./hadith";
import { islamicWillAndInheritance } from "./islamic-will-and-inheritance";
import { learnQuran } from "./learn-quran";
import { masjidFinder } from "./masjid-finder";
import { myMadhhab } from "./my-madhhab";
import { prayerTimesQibla } from "./prayer-times-qibla";
import { privateReflection } from "./private-reflection";
import { qazaSalahTracker } from "./qaza-salah-tracker";
import { quran } from "./quran";
import { quranPractice } from "./quran-practice";
import { salahFocusLock } from "./salah-focus-lock";
import { salahTracker } from "./salah-tracker";
import { umrahMode } from "./umrah-mode";
import { widgetsAndDevices } from "./widgets-and-devices";
import { worshipProgress } from "./worship-progress";
import { zikrTracker } from "./zikr-tracker";

/** Display order for hubs and navigation. */
export const FEATURE_PAGES: readonly FeaturePage[] = [
  salahTracker,
  qazaSalahTracker,
  salahFocusLock,
  fastingTracker,
  zikrTracker,
  dailyIslamicHabits,
  worshipProgress,
  quran,
  quranPractice,
  learnQuran,
  hadith,
  prayerTimesQibla,
  masjidFinder,
  myMadhhab,
  umrahMode,
  widgetsAndDevices,
  familyAndFriends,
  privateReflection,
  islamicWillAndInheritance,
];

/** Translated feature pages per locale (see `content/localized.ts`). */
const TRANSLATIONS: ContentTranslations<FeaturePage> = {
  ar: [...arFeatures1, ...arFeatures2],
  ur: [...urFeatures1, ...urFeatures2],
};

/** Feature pages in `locale`, English where a page isn't translated yet. */
export function getFeaturePages(locale: Locale = DEFAULT_LOCALE): readonly FeaturePage[] {
  return localizeEntries(FEATURE_PAGES, TRANSLATIONS, locale, (f) => f.slug);
}

export function getFeature(slug: string, locale: Locale = DEFAULT_LOCALE): FeaturePage | undefined {
  return getFeaturePages(locale).find((f) => f.slug === (slug as FeatureSlug));
}

export function featureHref(slug: FeatureSlug): string {
  return `/features/${slug}`;
}

/** Feature hub groups; titles live in the catalogs (`templates.featureGroups.<id>`). */
export const FEATURE_GROUPS = [
  { id: "track" },
  { id: "quran" },
  { id: "everyday" },
  { id: "life" },
] as const;
