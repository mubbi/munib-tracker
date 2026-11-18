import { cleanup, renderHook } from "@testing-library/react-native";

import { installBrowser } from "@/test-support/browser";
import { setPlatform } from "@/test-support/platform";

import {
  isWebInteractiveTarget,
  isWebTypingTarget,
  useWebKeyHandler,
  useWebScreenKeyHandler,
} from "./use-web-key-handler";

jest.mock("expo-router", () => ({ useIsFocused: () => mockFocused.current }));
jest.mock("@/lib/web/is-typing-target", () => ({
  isTypingTarget: (target: unknown) => target === "input",
}));

const mockFocused = { current: true };

type KeyEvent = {
  key: string;
  target?: unknown;
  defaultPrevented?: boolean;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  preventDefault: jest.Mock;
};

function element(tagName: string, role?: string) {
  return { tagName, getAttribute: (name: string) => (name === "role" ? (role ?? null) : null) };
}

describe("isWebInteractiveTarget", () => {
  it.each<[string, unknown, boolean]>([
    ["null", null, false],
    ["a non-element", { foo: 1 }, false],
    ["a button", element("BUTTON"), true],
    ["a link", element("A"), true],
    ["a div with a switch role", element("DIV", "switch"), true],
    ["a div with a text role", element("DIV", "text"), false],
    ["a plain div", element("DIV"), false],
    ["an element without getAttribute", { tagName: "SPAN" }, false],
  ])("returns %s → %s", (_label, target, expected) => {
    expect(isWebInteractiveTarget(target as EventTarget | null)).toBe(expected);
  });

  it("aliases the shared typing-target helper", () => {
    expect(isWebTypingTarget("input" as unknown as EventTarget)).toBe(true);
  });
});

describe("useWebKeyHandler", () => {
  let keydown: ((event: KeyEvent) => void) | undefined;
  const removeEventListener = jest.fn();
  let restore: () => void = () => {};

  function installWeb() {
    const restorePlatform = setPlatform({ OS: "web" });
    const restoreBrowser = installBrowser({
      window: {
        addEventListener: jest.fn((_type: string, cb: (event: KeyEvent) => void) => {
          keydown = cb;
        }),
        removeEventListener,
      },
    });
    restore = () => {
      restoreBrowser();
      restorePlatform();
    };
  }

  function press(overrides: Partial<KeyEvent> = {}): KeyEvent {
    const event = { key: "ArrowRight", preventDefault: jest.fn(), ...overrides };
    keydown?.(event);
    return event;
  }

  beforeEach(() => {
    keydown = undefined;
    mockFocused.current = true;
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await cleanup(); // unmount while the fake window still exists
    restore();
    restore = () => {};
  });

  it("handles keys and prevents the default when handled", async () => {
    installWeb();
    const handler = jest.fn(() => true);
    await renderHook(() => useWebKeyHandler(handler));
    expect(press().preventDefault).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ key: "ArrowRight" }));
  });

  it("leaves unhandled keys alone", async () => {
    installWeb();
    await renderHook(() => useWebKeyHandler(() => undefined));
    expect(press().preventDefault).not.toHaveBeenCalled();
  });

  it.each<[string, Partial<KeyEvent>]>([
    ["already handled", { defaultPrevented: true }],
    ["meta", { metaKey: true }],
    ["ctrl", { ctrlKey: true }],
    ["alt", { altKey: true }],
    ["typing", { target: "input" }],
  ])("ignores %s key events", async (_label, overrides) => {
    installWeb();
    const handler = jest.fn(() => true);
    await renderHook(() => useWebKeyHandler(handler));
    press(overrides);
    expect(handler).not.toHaveBeenCalled();
  });

  it("removes its listener on unmount", async () => {
    installWeb();
    const { unmount } = await renderHook(() => useWebKeyHandler(() => true));
    await unmount();
    expect(removeEventListener).toHaveBeenCalledWith("keydown", keydown);
  });

  it("does not listen when disabled", async () => {
    installWeb();
    await renderHook(() => useWebKeyHandler(() => true, false));
    expect(keydown).toBeUndefined();
  });

  it("does not listen on native", async () => {
    await renderHook(() => useWebKeyHandler(() => true));
    expect(keydown).toBeUndefined();
  });

  it("listens from a focused screen only", async () => {
    installWeb();
    mockFocused.current = false;
    const { rerender } = await renderHook(() => useWebScreenKeyHandler(() => true));
    expect(keydown).toBeUndefined();
    mockFocused.current = true;
    await rerender({});
    expect(keydown).toBeDefined();
  });
});
