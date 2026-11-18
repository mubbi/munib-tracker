export type SurfaceChannel = "expo" | "web_push";

export type SurfaceJobStatus = "pending" | "processing" | "delivered" | "failed" | "cancelled";

export type SurfaceRegistrationStatus = "active" | "ended" | "invalid" | "expired";

export type SurfaceSendResult =
  | { ok: true }
  | {
      ok: false;
      status?: number;
      reason: string;
      retryable: boolean;
      invalidateToken: boolean;
    };

export type SurfaceRegistrationRecord = {
  id: number;
  channel: SurfaceChannel;
  /** Opaque token / subscription JSON ciphertext or plaintext depending on channel. */
  target: string;
  status: SurfaceRegistrationStatus;
  expiresAt: Date | null;
  lastPushAt?: Date | null;
};

export type SurfaceJobRecord = {
  id: string;
  registrationId: number;
  channel: SurfaceChannel;
  phase: string;
  executeAt: Date;
  staleAt: Date | null;
  payloadJson: string;
  status: SurfaceJobStatus;
  attempts: number;
  lastError: string | null;
  deliveredAt: Date | null;
  qstashMessageId?: string | null;
  registration: SurfaceRegistrationRecord;
};

export interface SurfaceJobStore {
  claimJob(jobId: string): Promise<boolean>;
  getJobWithRegistration(jobId: string): Promise<SurfaceJobRecord | null>;
  saveJob(job: SurfaceJobRecord): Promise<void>;
  saveRegistration(registration: SurfaceRegistrationRecord): Promise<void>;
  cancelPendingForRegistration(registrationId: number, reason: string): Promise<string[]>;
  recoverExpiredLeases(leaseMs: number, now?: Date): Promise<void>;
  listDuePendingJobIds(limit: number, now?: Date): Promise<string[]>;
  /**
   * True when a later phase for the same registration is already due or
   * delivered — a retried older job would replace the newer notification
   * (same tag / ongoing id) with stale content.
   */
  hasNewerDueJob(
    job: Pick<SurfaceJobRecord, "id" | "registrationId" | "executeAt">,
    now: Date,
  ): Promise<boolean>;
  deleteOldJobs(cutoff: Date): Promise<number>;
  /** Mark active registrations past `expiresAt` as expired; return their ids for cancel. */
  expireRegistrations(now: Date): Promise<number[]>;
  /** Delete non-active registrations (and cascaded jobs) last touched before `cutoff`. */
  deleteOldInactiveRegistrations(cutoff: Date): Promise<number>;
}

export type SurfaceSendOptions = {
  /** Provider-side TTL; past this the phase is stale and must not be shown. */
  ttlSeconds?: number;
};

export type SurfaceSender = {
  channel: SurfaceChannel;
  send(
    target: string,
    payloadJson: string,
    options?: SurfaceSendOptions,
  ): Promise<SurfaceSendResult>;
};

export class SurfaceDeliveryError extends Error {
  constructor(
    message: string,
    readonly code:
      | "NOT_CONFIGURED"
      | "TOO_EARLY"
      | "IN_FLIGHT"
      | "NOT_FOUND"
      | "TRANSIENT"
      | "INVALID_TARGET",
    readonly retryable = false,
  ) {
    super(message);
    this.name = "SurfaceDeliveryError";
  }
}
