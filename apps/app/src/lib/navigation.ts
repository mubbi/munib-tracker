import { type Href, usePathname, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";

type RouterLike = {
  back: () => void;
  replace: (href: Href) => void;
  canDismiss: () => boolean;
};

/** Tab roots — the top of every back ladder. */
const TAB_ROOTS: ReadonlySet<string> = new Set(["/", "/tracker", "/library", "/settings"]);

/**
 * Entry / system routes with no meaningful parent (auth, onboarding, OAuth
 * return, TV pairing, 404, cold-start actions). Back is the caller's fallback.
 */
const NO_PARENT: ReadonlySet<string> = new Set([
  "/login",
  "/intro",
  "/intro-location",
  "/intro-madhhab",
  "/setup",
  "/oauth2redirect",
  "/tv-pair",
  "/mark-current",
  "/+not-found",
  // Opened from Home (top-bar search / bell) or as a one-off walkthrough:
  // without history, Back lands on Home rather than a hub.
  "/search",
  "/notifications",
  "/tour",
]);

/**
 * Routes whose parent is not simply "drop the last segment" — folders without
 * an index screen, or detail screens that belong to a sibling list. First match
 * wins; `$1` etc. are regex captures.
 */
const PARENT_OVERRIDES: ReadonlyArray<readonly [RegExp, string]> = [
  [/^\/oauth\//, ""],
  [/^\/circle\/join\//, "/circles"],
  [/^\/dua\/detail\//, "/dua"],
  [/^\/zikr\/detail\//, "/zikr"],
  [/^\/zikr\/session\//, "/zikr"],
  [/^\/tasbeeh(\/|$)/, "/zikr"],
  [/^\/quran\/page\//, "/quran"],
  [/^\/quran\/roots\//, "/quran"],
  [/^\/learn-quran\/story\//, "/learn-quran/stories"],
  [/^\/learn-quran\/theme\//, "/learn-quran/themes"],
  [/^\/learn-quran\/tajweed\/(coach|drill)\//, "/learn-quran/tajweed"],
  [/^\/family\/child\//, "/family"],
  [/^\/masjids\/[^/]+\/[^/]+$/, "/masjids"],
  [/^\/fiqh\//, "/library"],
  // Account and about screens live under the Settings tab.
  [/^\/profile$/, "/settings"],
  [/^\/credits$/, "/settings/about"],
];

/**
 * The logical parent hub of `pathname` (query / hash / trailing slash and route
 * groups are ignored), or `null` for a tab root or an entry route that has none.
 * Top-level destinations resolve to the Library, settings sub-screens to
 * Settings, and everything else drops its last path segment.
 */
export function parentRouteFor(pathname: string): string | null {
  const clean = pathname.split(/[?#]/)[0].replace(/\/\([^/]+\)/g, "");
  const path = `/${clean.split("/").filter(Boolean).join("/")}`;
  if (TAB_ROOTS.has(path) || NO_PARENT.has(path)) return null;
  for (const [pattern, parent] of PARENT_OVERRIDES) {
    if (pattern.test(path)) return parent === "" ? null : parent;
  }
  const segments = path.split("/").filter(Boolean);
  if (segments.length <= 1) return "/library";
  return `/${segments.slice(0, -1).join("/")}`;
}

/**
 * The focused route's pathname, mirrored by {@link useTrackCurrentPathname} in
 * the root stack. Lets every `goBackOrReplace(router, "/")` call site fall back
 * to its parent hub without threading `usePathname()` through each screen.
 */
let currentPathname: string | null = null;

/** Records the focused pathname (root stack only; tests may call it directly). */
export function setCurrentPathname(pathname: string | null): void {
  currentPathname = pathname;
}

/** The pathname last recorded by {@link setCurrentPathname}, or `null` before the first route. */
export function getCurrentPathname(): string | null {
  return currentPathname;
}

/** Mirrors `usePathname()` into {@link getCurrentPathname}. Mount once, in the root stack. */
export function useTrackCurrentPathname(): void {
  const pathname = usePathname();
  useEffect(() => {
    setCurrentPathname(pathname);
  }, [pathname]);
}

/**
 * Pop the nearest stack when possible; otherwise replace with a safe fallback.
 * Prefer this over `router.canGoBack() ? router.back() : router.replace(...)`.
 * `canGoBack()` can be true while no navigator handles GO_BACK (nested stacks,
 * deep links, modals), which triggers the dev-only LogBox warning.
 *
 * When the supplied `fallback` is the generic `"/"` and the current pathname is
 * known (the `pathname` argument, else the one tracked by the root stack), the
 * screen's parent hub (`parentRouteFor`) is used instead so a deep-linked or
 * reloaded screen lands on its hub, not on Home. Explicit fallbacks are kept.
 */
export function goBackOrReplace(router: RouterLike, fallback: Href, pathname?: string): void {
  if (router.canDismiss()) {
    router.back();
    return;
  }
  const from = pathname ?? currentPathname;
  const parent = fallback === "/" && from ? parentRouteFor(from) : null;
  router.replace((parent ?? fallback) as Href);
}

/** `goBackOrReplace` bound to the current route — pass no fallback to land on the parent hub. */
export function useGoBack(fallback: Href = "/"): () => void {
  const router = useRouter();
  const pathname = usePathname();
  return useCallback(
    () => goBackOrReplace(router, fallback, pathname),
    [router, fallback, pathname],
  );
}
