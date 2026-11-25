import { renderHook } from "@testing-library/react-native";
import { Platform } from "react-native";

import {
  WEB_TAB_BAR_MIN_PADDING_BOTTOM,
  WEB_TAB_BAR_PADDING_TOP,
  WEB_TAB_MIN_HEIGHT,
  webBottomTabBarHeight,
} from "@/components/web/web-tab-bar-metrics";
import { TvLayout } from "@/constants/tv-layout";
import { webRailWidthFor } from "@/lib/web/web-rail";
import { resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { setPlatform } from "@/test-support/platform";

import {
  getWebBottomTabBarHeight,
  LIST_DETAIL_BREAKPOINT,
  SIDE_RAIL_BREAKPOINT,
  SIDE_RAIL_WIDTH,
  TABLET_RAIL_COMPACT_WIDTH,
  tabletRailWidthFor,
  useGlobalRail,
  useLargeScreenLayout,
  useNativeTabletRail,
  useWebGlobalRail,
} from "./use-large-screen-layout";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock("@/hooks/use-app-safe-area-insets", () => ({
  useAppSafeAreaInsets: () => mockInsets.current,
}));

const mockInsets = { current: { top: 0, right: 0, bottom: 20, left: 0 } };
jest.mock("@/hooks/use-tab-screen", () => ({ useIsTabScreen: () => mockInTabs.current }));

const mockInTabs = { current: true };
let restorePlatform: () => void = () => {};

async function layout(width: number, platform: Parameters<typeof setPlatform>[0] = {}) {
  restorePlatform = setPlatform(platform);
  setMockWindowSize(width);
  const { result } = await renderHook(() => useLargeScreenLayout());
  return result.current;
}

beforeEach(() => {
  resetExpoRouterMock();
  setMockPathname("/tracker", ["(tabs)", "tracker"]);
  mockInTabs.current = true;
  mockInsets.current = { top: 0, right: 0, bottom: 20, left: 0 };
});

afterEach(() => {
  restorePlatform();
  restorePlatform = () => {};
  resetMockWindowSize();
});

describe("getWebBottomTabBarHeight", () => {
  it("matches the bar's own metrics and pads at least the minimum gap", () => {
    const base = WEB_TAB_BAR_PADDING_TOP + WEB_TAB_MIN_HEIGHT;
    expect(getWebBottomTabBarHeight(0)).toBe(base + WEB_TAB_BAR_MIN_PADDING_BOTTOM);
    expect(getWebBottomTabBarHeight(40)).toBe(base + 40);
    expect(getWebBottomTabBarHeight(40)).toBe(webBottomTabBarHeight(40));
  });
});

describe("useLargeScreenLayout", () => {
  it("uses the bottom tab bar on a phone-width window", async () => {
    const l = await layout(390, { OS: "android" });
    expect(l).toEqual(
      expect.objectContaining({
        width: 390,
        isWide: false,
        isListDetail: false,
        isTv: false,
        sideRailWidth: 0,
        bottomTabBarOffset: getWebBottomTabBarHeight(20),
      }),
    );
  });

  it("reserves the compact rail on a 768dp Android tablet", async () => {
    const l = await layout(SIDE_RAIL_BREAKPOINT, { OS: "android" });
    expect(l.isWide).toBe(true);
    expect(l.isListDetail).toBe(false);
    expect(l.sideRailWidth).toBe(TABLET_RAIL_COMPACT_WIDTH);
    expect(l.bottomTabBarOffset).toBe(0);
  });

  it("keeps the native tablet rail outside tabs (it lives beside the root stack)", async () => {
    mockInTabs.current = false;
    setMockPathname("/quran/1");
    expect((await layout(LIST_DETAIL_BREAKPOINT, { OS: "android" })).sideRailWidth).toBe(
      SIDE_RAIL_WIDTH,
    );
  });

  it("never reserves a rail on a wide iPhone window", async () => {
    const l = await layout(1000, { OS: "ios" });
    expect(l.isListDetail).toBe(true);
    expect(l.sideRailWidth).toBe(0);
  });

  it("uses the expanded TV rail on TV regardless of width", async () => {
    const l = await layout(390, { OS: "ios", isTV: true });
    expect(l.isTv).toBe(true);
    expect(l.isWide).toBe(true);
    expect(l.isListDetail).toBe(true);
    expect(l.sideRailWidth).toBe(TvLayout.sideRailWidthExpanded);
  });

  it("uses the global web rail beside every routed screen", async () => {
    mockInTabs.current = false;
    const l = await layout(1280, { OS: "web" });
    expect(l.sideRailWidth).toBe(webRailWidthFor(1280));
  });
});

describe("useNativeTabletRail", () => {
  async function rail(
    width: number,
    platform: Parameters<typeof setPlatform>[0],
    pathname = "/quran/1",
  ) {
    restorePlatform = setPlatform(platform);
    setMockPathname(pathname);
    setMockWindowSize(width);
    const { result } = await renderHook(() => useNativeTabletRail());
    return result.current;
  }

  it("persists on a pushed route at 820dp, compact below list–detail", async () => {
    expect(await rail(820, { OS: "android" })).toEqual({
      visible: true,
      width: TABLET_RAIL_COMPACT_WIDTH,
      expanded: false,
      startInset: 0,
    });
  });

  it("is compact at 800dp and labelled at 1000dp", async () => {
    expect((await rail(800, { OS: "android" })).width).toBe(TABLET_RAIL_COMPACT_WIDTH);
    const wide = await rail(1000, { OS: "android" });
    expect(wide.expanded).toBe(true);
    expect(wide.width).toBe(SIDE_RAIL_WIDTH);
  });

  it("shows on iPad", async () => {
    jest.spyOn(Platform, "isPad", "get").mockReturnValue(true);
    try {
      expect((await rail(1024, { OS: "ios" })).visible).toBe(true);
    } finally {
      jest.restoreAllMocks();
    }
  });

  it.each([
    ["a phone-width window", 390, { OS: "android" as const }],
    ["a wide iPhone window", 1000, { OS: "ios" as const }],
    ["TV", 1280, { OS: "android" as const, isTV: true }],
    ["web", 1280, { OS: "web" as const }],
  ])("is hidden on %s", async (_case, width, platform) => {
    expect(await rail(width, platform)).toEqual({
      visible: false,
      width: 0,
      expanded: false,
      startInset: 0,
    });
  });

  it("is hidden on chromeless routes", async () => {
    expect((await rail(1000, { OS: "android" }, "/intro")).visible).toBe(false);
  });

  it("absorbs the start-edge inset into its footprint", async () => {
    mockInsets.current = { top: 0, right: 0, bottom: 0, left: 24 };
    const r = await rail(820, { OS: "android" });
    expect(r.startInset).toBe(24);
    expect(r.width).toBe(TABLET_RAIL_COMPACT_WIDTH + 24);
  });

  it("maps window width to the rail width", () => {
    expect(tabletRailWidthFor(LIST_DETAIL_BREAKPOINT - 1)).toBe(TABLET_RAIL_COMPACT_WIDTH);
    expect(tabletRailWidthFor(LIST_DETAIL_BREAKPOINT)).toBe(SIDE_RAIL_WIDTH);
  });
});

describe("useGlobalRail", () => {
  async function globalRail(width: number, platform: Parameters<typeof setPlatform>[0]) {
    // Several platforms in one test: undo the previous override before the next.
    restorePlatform();
    restorePlatform = setPlatform(platform);
    setMockPathname("/quran/1");
    setMockWindowSize(width);
    const { result } = await renderHook(() => useGlobalRail());
    return result.current;
  }

  it("reports the web rail on web and the tablet rail on native", async () => {
    expect(await globalRail(1280, { OS: "web" })).toEqual({
      visible: true,
      width: webRailWidthFor(1280),
    });
    expect(await globalRail(1000, { OS: "android" })).toEqual({
      visible: true,
      width: SIDE_RAIL_WIDTH,
    });
    expect((await globalRail(390, { OS: "android" })).visible).toBe(false);
  });
});

describe("useWebGlobalRail", () => {
  async function rail(pathname: string, width: number) {
    restorePlatform = setPlatform({ OS: "web" });
    setMockPathname(pathname);
    setMockWindowSize(width);
    const { result } = await renderHook(() => useWebGlobalRail());
    return result.current;
  }

  it("is visible on wide web windows", async () => {
    expect(await rail("/tracker", 900)).toEqual({ visible: true, width: webRailWidthFor(900) });
  });

  it("is hidden on narrow windows", async () => {
    expect(await rail("/tracker", 600)).toEqual({ visible: false, width: 0 });
  });

  it("is hidden on chromeless routes", async () => {
    expect((await rail("/login", 1280)).visible).toBe(false);
  });
});
