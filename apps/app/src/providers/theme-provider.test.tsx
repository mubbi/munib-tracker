import { STORAGE_KEYS } from "@munib-tracker/theme/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { Appearance, AppState, useColorScheme } from "react-native";

import { peekStoredColorMode } from "@/lib/boot/cold-start";
import { MunibThemeProvider, useTheme } from "@/providers/theme-provider";
import { captureAnimationFrames } from "@/test-support/animation-frames";
import { captureAppStateListener } from "@/test-support/app-state";
import { deferred } from "@/test-support/async";

const CUSTOM_ACCENT_KEY = "@munib-tracker/custom-accent";

type MockPrefs = { colorMode?: string; accentColorId?: string; customAccent?: string };

const mockPrefsStore = {
  prefs: {} as MockPrefs,
  listeners: new Set<() => void>(),
  load: jest.fn(async () => undefined),
  update: jest.fn(async (_patch: MockPrefs) => undefined),
};

jest.mock("@/stores/preferences-store", () => ({
  preferencesStore: {
    getState: () => ({
      prefs: mockPrefsStore.prefs,
      load: mockPrefsStore.load,
      update: mockPrefsStore.update,
    }),
    subscribe: (listener: () => void) => {
      mockPrefsStore.listeners.add(listener);
      return () => mockPrefsStore.listeners.delete(listener);
    },
  },
}));
jest.mock("@/lib/boot/cold-start", () => ({
  ...jest.requireActual("@/lib/boot/cold-start"),
  peekStoredColorMode: jest.fn(() => null),
}));

let frames: ReturnType<typeof captureAnimationFrames>;
let appState: ReturnType<typeof captureAppStateListener>;

/** Seeds legacy AsyncStorage theme values. */
async function seedStorage(values: Record<string, string>) {
  for (const [key, value] of Object.entries(values)) await AsyncStorage.setItem(key, value);
  jest.mocked(AsyncStorage.setItem).mockClear();
}

/** Renders `useTheme()` inside the real provider and waits for hydration. */
async function setup({ hydrate = true } = {}) {
  const hook = await renderHook(() => useTheme(), { wrapper: MunibThemeProvider });
  if (hydrate) await waitFor(() => expect(hook.result.current.isReady).toBe(true));
  return hook;
}

/** Pushes a cloud-synced prefs change through the store subscription. */
async function emitPrefs(prefs: MockPrefs) {
  mockPrefsStore.prefs = prefs;
  await act(async () => {
    for (const listener of mockPrefsStore.listeners) listener();
  });
}

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  mockPrefsStore.prefs = {};
  mockPrefsStore.listeners.clear();
  mockPrefsStore.load.mockImplementation(async () => undefined);
  jest.spyOn(Appearance, "setColorScheme").mockImplementation(() => {});
  frames = captureAnimationFrames();
  appState = captureAppStateListener();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("useTheme", () => {
  it("throws outside MunibThemeProvider", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(renderHook(() => useTheme())).rejects.toThrow(
      "useTheme must be used within MunibThemeProvider",
    );
  });
});

describe("hydration", () => {
  it("defaults to dark forest and hides the splash once ready", async () => {
    const { result } = await setup();

    expect(result.current).toMatchObject({
      colorMode: "dark",
      scheme: "dark",
      accentColorId: "forest",
      customAccent: null,
    });
    expect(SplashScreen.hideAsync).toHaveBeenCalled();
  });

  it("applies a peeked web color mode before hydration", async () => {
    jest.mocked(peekStoredColorMode).mockReturnValueOnce("light");
    mockPrefsStore.load.mockImplementation(() => new Promise(() => {}));

    const { result } = await setup({ hydrate: false });

    expect(result.current.colorMode).toBe("light");
    expect(Appearance.setColorScheme).toHaveBeenCalledWith("light");
  });

  it("prefers the synced preferences over local storage without migrating", async () => {
    await seedStorage({ [STORAGE_KEYS.colorMode]: "dark", [STORAGE_KEYS.accent]: "pink" });
    mockPrefsStore.prefs = { colorMode: "light", accentColorId: "lime", customAccent: "#112233" };

    const { result } = await setup();

    expect(result.current).toMatchObject({
      colorMode: "light",
      accentColorId: "lime",
      customAccent: "#112233",
    });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(CUSTOM_ACCENT_KEY, "#112233");
    expect(mockPrefsStore.update).not.toHaveBeenCalled();
  });

  it("migrates a legacy local theme into the synced preferences", async () => {
    await seedStorage({
      [STORAGE_KEYS.colorMode]: "system",
      [STORAGE_KEYS.accent]: "pink",
      [CUSTOM_ACCENT_KEY]: "#ABCDEF",
    });

    const { result } = await setup();

    expect(result.current.colorMode).toBe("system");
    expect(Appearance.setColorScheme).toHaveBeenCalledWith("auto");
    expect(mockPrefsStore.update).toHaveBeenCalledWith({
      colorMode: "system",
      accentColorId: "pink",
      customAccent: "#abcdef",
    });
  });

  it("falls back to defaults for invalid stored values", async () => {
    await seedStorage({
      [STORAGE_KEYS.colorMode]: "sepia",
      [STORAGE_KEYS.accent]: "nope",
      [CUSTOM_ACCENT_KEY]: "not-a-color",
    });
    mockPrefsStore.prefs = { customAccent: "also-bad" };

    const { result } = await setup();

    expect(result.current).toMatchObject({
      colorMode: "dark",
      accentColorId: "forest",
      customAccent: null,
    });
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(CUSTOM_ACCENT_KEY);
  });

  it("becomes ready after the startup timeout when hydration stalls", async () => {
    jest.useFakeTimers();
    mockPrefsStore.load.mockImplementation(() => new Promise(() => {}));
    const { result } = await setup({ hydrate: false });
    expect(result.current.isReady).toBe(false);

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.isReady).toBe(true);
    expect(SplashScreen.hideAsync).toHaveBeenCalled();
  });

  it("ignores a hydration that finishes after unmount", async () => {
    const load = deferred<undefined>();
    mockPrefsStore.load.mockImplementation(() => load.promise);
    const { unmount } = await setup({ hydrate: false });

    await act(async () => unmount());
    await act(async () => load.resolve(undefined));

    expect(SplashScreen.hideAsync).not.toHaveBeenCalled();
    expect(mockPrefsStore.update).not.toHaveBeenCalled();
  });
});

describe("system color mode", () => {
  it.each([
    ["dark", "dark"],
    ["light", "light"],
    [null, "light"],
  ] as const)("resolves the OS scheme %s to %s", async (os, scheme) => {
    mockPrefsStore.prefs = { colorMode: "system" };

    // react-native's Jest preset stubs `useColorScheme`; scope the override to this test.
    await jest.mocked(useColorScheme).withImplementation(
      () => os,
      async () => {
        const { result } = await setup();
        expect(result.current.scheme).toBe(scheme);
      },
    );
  });
});

describe("setters", () => {
  it("setColorMode persists locally and to prefs, then syncs native appearance next frame", async () => {
    const { result } = await setup();
    jest.mocked(Appearance.setColorScheme).mockClear();

    await act(async () => result.current.setColorMode("system"));

    expect(result.current.colorMode).toBe("system");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.colorMode, "system");
    expect(mockPrefsStore.update).toHaveBeenLastCalledWith({
      colorMode: "system",
      accentColorId: "forest",
      customAccent: "",
    });
    expect(Appearance.setColorScheme).not.toHaveBeenCalled();

    await frames.flush(16);

    expect(Appearance.setColorScheme).toHaveBeenCalledWith("auto");
  });

  it("setColorMode cancels a still-pending appearance frame", async () => {
    const { result } = await setup();

    await act(async () => result.current.setColorMode("light"));
    await act(async () => result.current.setColorMode("dark"));

    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
  });

  it("setAccentColor switches preset and clears a custom accent", async () => {
    mockPrefsStore.prefs = { customAccent: "#112233" };
    const { result } = await setup();

    await act(async () => result.current.setAccentColor("pink"));

    expect(result.current).toMatchObject({ accentColorId: "pink", customAccent: null });
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(CUSTOM_ACCENT_KEY);
  });

  it.each([
    ["#ABC", "#aabbcc"],
    [null, null],
  ])("setCustomAccent(%s) stores %s", async (input, stored) => {
    const { result } = await setup();

    await act(async () => result.current.setCustomAccent(input));

    expect(result.current.customAccent).toBe(stored);
    expect(mockPrefsStore.update).toHaveBeenLastCalledWith(
      expect.objectContaining({ customAccent: stored ?? "" }),
    );
  });

  it("derives accent colors from a custom accent in light mode", async () => {
    mockPrefsStore.prefs = { colorMode: "light", customAccent: "#336699" };
    const { result } = await setup();
    expect(result.current.colors.accent).toMatch(/^#/);
  });
});

describe("cloud-synced prefs", () => {
  it("applies remote color mode, accent and custom accent", async () => {
    const { result } = await setup();

    await emitPrefs({ colorMode: "light", accentColorId: "pink", customAccent: "#123456" });
    await frames.flush(16);

    expect(result.current).toMatchObject({
      colorMode: "light",
      accentColorId: "pink",
      customAccent: "#123456",
    });
    expect(Appearance.setColorScheme).toHaveBeenLastCalledWith("light");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.accent, "pink");
  });

  it("removes a remotely cleared custom accent", async () => {
    mockPrefsStore.prefs = { customAccent: "#123456" };
    const { result } = await setup();
    jest.mocked(AsyncStorage.removeItem).mockClear();

    await emitPrefs({ customAccent: "" });

    expect(result.current.customAccent).toBeNull();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(CUSTOM_ACCENT_KEY);
  });

  it("ignores updates that match the current theme", async () => {
    mockPrefsStore.prefs = { colorMode: "dark", accentColorId: "forest" };
    await setup();
    jest.mocked(AsyncStorage.setItem).mockClear();

    await emitPrefs({ colorMode: "dark", accentColorId: "forest", customAccent: "zzz" });

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    expect(frames.frames).toHaveLength(0);
  });
});

describe("system UI background", () => {
  // react-native's Jest preset stubs `AppState.currentState` with a mock function.
  const appStateRef = AppState as unknown as { currentState: unknown };
  const originalState = appStateRef.currentState;

  function setCurrentState(state: string) {
    appStateRef.currentState = state;
  }

  afterEach(() => {
    appStateRef.currentState = originalState;
  });

  it("applies the background while active and again on every foreground", async () => {
    setCurrentState("active");
    await setup();
    expect(SystemUI.setBackgroundColorAsync).toHaveBeenCalled();
    jest.mocked(SystemUI.setBackgroundColorAsync).mockClear();

    appState.emit("background");
    expect(SystemUI.setBackgroundColorAsync).not.toHaveBeenCalled();

    appState.emit("active");
    expect(SystemUI.setBackgroundColorAsync).toHaveBeenCalledTimes(1);
  });

  it("skips the initial apply while backgrounded", async () => {
    setCurrentState("background");
    await setup();
    expect(SystemUI.setBackgroundColorAsync).not.toHaveBeenCalled();
  });
});

describe("unmount", () => {
  it("cancels a pending appearance frame", async () => {
    const { result, unmount } = await setup();
    await act(async () => result.current.setColorMode("light"));
    jest.mocked(cancelAnimationFrame).mockClear();

    await act(async () => unmount());

    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});
