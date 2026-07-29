import { act, renderHook } from "@testing-library/react-native";

import {
  __resetColdStartForTests,
  BOOT_BACKGROUND_DARK,
  BOOT_BACKGROUND_LIGHT,
  bootBackgroundForScheme,
  markColdStartReady,
  resolveBootScheme,
  useColdStartReady,
  useMarkColdStartReady,
} from "@/lib/boot/cold-start";

describe("cold-start", () => {
  beforeEach(() => {
    __resetColdStartForTests();
  });

  it("starts unpainted", () => {
    const { result } = renderHook(() => useColdStartReady());
    expect(result.current).toBe(false);
  });

  it("becomes painted after markColdStartReady", () => {
    const { result } = renderHook(() => useColdStartReady());
    act(() => {
      markColdStartReady();
    });
    expect(result.current).toBe(true);
  });

  it("useMarkColdStartReady paints on mount", () => {
    const { result } = renderHook(() => {
      useMarkColdStartReady();
      return useColdStartReady();
    });
    expect(result.current).toBe(true);
  });

  it("resolves boot backgrounds for light and dark schemes", () => {
    expect(bootBackgroundForScheme("light")).toBe(BOOT_BACKGROUND_LIGHT);
    expect(bootBackgroundForScheme("dark")).toBe(BOOT_BACKGROUND_DARK);
    expect(resolveBootScheme("light", true)).toBe("light");
    expect(resolveBootScheme("dark", false)).toBe("dark");
    expect(resolveBootScheme("system", true)).toBe("dark");
    expect(resolveBootScheme("system", false)).toBe("light");
  });
});
