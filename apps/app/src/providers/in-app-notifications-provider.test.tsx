import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Linking } from "react-native";

import { noteWeeklyReportOpened } from "@/features/reviews/lib/reviewNotificationTap";
import {
  appendInAppNotification,
  clearAllInAppNotifications,
  type InAppNotification,
  loadInAppNotifications,
  markAllInAppNotificationsRead,
  markInAppNotificationRead,
  mergeServerInAppNotifications,
} from "@/lib/in-app-notifications/storage";
import {
  engageServerInApp,
  fetchInAppNotifications,
  markAllServerInAppRead,
  markServerInAppRead,
  resolveInAppOpenTarget,
} from "@/lib/notifications-api";
import {
  InAppNotificationsProvider,
  useInAppNotifications,
} from "@/providers/in-app-notifications-provider";
import { buildInAppNotification } from "@/test-support/fixtures/in-app-notifications";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock("@/lib/in-app-notifications/storage", () => ({
  appendInAppNotification: jest.fn(),
  clearAllInAppNotifications: jest.fn(async () => undefined),
  countUnreadInAppNotifications: (items: { readAt: string | null }[]) =>
    items.filter((item) => !item.readAt).length,
  loadInAppNotifications: jest.fn(),
  markAllInAppNotificationsRead: jest.fn(async () => undefined),
  markInAppNotificationRead: jest.fn(async () => undefined),
  mergeServerInAppNotifications: jest.fn(),
}));
jest.mock("@/lib/notifications-api", () => ({
  engageServerInApp: jest.fn(async () => undefined),
  fetchInAppNotifications: jest.fn(async () => []),
  markAllServerInAppRead: jest.fn(async () => undefined),
  markServerInAppRead: jest.fn(async () => undefined),
  resolveInAppOpenTarget: jest.fn(() => ({ type: "none" })),
}));
jest.mock("@/features/reviews/lib/reviewNotificationTap", () => ({
  noteWeeklyReportOpened: jest.fn(() => false),
}));

const SERVER_ITEM = buildInAppNotification({ id: "s1", serverId: 7, title: "From server" });

function signIn() {
  setMockAuth({
    isAuthenticated: true,
    isGuest: false,
    session: { accessToken: "tok", userId: "u1" },
  });
}

/** Mounts the provider over `stored` local items and waits for the first sync. */
async function setup(stored: InAppNotification[] = []) {
  jest.mocked(loadInAppNotifications).mockResolvedValue(stored);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <InAppNotificationsProvider>{children}</InAppNotificationsProvider>
  );
  const hook = await renderHook(() => useInAppNotifications(), { wrapper });
  await waitFor(() => expect(hook.result.current.items).toEqual(stored));
  const run = async (fn: (api: ReturnType<typeof useInAppNotifications>) => Promise<unknown>) => {
    let out: unknown;
    await act(async () => {
      out = await fn(hook.result.current);
    });
    return out;
  };
  return { result: hook.result, run };
}

beforeEach(() => {
  jest.clearAllMocks();
  resetAuthMock();
  resetExpoRouterMock();
  jest.spyOn(Linking, "openURL").mockResolvedValue(true);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useInAppNotifications", () => {
  it("throws outside the provider", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(renderHook(() => useInAppNotifications())).rejects.toThrow(
      "useInAppNotifications must be used within InAppNotificationsProvider",
    );
  });
});

describe("initial sync", () => {
  it("loads local items for guests and counts unread", async () => {
    const read = buildInAppNotification({ id: "r", readAt: "2026-01-02T00:00:00.000Z" });
    const { result } = await setup([buildInAppNotification(), read]);

    expect(result.current.unreadCount).toBe(1);
    expect(fetchInAppNotifications).not.toHaveBeenCalled();
  });

  it("merges the server inbox when signed in", async () => {
    signIn();
    jest.mocked(mergeServerInAppNotifications).mockResolvedValue([SERVER_ITEM]);
    jest.mocked(loadInAppNotifications).mockResolvedValue([]);
    const wrapper = ({ children }: { children: ReactNode }) => (
      <InAppNotificationsProvider>{children}</InAppNotificationsProvider>
    );

    const { result } = await renderHook(() => useInAppNotifications(), { wrapper });

    await waitFor(() => expect(result.current.items).toEqual([SERVER_ITEM]));
    expect(fetchInAppNotifications).toHaveBeenCalledWith("tok");
  });

  it("falls back to local items when the server fetch fails", async () => {
    signIn();
    jest.mocked(fetchInAppNotifications).mockRejectedValueOnce(new Error("offline"));

    const { result } = await setup([buildInAppNotification()]);

    expect(result.current.items).toHaveLength(1);
    expect(mergeServerInAppNotifications).not.toHaveBeenCalled();
  });
});

describe("deliver / clearAll", () => {
  it("appends a notification, refreshes and returns it", async () => {
    const created = buildInAppNotification({ id: "new" });
    jest.mocked(appendInAppNotification).mockResolvedValue(created);
    const { run } = await setup();
    jest.mocked(loadInAppNotifications).mockResolvedValue([created]);

    const out = await run((api) => api.deliver({ kind: "reminder", title: "T", body: "B" }));

    expect(out).toBe(created);
  });

  it("clears every notification and refreshes", async () => {
    const { result, run } = await setup([buildInAppNotification()]);
    jest.mocked(loadInAppNotifications).mockResolvedValue([]);

    await run((api) => api.clearAll());

    expect(clearAllInAppNotifications).toHaveBeenCalled();
    expect(result.current.items).toEqual([]);
  });
});

describe("markRead", () => {
  it("marks locally only for guests", async () => {
    const { run } = await setup([SERVER_ITEM]);

    await run((api) => api.markRead("s1"));

    expect(markInAppNotificationRead).toHaveBeenCalledWith("s1");
    expect(markServerInAppRead).not.toHaveBeenCalled();
  });

  it("marks the server copy when signed in", async () => {
    signIn();
    jest.mocked(mergeServerInAppNotifications).mockResolvedValue([SERVER_ITEM]);
    const { run } = await setup([SERVER_ITEM]);

    await run((api) => api.markRead("s1"));

    expect(markServerInAppRead).toHaveBeenCalledWith("tok", 7);
  });

  it("looks the item up in storage when it is not in state and tolerates server errors", async () => {
    signIn();
    jest.mocked(mergeServerInAppNotifications).mockResolvedValue([]);
    jest.mocked(markServerInAppRead).mockRejectedValueOnce(new Error("offline"));
    const { run } = await setup([]);
    jest.mocked(loadInAppNotifications).mockResolvedValue([SERVER_ITEM]);

    await run((api) => api.markRead("s1"));

    expect(markServerInAppRead).toHaveBeenCalledWith("tok", 7);
    expect(markInAppNotificationRead).toHaveBeenCalledWith("s1");
  });
});

describe("markAllRead", () => {
  it("marks locally only for guests", async () => {
    const { run } = await setup();
    await run((api) => api.markAllRead());

    expect(markAllInAppNotificationsRead).toHaveBeenCalled();
    expect(markAllServerInAppRead).not.toHaveBeenCalled();
  });

  it.each([
    ["succeeds", undefined],
    ["fails", new Error("offline")],
  ])("marks the server inbox when signed in (server %s)", async (_label, error) => {
    signIn();
    jest.mocked(mergeServerInAppNotifications).mockResolvedValue([]);
    if (error) jest.mocked(markAllServerInAppRead).mockRejectedValueOnce(error);
    const { run } = await setup();

    await run((api) => api.markAllRead());

    expect(markAllServerInAppRead).toHaveBeenCalledWith("tok");
    expect(markAllInAppNotificationsRead).toHaveBeenCalled();
  });
});

describe("open", () => {
  it("does nothing beyond marking read when the item is unknown", async () => {
    const { run } = await setup();
    await run((api) => api.open("missing"));

    expect(markInAppNotificationRead).toHaveBeenCalledWith("missing");
    expect(resolveInAppOpenTarget).not.toHaveBeenCalled();
  });

  it("resolves an item that is in storage but not yet in state", async () => {
    jest.mocked(resolveInAppOpenTarget).mockReturnValue({ type: "route", value: "/late" });
    const { run } = await setup();
    jest.mocked(loadInAppNotifications).mockResolvedValue([buildInAppNotification()]);

    await run((api) => api.open("n1"));

    expect(mockRouter.push).toHaveBeenCalledWith("/late");
  });

  it("notes a weekly report as a review moment and still opens its screen", async () => {
    jest.mocked(noteWeeklyReportOpened).mockReturnValueOnce(true);
    jest.mocked(resolveInAppOpenTarget).mockReturnValue({ type: "route", value: "/coach" });
    const item = buildInAppNotification({ kind: "system", id: "weekly-2026-11-18" });
    const { run } = await setup([item]);

    await run((api) => api.open(item.id));

    expect(noteWeeklyReportOpened).toHaveBeenCalledWith(
      "system",
      "weekly-2026-11-18",
      item.createdAt,
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/coach");
  });

  it("pushes the route target", async () => {
    jest.mocked(resolveInAppOpenTarget).mockReturnValue({ type: "route", value: "/stats" });
    const item = buildInAppNotification();
    const { run } = await setup([item]);

    await run((api) => api.open(item.id));

    expect(mockRouter.push).toHaveBeenCalledWith("/stats");
    expect(engageServerInApp).not.toHaveBeenCalled();
  });

  it("ignores a target without a value", async () => {
    jest.mocked(resolveInAppOpenTarget).mockReturnValue({ type: "route" });
    const item = buildInAppNotification();
    const { run } = await setup([item]);

    await run((api) => api.open(item.id));

    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it("opens external targets in the browser for guests without engagement", async () => {
    jest
      .mocked(resolveInAppOpenTarget)
      .mockReturnValue({ type: "external", value: "https://example.com" });
    const item = buildInAppNotification();
    const { run } = await setup([item]);

    await run((api) => api.open(item.id));

    expect(Linking.openURL).toHaveBeenCalledWith("https://example.com");
    expect(engageServerInApp).not.toHaveBeenCalled();
  });

  describe("when signed in", () => {
    beforeEach(() => {
      signIn();
    });

    async function openServerItem(item: InAppNotification) {
      jest.mocked(mergeServerInAppNotifications).mockResolvedValue([item]);
      const { run } = await setup([item]);
      await run((api) => api.open(item.id));
    }

    it("records an open and a click for external targets", async () => {
      jest
        .mocked(resolveInAppOpenTarget)
        .mockReturnValue({ type: "external", value: "https://example.com" });

      await openServerItem(SERVER_ITEM);

      expect(engageServerInApp).toHaveBeenCalledWith("tok", 7, "open");
      expect(engageServerInApp).toHaveBeenCalledWith("tok", 7, "click");
      expect(Linking.openURL).toHaveBeenCalledWith("https://example.com");
    });

    it("swallows engagement and browser failures for external targets", async () => {
      jest
        .mocked(resolveInAppOpenTarget)
        .mockReturnValue({ type: "external", value: "https://example.com" });
      jest.mocked(engageServerInApp).mockRejectedValue(new Error("offline"));
      jest.mocked(Linking.openURL).mockRejectedValueOnce(new Error("no handler"));

      await openServerItem(SERVER_ITEM);

      expect(engageServerInApp).toHaveBeenCalledTimes(2);
    });

    it("records a click before navigating to an admin announcement route", async () => {
      jest.mocked(resolveInAppOpenTarget).mockReturnValue({ type: "route", value: "/news" });

      await openServerItem({ ...SERVER_ITEM, kind: "admin_announcement" });

      expect(engageServerInApp).toHaveBeenCalledWith("tok", 7, "click");
      expect(mockRouter.push).toHaveBeenCalledWith("/news");
    });

    it("still navigates when admin announcement engagement fails", async () => {
      jest.mocked(resolveInAppOpenTarget).mockReturnValue({ type: "route", value: "/news" });
      jest.mocked(engageServerInApp).mockRejectedValue(new Error("offline"));

      await openServerItem({ ...SERVER_ITEM, kind: "admin_announcement" });

      expect(mockRouter.push).toHaveBeenCalledWith("/news");
    });

    it("does not record a click for non-announcement routes", async () => {
      jest.mocked(resolveInAppOpenTarget).mockReturnValue({ type: "route", value: "/stats" });

      await openServerItem(SERVER_ITEM);

      expect(engageServerInApp).toHaveBeenCalledTimes(1);
      expect(engageServerInApp).toHaveBeenCalledWith("tok", 7, "open");
    });
  });
});
