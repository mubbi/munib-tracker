import AsyncStorage from "@react-native-async-storage/async-storage";

import { buildInAppNotification } from "@/test-support/fixtures/in-app-notifications";

import {
  appendInAppNotification,
  clearAllInAppNotifications,
  countUnreadInAppNotifications,
  loadInAppNotifications,
  markAllInAppNotificationsRead,
  markInAppNotificationRead,
  mergeServerInAppNotifications,
} from "./storage";

const KEY = "@munib_tracker_in_app_notifications_v1";
const seed = (items: unknown) => AsyncStorage.setItem(KEY, JSON.stringify(items));

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("loadInAppNotifications", () => {
  it("returns stored items newest first", async () => {
    await seed([
      buildInAppNotification({ id: "old", createdAt: "2026-01-01T00:00:00.000Z" }),
      buildInAppNotification({ id: "new", createdAt: "2026-02-01T00:00:00.000Z" }),
    ]);
    expect((await loadInAppNotifications()).map((n) => n.id)).toEqual(["new", "old"]);
  });

  it.each([
    ["nothing stored", null],
    ["a non-array", "{}"],
    ["corrupt JSON", "{bad"],
  ])("returns [] for %s", async (_label, raw) => {
    if (raw) await AsyncStorage.setItem(KEY, raw);
    expect(await loadInAppNotifications()).toEqual([]);
  });
});

describe("appendInAppNotification", () => {
  it("creates an unread notification with a generated id", async () => {
    const created = await appendInAppNotification({ kind: "system", title: "T", body: "B" });
    expect(created).toMatchObject({ kind: "system", title: "T", readAt: null });
    expect(created.id).toMatch(/^inapp-\d+-/);
    expect(await loadInAppNotifications()).toEqual([created]);
  });

  it("returns the existing item for a duplicate id", async () => {
    const first = await appendInAppNotification({ id: "x", kind: "system", title: "T", body: "B" });
    const second = await appendInAppNotification({
      id: "x",
      kind: "system",
      title: "Other",
      body: "B",
    });
    expect(second).toEqual(first);
    expect(await loadInAppNotifications()).toHaveLength(1);
  });

  it("keeps at most 100 items", async () => {
    await seed(
      Array.from({ length: 100 }, (_, i) =>
        buildInAppNotification({
          id: `n${i}`,
          createdAt: `2025-01-01T00:00:${String(i % 60).padStart(2, "0")}.000Z`,
        }),
      ),
    );
    await appendInAppNotification({ kind: "system", title: "T", body: "B" });
    expect(await loadInAppNotifications()).toHaveLength(100);
  });
});

describe("mergeServerInAppNotifications", () => {
  it("replaces local copies of server rows and keeps local-only items", async () => {
    await seed([
      buildInAppNotification({ id: "local", createdAt: "2026-01-01T00:00:00.000Z" }),
      buildInAppNotification({
        id: "stale",
        serverId: 5,
        title: "Old",
        createdAt: "2026-01-02T00:00:00.000Z",
      }),
    ]);
    const merged = await mergeServerInAppNotifications([
      buildInAppNotification({
        id: "srv",
        serverId: 5,
        title: "New",
        createdAt: "2026-01-03T00:00:00.000Z",
      }),
      buildInAppNotification({ id: "srv-null", createdAt: "2026-01-04T00:00:00.000Z" }),
    ]);
    expect(merged.map((n) => n.id)).toEqual(["srv-null", "srv", "local"]);
  });
});

describe("read state", () => {
  beforeEach(() =>
    seed([
      buildInAppNotification({ id: "a" }),
      buildInAppNotification({ id: "b", readAt: "2026-01-01T00:00:00.000Z" }),
    ]),
  );

  it("marks one notification read without touching others", async () => {
    await markInAppNotificationRead("a");
    const items = await loadInAppNotifications();
    expect(items.find((n) => n.id === "a")?.readAt).toEqual(expect.any(String));
    expect(items.find((n) => n.id === "b")?.readAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("marks all read, keeping earlier read times", async () => {
    await markAllInAppNotificationsRead();
    const items = await loadInAppNotifications();
    expect(countUnreadInAppNotifications(items)).toBe(0);
    expect(items.find((n) => n.id === "b")?.readAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("counts unread notifications", async () => {
    expect(countUnreadInAppNotifications(await loadInAppNotifications())).toBe(1);
  });

  it("clears everything", async () => {
    await clearAllInAppNotifications();
    expect(await loadInAppNotifications()).toEqual([]);
  });
});
