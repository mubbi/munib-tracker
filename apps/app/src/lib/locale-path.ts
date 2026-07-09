import { APP_LOCALE_CODES, type AppLocale } from "@munib-tracker/shared/i18n";

/** Default locale uses unprefixed paths (`/hadith`); others use `/{code}/hadith`. */
export const LOCALE_PATH_DEFAULT: AppLocale = "en";

const LOCALE_SET = new Set<string>(APP_LOCALE_CODES);

/** Session storage key set by the web boot script on locale-prefixed entry URLs. */
export const MUNIB_LOCALE_BOOT_KEY = "munib-locale-boot";

export function isAppLocaleCode(code: string): code is AppLocale {
  return LOCALE_SET.has(code);
}

/** Strip an optional leading `/{locale}` segment from a pathname. */
export function stripLocalePrefix(pathname: string): {
  locale: AppLocale | null;
  path: string;
} {
  const normalized = pathname.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const match = normalized.match(/^\/([a-z]{2})(\/.*)?$/);
  if (!match?.[1] || !isAppLocaleCode(match[1]) || match[1] === LOCALE_PATH_DEFAULT) {
    return { locale: null, path: normalized };
  }
  const rest = match[2] ?? "/";
  const path = rest === "" ? "/" : rest.startsWith("/") ? rest : `/${rest}`;
  return { locale: match[1], path };
}

/** Prepend a locale segment for SEO URLs (identity for default locale). */
export function prependLocalePath(path: string, locale: AppLocale): string {
  const normalized = path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === LOCALE_PATH_DEFAULT) return normalized || "/";
  return `/${locale}${normalized}`;
}

/** Absolute or relative localized URL for hreflang/canonical (path-only when origin omitted). */
export function localizedUrl(path: string, locale: AppLocale, origin?: string): string {
  const localized = prependLocalePath(path.startsWith("/") ? path : `/${path}`, locale);
  if (!origin) return localized;
  const base = origin.replace(/\/+$/, "");
  return `${base}${localized === "/" ? "" : localized}`;
}

/** Inline script injected into static HTML before the app bundle (web only). */
export const LOCALE_PATH_BOOT_SCRIPT = `(function(){try{var p=location.pathname.replace(/\\/+$/,'')||'/';var m=p.match(/^\\/([a-z]{2})(\\/.*)?$/);if(!m||m[1]==='en')return;var loc=m[1];var appPath=m[2]||'/';sessionStorage.setItem('${MUNIB_LOCALE_BOOT_KEY}',loc);history.replaceState({munibLocale:loc},'',appPath+location.search+location.hash);}catch(e){}})();`;
