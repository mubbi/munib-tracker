import { Platform } from "react-native";

import { isWebBrowserTab } from "@/lib/pwa/display-mode";

function isIosWebKitDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/** Non-Safari iOS browsers (Chrome, Edge, etc.) must open the page in Safari to install. */
export function isIosThirdPartyBrowserShell(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (!isIosWebKitDevice()) return false;
  return !/Safari/.test(ua) || /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
}

export function isIosWebKitBrowserTab(): boolean {
  return Platform.OS === "web" && isIosWebKitDevice() && isWebBrowserTab();
}

export function shouldShowIosPwaInstallBanner(): boolean {
  return isIosWebKitBrowserTab();
}

export function getIosPwaInstallNeedsSafari(): boolean {
  return isIosThirdPartyBrowserShell();
}
