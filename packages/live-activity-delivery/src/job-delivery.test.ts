import { describe, expect, it, vi } from "vitest";
import {
  cleanupExpiredLiveActivities,
  type DeliverLiveActivityJobInput,
  type DispatchDueLiveActivityJobsInput,
  deliverLiveActivityJob,
  dispatchDueLiveActivityJobs,
} from "./job-delivery.js";
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
    async hasNewerDueJob(target, now) {
      return [...jobs.values()].some(
        (row) =>
          row.id !== target.id &&
          row.activityTokenId === target.activityTokenId &&
          row.executeAt > target.executeAt &&
          row.executeAt <= now &&
          (row.status === "pending" || row.status === "processing" || row.status === "delivered"),
      );
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

const KEY = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
const DEVICE_TOKEN = "a".repeat(64);

type Seed = Parameters<typeof makeStore>[0] & { result?: ApnsLiveActivityResult };

function setup({ result = { ok: true, apnsId: "apns-1" }, ...seed }: Seed = {}) {
  const store = makeStore({
    ...seed,
    token: { tokenCiphertext: encryptActivityKitToken(DEVICE_TOKEN, KEY), ...seed?.token },
  });
  const sendUpdate = vi.fn(async (_input: unknown): Promise<ApnsLiveActivityResult> => result);
  const apns = { sendUpdate, isConfigured: () => true, close: () => undefined } as never;
  const cancelScheduledMessages = vi.fn(async (_messageIds: string[]) => undefined);

  /** Adds a sibling of the seeded job on the same activity token. */
  const addJob = (overrides: Partial<LiveActivityJobRecord> & { id: string }) => {
    const seedJob = store.jobs.get("job-1");
    if (!seedJob) throw new Error("seed job missing");
    store.jobs.set(overrides.id, { ...structuredClone(seedJob), ...overrides });
  };
  const deliver = (input: Partial<DeliverLiveActivityJobInput> = {}) =>
    deliverLiveActivityJob({
      store,
      apns,
      encryptionKey: KEY,
      jobId: "job-1",
      cancelScheduledMessages,
      ...input,
    });
  const dispatch = (input: Partial<DispatchDueLiveActivityJobsInput> = {}) =>
    dispatchDueLiveActivityJobs({
      store,
      apns,
      encryptionKey: KEY,
      cancelScheduledMessages,
      ...input,
    });
  const job = () => store.jobs.get("job-1");
  const token = () => store.tokens.get(1);

  return { store, sendUpdate, cancelScheduledMessages, addJob, deliver, dispatch, job, token };
}

const minutesFromNow = (minutes: number) => new Date(Date.now() + minutes * 60_000);

const failure = (
  status: number,
  reason: string,
  flags: { retryable?: boolean; invalidateToken?: boolean } = {},
): ApnsLiveActivityResult => ({
  ok: false,
  status,
  reason,
  retryable: flags.retryable ?? false,
  invalidateToken: flags.invalidateToken ?? false,
});

describe("deliverLiveActivityJob", () => {
  it("claims and marks a job delivered on APNs success", async () => {
    const { sendUpdate, deliver, job } = setup();

    await deliver();

    expect(sendUpdate).toHaveBeenCalledOnce();
    expect(job()?.status).toBe("delivered");
  });

  it("delivers jobs that arrive slightly before their boundary", async () => {
    const { sendUpdate, deliver, job } = setup({
      job: { executeAt: new Date(Date.now() + 45_000) },
    });

    await deliver();

    expect(sendUpdate).toHaveBeenCalledOnce();
    expect(job()?.status).toBe("delivered");
  });

  it("decrypts the token and forwards content state, staleAt and expiry to APNs", async () => {
    const now = new Date();
    const staleAt = minutesFromNow(10);
    const { sendUpdate, deliver, job, token } = setup({
      job: { staleAt },
      token: { apnsEnvironment: "production" },
    });

    await deliver({ now });

    expect(sendUpdate).toHaveBeenCalledWith({
      token: DEVICE_TOKEN,
      environment: "production",
      contentState: { phase: "markSalah" },
      staleAt,
      expiresAt: token()?.expiresAt,
    });
    expect(job()).toMatchObject({ status: "delivered", attempts: 1 });
    expect(token()?.lastPushAt).toEqual(now);
  });

  it("throws NOT_FOUND for an unknown job", async () => {
    const { deliver } = setup();

    await expect(deliver({ jobId: "missing" })).rejects.toMatchObject({
      code: "NOT_FOUND",
      retryable: false,
    });
  });

  it.each(["delivered", "cancelled", "failed"] as const)(
    "returns without sending when the job is already %s",
    async (status) => {
      const { sendUpdate, deliver } = setup({ job: { status } });

      await expect(deliver()).resolves.toBeUndefined();
      expect(sendUpdate).not.toHaveBeenCalled();
    },
  );

  it("rethrows too-early deliveries as retryable", async () => {
    const { deliver, job } = setup({ job: { executeAt: minutesFromNow(5) } });

    await expect(deliver()).rejects.toMatchObject({
      code: "TOO_EARLY",
      retryable: true,
    } satisfies Partial<LiveActivityDeliveryError>);
    expect(job()?.status).toBe("pending");
  });

  it("rethrows an in-flight job as retryable instead of succeeding", async () => {
    const { sendUpdate, deliver } = setup({ job: { status: "processing" } });

    await expect(deliver()).rejects.toMatchObject({
      code: "IN_FLIGHT",
      retryable: true,
    } satisfies Partial<LiveActivityDeliveryError>);
    expect(sendUpdate).not.toHaveBeenCalled();
  });

  it("returns when a claim race already finished the job", async () => {
    const { store, sendUpdate, deliver } = setup();
    store.claimJob = async () => {
      const row = store.jobs.get("job-1");
      if (row) row.status = "cancelled";
      return false;
    };

    await expect(deliver()).resolves.toBeUndefined();
    expect(sendUpdate).not.toHaveBeenCalled();
  });

  it("rethrows a lost claim as retryable when the job is still in flight", async () => {
    const { store, sendUpdate, deliver } = setup();
    store.claimJob = async () => false;

    await expect(deliver()).rejects.toMatchObject({
      code: "IN_FLIGHT",
      retryable: true,
    } satisfies Partial<LiveActivityDeliveryError>);
    expect(sendUpdate).not.toHaveBeenCalled();
  });

  it("throws NOT_FOUND when the job disappears after a successful claim", async () => {
    const { store, sendUpdate, deliver } = setup();
    const claim = store.claimJob.bind(store);
    store.claimJob = async (jobId) => {
      const claimed = await claim(jobId);
      store.jobs.clear();
      return claimed;
    };

    await expect(deliver()).rejects.toMatchObject({
      code: "NOT_FOUND",
    } satisfies Partial<LiveActivityDeliveryError>);
    expect(sendUpdate).not.toHaveBeenCalled();
  });

  it.each([
    ["no longer active", { status: "invalid" as const }],
    ["expired", { expiresAt: minutesFromNow(-1) }],
  ])("cancels the job when the activity is %s", async (_label, tokenSeed) => {
    const { sendUpdate, deliver, job } = setup({ token: tokenSeed });

    await deliver();

    expect(sendUpdate).not.toHaveBeenCalled();
    expect(job()).toMatchObject({
      status: "cancelled",
      lastError: "Activity is no longer active",
    });
  });

  it("cancels a stale job when a newer phase for the activity is already delivered", async () => {
    const { sendUpdate, addJob, deliver, job } = setup({
      job: { executeAt: minutesFromNow(-10) },
    });
    addJob({ id: "job-2", executeAt: minutesFromNow(-1), status: "delivered" });

    await deliver();

    expect(sendUpdate).not.toHaveBeenCalled();
    expect(job()?.status).toBe("cancelled");
  });

  it("still delivers when the newer phase is not yet due", async () => {
    const { sendUpdate, addJob, deliver, job } = setup();
    addJob({ id: "job-2", executeAt: minutesFromNow(15) });

    await deliver();

    expect(sendUpdate).toHaveBeenCalledOnce();
    expect(job()?.status).toBe("delivered");
  });

  it("invalidates the token and cancels sibling jobs when APNs rejects the device", async () => {
    const { store, addJob, cancelScheduledMessages, deliver, job, token } = setup({
      result: failure(410, "Unregistered", { invalidateToken: true }),
    });
    addJob({ id: "job-2", executeAt: minutesFromNow(30), qstashMessageId: "msg-2" });

    await deliver();

    expect(job()).toMatchObject({ status: "failed", lastError: "410 Unregistered" });
    expect(token()?.status).toBe("invalid");
    expect(store.jobs.get("job-2")?.status).toBe("cancelled");
    expect(cancelScheduledMessages).toHaveBeenCalledWith(["msg-2"]);
  });

  it("invalidates the token without a cancel callback", async () => {
    const { deliver, token } = setup({
      result: failure(400, "BadDeviceToken", { invalidateToken: true }),
    });

    await deliver({ cancelScheduledMessages: undefined });

    expect(token()?.status).toBe("invalid");
  });

  it("keeps the job pending and throws TRANSIENT_APNS on retryable errors", async () => {
    const { deliver, job } = setup({
      result: failure(503, "ServiceUnavailable", { retryable: true }),
    });

    await expect(deliver()).rejects.toMatchObject({ code: "TRANSIENT_APNS", retryable: true });
    expect(job()).toMatchObject({ status: "pending", lastError: "503 ServiceUnavailable" });
  });

  it("marks the job failed on permanent APNs errors", async () => {
    const { deliver, job, token } = setup({ result: failure(400, "PayloadTooLarge") });

    await deliver();

    expect(job()?.status).toBe("failed");
    expect(token()?.status).toBe("active");
  });

  it.each([
    [new Error("y".repeat(1_500)), "y".repeat(1_000)],
    [42, "Unknown error"],
  ])("returns the job to pending when APNs throws %#", async (error, lastError) => {
    const { sendUpdate, deliver, job } = setup();
    sendUpdate.mockRejectedValue(error);

    await expect(deliver()).rejects.toBe(error);
    expect(job()).toMatchObject({ status: "pending", lastError });
  });
});

describe("dispatchDueLiveActivityJobs", () => {
  it("processes due pending jobs in a batch", async () => {
    const { dispatch, job } = setup();

    await expect(dispatch()).resolves.toMatchObject({ processed: 1 });
    expect(job()?.status).toBe("delivered");
  });

  it("keeps processing the batch when one job is already in flight", async () => {
    const { store, sendUpdate, dispatch } = setup();
    store.claimJob = async () => false;

    await expect(dispatch()).resolves.toMatchObject({ processed: 1 });
    expect(sendUpdate).not.toHaveBeenCalled();
  });
});

describe("cleanupExpiredLiveActivities", () => {
  const expiredSeed = {
    token: { expiresAt: minutesFromNow(-1) },
    job: { executeAt: minutesFromNow(1), qstashMessageId: "msg-1" },
  };

  it("expires tokens and cancels their pending jobs", async () => {
    const { store, cancelScheduledMessages, job, token } = setup(expiredSeed);

    await cleanupExpiredLiveActivities({ store, cancelScheduledMessages });

    expect(token()?.status).toBe("expired");
    expect(job()).toMatchObject({ status: "cancelled", lastError: "ActivityKit lifetime expired" });
    expect(cancelScheduledMessages).toHaveBeenCalledWith(["msg-1"]);
  });

  it("works without a cancel callback", async () => {
    const { store, token } = setup(expiredSeed);

    await expect(cleanupExpiredLiveActivities({ store })).resolves.toBe(0);
    expect(token()?.status).toBe("expired");
  });

  it("deletes tokens older than the retention cutoff and returns the count", async () => {
    const now = new Date();
    const { store } = setup();
    store.deleteOldExpiredTokens = vi.fn(async () => 4);

    await expect(cleanupExpiredLiveActivities({ store, now })).resolves.toBe(4);
    const cutoff = vi.mocked(store.deleteOldExpiredTokens).mock.calls[0]?.[0];
    expect(cutoff?.getTime()).toBeLessThan(now.getTime());
  });
});
