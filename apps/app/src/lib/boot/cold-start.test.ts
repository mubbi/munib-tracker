import { resolveTheme } from "@munib-tracker/theme/resolve";
import { STORAGE_KEYS } from "@munib-tracker/theme/types";
import { act, renderHook } from "@testing-library/react-native";
import { DB_KEYS } from "@/db/keys";
import {
  __resetColdStartForTests,
  BOOT_BACKGROUND_DARK,
  BOOT_BACKGROUND_LIGHT,
  BOOT_THEME_CSS,
  BOOT_THEME_SCRIPT,
  bootBackgroundForScheme,
  isBootColorMode,
  isExistingInstall,
  markColdStartReady,
  peekBootScheme,
  peekExistingInstallSignals,
  peekStoredColorMode,
  resolveBootScheme,
  resolveInitialColorMode,
  useColdStartReady,
  useMarkColdStartReady,
} from "@/lib/boot/cold-start";
import { CUSTOM_ACCENT_KEY } from "@/lib/theme-storage-keys";
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

  it("derives the boot backgrounds from the theme page backgrounds", () => {
    expect(BOOT_BACKGROUND_LIGHT).toBe(resolveTheme("light", "light").background);
    expect(BOOT_BACKGROUND_DARK).toBe(resolveTheme("dark", "dark").background);
    expect(BOOT_THEME_CSS).toContain(`html{background-color:${BOOT_BACKGROUND_LIGHT};}`);
    expect(BOOT_THEME_CSS).toMatch(/prefers-color-scheme: dark\)\{html\{background-color:#/);
  });
});

describe("initial colour mode (D-UX2)", () => {
  it.each([
    [{}, false],
    [{ hasCompletedOnboarding: false, storedAccent: null }, false],
    [{ hasCompletedOnboarding: true }, true],
    [{ storedAccent: "pink" }, true],
    [{ storedCustomAccent: "#123456" }, true],
  ])("isExistingInstall(%o) is %p", (signals, expected) => {
    expect(isExistingInstall(signals)).toBe(expected);
  });

  it("keeps a stored mode, else dark for existing installs, else system", () => {
    expect(resolveInitialColorMode("light", { hasCompletedOnboarding: true })).toBe("light");
    expect(resolveInitialColorMode("system", {})).toBe("system");
    expect(resolveInitialColorMode(null, { hasCompletedOnboarding: true })).toBe("dark");
    expect(resolveInitialColorMode("sepia", { storedAccent: "pink" })).toBe("dark");
    expect(resolveInitialColorMode(undefined, {})).toBe("system");
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

  it("ignores an invalid stored mode and follows the system on a fresh install", () => {
    setup("blue");
    expect(peekStoredColorMode()).toBeNull();
    expect(peekBootScheme()).toBe("light");
    restore();
    setup(null, true);
    expect(peekBootScheme()).toBe("dark");
  });

  it("keeps an onboarded install with no stored mode on the legacy dark", () => {
    const storage = setup(null, false);
    storage.setItem(DB_KEYS.userPreferences, JSON.stringify({ hasCompletedOnboarding: true }));
    expect(peekExistingInstallSignals()).toMatchObject({ hasCompletedOnboarding: true });
    expect(peekBootScheme()).toBe("dark");
  });

  it("reads no existing-install signals from corrupt preferences", () => {
    const storage = setup(null);
    storage.setItem(DB_KEYS.userPreferences, "{not json");
    expect(peekExistingInstallSignals()).toEqual({});
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

  /** Runs the inline boot script against a fake document; returns the painted colour. */
  function runBootScript(stored: Record<string, string>, systemDark: boolean) {
    const storage = createMemoryStorage(stored);
    const html = { style: {} as Record<string, string> };
    const body = { style: {} as Record<string, string> };
    new Function("localStorage", "window", "document", BOOT_THEME_SCRIPT)(
      storage,
      { matchMedia: (q: string) => ({ matches: systemDark && q.includes("dark") }) },
      { documentElement: html, body },
    );
    return { background: html.style.backgroundColor, colorScheme: html.style.colorScheme, body };
  }

  it.each([
    ["fresh install, light OS", {}, false, "light"],
    ["fresh install, dark OS", {}, true, "dark"],
    ["stored light, dark OS", { [STORAGE_KEYS.colorMode]: "light" }, true, "light"],
    ["stored dark, light OS", { [STORAGE_KEYS.colorMode]: "dark" }, false, "dark"],
    ["stored system, dark OS", { [STORAGE_KEYS.colorMode]: "system" }, true, "dark"],
    ["legacy accent, light OS", { [STORAGE_KEYS.accent]: "pink" }, false, "dark"],
    ["legacy custom accent", { [CUSTOM_ACCENT_KEY]: "#123456" }, false, "dark"],
    [
      "onboarded, light OS",
      { [DB_KEYS.userPreferences]: JSON.stringify({ hasCompletedOnboarding: true }) },
      false,
      "dark",
    ],
    [
      "not onboarded, light OS",
      { [DB_KEYS.userPreferences]: JSON.stringify({ hasCompletedOnboarding: false }) },
      false,
      "light",
    ],
    ["corrupt preferences, light OS", { [DB_KEYS.userPreferences]: "{" }, false, "light"],
  ] as const)("boot script paints %s as %s", (_label, stored, systemDark, scheme) => {
    const painted = runBootScript(stored, systemDark);
    expect(painted.colorScheme).toBe(scheme);
    expect(painted.background).toBe(bootBackgroundForScheme(scheme));
    expect(painted.body.style.backgroundColor).toBe(painted.background);
  });

  it("embeds escaped literals in the boot script", () => {
    expect(BOOT_THEME_SCRIPT).toContain(JSON.stringify(STORAGE_KEYS.colorMode));
    expect(BOOT_THEME_SCRIPT).toContain(BOOT_BACKGROUND_LIGHT);
    expect(BOOT_THEME_SCRIPT).not.toContain("<");
  });
});
