import {
  DESKTOP_CHROME_UA,
  IPHONE_CHROME_UA,
  IPHONE_SAFARI_UA,
  installBrowser,
} from "@/test-support/browser";
import { usePlatform } from "@/test-support/platform";

import {
  getIosPwaInstallNeedsSafari,
  getIosPwaInstallViaBrowserShare,
  isIosBrowserTab,
  isIosChromeBrowser,
  isIosSafariBrowser,
  isWebBrowserTab,
  isWebPushStandalonePwa,
  registerWebPwaServiceWorker,
  requestPersistentStorage,
  shouldShowIosPwaInstallBanner,
  syncDocumentThemeColor,
} from "./index";

let restore: () => void = () => {};
afterEach(() => {
  restore();
  restore = () => {};
});

describe("off the web", () => {
  it("is never a standalone PWA or iOS install target", () => {
    expect(isWebPushStandalonePwa()).toBe(false);
    expect(isWebBrowserTab()).toBe(true);
    expect(shouldShowIosPwaInstallBanner()).toBe(false);
    expect(isIosSafariBrowser()).toBe(false);
  });
});

describe("on web", () => {
  usePlatform({ OS: "web" });

  it.each([
    ["display-mode standalone", { standalone: true }, true],
    ["navigator.standalone", { navigatorStandalone: true }, true],
    ["a browser tab", {}, false],
  ])("detects %s", (_label, options, standalone) => {
    restore = installBrowser(options);
    expect(isWebPushStandalonePwa()).toBe(standalone);
    expect(isWebBrowserTab()).toBe(!standalone);
  });

  it("shows the install banner in an iPhone Safari tab", () => {
    restore = installBrowser({ userAgent: IPHONE_SAFARI_UA });
    expect(shouldShowIosPwaInstallBanner()).toBe(true);
    expect(isIosBrowserTab()).toBe(true);
    expect(isIosSafariBrowser()).toBe(true);
    expect(isIosChromeBrowser()).toBe(false);
    expect(getIosPwaInstallNeedsSafari()).toBe(false);
  });

  it("lets iPhone Chrome users install from Chrome's own Share menu", () => {
    restore = installBrowser({ userAgent: IPHONE_CHROME_UA });
    expect(isIosChromeBrowser()).toBe(true);
    expect(isIosSafariBrowser()).toBe(false);
    expect(getIosPwaInstallNeedsSafari()).toBe(false);
    expect(getIosPwaInstallViaBrowserShare()).toBe(true);
  });

  it("sends iPhone in-app browsers to Safari", () => {
    restore = installBrowser({
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/440.0.0.0]",
    });
    expect(getIosPwaInstallNeedsSafari()).toBe(true);
    expect(getIosPwaInstallViaBrowserShare()).toBe(false);
  });

  it("does not show the banner on desktop", () => {
    restore = installBrowser({ userAgent: DESKTOP_CHROME_UA });
    expect(shouldShowIosPwaInstallBanner()).toBe(false);
    expect(isIosChromeBrowser()).toBe(false);
  });
});

describe("registerWebPwaServiceWorker", () => {
  it("does nothing without service workers", () => {
    restore = installBrowser();
    expect(() => registerWebPwaServiceWorker()).not.toThrow();
  });

  it("registers the Expo service worker at the root scope", () => {
    const register = jest.fn(async () => ({}));
    restore = installBrowser({ serviceWorker: { register } });
    registerWebPwaServiceWorker();
    expect(register).toHaveBeenCalledWith("/expo-service-worker.js", { scope: "/" });
  });

  it("swallows registration failures", async () => {
    const register = jest.fn(async () => Promise.reject(new Error("blocked")));
    restore = installBrowser({ serviceWorker: { register } });
    registerWebPwaServiceWorker();
    await Promise.resolve();
    expect(register).toHaveBeenCalled();
  });
});

describe("requestPersistentStorage", () => {
  usePlatform({ OS: "web" });

  it("asks only inside the installed app", async () => {
    const persist = jest.fn(async () => true);
    restore = installBrowser({ navigator: { storage: { persist, persisted: async () => false } } });
    await expect(requestPersistentStorage()).resolves.toBe(false);
    expect(persist).not.toHaveBeenCalled();
  });

  it("requests persistence in the installed app", async () => {
    const persist = jest.fn(async () => true);
    restore = installBrowser({
      standalone: true,
      navigator: { storage: { persist, persisted: async () => false } },
    });
    await expect(requestPersistentStorage()).resolves.toBe(true);
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it("does not ask again once storage is persistent", async () => {
    const persist = jest.fn(async () => true);
    restore = installBrowser({
      standalone: true,
      navigator: { storage: { persist, persisted: async () => true } },
    });
    await expect(requestPersistentStorage()).resolves.toBe(true);
    expect(persist).not.toHaveBeenCalled();
  });

  it("resolves false when the API is missing or fails", async () => {
    restore = installBrowser({ standalone: true });
    await expect(requestPersistentStorage()).resolves.toBe(false);
    restore();
    restore = installBrowser({
      standalone: true,
      navigator: { storage: { persist: async () => Promise.reject(new Error("denied")) } },
    });
    await expect(requestPersistentStorage()).resolves.toBe(false);
  });
});

describe("syncDocumentThemeColor", () => {
  const holder = globalThis as { document?: unknown };

  it("points every theme-color meta at the current background", () => {
    const metas = [0, 1, 2].map(() => {
      let content = "#F5F0E6";
      return {
        getAttribute: () => content,
        setAttribute: jest.fn((_name: string, value: string) => {
          content = value;
        }),
      };
    });
    const previous = holder.document;
    holder.document = { querySelectorAll: () => metas };
    try {
      syncDocumentThemeColor("#152921");
      for (const meta of metas)
        expect(meta.setAttribute).toHaveBeenCalledWith("content", "#152921");
      // Unchanged colour: no DOM writes.
      syncDocumentThemeColor("#152921");
      for (const meta of metas) expect(meta.setAttribute).toHaveBeenCalledTimes(1);
    } finally {
      holder.document = previous;
    }
  });

  it("is a no-op without a document", () => {
    expect(() => syncDocumentThemeColor("#000000")).not.toThrow();
  });
});
