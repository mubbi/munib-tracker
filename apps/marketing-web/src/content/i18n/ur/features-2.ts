import type { FeaturePage } from "@/content/types";
import { familyAndFriendsUr } from "./features/family-and-friends";
import { hadithUr } from "./features/hadith";
import { islamicWillAndInheritanceUr } from "./features/islamic-will-and-inheritance";
import { masjidFinderUr } from "./features/masjid-finder";
import { myMadhhabUr } from "./features/my-madhhab";
import { prayerTimesQiblaUr } from "./features/prayer-times-qibla";
import { privateReflectionUr } from "./features/private-reflection";
import { umrahModeUr } from "./features/umrah-mode";
import { widgetsAndDevicesUr } from "./features/widgets-and-devices";

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
];
