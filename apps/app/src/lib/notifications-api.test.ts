import { OFFICIAL_APP_WEB_ORIGIN } from "@munib-tracker/shared/constants";

import {
  engageServerInApp,
  fetchInAppNotifications,
  mapServerInAppNotification,
  markAllServerInAppRead,
  markServerInAppRead,
  resolveInAppOpenTarget,
  type ServerInAppNotification,
  upsertPushToken,
} from "@/lib/notifications-api";
import { buildInAppNotification } from "@/test-support/fixtures/in-app-notifications";
import { mockApiFetch } from "@/test-support/mocks/api-client";

jest.mock(
  "@munib-tracker/api-client",
  () => require("@/test-support/mocks/api-client").apiClientMock,
);

const TOKEN = "access-token";
const AUTH = { accessToken: TOKEN };

function buildServerRow(overrides: Partial<ServerInAppNotification> = {}): ServerInAppNotification {
  return {
    id: 7,
    kind: "admin_announcement",
    title: "Ramadan update",
    body: "New features",
    createdAt: "2026-03-01T00:00:00.000Z",
    ...overrides,
  };
}

beforeEach(() => {
  mockApiFetch.mockReset().mockResolvedValue({});
});

describe("mapServerInAppNotification", () => {
  it("maps a full server row", () => {
    const row = buildServerRow({
      subtitle: "Ops",
      routeData: { href: " /quran " },
      broadcastId: 3,
      readAt: "2026-03-02T00:00:00.000Z",
    });
    expect(mapServerInAppNotification(row)).toEqual({
      id: "server-7",
      serverId: 7,
      kind: "admin_announcement",
      title: "Ramadan update",
      body: "New features",
      subtitle: "Ops",
      route: "/quran",
      routeData: { href: " /quran " },
      broadcastId: 3,
      createdAt: "2026-03-01T00:00:00.000Z",
      readAt: "2026-03-02T00:00:00.000Z",
    });
  });

  it("nulls optional fields and leaves route empty without routeData", () => {
    expect(mapServerInAppNotification(buildServerRow())).toMatchObject({
      subtitle: null,
      route: undefined,
      routeData: null,
      broadcastId: null,
      readAt: null,
    });
  });

  it.each([
    ["a blank href", { href: "   " }],
    ["a non-string href", { href: 42 }],
  ])("has no route for %s", (_label, routeData) => {
    expect(mapServerInAppNotification(buildServerRow({ routeData })).route).toBeUndefined();
  });

  it.each(["reminder", "achievement", "system", "admin_announcement"])(
    "keeps the %s kind",
    (kind) => {
      expect(mapServerInAppNotification(buildServerRow({ kind })).kind).toBe(kind);
    },
  );

  it("maps unknown kinds to system", () => {
    expect(mapServerInAppNotification(buildServerRow({ kind: "promo" })).kind).toBe("system");
  });
});

describe("server calls", () => {
  it("fetches and maps the in-app inbox", async () => {
    mockApiFetch.mockResolvedValue({
      items: [buildServerRow({ id: 1 }), buildServerRow({ id: 2 })],
    });
    const items = await fetchInAppNotifications(TOKEN);
    expect(items.map((item) => item.id)).toEqual(["server-1", "server-2"]);
    expect(mockApiFetch).toHaveBeenCalledWith(
      { url: "/notifications/in-app", method: "GET" },
      AUTH,
    );
  });

  it("treats a missing items array as an empty inbox", async () => {
    await expect(fetchInAppNotifications(TOKEN)).resolves.toEqual([]);
  });

  it.each([
    [
      "marks one notification read",
      () => markServerInAppRead(TOKEN, 9),
      { url: "/notifications/in-app/9/read", method: "PATCH" },
    ],
    [
      "marks all notifications read",
      () => markAllServerInAppRead(TOKEN),
      { url: "/notifications/in-app/mark-all-read", method: "POST" },
    ],
    [
      "records engagement",
      () => engageServerInApp(TOKEN, 9, "click"),
      { url: "/notifications/in-app/9/engage", method: "POST", body: '{"action":"click"}' },
    ],
    [
      "upserts a push token",
      () => upsertPushToken(TOKEN, { token: "ExpoPushToken[x]", platform: "expo" }),
      {
        url: "/notifications/push-token",
        method: "PUT",
        body: '{"token":"ExpoPushToken[x]","platform":"expo"}',
      },
    ],
  ])("%s", async (_label, call, request) => {
    await call();
    expect(mockApiFetch).toHaveBeenCalledWith(request, AUTH);
  });

  it("omits the bearer token for web cookie sessions", async () => {
    await markAllServerInAppRead("cookie");
    expect(mockApiFetch).toHaveBeenCalledWith(expect.anything(), {});
  });
});

describe("resolveInAppOpenTarget", () => {
  const external = (externalUrl: unknown) =>
    buildInAppNotification({
      route: "/ignored",
      routeData: { action: "open_external_url", externalUrl },
    });

  it.each([
    [
      "an allow-listed external URL",
      external(` ${OFFICIAL_APP_WEB_ORIGIN}/news `),
      { type: "external", value: `${OFFICIAL_APP_WEB_ORIGIN}/news` },
    ],
    ["a non-allow-listed external URL", external("https://evil.example/x"), { type: "none" }],
    ["a non-string external URL", external(5), { type: "none" }],
    [
      "an in-app route",
      buildInAppNotification({ route: "/qibla" }),
      { type: "route", value: "/qibla" },
    ],
    [
      "a routeData href",
      buildInAppNotification({ routeData: { href: " /dua " } }),
      { type: "route", value: "/dua" },
    ],
    ["a non-string href", buildInAppNotification({ routeData: { href: 1 } }), { type: "none" }],
    ["no target", buildInAppNotification(), { type: "none" }],
  ])("resolves %s", (_label, item, expected) => {
    expect(resolveInAppOpenTarget(item)).toEqual(expected);
  });
});
