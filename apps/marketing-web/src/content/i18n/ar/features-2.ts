import type { FeaturePage } from "@/content/types";
import { namesOfAllah } from "./features/99-names-of-allah";
import { duasHisnulMuslim } from "./features/duas-hisnul-muslim";
import { familyAndFriends } from "./features/family-and-friends";
import { hadith } from "./features/hadith";
import { hijriCalendar } from "./features/hijri-calendar";
import { islamicWillAndInheritance } from "./features/islamic-will-and-inheritance";
import { kidsMode } from "./features/kids-mode";
import { masjidFinder } from "./features/masjid-finder";
import { myMadhhab } from "./features/my-madhhab";
import { prayerTimesQibla } from "./features/prayer-times-qibla";
import { privateReflection } from "./features/private-reflection";
import { qiblaFinder } from "./features/qibla-finder";
import { umrahMode } from "./features/umrah-mode";
import { widgetsAndDevices } from "./features/widgets-and-devices";
import { zakatCalculator } from "./features/zakat-calculator";

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
  duasHisnulMuslim,
  namesOfAllah,
  zakatCalculator,
  qiblaFinder,
  hijriCalendar,
  kidsMode,
];
