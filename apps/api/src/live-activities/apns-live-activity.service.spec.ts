import { LiveActivityDeliveryError } from "@munib-tracker/live-activity-delivery";
import { ServiceUnavailableException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { buildConfigService, type TestEnv } from "../test-support/push";
import { ApnsLiveActivityService } from "./apns-live-activity.service";

const APNS_ENV: TestEnv = {
  APNS_TEAM_ID: "TEAM123456",
  APNS_KEY_ID: "KEY1234567",
  APNS_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----",
  APNS_BUNDLE_ID: "app.example",
};

const UPDATE = {
  token: "a".repeat(64),
  environment: "sandbox" as const,
  contentState: { phase: "upcoming" },
  expiresAt: new Date("2030-01-01T00:00:00Z"),
};

function setup(env: TestEnv = APNS_ENV) {
  const service = new ApnsLiveActivityService(buildConfigService(env));
  const sendUpdate = vi.spyOn(service.getClient(), "sendUpdate");
  return { service, sendUpdate };
}

describe("ApnsLiveActivityService", () => {
  it.each<[string, TestEnv, boolean]>([
    ["complete APNs credentials", APNS_ENV, true],
    ["no credentials", {}, false],
  ])("with %s reports configured=%s", (_label, env, expected) => {
    expect(setup(env).service.isConfigured()).toBe(expected);
  });

  it("closes the shared client on module destroy", () => {
    const { service } = setup();
    const close = vi.spyOn(service.getClient(), "close");
    service.onModuleDestroy();
    expect(close).toHaveBeenCalledOnce();
  });

  it("returns the APNs result from the shared client", async () => {
    const { service, sendUpdate } = setup();
    sendUpdate.mockResolvedValue({ ok: true, apnsId: "apns-1" } as never);

    await expect(service.sendUpdate(UPDATE)).resolves.toEqual({ ok: true, apnsId: "apns-1" });
    expect(sendUpdate).toHaveBeenCalledWith(UPDATE);
  });

  it("maps a missing APNs configuration to 503", async () => {
    const { service } = setup({});
    await expect(service.sendUpdate(UPDATE)).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it.each([new LiveActivityDeliveryError("apns down", "TRANSIENT_APNS", true), new Error("boom")])(
    "rethrows %s unchanged",
    async (error) => {
      const { service, sendUpdate } = setup();
      sendUpdate.mockRejectedValue(error);
      await expect(service.sendUpdate(UPDATE)).rejects.toBe(error);
    },
  );
});
