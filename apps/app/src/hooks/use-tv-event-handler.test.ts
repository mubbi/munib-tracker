import { renderHook } from "@testing-library/react-native";

import { usePlatform } from "@/test-support/platform";

import {
  isTvKeyDown,
  isTvMenuOrBackEvent,
  isTvNextEvent,
  isTvPlayPauseEvent,
  isTvPreviousEvent,
  setTvMenuKeyEnabled,
  type TvHwEvent,
  useTvEventHandler,
} from "./use-tv-event-handler";

const RN = require("react-native") as Record<string, unknown>;

/** Temporarily defines react-native-tvos globals on the react-native module. */
function defineOnReactNative(key: string, value: unknown) {
  const previous = Object.getOwnPropertyDescriptor(RN, key);
  Object.defineProperty(RN, key, { configurable: true, enumerable: true, value });
  return () => {
    if (previous) Object.defineProperty(RN, key, previous);
    else delete RN[key];
  };
}

const ev = (eventType: string, eventKeyAction?: number): TvHwEvent => ({
  eventType,
  eventKeyAction,
});

describe("TV event predicates", () => {
  it.each<[number | undefined, boolean]>([
    [undefined, true],
    [-1, true],
    [1, true],
    [0, false],
  ])("isTvKeyDown(%s) → %s", (action, expected) => {
    expect(isTvKeyDown(ev("select", action))).toBe(expected);
  });

  it.each([
    [isTvPlayPauseEvent, ["playPause", "play", "Pause"], "select"],
    [isTvNextEvent, ["fastForward", "next", "skipForward"], "rewind"],
    [isTvPreviousEvent, ["rewind", "previous", "skipBackward"], "next"],
    [isTvMenuOrBackEvent, ["menu", "Back"], "up"],
  ] as const)("%p matches its remote keys", (predicate, matches, other) => {
    for (const type of matches) expect(predicate(ev(type))).toBe(true);
    expect(predicate(ev(other))).toBe(false);
  });
});

describe("on a phone", () => {
  it("does not subscribe or touch the Menu key", async () => {
    const addListener = jest.fn();
    const restore = defineOnReactNative("TVEventHandler", { addListener });
    await renderHook(() => useTvEventHandler(jest.fn()));
    setTvMenuKeyEnabled(true);
    expect(addListener).not.toHaveBeenCalled();
    restore();
  });
});

describe("on Apple TV", () => {
  usePlatform({ OS: "ios", isTV: true });

  it("subscribes to remote events and unsubscribes on unmount", async () => {
    const remove = jest.fn();
    const addListener = jest.fn(() => ({ remove }));
    const restore = defineOnReactNative("TVEventHandler", { addListener });
    const handler = jest.fn();
    const { unmount } = await renderHook(() => useTvEventHandler(handler));
    expect(addListener).toHaveBeenCalledWith(handler);
    await unmount();
    expect(remove).toHaveBeenCalled();
    restore();
  });

  it("tolerates a missing TVEventHandler", async () => {
    const restore = defineOnReactNative("TVEventHandler", undefined);
    const { unmount } = await renderHook(() => useTvEventHandler(jest.fn()));
    await expect(unmount()).resolves.toBeUndefined();
    restore();
  });

  it("captures and releases the Menu key", () => {
    const control = { enableTVMenuKey: jest.fn(), disableTVMenuKey: jest.fn() };
    const restore = defineOnReactNative("TVEventControl", control);
    setTvMenuKeyEnabled(true);
    setTvMenuKeyEnabled(false);
    expect(control.enableTVMenuKey).toHaveBeenCalledTimes(1);
    expect(control.disableTVMenuKey).toHaveBeenCalledTimes(1);
    restore();
  });

  it("tolerates a missing TVEventControl", () => {
    const restore = defineOnReactNative("TVEventControl", undefined);
    expect(() => setTvMenuKeyEnabled(true)).not.toThrow();
    restore();
  });
});

describe("on a web TV build", () => {
  usePlatform({ OS: "web", isTV: true });

  it("stays inert", async () => {
    const addListener = jest.fn();
    const restore = defineOnReactNative("TVEventHandler", { addListener });
    await renderHook(() => useTvEventHandler(jest.fn()));
    expect(addListener).not.toHaveBeenCalled();
    restore();
  });
});
