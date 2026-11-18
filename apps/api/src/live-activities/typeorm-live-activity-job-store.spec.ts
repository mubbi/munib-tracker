import { randomUUID } from "node:crypto";
import { DataSource } from "typeorm";
import { describe, expect, it, vi } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { LiveActivityPushJobEntity, LiveActivityPushTokenEntity } from "../database/entities";
import { buildLiveActivityJobRow, buildLiveActivityTokenRow } from "../test-support/fixtures/push";
import { asRepository, buildMockRepository } from "../test-support/repositories";
import { TypeOrmLiveActivityJobStore } from "./typeorm-live-activity-job-store";

const MINUTE = 60_000;

async function setup() {
  const module = await createAuthTestingModule([TypeOrmLiveActivityJobStore]);
  const dataSource = module.get(DataSource);
  const jobs = dataSource.getRepository(LiveActivityPushJobEntity);
  const tokens = dataSource.getRepository(LiveActivityPushTokenEntity);
  const { userId } = await module.get(AuthService).createGuestSession({});

  const seedToken = (overrides: Partial<LiveActivityPushTokenEntity> = {}) =>
    tokens.save(tokens.create(buildLiveActivityTokenRow(userId, overrides)));
  const seedJob = (activityTokenId: number, overrides: Partial<LiveActivityPushJobEntity> = {}) =>
    jobs.save(jobs.create(buildLiveActivityJobRow(activityTokenId, overrides)));

  return { store: module.get(TypeOrmLiveActivityJobStore), jobs, tokens, seedToken, seedJob };
}

describe("TypeOrmLiveActivityJobStore", () => {
  describe("claimJob", () => {
    it("moves a pending job to processing", async () => {
      const { store, jobs, seedToken, seedJob } = await setup();
      const job = await seedJob((await seedToken()).id);

      await expect(store.claimJob(job.id)).resolves.toBe(true);
      expect((await jobs.findOneByOrFail({ id: job.id })).status).toBe("processing");
    });

    it("does not claim the same job twice", async () => {
      const { store, seedToken, seedJob } = await setup();
      const job = await seedJob((await seedToken()).id);
      await store.claimJob(job.id);

      await expect(store.claimJob(job.id)).resolves.toBe(false);
    });
  });

  describe("getJobWithToken", () => {
    it("maps a job and its token into a delivery record", async () => {
      const { store, seedToken, seedJob } = await setup();
      const lastPushAt = new Date("2030-01-01T00:00:00Z");
      const staleAt = new Date("2030-01-01T01:00:00Z");
      const token = await seedToken({ lastPushAt, apnsEnvironment: "production" });
      const job = await seedJob(token.id, { staleAt, qstashMessageId: "msg-1", lastError: "x" });

      expect(await store.getJobWithToken(job.id)).toMatchObject({
        id: job.id,
        activityTokenId: token.id,
        contentStateJson: '{"phase":"upcoming"}',
        status: "pending",
        attempts: 0,
        staleAt,
        lastError: "x",
        deliveredAt: null,
        qstashMessageId: "msg-1",
        activityToken: {
          id: token.id,
          tokenCiphertext: "v1.cipher",
          apnsEnvironment: "production",
          status: "active",
          lastPushAt,
        },
      });
    });

    it("maps unset optional columns to null", async () => {
      const { store, seedToken, seedJob } = await setup();
      const job = await seedJob((await seedToken()).id);

      expect(await store.getJobWithToken(job.id)).toMatchObject({
        staleAt: null,
        lastError: null,
        qstashMessageId: null,
        activityToken: { lastPushAt: null },
      });
    });

    it("returns null for an unknown job", async () => {
      const { store } = await setup();
      await expect(store.getJobWithToken(randomUUID())).resolves.toBeNull();
    });
  });

  describe("saving delivery state", () => {
    async function seedRecord() {
      const ctx = await setup();
      const job = await ctx.seedJob((await ctx.seedToken()).id);
      const record = await ctx.store.getJobWithToken(job.id);
      if (!record) throw new Error("missing record");
      return { ...ctx, record };
    }

    it("persists job delivery state", async () => {
      const { store, jobs, record } = await seedRecord();
      await store.saveJob({
        ...record,
        status: "failed",
        attempts: 3,
        lastError: "BadDeviceToken",
        qstashMessageId: "msg-9",
      });

      expect(await jobs.findOneByOrFail({ id: record.id })).toMatchObject({
        status: "failed",
        attempts: 3,
        lastError: "BadDeviceToken",
        qstashMessageId: "msg-9",
      });
    });

    it("persists token state", async () => {
      const { store, tokens, record } = await seedRecord();
      const lastPushAt = new Date("2030-01-01T00:00:00Z");
      await store.saveToken({
        ...record.activityToken,
        status: "invalid",
        tokenCiphertext: "v1.rotated",
        apnsEnvironment: "production",
        lastPushAt,
      });

      expect(await tokens.findOneByOrFail({ id: record.activityTokenId })).toMatchObject({
        status: "invalid",
        tokenCiphertext: "v1.rotated",
        apnsEnvironment: "production",
        lastPushAt,
      });
    });
  });

  it("cancels only pending jobs and returns their QStash message ids", async () => {
    const { store, jobs, seedToken, seedJob } = await setup();
    const token = await seedToken();
    const withMessage = await seedJob(token.id, { qstashMessageId: "msg-a" });
    await seedJob(token.id, { qstashMessageId: null });
    const delivered = await seedJob(token.id, { status: "delivered", qstashMessageId: "msg-d" });

    await expect(store.cancelPendingForActivity(token.id, "Activity ended")).resolves.toEqual([
      "msg-a",
    ]);
    expect(await jobs.findOneByOrFail({ id: withMessage.id })).toMatchObject({
      status: "cancelled",
      lastError: "Activity ended",
    });
    expect((await jobs.findOneByOrFail({ id: delivered.id })).status).toBe("delivered");
  });

  describe("recoverExpiredLeases", () => {
    it("keeps a fresh lease (defaulting to the current time)", async () => {
      const { store, jobs, seedToken, seedJob } = await setup();
      const job = await seedJob((await seedToken()).id, { status: "processing" });
      await store.recoverExpiredLeases(MINUTE);
      expect((await jobs.findOneByOrFail({ id: job.id })).status).toBe("processing");
    });

    it("re-queues an expired lease with a note", async () => {
      const { store, jobs, seedToken, seedJob } = await setup();
      const job = await seedJob((await seedToken()).id, { status: "processing" });

      await store.recoverExpiredLeases(MINUTE, new Date(Date.now() + 10 * MINUTE));

      expect(await jobs.findOneByOrFail({ id: job.id })).toMatchObject({
        status: "pending",
        lastError: "Recovered expired processing lease",
      });
    });
  });

  describe("listDuePendingJobIds", () => {
    async function seedMixedJobs() {
      const ctx = await setup();
      const token = await ctx.seedToken();
      const later = await ctx.seedJob(token.id, { executeAt: new Date(Date.now() - 1_000) });
      const earlier = await ctx.seedJob(token.id, { executeAt: new Date(Date.now() - 9_000) });
      await ctx.seedJob(token.id, { executeAt: new Date(Date.now() + MINUTE) });
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

  it.each<[string, Partial<LiveActivityPushJobEntity> | null, boolean]>([
    ["no other job exists", null, false],
    ["a newer job was delivered", { status: "delivered" }, true],
  ])("hasNewerDueJob is %s when %s", async (_label, newer, expected) => {
    const { store, seedToken, seedJob } = await setup();
    const token = await seedToken();
    const base = new Date(Date.now() - 10 * MINUTE);
    const job = await seedJob(token.id, { executeAt: base });
    if (newer) await seedJob(token.id, { executeAt: new Date(base.getTime() + MINUTE), ...newer });

    await expect(store.hasNewerDueJob(job, new Date())).resolves.toBe(expected);
  });

  describe("expireActiveTokens", () => {
    it("expires only active tokens past their expiry", async () => {
      const { store, tokens, seedToken } = await setup();
      const expired = await seedToken({ expiresAt: new Date(Date.now() - 1_000) });
      const live = await seedToken();

      await expect(store.expireActiveTokens()).resolves.toEqual([expired.id]);
      expect((await tokens.findOneByOrFail({ id: expired.id })).status).toBe("expired");
      expect((await tokens.findOneByOrFail({ id: live.id })).status).toBe("active");
    });

    it("returns nothing when no token is past expiry", async () => {
      const { store, seedToken } = await setup();
      await seedToken();
      await expect(store.expireActiveTokens(new Date())).resolves.toEqual([]);
    });
  });

  it("purges inactive tokens last updated before the cutoff", async () => {
    const { store, tokens, seedToken } = await setup();
    const ended = await seedToken({ status: "ended" });
    const live = await seedToken();

    await expect(store.deleteOldExpiredTokens(new Date(Date.now() - 60 * MINUTE))).resolves.toBe(0);
    await expect(store.deleteOldExpiredTokens(new Date(Date.now() + 60 * MINUTE))).resolves.toBe(1);
    expect(await tokens.findOneBy({ id: ended.id })).toBeNull();
    expect(await tokens.findOneBy({ id: live.id })).not.toBeNull();
  });

  describe("with a driver that omits affected row counts", () => {
    const store = new TypeOrmLiveActivityJobStore(
      asRepository(buildMockRepository({ delete: vi.fn().mockResolvedValue({}) })),
      asRepository(buildMockRepository({ update: vi.fn().mockResolvedValue({}) })),
    );

    it.each<[string, () => Promise<unknown>, unknown]>([
      ["claimJob", () => store.claimJob("job"), false],
      ["deleteOldExpiredTokens", () => store.deleteOldExpiredTokens(new Date()), 0],
    ])("%s treats the count as zero", async (_method, call, expected) => {
      await expect(call()).resolves.toBe(expected);
    });
  });
});
