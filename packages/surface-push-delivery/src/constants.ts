export const DELIVERY_BATCH_SIZE = 50;
export const EARLY_DELIVERY_TOLERANCE_MS = 30_000;
export const PROCESSING_LEASE_MS = 2 * 60_000;
export const RETENTION_MS = 7 * 24 * 60 * 60_000;
export const MAX_PAYLOAD_BYTES = 3_500;
/** Floor for provider TTL so a near-stale phase still gets a delivery window. */
export const MIN_PUSH_TTL_SECONDS = 60;
