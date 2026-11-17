import { usePathname } from "expo-router";
import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useIsTabScreen } from "@/hooks/use-tab-screen";
import { isTV } from "@/lib/platform/is-tv";
import { isChromelessRoute } from "@/lib/web/nav-section";
import { webRailWidthFor } from "@/lib/web/web-rail";

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
 * Desktop / tablet web: the persistent navigation rail rendered beside the root
 * stack (all routes except first-run / auth). Width 0 when not shown.
 */
export function useWebGlobalRail(): { visible: boolean; width: number } {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const visible =
    Platform.OS === "web" && width >= SIDE_RAIL_BREAKPOINT && !isChromelessRoute(pathname);
  return { visible, width: visible ? webRailWidthFor(width) : 0 };
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
  const webRail = useWebGlobalRail();

  return {
    width,
    isWide,
    isListDetail,
    isTv: tv,
    /**
     * Native tablets / TV: the rail exists only inside `(tabs)`. Web: the global
     * rail (see `useWebGlobalRail`) is beside every routed screen.
     */
    // Web: the global rail sits beside every routed screen (not only tabs).
    sideRailWidth: webRail.visible ? webRail.width : isWide && inTabs ? railWidth : 0,
    /** Bottom offset for docked chrome (0 when the side rail replaces the tab bar). */
    bottomTabBarOffset: isWide ? 0 : bottomTabBarHeight,
  };
}
