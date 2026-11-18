import { act, renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { Spacing } from "@/constants/theme";
import { setPlatform } from "@/test-support/platform";

import {
  MiniPlayerInsetProvider,
  useContentBottomInset,
  useMiniPlayerInset,
  useObstructedBottomInset,
  useSetMiniPlayerInset,
  useTabBarOffset,
} from "./use-content-bottom-inset";

jest.mock("expo-status-bar", () => ({ useVerticalBarEdgeIOS: () => mockChrome.verticalBarEdge }));
jest.mock("@/hooks/use-app-safe-area-insets", () => ({
  useAppSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 30, left: 0 }),
}));
jest.mock("@/hooks/use-tab-screen", () => ({
  getNativeTabBarOffset: (bottom: number) => 49 + bottom,
  useIsTabScreen: () => mockChrome.inTabs,
}));
jest.mock("@/hooks/use-web-tab-layout", () => ({
  useWebTabLayout: () => ({ bottomTabBarOffset: 64 }),
}));

const mockChrome: { inTabs: boolean; verticalBarEdge: string | null } = {
  inTabs: true,
  verticalBarEdge: null,
};

let restorePlatform: () => void = () => {};

const wrapper = ({ children }: { children: ReactNode }) => (
  <MiniPlayerInsetProvider>{children}</MiniPlayerInsetProvider>
);

/** Renders the inset hooks under the provider with a mini-player of `miniPlayer` height. */
async function insets(miniPlayer = 0) {
  const hook = await renderHook(
    () => ({
      tabBar: useTabBarOffset(),
      obstructed: useObstructedBottomInset(),
      content: useContentBottomInset(),
      setMiniPlayer: useSetMiniPlayerInset(),
      miniPlayer: useMiniPlayerInset(),
    }),
    { wrapper },
  );
  if (miniPlayer) await act(async () => hook.result.current.setMiniPlayer(miniPlayer));
  return hook.result.current;
}

beforeEach(() => {
  mockChrome.inTabs = true;
  mockChrome.verticalBarEdge = null;
});

afterEach(() => {
  restorePlatform();
  restorePlatform = () => {};
});

describe("useTabBarOffset", () => {
  it("is the home indicator on stack screens", async () => {
    mockChrome.inTabs = false;
    expect((await insets()).tabBar).toBe(30);
  });

  it("is the native tab bar plus the safe area inside tabs", async () => {
    expect((await insets()).tabBar).toBe(79);
  });

  it("is just the safe area when iOS moves the bars into a side rail", async () => {
    mockChrome.verticalBarEdge = "leading";
    expect((await insets()).tabBar).toBe(30);
  });

  it("uses the web tab bar height on web", async () => {
    restorePlatform = setPlatform({ OS: "web" });
    expect((await insets()).tabBar).toBe(64);
  });

  it("uses the native tab bar on Android even with a vertical bar edge", async () => {
    restorePlatform = setPlatform({ OS: "android" });
    mockChrome.verticalBarEdge = "leading";
    expect((await insets()).tabBar).toBe(79);
  });
});

describe("useObstructedBottomInset / useContentBottomInset", () => {
  it("stacks the mini-player above the tab bar inside tabs", async () => {
    const i = await insets(50);
    expect(i.miniPlayer).toBe(50);
    expect(i.obstructed).toBe(129);
    expect(i.content).toBe(129 + Spacing.four);
  });

  it("uses only the mini-player height on stack screens", async () => {
    mockChrome.inTabs = false;
    expect((await insets(50)).obstructed).toBe(50);
  });

  it("is the tab bar alone without a mini-player", async () => {
    mockChrome.inTabs = false;
    expect((await insets()).obstructed).toBe(30);
  });

  it("accepts custom breathing room", async () => {
    const { result } = await renderHook(() => useContentBottomInset(0), { wrapper });
    expect(result.current).toBe(79);
  });
});

describe("without a provider", () => {
  it("reports no mini-player and ignores updates", async () => {
    const { result } = await renderHook(() => ({
      inset: useMiniPlayerInset(),
      set: useSetMiniPlayerInset(),
    }));
    expect(result.current.inset).toBe(0);
    expect(() => result.current.set(10)).not.toThrow();
  });
});
