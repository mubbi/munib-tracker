import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { SurfacePushJobEntity, SurfacePushRegistrationEntity } from "../database/entities";
import { SurfacePushService } from "./surface-push.service";
import { SurfacePushQStashService } from "./surface-push-qstash.service";
import { TypeOrmSurfaceJobStore } from "./typeorm-surface-job-store";

vi.mock("@munib-tracker/surface-push-delivery", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@munib-tracker/surface-push-delivery")>();
  return {
    ...actual,
    deliverSurfaceJob: vi.fn(async () => undefined),
    dispatchDueSurfaceJobs: vi.fn(async () => ({ claimed: 0, delivered: 0, failed: 0 })),
    createExpoPushSender: vi.fn(() => ({ send: vi.fn() })),
    createWebPushSender: vi.fn(() => ({ send: vi.fn() })),
  };
});

const EXPO_TOKEN = "ExponentPushToken[abc_123]";

describe("SurfacePushService", () => {
  let authService: AuthService;
  let service: SurfacePushService;
  let dataSource: DataSource;
  let qstash: { schedule: ReturnType<typeof vi.fn>; cancel: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    qstash = {
      schedule: vi.fn(async () => "msg-surface-1"),
      cancel: vi.fn(async () => undefined),
    };

    const module = await createAuthTestingModule([
      SurfacePushService,
      TypeOrmSurfaceJobStore,
      { provide: SurfacePushQStashService, useValue: qstash },
    ]);
    authService = module.get(AuthService);
    service = module.get(SurfacePushService);
    dataSource = module.get(DataSource);
  });

  it("upserts an Expo registration and schedules QStash jobs", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    const executeAt = new Date(Date.now() + 5 * 60_000).toISOString();

    const result = await service.upsert(session.accessToken, {
      channel: "expo",
      target: EXPO_TOKEN,
      updates: [
        {
          phase: "markSalah",
          executeAt,
          dedupeKey: "dedupe-1",
          payload: { title: "Asr" },
        },
      ],
    });

    expect(result.channel).toBe("expo");
    expect(result.scheduled).toBe(1);
    expect(qstash.schedule).toHaveBeenCalledOnce();

    const regs = await dataSource.getRepository(SurfacePushRegistrationEntity).find();
    expect(regs).toHaveLength(1);
    expect(regs[0]?.channel).toBe("expo");

    const jobs = await dataSource.getRepository(SurfacePushJobEntity).find();
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.qstashMessageId).toBe("msg-surface-1");
  });

  it("rejects invalid Expo tokens", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    await expect(
      service.upsert(session.accessToken, {
        channel: "expo",
        target: "not-a-token",
        updates: [
          {
            phase: "markSalah",
            executeAt: new Date(Date.now() + 60_000).toISOString(),
            dedupeKey: "d1",
            payload: {},
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects schedules with no future updates", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    await expect(
      service.upsert(session.accessToken, {
        channel: "expo",
        target: EXPO_TOKEN,
        updates: [
          {
            phase: "markSalah",
            executeAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
            dedupeKey: "old",
            payload: {},
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("ends a registration and cancels pending jobs", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    const created = await service.upsert(session.accessToken, {
      channel: "expo",
      target: EXPO_TOKEN,
      updates: [
        {
          phase: "afterSalah",
          executeAt: new Date(Date.now() + 10 * 60_000).toISOString(),
          dedupeKey: "d2",
          payload: { phase: "afterSalah" },
        },
      ],
    });

    await service.lifecycle(session.accessToken, created.registrationId, { state: "ended" });

    const reg = await dataSource.getRepository(SurfacePushRegistrationEntity).findOneOrFail({
      where: { id: created.registrationId },
    });
    expect(reg.status).toBe("ended");
    expect(qstash.cancel).toHaveBeenCalled();
  });

  it("forbids lifecycle on another user's registration", async () => {
    const owner = await authService.completeOAuth(AuthProvider.Google, { code: "owner" });
    const guest = await authService.createGuestSession({ deviceId: "guest-device-xxxxxxxx" });
    const created = await service.upsert(owner.accessToken, {
      channel: "expo",
      target: EXPO_TOKEN,
      updates: [
        {
          phase: "upcoming",
          executeAt: new Date(Date.now() + 60_000).toISOString(),
          dedupeKey: "d3",
          payload: {},
        },
      ],
    });

    await expect(
      service.lifecycle(guest.accessToken, created.registrationId, { state: "ended" }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("deletes a registration", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    const created = await service.upsert(session.accessToken, {
      channel: "expo",
      target: EXPO_TOKEN,
      updates: [
        {
          phase: "upcoming",
          executeAt: new Date(Date.now() + 60_000).toISOString(),
          dedupeKey: "d4",
          payload: {},
        },
      ],
    });

    await service.deleteRegistration(session.accessToken, created.registrationId);

    const regs = await dataSource.getRepository(SurfacePushRegistrationEntity).find();
    expect(regs).toHaveLength(0);
    expect(qstash.cancel).toHaveBeenCalled();
  });

  it("accepts a valid Web Push subscription JSON target", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    const target = JSON.stringify({
      endpoint: "https://push.example/sub",
      expirationTime: null,
      keys: { p256dh: "p256", auth: "auth" },
    });

    const result = await service.upsert(session.accessToken, {
      channel: "web_push",
      target,
      updates: [
        {
          phase: "markSalah",
          executeAt: new Date(Date.now() + 60_000).toISOString(),
          dedupeKey: "web-1",
          payload: { ok: true },
        },
      ],
    });

    expect(result.channel).toBe("web_push");
    expect(result.scheduled).toBe(1);
  });
});
