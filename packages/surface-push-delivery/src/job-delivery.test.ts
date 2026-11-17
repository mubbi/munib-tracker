import { describe, expect, it, vi } from "vitest";
import { deliverSurfaceJob, dispatchDueSurfaceJobs } from "./job-delivery.js";
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

function sender(result: SurfaceSendResult = { ok: true }) {
  const send = vi.fn(async (..._args: Parameters<SurfaceSender["send"]>) => result);
  return { send, senders: { web_push: { channel: "web_push" as const, send } } };
}

describe("deliverSurfaceJob", () => {
  it("delivers a due job and caps Web Push TTL to the phase stale time", async () => {
    const store = makeStore();
    const { send, senders } = sender();

    await deliverSurfaceJob({ store, senders, jobId: "job-1" });

    expect(store.jobs.get("job-1")?.status).toBe("delivered");
    const ttl = send.mock.calls[0]?.[2]?.ttlSeconds ?? 0;
    expect(ttl).toBeGreaterThan(14 * 60);
    expect(ttl).toBeLessThanOrEqual(15 * 60);
  });

  it("rethrows an in-flight job as retryable instead of succeeding", async () => {
    const store = makeStore({ job: { status: "processing" } });
    const { send, senders } = sender();

    await expect(deliverSurfaceJob({ store, senders, jobId: "job-1" })).rejects.toMatchObject({
      code: "IN_FLIGHT",
      retryable: true,
    } satisfies Partial<SurfaceDeliveryError>);
    expect(send).not.toHaveBeenCalled();
  });

  it("treats a deleted (rescheduled) job as a no-op", async () => {
    const store = makeStore();
    store.jobs.clear();
    const { send, senders } = sender();

    await expect(deliverSurfaceJob({ store, senders, jobId: "job-1" })).resolves.toBeUndefined();
    expect(send).not.toHaveBeenCalled();
  });

  it("leaves a too-early job pending without claiming it", async () => {
    const store = makeStore({ job: { executeAt: new Date(Date.now() + 5 * 60_000) } });
    const { senders } = sender();

    await expect(deliverSurfaceJob({ store, senders, jobId: "job-1" })).rejects.toMatchObject({
      code: "TOO_EARLY",
    } satisfies Partial<SurfaceDeliveryError>);
    expect(store.jobs.get("job-1")?.status).toBe("pending");
  });

  it("cancels a stale Web Push phase instead of alerting late", async () => {
    const store = makeStore({
      job: {
        executeAt: new Date(Date.now() - 20 * 60_000),
        staleAt: new Date(Date.now() - 5 * 60_000),
      },
    });
    const { send, senders } = sender();

    await deliverSurfaceJob({ store, senders, jobId: "job-1" });

    expect(send).not.toHaveBeenCalled();
    expect(store.jobs.get("job-1")?.status).toBe("cancelled");
  });

  it("cancels an older job when a newer phase is already delivered", async () => {
    const store = makeStore({ job: { executeAt: new Date(Date.now() - 10 * 60_000) } });
    const seed = structuredClone(store.jobs.get("job-1"));
    if (!seed) throw new Error("seed job missing");
    store.jobs.set("job-2", {
      ...seed,
      id: "job-2",
      executeAt: new Date(Date.now() - 60_000),
      status: "delivered",
    });
    const { send, senders } = sender();

    await deliverSurfaceJob({ store, senders, jobId: "job-1" });

    expect(send).not.toHaveBeenCalled();
    expect(store.jobs.get("job-1")?.status).toBe("cancelled");
  });

  it("invalidates the registration and cancels remaining jobs on a gone target", async () => {
    const store = makeStore();
    const seed = structuredClone(store.jobs.get("job-1"));
    if (!seed) throw new Error("seed job missing");
    store.jobs.set("job-2", {
      ...seed,
      id: "job-2",
      executeAt: new Date(Date.now() + 30 * 60_000),
      qstashMessageId: "msg-2",
    });
    const { senders } = sender({
      ok: false,
      status: 410,
      reason: "gone",
      retryable: false,
      invalidateToken: true,
    });
    const cancelScheduledMessages = vi.fn(async () => undefined);

    await deliverSurfaceJob({ store, senders, jobId: "job-1", cancelScheduledMessages });

    expect(store.registrations.get(1)?.status).toBe("invalid");
    expect(store.jobs.get("job-2")?.status).toBe("cancelled");
    expect(cancelScheduledMessages).toHaveBeenCalledWith(["msg-2"]);
  });
});

describe("dispatchDueSurfaceJobs", () => {
  it("expires lapsed registrations and cancels their pending jobs", async () => {
    const store = makeStore({
      registration: { expiresAt: new Date(Date.now() - 60_000) },
      job: { executeAt: new Date(Date.now() + 10 * 60_000), qstashMessageId: "msg-1" },
    });
    const { senders } = sender();
    const cancelScheduledMessages = vi.fn(async () => undefined);

    await dispatchDueSurfaceJobs({ store, senders, cancelScheduledMessages });

    expect(store.registrations.get(1)?.status).toBe("expired");
    expect(store.jobs.get("job-1")?.status).toBe("cancelled");
    expect(cancelScheduledMessages).toHaveBeenCalledWith(["msg-1"]);
  });
});
