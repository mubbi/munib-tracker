import { useEffect, useState } from "react";

/**
 * A `Date` that updates on a fixed cadence (default every minute), aligned to
 * the wall-clock boundary so the displayed clock flips exactly on the minute.
 * Drives the live clock, prayer countdown, and Hijri date on the home screen.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const tick = () => setNow(new Date());

    // Align the first tick to the next interval boundary.
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
