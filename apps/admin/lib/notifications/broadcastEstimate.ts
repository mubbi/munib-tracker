import { BROADCAST_BATCH_GUARD, BROADCAST_USER_BATCH_SIZE } from "@munib-tracker/shared";

/** Rough processing time per user batch (DB insert + push fan-out). */
const SECONDS_PER_BATCH = 3;
/** Client round-trip between sequential process requests (each runs up to {@link BROADCAST_BATCH_GUARD} batches). */
const SECONDS_BETWEEN_REQUESTS = 0.5;

export type BroadcastDurationEstimate = {
  batchCount: number;
  estimatedSeconds: number;
  label: string;
};

export function formatBroadcastDuration(seconds: number): string {
  if (seconds < 60) return `~${seconds} seconds`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `~${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (remMinutes === 0) return `~${hours} hour${hours === 1 ? "" : "s"}`;
  return `~${hours}h ${remMinutes}m`;
}

/** Estimate wall time for an immediate send processed in the admin UI. */
export function estimateImmediateBroadcastDuration(totalUsers: number): BroadcastDurationEstimate {
  const users = Math.max(0, Math.floor(totalUsers));
  const batchCount = users === 0 ? 0 : Math.ceil(users / BROADCAST_USER_BATCH_SIZE);
  const requestCount = batchCount === 0 ? 0 : Math.ceil(batchCount / BROADCAST_BATCH_GUARD);
  const estimatedSeconds = Math.ceil(
    batchCount * SECONDS_PER_BATCH + Math.max(0, requestCount - 1) * SECONDS_BETWEEN_REQUESTS,
  );
  return {
    batchCount,
    estimatedSeconds,
    label: batchCount === 0 ? "—" : formatBroadcastDuration(estimatedSeconds),
  };
}
