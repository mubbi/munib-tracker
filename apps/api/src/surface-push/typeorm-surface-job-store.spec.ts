import { randomUUID } from "node:crypto";
import { DataSource } from "typeorm";
import { describe, expect, it, vi } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { SurfacePushJobEntity, SurfacePushRegistrationEntity } from "../database/entities";
import { buildSurfaceJobRow, buildSurfaceRegistrationRow } from "../test-support/fixtures/push";
import { asRepository, buildMockRepository } from "../test-support/repositories";
import { TypeOrmSurfaceJobStore } from "./typeorm-surface-job-store";

const MINUTE = 60_000;

async function setup() {
  const module = await createAuthTestingModule([TypeOrmSurfaceJobStore]);
  const dataSource = module.get(DataSource);
  const jobs = dataSource.getRepository(SurfacePushJobEntity);
  const registrations = dataSource.getRepository(SurfacePushRegistrationEntity);
  const { userId } = await module.get(AuthService).createGuestSession({});

  const seedRegistration = (overrides: Partial<SurfacePushRegistrationEntity> = {}) =>
    registrations.save(registrations.create(buildSurfaceRegistrationRow(userId, overrides)));
  const seedJob = (registrationId: number, overrides: Partial<SurfacePushJobEntity> = {}) =>
    jobs.save(jobs.create(buildSurfaceJobRow(registrationId, overrides)));

  return {
    store: module.get(TypeOrmSurfaceJobStore),
    jobs,
    registrations,
    seedRegistration,
    seedJob,
  };
}

describe("TypeOrmSurfaceJobStore", () => {
  describe("claimJob", () => {
    it("moves a pending job to processing", async () => {
      const { store, jobs, seedRegistration, seedJob } = await setup();
      const job = await seedJob((await seedRegistration()).id);

      await expect(store.claimJob(job.id)).resolves.toBe(true);
      expect((await jobs.findOneByOrFail({ id: job.id })).status).toBe("processing");
    });

    it("does not claim the same job twice", async () => {
      const { store, seedRegistration, seedJob } = await setup();
      const job = await seedJob((await seedRegistration()).id);
      await store.claimJob(job.id);

      await expect(store.claimJob(job.id)).resolves.toBe(false);
    });

    it("does not claim an unknown job", async () => {
      const { store } = await setup();
      await expect(store.claimJob(randomUUID())).resolves.toBe(false);
    });
  });

  describe("getJobWithRegistration", () => {
    it("maps a job and its registration to a delivery record", async () => {
      const { store, seedRegistration, seedJob } = await setup();
      const expiresAt = new Date("2030-01-01T00:00:00Z");
      const staleAt = new Date("2030-01-02T00:00:00Z");
      const reg = await seedRegistration({ expiresAt, channel: "web_push", target: "{}" });
      const job = await seedJob(reg.id, {
        channel: "web_push",
        staleAt,
        qstashMessageId: "msg-1",
        lastError: "prior",
      });

      const record = await store.getJobWithRegistration(job.id);

      expect(record).toMatchObject({
        id: job.id,
        registrationId: reg.id,
        channel: "web_push",
        phase: "upcoming",
        payloadJson: '{"title":"Asr"}',
        status: "pending",
        attempts: 0,
        staleAt,
        lastError: "prior",
        deliveredAt: null,
        qstashMessageId: "msg-1",
        registration: {
          id: reg.id,
          channel: "web_push",
          target: "{}",
          status: "active",
          expiresAt,
        },
      });
    });

    it("maps unset optional columns to null", async () => {
      const { store, seedRegistration, seedJob } = await setup();
      const job = await seedJob((await seedRegistration()).id);

      expect(await store.getJobWithRegistration(job.id)).toMatchObject({
        staleAt: null,
        lastError: null,
        registration: { expiresAt: null },
      });
    });

    it("returns null for an unknown job", async () => {
      const { store } = await setup();
      await expect(store.getJobWithRegistration(randomUUID())).resolves.toBeNull();
    });
  });

  describe("saveJob", () => {
    async function seedRecord() {
      const ctx = await setup();
      const job = await ctx.seedJob((await ctx.seedRegistration()).id, {
        qstashMessageId: "keep-me",
      });
      const record = await ctx.store.getJobWithRegistration(job.id);
      if (!record) throw new Error("missing record");
      return { ...ctx, record };
    }

    it("persists delivery state", async () => {
      const { store, jobs, record } = await seedRecord();
      const deliveredAt = new Date("2030-01-01T00:00:00Z");

      await store.saveJob({ ...record, status: "delivered", attempts: 2, deliveredAt });

      expect(await jobs.findOneByOrFail({ id: record.id })).toMatchObject({
        status: "delivered",
        attempts: 2,
        deliveredAt,
      });
    });

    it("keeps the stored QStash message id when the record has none", async () => {
      const { store, jobs, record } = await seedRecord();
      await store.saveJob({ ...record, qstashMessageId: null });
      expect((await jobs.findOneByOrFail({ id: record.id })).qstashMessageId).toBe("keep-me");
    });

    it("overwrites the QStash message id when one is given", async () => {
      const { store, jobs, record } = await seedRecord();
      await store.saveJob({ ...record, qstashMessageId: "msg-new" });
      expect((await jobs.findOneByOrFail({ id: record.id })).qstashMessageId).toBe("msg-new");
    });

    it("persists registration status updates", async () => {
      const { store, registrations, record } = await seedRecord();
      const lastPushAt = new Date("2030-01-01T00:00:00Z");

      await store.saveRegistration({ ...record.registration, status: "invalid", lastPushAt });

      expect(await registrations.findOneByOrFail({ id: record.registrationId })).toMatchObject({
        status: "invalid",
        lastPushAt,
      });
    });
  });

  describe("cancelPendingForRegistration", () => {
    it("cancels only pending jobs and returns their QStash message ids", async () => {
      const { store, jobs, seedRegistration, seedJob } = await setup();
      const reg = await seedRegistration();
      const withMessage = await seedJob(reg.id, { qstashMessageId: "msg-a" });
      const withoutMessage = await seedJob(reg.id, { qstashMessageId: null });
      const delivered = await seedJob(reg.id, { status: "delivered", qstashMessageId: "msg-d" });

      await expect(store.cancelPendingForRegistration(reg.id, "ended")).resolves.toEqual(["msg-a"]);
      expect(await jobs.findOneByOrFail({ id: withMessage.id })).toMatchObject({
        status: "cancelled",
        lastError: "ended",
      });
      expect((await jobs.findOneByOrFail({ id: withoutMessage.id })).status).toBe("cancelled");
      expect((await jobs.findOneByOrFail({ id: delivered.id })).status).toBe("delivered");
    });

    it("returns no message ids when nothing is pending", async () => {
      const { store, seedRegistration } = await setup();
      const reg = await seedRegistration();
      await expect(store.cancelPendingForRegistration(reg.id, "ended")).resolves.toEqual([]);
    });
  });

  describe("recoverExpiredLeases", () => {
    it.each<[string, number, string]>([
      ["keeps a fresh lease", -10 * MINUTE, "processing"],
      ["re-queues an expired lease", 10 * MINUTE, "pending"],
    ])("%s", async (_label, nowOffset, expected) => {
      const { store, jobs, seedRegistration, seedJob } = await setup();
      const job = await seedJob((await seedRegistration()).id, { status: "processing" });

      await store.recoverExpiredLeases(MINUTE, new Date(Date.now() + nowOffset));

      expect((await jobs.findOneByOrFail({ id: job.id })).status).toBe(expected);
    });

    it("defaults to the current time", async () => {
      const { store, jobs, seedRegistration, seedJob } = await setup();
      const job = await seedJob((await seedRegistration()).id, { status: "processing" });
      await store.recoverExpiredLeases(MINUTE);
      expect((await jobs.findOneByOrFail({ id: job.id })).status).toBe("processing");
    });
  });

  describe("listDuePendingJobIds", () => {
    async function seedMixedJobs() {
      const ctx = await setup();
      const reg = await ctx.seedRegistration();
      const later = await ctx.seedJob(reg.id, { executeAt: new Date(Date.now() - 1_000) });
      const earlier = await ctx.seedJob(reg.id, { executeAt: new Date(Date.now() - 5_000) });
      await ctx.seedJob(reg.id, { executeAt: new Date(Date.now() + MINUTE) });
      await ctx.seedJob(reg.id, { status: "delivered", executeAt: new Date(Date.now() - 9_000) });
      return { ...ctx, later, earlier };
    }

    it("lists due pending jobs oldest first", async () => {
      const { store, earlier, later } = await seedMixedJobs();
      await expect(store.listDuePendingJobIds(10)).resolves.toEqual([earlier.id, later.id]);
    });

    it("honours the limit", async () => {
      const { store, earlier } = await seedMixedJobs();
      await expect(store.listDuePendingJobIds(1, new Date())).resolves.toEqual([earlier.id]);
    });
  });

  describe("hasNewerDueJob", () => {
    it.each<[string, Partial<SurfacePushJobEntity> | null, boolean]>([
      ["no other job exists", null, false],
      ["the newer job failed", { status: "failed" }, false],
      ["a newer job is pending", { status: "pending" }, true],
    ])("is %s when %s", async (_label, newer, expected) => {
      const { store, seedRegistration, seedJob } = await setup();
      const reg = await seedRegistration();
      const base = new Date(Date.now() - 10 * MINUTE);
      const job = await seedJob(reg.id, { executeAt: base });
      if (newer) {
        await seedJob(reg.id, { executeAt: new Date(base.getTime() + MINUTE), ...newer });
      }

      await expect(store.hasNewerDueJob(job, new Date())).resolves.toBe(expected);
    });
  });

  describe("expireRegistrations", () => {
    it("returns nothing when no registration is past expiry", async () => {
      const { store } = await setup();
      await expect(store.expireRegistrations(new Date())).resolves.toEqual([]);
    });

    it("expires only active registrations past their expiry", async () => {
      const { store, registrations, seedRegistration } = await setup();
      const expired = await seedRegistration({ expiresAt: new Date(Date.now() - 1_000) });
      const future = await seedRegistration({ expiresAt: new Date(Date.now() + MINUTE) });

      await expect(store.expireRegistrations(new Date())).resolves.toEqual([expired.id]);
      expect((await registrations.findOneByOrFail({ id: expired.id })).status).toBe("expired");
      expect((await registrations.findOneByOrFail({ id: future.id })).status).toBe("active");
    });
  });

  describe("retention", () => {
    it("purges inactive registrations last updated before the cutoff", async () => {
      const { store, registrations, seedRegistration } = await setup();
      const ended = await seedRegistration({ status: "ended" });
      const active = await seedRegistration();

      await expect(
        store.deleteOldInactiveRegistrations(new Date(Date.now() - 60 * MINUTE)),
      ).resolves.toBe(0);
      await expect(
        store.deleteOldInactiveRegistrations(new Date(Date.now() + 60 * MINUTE)),
      ).resolves.toBe(1);
      expect(await registrations.findOneBy({ id: ended.id })).toBeNull();
      expect(await registrations.findOneBy({ id: active.id })).not.toBeNull();
    });

    it("purges finished jobs last updated before the cutoff", async () => {
      const { store, jobs, seedRegistration, seedJob } = await setup();
      const reg = await seedRegistration();
      const delivered = await seedJob(reg.id, { status: "delivered" });
      const pending = await seedJob(reg.id);

      await expect(store.deleteOldJobs(new Date(Date.now() - 60 * MINUTE))).resolves.toBe(0);
      await expect(store.deleteOldJobs(new Date(Date.now() + 60 * MINUTE))).resolves.toBe(1);
      expect(await jobs.findOneBy({ id: delivered.id })).toBeNull();
      expect(await jobs.findOneBy({ id: pending.id })).not.toBeNull();
    });
  });

  describe("with a driver that omits affected row counts", () => {
    const builder = {
      update: () => builder,
      set: () => builder,
      where: () => builder,
      delete: () => builder,
      from: () => builder,
      execute: vi.fn().mockResolvedValue({}),
    };
    const store = new TypeOrmSurfaceJobStore(
      asRepository(buildMockRepository({ createQueryBuilder: vi.fn(() => builder) })),
      asRepository(buildMockRepository({ delete: vi.fn().mockResolvedValue({}) })),
    );

    it.each<[string, () => Promise<unknown>, unknown]>([
      ["claimJob", () => store.claimJob("job"), false],
      ["deleteOldJobs", () => store.deleteOldJobs(new Date()), 0],
      ["deleteOldInactiveRegistrations", () => store.deleteOldInactiveRegistrations(new Date()), 0],
    ])("%s treats the count as zero", async (_method, call, expected) => {
      await expect(call()).resolves.toBe(expected);
    });
  });
});
