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
  deleteOldJobs(cutoff: Date): Promise<number>;
}

export type SurfaceSender = {
  channel: SurfaceChannel;
  send(target: string, payloadJson: string): Promise<SurfaceSendResult>;
};

export class SurfaceDeliveryError extends Error {
  constructor(
    message: string,
    readonly code: "NOT_CONFIGURED" | "TOO_EARLY" | "NOT_FOUND" | "TRANSIENT" | "INVALID_TARGET",
    readonly retryable = false,
  ) {
    super(message);
    this.name = "SurfaceDeliveryError";
  }
}
