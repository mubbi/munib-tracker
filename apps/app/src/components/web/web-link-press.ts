/**
 * Client-side navigation for a react-native-web `Pressable` rendered as a real
 * `<a href>` (pass `href` and RN Web emits an anchor).
 *
 * Why not expo-router `<Link asChild>` around a `Pressable`: its Radix `Slot`
 * merges `style` by object spread, which drops a Pressable's `style` callback,
 * and on web it hands the child an `onClick` that RN Web's own press `onClick`
 * overrides — the anchor would then do a full page load.
 *
 * Same contract as `Link`: a plain left click is handled in-app (default
 * prevented, `router.navigate`), while Ctrl / Cmd / Shift / Alt clicks fall
 * through to the browser (new tab / window). Middle-click never fires
 * `click`, so the browser opens the link in a new tab natively.
 */
type MouseEventLike = {
  defaultPrevented?: boolean;
  button?: number;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  preventDefault?: () => void;
};

/** True when the browser should handle the click itself (new tab / window / download). */
export function isModifiedClick(event: unknown): boolean {
  const e = (event ?? {}) as MouseEventLike;
  if (e.defaultPrevented) return true;
  if (e.button != null && e.button !== 0) return true;
  return Boolean(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
}

/**
 * Builds the `onPress` for an in-app anchor: runs `navigate` for a plain click
 * and stops the browser's own full-page navigation.
 */
export function inAppLinkPress(navigate: () => void): (event?: unknown) => void {
  return (event) => {
    if (isModifiedClick(event)) return;
    (event as MouseEventLike | undefined)?.preventDefault?.();
    navigate();
  };
}

/**
 * A plain path for an `<a href>` from an expo-router `Href`, or `undefined` when
 * it is not a concrete in-app path (object hrefs, external URLs, unresolved
 * `[param]` templates) — those keep button semantics.
 */
export function anchorHref(route: unknown): string | undefined {
  if (typeof route !== "string") return undefined;
  if (!route.startsWith("/") || route.startsWith("//") || /[[\]]/.test(route)) return undefined;
  return route;
}
