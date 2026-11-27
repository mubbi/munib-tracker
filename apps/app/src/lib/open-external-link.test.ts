import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

import { openExternalLink } from "./open-external-link";

jest.mock("expo-web-browser", () => ({ openBrowserAsync: jest.fn() }));

const openBrowserAsync = WebBrowser.openBrowserAsync as jest.Mock;
const URL_ = "https://www.openstreetmap.org/copyright";
const originalOS = Platform.OS;
const setOS = (os: typeof Platform.OS) =>
  Object.defineProperty(Platform, "OS", { value: os, configurable: true });

/** Jest has no browser `window`; stub just what the web path uses. */
function withWindow(win: Record<string, unknown>, run: () => void) {
  const had = "window" in globalThis;
  const previous = (globalThis as { window?: unknown }).window;
  Object.defineProperty(globalThis, "window", { value: win, configurable: true });
  try {
    run();
  } finally {
    if (had) Object.defineProperty(globalThis, "window", { value: previous, configurable: true });
    else delete (globalThis as { window?: unknown }).window;
  }
}

afterEach(() => {
  setOS(originalOS);
  openBrowserAsync.mockReset();
});

describe("openExternalLink", () => {
  it.each(["ios", "android"] as const)("uses the in-app browser on %s", async (os) => {
    setOS(os);
    openBrowserAsync.mockResolvedValue({ type: "opened" });
    await openExternalLink(URL_);
    expect(openBrowserAsync).toHaveBeenCalledWith(URL_);
  });

  it("swallows in-app browser failures", async () => {
    setOS("android");
    openBrowserAsync.mockRejectedValue(new Error("no browser"));
    await expect(openExternalLink(URL_)).resolves.toBeUndefined();
  });

  it("opens a detached new tab on web, synchronously from the click", () => {
    setOS("web");
    const tab = { opener: {} as unknown };
    const open = jest.fn().mockReturnValue(tab);
    withWindow({ open }, () => {
      void openExternalLink(URL_);
      // No await: the tab must open inside the click handler or it's popup-blocked.
      expect(open).toHaveBeenCalledWith(URL_, "_blank");
    });
    expect(tab.opener).toBeNull();
    expect(openBrowserAsync).not.toHaveBeenCalled();
  });

  it("navigates this tab when the browser blocks the new one", () => {
    setOS("web");
    const assign = jest.fn();
    withWindow({ open: jest.fn().mockReturnValue(null), location: { assign } }, () => {
      void openExternalLink(URL_);
    });
    expect(assign).toHaveBeenCalledWith(URL_);
  });

  it("ignores non-web links", async () => {
    setOS("ios");
    await openExternalLink("javascript:alert(1)");
    await openExternalLink("tel:+921234");
    expect(openBrowserAsync).not.toHaveBeenCalled();
  });
});
