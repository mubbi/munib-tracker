/**
 * iOS PWA install guidance — thin wrapper over the single source of truth in
 * `@/lib/notifications/browser-capabilities` (Bowser + navigator hints + runtime
 * probes). The previous hand-rolled UA regex here mislabelled environments (e.g.
 * desktop/Android or non-iOS WebKit shells), which made the install banner show
 * incorrectly. Delegating keeps the install banner and the notification
 * permission banner on the exact same platform detection.
 */

import { Platform } from "react-native";

import {
  detectWebPwaBrowserMatrix,
  getWebPwaInstallMethod,
  isIosThirdPartyBrowserShell,
  isIosWebKitBrowserTab,
} from "@/lib/notifications/browser-capabilities";

export {
  isIosThirdPartyBrowserShell,
  isIosWebKitBrowserTab,
  isIosWebKitDevice,
} from "@/lib/notifications/browser-capabilities";

/** iPhone/iPad Safari (WebKit) that can Add to Home Screen directly. */
export function isIosSafariBrowser(): boolean {
  const matrix = detectWebPwaBrowserMatrix();
  return matrix?.installMethod === "ios_safari_share";
}

/** iPhone/iPad Chrome (installs from its own Share menu on iOS 16.4+). */
export function isIosChromeBrowser(): boolean {
  const matrix = detectWebPwaBrowserMatrix();
  return matrix?.isIosWebKit === true && matrix.browser.browserName?.toLowerCase() === "chrome";
}

/** iPhone/iPad in a browser tab (not launched from the Home Screen). */
export function isIosBrowserTab(): boolean {
  return isIosWebKitBrowserTab();
}

export function shouldShowIosPwaInstallBanner(): boolean {
  return Platform.OS === "web" && isIosWebKitBrowserTab();
}

export function getIosPwaInstallNeedsSafari(): boolean {
  return isIosThirdPartyBrowserShell();
}

/** iOS 16.4+ Chrome / Edge / Firefox tab: Share → Add to Home Screen in that browser. */
export function getIosPwaInstallViaBrowserShare(): boolean {
  return getWebPwaInstallMethod() === "ios_browser_share";
}
