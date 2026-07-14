import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Platform } from "react-native";

import {
  getReadingFullscreenActive,
  setReadingFullscreenActive,
  subscribeReadingFullscreen,
} from "@/lib/reading-fullscreen";

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

function isWebFullscreenApiAvailable(): boolean {
  if (Platform.OS !== "web" || typeof document === "undefined") return false;
  const el = document.documentElement as FullscreenElement;
  return Boolean(document.fullscreenEnabled || el.webkitRequestFullscreen);
}

async function requestWebFullscreen(): Promise<void> {
  const el = document.documentElement as FullscreenElement;
  if (el.requestFullscreen) {
    await el.requestFullscreen();
    return;
  }
  await el.webkitRequestFullscreen?.();
}

async function exitWebFullscreen(): Promise<void> {
  const doc = document as FullscreenDocument;
  if (document.exitFullscreen) {
    await document.exitFullscreen();
    return;
  }
  await doc.webkitExitFullscreen?.();
}

/** Native platforms always support hiding system chrome for immersive reading. */
function isFullscreenSupported(): boolean {
  if (Platform.OS === "ios" || Platform.OS === "android") return true;
  return isWebFullscreenApiAvailable();
}

/**
 * Distraction-free reading fullscreen across web, iOS, and Android.
 *
 * - **Web:** browser Fullscreen API (existing behavior).
 * - **iOS:** hide the status bar ([Going full screen](https://developer.apple.com/design/human-interface-guidelines/going-full-screen)).
 * - **Android:** immersive mode — hide status + navigation bars with transient
 *   swipe-to-reveal ([immersive](https://developer.android.com/develop/ui/views/layout/immersive)).
 *
 * State is shared so ScreenLayout (hides the title bar) and the reading toolbar
 * (toggle + exit) stay in sync.
 */
export function useReadingFullscreen(options?: { exitOnBlur?: boolean }) {
  const exitOnBlur = options?.exitOnBlur ?? false;
  const supported = isFullscreenSupported();
  const active = useSyncExternalStore(
    subscribeReadingFullscreen,
    getReadingFullscreenActive,
    () => false,
  );

  // Keep the shared store aligned with the browser Fullscreen API on web.
  useEffect(() => {
    if (Platform.OS !== "web" || !isWebFullscreenApiAvailable()) return;

    const sync = () => setReadingFullscreenActive(getFullscreenElement() != null);
    sync();

    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const exit = useCallback(async () => {
    if (!supported) return;
    if (Platform.OS === "web") {
      if (!getFullscreenElement()) {
        setReadingFullscreenActive(false);
        return;
      }
      try {
        await exitWebFullscreen();
      } catch {
        // Browser blocked exit — leave state to the fullscreenchange listener.
      }
      return;
    }
    setReadingFullscreenActive(false);
  }, [supported]);

  const toggle = useCallback(async () => {
    if (!supported) return;
    if (Platform.OS === "web") {
      try {
        if (getFullscreenElement()) {
          await exitWebFullscreen();
        } else {
          await requestWebFullscreen();
        }
      } catch {
        // User denied or the browser blocked the request — leave state to the event.
      }
      return;
    }
    setReadingFullscreenActive(!getReadingFullscreenActive());
  }, [supported]);

  // Leaving a Qur'an reading screen should restore system chrome (HIG / immersive
  // guidance: don't stay immersive after the immersive surface is gone).
  useFocusEffect(
    useCallback(() => {
      if (!exitOnBlur) return;
      return () => {
        void exit();
      };
    }, [exit, exitOnBlur]),
  );

  return { supported, active, toggle, exit };
}

/** @deprecated Prefer `useReadingFullscreen` — kept for existing call sites. */
export function useWebFullscreen() {
  return useReadingFullscreen();
}
