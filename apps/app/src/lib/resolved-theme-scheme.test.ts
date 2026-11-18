import { act, renderHook } from "@testing-library/react-native";
import {
  getResolvedThemeScheme,
  setResolvedThemeScheme,
  useResolvedThemeScheme,
} from "@/lib/resolved-theme-scheme";

jest.mock("@/lib/boot/cold-start", () => ({ peekBootScheme: jest.fn(() => "light") }));

type Mod = typeof import("@/lib/resolved-theme-scheme");

function loadFresh(): Mod {
  let mod!: Mod;
  jest.isolateModules(() => {
    mod = require("@/lib/resolved-theme-scheme") as Mod;
  });
  return mod;
}

describe("resolved theme scheme", () => {
  it("seeds from the persisted boot scheme on the client", () => {
    expect(loadFresh().getResolvedThemeScheme()).toBe("light");
  });

  it("defaults to dark when there is no window (SSR)", () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, "window");
    Object.defineProperty(globalThis, "window", { configurable: true, value: undefined });
    try {
      expect(loadFresh().getResolvedThemeScheme()).toBe("dark");
    } finally {
      if (original) Object.defineProperty(globalThis, "window", original);
    }
  });

  it("notifies subscribers only on change and supports unsubscribe", () => {
    const mod = loadFresh();
    const listener = jest.fn();
    const unsubscribe = mod.subscribeResolvedThemeScheme(listener);
    mod.setResolvedThemeScheme("light");
    expect(listener).not.toHaveBeenCalled();
    mod.setResolvedThemeScheme("dark");
    expect(listener).toHaveBeenCalledWith("dark");
    expect(mod.getResolvedThemeScheme()).toBe("dark");
    unsubscribe();
    mod.setResolvedThemeScheme("light");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("useResolvedThemeScheme re-renders on change", async () => {
    // Uses the shared module instance so the hook runs against the same React copy.
    setResolvedThemeScheme("light");
    const { result } = await renderHook(() => useResolvedThemeScheme());
    expect(result.current).toBe("light");
    await act(async () => {
      setResolvedThemeScheme("dark");
    });
    expect(result.current).toBe("dark");
    expect(getResolvedThemeScheme()).toBe("dark");
  });
});
