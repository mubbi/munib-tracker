/** Review-reactivation push cadence: at most one per device per this window. */
export const REVIEW_REACTIVATION_WINDOW_DAYS = 60;

export function reviewReactivationDedupeKey(deviceKey: string, windowKey: string): string {
  return `review_reactivation:${deviceKey}:${windowKey}`;
}

/** Stable window bucket for the reactivation dedupe key (client + server share this). */
export function reviewReactivationWindowKey(now: Date = new Date()): string {
  const windowIndex = Math.floor(
    now.getTime() / (REVIEW_REACTIVATION_WINDOW_DAYS * 24 * 60 * 60 * 1000),
  );
  return String(windowIndex);
}
