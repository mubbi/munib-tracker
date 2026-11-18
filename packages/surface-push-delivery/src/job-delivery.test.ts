import { describe, expect, it, vi } from "vitest";
import {
  type DeliverSurfaceJobInput,
  type DispatchDueSurfaceJobsInput,
  deliverSurfaceJob,
  dispatchDueSurfaceJobs,
} from "./job-delivery.js";
import type {
  SurfaceDeliveryError,
  SurfaceJobRecord,
  SurfaceJobStore,
  SurfaceRegistrationRecord,
  SurfaceSender,
  SurfaceSendResult,
} from "./types.js";

type MemoryStore = SurfaceJobStore & {
  jobs: Map<string, SurfaceJobRecord>;
  registrations: Map<number, SurfaceRegistrationRecord>;
};

function makeStore(seed?: {
  job?: Partial<SurfaceJobRecord>;
  registration?: Partial<SurfaceRegistrationRecord>;
}): MemoryStore {
  const registration: SurfaceRegistrationRecord = {
    id: 1,
    channel: "web_push",
    target: "target",
    status: "active",
    expiresAt: new Date(Date.now() + 60 * 60_000),
    lastPushAt: null,
    ...seed?.registration,
  };
  const job: SurfaceJobRecord = {
    id: "job-1",
    registrationId: registration.id,
    channel: registration.channel,
    phase: "markSalah",
    executeAt: new Date(Date.now() - 1_000),
    staleAt: new Date(Date.now() + 15 * 60_000),
    payloadJson: JSON.stringify({ title: "Asr" }),
    status: "pending",
    attempts: 0,
    lastError: null,
    deliveredAt: null,
    qstashMessageId: null,
    registration,
    ...seed?.job,
  };

  const jobs = new Map([[job.id, structuredClone(job)]]);
  const registrations = new Map([[registration.id, structuredClone(registration)]]);

  return {
    jobs,
    registrations,
    async claimJob(jobId) {
      const row = jobs.get(jobId);
      if (row?.status !== "pending") return false;
      row.status = "processing";
      return true;
    },
    async getJobWithRegistration(jobId) {
      const row = jobs.get(jobId);
      const reg = row ? registrations.get(row.registrationId) : undefined;
      if (!row || !reg) return null;
      return { ...structuredClone(row), registration: structuredClone(reg) };
    },
    async saveJob(next) {
      jobs.set(next.id, structuredClone(next));
    },
    async saveRegistration(next) {
      registrations.set(next.id, structuredClone(next));
    },
    async cancelPendingForRegistration(registrationId, reason) {
      const ids: string[] = [];
      for (const row of jobs.values()) {
        if (row.registrationId === registrationId && row.status === "pending") {
          if (row.qstashMessageId) ids.push(row.qstashMessageId);
          row.status = "cancelled";
          row.lastError = reason;
        }
      }
      return ids;
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
          row.registrationId === target.registrationId &&
          row.executeAt > target.executeAt &&
          row.executeAt <= now &&
          (row.status === "pending" || row.status === "processing" || row.status === "delivered"),
      );
    },
    async deleteOldJobs() {
      return 0;
    },
    async expireRegistrations(now) {
      const ids: number[] = [];
      for (const reg of registrations.values()) {
        if (reg.status === "active" && reg.expiresAt && reg.expiresAt <= now) {
          reg.status = "expired";
          ids.push(reg.id);
        }
      }
      return ids;
    },
    async deleteOldInactiveRegistrations() {
      return 0;
    },
  };
}

type Seed = Parameters<typeof makeStore>[0] & { result?: SurfaceSendResult };

const GONE: SurfaceSendResult = {
  ok: false,
  status: 410,
  reason: "gone",
  retryable: false,
  invalidateToken: true,
};

function setup({ result = { ok: true }, ...seed }: Seed = {}) {
  const store = makeStore(seed);
  const send = vi.fn<SurfaceSender["send"]>(async () => result);
  const channel = store.jobs.get("job-1")?.channel ?? "web_push";
  const senders: DeliverSurfaceJobInput["senders"] =
    channel === "expo" ? { expo: { channel, send } } : { web_push: { channel, send } };
  const cancelScheduledMessages = vi.fn(async (_messageIds: string[]) => undefined);

  /** Adds a sibling of the seeded job on the same registration. */
  const addJob = (overrides: Partial<SurfaceJobRecord> & { id: string }) => {
    const seedJob = store.jobs.get("job-1");
    if (!seedJob) throw new Error("seed job missing");
    store.jobs.set(overrides.id, { ...structuredClone(seedJob), ...overrides });
  };
  const deliver = (input: Partial<DeliverSurfaceJobInput> = {}) =>
    deliverSurfaceJob({ store, senders, jobId: "job-1", cancelScheduledMessages, ...input });
  const dispatch = (input: Partial<DispatchDueSurfaceJobsInput> = {}) =>
    dispatchDueSurfaceJobs({ store, senders, cancelScheduledMessages, ...input });
  const job = () => store.jobs.get("job-1");
  const registration = () => store.registrations.get(1);

  return { store, send, cancelScheduledMessages, addJob, deliver, dispatch, job, registration };
}

const minutesFromNow = (minutes: number) => new Date(Date.now() + minutes * 60_000);

describe("deliverSurfaceJob", () => {
  it("delivers a due job and caps Web Push TTL to the phase stale time", async () => {
    const { send, deliver, job } = setup();

    await deliver();

    expect(job()?.status).toBe("delivered");
    const ttl = send.mock.calls[0]?.[2]?.ttlSeconds ?? 0;
    expect(ttl).toBeGreaterThan(14 * 60);
    expect(ttl).toBeLessThanOrEqual(15 * 60);
  });

  it("rethrows an in-flight job as retryable instead of succeeding", async () => {
    const { send, deliver } = setup({ job: { status: "processing" } });

    await expect(deliver()).rejects.toMatchObject({
      code: "IN_FLIGHT",
      retryable: true,
    } satisfies Partial<SurfaceDeliveryError>);
    expect(send).not.toHaveBeenCalled();
  });

  it("treats a deleted (rescheduled) job as a no-op", async () => {
    const { store, send, deliver } = setup();
    store.jobs.clear();

    await expect(deliver()).resolves.toBeUndefined();
    expect(send).not.toHaveBeenCalled();
  });

  it("leaves a too-early job pending without claiming it", async () => {
    const { deliver, job } = setup({ job: { executeAt: minutesFromNow(5) } });

    await expect(deliver()).rejects.toMatchObject({
      code: "TOO_EARLY",
    } satisfies Partial<SurfaceDeliveryError>);
    expect(job()?.status).toBe("pending");
  });

  it("cancels a stale Web Push phase instead of alerting late", async () => {
    const { send, deliver, job } = setup({
      job: { executeAt: minutesFromNow(-20), staleAt: minutesFromNow(-5) },
    });

    await deliver();

    expect(send).not.toHaveBeenCalled();
    expect(job()?.status).toBe("cancelled");
  });

  it("cancels an older job when a newer phase is already delivered", async () => {
    const { send, addJob, deliver, job } = setup({ job: { executeAt: minutesFromNow(-10) } });
    addJob({ id: "job-2", executeAt: minutesFromNow(-1), status: "delivered" });

    await deliver();

    expect(send).not.toHaveBeenCalled();
    expect(job()?.status).toBe("cancelled");
  });

  it("invalidates the registration and cancels remaining jobs on a gone target", async () => {
    const { store, addJob, cancelScheduledMessages, deliver, registration } = setup({
      result: GONE,
    });
    addJob({ id: "job-2", executeAt: minutesFromNow(30), qstashMessageId: "msg-2" });

    await deliver();

    expect(registration()?.status).toBe("invalid");
    expect(store.jobs.get("job-2")?.status).toBe("cancelled");
    expect(cancelScheduledMessages).toHaveBeenCalledWith(["msg-2"]);
  });

  it("invalidates the registration without a cancel callback", async () => {
    const { deliver, job, registration } = setup({ result: GONE });

    await deliver({ cancelScheduledMessages: undefined });

    expect(job()?.status).toBe("failed");
    expect(registration()?.status).toBe("invalid");
  });

  it.each(["delivered", "cancelled", "failed"] as const)(
    "is a no-op for a %s job",
    async (status) => {
      const { send, deliver, job } = setup({ job: { status } });

      await deliver();

      expect(send).not.toHaveBeenCalled();
      expect(job()?.status).toBe(status);
    },
  );

  it.each([
    ["finished the job", "delivered"],
    ["deleted the job", null],
  ] as const)("returns quietly when the claim loses to a worker that %s", async (_label, raced) => {
    const { store, send, deliver } = setup();
    store.claimJob = vi.fn(async () => {
      const row = store.jobs.get("job-1");
      if (raced === null) store.jobs.clear();
      else if (row) row.status = raced;
      return false;
    });

    await expect(deliver()).resolves.toBeUndefined();
    expect(send).not.toHaveBeenCalled();
  });

  it("throws IN_FLIGHT when the claim loses to a worker still processing", async () => {
    const { store, deliver } = setup();
    store.claimJob = vi.fn(async () => {
      const row = store.jobs.get("job-1");
      if (row) row.status = "processing";
      return false;
    });

    await expect(deliver()).rejects.toMatchObject({ code: "IN_FLIGHT", retryable: true });
  });

  it("throws NOT_FOUND when the job vanishes after a successful claim", async () => {
    const { store, deliver } = setup();
    const claim = store.claimJob.bind(store);
    store.claimJob = vi.fn(async (jobId: string) => {
      const claimed = await claim(jobId);
      store.jobs.clear();
      return claimed;
    });

    await expect(deliver()).rejects.toMatchObject({ code: "NOT_FOUND", retryable: false });
  });

  it("cancels the job when the registration is no longer active", async () => {
    const { send, deliver, job } = setup({ registration: { status: "invalid" } });

    await deliver();

    expect(send).not.toHaveBeenCalled();
    expect(job()).toMatchObject({
      status: "cancelled",
      lastError: "Registration is no longer active",
    });
  });

  it("cancels the job and expires the registration when it has lapsed", async () => {
    const { send, deliver, job, registration } = setup({
      registration: { expiresAt: minutesFromNow(-1) },
    });

    await deliver();

    expect(send).not.toHaveBeenCalled();
    expect(job()).toMatchObject({ status: "cancelled", lastError: "Registration expired" });
    expect(registration()?.status).toBe("expired");
  });

  it("resets the job to pending and throws NOT_CONFIGURED without a sender", async () => {
    const { deliver, job } = setup({ registration: { expiresAt: null } });

    await expect(deliver({ senders: {} })).rejects.toMatchObject({
      code: "NOT_CONFIGURED",
      retryable: true,
    });
    expect(job()).toMatchObject({
      status: "pending",
      lastError: "No sender configured for web_push",
    });
  });

  it("does not cap TTL for Expo jobs even when they are past staleAt", async () => {
    const now = new Date();
    const { send, deliver, job, registration } = setup({
      registration: { channel: "expo" },
      job: { channel: "expo", staleAt: minutesFromNow(-1) },
    });

    await deliver({ now });

    expect(send.mock.calls[0]?.[2]).toEqual({ ttlSeconds: undefined });
    expect(job()).toMatchObject({ status: "delivered", attempts: 1 });
    expect(registration()?.lastPushAt).toEqual(now);
  });

  it("does not cap TTL for Web Push jobs without staleAt", async () => {
    const { send, deliver } = setup({ job: { staleAt: null } });

    await deliver();

    expect(send.mock.calls[0]?.[2]).toEqual({ ttlSeconds: undefined });
  });

  it("floors the TTL at the minimum when staleAt is imminent", async () => {
    const now = new Date();
    const { send, deliver } = setup({
      job: { executeAt: new Date(now.getTime() - 1_000), staleAt: new Date(now.getTime() + 1_000) },
    });

    await deliver({ now });

    expect(send.mock.calls[0]?.[2]?.ttlSeconds).toBe(60);
  });

  it("marks the job failed on a permanent provider error", async () => {
    const { deliver, job, registration } = setup({
      result: { ok: false, reason: "payload too large", retryable: false, invalidateToken: false },
    });

    await expect(deliver()).resolves.toBeUndefined();

    expect(job()).toMatchObject({ status: "failed", lastError: "payload too large", attempts: 1 });
    expect(registration()?.status).toBe("active");
  });

  it("keeps the job pending and throws TRANSIENT on a retryable error", async () => {
    const { deliver, job } = setup({
      result: {
        ok: false,
        status: 503,
        reason: "unavailable",
        retryable: true,
        invalidateToken: false,
      },
    });

    await expect(deliver()).rejects.toMatchObject({ code: "TRANSIENT", retryable: true });
    expect(job()).toMatchObject({ status: "pending", lastError: "unavailable" });
  });

  it("returns a processing job to pending with a truncated message when the sender throws", async () => {
    const { send, deliver, job } = setup();
    send.mockRejectedValue(new Error("x".repeat(2_000)));

    await expect(deliver()).rejects.toThrow();

    expect(job()?.status).toBe("pending");
    expect(job()?.lastError).toHaveLength(1_000);
  });

  it("stringifies non-Error throws from the store", async () => {
    const { store, deliver, job } = setup();
    store.hasNewerDueJob = vi.fn(async () => {
      throw "db down";
    });

    await expect(deliver()).rejects.toBe("db down");
    expect(job()).toMatchObject({ status: "pending", lastError: "db down" });
  });
});

describe("dispatchDueSurfaceJobs", () => {
  it("expires lapsed registrations and cancels their pending jobs", async () => {
    const { cancelScheduledMessages, dispatch, job, registration } = setup({
      registration: { expiresAt: minutesFromNow(-1) },
      job: { executeAt: minutesFromNow(10), qstashMessageId: "msg-1" },
    });

    await dispatch();

    expect(registration()?.status).toBe("expired");
    expect(job()?.status).toBe("cancelled");
    expect(cancelScheduledMessages).toHaveBeenCalledWith(["msg-1"]);
  });

  it("expires registrations without a cancel callback", async () => {
    const { dispatch, job } = setup({
      registration: { expiresAt: minutesFromNow(-1) },
      job: { executeAt: minutesFromNow(10) },
    });

    await expect(dispatch({ cancelScheduledMessages: undefined })).resolves.toEqual({
      processed: 0,
      cleaned: 0,
    });
    expect(job()?.status).toBe("cancelled");
  });

  it("keeps processing the batch when one job fails", async () => {
    const { store, addJob, dispatch, job } = setup();
    addJob({ id: "job-0", executeAt: minutesFromNow(-60) });
    vi.spyOn(store, "hasNewerDueJob").mockRejectedValueOnce(new Error("first fails"));

    const result = await dispatch({ batchSize: 5 });

    expect(result.processed).toBe(2);
    expect(store.jobs.get("job-0")).toMatchObject({ status: "pending", lastError: "first fails" });
    expect(job()?.status).toBe("delivered");
  });

  it("sums deleted jobs and registrations into the cleaned count", async () => {
    const { store, dispatch } = setup();
    store.deleteOldJobs = vi.fn(async () => 3);
    store.deleteOldInactiveRegistrations = vi.fn(async () => 2);

    await expect(dispatch()).resolves.toMatchObject({ cleaned: 5 });
    expect(store.deleteOldJobs).toHaveBeenCalledWith(expect.any(Date));
  });

  it("recovers expired leases and uses the default batch size", async () => {
    const now = new Date();
    const { store, dispatch } = setup();
    store.recoverExpiredLeases = vi.fn(async () => undefined);
    const listDue = vi.spyOn(store, "listDuePendingJobIds");

    await dispatch({ now });

    expect(store.recoverExpiredLeases).toHaveBeenCalledWith(expect.any(Number), now);
    expect(listDue).toHaveBeenCalledWith(50, now);
  });
});
