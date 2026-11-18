import { cleanup, renderHook } from "@testing-library/react-native";

import { usePlatform } from "@/test-support/platform";

import { useHardUpdateWebLock } from "./use-hard-update-web-lock";

type Focusable = { focus: jest.Mock };

function installDocument(options: { host?: boolean; focusInside?: boolean; focusable?: boolean }) {
  const focusable: Focusable = { focus: jest.fn() };
  const host = {
    contains: jest.fn(() => options.focusInside ?? false),
    querySelector: jest.fn(() => (options.focusable === false ? null : focusable)),
  };
  let trap: ((event: { key: string; preventDefault: jest.Mock }) => void) | undefined;
  const doc = {
    documentElement: { style: { overflow: "auto" } },
    body: { style: { overflow: "scroll" } },
    activeElement: {},
    getElementById: jest.fn(() => (options.host === false ? null : host)),
    addEventListener: jest.fn((_type: string, cb: typeof trap) => {
      trap = cb;
    }),
    removeEventListener: jest.fn(),
  };
  Object.defineProperty(globalThis, "document", { configurable: true, value: doc });
  const press = (key: string) => {
    const event = { key, preventDefault: jest.fn() };
    trap?.(event);
    return event;
  };
  return { doc, focusable, press };
}

afterEach(async () => {
  await cleanup();
  delete (globalThis as { document?: unknown }).document;
});

describe("useHardUpdateWebLock on web", () => {
  usePlatform({ OS: "web" });

  it("locks page scroll while active and restores it afterwards", async () => {
    const { doc } = installDocument({});
    const { unmount } = await renderHook(() => useHardUpdateWebLock(true));
    expect(doc.documentElement.style.overflow).toBe("hidden");
    expect(doc.body.style.overflow).toBe("hidden");
    await unmount();
    expect(doc.documentElement.style.overflow).toBe("auto");
    expect(doc.body.style.overflow).toBe("scroll");
    expect(doc.removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function), true);
  });

  it("traps Tab focus inside the update block", async () => {
    const { focusable, press } = installDocument({});
    await renderHook(() => useHardUpdateWebLock(true));
    const event = press("Tab");
    expect(event.preventDefault).toHaveBeenCalled();
    expect(focusable.focus).toHaveBeenCalled();
  });

  it.each([
    ["other keys", "Enter", {}],
    ["focus already inside", "Tab", { focusInside: true }],
    ["no block on screen", "Tab", { host: false }],
  ])("does not trap for %s", async (_label, key, options) => {
    const { press } = installDocument(options);
    await renderHook(() => useHardUpdateWebLock(true));
    expect(press(key).preventDefault).not.toHaveBeenCalled();
  });

  it("tolerates a block without focusable controls", async () => {
    const { press } = installDocument({ focusable: false });
    await renderHook(() => useHardUpdateWebLock(true));
    expect(press("Tab").preventDefault).toHaveBeenCalled();
  });

  it("does nothing while inactive", async () => {
    const { doc } = installDocument({});
    await renderHook(() => useHardUpdateWebLock(false));
    expect(doc.documentElement.style.overflow).toBe("auto");
  });
});

describe("useHardUpdateWebLock on native", () => {
  it("does nothing", async () => {
    const { doc } = installDocument({});
    await renderHook(() => useHardUpdateWebLock(true));
    expect(doc.addEventListener).not.toHaveBeenCalled();
  });
});
