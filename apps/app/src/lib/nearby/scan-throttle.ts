/**
 * Android's Bluetooth stack throttles an app that starts more than five BLE
 * scans in 30 seconds: later scans are silently downgraded to opportunistic
 * (no results) until the window clears. The limit lives in AOSP
 * (`AppScanStats`: `NUM_SCAN_DURATIONS_KEPT = 5`,
 * `EXCESSIVE_SCANNING_PERIOD_MS = 30_000`), not in the public reference; the
 * public guidance is "Never scan on a loop"
 * (https://developer.android.com/develop/connectivity/bluetooth/ble/find-ble-devices).
 *
 * The joiner restarts its scan on every background → foreground return and
 * every retry, so quick app switching could cross that line and leave the list
 * silently empty. This limiter spaces scan starts so that can't happen.
 */
export const ANDROID_SCAN_START_LIMIT = { maxStarts: 5, windowMs: 30_000 } as const;

export type ScanStartLimit = { maxStarts: number; windowMs: number };

/**
 * Milliseconds to wait before another scan may start (0 = start now), given
 * the start times already made (oldest first).
 */
export function scanStartDelay(
  starts: readonly number[],
  now: number,
  limit: ScanStartLimit = ANDROID_SCAN_START_LIMIT,
): number {
  const recent = starts.filter((at) => now - at < limit.windowMs);
  if (recent.length < limit.maxStarts) return 0;
  // The oldest start that still counts must leave the window first.
  const oldest = recent[recent.length - limit.maxStarts];
  return oldest + limit.windowMs - now;
}

/** A per-app history of scan starts (the OS counts per app, not per screen). */
export function createScanStartLimiter(limit: ScanStartLimit = ANDROID_SCAN_START_LIMIT) {
  let starts: number[] = [];
  return {
    delay: (now: number) => scanStartDelay(starts, now, limit),
    record: (now: number) => {
      starts = [...starts.filter((at) => now - at < limit.windowMs), now];
    },
    reset: () => {
      starts = [];
    },
  };
}

/** Shared by every nearby scan in the app. */
export const nearbyScanStartLimiter = createScanStartLimiter();
