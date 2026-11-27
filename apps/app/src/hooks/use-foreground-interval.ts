import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export type ForegroundIntervalOptions = {
  /** Run once on mount (default `true`). */
  immediate?: boolean;
  /** `false` stops everything (no timer, no AppState listener). Default `true`. */
  enabled?: boolean;
};

/**
 * Foreground-only polling shared by the "re-check while this screen is open"
 * flows (focus-lock permissions / re-plan, the Umrah miqat proximity check,
 * the child-device resume sync). It runs `callback`:
 *
 * - once on mount (unless `immediate: false`),
 * - every `intervalMs` while the app is in the foreground (`null` = never),
 * - and again each time the app returns to the foreground (back from Settings,
 *   unlocking the phone).
 *
 * The timer is cleared while the app is in the background, so a screen left
 * open never polls location / native status behind the user's back (battery,
 * privacy). The latest `callback` is always used without restarting the timer.
 */
export function useForegroundInterval(
  callback: () => void,
  intervalMs: number | null,
  { immediate = true, enabled = true }: ForegroundIntervalOptions = {},
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const startTimer = () => {
      if (intervalMs == null || timer != null) return;
      timer = setInterval(() => callbackRef.current(), intervalMs);
    };
    const stopTimer = () => {
      if (timer == null) return;
      clearInterval(timer);
      timer = undefined;
    };

    if (immediate) callbackRef.current();
    if (AppState.currentState !== "background") startTimer();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        callbackRef.current();
        startTimer();
      } else if (state === "background") {
        stopTimer();
      }
    });
    return () => {
      subscription.remove();
      stopTimer();
    };
  }, [intervalMs, immediate, enabled]);
}
