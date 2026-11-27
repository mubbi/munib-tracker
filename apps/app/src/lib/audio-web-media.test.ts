import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { installWebPlayAbortGuard, setMediaSessionQueueHandlers } from "./audio-web-media";

type Listener = (event: unknown) => void;

/** Minimal browser globals: an HTMLMediaElement prototype + window listeners. */
function stubBrowser(play: () => Promise<void> | undefined) {
  class FakeMediaElement {}
  (FakeMediaElement.prototype as unknown as { play: typeof play }).play = play;
  const listeners = new Map<string, Set<Listener>>();
  const fakeWindow = {
    addEventListener: (type: string, fn: Listener) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)?.add(fn);
    },
    removeEventListener: (type: string, fn: Listener) => listeners.get(type)?.delete(fn),
  };
  const g = globalThis as Record<string, unknown>;
  const previous = { HTMLMediaElement: g.HTMLMediaElement, window: g.window };
  g.HTMLMediaElement = FakeMediaElement;
  g.window = fakeWindow;
  return {
    proto: FakeMediaElement.prototype as unknown as { play: () => Promise<void> | undefined },
    listeners,
    restore: () => {
      g.HTMLMediaElement = previous.HTMLMediaElement;
      g.window = previous.window;
    },
  };
}

describe("installWebPlayAbortGuard", () => {
  let browser: ReturnType<typeof stubBrowser>;
  let originalPlay: jest.Mock<() => Promise<void> | undefined>;

  beforeEach(() => {
    originalPlay = jest.fn<() => Promise<void> | undefined>(async () => undefined);
    browser = stubBrowser(originalPlay);
  });
  afterEach(() => browser.restore());

  it("swallows AbortError from play() and restores play() on cleanup", async () => {
    const cleanup = installWebPlayAbortGuard();
    expect(browser.proto.play).not.toBe(originalPlay);

    originalPlay.mockReturnValueOnce(
      Promise.reject(Object.assign(new Error("interrupted"), { name: "AbortError" })),
    );
    await expect(browser.proto.play()).resolves.toBeUndefined();

    cleanup();
    expect(browser.proto.play).toBe(originalPlay);
  });

  it("still propagates other play() rejections", async () => {
    const cleanup = installWebPlayAbortGuard();
    originalPlay.mockReturnValueOnce(
      Promise.reject(Object.assign(new Error("denied"), { name: "NotAllowedError" })),
    );
    await expect(browser.proto.play()).rejects.toMatchObject({ name: "NotAllowedError" });
    cleanup();
  });

  it("passes through a non-promise play() result", () => {
    const cleanup = installWebPlayAbortGuard();
    originalPlay.mockReturnValueOnce(undefined);
    expect(browser.proto.play()).toBeUndefined();
    cleanup();
  });

  it("does not double-patch an already patched play()", () => {
    const first = installWebPlayAbortGuard();
    const patched = browser.proto.play;
    const second = installWebPlayAbortGuard();
    expect(browser.proto.play).toBe(patched);
    second();
    expect(browser.proto.play).toBe(patched);
    first();
    expect(browser.proto.play).toBe(originalPlay);
  });

  it("prevents the default only for unhandled play() AbortErrors", () => {
    const cleanup = installWebPlayAbortGuard();
    const [listener] = browser.listeners.get("unhandledrejection") ?? [];
    const fire = (reason: unknown) => {
      const event = { reason, preventDefault: jest.fn() };
      listener?.(event);
      return event.preventDefault;
    };
    expect(
      fire({ name: "AbortError", message: "The play() request was interrupted" }),
    ).toHaveBeenCalled();
    expect(fire({ name: "AbortError", message: "fetch aborted" })).not.toHaveBeenCalled();
    expect(fire({ name: "TypeError", message: "play() failed" })).not.toHaveBeenCalled();
    expect(fire(undefined)).not.toHaveBeenCalled();

    cleanup();
    expect(browser.listeners.get("unhandledrejection")?.size).toBe(0);
  });
});

describe("setMediaSessionQueueHandlers", () => {
  const g = globalThis as unknown as { navigator?: unknown };
  let previous: PropertyDescriptor | undefined;
  const setActionHandler = jest.fn();

  beforeEach(() => {
    previous = Object.getOwnPropertyDescriptor(g, "navigator");
    setActionHandler.mockReset();
    Object.defineProperty(g, "navigator", {
      configurable: true,
      value: { mediaSession: { setActionHandler } },
    });
  });
  afterEach(() => {
    if (previous) Object.defineProperty(g, "navigator", previous);
    else delete g.navigator;
  });

  it("wires next / previous track to the queue", () => {
    const next = () => {};
    const previousTrack = () => {};
    setMediaSessionQueueHandlers({ next, previous: previousTrack });
    expect(setActionHandler.mock.calls).toEqual([
      ["nexttrack", next],
      ["previoustrack", previousTrack],
    ]);
  });

  it("clears both handlers", () => {
    setMediaSessionQueueHandlers(null);
    expect(setActionHandler.mock.calls).toEqual([
      ["nexttrack", null],
      ["previoustrack", null],
    ]);
  });

  it("ignores browsers that reject the actions", () => {
    setActionHandler.mockImplementation(() => {
      throw new Error("unsupported");
    });
    expect(() => setMediaSessionQueueHandlers(null)).not.toThrow();
  });
});
