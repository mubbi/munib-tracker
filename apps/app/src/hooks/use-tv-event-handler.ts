import { useEffect } from "react";
import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

export type TvHwEvent = {
  eventType: string;
  eventKeyAction?: number;
  tag?: number;
};

type TvEventControl = {
  enableTVMenuKey?: () => void;
  disableTVMenuKey?: () => void;
};

function tvEventControl(): TvEventControl | undefined {
  if (!isTV() || Platform.OS === "web") return undefined;
  return (require("react-native") as { TVEventControl?: TvEventControl }).TVEventControl;
}

/**
 * Apple TV: capture (true) or release (false) the Menu / Back key. While
 * released, Menu goes to the system (Home) — required at the app root by the
 * tvOS HIG. Owned by `TvRemoteBridge` only; screens must not toggle it.
 */
export function setTvMenuKeyEnabled(enabled: boolean): void {
  const control = tvEventControl();
  if (enabled) control?.enableTVMenuKey?.();
  else control?.disableTVMenuKey?.();
}

/**
 * Safe wrapper around react-native-tvos `TVEventHandler`.
 * No-ops on phone/web so callers can mount unconditionally. Does not touch the
 * Menu key (see {@link setTvMenuKeyEnabled}) so multiple listeners can coexist.
 */
export function useTvEventHandler(handleEvent: (event: TvHwEvent) => void): void {
  useEffect(() => {
    if (!isTV() || Platform.OS === "web") return;

    const RN = require("react-native") as {
      TVEventHandler?: {
        addListener: (listener: (event: TvHwEvent) => void) => { remove: () => void } | undefined;
      };
    };

    const subscription = RN.TVEventHandler?.addListener?.(handleEvent);
    return () => {
      subscription?.remove();
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

/** Fast-forward / next-track remote keys (Fire TV, Android TV, Siri Remote). */
export function isTvNextEvent(event: TvHwEvent): boolean {
  const type = event.eventType.toLowerCase();
  return type === "fastforward" || type === "next" || type === "skipforward";
}

/** Rewind / previous-track remote keys. */
export function isTvPreviousEvent(event: TvHwEvent): boolean {
  const type = event.eventType.toLowerCase();
  return type === "rewind" || type === "previous" || type === "skipbackward";
}

export function isTvMenuOrBackEvent(event: TvHwEvent): boolean {
  const type = event.eventType.toLowerCase();
  return type === "menu" || type === "back";
}
