import { usePathname, useSegments } from "expo-router";
import { Platform } from "react-native";

/** Routes where the native bottom tab bar is visible. */
const TAB_ROOT_PATHS = new Set(["/", "/index", "/tracker", "/library", "/settings"]);

/**
 * Labeled native tab bar body height (above the home indicator / gesture bar).
 * Kept in sync with `NativeTabs` + `labelVisibilityMode="labeled"`.
 */
const NATIVE_TAB_BAR_BODY = Platform.select({ ios: 49, android: 80 }) ?? 56;

/** Whether the current screen sits inside the `(tabs)` layout. */
export function useIsTabScreen(): boolean {
  const segments = useSegments();
  const pathname = usePathname();
  if (segments.some((segment) => segment === "(tabs)")) return true;
  // NativeTabs can omit the group segment in `useSegments()` on some builds.
  return TAB_ROOT_PATHS.has(pathname);
}

/** Tab bar + system bottom inset for docked UI on native. */
export function getNativeTabBarOffset(bottomInset: number): number {
  return NATIVE_TAB_BAR_BODY + bottomInset;
}
