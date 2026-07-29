import { useEffect } from "react";
import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

export type TvHwEvent = {
  eventType: string;
  eventKeyAction?: number;
  tag?: number;
};

/**
 * Safe wrapper around react-native-tvos `useTVEventHandler`.
 * No-ops on phone/web so callers can mount unconditionally.
 */
export function useTvEventHandler(handleEvent: (event: TvHwEvent) => void): void {
  useEffect(() => {
    if (!isTV() || Platform.OS === "web") return;

    const RN = require("react-native") as {
      TVEventHandler?: {
        addListener: (listener: (event: TvHwEvent) => void) => { remove: () => void } | undefined;
      };
      TVEventControl?: {
        enableTVMenuKey?: () => void;
        disableTVMenuKey?: () => void;
      };
    };

    // Receive Menu on Apple TV instead of immediately exiting to the system home.
    RN.TVEventControl?.enableTVMenuKey?.();

    const subscription = RN.TVEventHandler?.addListener?.(handleEvent);
    return () => {
      subscription?.remove();
      RN.TVEventControl?.disableTVMenuKey?.();
    };
  }, [handleEvent]);
}

/** True for the physical key-down (ignore Android key-up duplicates). */
export function isTvKeyDown(event: TvHwEvent): boolean {
  // Android: 0 = up, 1 = down. Apple TV often omits eventKeyAction.
  if (event.eventKeyAction == null || event.eventKeyAction === -1) return true;
  return event.eventKeyAction === 1;
}

export function isTvPlayPauseEvent(event: TvHwEvent): boolean {
  const type = event.eventType.toLowerCase();
  return type === "playpause" || type === "play" || type === "pause";
}

export function isTvMenuOrBackEvent(event: TvHwEvent): boolean {
  const type = event.eventType.toLowerCase();
  return type === "menu" || type === "back";
}
