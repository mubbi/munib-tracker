/**
 * Home modules the user can hide (NF-1.21). Optional wave-3 cards use the ids
 * their home components check in `hiddenHomeModules` (`VOLUNTARY_FASTING_HOME_MODULE`,
 * `RAWATIB_HOME_MODULE_ID`, `SUNNAH_HABITS_HOME_MODULE`, `DHUL_HIJJAH_HOME_MODULE`,
 * `MUHASABAH_HOME_MODULE`, `FAMILY_TIES_HOME_MODULE`) — literals here so Settings
 * doesn't import the cards; `home-modules.test.ts` keeps them in sync.
 */
export const HOME_MODULES = [
  "continue",
  "knowledge",
  "quickActions",
  "khatm",
  "qaza",
  "schedule",
  "rawatib-progress",
  "voluntary-fasting",
  "sunnah-habits",
  "dhul-hijjah",
  "muhasabah",
  "family-ties-due",
  // NF-3.14 weekly reflection card (`COACH_HOME_MODULE`).
  "weekly-coach",
  // NF-3.4 "Continue your Umrah" card (`UMRAH_HOME_MODULE`).
  "umrah-mode",
  // NF-2.23 seasonal banners (`SEASONAL_BANNER_HOME_MODULE`); per-season hiding is on the banner.
  "seasonal-banner",
  // D68 "N ayahs to revise" card (`QURAN_REVISION_HOME_MODULE`).
  "quran-revision",
] as const;
