import { describe, expect, it, vi } from "vitest";
import { deliverLiveActivityJob, dispatchDueLiveActivityJobs } from "./job-delivery.js";
import { encryptActivityKitToken, resolveActivityKitEncryptionKey } from "./token-crypto.js";
import type {
  ApnsLiveActivityResult,
  LiveActivityDeliveryError,
  LiveActivityJobRecord,
  LiveActivityJobStore,
  LiveActivityTokenRecord,
} from "./types.js";

function makeStore(seed?: {
  job?: Partial<LiveActivityJobRecord>;
  token?: Partial<LiveActivityTokenRecord>;
}): LiveActivityJobStore & {
  jobs: Map<string, LiveActivityJobRecord>;
  tokens: Map<number, LiveActivityTokenRecord>;
} {
  const token: LiveActivityTokenRecord = {
    id: 1,
    tokenCiphertext: "",
    apnsEnvironment: "sandbox",
    status: "active",
    expiresAt: new Date(Date.now() + 60 * 60_000),
    lastPushAt: null,
    ...seed?.token,
  };
  const job: LiveActivityJobRecord = {
    id: "job-1",
    activityTokenId: token.id,
    executeAt: new Date(Date.now() - 1_000),
    staleAt: null,
    contentStateJson: JSON.stringify({ phase: "markSalah" }),
    status: "pending",
    attempts: 0,
    lastError: null,
    deliveredAt: null,
    qstashMessageId: null,
    activityToken: token,
    ...seed?.job,
  };
  job.activityToken = token;

  const jobs = new Map<string, LiveActivityJobRecord>([[job.id, structuredClone(job)]]);
  const tokens = new Map<number, LiveActivityTokenRecord>([[token.id, structuredClone(token)]]);

  return {
    jobs,
    tokens,
    async claimJob(jobId) {
      const row = jobs.get(jobId);
      if (row?.status !== "pending") return false;
      row.status = "processing";
      return true;
    },
    async getJobWithToken(jobId) {
      const row = jobs.get(jobId);
      if (!row) return null;
      const activityToken = tokens.get(row.activityTokenId);
      if (!activityToken) return null;
      return { ...structuredClone(row), activityToken: structuredClone(activityToken) };
    },
    async saveJob(next) {
      jobs.set(next.id, structuredClone(next));
    },
    async saveToken(next) {
      tokens.set(next.id, structuredClone(next));
    },
    async cancelPendingForActivity(activityTokenId, reason) {
      const messageIds: string[] = [];
      for (const row of jobs.values()) {
        if (row.activityTokenId === activityTokenId && row.status === "pending") {
          if (row.qstashMessageId) messageIds.push(row.qstashMessageId);
          row.status = "cancelled";
          row.lastError = reason;
        }
      }
      return messageIds;
    },
    async recoverExpiredLeases() {},
    async listDuePendingJobIds(limit, now = new Date()) {
      return [...jobs.values()]
        .filter((row) => row.status === "pending" && row.executeAt <= now)
        .sort((a, b) => a.executeAt.getTime() - b.executeAt.getTime())
        .slice(0, limit)
        .map((row) => row.id);
    },
    async expireActiveTokens(now = new Date()) {
      const ids: number[] = [];
      for (const tokenRow of tokens.values()) {
        if (tokenRow.status === "active" && tokenRow.expiresAt <= now) {
          tokenRow.status = "expired";
          ids.push(tokenRow.id);
        }
      }
      return ids;
    },
    async deleteOldExpiredTokens() {
      return 0;
    },
  };
}

describe("deliverLiveActivityJob", () => {
  it("claims and marks a job delivered on APNs success", async () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const store = makeStore({
      token: { tokenCiphertext: encryptActivityKitToken("a".repeat(64), key) },
    });
    const sendUpdate = vi.fn(
      async (): Promise<ApnsLiveActivityResult> => ({
        ok: true,
        apnsId: "apns-1",
      }),
    );

    await deliverLiveActivityJob({
      store,
      apns: { sendUpdate, isConfigured: () => true, close: () => undefined } as never,
      encryptionKey: key,
      jobId: "job-1",
    });

    expect(sendUpdate).toHaveBeenCalledOnce();
    expect(store.jobs.get("job-1")?.status).toBe("delivered");
  });

  it("loses the race when another worker already claimed the job", async () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const store = makeStore({ job: { status: "processing" } });
    const sendUpdate = vi.fn();

    await deliverLiveActivityJob({
      store,
      apns: { sendUpdate, isConfigured: () => true, close: () => undefined } as never,
      encryptionKey: key,
      jobId: "job-1",
    });

    expect(sendUpdate).not.toHaveBeenCalled();
  });

  it("rethrows too-early deliveries as retryable", async () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const store = makeStore({
      job: { executeAt: new Date(Date.now() + 5 * 60_000) },
      token: { tokenCiphertext: encryptActivityKitToken("b".repeat(64), key) },
    });

    await expect(
      deliverLiveActivityJob({
        store,
        apns: { sendUpdate: vi.fn(), isConfigured: () => true, close: () => undefined } as never,
        encryptionKey: key,
        jobId: "job-1",
      }),
    ).rejects.toMatchObject({
      code: "TOO_EARLY",
      retryable: true,
    } satisfies Partial<LiveActivityDeliveryError>);
    expect(store.jobs.get("job-1")?.status).toBe("pending");
  });
});

describe("dispatchDueLiveActivityJobs", () => {
  it("processes due pending jobs in a batch", async () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const store = makeStore({
      token: { tokenCiphertext: encryptActivityKitToken("c".repeat(64), key) },
    });
    const sendUpdate = vi.fn(async (): Promise<ApnsLiveActivityResult> => ({ ok: true }));

    const result = await dispatchDueLiveActivityJobs({
      store,
      apns: { sendUpdate, isConfigured: () => true, close: () => undefined } as never,
      encryptionKey: key,
    });

    expect(result.processed).toBe(1);
    expect(store.jobs.get("job-1")?.status).toBe("delivered");
  });
});
