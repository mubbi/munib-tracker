import { LOCALES, type Locale } from "@/i18n/routing";

export type LocaleMeta = {
  /** Name of the language in that language (shown in the language picker). */
  nativeName: string;
  /** Name of the language in English (accessible hint next to the native name). */
  englishName: string;
  dir: "ltr" | "rtl";
  /** Open Graph `og:locale` value. */
  ogLocale: string;
  /** BCP 47 tag for `hreflang`, `<html lang>` and schema.org `inLanguage`. */
  hreflang: string;
};

/** Display and SEO metadata for every published locale. */
export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: {
    nativeName: "English",
    englishName: "English",
    dir: "ltr",
    ogLocale: "en_US",
    hreflang: "en",
  },
  ar: {
    nativeName: "العربية",
    englishName: "Arabic",
    dir: "rtl",
    ogLocale: "ar_AR",
    hreflang: "ar",
  },
  ur: {
    nativeName: "اردو",
    englishName: "Urdu",
    dir: "rtl",
    ogLocale: "ur_PK",
    hreflang: "ur",
  },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Path for `pathname` (no locale prefix, starting with "/") in `locale`: `/en/features`. */
export function localizedPath(pathname: string, locale: Locale): string {
  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

/** Strips a leading locale segment: `/ur/features` → `/features`. */
export function stripLocalePrefix(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (!isLocale(first)) return pathname;
  return rest.length ? `/${rest.join("/")}` : "/";
}
