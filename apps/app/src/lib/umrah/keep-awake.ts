import { useEffect } from "react";

import { setTaggedKeepAwake } from "@/lib/audio-keep-awake";

/** Own tag so Umrah mode never releases the audio player's wake lock (and vice versa). */
export const UMRAH_KEEP_AWAKE_TAG = "munib-umrah-counter";

/**
 * Keep the screen on while a tawaf / sa'i counter is open (NF-3.4) through the
 * shared tagged wake lock: phone-only, failures ignored, released on unmount or
 * when `active` turns false.
 */
export function useUmrahKeepAwake(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    void setTaggedKeepAwake(UMRAH_KEEP_AWAKE_TAG, true);
    return () => {
      void setTaggedKeepAwake(UMRAH_KEEP_AWAKE_TAG, false);
    };
  }, [active]);
}
