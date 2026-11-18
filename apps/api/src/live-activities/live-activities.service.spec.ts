import {
  deliverLiveActivityJob,
  dispatchDueLiveActivityJobs,
  LiveActivityDeliveryError,
  resolveActivityKitEncryptionKey,
} from "@munib-tracker/live-activity-delivery";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { describe, expect, it, vi } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { resetMemoryRateLimits } from "../common/durable-rate-limit";
import { LiveActivityPushJobEntity, LiveActivityPushTokenEntity } from "../database/entities";
import { buildMockQStashService, overrideConfig } from "../test-support/push";
import { ApnsLiveActivityService } from "./apns-live-activity.service";
import {
  LiveActivityApnsEnvironment,
  type LiveActivityScheduledUpdateDto,
  type UpsertLiveActivityDto,
} from "./dto/live-activity.dto";
import { LiveActivitiesService } from "./live-activities.service";
import { LiveActivityQStashService } from "./live-activity-qstash.service";
import { TypeOrmLiveActivityJobStore } from "./typeorm-live-activity-job-store";

// Pass-through spies: real delivery by default, overridable per case.
vi.mock("@munib-tracker/live-activity-delivery", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@munib-tracker/live-activity-delivery")>();
  return {
    ...actual,
    deliverLiveActivityJob: vi.fn(actual.deliverLiveActivityJob),
    dispatchDueLiveActivityJobs: vi.fn(actual.dispatchDueLiveActivityJobs),
    resolveActivityKitEncryptionKey: vi.fn(actual.resolveActivityKitEncryptionKey),
  };
});

const MINUTE = 60_000;
const PUSH_TOKEN = "a".repeat(64);

function inMinutes(minutes: number): string {
  return new Date(Date.now() + minutes * MINUTE).toISOString();
}

function buildContentState(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    prayerId: "asr",
    prayerName: "Asr",
    phase: "markSalah",
    actionLabel: "Mark Salah",
    actionDeepLink: "munib-tracker://mark-current",
    deepLink: "munib-tracker://mark-current",
    targetTimeMs: Date.now() + MINUTE,
    minutesUntil: 1,
    progressPercent: 40,
    ...overrides,
  };
}

function buildUpdate(
  overrides: Partial<LiveActivityScheduledUpdateDto> = {},
  state: Record<string, unknown> = {},
): LiveActivityScheduledUpdateDto {
  return {
    phase: "markSalah",
    executeAt: inMinutes(5),
    contentState: buildContentState(state),
    ...overrides,
  };
}

async function setup() {
  // Each case signs in again; keep the per-IP OAuth limiter from tripping.
  resetMemoryRateLimits();
  vi.mocked(deliverLiveActivityJob).mockClear();
  vi.mocked(dispatchDueLiveActivityJobs).mockClear();
  const qstash = buildMockQStashService();
  const sendUpdate = vi.fn().mockResolvedValue({ ok: true, apnsId: "apns-1" });
  const module = await createAuthTestingModule([
    LiveActivitiesService,
    TypeOrmLiveActivityJobStore,
    { provide: LiveActivityQStashService, useValue: qstash },
    { provide: ApnsLiveActivityService, useValue: { getClient: () => ({ sendUpdate }) } },
  ]);
  const authService = module.get(AuthService);
  const service = module.get(LiveActivitiesService);
  const dataSource = module.get(DataSource);
  const { accessToken, userId } = await authService.completeOAuth(AuthProvider.Google, {
    code: "c",
  });

  const upsert = (overrides: Partial<UpsertLiveActivityDto> = {}, token = accessToken) =>
    service.upsert(token, {
      activityId: "activity-1",
      pushToken: PUSH_TOKEN,
      environment: LiveActivityApnsEnvironment.Sandbox,
      updates: [buildUpdate()],
      ...overrides,
    });
  const createGuest = () =>
    authService.createGuestSession({ deviceId: "guest-device-live-activity" });

  return {
    service,
    qstash,
    sendUpdate,
    accessToken,
    userId,
    upsert,
    createGuest,
    config: module.get(ConfigService),
    tokens: dataSource.getRepository(LiveActivityPushTokenEntity),
    jobs: dataSource.getRepository(LiveActivityPushJobEntity),
  };
}

describe("LiveActivitiesService", () => {
  describe("upsert", () => {
    it("stores an encrypted ActivityKit token and schedules QStash jobs", async () => {
      const { upsert, qstash, tokens, jobs } = await setup();

      await expect(upsert()).resolves.toMatchObject({ activityId: "activity-1", scheduled: 1 });
      expect(qstash.schedule).toHaveBeenCalledOnce();
      const [token] = await tokens.find();
      expect(token?.tokenCiphertext.startsWith("v1.")).toBe(true);
      expect(await jobs.find()).toMatchObject([{ qstashMessageId: "msg-1" }]);
    });

    it.each<[string, LiveActivityScheduledUpdateDto[], string]>([
      ["no updates", [], "No future Live Activity updates"],
      [
        "only stale updates",
        [buildUpdate({ executeAt: inMinutes(-120) })],
        "No future Live Activity updates",
      ],
      [
        "updates beyond the ActivityKit lifetime",
        [buildUpdate({ executeAt: inMinutes(9 * 60) })],
        "cannot exceed ActivityKit lifetime",
      ],
      [
        "an oversized content state",
        [buildUpdate({}, { prayerName: "x".repeat(5_000) })],
        "payload budget",
      ],
      ["a non-string prayerId", [buildUpdate({}, { prayerId: 1 })], "missing prayerId"],
      [
        "a missing actionDeepLink",
        [buildUpdate({}, { actionDeepLink: undefined })],
        "missing actionDeepLink",
      ],
      [
        "a non-numeric targetTimeMs",
        [buildUpdate({}, { targetTimeMs: "soon" })],
        "invalid targetTimeMs",
      ],
      [
        "a NaN progressPercent",
        [buildUpdate({}, { progressPercent: Number.NaN })],
        "invalid progressPercent",
      ],
      [
        "an infinite minutesUntil",
        [buildUpdate({}, { minutesUntil: Number.POSITIVE_INFINITY })],
        "invalid minutesUntil",
      ],
      [
        "a non-app actionDeepLink",
        [buildUpdate({}, { actionDeepLink: "https://evil.example" })],
        "must use the app scheme",
      ],
      [
        "a non-app deepLink",
        [buildUpdate({}, { deepLink: "https://evil.example" })],
        "must use the app scheme",
      ],
    ])("rejects %s", async (_label, updates, message) => {
      const { upsert } = await setup();
      const rejection = upsert({ updates });
      await expect(rejection).rejects.toBeInstanceOf(BadRequestException);
      await expect(rejection).rejects.toThrow(message);
    });

    it("accepts a content state without the optional deepLink", async () => {
      const { upsert } = await setup();
      await expect(
        upsert({ updates: [buildUpdate({}, { deepLink: undefined })] }),
      ).resolves.toMatchObject({
        scheduled: 1,
      });
    });

    it("keeps the last update per phase boundary and schedules in execute order", async () => {
      const { upsert, jobs } = await setup();
      const later = inMinutes(20);
      const staleAt = inMinutes(25);

      const result = await upsert({
        updates: [
          buildUpdate({ phase: "afterSalah", executeAt: later }, { prayerName: "v1" }),
          buildUpdate({ phase: "markSalah", executeAt: inMinutes(10) }),
          buildUpdate({ phase: "afterSalah", executeAt: later, staleAt }, { prayerName: "v2" }),
        ],
      });

      expect(result.scheduled).toBe(2);
      const saved = await jobs.find({ order: { executeAt: "ASC" } });
      expect(saved).toMatchObject([
        { phase: "markSalah" },
        { phase: "afterSalah", staleAt: new Date(staleAt) },
      ]);
      expect(JSON.parse(saved[1]?.contentStateJson ?? "{}").prayerName).toBe("v2");
    });

    it("removes older activities that reuse the same push token", async () => {
      const { upsert, qstash, tokens } = await setup();
      await upsert({ activityId: "old-activity" });
      qstash.cancel.mockClear();

      await upsert({ activityId: "new-activity" });

      expect(await tokens.find()).toMatchObject([{ activityId: "new-activity" }]);
      expect(qstash.cancel).toHaveBeenCalledWith(["msg-1"]);
    });

    it("delivers overdue pending jobs before replacing them", async () => {
      const { upsert, jobs, sendUpdate } = await setup();
      await upsert({ updates: [buildUpdate({ phase: "upcoming", executeAt: inMinutes(1) })] });
      const job = await jobs.findOneByOrFail({});
      job.executeAt = new Date(Date.now() - MINUTE);
      await jobs.save(job);

      await upsert({ updates: [buildUpdate({ executeAt: inMinutes(10) })] });

      expect(sendUpdate).toHaveBeenCalledOnce();
    });

    it("tolerates delivery failures for overdue jobs", async () => {
      const { upsert, jobs } = await setup();
      await upsert();
      const job = await jobs.findOneByOrFail({});
      job.executeAt = new Date(Date.now() - MINUTE);
      await jobs.save(job);
      vi.mocked(deliverLiveActivityJob).mockRejectedValueOnce(new Error("apns down"));

      await expect(upsert()).resolves.toMatchObject({ scheduled: 1 });
    });

    it("schedules overdue catch-up jobs for immediate delivery", async () => {
      const { upsert, qstash } = await setup();
      const before = Date.now();

      await upsert({ updates: [buildUpdate({ executeAt: inMinutes(-1) })] });

      const fireAt = qstash.schedule.mock.calls[0]?.[1] as Date;
      expect(fireAt.getTime()).toBeGreaterThanOrEqual(before);
    });

    it("leaves the message id empty when QStash is not configured", async () => {
      const { upsert, qstash, jobs } = await setup();
      qstash.schedule.mockResolvedValue(null);

      await upsert();

      expect((await jobs.findOneByOrFail({})).qstashMessageId ?? null).toBeNull();
    });

    it.each<[string, unknown, string]>([
      ["a truncated Error message", new Error("x".repeat(2_000)), "x".repeat(1_000)],
      ["a placeholder for non-Error values", { not: "an error" }, "Unknown error"],
    ])("records QStash failures as %s", async (_label, error, lastError) => {
      const { upsert, qstash, jobs } = await setup();
      qstash.schedule.mockRejectedValue(error);

      await upsert();

      expect((await jobs.findOneByOrFail({})).lastError).toBe(lastError);
    });

    describe("when another account owns the activity", () => {
      async function setupOwnedByGuest() {
        const ctx = await setup();
        const guest = await ctx.createGuest();
        await ctx.upsert({}, guest.accessToken);
        return ctx;
      }

      it("rejects a different push token", async () => {
        const { upsert } = await setupOwnedByGuest();
        await expect(upsert({ pushToken: "2".repeat(64) })).rejects.toThrow(/another account/);
      });

      it("hands the activity over when the same push token is presented", async () => {
        const { upsert, tokens, userId } = await setupOwnedByGuest();

        await expect(upsert()).resolves.toMatchObject({ scheduled: 1 });
        expect(await tokens.find()).toMatchObject([{ activityId: "activity-1", userId }]);
      });
    });
  });

  describe("lifecycle", () => {
    it("ends the activity and cancels pending jobs", async () => {
      const { service, upsert, accessToken, qstash, jobs } = await setup();
      await upsert();

      await service.lifecycle(accessToken, "activity-1", { state: "ended" });

      expect((await jobs.findOneByOrFail({})).status).toBe("cancelled");
      expect(qstash.cancel).toHaveBeenLastCalledWith(["msg-1"]);
    });

    it("ignores unknown activities", async () => {
      const { service, accessToken, qstash } = await setup();
      await expect(
        service.lifecycle(accessToken, "missing", { state: "dismissed" }),
      ).resolves.toBeUndefined();
      expect(qstash.cancel).not.toHaveBeenCalled();
    });

    it("forbids changing another account's activity", async () => {
      const { service, upsert, createGuest } = await setup();
      await upsert();
      const guest = await createGuest();

      await expect(
        service.lifecycle(guest.accessToken, "activity-1", { state: "ended" }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe("deliver", () => {
    it("delivers a due job through APNs", async () => {
      const { service, upsert, jobs, sendUpdate } = await setup();
      await upsert({ updates: [buildUpdate({ executeAt: inMinutes(-0.1) })] });
      const job = await jobs.findOneByOrFail({});

      await service.deliver(job.id);

      expect(sendUpdate).toHaveBeenCalledOnce();
      expect((await jobs.findOneByOrFail({ id: job.id })).status).toBe("delivered");
    });

    it("maps an unknown job to 404", async () => {
      const { service } = await setup();
      await expect(service.deliver("00000000-0000-4000-8000-000000000000")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("cancels scheduled QStash messages through the delivery callback", async () => {
      const { service, qstash } = await setup();
      vi.mocked(deliverLiveActivityJob).mockImplementationOnce(async (options) => {
        await options.cancelScheduledMessages?.(["m1"]);
        return undefined as never;
      });

      await service.deliver("job-1");

      expect(qstash.cancel).toHaveBeenCalledWith(["m1"]);
    });

    it.each([
      new LiveActivityDeliveryError("early", "TOO_EARLY"),
      new LiveActivityDeliveryError("busy", "IN_FLIGHT"),
      new LiveActivityDeliveryError("apns", "TRANSIENT_APNS"),
      new LiveActivityDeliveryError("retry", "INVALID_TOKEN", true),
      new LiveActivityDeliveryError("config", "NOT_CONFIGURED"),
    ])("maps %s to 503", async (error) => {
      const { service } = await setup();
      vi.mocked(deliverLiveActivityJob).mockRejectedValueOnce(error);
      await expect(service.deliver("job")).rejects.toBeInstanceOf(ServiceUnavailableException);
    });

    it("rethrows unexpected errors", async () => {
      const { service } = await setup();
      const boom = new Error("boom");
      vi.mocked(deliverLiveActivityJob).mockRejectedValueOnce(boom);
      await expect(service.deliver("job")).rejects.toBe(boom);
    });
  });

  describe("dispatchDue", () => {
    it("returns the shared dispatcher result and wires QStash cancellation", async () => {
      const { service, qstash } = await setup();
      const result = { claimed: 0, delivered: 0, failed: 0 };
      vi.mocked(dispatchDueLiveActivityJobs).mockImplementationOnce(async (options) => {
        await options.cancelScheduledMessages?.(["m2"]);
        return result as never;
      });

      await expect(service.dispatchDue()).resolves.toEqual(result);
      expect(qstash.cancel).toHaveBeenCalledWith(["m2"]);
    });

    it("maps an invalid encryption key to 503", async () => {
      const { service, config } = await setup();
      overrideConfig(config, {
        ACTIVITYKIT_TOKEN_ENCRYPTION_KEY: Buffer.from("short").toString("base64"),
      });
      await expect(service.dispatchDue()).rejects.toBeInstanceOf(ServiceUnavailableException);
    });

    it("rethrows unexpected encryption key errors", async () => {
      const { service } = await setup();
      const boom = new Error("kms down");
      vi.mocked(resolveActivityKitEncryptionKey).mockImplementationOnce(() => {
        throw boom;
      });
      await expect(service.dispatchDue()).rejects.toBe(boom);
    });
  });
});
