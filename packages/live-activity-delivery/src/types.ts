export type ApnsEnvironment = "sandbox" | "production";

export type LiveActivityJobStatus = "pending" | "processing" | "delivered" | "failed" | "cancelled";

export type LiveActivityTokenStatus = "active" | "ended" | "invalid" | "expired";

export type ApnsLiveActivityResult =
  | { ok: true; apnsId?: string }
  | {
      ok: false;
      status: number;
      reason: string;
      retryable: boolean;
      invalidateToken: boolean;
    };

export type LiveActivityTokenRecord = {
  id: number;
  tokenCiphertext: string;
  apnsEnvironment: ApnsEnvironment;
  status: LiveActivityTokenStatus;
  expiresAt: Date;
  lastPushAt?: Date | null;
};

export type LiveActivityJobRecord = {
  id: string;
  activityTokenId: number;
  executeAt: Date;
  staleAt: Date | null;
  contentStateJson: string;
  status: LiveActivityJobStatus;
  attempts: number;
  lastError: string | null;
  deliveredAt: Date | null;
  qstashMessageId?: string | null;
  activityToken: LiveActivityTokenRecord;
};

/**
 * Persistence adapter for claim/deliver. Nest TypeORM and a future Fly worker
 * (Drizzle/pg) both implement this so delivery stays identical.
 */
export interface LiveActivityJobStore {
  /** Atomically claim a pending job (`pending` → `processing`). Returns false if lost the race. */
  claimJob(jobId: string): Promise<boolean>;
  getJobWithToken(jobId: string): Promise<LiveActivityJobRecord | null>;
  saveJob(job: LiveActivityJobRecord): Promise<void>;
  saveToken(token: LiveActivityTokenRecord): Promise<void>;
  /** Cancel remaining pending jobs; return QStash message ids to cancel (may be empty). */
  cancelPendingForActivity(activityTokenId: number, reason: string): Promise<string[]>;
  recoverExpiredLeases(leaseMs: number, now?: Date): Promise<void>;
  listDuePendingJobIds(limit: number, now?: Date): Promise<string[]>;
  /** Mark active tokens past expiresAt as expired; return their ids for cancel. */
  expireActiveTokens(now?: Date): Promise<number[]>;
  deleteOldExpiredTokens(cutoff: Date): Promise<number>;
}

export type ApnsCredentials = {
  teamId: string;
  keyId: string;
  /** PEM; literal `\n` sequences are normalized. */
  privateKey: string;
  bundleId?: string;
};

export class LiveActivityDeliveryError extends Error {
  constructor(
    message: string,
    readonly code:
      | "NOT_CONFIGURED"
      | "TOO_EARLY"
      | "NOT_FOUND"
      | "TRANSIENT_APNS"
      | "INVALID_TOKEN"
      | "INVALID_KEY",
    readonly retryable = false,
  ) {
    super(message);
    this.name = "LiveActivityDeliveryError";
  }
}
