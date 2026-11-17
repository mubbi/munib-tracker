/**
 * Maps any route pathname to the primary navigation section it belongs to, so
 * the persistent desktop-web side rail can highlight the right destination on
 * stack screens (e.g. `/quran/2` → Library, `/settings/fonts` → Settings).
 */
export type NavSection = "home" | "tracker" | "library" | "settings" | "search" | "bookmarks";

/** Routes that render without app chrome (first-run, auth handoffs). */
const CHROMELESS_PREFIXES = [
  "/intro",
  "/intro-location",
  "/login",
  "/oauth",
  "/oauth2redirect",
  "/tv-pair",
] as const;

const TRACKER_PREFIXES = [
  "/tracker",
  "/qaza",
  "/calendar",
  "/statistics",
  "/achievements",
  "/journal",
  "/schedule",
  "/mark-current",
  "/ramadan",
] as const;

const SETTINGS_PREFIXES = ["/settings", "/profile", "/notifications", "/credits"] as const;

function matches(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function normalize(pathname: string): string {
  const path = pathname.split(/[?#]/)[0] || "/";
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/** True when the route should render full-bleed, without the desktop rail. */
export function isChromelessRoute(pathname: string): boolean {
  const path = normalize(pathname);
  return CHROMELESS_PREFIXES.some((prefix) => matches(path, prefix));
}

export function resolveNavSection(pathname: string): NavSection {
  const path = normalize(pathname);
  if (path === "/") return "home";
  if (matches(path, "/search")) return "search";
  if (matches(path, "/bookmarks")) return "bookmarks";
  if (TRACKER_PREFIXES.some((prefix) => matches(path, prefix))) return "tracker";
  if (SETTINGS_PREFIXES.some((prefix) => matches(path, prefix))) return "settings";
  // Everything else is reading / learning content reached from the Library.
  return "library";
}
