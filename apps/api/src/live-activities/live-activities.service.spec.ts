import { DataSource } from "typeorm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { LiveActivityPushJobEntity, LiveActivityPushTokenEntity } from "../database/entities";
import { ApnsLiveActivityService } from "./apns-live-activity.service";
import { LiveActivityApnsEnvironment } from "./dto/live-activity.dto";
import { LiveActivitiesService } from "./live-activities.service";
import { LiveActivityQStashService } from "./live-activity-qstash.service";
import { TypeOrmLiveActivityJobStore } from "./typeorm-live-activity-job-store";

function contentState(overrides: Record<string, unknown> = {}) {
  return {
    prayerId: "asr",
    prayerName: "Asr",
    phase: "markSalah",
    actionLabel: "Mark Salah",
    actionDeepLink: "munib-tracker://mark-current",
    deepLink: "munib-tracker://mark-current",
    targetTimeMs: Date.now() + 60_000,
    minutesUntil: 1,
    progressPercent: 40,
    ...overrides,
  };
}

describe("LiveActivitiesService", () => {
  let authService: AuthService;
  let service: LiveActivitiesService;
  let dataSource: DataSource;
  let qstash: { schedule: ReturnType<typeof vi.fn>; cancel: ReturnType<typeof vi.fn> };
  let apns: {
    sendUpdate: ReturnType<typeof vi.fn>;
    getClient: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    qstash = {
      schedule: vi.fn(async () => "msg-1"),
      cancel: vi.fn(async () => undefined),
    };
    const sendUpdate = vi.fn(async () => ({ ok: true as const, apnsId: "apns-1" }));
    apns = {
      sendUpdate,
      getClient: vi.fn(() => ({ sendUpdate })),
    };

    const module = await createAuthTestingModule([
      LiveActivitiesService,
      TypeOrmLiveActivityJobStore,
      { provide: LiveActivityQStashService, useValue: qstash },
      { provide: ApnsLiveActivityService, useValue: apns },
    ]);
    authService = module.get(AuthService);
    service = module.get(LiveActivitiesService);
    dataSource = module.get(DataSource);
  });

  it("upserts an ActivityKit token and schedules QStash jobs", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    const executeAt = new Date(Date.now() + 5 * 60_000).toISOString();

    const result = await service.upsert(session.accessToken, {
      activityId: "activity-1",
      pushToken: "a".repeat(64),
      environment: LiveActivityApnsEnvironment.Sandbox,
      updates: [
        {
          phase: "markSalah",
          executeAt,
          contentState: contentState(),
        },
      ],
    });

    expect(result.activityId).toBe("activity-1");
    expect(result.scheduled).toBe(1);
    expect(qstash.schedule).toHaveBeenCalledOnce();

    const tokens = await dataSource.getRepository(LiveActivityPushTokenEntity).find();
    expect(tokens).toHaveLength(1);
    expect(tokens[0]?.tokenCiphertext.startsWith("v1.")).toBe(true);

    const jobs = await dataSource.getRepository(LiveActivityPushJobEntity).find();
    expect(jobs).toHaveLength(1);
    expect(jobs[0]?.qstashMessageId).toBe("msg-1");
  });

  it("cancels pending jobs when the activity ends", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    await service.upsert(session.accessToken, {
      activityId: "activity-2",
      pushToken: "b".repeat(64),
      environment: LiveActivityApnsEnvironment.Sandbox,
      updates: [
        {
          phase: "afterSalah",
          executeAt: new Date(Date.now() + 10 * 60_000).toISOString(),
          contentState: contentState({ phase: "afterSalah" }),
        },
      ],
    });

    await service.lifecycle(session.accessToken, "activity-2", { state: "ended" });

    const jobs = await dataSource.getRepository(LiveActivityPushJobEntity).find();
    expect(jobs[0]?.status).toBe("cancelled");
    expect(qstash.cancel).toHaveBeenCalled();
  });

  it("delivers a due job through APNs", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    await service.upsert(session.accessToken, {
      activityId: "activity-3",
      pushToken: "c".repeat(64),
      environment: LiveActivityApnsEnvironment.Sandbox,
      updates: [
        {
          phase: "upcoming",
          executeAt: new Date(Date.now() - 1_000).toISOString(),
          contentState: contentState({ phase: "upcoming" }),
        },
      ],
    });
    const job = await dataSource.getRepository(LiveActivityPushJobEntity).findOneOrFail({
      where: {},
    });

    await service.deliver(job.id);

    expect(apns.sendUpdate).toHaveBeenCalledOnce();
    const saved = await dataSource.getRepository(LiveActivityPushJobEntity).findOneOrFail({
      where: { id: job.id },
    });
    expect(saved.status).toBe("delivered");
  });

  it("rejects content states that exceed the APNs budget", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    await expect(
      service.upsert(session.accessToken, {
        activityId: "activity-4",
        pushToken: "d".repeat(64),
        environment: LiveActivityApnsEnvironment.Sandbox,
        updates: [
          {
            phase: "markSalah",
            executeAt: new Date(Date.now() + 60_000).toISOString(),
            contentState: contentState({ prayerName: "x".repeat(5_000) }),
          },
        ],
      }),
    ).rejects.toThrow(/payload budget/);
  });
});
