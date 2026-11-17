import {
  DELIVERY_BATCH_SIZE,
  EARLY_DELIVERY_TOLERANCE_MS,
  MIN_PUSH_TTL_SECONDS,
  PROCESSING_LEASE_MS,
  RETENTION_MS,
} from "./constants.js";
import type { SurfaceJobRecord, SurfaceJobStore, SurfaceSender } from "./types.js";
import { SurfaceDeliveryError } from "./types.js";

export type DeliverSurfaceJobInput = {
  store: SurfaceJobStore;
  senders: Partial<Record<"expo" | "web_push", SurfaceSender>>;
  jobId: string;
  cancelScheduledMessages?: (messageIds: string[]) => Promise<void>;
  now?: Date;
};

function isTerminal(status: SurfaceJobRecord["status"] | undefined): boolean {
  return status === "delivered" || status === "cancelled" || status === "failed";
}

/**
 * Atomically claim and deliver one scheduled surface phase push. Safe for
 * concurrent QStash callbacks and cron.
 */
export async function deliverSurfaceJob(input: DeliverSurfaceJobInput): Promise<void> {
  const { store, senders, jobId, cancelScheduledMessages } = input;
  const now = input.now ?? new Date();

  const existing = await store.getJobWithRegistration(jobId);
  // Rescheduling deletes + recreates jobs; a stale QStash callback for a
  // removed row is a no-op success so QStash stops retrying it.
  if (!existing || isTerminal(existing.status)) return;

  if (existing.executeAt.getTime() > now.getTime() + EARLY_DELIVERY_TOLERANCE_MS) {
    throw new SurfaceDeliveryError(
      "Surface push job arrived before its boundary",
      "TOO_EARLY",
      true,
    );
  }

  // Never 200 while another worker holds the row: if that worker died, QStash
  // would stop retrying and the phase would wait for the lease + next cron.
  if (existing.status === "processing") {
    throw new SurfaceDeliveryError("Surface push job is already in flight", "IN_FLIGHT", true);
  }

  const claimed = await store.claimJob(jobId);
  if (!claimed) {
    const raced = await store.getJobWithRegistration(jobId);
    if (!raced || isTerminal(raced.status)) return;
    throw new SurfaceDeliveryError("Surface push job is already in flight", "IN_FLIGHT", true);
  }

  const job = await store.getJobWithRegistration(jobId);
  if (!job) {
    throw new SurfaceDeliveryError("Surface push job not found", "NOT_FOUND");
  }

  const registration = job.registration;
  if (registration.status !== "active") {
    job.status = "cancelled";
    job.lastError = "Registration is no longer active";
    await store.saveJob(job);
    return;
  }

  if (registration.expiresAt && registration.expiresAt <= now) {
    job.status = "cancelled";
    job.lastError = "Registration expired";
    registration.status = "expired";
    await Promise.all([store.saveJob(job), store.saveRegistration(registration)]);
    return;
  }

  // Web Push is a user-visible alert: a late "Mark Salah now" is noise. Expo
  // payloads are silent ongoing-notification corrections and stay useful late.
  const capToStaleAt = job.channel === "web_push" && job.staleAt != null;
  if (capToStaleAt && job.staleAt && job.staleAt <= now) {
    job.status = "cancelled";
    job.lastError = "Phase went stale before delivery";
    await store.saveJob(job);
    return;
  }

  const sender = senders[job.channel];
  if (!sender) {
    job.status = "pending";
    job.lastError = `No sender configured for ${job.channel}`;
    await store.saveJob(job);
    throw new SurfaceDeliveryError(`No sender for ${job.channel}`, "NOT_CONFIGURED", true);
  }

  try {
    if (await store.hasNewerDueJob(job, now)) {
      job.status = "cancelled";
      job.lastError = "Superseded by a newer due phase";
      await store.saveJob(job);
      return;
    }

    job.attempts += 1;
    const result = await sender.send(registration.target, job.payloadJson, {
      ttlSeconds:
        capToStaleAt && job.staleAt
          ? Math.max(
              MIN_PUSH_TTL_SECONDS,
              Math.floor((job.staleAt.getTime() - now.getTime()) / 1000),
            )
          : undefined,
    });
    if (result.ok) {
      job.status = "delivered";
      job.deliveredAt = now;
      job.lastError = null;
      registration.lastPushAt = now;
      await Promise.all([store.saveJob(job), store.saveRegistration(registration)]);
      return;
    }

    job.lastError = result.reason;
    if (result.invalidateToken) {
      job.status = "failed";
      registration.status = "invalid";
      await Promise.all([store.saveJob(job), store.saveRegistration(registration)]);
      const messageIds = await store.cancelPendingForRegistration(
        registration.id,
        "Target invalidated by push provider",
      );
      await cancelScheduledMessages?.(messageIds);
      return;
    }

    job.status = result.retryable ? "pending" : "failed";
    await store.saveJob(job);
    if (result.retryable) {
      throw new SurfaceDeliveryError("Transient surface push failure", "TRANSIENT", true);
    }
  } catch (error) {
    if (job.status === "processing") {
      job.status = "pending";
      job.lastError = error instanceof Error ? error.message.slice(0, 1_000) : String(error);
      await store.saveJob(job);
    }
    throw error;
  }
}

export type DispatchDueSurfaceJobsInput = {
  store: SurfaceJobStore;
  senders: Partial<Record<"expo" | "web_push", SurfaceSender>>;
  cancelScheduledMessages?: (messageIds: string[]) => Promise<void>;
  batchSize?: number;
  now?: Date;
};

/** Cron / worker entry: recover leases, deliver a batch, expire + purge old rows. */
export async function dispatchDueSurfaceJobs(
  input: DispatchDueSurfaceJobsInput,
): Promise<{ processed: number; cleaned: number }> {
  const now = input.now ?? new Date();
  const batchSize = input.batchSize ?? DELIVERY_BATCH_SIZE;

  await input.store.recoverExpiredLeases(PROCESSING_LEASE_MS, now);
  const dueIds = await input.store.listDuePendingJobIds(batchSize, now);

  let processed = 0;
  for (const jobId of dueIds) {
    try {
      await deliverSurfaceJob({
        store: input.store,
        senders: input.senders,
        jobId,
        cancelScheduledMessages: input.cancelScheduledMessages,
        now,
      });
    } catch {
      // Keep processing independent jobs.
    }
    processed += 1;
  }

  const expiredIds = await input.store.expireRegistrations(now);
  for (const registrationId of expiredIds) {
    const messageIds = await input.store.cancelPendingForRegistration(
      registrationId,
      "Registration expired",
    );
    await input.cancelScheduledMessages?.(messageIds);
  }

  const cutoff = new Date(now.getTime() - RETENTION_MS);
  const cleanedJobs = await input.store.deleteOldJobs(cutoff);
  const cleanedRegistrations = await input.store.deleteOldInactiveRegistrations(cutoff);
  return { processed, cleaned: cleanedJobs + cleanedRegistrations };
}
