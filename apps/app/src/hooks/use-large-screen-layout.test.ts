import { renderHook } from "@testing-library/react-native";

import { Spacing } from "@/constants/theme";
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
  useLargeScreenLayout,
  useWebGlobalRail,
} from "./use-large-screen-layout";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock("@/hooks/use-app-safe-area-insets", () => ({
  useAppSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 20, left: 0 }),
}));
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
});

afterEach(() => {
  restorePlatform();
  restorePlatform = () => {};
  resetMockWindowSize();
});

describe("getWebBottomTabBarHeight", () => {
  it("pads at least the minimum gap below the tab row", () => {
    const row = 20 + Spacing.two * 2;
    expect(getWebBottomTabBarHeight(0)).toBe(Spacing.two + row + Spacing.two);
    expect(getWebBottomTabBarHeight(40)).toBe(Spacing.two + row + 40);
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

  it("shows the side rail inside tabs on a wide Android tablet", async () => {
    const l = await layout(SIDE_RAIL_BREAKPOINT, { OS: "android" });
    expect(l.isWide).toBe(true);
    expect(l.isListDetail).toBe(false);
    expect(l.sideRailWidth).toBe(SIDE_RAIL_WIDTH);
    expect(l.bottomTabBarOffset).toBe(0);
  });

  it("hides the native rail outside tabs", async () => {
    mockInTabs.current = false;
    expect((await layout(LIST_DETAIL_BREAKPOINT, { OS: "android" })).sideRailWidth).toBe(0);
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
