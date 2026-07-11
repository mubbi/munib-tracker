import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function getFullscreenElement(): Element | null {
  if (typeof document === "undefined") return null;
  const doc = document as FullscreenDocument;
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

function isFullscreenApiAvailable(): boolean {
  if (Platform.OS !== "web" || typeof document === "undefined") return false;
  const el = document.documentElement as FullscreenElement;
  return Boolean(document.fullscreenEnabled || el.webkitRequestFullscreen);
}

async function requestFullscreen(): Promise<void> {
  const el = document.documentElement as FullscreenElement;
  if (el.requestFullscreen) {
    await el.requestFullscreen();
    return;
  }
  await el.webkitRequestFullscreen?.();
}

async function exitFullscreen(): Promise<void> {
  const doc = document as FullscreenDocument;
  if (document.exitFullscreen) {
    await document.exitFullscreen();
    return;
  }
  await doc.webkitExitFullscreen?.();
}

/**
 * Browser Fullscreen API for distraction-free reading on web.
 * No-ops on native; `supported` is false outside web / when the API is missing.
 */
export function useWebFullscreen() {
  const supported = isFullscreenApiAvailable();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!supported) return;

    const sync = () => setActive(getFullscreenElement() != null);
    sync();

    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, [supported]);

  const toggle = useCallback(async () => {
    if (!supported) return;
    try {
      if (getFullscreenElement()) {
        await exitFullscreen();
      } else {
        await requestFullscreen();
      }
    } catch {
      // User denied or the browser blocked the request — leave state to the event.
    }
  }, [supported]);

  return { supported, active, toggle };
}
