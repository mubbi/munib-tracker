import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config";

export { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/config";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // Every page URL carries its locale (`/en/features`, `/ar/features`), so
  // each language has one canonical, crawlable URL. Unprefixed URLs are
  // redirected permanently to English in `next.config.ts`.
  localePrefix: "always",
  // A URL without a locale always means English — no Accept-Language
  // redirects, so no locale cookie is needed either.
  localeDetection: false,
  localeCookie: false,
  // hreflang alternates are emitted by `pageMetadata()` and the sitemap, so
  // skip the duplicate `Link` response header the middleware would add.
  alternateLinks: false,
});
