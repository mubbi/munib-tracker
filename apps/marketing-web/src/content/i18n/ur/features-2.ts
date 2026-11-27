import type { FeaturePage } from "@/content/types";
import { namesOfAllahUr } from "./features/99-names-of-allah";
import { duasHisnulMuslimUr } from "./features/duas-hisnul-muslim";
import { familyAndFriendsUr } from "./features/family-and-friends";
import { hadithUr } from "./features/hadith";
import { hijriCalendarUr } from "./features/hijri-calendar";
import { islamicWillAndInheritanceUr } from "./features/islamic-will-and-inheritance";
import { kidsModeUr } from "./features/kids-mode";
import { masjidFinderUr } from "./features/masjid-finder";
import { myMadhhabUr } from "./features/my-madhhab";
import { prayerTimesQiblaUr } from "./features/prayer-times-qibla";
import { privateReflectionUr } from "./features/private-reflection";
import { qiblaFinderUr } from "./features/qibla-finder";
import { umrahModeUr } from "./features/umrah-mode";
import { widgetsAndDevicesUr } from "./features/widgets-and-devices";
import { zakatCalculatorUr } from "./features/zakat-calculator";

/**
 * Urdu translations (features-2). Each entry mirrors its English source
 * field for field (same slug, hrefs, dates, screenshot keys, Arabic text) with
 * translated prose — see `content/localized.ts` and `content/i18n/README.md`.
 */
export const TRANSLATIONS: readonly FeaturePage[] = [
  hadithUr,
  prayerTimesQiblaUr,
  masjidFinderUr,
  myMadhhabUr,
  umrahModeUr,
  widgetsAndDevicesUr,
  familyAndFriendsUr,
  privateReflectionUr,
  islamicWillAndInheritanceUr,
  duasHisnulMuslimUr,
  namesOfAllahUr,
  zakatCalculatorUr,
  qiblaFinderUr,
  hijriCalendarUr,
  kidsModeUr,
];
