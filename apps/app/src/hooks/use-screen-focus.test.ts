import { renderHook } from "@testing-library/react-native";

import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";

import { useScreenFocus } from "./use-screen-focus";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/hooks/use-scroll-to-active", () => ({
  useScrollToActive: (...args: unknown[]) => {
    mockScrollArgs.push(args);
    return { register: "register", onScroll: "onScroll" };
  },
}));

const mockScrollArgs: unknown[][] = [];

async function setup(focus?: string | string[]) {
  setMockSearchParams(focus === undefined ? {} : { focus });
  const { result } = await renderHook(() => useScreenFocus());
  return result.current;
}

beforeEach(() => {
  resetExpoRouterMock();
  mockScrollArgs.length = 0;
});

describe("useScreenFocus", () => {
  it.each<[string | string[] | undefined, string | null]>([
    ["qaza", "qaza"],
    [["streak", "other"], "streak"],
    [[], null],
    [undefined, null],
  ])("reads ?focus=%j as %s", async (focus, expected) => {
    const screen = await setup(focus);
    expect(screen.focusKey).toBe(expected);
    expect(mockScrollArgs[0]?.[1]).toBe(expected);
    expect(mockScrollArgs[0]?.[2]).toBe(88);
  });

  it("highlights only the focused section", async () => {
    const screen = await setup("qaza");
    expect(screen.isFocused("qaza")).toBe(true);
    expect(screen.isFocused("streak")).toBe(false);
    expect(screen.register).toBe("register");
    expect(screen.onScroll).toBe("onScroll");
  });
});
