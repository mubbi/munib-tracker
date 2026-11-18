import {
  DESKTOP_CHROME_UA,
  IPHONE_CHROME_UA,
  IPHONE_SAFARI_UA,
  installBrowser,
} from "@/test-support/browser";
import { usePlatform } from "@/test-support/platform";

import {
  getIosPwaInstallNeedsSafari,
  isIosBrowserTab,
  isIosChromeBrowser,
  isIosSafariBrowser,
  isWebBrowserTab,
  isWebPushStandalonePwa,
  registerWebPwaServiceWorker,
  shouldShowIosPwaInstallBanner,
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

  it("sends iPhone Chrome users to Safari", () => {
    restore = installBrowser({ userAgent: IPHONE_CHROME_UA });
    expect(isIosChromeBrowser()).toBe(true);
    expect(isIosSafariBrowser()).toBe(false);
    expect(getIosPwaInstallNeedsSafari()).toBe(true);
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
