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

  it("starts unpainted", async () => {
    const { result } = await renderHook(() => useColdStartReady());
    expect(result.current).toBe(false);
  });

  it("becomes painted after markColdStartReady", async () => {
    const { result } = await renderHook(() => useColdStartReady());
    await act(() => {
      markColdStartReady();
    });
    expect(result.current).toBe(true);
  });

  it("useMarkColdStartReady paints on mount", async () => {
    const { result } = await renderHook(() => {
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
