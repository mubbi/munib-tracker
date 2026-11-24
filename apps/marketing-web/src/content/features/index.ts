import type { FeaturePage, FeatureSlug } from "@/content/types";
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

const BY_SLUG = new Map(FEATURE_PAGES.map((f) => [f.slug, f]));

export function getFeature(slug: string): FeaturePage | undefined {
  return BY_SLUG.get(slug as FeatureSlug);
}

export function featureHref(slug: FeatureSlug): string {
  return `/features/${slug}`;
}

export const FEATURE_GROUPS = [
  { id: "track", title: "Track your worship" },
  { id: "quran", title: "Qur'an and hadith" },
  { id: "everyday", title: "Everyday tools" },
  { id: "life", title: "Family and life" },
] as const;
