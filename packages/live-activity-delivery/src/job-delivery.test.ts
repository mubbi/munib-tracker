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

  it("delivers jobs that arrive slightly before their boundary", async () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const store = makeStore({
      job: { executeAt: new Date(Date.now() + 45_000) },
      token: { tokenCiphertext: encryptActivityKitToken("d".repeat(64), key) },
    });
    const sendUpdate = vi.fn(
      async (): Promise<ApnsLiveActivityResult> => ({
        ok: true,
        apnsId: "apns-early",
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

  it("rethrows an in-flight claim as retryable instead of succeeding", async () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const store = makeStore({ job: { status: "processing" } });
    const sendUpdate = vi.fn();

    await expect(
      deliverLiveActivityJob({
        store,
        apns: { sendUpdate, isConfigured: () => true, close: () => undefined } as never,
        encryptionKey: key,
        jobId: "job-1",
      }),
    ).rejects.toMatchObject({
      code: "IN_FLIGHT",
      retryable: true,
    } satisfies Partial<LiveActivityDeliveryError>);
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

  it("returns when the job is already terminal", async () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const sendUpdate = vi.fn();
    for (const status of ["delivered", "cancelled", "failed"] as const) {
      const store = makeStore({ job: { status } });
      await expect(
        deliverLiveActivityJob({
          store,
          apns: { sendUpdate, isConfigured: () => true, close: () => undefined } as never,
          encryptionKey: key,
          jobId: "job-1",
        }),
      ).resolves.toBeUndefined();
    }
    expect(sendUpdate).not.toHaveBeenCalled();
  });

  it("returns when a claim race already delivered the job", async () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const store = makeStore({
      token: { tokenCiphertext: encryptActivityKitToken("e".repeat(64), key) },
    });
    const originalGet = store.getJobWithToken.bind(store);
    let reads = 0;
    store.claimJob = async () => false;
    store.getJobWithToken = async (jobId) => {
      reads += 1;
      const row = await originalGet(jobId);
      if (reads > 1 && row) return { ...row, status: "cancelled" };
      return row;
    };
    const sendUpdate = vi.fn();

    await expect(
      deliverLiveActivityJob({
        store,
        apns: { sendUpdate, isConfigured: () => true, close: () => undefined } as never,
        encryptionKey: key,
        jobId: "job-1",
      }),
    ).resolves.toBeUndefined();
    expect(sendUpdate).not.toHaveBeenCalled();
  });

  it("rethrows a lost claim as retryable when the job is still in flight", async () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const store = makeStore();
    store.claimJob = async () => false;
    const sendUpdate = vi.fn();

    await expect(
      deliverLiveActivityJob({
        store,
        apns: { sendUpdate, isConfigured: () => true, close: () => undefined } as never,
        encryptionKey: key,
        jobId: "job-1",
      }),
    ).rejects.toMatchObject({
      code: "IN_FLIGHT",
      retryable: true,
    } satisfies Partial<LiveActivityDeliveryError>);
    expect(sendUpdate).not.toHaveBeenCalled();
  });

  it("throws NOT_FOUND when the job disappears after a successful claim", async () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const store = makeStore();
    const originalGet = store.getJobWithToken.bind(store);
    let reads = 0;
    store.getJobWithToken = async (jobId) => {
      reads += 1;
      if (reads > 1) return null;
      return originalGet(jobId);
    };
    const sendUpdate = vi.fn();

    await expect(
      deliverLiveActivityJob({
        store,
        apns: { sendUpdate, isConfigured: () => true, close: () => undefined } as never,
        encryptionKey: key,
        jobId: "job-1",
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" } satisfies Partial<LiveActivityDeliveryError>);
    expect(sendUpdate).not.toHaveBeenCalled();
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

  it("keeps processing the batch when one job is already in flight", async () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const store = makeStore({
      token: { tokenCiphertext: encryptActivityKitToken("c".repeat(64), key) },
    });
    store.claimJob = async () => false;
    const sendUpdate = vi.fn(async (): Promise<ApnsLiveActivityResult> => ({ ok: true }));

    const result = await dispatchDueLiveActivityJobs({
      store,
      apns: { sendUpdate, isConfigured: () => true, close: () => undefined } as never,
      encryptionKey: key,
    });

    expect(result.processed).toBe(1);
    expect(sendUpdate).not.toHaveBeenCalled();
  });
});
