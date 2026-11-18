import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { buildRequest, TEST_ACCESS_TOKEN, TEST_BEARER } from "../test-support/http";
import {
  buildConfigService,
  buildMockQStashService,
  buildQStashRequest,
  type TestEnv,
} from "../test-support/push";
import { LiveActivityApnsEnvironment, type UpsertLiveActivityDto } from "./dto/live-activity.dto";
import { LiveActivitiesController } from "./live-activities.controller";
import type { LiveActivitiesService } from "./live-activities.service";
import type { LiveActivityQStashService } from "./live-activity-qstash.service";

const DISPATCH_RESULT = { claimed: 1, delivered: 1, failed: 0 };

function setup(env: TestEnv = { LIVE_ACTIVITY_CRON_SECRET: "la-secret" }) {
  const service = {
    upsert: vi.fn().mockResolvedValue({ activityId: "a", expiresAt: "x", scheduled: 1 }),
    lifecycle: vi.fn().mockResolvedValue(undefined),
    deliver: vi.fn().mockResolvedValue(undefined),
    dispatchDue: vi.fn().mockResolvedValue(DISPATCH_RESULT),
  };
  const qstash = buildMockQStashService();
  const controller = new LiveActivitiesController(
    service as unknown as LiveActivitiesService,
    qstash as unknown as LiveActivityQStashService,
    buildConfigService(env),
  );
  return { controller, service, qstash };
}

describe("LiveActivitiesController", () => {
  it("upserts with the bearer token", async () => {
    const { controller, service } = setup();
    const dto: UpsertLiveActivityDto = {
      activityId: "a",
      pushToken: "p",
      environment: LiveActivityApnsEnvironment.Production,
      updates: [],
    };

    await expect(controller.upsert(TEST_BEARER, buildRequest(), dto)).resolves.toMatchObject({
      scheduled: 1,
    });
    expect(service.upsert).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, dto);
  });

  it("forwards lifecycle updates", async () => {
    const { controller, service } = setup();
    await controller.lifecycle(TEST_BEARER, buildRequest(), "a", { state: "ended" });
    expect(service.lifecycle).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, "a", { state: "ended" });
  });

  it("does not treat the web 'cookie' bearer marker as a token", () => {
    const { controller } = setup();
    expect(() =>
      controller.lifecycle("Bearer cookie", buildRequest(), "a", { state: "ended" }),
    ).toThrow(UnauthorizedException);
  });

  it("delivers a job when the QStash signature is valid", async () => {
    const { controller, service } = setup();
    await expect(
      controller.deliver("sig", buildQStashRequest({ jobId: "j1" }), { jobId: "j1" }),
    ).resolves.toEqual({ ok: true });
    expect(service.deliver).toHaveBeenCalledWith("j1");
  });

  it("refuses delivery when the QStash signature is invalid", async () => {
    const { controller, service, qstash } = setup();
    qstash.verify.mockResolvedValue(false);

    await expect(
      controller.deliver(undefined, buildQStashRequest({ jobId: "j1" }), { jobId: "j1" }),
    ).rejects.toThrow("Invalid QStash signature");
    expect(service.deliver).not.toHaveBeenCalled();
  });

  it("dispatches due jobs with the configured cron secret", async () => {
    const { controller } = setup();
    await expect(controller.dispatchDue("Bearer la-secret")).resolves.toEqual(DISPATCH_RESULT);
  });

  it.each<[string, string | undefined, TestEnv, string]>([
    [
      "a secret without the Bearer prefix",
      "la-secret",
      { LIVE_ACTIVITY_CRON_SECRET: "la-secret" },
      "Invalid Live Activity cron secret",
    ],
    ["no configured secret", "Bearer la-secret", {}, "Live Activity cron is not configured"],
  ])("refuses dispatch with %s", async (_label, authorization, env, message) => {
    const { controller, service } = setup(env);
    await expect(controller.dispatchDue(authorization)).rejects.toThrow(message);
    expect(service.dispatchDue).not.toHaveBeenCalled();
  });
});
