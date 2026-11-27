import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { describe, expect, it, vi } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { resetMemoryRateLimits } from "../common/durable-rate-limit";
import { InAppNotificationEntity, PushTokenEntity } from "../database/entities";
import { buildMockAuthService } from "../test-support/auth";
import { overrideConfig, type TestEnv } from "../test-support/push";
import { asRepository, buildMockRepository } from "../test-support/repositories";
import { NotificationsService } from "./notifications.service";

const READ_AT = new Date("2026-01-01T00:00:00Z");
const WEB_TOKEN = JSON.stringify({
  endpoint: "https://fcm.googleapis.com/fcm/send/endpoint",
  expirationTime: null,
  keys: { p256dh: "p256", auth: "auth" },
});
const CLICKED_AT = new Date("2026-01-02T00:00:00Z");

async function setup() {
  // Each case signs in again; keep the per-IP OAuth limiter from tripping.
  resetMemoryRateLimits();
  const module = await createAuthTestingModule([NotificationsService]);
  const authService = module.get(AuthService);
  const dataSource = module.get(DataSource);
  await dataSource.query(`
    CREATE TABLE IF NOT EXISTS admin_broadcasts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      opened_count INTEGER NOT NULL DEFAULT 0,
      clicked_count INTEGER NOT NULL DEFAULT 0
    )
  `);
  const { accessToken, userId } = await authService.completeOAuth(AuthProvider.Google, {
    code: "c",
  });
  const notifications = dataSource.getRepository(InAppNotificationEntity);

  const seedNotification = (overrides: Partial<InAppNotificationEntity> = {}) =>
    notifications.save(
      notifications.create({
        userId,
        kind: "admin_announcement",
        title: "T",
        body: "B",
        ...overrides,
      }),
    );
  const seedBroadcast = async (): Promise<number> => {
    await dataSource.query(
      "INSERT INTO admin_broadcasts (opened_count, clicked_count) VALUES (0, 0)",
    );
    const [row] = (await dataSource.query("SELECT MAX(id) AS id FROM admin_broadcasts")) as Array<{
      id: number;
    }>;
    return row?.id ?? 0;
  };
  const readBroadcastCounts = async (id: number) =>
    (
      (await dataSource.query(
        "SELECT opened_count, clicked_count FROM admin_broadcasts WHERE id = ?",
        [id],
      )) as Array<{ opened_count: number; clicked_count: number }>
    )[0];

  return {
    service: module.get(NotificationsService),
    authService,
    dataSource,
    config: module.get(ConfigService),
    accessToken,
    userId,
    notifications,
    pushTokens: dataSource.getRepository(PushTokenEntity),
    seedNotification,
    seedBroadcast,
    readBroadcastCounts,
  };
}

describe("NotificationsService", () => {
  describe("getVapidPublicKey", () => {
    it.each<[string, TestEnv, string | null]>([
      ["a trimmed key", { VAPID_PUBLIC_KEY: "  vapid-key  " }, "vapid-key"],
      ["null for a blank key", { VAPID_PUBLIC_KEY: "   " }, null],
      ["null when unset", { VAPID_PUBLIC_KEY: undefined }, null],
    ])("returns %s", async (_label, env, expected) => {
      const { service, config } = await setup();
      overrideConfig(config, env);
      expect(service.getVapidPublicKey()).toEqual({ publicKey: expected });
    });
  });

  describe("authentication", () => {
    it.each<[string, (service: NotificationsService) => Promise<unknown>]>([
      ["upsertPushToken", (s) => s.upsertPushToken("", { token: "t", platform: "web" })],
      ["unreadCount", (s) => s.unreadCount("")],
    ])("%s requires a bearer token", async (_method, call) => {
      const { service } = await setup();
      await expect(call(service)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it("blocks guest accounts from the in-app inbox", async () => {
      const { service, authService } = await setup();
      const guest = await authService.createGuestSession({});

      const rejection = service.listInApp(guest.accessToken);
      await expect(rejection).rejects.toBeInstanceOf(ForbiddenException);
      await expect(rejection).rejects.toThrow("In-app notifications require a linked account");
    });
  });

  describe("upsertPushToken", () => {
    it("creates a token row with nullable metadata", async () => {
      const { service, accessToken } = await setup();

      const created = await service.upsertPushToken(accessToken, {
        token: WEB_TOKEN,
        deviceId: "   ",
        platform: "web",
      });

      expect(created).toMatchObject({
        token: WEB_TOKEN,
        platform: "web",
        deviceId: null,
        locale: null,
        clientPlatform: null,
        updatedAt: expect.any(String),
      });
    });

    it.each([
      ["a bare URL", "https://fcm.googleapis.com/fcm/send/endpoint"],
      [
        "an internal endpoint (SSRF)",
        JSON.stringify({
          endpoint: "https://169.254.169.254/latest/meta-data",
          keys: { p256dh: "p256", auth: "auth" },
        }),
      ],
      [
        "an unknown push host",
        JSON.stringify({
          endpoint: "https://attacker.example/collect",
          keys: { p256dh: "p256", auth: "auth" },
        }),
      ],
    ])("rejects a web token that is %s", async (_label, token) => {
      const { service, accessToken, pushTokens } = await setup();

      await expect(
        service.upsertPushToken(accessToken, { token, platform: "web" }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(await pushTokens.count()).toBe(0);
    });

    it("refreshes an existing row matched by token", async () => {
      const { service, accessToken } = await setup();
      const dto = { token: WEB_TOKEN, platform: "web" as const };
      const created = await service.upsertPushToken(accessToken, dto);

      const refreshed = await service.upsertPushToken(accessToken, {
        ...dto,
        locale: "ur",
        clientPlatform: "web",
      });

      expect(refreshed).toMatchObject({ id: created.id, locale: "ur", clientPlatform: "web" });
    });

    it("rotates the token stored for an existing device id", async () => {
      const { service, accessToken, pushTokens } = await setup();
      const first = await service.upsertPushToken(accessToken, {
        token: "ExponentPushToken[old]",
        deviceId: " device-1 ",
        platform: "expo",
      });

      const rotated = await service.upsertPushToken(accessToken, {
        token: "ExponentPushToken[new]",
        deviceId: "device-1",
        platform: "expo",
      });

      expect(rotated).toMatchObject({
        id: first.id,
        token: "ExponentPushToken[new]",
        deviceId: "device-1",
      });
      expect(await pushTokens.count()).toBe(1);
    });

    it("moves a device token to the account that registered it last", async () => {
      const { service, authService, accessToken, pushTokens } = await setup();
      const guest = await authService.createGuestSession({});
      const dto = {
        token: "ExponentPushToken[shared]",
        deviceId: "device-a",
        platform: "expo" as const,
      };
      await service.upsertPushToken(accessToken, dto);

      await service.upsertPushToken(guest.accessToken, dto);

      expect(await pushTokens.find({ where: { token: dto.token } })).toMatchObject([
        { userId: guest.userId },
      ]);
    });
  });

  describe("removePushToken (sign-out)", () => {
    it("removes this device's tokens from the caller's account only", async () => {
      const { service, authService, accessToken, userId, pushTokens } = await setup();
      const guest = await authService.createGuestSession({});
      await service.upsertPushToken(accessToken, {
        token: "ExponentPushToken[mine]",
        deviceId: "device-1",
        platform: "expo",
      });
      await service.upsertPushToken(accessToken, {
        token: "ExponentPushToken[tablet]",
        deviceId: "device-2",
        platform: "expo",
      });
      await service.upsertPushToken(guest.accessToken, {
        token: "ExponentPushToken[guest]",
        deviceId: "device-1",
        platform: "expo",
      });

      await expect(
        service.removePushToken(accessToken, { deviceId: " device-1 " }),
      ).resolves.toEqual({ removed: 1 });

      expect((await pushTokens.find({ where: { userId } })).map((row) => row.deviceId)).toEqual([
        "device-2",
      ]);
      expect(await pushTokens.count({ where: { userId: guest.userId } })).toBe(1);
    });

    it("can match by token, and needs a device id or a token", async () => {
      const { service, accessToken, pushTokens } = await setup();
      await service.upsertPushToken(accessToken, { token: WEB_TOKEN, platform: "web" });
      await expect(service.removePushToken(accessToken, { token: WEB_TOKEN })).resolves.toEqual({
        removed: 1,
      });
      expect(await pushTokens.count()).toBe(0);
      await expect(service.removePushToken(accessToken, {})).rejects.toBeInstanceOf(
        BadRequestException,
      );
      await expect(service.removePushToken("", { deviceId: "d" })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe("listInApp", () => {
    it("lists only the caller's notifications, newest first", async () => {
      const { service, authService, accessToken, seedNotification } = await setup();
      const older = await seedNotification();
      const newer = await seedNotification();
      const guest = await authService.createGuestSession({});
      await seedNotification({ userId: guest.userId });

      const { items } = await service.listInApp(accessToken);

      expect(items.map((item) => item.id)).toEqual([newer.id, older.id]);
    });

    it("maps optional columns", async () => {
      const { service, accessToken, seedNotification } = await setup();
      await seedNotification({ subtitle: "Sub", routeData: { screen: "home" }, dedupeKey: "dk" });

      const { items } = await service.listInApp(accessToken);

      expect(items[0]).toMatchObject({
        subtitle: "Sub",
        routeData: { screen: "home" },
        dedupeKey: "dk",
        broadcastId: null,
        readAt: null,
        clickedAt: null,
      });
    });

    it("maps unset optional columns to null", async () => {
      const { service, accessToken, seedNotification } = await setup();
      await seedNotification();

      const { items } = await service.listInApp(accessToken);

      expect(items[0]).toMatchObject({ subtitle: null, routeData: null, dedupeKey: null });
    });
  });

  describe("read state", () => {
    it("marks a notification as read", async () => {
      const { service, accessToken, seedNotification } = await setup();
      const row = await seedNotification();

      const marked = await service.markRead(accessToken, row.id);

      expect(marked.readAt).toEqual(expect.any(String));
      expect((await service.unreadCount(accessToken)).count).toBe(0);
    });

    it("keeps the first readAt timestamp", async () => {
      const { service, accessToken, seedNotification } = await setup();
      const row = await seedNotification({ readAt: READ_AT });

      const marked = await service.markRead(accessToken, row.id);

      expect(marked.readAt).toBe(READ_AT.toISOString());
    });

    it("404s for a notification the caller does not own", async () => {
      const { service, accessToken } = await setup();
      await expect(service.markRead(accessToken, 99_999)).rejects.toBeInstanceOf(NotFoundException);
    });

    it("counts unread notifications", async () => {
      const { service, accessToken, seedNotification } = await setup();
      await seedNotification();
      await seedNotification();
      await seedNotification({ readAt: READ_AT });

      await expect(service.unreadCount(accessToken)).resolves.toEqual({ count: 2 });
    });

    it("marks every notification as read", async () => {
      const { service, accessToken, seedNotification } = await setup();
      await seedNotification();
      await seedNotification();

      await expect(service.markAllRead(accessToken)).resolves.toEqual({ count: 0 });
      expect((await service.unreadCount(accessToken)).count).toBe(0);
    });
  });

  describe("engage", () => {
    it.each<["open" | "click", { opened_count: number; clicked_count: number }]>([
      ["open", { opened_count: 1, clicked_count: 0 }],
      ["click", { opened_count: 0, clicked_count: 1 }],
    ])("increments the broadcast counter on %s", async (action, counts) => {
      const { service, accessToken, seedNotification, seedBroadcast, readBroadcastCounts } =
        await setup();
      const broadcastId = await seedBroadcast();
      const row = await seedNotification({ broadcastId });

      await service.engage(accessToken, row.id, { action });

      expect(await readBroadcastCounts(broadcastId)).toEqual(counts);
    });

    it.each<["open" | "click", { opened_count: number; clicked_count: number }]>([
      ["open", { opened_count: 1, clicked_count: 0 }],
      ["click", { opened_count: 0, clicked_count: 1 }],
    ])("counts a repeated %s once per notification", async (action, counts) => {
      const { service, accessToken, seedNotification, seedBroadcast, readBroadcastCounts } =
        await setup();
      const broadcastId = await seedBroadcast();
      const row = await seedNotification({ broadcastId });

      for (let i = 0; i < 5; i += 1) await service.engage(accessToken, row.id, { action });

      expect(await readBroadcastCounts(broadcastId)).toEqual(counts);
    });

    it("marks an unread notification read on open without recording a click", async () => {
      const { service, accessToken, seedNotification } = await setup();
      const row = await seedNotification();

      const opened = await service.engage(accessToken, row.id, { action: "open" });

      expect(opened).toMatchObject({ readAt: expect.any(String), clickedAt: null });
    });

    it("records the click and read time on the first click", async () => {
      const { service, accessToken, seedNotification } = await setup();
      const row = await seedNotification();

      const clicked = await service.engage(accessToken, row.id, { action: "click" });

      expect(clicked).toMatchObject({ readAt: expect.any(String), clickedAt: expect.any(String) });
    });

    it.each(["open", "click"] as const)("preserves earlier timestamps on %s", async (action) => {
      const { service, accessToken, seedNotification } = await setup();
      const row = await seedNotification({ readAt: READ_AT, clickedAt: CLICKED_AT });

      const engaged = await service.engage(accessToken, row.id, { action });

      expect(engaged).toMatchObject({
        readAt: READ_AT.toISOString(),
        clickedAt: CLICKED_AT.toISOString(),
      });
    });

    it("does not touch broadcast counters for non-broadcast notifications", async () => {
      const { service, accessToken, dataSource, seedNotification } = await setup();
      const row = await seedNotification();
      const query = vi.spyOn(dataSource, "query");

      await service.engage(accessToken, row.id, { action: "click" });

      expect(query).not.toHaveBeenCalled();
    });

    it("uses a positional $1 placeholder on postgres", async () => {
      const row = { id: 1, userId: "user-1", broadcastId: 42, createdAt: READ_AT };
      const query = vi.fn().mockResolvedValue([]);
      const service = new NotificationsService(
        asRepository<InAppNotificationEntity>(
          buildMockRepository({ findOne: vi.fn().mockResolvedValue(row) }),
        ),
        asRepository<PushTokenEntity>(buildMockRepository()),
        buildMockAuthService().asService(),
        {} as never,
        { options: { type: "postgres" }, query } as unknown as DataSource,
      );

      await service.engage("token", 1, { action: "click" });

      expect(query).toHaveBeenCalledWith(
        'UPDATE admin_broadcasts SET "clicked_count" = COALESCE("clicked_count", 0) + 1 WHERE id = $1',
        [42],
      );
    });
  });
});
