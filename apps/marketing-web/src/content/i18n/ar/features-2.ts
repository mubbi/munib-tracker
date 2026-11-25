import type { FeaturePage } from "@/content/types";
import { familyAndFriends } from "./features/family-and-friends";
import { hadith } from "./features/hadith";
import { islamicWillAndInheritance } from "./features/islamic-will-and-inheritance";
import { masjidFinder } from "./features/masjid-finder";
import { myMadhhab } from "./features/my-madhhab";
import { prayerTimesQibla } from "./features/prayer-times-qibla";
import { privateReflection } from "./features/private-reflection";
import { umrahMode } from "./features/umrah-mode";
import { widgetsAndDevices } from "./features/widgets-and-devices";

/**
 * Arabic translations (features-2). Each entry mirrors its English source
 * field for field (same slug, hrefs, dates, screenshot keys, Arabic text) with
 * translated prose — see `content/localized.ts` and `content/i18n/README.md`.
 */
export const TRANSLATIONS: readonly FeaturePage[] = [
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
