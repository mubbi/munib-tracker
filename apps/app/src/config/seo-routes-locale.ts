import type { AppLocale } from "@munib-tracker/shared/types";
import { normalizePath, type RouteSeo, SEO_ROUTES } from "./seo-routes";
import ar from "./seo-routes-locale/ar.json";
import az from "./seo-routes-locale/az.json";
import bn from "./seo-routes-locale/bn.json";
import bs from "./seo-routes-locale/bs.json";
import fa from "./seo-routes-locale/fa.json";
import fr from "./seo-routes-locale/fr.json";
import ha from "./seo-routes-locale/ha.json";
import id from "./seo-routes-locale/id.json";
import kk from "./seo-routes-locale/kk.json";
import ku from "./seo-routes-locale/ku.json";
import ky from "./seo-routes-locale/ky.json";
import ms from "./seo-routes-locale/ms.json";
import ps from "./seo-routes-locale/ps.json";
import ru from "./seo-routes-locale/ru.json";
import so from "./seo-routes-locale/so.json";
import sq from "./seo-routes-locale/sq.json";
import sw from "./seo-routes-locale/sw.json";
import tg from "./seo-routes-locale/tg.json";
import tk from "./seo-routes-locale/tk.json";
import tr from "./seo-routes-locale/tr.json";
import ur from "./seo-routes-locale/ur.json";
import uz from "./seo-routes-locale/uz.json";

/** Per-locale route SEO overlays — title/description translated; structural flags from English registry. */
const LOCALE_ROUTE_SEO: Partial<Record<AppLocale, Record<string, RouteSeo>>> = {
  ar,
  az,
  bn,
  bs,
  fa,
  fr,
  ha,
  id,
  kk,
  ku,
  ky,
  ms,
  ps,
  ru,
  so,
  sq,
  sw,
  tg,
  tk,
  tr,
  ur,
  uz,
};

/**
 * Resolves SEO metadata for a route, merging the English registry with a
 * locale-specific title/description overlay when one exists.
 */
export function getRouteSeoForLocale(path: string, locale: AppLocale = "en"): RouteSeo | undefined {
  const key = normalizePath(path);
  const base = SEO_ROUTES[key];
  if (!base) return undefined;
  if (locale === "en") return base;
  const overlay = LOCALE_ROUTE_SEO[locale]?.[key];
  if (!overlay) return base;
  return {
    ...base,
    ...(overlay.title ? { title: overlay.title } : null),
    ...(overlay.description ? { description: overlay.description } : null),
    ...(overlay.imageAlt ? { imageAlt: overlay.imageAlt } : null),
  };
}
