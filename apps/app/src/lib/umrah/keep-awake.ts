import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useEffect } from "react";
import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

/** Own tag so Umrah mode never releases the audio player's wake lock (and vice versa). */
export const UMRAH_KEEP_AWAKE_TAG = "munib-umrah-counter";

/**
 * Keep the screen on while a tawaf / sa'i counter is open (NF-3.4), following
 * the `audio-keep-awake.ts` pattern: phone-only, failures ignored, released on
 * unmount or when `active` turns false.
 */
export function useUmrahKeepAwake(active: boolean): void {
  useEffect(() => {
    if (!active || isTV() || (Platform.OS !== "ios" && Platform.OS !== "android")) return;
    void Promise.resolve()
      .then(() => activateKeepAwakeAsync(UMRAH_KEEP_AWAKE_TAG))
      .catch(() => {});
    return () => {
      // Wake-lock APIs can fail on some devices; never block the counter.
      void Promise.resolve()
        .then(() => deactivateKeepAwake(UMRAH_KEEP_AWAKE_TAG))
        .catch(() => {});
    };
  }, [active]);
}
