import { STORAGE_KEYS } from "@munib-tracker/theme/types";
import { act, renderHook } from "@testing-library/react-native";
import {
  __resetColdStartForTests,
  BOOT_BACKGROUND_DARK,
  BOOT_BACKGROUND_LIGHT,
  BOOT_THEME_SCRIPT,
  bootBackgroundForScheme,
  isBootColorMode,
  markColdStartReady,
  peekBootScheme,
  peekStoredColorMode,
  resolveBootScheme,
  useColdStartReady,
  useMarkColdStartReady,
} from "@/lib/boot/cold-start";
import { createMemoryStorage, installBrowser } from "@/test-support/browser";

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

describe("boot color mode", () => {
  let restore: () => void = () => {};
  afterEach(() => {
    restore();
    restore = () => {};
  });

  /** Browser with a stored color mode and a system dark preference. */
  function setup(stored: string | null, systemDark = false) {
    const storage = createMemoryStorage(stored == null ? {} : { [STORAGE_KEYS.colorMode]: stored });
    restore = installBrowser({
      window: {
        localStorage: storage,
        matchMedia: (query: string) => ({ matches: systemDark && query.includes("dark") }),
      },
    });
    return storage;
  }

  it.each([
    ["light", true],
    ["system", true],
    ["blue", false],
    [null, false],
  ])("isBootColorMode(%p) is %p", (value, expected) => {
    expect(isBootColorMode(value)).toBe(expected);
  });

  it("returns null without localStorage", () => {
    expect(peekStoredColorMode()).toBeNull();
  });

  it("reads a valid stored mode", () => {
    setup("light");
    expect(peekStoredColorMode()).toBe("light");
    expect(peekBootScheme()).toBe("light");
  });

  it("ignores an invalid stored mode and defaults to dark", () => {
    setup("blue");
    expect(peekStoredColorMode()).toBeNull();
    expect(peekBootScheme()).toBe("dark");
  });

  it("follows the system preference in system mode", () => {
    setup("system", true);
    expect(peekBootScheme()).toBe("dark");
    restore();
    setup("system", false);
    expect(peekBootScheme()).toBe("light");
  });

  it("returns null when storage throws", () => {
    const storage = setup("light");
    storage.getItem.mockImplementation(() => {
      throw new Error("denied");
    });
    expect(peekStoredColorMode()).toBeNull();
  });

  it("embeds escaped literals in the boot script", () => {
    expect(BOOT_THEME_SCRIPT).toContain(JSON.stringify(STORAGE_KEYS.colorMode));
    expect(BOOT_THEME_SCRIPT).toContain(BOOT_BACKGROUND_LIGHT);
    expect(BOOT_THEME_SCRIPT).not.toContain("<");
  });
});
