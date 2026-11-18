import { WebKeyboardShortcuts } from "@/components/web/web-keyboard-shortcuts";
import { mockRouter, resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/web/is-typing-target", () => ({
  isTypingTarget: (target: unknown) => target === "input",
}));

type KeyEventInit = Partial<{
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
  target: unknown;
}>;

const setProperty = jest.fn();
let keyHandler: ((event: KeyboardEvent) => void) | null = null;
const addEventListener = jest.fn((type: string, handler: unknown) => {
  if (type === "keydown") keyHandler = handler as (event: KeyboardEvent) => void;
});
const removeEventListener = jest.fn();
/** The RN test window has no DOM listeners; these stay installed for the file (cleanup runs late). */
type ListenerWindow = { addEventListener?: unknown; removeEventListener?: unknown };

function pressKey(init: KeyEventInit) {
  const event = { key: "", preventDefault: jest.fn(), ...init } as unknown as KeyboardEvent;
  keyHandler?.(event);
  return event;
}

describe("WebKeyboardShortcuts", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    setProperty.mockClear();
    keyHandler = null;
    (globalThis as { document?: unknown }).document = {
      documentElement: { style: { setProperty } },
    };
    addEventListener.mockClear();
    removeEventListener.mockClear();
    Object.assign(window as ListenerWindow, { addEventListener, removeEventListener });
  });

  afterEach(() => {
    delete (globalThis as { document?: unknown }).document;
  });

  it("does nothing on native", async () => {
    await renderWithTheme(<WebKeyboardShortcuts />);
    expect(setProperty).not.toHaveBeenCalled();
    expect(keyHandler).toBeNull();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("publishes the accent as the focus ring colour", async () => {
      await renderWithTheme(<WebKeyboardShortcuts />);
      expect(setProperty).toHaveBeenCalledWith("--munib-focus", expect.any(String));
    });

    it.each<KeyEventInit>([{ key: "k", metaKey: true }, { key: "K", ctrlKey: true }, { key: "/" }])(
      "opens search for %o",
      async (init) => {
        setMockPathname("/tracker");
        await renderWithTheme(<WebKeyboardShortcuts />);
        const event = pressKey(init);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(mockRouter.push).toHaveBeenCalledWith("/search");
      },
    );

    it.each<KeyEventInit>([
      { key: "/", target: "input" },
      { key: "k", metaKey: true, altKey: true },
      { key: "k", metaKey: true, defaultPrevented: true },
      { key: "/", ctrlKey: true },
      { key: "a" },
    ])("ignores %o", async (init) => {
      setMockPathname("/tracker");
      await renderWithTheme(<WebKeyboardShortcuts />);
      pressKey(init);
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("stays put when already on search", async () => {
      setMockPathname("/search");
      await renderWithTheme(<WebKeyboardShortcuts />);
      pressKey({ key: "/" });
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("does not listen on chromeless routes", async () => {
      setMockPathname("/login");
      await renderWithTheme(<WebKeyboardShortcuts />);
      expect(keyHandler).toBeNull();
    });

    it("unsubscribes on unmount", async () => {
      setMockPathname("/tracker");
      const utils = await renderWithTheme(<WebKeyboardShortcuts />);
      await utils.unmount();
      expect(removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
    });
  });
});
