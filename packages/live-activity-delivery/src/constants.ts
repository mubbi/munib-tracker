/** ActivityKit practical lifetime used when scheduling / expiring registrations. */
export const ACTIVITY_LIFETIME_MS = 7 * 60 * 60_000 + 45 * 60_000;

/** Soft APNs content-state budget (bytes) before rejecting registration. */
export const MAX_CONTENT_STATE_BYTES = 3_500;

/** Jobs drained per cron / worker poll tick. */
export const DELIVERY_BATCH_SIZE = 50;

/** Reclaim `processing` jobs whose lease expired (crash / timeout). */
export const PROCESSING_LEASE_MS = 5 * 60_000;

/** Delete expired token rows after this retention window. */
export const RETENTION_MS = 7 * 86_400_000;

/** Allow QStash/cron to deliver slightly early without treating as failure. */
export const EARLY_DELIVERY_TOLERANCE_MS = 30_000;
