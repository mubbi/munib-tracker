import seoRoutesData from "./seo-routes.data.json";

/**
 * Per-route SEO registry — the single source of truth for static public routes.
 *
 * The data lives in `seo-routes.data.json` so it can be read both here (by the
 * `<Seo>` component) and by the Node build script `scripts/inject-seo-head.mjs`
 * (which bakes the same metadata into the exported HTML for non-JS crawlers) —
 * with zero duplication. Edit route titles/descriptions in that JSON file.
 *
 * Titles are the page-specific part only — `<Seo>` appends ` · Munib Tracker`
 * (except the home page). Descriptions are written for humans (~150–160 chars),
 * never keyword-stuffed. `index: false` marks utility / private / thin pages
 * that should stay out of search results and the sitemap.
 *
 * Dynamic routes (`/quran/[surah]`, `/dua/[category]`, …) are not listed here;
 * their screens compute metadata from content and pass it to `<Seo>`.
 */
export type RouteSeo = {
  /** Page-specific title. Omit on the home route to use the brand title. */
  title?: string;
  description: string;
  keywords?: readonly string[];
  image?: string;
  imageAlt?: string;
  /** Defaults to `true`. Set `false` to emit `noindex` and skip the sitemap. */
  index?: boolean;
};

export const SEO_ROUTES: Record<string, RouteSeo> = seoRoutesData;

/** Normalize a pathname to a canonical registry key (no trailing slash/query). */
export function normalizePath(path: string): string {
  if (!path) return "/";
  const withoutQuery = path.split(/[?#]/)[0];
  const trimmed = withoutQuery.replace(/\/+$/, "");
  if (trimmed === "") return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function getRouteSeo(path: string): RouteSeo | undefined {
  return SEO_ROUTES[normalizePath(path)];
}
