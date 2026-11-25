/**
 * Geometry of the narrow-web floating bottom tab bar (`components/app-tabs.web.tsx`).
 *
 * Kept in a tiny module so layout code that reserves space for the bar (content
 * bottom inset, docked mini-player) can import the real numbers without pulling
 * in the tab navigator.
 */
import { Spacing } from "@/constants/theme";

/**
 * Minimum height of one tab (icon indicator over a 12px label). 48px is the
 * platform floor for bottom-navigation targets (`platform-ux-guidelines.md`
 * → Web → Targets); the extra 4px is the indicator / label breathing room.
 */
export const WEB_TAB_MIN_HEIGHT = 52;

/** Glyph size inside the tab indicator. */
export const WEB_TAB_ICON_SIZE = 20;

/** Padding above the tab row. */
export const WEB_TAB_BAR_PADDING_TOP = Spacing.one;

/** Bottom padding when the device reports no safe-area inset. */
export const WEB_TAB_BAR_MIN_PADDING_BOTTOM = Spacing.one;

/** Total height of the floating bar for a given bottom safe-area inset. */
export function webBottomTabBarHeight(bottomInset: number): number {
  return (
    WEB_TAB_BAR_PADDING_TOP +
    WEB_TAB_MIN_HEIGHT +
    Math.max(bottomInset, WEB_TAB_BAR_MIN_PADDING_BOTTOM)
  );
}
