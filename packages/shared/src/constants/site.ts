/** Canonical production URLs for Munib Tracker. */
export const OFFICIAL_SITE_ORIGIN = "https://munibtracker.app" as const;

/** Expo web app (PWA) origin. Override with EXPO_PUBLIC_APP_URL at build time. */
export const OFFICIAL_APP_WEB_ORIGIN = "https://my.munibtracker.app" as const;

/** Android application ID (Google Play package name). */
export const OFFICIAL_ANDROID_PACKAGE = "app.munibtracker" as const;

/** iOS bundle identifier (App Store / TestFlight). */
export const OFFICIAL_IOS_BUNDLE_IDENTIFIER = "app.munibtracker" as const;

/**
 * iOS download / App Store URL. Points to the marketing download page until a
 * live App Store listing ID is available — update when the app ships.
 */
export const OFFICIAL_IOS_APP_STORE_URL = `${OFFICIAL_SITE_ORIGIN}/download` as const;

/** Official Google Play listing for the native Android app. */
export const OFFICIAL_ANDROID_PLAY_STORE_URL =
  `https://play.google.com/store/apps/details?id=${OFFICIAL_ANDROID_PACKAGE}` as const;

/** App locales supported in the product (en, ar, ur). */
export type AppLocaleCode = "en" | "ar" | "ur";

export function normalizeAppLocale(raw?: string): AppLocaleCode {
  if (raw === "ar" || raw === "ur") return raw;
  return "en";
}

/** Localized App Store URL — adds a lang hint for non-English locales. */
export function buildLocalizedIosAppStoreUrl(rawLocale?: string): string {
  const locale = normalizeAppLocale(rawLocale);
  if (locale === "en") return OFFICIAL_IOS_APP_STORE_URL;
  const separator = OFFICIAL_IOS_APP_STORE_URL.includes("?") ? "&" : "?";
  return `${OFFICIAL_IOS_APP_STORE_URL}${separator}lang=${locale}`;
}

/** Localized Google Play URL (`hl` query per Play Console locale). */
export function buildLocalizedAndroidPlayStoreUrl(rawLocale?: string): string {
  const locale = normalizeAppLocale(rawLocale);
  const hl = locale === "ur" ? "ur" : locale === "ar" ? "ar" : "en";
  const separator = OFFICIAL_ANDROID_PLAY_STORE_URL.includes("?") ? "&" : "?";
  return `${OFFICIAL_ANDROID_PLAY_STORE_URL}${separator}hl=${encodeURIComponent(hl)}`;
}

/** Absolute marketing site URL (no trailing slash). */
export function buildMarketingSiteUrl(_rawLocale?: string): string {
  return OFFICIAL_SITE_ORIGIN;
}
