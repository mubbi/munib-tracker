import { renderHook } from "@testing-library/react-native";

import { resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";

import { getNativeTabBarOffset, useIsTabScreen } from "./use-tab-screen";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

beforeEach(resetExpoRouterMock);

async function isTabScreen(pathname: string, segments: string[]) {
  setMockPathname(pathname, segments);
  const { result } = await renderHook(() => useIsTabScreen());
  return result.current;
}

describe("useIsTabScreen", () => {
  it.each<[string, string[], boolean]>([
    ["/anything", ["(tabs)", "anything"], true],
    ["/tracker", [], true],
    ["/settings", ["settings"], true],
    ["/quran/2", ["quran", "[surah]"], false],
  ])("%s with segments %j → %s", async (pathname, segments, expected) => {
    expect(await isTabScreen(pathname, segments)).toBe(expected);
  });
});

describe("getNativeTabBarOffset", () => {
  it("adds the iOS tab bar body to the bottom inset", () => {
    expect(getNativeTabBarOffset(34)).toBe(49 + 34);
  });
});
