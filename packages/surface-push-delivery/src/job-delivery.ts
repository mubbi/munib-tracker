import {
  DELIVERY_BATCH_SIZE,
  EARLY_DELIVERY_TOLERANCE_MS,
  PROCESSING_LEASE_MS,
  RETENTION_MS,
} from "./constants.js";
import type { SurfaceJobStore, SurfaceSender } from "./types.js";
import { SurfaceDeliveryError } from "./types.js";

export type DeliverSurfaceJobInput = {
  store: SurfaceJobStore;
  senders: Partial<Record<"expo" | "web_push", SurfaceSender>>;
  jobId: string;
  cancelScheduledMessages?: (messageIds: string[]) => Promise<void>;
  now?: Date;
};

export async function deliverSurfaceJob(input: DeliverSurfaceJobInput): Promise<void> {
  const { store, senders, jobId, cancelScheduledMessages } = input;
  const now = input.now ?? new Date();

  const claimed = await store.claimJob(jobId);
  if (!claimed) return;

  const job = await store.getJobWithRegistration(jobId);
  if (!job) {
    throw new SurfaceDeliveryError("Surface push job not found", "NOT_FOUND");
  }

  if (job.executeAt.getTime() > now.getTime() + EARLY_DELIVERY_TOLERANCE_MS) {
    job.status = "pending";
    await store.saveJob(job);
    throw new SurfaceDeliveryError(
      "Surface push job arrived before its boundary",
      "TOO_EARLY",
      true,
    );
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

  const sender = senders[job.channel];
  if (!sender) {
    job.status = "pending";
    job.lastError = `No sender configured for ${job.channel}`;
    await store.saveJob(job);
    throw new SurfaceDeliveryError(`No sender for ${job.channel}`, "NOT_CONFIGURED", true);
  }

  job.attempts += 1;
  try {
    const result = await sender.send(registration.target, job.payloadJson);
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
      job.lastError = error instanceof Error ? error.message : String(error);
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

  const cleaned = await input.store.deleteOldJobs(new Date(now.getTime() - RETENTION_MS));
  return { processed, cleaned };
}
