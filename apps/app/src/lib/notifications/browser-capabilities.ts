/**
 * Browser detection (Bowser) + runtime feature probes + PWA policy tiers.
 *
 * Bowser classifies OS/browser/platform reliably from the UA + client hints, so
 * desktop Windows/macOS/Linux Chrome is never mistaken for iOS Safari. Runtime
 * checks use feature detection for the APIs we actually rely on. Policy encodes
 * the platform rules (e.g. iOS WebKit shows OS notifications only from an
 * installed Home-Screen PWA).
 */

import Bowser from "bowser";
import { Platform } from "react-native";

export type WebPwaTier =
  | "chromium_full"
  | "ios_webkit_tab"
  | "ios_webkit_installed"
  | "limited_web";

export type WebRuntimeFeatures = {
  secureContext: boolean;
  serviceWorker: boolean;
  notifications: boolean;
  standalonePwa: boolean;
};

export type WebBrowserIdentity = {
  osName: string | undefined;
  osVersion: string | undefined;
  browserName: string | undefined;
  browserVersion: string | undefined;
  platformType: string | undefined;
};

export type WebPwaBrowserMatrix = {
  tier: WebPwaTier;
  browser: WebBrowserIdentity;
  runtime: WebRuntimeFeatures;
  isIosWebKit: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  isChromium: boolean;
  isLimitedBrowser: boolean;
  isInstalledPwa: boolean;
  /** iOS WebKit third-party browser (Chrome/Firefox): install must happen from Safari. */
  needsSafariForInstall: boolean;
};

type NavigatorUserAgentDataHint = {
  platform?: string;
  brands?: Array<{ brand: string; version: string }>;
  mobile?: boolean;
};

type NavigatorWithHints = Navigator & {
  userAgentData?: NavigatorUserAgentDataHint;
};

function isWebSession(): boolean {
  return Platform.OS === "web" && typeof window !== "undefined" && typeof navigator !== "undefined";
}

/** Installed PWA / Add to Home Screen (standalone or fullscreen display mode). */
export function isStandalonePwa(): boolean {
  if (Platform.OS !== "web" || typeof window === "undefined") return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
    window.matchMedia?.("(display-mode: fullscreen)")?.matches === true ||
    nav.standalone === true
  );
}

/** Browser tab (not launched from the Home Screen). */
export function isWebBrowserTab(): boolean {
  return !isStandalonePwa();
}

export function detectWebRuntimeFeatures(): WebRuntimeFeatures {
  if (!isWebSession()) {
    return {
      secureContext: false,
      serviceWorker: false,
      notifications: false,
      standalonePwa: false,
    };
  }
  return {
    secureContext: window.isSecureContext !== false,
    serviceWorker: "serviceWorker" in navigator,
    notifications: "Notification" in window,
    standalonePwa: isStandalonePwa(),
  };
}

function getBowserParser(): Bowser.Parser.Parser | null {
  if (!isWebSession()) return null;
  const nav = navigator as NavigatorWithHints;
  return Bowser.getParser(navigator.userAgent, nav.userAgentData);
}

export function parseWebBrowserIdentity(parser: Bowser.Parser.Parser): WebBrowserIdentity {
  const os = parser.getOS();
  const browser = parser.getBrowser();
  const platform = parser.getPlatform();
  return {
    osName: os.name,
    osVersion: os.version,
    browserName: browser.name,
    browserVersion: browser.version,
    platformType: platform.type,
  };
}

/** Bowser + navigator hints (covers iPad desktop UA, desktop-site mode on iPhone). */
function isIosWebKitNavigatorHint(): boolean {
  if (!isWebSession()) return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  const platform = navigator.platform;
  if (platform === "iPhone" || platform === "iPad" || platform === "iPod") return true;
  // iPadOS 13+ reports a desktop Mac UA but exposes touch points.
  if (
    platform === "MacIntel" &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1
  ) {
    return true;
  }
  const nav = navigator as NavigatorWithHints;
  if (nav.userAgentData?.platform === "iOS") return true;
  return false;
}

function isIosOs(parser: Bowser.Parser.Parser): boolean {
  const name = parser.getOSName(true);
  return name === "ios" || name === "ipados";
}

function isIosWebKitEnvironment(parser: Bowser.Parser.Parser | null): boolean {
  if (parser && isIosOs(parser)) return true;
  return isIosWebKitNavigatorHint();
}

function isAndroidOs(parser: Bowser.Parser.Parser): boolean {
  return parser.getOSName(true) === "android";
}

function isDesktopPlatform(parser: Bowser.Parser.Parser): boolean {
  return parser.getPlatformType(true) === "desktop";
}

/** Chromium-class browsers on Android/desktop (full PWA + notification tier). */
function isChromiumBrowser(parser: Bowser.Parser.Parser): boolean {
  if (isIosOs(parser)) return false;
  return (
    parser.satisfies({
      chrome: ">0",
      chromium: ">0",
      edge: ">0",
      opera: ">0",
      brave: ">0",
      "samsung internet": ">0",
    }) === true
  );
}

function detectLimitedBrowser(parser: Bowser.Parser.Parser): boolean {
  if (isIosOs(parser)) return false;
  if (isChromiumBrowser(parser)) return false;
  return parser.satisfies({ firefox: ">0" }) === true || parser.getBrowserName(true) === "safari";
}

function resolveTier(
  parser: Bowser.Parser.Parser,
  isInstalledPwa: boolean,
  iosWebKit: boolean,
): WebPwaTier {
  if (iosWebKit) {
    return isInstalledPwa ? "ios_webkit_installed" : "ios_webkit_tab";
  }
  if (isChromiumBrowser(parser)) return "chromium_full";
  return "limited_web";
}

function buildMatrix(
  parser: Bowser.Parser.Parser,
  runtime: WebRuntimeFeatures,
): WebPwaBrowserMatrix {
  const browser = parseWebBrowserIdentity(parser);
  const isIosWebKit = isIosWebKitEnvironment(parser);
  const isInstalledPwa = runtime.standalonePwa;
  const needsSafariForInstall =
    isIosWebKit && !isInstalledPwa && parser.getBrowserName(true) !== "safari";

  return {
    tier: resolveTier(parser, isInstalledPwa, isIosWebKit),
    browser,
    runtime,
    isIosWebKit,
    isAndroid: isAndroidOs(parser),
    isDesktop: isDesktopPlatform(parser),
    isChromium: isChromiumBrowser(parser),
    isLimitedBrowser: detectLimitedBrowser(parser),
    isInstalledPwa,
    needsSafariForInstall,
  };
}

export function detectWebPwaBrowserMatrix(): WebPwaBrowserMatrix | null {
  const parser = getBowserParser();
  if (!parser) return null;
  return buildMatrix(parser, detectWebRuntimeFeatures());
}

/** Parse a UA string in tests/tooling without a `navigator`. */
export function detectWebPwaBrowserMatrixFromUserAgent(
  userAgent: string,
  hints?: Parameters<typeof Bowser.getParser>[1],
): WebPwaBrowserMatrix {
  const parser = Bowser.getParser(userAgent, hints);
  return buildMatrix(parser, {
    secureContext: true,
    serviceWorker: true,
    notifications: true,
    standalonePwa: false,
  });
}

export function getWebPwaTier(): WebPwaTier | null {
  return detectWebPwaBrowserMatrix()?.tier ?? null;
}

export function isIosWebKitDevice(): boolean {
  const matrix = detectWebPwaBrowserMatrix();
  if (matrix != null) return matrix.isIosWebKit;
  return isIosWebKitNavigatorHint();
}

/** iPhone/iPad WebKit in a browser tab (push needs Add to Home Screen first). */
export function isIosWebKitBrowserTab(): boolean {
  if (!isWebSession()) return false;
  return isIosWebKitDevice() && isWebBrowserTab();
}

/**
 * iOS WebKit third-party browser (Chrome/Firefox/Edge) in a tab: Add to Home
 * Screen must be done from Safari. Desktop/Android browsers always return false.
 */
export function isIosThirdPartyBrowserShell(): boolean {
  const matrix = detectWebPwaBrowserMatrix();
  return matrix?.needsSafariForInstall ?? false;
}
