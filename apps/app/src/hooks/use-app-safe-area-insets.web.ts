import { useSyncExternalStore } from "react";
import type { EdgeInsets } from "react-native-safe-area-context";

/**
 * Web safe-area insets from CSS `env(safe-area-inset-*)`.
 *
 * Expo Router (SDK 58+) no longer measures safe areas on web, so
 * `useSafeAreaInsets()` returns zeros there. An installed PWA on a notched or
 * Dynamic Island iPhone (`viewport-fit=cover` in +html.tsx) still needs them, so a
 * hidden probe element is padded with the `--munib-safe-*` variables declared in
 * +html.tsx and its computed padding is read back.
 */

const ZERO: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };

let probe: HTMLDivElement | null = null;
let current: EdgeInsets = ZERO;

function ensureProbe(): HTMLDivElement | null {
  if (typeof document === "undefined") return null;
  if (probe?.isConnected) return probe;
  probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = [
    "position:fixed",
    "top:0",
    "left:0",
    "width:0",
    "height:0",
    "visibility:hidden",
    "pointer-events:none",
    "padding-top:var(--munib-safe-top, env(safe-area-inset-top, 0px))",
    "padding-right:var(--munib-safe-right, env(safe-area-inset-right, 0px))",
    "padding-bottom:var(--munib-safe-bottom, env(safe-area-inset-bottom, 0px))",
    "padding-left:var(--munib-safe-left, env(safe-area-inset-left, 0px))",
  ].join(";");
  document.body.appendChild(probe);
  return probe;
}

function measure(): EdgeInsets {
  const el = ensureProbe();
  if (!el) return ZERO;
  const style = getComputedStyle(el);
  const next: EdgeInsets = {
    top: Number.parseFloat(style.paddingTop) || 0,
    right: Number.parseFloat(style.paddingRight) || 0,
    bottom: Number.parseFloat(style.paddingBottom) || 0,
    left: Number.parseFloat(style.paddingLeft) || 0,
  };
  if (
    next.top !== current.top ||
    next.right !== current.right ||
    next.bottom !== current.bottom ||
    next.left !== current.left
  ) {
    current = next;
  }
  return current;
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => {
    const before = current;
    if (measure() !== before) onChange();
  };
  window.addEventListener("resize", handler);
  window.addEventListener("orientationchange", handler);
  window.visualViewport?.addEventListener("resize", handler);
  // First measurement after mount (the probe needs a laid-out body).
  handler();
  return () => {
    window.removeEventListener("resize", handler);
    window.removeEventListener("orientationchange", handler);
    window.visualViewport?.removeEventListener("resize", handler);
  };
}

function getSnapshot(): EdgeInsets {
  return current;
}

function getServerSnapshot(): EdgeInsets {
  return ZERO;
}

export function useAppSafeAreaInsets(): EdgeInsets {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
