import { Platform } from "react-native";

/** Installed PWA / Add to Home Screen (standalone or fullscreen display mode). */
export function isWebPushStandalonePwa(): boolean {
  if (Platform.OS !== "web" || typeof window === "undefined") return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
    window.matchMedia?.("(display-mode: fullscreen)")?.matches === true ||
    nav.standalone === true
  );
}

/** Safari/Chrome tab in the browser — not launched from Home Screen. */
export function isWebBrowserTab(): boolean {
  return !isWebPushStandalonePwa();
}
