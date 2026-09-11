/** ActivityKit practical lifetime used when scheduling / expiring registrations. */
export const ACTIVITY_LIFETIME_MS = 7 * 60 * 60_000 + 45 * 60_000;

/** Soft APNs content-state budget (bytes) before rejecting registration. */
export const MAX_CONTENT_STATE_BYTES = 3_500;

/** Jobs drained per cron / worker poll tick. */
export const DELIVERY_BATCH_SIZE = 50;

/**
 * Reclaim `processing` jobs whose lease expired (crash / Vercel kill). Keep
 * this short: a timed-out QStash callback used to 200 on the retry while the
 * row stayed `processing`, leaving the lock screen at 00:00 until cron.
 */
export const PROCESSING_LEASE_MS = 60_000;

/** Delete expired token rows after this retention window. */
export const RETENTION_MS = 7 * 86_400_000;

/**
 * Allow QStash to deliver slightly early. notBefore is second-precision and
 * the adhan flip is scheduled with a ~20s lead; a tight 30s window 503'd
 * legitimate wake-ups and burned QStash retries before prayer time.
 */
export const EARLY_DELIVERY_TOLERANCE_MS = 90_000;
