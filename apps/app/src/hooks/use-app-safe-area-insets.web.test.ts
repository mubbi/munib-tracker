import { act, renderHook } from "@testing-library/react-native";

import { isolateWithSharedReact } from "@/test-support/isolate";

type Insets = { top: string; right: string; bottom: string; left: string };
type Listener = () => void;

/** A fake probe element whose computed padding comes from `padding`. */
function installDom(
  padding: Insets,
  options: { visualViewport?: boolean; document?: boolean } = {},
) {
  const probe = { isConnected: true, setAttribute: jest.fn(), style: { cssText: "" } };
  const listeners = new Map<string, Listener>();
  const viewport = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
  const g = globalThis as Record<string, unknown>;
  const saved = {
    document: Object.getOwnPropertyDescriptor(g, "document"),
    getComputedStyle: Object.getOwnPropertyDescriptor(g, "getComputedStyle"),
    addEventListener: g.addEventListener,
    removeEventListener: g.removeEventListener,
    visualViewport: Object.getOwnPropertyDescriptor(g, "visualViewport"),
  };
  const document = {
    createElement: jest.fn(() => probe),
    body: { appendChild: jest.fn() },
  };
  if (options.document === false) delete g.document;
  else Object.defineProperty(g, "document", { configurable: true, value: document });
  Object.defineProperty(g, "getComputedStyle", {
    configurable: true,
    value: () => ({
      paddingTop: padding.top,
      paddingRight: padding.right,
      paddingBottom: padding.bottom,
      paddingLeft: padding.left,
    }),
  });
  Object.defineProperty(g, "visualViewport", {
    configurable: true,
    value: options.visualViewport === false ? undefined : viewport,
  });
  g.addEventListener = jest.fn((type: string, listener: Listener) => listeners.set(type, listener));
  g.removeEventListener = jest.fn((type: string) => listeners.delete(type));

  const restore = () => {
    for (const key of ["document", "getComputedStyle", "visualViewport"] as const) {
      const descriptor = saved[key];
      if (descriptor) Object.defineProperty(g, key, descriptor);
      else delete g[key];
    }
    g.addEventListener = saved.addEventListener;
    g.removeEventListener = saved.removeEventListener;
  };
  return { document, probe, padding, listeners, viewport, restore };
}

type Dom = ReturnType<typeof installDom>;

/** Fresh module per test: the hook keeps its probe and last insets at module scope. */
function loadHook() {
  return isolateWithSharedReact(
    () =>
      require("./use-app-safe-area-insets.web") as typeof import("./use-app-safe-area-insets.web"),
  ).useAppSafeAreaInsets;
}

let dom: Dom | undefined;

afterEach(() => {
  dom?.restore();
  dom = undefined;
});

describe("useAppSafeAreaInsets (web)", () => {
  it("reads the CSS safe-area insets from a hidden probe", async () => {
    dom = installDom({ top: "47px", right: "0px", bottom: "34px", left: "" });
    const { result } = await renderHook(loadHook());
    expect(result.current).toEqual({ top: 47, right: 0, bottom: 34, left: 0 });
    expect(dom.probe.setAttribute).toHaveBeenCalledWith("aria-hidden", "true");
    expect(dom.probe.style.cssText).toContain("--munib-safe-top");
    expect(dom.document.body.appendChild).toHaveBeenCalledWith(dom.probe);
  });

  it("re-measures on resize and reuses the connected probe", async () => {
    dom = installDom({ top: "0px", right: "0px", bottom: "0px", left: "0px" });
    const { result } = await renderHook(loadHook());
    expect(result.current.top).toBe(0);
    dom.padding.top = "20px";
    await act(async () => dom?.listeners.get("orientationchange")?.());
    expect(result.current.top).toBe(20);
    expect(dom.document.createElement).toHaveBeenCalledTimes(1);
  });

  it("keeps the same insets object when nothing changed", async () => {
    dom = installDom({ top: "10px", right: "0px", bottom: "0px", left: "0px" });
    const { result } = await renderHook(loadHook());
    const before = result.current;
    await act(async () => dom?.listeners.get("resize")?.());
    expect(result.current).toBe(before);
  });

  it("recreates the probe after it is detached", async () => {
    dom = installDom({ top: "0px", right: "0px", bottom: "0px", left: "0px" });
    await renderHook(loadHook());
    dom.probe.isConnected = false;
    await act(async () => dom?.listeners.get("resize")?.());
    expect(dom.document.createElement).toHaveBeenCalledTimes(2);
  });

  it("removes its listeners on unmount", async () => {
    dom = installDom({ top: "0px", right: "0px", bottom: "0px", left: "0px" });
    const { unmount } = await renderHook(loadHook());
    expect(dom.viewport.addEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    await unmount();
    expect(dom.listeners.size).toBe(0);
    expect(dom.viewport.removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("works without a visual viewport", async () => {
    dom = installDom(
      { top: "5px", right: "0px", bottom: "0px", left: "0px" },
      { visualViewport: false },
    );
    const { result, unmount } = await renderHook(loadHook());
    expect(result.current.top).toBe(5);
    await unmount();
  });

  it("returns zero insets without a document", async () => {
    dom = installDom({ top: "9px", right: "0px", bottom: "0px", left: "0px" }, { document: false });
    const { result } = await renderHook(loadHook());
    expect(result.current).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });
});
