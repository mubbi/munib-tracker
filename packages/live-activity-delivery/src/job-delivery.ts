import type { ApnsLiveActivityClient } from "./apns.js";
import {
  DELIVERY_BATCH_SIZE,
  EARLY_DELIVERY_TOLERANCE_MS,
  PROCESSING_LEASE_MS,
  RETENTION_MS,
} from "./constants.js";
import { decryptActivityKitToken } from "./token-crypto.js";
import type { LiveActivityJobStore } from "./types.js";
import { LiveActivityDeliveryError } from "./types.js";

export type DeliverLiveActivityJobInput = {
  store: LiveActivityJobStore;
  apns: ApnsLiveActivityClient;
  encryptionKey: Buffer;
  jobId: string;
  /** Optional cancel hook for QStash message ids returned by the store. */
  cancelScheduledMessages?: (messageIds: string[]) => Promise<void>;
  now?: Date;
};

/**
 * Atomically claim and deliver one scheduled ActivityKit update.
 * Safe for concurrent QStash callbacks, cron, and a future Fly worker.
 */
export async function deliverLiveActivityJob(input: DeliverLiveActivityJobInput): Promise<void> {
  const { store, apns, encryptionKey, jobId, cancelScheduledMessages } = input;
  const now = input.now ?? new Date();

  const claimed = await store.claimJob(jobId);
  if (!claimed) return;

  const job = await store.getJobWithToken(jobId);
  if (!job) {
    throw new LiveActivityDeliveryError("Live Activity job not found", "NOT_FOUND");
  }

  if (job.executeAt.getTime() > now.getTime() + EARLY_DELIVERY_TOLERANCE_MS) {
    job.status = "pending";
    await store.saveJob(job);
    throw new LiveActivityDeliveryError(
      "Live Activity job arrived before its boundary",
      "TOO_EARLY",
      true,
    );
  }

  const activity = job.activityToken;
  if (activity.status !== "active" || activity.expiresAt <= now) {
    job.status = "cancelled";
    job.lastError = "Activity is no longer active";
    await store.saveJob(job);
    return;
  }

  job.attempts += 1;
  try {
    const result = await apns.sendUpdate({
      token: decryptActivityKitToken(activity.tokenCiphertext, encryptionKey),
      environment: activity.apnsEnvironment,
      contentState: JSON.parse(job.contentStateJson) as Record<string, unknown>,
      staleAt: job.staleAt,
      expiresAt: activity.expiresAt,
    });

    if (result.ok) {
      job.status = "delivered";
      job.deliveredAt = now;
      job.lastError = null;
      activity.lastPushAt = now;
      await Promise.all([store.saveJob(job), store.saveToken(activity)]);
      return;
    }

    job.lastError = `${result.status} ${result.reason}`;
    if (result.invalidateToken) {
      job.status = "failed";
      activity.status = "invalid";
      await Promise.all([store.saveJob(job), store.saveToken(activity)]);
      const messageIds = await store.cancelPendingForActivity(
        activity.id,
        "APNs invalidated the activity token",
      );
      await cancelScheduledMessages?.(messageIds);
      return;
    }

    job.status = result.retryable ? "pending" : "failed";
    await store.saveJob(job);
    if (result.retryable) {
      throw new LiveActivityDeliveryError("Transient APNs failure", "TRANSIENT_APNS", true);
    }
  } catch (error) {
    if (job.status === "processing") {
      job.status = "pending";
      job.lastError = errorMessage(error);
      await store.saveJob(job);
    }
    throw error;
  }
}

export type DispatchDueLiveActivityJobsInput = {
  store: LiveActivityJobStore;
  apns: ApnsLiveActivityClient;
  encryptionKey: Buffer;
  cancelScheduledMessages?: (messageIds: string[]) => Promise<void>;
  batchSize?: number;
  now?: Date;
};

/** Cron / Fly worker entry: recover leases, deliver a batch, clean expired tokens. */
export async function dispatchDueLiveActivityJobs(
  input: DispatchDueLiveActivityJobsInput,
): Promise<{ processed: number; cleaned: number }> {
  const now = input.now ?? new Date();
  const batchSize = input.batchSize ?? DELIVERY_BATCH_SIZE;

  await input.store.recoverExpiredLeases(PROCESSING_LEASE_MS, now);
  const dueIds = await input.store.listDuePendingJobIds(batchSize, now);

  let processed = 0;
  for (const jobId of dueIds) {
    try {
      await deliverLiveActivityJob({
        store: input.store,
        apns: input.apns,
        encryptionKey: input.encryptionKey,
        jobId,
        cancelScheduledMessages: input.cancelScheduledMessages,
        now,
      });
    } catch {
      // Keep processing independent jobs; the next tick retries.
    }
    processed += 1;
  }

  const cleaned = await cleanupExpiredLiveActivities({
    store: input.store,
    cancelScheduledMessages: input.cancelScheduledMessages,
    now,
  });

  return { processed, cleaned };
}

export async function cleanupExpiredLiveActivities(input: {
  store: LiveActivityJobStore;
  cancelScheduledMessages?: (messageIds: string[]) => Promise<void>;
  now?: Date;
}): Promise<number> {
  const now = input.now ?? new Date();
  const expiredIds = await input.store.expireActiveTokens(now);
  for (const activityTokenId of expiredIds) {
    const messageIds = await input.store.cancelPendingForActivity(
      activityTokenId,
      "ActivityKit lifetime expired",
    );
    await input.cancelScheduledMessages?.(messageIds);
  }
  const cutoff = new Date(now.getTime() - RETENTION_MS);
  return input.store.deleteOldExpiredTokens(cutoff);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 1_000) : "Unknown error";
}
