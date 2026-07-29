import { useEffect, useState } from "react";
import { Platform } from "react-native";

/**
 * Fixed wall-clock for static web export + the first client paint so SSG HTML
 * matches hydration (React #418). Real time starts after mount via `useEffect`.
 * Native has no SSR, so it uses wall-clock from the first paint.
 */
const WEB_HYDRATION_ANCHOR = new Date("2000-01-01T12:00:00.000Z");

/**
 * A `Date` that updates on a fixed cadence (default every minute), aligned to
 * the wall-clock boundary so the displayed clock flips exactly on the minute.
 * Drives the live clock, prayer countdown, and Hijri date on the home screen.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => (Platform.OS === "web" ? WEB_HYDRATION_ANCHOR : new Date()));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const tick = () => setNow(new Date());

    tick();

    // Align the next tick to the wall-clock boundary.
    const delay = intervalMs - (Date.now() % intervalMs);
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, intervalMs);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [intervalMs]);

  return now;
}
