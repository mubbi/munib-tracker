import {
  createWebPushSender,
  deliverSurfaceJob,
  dispatchDueSurfaceJobs,
  SurfaceDeliveryError,
} from "@munib-tracker/surface-push-delivery";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { describe, expect, it, vi } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { resetMemoryRateLimits } from "../common/durable-rate-limit";
import { SurfacePushJobEntity, SurfacePushRegistrationEntity } from "../database/entities";
import { EXPO_PUSH_TOKEN } from "../test-support/fixtures/push";
import { buildMockQStashService, overrideConfig } from "../test-support/push";
import type { SurfacePhaseUpdateDto, UpsertSurfacePushDto } from "./dto/surface-push.dto";
import { SurfacePushService } from "./surface-push.service";
import { SurfacePushQStashService } from "./surface-push-qstash.service";
import { TypeOrmSurfaceJobStore } from "./typeorm-surface-job-store";

vi.mock("@munib-tracker/surface-push-delivery", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@munib-tracker/surface-push-delivery")>();
  return {
    ...actual,
    deliverSurfaceJob: vi.fn(),
    dispatchDueSurfaceJobs: vi.fn(),
    createExpoPushSender: vi.fn(() => ({ send: vi.fn() })),
    createWebPushSender: vi.fn(() => ({ send: vi.fn() })),
  };
});

const MINUTE = 60_000;
const DISPATCH_RESULT = { claimed: 1, delivered: 1, failed: 0 };
const WEB_PUSH_SUBSCRIPTION = {
  endpoint: "https://push.example/sub",
  expirationTime: null,
  keys: { p256dh: "p256", auth: "auth" },
};

function inMinutes(minutes: number): string {
  return new Date(Date.now() + minutes * MINUTE).toISOString();
}

function buildUpdate(overrides: Partial<SurfacePhaseUpdateDto> = {}): SurfacePhaseUpdateDto {
  return {
    phase: "upcoming",
    executeAt: inMinutes(1),
    dedupeKey: "key",
    payload: {},
    ...overrides,
  };
}

async function setup() {
  // Each case signs in again; keep the per-IP OAuth limiter from tripping.
  resetMemoryRateLimits();
  vi.mocked(deliverSurfaceJob).mockReset().mockResolvedValue(undefined);
  vi.mocked(dispatchDueSurfaceJobs)
    .mockReset()
    .mockResolvedValue(DISPATCH_RESULT as never);
  vi.mocked(createWebPushSender).mockClear();
  const qstash = buildMockQStashService();
  const module = await createAuthTestingModule([
    SurfacePushService,
    TypeOrmSurfaceJobStore,
    { provide: SurfacePushQStashService, useValue: qstash },
  ]);
  const authService = module.get(AuthService);
  const service = module.get(SurfacePushService);
  const dataSource = module.get(DataSource);
  const { accessToken } = await authService.completeOAuth(AuthProvider.Google, { code: "c" });

  const upsert = (overrides: Partial<UpsertSurfacePushDto> = {}, token = accessToken) =>
    service.upsert(token, {
      channel: "expo",
      target: EXPO_PUSH_TOKEN,
      updates: [buildUpdate()],
      ...overrides,
    });
  const createGuest = () => authService.createGuestSession({ deviceId: "guest-device-surface" });

  return {
    service,
    qstash,
    accessToken,
    upsert,
    createGuest,
    config: module.get(ConfigService),
    registrations: dataSource.getRepository(SurfacePushRegistrationEntity),
    jobs: dataSource.getRepository(SurfacePushJobEntity),
  };
}

describe("SurfacePushService", () => {
  describe("upsert", () => {
    it("registers an Expo target and schedules a QStash job", async () => {
      const { upsert, qstash, registrations, jobs } = await setup();

      await expect(
        upsert({ updates: [buildUpdate({ executeAt: inMinutes(5) })] }),
      ).resolves.toMatchObject({
        channel: "expo",
        scheduled: 1,
      });
      expect(qstash.schedule).toHaveBeenCalledOnce();
      expect(await registrations.find()).toMatchObject([{ channel: "expo" }]);
      expect(await jobs.find()).toMatchObject([{ qstashMessageId: "msg-1" }]);
    });

    it("requires a bearer token", async () => {
      const { upsert } = await setup();
      await expect(upsert({}, "")).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it.each<[string, Partial<UpsertSurfacePushDto>, string]>([
      ["an invalid Expo token", { target: "not-a-token" }, "A valid Expo push token is required"],
      [
        "only stale updates",
        { updates: [buildUpdate({ executeAt: inMinutes(-120) })] },
        "No future surface push updates",
      ],
      [
        "an oversized payload",
        { updates: [buildUpdate({ payload: { body: "x".repeat(4_000) } })] },
        "Surface push payload exceeds size budget",
      ],
      [
        "a non-JSON Web Push target",
        { channel: "web_push", target: "{not json" },
        "Web Push target must be subscription JSON",
      ],
      [
        "an insecure Web Push endpoint",
        {
          channel: "web_push",
          target: JSON.stringify({ ...WEB_PUSH_SUBSCRIPTION, endpoint: "http://insecure" }),
        },
        "Invalid Web Push subscription",
      ],
    ])("rejects %s", async (_label, overrides, message) => {
      const { upsert } = await setup();
      const rejection = upsert(overrides);
      await expect(rejection).rejects.toBeInstanceOf(BadRequestException);
      await expect(rejection).rejects.toThrow(message);
    });

    it("stores the trimmed Expo token with session metadata", async () => {
      const { upsert, registrations } = await setup();
      const expiresAt = inMinutes(60);

      const result = await upsert({
        target: `  ${EXPO_PUSH_TOKEN}  `,
        sessionId: "session-1",
        deviceId: "device-1",
        expiresAt,
      });

      expect(result.sessionId).toBe("session-1");
      expect(await registrations.findOneByOrFail({ id: result.registrationId })).toMatchObject({
        target: EXPO_PUSH_TOKEN,
        deviceId: "device-1",
        expiresAt: new Date(expiresAt),
      });
    });

    it("keeps the last update per dedupe key and schedules in execute order", async () => {
      const { upsert, jobs } = await setup();
      const staleAt = inMinutes(30);

      const result = await upsert({
        updates: [
          buildUpdate({ dedupeKey: "b", executeAt: inMinutes(20), payload: { v: "first" } }),
          buildUpdate({ dedupeKey: "a", executeAt: inMinutes(10), staleAt }),
          buildUpdate({ dedupeKey: "b", executeAt: inMinutes(15), payload: { v: "last" } }),
        ],
      });

      expect(result.scheduled).toBe(2);
      expect(await jobs.find({ order: { executeAt: "ASC" } })).toMatchObject([
        { dedupeKey: "a", staleAt: new Date(staleAt) },
        { dedupeKey: "b", payloadJson: '{"v":"last"}' },
      ]);
    });

    it("normalizes a Web Push subscription to endpoint, expiry and keys", async () => {
      const { upsert, registrations } = await setup();
      const { expirationTime: _omitted, ...withoutExpiry } = WEB_PUSH_SUBSCRIPTION;

      const result = await upsert({
        channel: "web_push",
        target: JSON.stringify({ ...withoutExpiry, extra: "dropped" }),
      });

      expect(result.channel).toBe("web_push");
      const reg = await registrations.findOneByOrFail({ id: result.registrationId });
      expect(JSON.parse(reg.target)).toEqual(WEB_PUSH_SUBSCRIPTION);
    });

    it("schedules overdue catch-up jobs for immediate delivery", async () => {
      const { upsert, qstash } = await setup();
      const before = Date.now();

      await upsert({ updates: [buildUpdate({ executeAt: inMinutes(-5) })] });

      const fireAt = qstash.schedule.mock.calls[0]?.[1] as Date;
      expect(fireAt.getTime()).toBeGreaterThanOrEqual(before);
    });

    it("leaves the message id empty when QStash is not configured", async () => {
      const { upsert, qstash, jobs } = await setup();
      qstash.schedule.mockResolvedValue(null);

      await upsert();

      expect((await jobs.findOneByOrFail({})).qstashMessageId ?? null).toBeNull();
    });

    it.each([
      [new Error("qstash down"), "qstash down"],
      ["plain failure", "plain failure"],
    ])("records QStash scheduling failure %s on the job", async (error, lastError) => {
      const { upsert, qstash, jobs } = await setup();
      qstash.schedule.mockRejectedValue(error);

      await upsert();

      expect((await jobs.findOneByOrFail({})).lastError).toBe(lastError);
    });

    describe("re-registering an existing target", () => {
      async function setupWithDueJobs() {
        const ctx = await setup();
        ctx.qstash.schedule.mockResolvedValueOnce("msg-a").mockResolvedValueOnce("msg-b");
        const first = await ctx.upsert({
          updates: [
            buildUpdate({ dedupeKey: "due-1", executeAt: inMinutes(1) }),
            buildUpdate({ dedupeKey: "due-2", executeAt: inMinutes(2) }),
          ],
        });
        for (const job of await ctx.jobs.find()) {
          job.executeAt = new Date(job.executeAt.getTime() - 10 * MINUTE);
          await ctx.jobs.save(job);
        }
        const guest = await ctx.createGuest();
        const reregister = () =>
          ctx.upsert({ updates: [buildUpdate({ dedupeKey: "next" })] }, guest.accessToken);
        return { ...ctx, first, guest, reregister };
      }

      it("delivers already-due jobs first, tolerating delivery failures", async () => {
        const { reregister } = await setupWithDueJobs();
        vi.mocked(deliverSurfaceJob).mockRejectedValueOnce(
          new SurfaceDeliveryError("in flight", "IN_FLIGHT"),
        );

        await reregister();

        expect(deliverSurfaceJob).toHaveBeenCalledTimes(2);
      });

      it("replaces the old jobs and cancels their QStash messages", async () => {
        const { reregister, qstash, jobs } = await setupWithDueJobs();

        await reregister();

        expect(qstash.cancel).toHaveBeenCalledWith(["msg-a", "msg-b"]);
        expect(await jobs.find()).toMatchObject([{ dedupeKey: "next" }]);
      });

      it("transfers the registration to the re-registering account", async () => {
        const { reregister, first, guest, registrations } = await setupWithDueJobs();

        const result = await reregister();

        expect(result.registrationId).toBe(first.registrationId);
        expect((await registrations.findOneByOrFail({ id: first.registrationId })).userId).toBe(
          guest.userId,
        );
      });
    });
  });

  describe("lifecycle", () => {
    it("ends the registration and cancels pending jobs", async () => {
      const { service, upsert, accessToken, qstash, registrations } = await setup();
      const { registrationId } = await upsert();

      await service.lifecycle(accessToken, registrationId, { state: "ended" });

      expect((await registrations.findOneByOrFail({ id: registrationId })).status).toBe("ended");
      expect(qstash.cancel).toHaveBeenLastCalledWith(["msg-1"]);
    });

    it("requires a bearer token", async () => {
      const { service } = await setup();
      await expect(service.lifecycle("", 1, { state: "ended" })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it("ignores unknown registrations", async () => {
      const { service, accessToken, qstash } = await setup();
      await expect(
        service.lifecycle(accessToken, 999, { state: "dismissed" }),
      ).resolves.toBeUndefined();
      expect(qstash.cancel).not.toHaveBeenCalled();
    });

    it("forbids changing another account's registration", async () => {
      const { service, upsert, createGuest } = await setup();
      const { registrationId } = await upsert();
      const guest = await createGuest();

      await expect(
        service.lifecycle(guest.accessToken, registrationId, { state: "ended" }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe("deleteRegistration", () => {
    it("deletes the registration and cancels pending jobs", async () => {
      const { service, upsert, accessToken, qstash, registrations } = await setup();
      const { registrationId } = await upsert();

      await service.deleteRegistration(accessToken, registrationId);

      expect(await registrations.find()).toHaveLength(0);
      expect(qstash.cancel).toHaveBeenLastCalledWith(["msg-1"]);
    });

    it("ignores unknown registrations", async () => {
      const { service, accessToken, qstash } = await setup();
      await expect(service.deleteRegistration(accessToken, 999)).resolves.toBeUndefined();
      expect(qstash.cancel).not.toHaveBeenCalled();
    });

    it("forbids deleting another account's registration", async () => {
      const { service, upsert, createGuest } = await setup();
      const { registrationId } = await upsert();
      const guest = await createGuest();

      await expect(
        service.deleteRegistration(guest.accessToken, registrationId),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe("deliver", () => {
    it("delivers with an Expo-only sender set when VAPID is unset", async () => {
      const { service, config } = await setup();
      overrideConfig(config, { VAPID_PUBLIC_KEY: undefined, VAPID_PRIVATE_KEY: undefined });

      await service.deliver("job-1");

      const [options] = vi.mocked(deliverSurfaceJob).mock.calls[0] ?? [];
      expect(options?.jobId).toBe("job-1");
      expect(Object.keys(options?.senders ?? {})).toEqual(["expo"]);
      expect(createWebPushSender).not.toHaveBeenCalled();
    });

    it("cancels scheduled QStash messages through the delivery callback", async () => {
      const { service, qstash } = await setup();
      vi.mocked(deliverSurfaceJob).mockImplementation(async (options) => {
        await options.cancelScheduledMessages?.(["m1"]);
      });

      await service.deliver("job-1");

      expect(qstash.cancel).toHaveBeenCalledWith(["m1"]);
    });

    it.each<[string, Error, new (...args: never[]) => Error]>([
      ["NOT_FOUND to 404", new SurfaceDeliveryError("missing", "NOT_FOUND"), NotFoundException],
      [
        "retryable codes to 503",
        new SurfaceDeliveryError("too early", "TOO_EARLY"),
        ServiceUnavailableException,
      ],
    ])("maps %s", async (_label, error, expected) => {
      const { service } = await setup();
      vi.mocked(deliverSurfaceJob).mockRejectedValue(error);
      await expect(service.deliver("j")).rejects.toBeInstanceOf(expected);
    });

    it("rethrows unexpected errors", async () => {
      const { service } = await setup();
      const boom = new Error("boom");
      vi.mocked(deliverSurfaceJob).mockRejectedValue(boom);
      await expect(service.deliver("j")).rejects.toBe(boom);
    });
  });

  describe("dispatchDue", () => {
    it("returns the shared dispatcher result and wires QStash cancellation", async () => {
      const { service, qstash } = await setup();
      vi.mocked(dispatchDueSurfaceJobs).mockImplementation(async (options) => {
        await options.cancelScheduledMessages?.(["m2"]);
        return DISPATCH_RESULT as never;
      });

      await expect(service.dispatchDue()).resolves.toEqual(DISPATCH_RESULT);
      expect(qstash.cancel).toHaveBeenCalledWith(["m2"]);
    });

    it.each<[string, string | undefined, string]>([
      ["the default subject when unset", "  ", "mailto:support@munibtracker.app"],
      ["the configured subject", "mailto:ops@example.com", "mailto:ops@example.com"],
    ])("adds a Web Push sender with %s", async (_label, subject, expected) => {
      const { service, config } = await setup();
      overrideConfig(config, {
        VAPID_PUBLIC_KEY: " pub ",
        VAPID_PRIVATE_KEY: " priv ",
        VAPID_SUBJECT: subject,
      });

      await service.dispatchDue();

      const [options] = vi.mocked(dispatchDueSurfaceJobs).mock.calls[0] ?? [];
      expect(Object.keys(options?.senders ?? {}).sort()).toEqual(["expo", "web_push"]);
      expect(createWebPushSender).toHaveBeenCalledWith({
        publicKey: "pub",
        privateKey: "priv",
        subject: expected,
      });
    });
  });
});
