import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { buildRequest, TEST_ACCESS_TOKEN, TEST_BEARER } from "../test-support/http";
import type { UpsertPushTokenDto } from "./dto/notifications.dto";
import { NotificationsController } from "./notifications.controller";
import type { NotificationsService } from "./notifications.service";

const PUSH_TOKEN_DTO: UpsertPushTokenDto = { token: "t", platform: "expo" };

function setup() {
  const service = {
    getVapidPublicKey: vi.fn().mockReturnValue({ publicKey: "vapid" }),
    upsertPushToken: vi.fn().mockResolvedValue({ id: 1 }),
    listInApp: vi.fn().mockResolvedValue({ items: [] }),
    unreadCount: vi.fn().mockResolvedValue({ count: 3 }),
    markAllRead: vi.fn().mockResolvedValue({ count: 0 }),
    markRead: vi.fn().mockResolvedValue({ id: 5 }),
    engage: vi.fn().mockResolvedValue({ id: 6 }),
    removePushToken: vi.fn().mockResolvedValue({ removed: 1 }),
  };
  const controller = new NotificationsController(service as unknown as NotificationsService);
  return { controller, service };
}

type Route = (controller: NotificationsController, authorization?: string) => Promise<unknown>;

describe("NotificationsController", () => {
  it("returns the VAPID public key", () => {
    expect(setup().controller.getVapidPublicKey()).toEqual({ publicKey: "vapid" });
  });

  it.each<[keyof ReturnType<typeof setup>["service"], Route, unknown[]]>([
    [
      "upsertPushToken",
      (c, a) => c.upsertPushToken(a, buildRequest(), PUSH_TOKEN_DTO),
      [PUSH_TOKEN_DTO],
    ],
    ["listInApp", (c, a) => c.listInApp(a, buildRequest()), []],
    ["unreadCount", (c, a) => c.unreadCount(a, buildRequest()), []],
    ["markAllRead", (c, a) => c.markAllRead(a, buildRequest()), []],
    ["markRead", (c, a) => c.markRead(a, buildRequest(), 5), [5]],
    [
      "engage",
      (c, a) => c.engage(a, buildRequest(), 6, { action: "click" }),
      [6, { action: "click" }],
    ],
    [
      "removePushToken",
      (c, a) => c.removePushToken(a, buildRequest(), { token: "t" }),
      [{ token: "t" }],
    ],
  ])("%s forwards the resolved bearer token", async (method, route, args) => {
    const { controller, service } = setup();
    await route(controller, TEST_BEARER);
    expect(service[method]).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, ...args);
  });

  it("throws Unauthorized when no token is provided", () => {
    const { controller, service } = setup();
    expect(() => controller.listInApp(undefined, buildRequest())).toThrow(UnauthorizedException);
    expect(service.listInApp).not.toHaveBeenCalled();
  });
});
