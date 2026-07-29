import type { AppLocale } from "@munib-tracker/shared/types";
import { normalizePath, type RouteSeo, SEO_ROUTES } from "./seo-routes";

type LocalePack = Record<string, RouteSeo>;

/** Per-locale overlays — loaded on demand so English `/` does not parse ~840 KB of JSON. */
const LOCALE_LOADERS: Partial<Record<AppLocale, () => Promise<{ default: LocalePack }>>> = {
  ar: () => import("./seo-routes-locale/ar.json"),
  az: () => import("./seo-routes-locale/az.json"),
  bn: () => import("./seo-routes-locale/bn.json"),
  bs: () => import("./seo-routes-locale/bs.json"),
  fa: () => import("./seo-routes-locale/fa.json"),
  fr: () => import("./seo-routes-locale/fr.json"),
  ha: () => import("./seo-routes-locale/ha.json"),
  id: () => import("./seo-routes-locale/id.json"),
  kk: () => import("./seo-routes-locale/kk.json"),
  ku: () => import("./seo-routes-locale/ku.json"),
  ky: () => import("./seo-routes-locale/ky.json"),
  ms: () => import("./seo-routes-locale/ms.json"),
  ps: () => import("./seo-routes-locale/ps.json"),
  ru: () => import("./seo-routes-locale/ru.json"),
  so: () => import("./seo-routes-locale/so.json"),
  sq: () => import("./seo-routes-locale/sq.json"),
  sw: () => import("./seo-routes-locale/sw.json"),
  tg: () => import("./seo-routes-locale/tg.json"),
  tk: () => import("./seo-routes-locale/tk.json"),
  tr: () => import("./seo-routes-locale/tr.json"),
  ur: () => import("./seo-routes-locale/ur.json"),
  uz: () => import("./seo-routes-locale/uz.json"),
};

const localeCache = new Map<AppLocale, LocalePack>();
const localeInflight = new Map<AppLocale, Promise<LocalePack>>();

/** Prefetch a locale SEO pack (no-op for `en`). */
export function ensureSeoLocale(locale: AppLocale): Promise<LocalePack | undefined> {
  if (locale === "en") return Promise.resolve(undefined);
  const cached = localeCache.get(locale);
  if (cached) return Promise.resolve(cached);
  const existing = localeInflight.get(locale);
  if (existing) return existing;
  const loader = LOCALE_LOADERS[locale];
  if (!loader) return Promise.resolve(undefined);
  const promise = loader()
    .then((mod) => {
      const pack = (mod.default ?? mod) as LocalePack;
      localeCache.set(locale, pack);
      localeInflight.delete(locale);
      return pack;
    })
    .catch((err) => {
      localeInflight.delete(locale);
      throw err;
    });
  localeInflight.set(locale, promise);
  return promise;
}

/**
 * Resolves SEO metadata for a route, merging the English registry with a
 * locale-specific title/description overlay when one is already cached.
 * Call {@link ensureSeoLocale} first for non-English locales.
 */
export function getRouteSeoForLocale(path: string, locale: AppLocale = "en"): RouteSeo | undefined {
  const key = normalizePath(path);
  const base = SEO_ROUTES[key];
  if (!base) return undefined;
  if (locale === "en") return base;
  const overlay = localeCache.get(locale)?.[key];
  if (!overlay) return base;
  return {
    ...base,
    ...(overlay.title ? { title: overlay.title } : null),
    ...(overlay.description ? { description: overlay.description } : null),
    ...(overlay.imageAlt ? { imageAlt: overlay.imageAlt } : null),
  };
}
