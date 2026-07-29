import { DataSource } from "typeorm";
import { beforeEach, describe, expect, it } from "vitest";
import { createAuthTestingModule } from "../../test/support/testing-module";
import { AuthService } from "../auth/auth.service";
import { AuthProvider } from "../auth/dto/auth.dto";
import { InAppNotificationEntity } from "../database/entities";
import { NotificationsService } from "./notifications.service";

describe("NotificationsService", () => {
  let authService: AuthService;
  let notificationsService: NotificationsService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module = await createAuthTestingModule([NotificationsService]);
    authService = module.get(AuthService);
    notificationsService = module.get(NotificationsService);
    dataSource = module.get(DataSource);

    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS admin_broadcasts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        opened_count INTEGER NOT NULL DEFAULT 0,
        clicked_count INTEGER NOT NULL DEFAULT 0
      )
    `);
  });

  it("blocks guest accounts from listing in-app notifications", async () => {
    const guest = await authService.createGuestSession({});

    await expect(notificationsService.listInApp(guest.accessToken)).rejects.toThrow(
      "In-app notifications require a linked account",
    );
  });

  it("marks a notification as read", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    const repo = dataSource.getRepository(InAppNotificationEntity);
    const row = await repo.save(
      repo.create({
        userId: session.userId,
        kind: "admin_announcement",
        title: "Hello",
        body: "World",
      }),
    );

    const marked = await notificationsService.markRead(session.accessToken, row.id);

    expect(marked.readAt).toBeTruthy();
    const unread = await notificationsService.unreadCount(session.accessToken);
    expect(unread.count).toBe(0);
  });

  it("increments broadcast opened_count and clicked_count on engage", async () => {
    const session = await authService.completeOAuth(AuthProvider.Google, { code: "oauth-code" });
    await dataSource.query(
      `INSERT INTO admin_broadcasts (opened_count, clicked_count) VALUES (0, 0)`,
    );
    const broadcastRows = (await dataSource.query(
      `SELECT id FROM admin_broadcasts ORDER BY id DESC LIMIT 1`,
    )) as Array<{ id: number }>;
    const broadcastId = broadcastRows[0]?.id;
    expect(broadcastId).toBeTruthy();

    const repo = dataSource.getRepository(InAppNotificationEntity);
    const row = await repo.save(
      repo.create({
        userId: session.userId,
        kind: "admin_announcement",
        title: "Broadcast",
        body: "Body",
        broadcastId,
      }),
    );

    await notificationsService.engage(session.accessToken, row.id, { action: "open" });
    await notificationsService.engage(session.accessToken, row.id, { action: "click" });

    const counts = (await dataSource.query(
      `SELECT opened_count, clicked_count FROM admin_broadcasts WHERE id = ?`,
      [broadcastId],
    )) as Array<{ opened_count: number; clicked_count: number }>;

    expect(counts[0]?.opened_count).toBe(1);
    expect(counts[0]?.clicked_count).toBe(1);

    const updated = await repo.findOneByOrFail({ id: row.id });
    expect(updated.readAt).toBeTruthy();
    expect(updated.clickedAt).toBeTruthy();
  });
});
