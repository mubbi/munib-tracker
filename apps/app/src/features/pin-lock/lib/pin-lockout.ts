/** Failed unlock attempts before exponential lockout begins. */
export const LOCKOUT_ATTEMPTS_THRESHOLD = 5;

/** Base lockout duration (ms); doubles for each failure beyond the threshold. */
export const LOCKOUT_BASE_MS = 30_000;

/** Maximum lockout duration (ms). */
export const LOCKOUT_MAX_MS = 15 * 60 * 1000;

export type PinLockoutResult = {
  until: number;
  durationMs: number;
};

/** Exponential backoff after too many wrong PINs. */
export function computeLockoutAfterFailure(
  failedAttempts: number,
  now: number = Date.now(),
): PinLockoutResult | null {
  if (failedAttempts < LOCKOUT_ATTEMPTS_THRESHOLD) return null;
  const excess = failedAttempts - LOCKOUT_ATTEMPTS_THRESHOLD;
  const durationMs = Math.min(LOCKOUT_MAX_MS, LOCKOUT_BASE_MS * 2 ** excess);
  return { until: now + durationMs, durationMs };
}

export function attemptsRemainingBeforeLockout(failedAttempts: number): number {
  return Math.max(0, LOCKOUT_ATTEMPTS_THRESHOLD - failedAttempts);
}
