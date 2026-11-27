import { usePathname } from "expo-router";
import { I18nManager, Platform, useWindowDimensions } from "react-native";
import { webBottomTabBarHeight } from "@/components/web/web-tab-bar-metrics";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useIsTabScreen } from "@/hooks/use-tab-screen";
import { isTV } from "@/lib/platform/is-tv";
import { isChromelessRoute } from "@/lib/web/nav-section";
import { webRailWidthFor } from "@/lib/web/web-rail";

/** Width at/above which the app uses a side rail instead of a bottom tab bar. */
export const SIDE_RAIL_BREAKPOINT = 768;

/** Width at/above which list–detail (two-pane) layouts activate. */
export const LIST_DETAIL_BREAKPOINT = 900;

/**
 * Native tablet rail with labels beside icons (≥ {@link LIST_DETAIL_BREAKPOINT}).
 * Below that the rail is {@link TABLET_RAIL_COMPACT_WIDTH} (E-24).
 */
export const SIDE_RAIL_WIDTH = 232;

/**
 * Compact native tablet rail (768–899dp): icon over a short label, the
 * Material 3 navigation-rail width (80–96dp), so 768–900dp windows keep their
 * content width (E-24).
 */
export const TABLET_RAIL_COMPACT_WIDTH = 96;

/** Native tablet rail width for a window width (compact below list–detail). */
export function tabletRailWidthFor(windowWidth: number): number {
  return windowWidth >= LIST_DETAIL_BREAKPOINT ? SIDE_RAIL_WIDTH : TABLET_RAIL_COMPACT_WIDTH;
}

/** iPhones (incl. iPhone Duo) always use system NativeTabs, never the custom rail. */
function isIPhone(): boolean {
  return Platform.OS === "ios" && !Platform.isPad && !isTV();
}

/**
 * Height of the floating bottom tab bar on narrow web — kept in sync with
 * `BottomTabBar` padding + tab row in `app-tabs.web.tsx`.
 */
export function getWebBottomTabBarHeight(bottomInset: number): number {
  // Single source of truth with the bar itself (P4-01 metrics).
  return webBottomTabBarHeight(bottomInset);
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
 * Native iPad / Android tablet / foldable (D-UX3): the custom rail is hosted
 * beside the ROOT stack — like {@link useWebGlobalRail} on web — so it persists
 * on pushed screens (Qur’an reader, Learn, settings sub-pages) instead of
 * existing only inside `(tabs)` (E-14). Hidden on chromeless routes (first
 * run, sign-in). Never on iPhone, TV (its rail lives in the tabs) or web.
 */
export function useNativeTabletRail(): {
  visible: boolean;
  /** Total footprint, including the start-edge safe-area inset the rail absorbs. */
  width: number;
  /** Labels beside icons (≥ list–detail); compact icon-over-label below. */
  expanded: boolean;
  /** Start-edge safe-area inset (landscape side insets) the rail pads for. */
  startInset: number;
} {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const insets = useAppSafeAreaInsets();
  // Native only: the rail sits on the start edge, which is the right edge in RTL.
  const startInset = I18nManager.isRTL ? insets.right : insets.left;
  const visible =
    Platform.OS !== "web" &&
    !isTV() &&
    !isIPhone() &&
    width >= SIDE_RAIL_BREAKPOINT &&
    !isChromelessRoute(pathname);
  return {
    visible,
    width: visible ? tabletRailWidthFor(width) + startInset : 0,
    expanded: visible && width >= LIST_DETAIL_BREAKPOINT,
    startInset: visible ? startInset : 0,
  };
}

/**
 * The persistent rail beside the root stack on any platform (web or native
 * tablet). Width 0 when neither is shown — use it to subtract rail width from
 * window-derived content widths.
 */
export function useGlobalRail(): { visible: boolean; width: number } {
  const web = useWebGlobalRail();
  const tablet = useNativeTabletRail();
  if (web.visible) return web;
  return { visible: tablet.visible, width: tablet.width };
}

/**
 * Adaptive chrome driven by **window width** (not device type), per Apple HIG
 * layout guidance and Android window size classes. TV always uses wide chrome.
 */
export function useLargeScreenLayout() {
  const { width } = useWindowDimensions();
  const insets = useAppSafeAreaInsets();
  const inTabs = useIsTabScreen();
  const tv = isTV();
  const isWide = tv || width >= SIDE_RAIL_BREAKPOINT;
  const isListDetail = tv || width >= LIST_DETAIL_BREAKPOINT;
  const bottomTabBarHeight = getWebBottomTabBarHeight(insets.bottom);
  const globalRail = useGlobalRail();

  return {
    width,
    isWide,
    isListDetail,
    isTv: tv,
    /**
     * Web and native tablets: the global rail beside every routed screen
     * (`useGlobalRail`). TV: its Leanback rail exists only inside `(tabs)`.
     */
    sideRailWidth: globalRail.visible
      ? globalRail.width
      : tv && inTabs
        ? TvLayout.sideRailWidthExpanded
        : 0,
    /** Bottom offset for docked chrome (0 when the side rail replaces the tab bar). */
    bottomTabBarOffset: isWide ? 0 : bottomTabBarHeight,
  };
}
