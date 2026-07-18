/** Canonical production URLs for Munib Tracker. */
export const OFFICIAL_SITE_ORIGIN = "https://munibtracker.app" as const;

/** NestJS API origin (no path prefix). Override clients with EXPO_PUBLIC_API_URL / NEXT_PUBLIC_API_URL. */
export const OFFICIAL_API_ORIGIN = "https://api.munibtracker.app" as const;

/** Expo web app (PWA) origin. Override with EXPO_PUBLIC_APP_URL at build time. */
export const OFFICIAL_APP_WEB_ORIGIN = "https://my.munibtracker.app" as const;

/** Super-admin console origin. */
export const OFFICIAL_ADMIN_ORIGIN = "https://admin.munibtracker.app" as const;

/** Android application ID (Google Play package name). */
export const OFFICIAL_ANDROID_PACKAGE = "app.munibtracker" as const;

/** iOS bundle identifier (App Store / TestFlight). */
export const OFFICIAL_IOS_BUNDLE_IDENTIFIER = "app.munibtracker" as const;

/** Numeric App Store Connect / iTunes app ID. */
export const OFFICIAL_IOS_APP_STORE_ID = "6787222180" as const;

/**
 * Official App Store listing URL.
 * Uses the numeric app ID so the link resolves as soon as the listing is live.
 */
export const OFFICIAL_IOS_APP_STORE_URL =
  `https://apps.apple.com/app/id${OFFICIAL_IOS_APP_STORE_ID}` as const;

/** Official Google Play listing for the native Android app. */
export const OFFICIAL_ANDROID_PLAY_STORE_URL =
  `https://play.google.com/store/apps/details?id=${OFFICIAL_ANDROID_PACKAGE}` as const;

/** App locales supported for storefront URL hints (en, ar, ur). */
export type AppLocaleCode = "en" | "ar" | "ur";

export function normalizeAppLocale(raw?: string): AppLocaleCode {
  if (raw === "ar" || raw === "ur") return raw;
  return "en";
}

/** App Store country path for a UI locale hint (Apple still geo-routes by storefront). */
const IOS_STORE_COUNTRY: Record<AppLocaleCode, string | null> = {
  en: null,
  ar: "sa",
  ur: "pk",
};

/** Localized App Store URL — optional country storefront for ar/ur. */
export function buildLocalizedIosAppStoreUrl(rawLocale?: string): string {
  const locale = normalizeAppLocale(rawLocale);
  const country = IOS_STORE_COUNTRY[locale];
  if (!country) return OFFICIAL_IOS_APP_STORE_URL;
  return `https://apps.apple.com/${country}/app/id${OFFICIAL_IOS_APP_STORE_ID}`;
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
