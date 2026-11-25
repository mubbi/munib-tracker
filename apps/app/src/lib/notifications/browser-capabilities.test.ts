import {
  detectWebPwaBrowserMatrix,
  detectWebPwaBrowserMatrixFromUserAgent,
  detectWebRuntimeFeatures,
  getWebPwaInstallMethod,
  getWebPwaTier,
  isIosThirdPartyBrowserShell,
  isIosWebKitBrowserTab,
  isIosWebKitDevice,
  isStandalonePwa,
  isWebBrowserTab,
} from "@/lib/notifications/browser-capabilities";
import { installBrowser, useBrowser } from "@/test-support/browser";
import { usePlatform } from "@/test-support/platform";

const IOS_CHROME_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1";

/** iOS 16.3 — before third-party browsers could Add to Home Screen. */
const IOS_16_3_CHROME_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/110.0.5481.83 Mobile/15E148 Safari/604.1";

const IOS_EDGE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 EdgiOS/120.0.2210.84 Mobile/15E148 Safari/605.1.15";

const IOS_FIREFOX_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/121.0 Mobile/15E148 Safari/605.1.15";

/** Facebook in-app browser — can't Add to Home Screen. */
const IOS_FACEBOOK_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/440.0.0.0;FBBV/1]";

const MAC_SAFARI_17_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15";

const MAC_SAFARI_16_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15";

const ANDROID_FIREFOX_UA = "Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0";

const ANDROID_SAMSUNG_UA =
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36";

const IOS_SAFARI_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const DESKTOP_CHROME_WINDOWS_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const DESKTOP_EDGE_WINDOWS_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";

const ANDROID_CHROME_UA =
  "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

const DESKTOP_FIREFOX_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0";

describe("browser-capabilities (Bowser tiers)", () => {
  it("classifies desktop Windows Chrome as chromium_full (never iOS)", () => {
    const matrix = detectWebPwaBrowserMatrixFromUserAgent(DESKTOP_CHROME_WINDOWS_UA);
    expect(matrix.tier).toBe("chromium_full");
    expect(matrix.isIosWebKit).toBe(false);
    expect(matrix.needsSafariForInstall).toBe(false);
  });

  it("classifies desktop Windows Edge and Android Chrome as chromium_full", () => {
    expect(detectWebPwaBrowserMatrixFromUserAgent(DESKTOP_EDGE_WINDOWS_UA).tier).toBe(
      "chromium_full",
    );
    expect(detectWebPwaBrowserMatrixFromUserAgent(ANDROID_CHROME_UA).tier).toBe("chromium_full");
  });

  it("classifies iOS Chrome and Safari as the same WebKit tab tier", () => {
    const chrome = detectWebPwaBrowserMatrixFromUserAgent(IOS_CHROME_UA);
    const safari = detectWebPwaBrowserMatrixFromUserAgent(IOS_SAFARI_UA);
    expect(chrome.tier).toBe("ios_webkit_tab");
    expect(safari.tier).toBe("ios_webkit_tab");
    // iOS 16.4+: Chrome adds to the Home Screen from its own Share menu.
    expect(chrome.needsSafariForInstall).toBe(false);
    expect(safari.needsSafariForInstall).toBe(false);
  });

  it.each([
    ["desktop Chrome", DESKTOP_CHROME_WINDOWS_UA, "prompt"],
    ["desktop Edge", DESKTOP_EDGE_WINDOWS_UA, "prompt"],
    ["Android Chrome", ANDROID_CHROME_UA, "prompt"],
    ["Samsung Internet", ANDROID_SAMSUNG_UA, "prompt"],
    ["iPhone Safari", IOS_SAFARI_UA, "ios_safari_share"],
    ["iPhone Chrome (iOS 17)", IOS_CHROME_UA, "ios_browser_share"],
    ["iPhone Edge (iOS 17)", IOS_EDGE_UA, "ios_browser_share"],
    ["iPhone Firefox (iOS 17)", IOS_FIREFOX_UA, "ios_browser_share"],
    ["iPhone Chrome (iOS 16.3)", IOS_16_3_CHROME_UA, "ios_open_in_safari"],
    ["an iPhone in-app browser", IOS_FACEBOOK_UA, "ios_open_in_safari"],
    ["Safari 17 on macOS", MAC_SAFARI_17_UA, "mac_add_to_dock"],
    ["Safari 16 on macOS", MAC_SAFARI_16_UA, "none"],
    ["Firefox on Android", ANDROID_FIREFOX_UA, "browser_menu"],
    ["desktop Firefox", DESKTOP_FIREFOX_UA, "none"],
  ])("installs %s via %s", (_label, userAgent, method) => {
    const matrix = detectWebPwaBrowserMatrixFromUserAgent(userAgent);
    expect(matrix.installMethod).toBe(method);
    expect(matrix.needsSafariForInstall).toBe(method === "ios_open_in_safari");
  });

  it("classifies desktop Firefox as chromium_full (Web Push capable)", () => {
    expect(detectWebPwaBrowserMatrixFromUserAgent(DESKTOP_FIREFOX_UA).tier).toBe("chromium_full");
  });
});

describe("browser-capabilities limited browsers", () => {
  it("classifies an unknown desktop browser as limited", () => {
    const matrix = detectWebPwaBrowserMatrixFromUserAgent("SomeBrowser/1.0 (X11; Linux x86_64)");
    expect(matrix.tier).toBe("limited_web");
    expect(matrix.isLimitedBrowser).toBe(true);
  });

  it("treats desktop Safari as capable", () => {
    const matrix = detectWebPwaBrowserMatrixFromUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    );
    expect(matrix.tier).toBe("chromium_full");
    expect(matrix.isLimitedBrowser).toBe(false);
  });

  it("does not flag Firefox as limited", () => {
    expect(detectWebPwaBrowserMatrixFromUserAgent(DESKTOP_FIREFOX_UA).isLimitedBrowser).toBe(false);
  });
});

describe("browser-capabilities off the web", () => {
  it("reports no runtime features and no matrix", () => {
    expect(detectWebRuntimeFeatures()).toEqual({
      secureContext: false,
      serviceWorker: false,
      notifications: false,
      standalonePwa: false,
    });
    expect(detectWebPwaBrowserMatrix()).toBeNull();
    expect(getWebPwaTier()).toBeNull();
    expect(isStandalonePwa()).toBe(false);
    expect(isIosWebKitDevice()).toBe(false);
    expect(isIosWebKitBrowserTab()).toBe(false);
    expect(isIosThirdPartyBrowserShell()).toBe(false);
  });
});

describe("browser-capabilities in a browser", () => {
  usePlatform({ OS: "web" });

  describe("desktop Chrome tab", () => {
    useBrowser({ serviceWorker: {}, notification: { permission: "default" } });

    it("detects runtime features", () => {
      expect(detectWebRuntimeFeatures()).toEqual({
        secureContext: true,
        serviceWorker: true,
        notifications: true,
        standalonePwa: false,
      });
    });

    it("is a chromium browser tab", () => {
      expect(getWebPwaTier()).toBe("chromium_full");
      expect(isWebBrowserTab()).toBe(true);
      expect(isIosWebKitBrowserTab()).toBe(false);
    });
  });

  it.each([
    ["display-mode standalone", { standalone: true }],
    ["navigator.standalone", { navigatorStandalone: true }],
  ])("treats %s as an installed PWA", (_label, options) => {
    const restore = installBrowser(options);
    try {
      expect(isStandalonePwa()).toBe(true);
    } finally {
      restore();
    }
  });

  it.each([
    ["an iPhone platform", { userAgent: DESKTOP_CHROME_WINDOWS_UA, platform: "iPhone" }],
    [
      "iPadOS desktop mode",
      { userAgent: DESKTOP_CHROME_WINDOWS_UA, platform: "MacIntel", maxTouchPoints: 5 },
    ],
    [
      "an iOS client hint",
      { userAgent: DESKTOP_CHROME_WINDOWS_UA, userAgentData: { platform: "iOS" } },
    ],
  ])("recognises iOS WebKit from %s", (_label, options) => {
    const restore = installBrowser(options);
    try {
      expect(isIosWebKitDevice()).toBe(true);
    } finally {
      restore();
    }
  });

  it("does not treat a Mac without touch as iOS", () => {
    const restore = installBrowser({ userAgent: DESKTOP_CHROME_WINDOWS_UA, platform: "MacIntel" });
    try {
      expect(isIosWebKitDevice()).toBe(false);
    } finally {
      restore();
    }
  });

  it("lets iPhone Chrome tabs install from their own Share menu (iOS 16.4+)", () => {
    const restore = installBrowser({ userAgent: IOS_CHROME_UA });
    try {
      expect(isIosThirdPartyBrowserShell()).toBe(false);
      expect(getWebPwaInstallMethod()).toBe("ios_browser_share");
      expect(isIosWebKitBrowserTab()).toBe(true);
    } finally {
      restore();
    }
  });

  it("flags older iPhone Chrome tabs as needing Safari for install", () => {
    const restore = installBrowser({ userAgent: IOS_16_3_CHROME_UA });
    try {
      expect(isIosThirdPartyBrowserShell()).toBe(true);
      expect(isIosWebKitBrowserTab()).toBe(true);
    } finally {
      restore();
    }
  });

  it("has no install method once installed", () => {
    const restore = installBrowser({ userAgent: DESKTOP_CHROME_WINDOWS_UA, standalone: true });
    try {
      expect(getWebPwaInstallMethod()).toBe("none");
    } finally {
      restore();
    }
  });

  it("classifies an installed iOS PWA", () => {
    const restore = installBrowser({ userAgent: IOS_SAFARI_UA, standalone: true });
    try {
      expect(getWebPwaTier()).toBe("ios_webkit_installed");
      expect(isIosThirdPartyBrowserShell()).toBe(false);
    } finally {
      restore();
    }
  });
});
