import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Spacing } from "@/constants/theme";
import { useIsTabScreen } from "@/hooks/use-tab-screen";

/** Width at/above which web uses a side rail instead of a bottom tab bar. */
export const SIDE_RAIL_BREAKPOINT = 768;

/** Width of the persistent side rail on wide web / tablet. */
export const SIDE_RAIL_WIDTH = 232;

/** Icon size in the narrow-web bottom tab bar (`app-tabs.web.tsx`). */
const WEB_TAB_BAR_ICON_SIZE = 20;

/**
 * Height of the floating bottom tab bar on narrow web — kept in sync with
 * `BottomTabBar` padding + tab row in `app-tabs.web.tsx`.
 */
export function getWebBottomTabBarHeight(bottomInset: number): number {
  const tabRowHeight = WEB_TAB_BAR_ICON_SIZE + Spacing.two * 2;
  return Spacing.two + tabRowHeight + Math.max(bottomInset, Spacing.two);
}

/** Web-only tab chrome: side rail vs bottom bar affects docked UI offsets. */
export function useWebTabLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const inTabs = useIsTabScreen();
  const isWideWeb = Platform.OS === "web" && width >= SIDE_RAIL_BREAKPOINT;
  const bottomTabBarHeight = getWebBottomTabBarHeight(insets.bottom);

  return {
    isWideWeb,
    /** Side rail only exists inside the `(tabs)` layout — stack screens are full width. */
    sideRailWidth: isWideWeb && inTabs ? SIDE_RAIL_WIDTH : 0,
    /** Bottom offset for docked chrome (0 when the side rail replaces the tab bar). */
    bottomTabBarOffset: isWideWeb ? 0 : bottomTabBarHeight,
  };
}
