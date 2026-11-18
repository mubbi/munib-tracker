import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { buildRequest, TEST_ACCESS_TOKEN, TEST_BEARER } from "../test-support/http";
import {
  buildConfigService,
  buildMockQStashService,
  buildQStashRequest,
  type TestEnv,
} from "../test-support/push";
import type { UpsertSurfacePushDto } from "./dto/surface-push.dto";
import { SurfacePushController } from "./surface-push.controller";
import type { SurfacePushService } from "./surface-push.service";
import type { SurfacePushQStashService } from "./surface-push-qstash.service";

const DISPATCH_RESULT = { claimed: 2, delivered: 2, failed: 0 };

function setup(env: TestEnv = { SURFACE_PUSH_CRON_SECRET: "  cron-secret  " }) {
  const service = {
    upsert: vi.fn().mockResolvedValue({ registrationId: 1, channel: "expo", scheduled: 1 }),
    lifecycle: vi.fn().mockResolvedValue(undefined),
    deleteRegistration: vi.fn().mockResolvedValue(undefined),
    deliver: vi.fn().mockResolvedValue(undefined),
    dispatchDue: vi.fn().mockResolvedValue(DISPATCH_RESULT),
  };
  const qstash = buildMockQStashService();
  const controller = new SurfacePushController(
    service as unknown as SurfacePushService,
    qstash as unknown as SurfacePushQStashService,
    buildConfigService(env),
  );
  return { controller, service, qstash };
}

describe("SurfacePushController", () => {
  it("upserts with the bearer token", async () => {
    const { controller, service } = setup();
    const dto: UpsertSurfacePushDto = { channel: "expo", target: "t", updates: [] };

    await expect(controller.upsert(TEST_BEARER, buildRequest(), dto)).resolves.toMatchObject({
      registrationId: 1,
    });
    expect(service.upsert).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, dto);
  });

  it("forwards lifecycle updates", async () => {
    const { controller, service } = setup();
    await controller.lifecycle(TEST_BEARER, buildRequest(), 7, { state: "dismissed" });
    expect(service.lifecycle).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, 7, { state: "dismissed" });
  });

  it("forwards registration deletes", async () => {
    const { controller, service } = setup();
    await controller.delete(TEST_BEARER, buildRequest(), 9);
    expect(service.deleteRegistration).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, 9);
  });

  it("rejects requests without an access token", () => {
    const { controller } = setup();
    expect(() => controller.upsert(undefined, buildRequest(), {} as UpsertSurfacePushDto)).toThrow(
      UnauthorizedException,
    );
  });

  it("delivers a job when the QStash signature is valid", async () => {
    const { controller, service, qstash } = setup();
    const req = buildQStashRequest({ jobId: "j1" });

    await expect(controller.deliver("sig", req, { jobId: "j1" })).resolves.toEqual({ ok: true });
    expect(qstash.verify).toHaveBeenCalledWith("sig", req.rawBody);
    expect(service.deliver).toHaveBeenCalledWith("j1");
  });

  it("refuses delivery when the QStash signature is invalid", async () => {
    const { controller, service, qstash } = setup();
    qstash.verify.mockResolvedValue(false);

    await expect(
      controller.deliver("bad", buildQStashRequest({ jobId: "j1" }), { jobId: "j1" }),
    ).rejects.toThrow("Invalid QStash signature");
    expect(service.deliver).not.toHaveBeenCalled();
  });

  it("dispatches due jobs with the trimmed cron secret", async () => {
    const { controller } = setup();
    await expect(controller.dispatchDue("Bearer cron-secret")).resolves.toEqual(DISPATCH_RESULT);
  });

  it.each<[string, string | undefined, TestEnv, string]>([
    [
      "a wrong secret",
      "Bearer wrong",
      { SURFACE_PUSH_CRON_SECRET: "s" },
      "Invalid surface push cron secret",
    ],
    ["no header", undefined, { SURFACE_PUSH_CRON_SECRET: "s" }, "Invalid surface push cron secret"],
    [
      "a blank configured secret",
      "Bearer ",
      { SURFACE_PUSH_CRON_SECRET: "  " },
      "Surface push cron is not configured",
    ],
    ["no configured secret", "Bearer s", {}, "Surface push cron is not configured"],
  ])("refuses dispatch with %s", async (_label, authorization, env, message) => {
    const { controller, service } = setup(env);
    await expect(controller.dispatchDue(authorization)).rejects.toThrow(message);
    expect(service.dispatchDue).not.toHaveBeenCalled();
  });
});
