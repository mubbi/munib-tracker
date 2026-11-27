/**
 * Index / noindex policy for exported routes that have NO exact entry in
 * `src/config/seo-routes.data.json` (dynamic topic pages, utility screens).
 * Shared by `inject-seo-head.mjs` (writes the robots meta) and `audit-seo.mjs`
 * (flags accidental noindex) so the two can never disagree.
 *
 * Google drops a page whose initial HTML says `noindex` WITHOUT running its
 * JavaScript, so a wrong default here silently removes whole sections from
 * search — an unknown topic page under an indexable hub must default to index.
 */

/** App-only / private / duplicate screens: always noindex (exact route or below). */
export const NOINDEX_PREFIXES = [
  "/settings",
  "/oauth",
  "/oauth2redirect",
  "/intro",
  "/intro-location",
  "/intro-madhhab",
  "/setup",
  "/login",
  "/mark-current",
  "/tv-pair",
  // Mushaf page reader: QCF glyph-font text that duplicates the /quran/{surah} pages.
  "/quran/page",
  "/quran/practice",
  "/quran/revision",
  // Root-word index pages (client <Seo> is noindex too).
  "/quran/roots",
  "/zikr/session",
  // Counter copies of /duroods/{id}.
  "/tasbeeh/durood",
];

/** A sub-route segment that marks a utility page of a content section. */
export const UTILITY_SEGMENTS = new Set([
  "quiz",
  "progress",
  "journal",
  "favorites",
  "session",
  "summary",
  "edit",
  "import",
  // Tajweed coach / drill exercises (client <Seo> is noindex too).
  "coach",
  "drill",
]);

/** Content sections whose topic pages have no hub route of their own. */
export const HUBLESS_CONTENT_SECTIONS = {
  fiqh: "Madhhab Comparisons",
};

const segmentsOf = (route) => route.split("/").filter(Boolean);

/** Utility / private / duplicate route that must not be indexed. */
export function isUtilityRoute(route) {
  if (NOINDEX_PREFIXES.some((p) => route === p || route.startsWith(`${p}/`))) return true;
  return segmentsOf(route)
    .slice(1)
    .some((segment) => UTILITY_SEGMENTS.has(segment));
}

/** Closest registered ancestor route (`/a/b/c` → `/a/b`, then `/a`), excluding `route`. */
export function nearestRegistryAncestor(route, registry) {
  const segments = segmentsOf(route);
  for (let n = segments.length - 1; n >= 1; n -= 1) {
    const path = `/${segments.slice(0, n).join("/")}`;
    if (registry[path]) return { path, entry: registry[path] };
  }
  return null;
}

/**
 * Policy for a route that is not itself in the registry.
 * - `index: false` + `intentional: true` → utility route, or under a noindex hub
 * - `index: true` → topic page under an indexable hub (or a hub-less content section)
 * - `index: false` + `intentional: false` → unknown page: add it to the registry
 */
export function unregisteredRoutePolicy(route, registry) {
  if (isUtilityRoute(route)) return { index: false, intentional: true, reason: "utility" };
  const segments = segmentsOf(route);
  if (segments.length >= 2) {
    const ancestor = nearestRegistryAncestor(route, registry);
    if (ancestor?.entry.index === false) {
      return { index: false, intentional: true, reason: `under noindex ${ancestor.path}` };
    }
    if (ancestor) return { index: true, hub: ancestor, reason: "topic" };
    const hubless = HUBLESS_CONTENT_SECTIONS[segments[0]];
    if (hubless) return { index: true, hubTitle: hubless, reason: "hubless topic" };
  }
  return { index: false, intentional: false, reason: "not in registry" };
}
