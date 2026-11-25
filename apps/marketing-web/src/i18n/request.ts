import { locale as rootLocale } from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import { isLocale } from "@/i18n/locales";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/routing";
import { loadMessages } from "@/messages";

/** The `[locale]` root param, or the default where there is none (e.g. `global-not-found`). */
async function currentLocale(): Promise<Locale> {
  try {
    const value = await rootLocale();
    return isLocale(value) ? value : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

/**
 * Per-request next-intl config. The locale comes from `next/root-params`, so
 * pages stay statically prerendered (no `setRequestLocale` / headers needed).
 * Callers outside a `[locale]` route (metadata image routes, sitemap) pass the
 * locale explicitly: `getTranslations({ locale, namespace })`.
 */
export default getRequestConfig(async ({ locale }) => {
  const resolved = isLocale(locale) ? locale : await currentLocale();
  return {
    locale: resolved,
    messages: await loadMessages(resolved),
    timeZone: "UTC",
  };
});
