import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useIsTabScreen } from "@/hooks/use-tab-screen";
import { isTV } from "@/lib/platform/is-tv";

/** Width at/above which the app uses a side rail instead of a bottom tab bar. */
export const SIDE_RAIL_BREAKPOINT = 768;

/** Width at/above which list–detail (two-pane) layouts activate. */
export const LIST_DETAIL_BREAKPOINT = 900;

/** Width of the persistent side rail on wide windows. */
export const SIDE_RAIL_WIDTH = 232;

/** Icon size in the narrow bottom tab bar (`app-tabs.web.tsx`). */
const WEB_TAB_BAR_ICON_SIZE = 20;

/**
 * Height of the floating bottom tab bar on narrow web — kept in sync with
 * `BottomTabBar` padding + tab row in `app-tabs.web.tsx`.
 */
export function getWebBottomTabBarHeight(bottomInset: number): number {
  const tabRowHeight = WEB_TAB_BAR_ICON_SIZE + Spacing.two * 2;
  return Spacing.two + tabRowHeight + Math.max(bottomInset, Spacing.two);
}

/**
 * Adaptive chrome driven by **window width** (not device type), per Apple HIG
 * layout guidance and Android window size classes. TV always uses wide chrome.
 */
export function useLargeScreenLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const inTabs = useIsTabScreen();
  const tv = isTV();
  const isWide = tv || width >= SIDE_RAIL_BREAKPOINT;
  const isListDetail = tv || width >= LIST_DETAIL_BREAKPOINT;
  const bottomTabBarHeight = getWebBottomTabBarHeight(insets.bottom);
  const railWidth = tv ? TvLayout.sideRailWidthExpanded : SIDE_RAIL_WIDTH;

  return {
    width,
    isWide,
    isListDetail,
    isTv: tv,
    /** Side rail only exists inside the `(tabs)` layout — stack screens are full width. */
    sideRailWidth: isWide && inTabs ? railWidth : 0,
    /** Bottom offset for docked chrome (0 when the side rail replaces the tab bar). */
    bottomTabBarOffset: isWide ? 0 : bottomTabBarHeight,
  };
}
