import { SessionStore } from "@/auth/session-store";
import { installBrowser, useBrowser } from "@/test-support/browser";
import { buildStoredSession } from "@/test-support/fixtures/auth";
import { mockApiFetch } from "@/test-support/mocks/api-client";
import {
  mockNotificationsOs,
  mockNotificationsPlatform,
  resetSwitchableNotificationsPlatformMock,
} from "@/test-support/mocks/notifications-platform";
import { usePlatform } from "@/test-support/platform";

import {
  canRegisterWebPushToken,
  getExpoPushToken,
  registerExpoPushTokenWithApi,
  registerWebPushSubscriptionWithApi,
  unregisterPushTokenWithApi,
  unsubscribeWebPushSubscription,
} from "./register-push-token";

jest.mock(
  "@/lib/notifications/platform",
  () => require("@/test-support/mocks/notifications-platform").switchableNotificationsPlatformMock,
);

const mockUpsertPushToken = jest.fn(async () => undefined);
const mockRemovePushToken = jest.fn(async () => undefined);
jest.mock("@/lib/notifications-api", () => ({
  upsertPushToken: (...args: unknown[]) => mockUpsertPushToken(...(args as [])),
  removePushToken: (...args: unknown[]) => mockRemovePushToken(...(args as [])),
}));

jest.mock(
  "@munib-tracker/api-client",
  () => require("@/test-support/mocks/api-client").apiClientMock,
);

const SUBSCRIPTION = {
  endpoint: "https://push.example/abc",
  expirationTime: null,
  keys: { p256dh: "p256", auth: "auth" },
};

/** A service worker whose push manager has (or creates) `subscription`. */
function makeServiceWorker(existing: unknown = null, json: object = SUBSCRIPTION) {
  const subscription = { toJSON: () => json, unsubscribe: jest.fn(async () => true) };
  const pushManager = {
    getSubscription: jest.fn(async () => existing ?? null),
    subscribe: jest.fn(async () => subscription),
  };
  return { serviceWorker: { ready: Promise.resolve({ pushManager }) }, pushManager, subscription };
}

beforeEach(() => {
  resetSwitchableNotificationsPlatformMock();
  mockUpsertPushToken.mockClear();
  mockRemovePushToken.mockReset().mockResolvedValue(undefined);
  mockApiFetch.mockReset().mockResolvedValue({ publicKey: "BPublicKey_-" });
  jest.spyOn(SessionStore, "getDeviceId").mockResolvedValue("device-1");
  jest.spyOn(SessionStore, "get").mockResolvedValue(buildStoredSession());
});

describe("Expo push token (native)", () => {
  it("is null where local notifications are unsupported", async () => {
    mockNotificationsPlatform.expoGo = true;
    expect(await getExpoPushToken()).toBeNull();
  });

  it("skips registration without an access token", async () => {
    await registerExpoPushTokenWithApi(undefined);
    expect(mockUpsertPushToken).not.toHaveBeenCalled();
  });

  it("treats registration as best effort when the token cannot be read", async () => {
    await expect(registerExpoPushTokenWithApi("access")).resolves.toBeUndefined();
    expect(mockUpsertPushToken).not.toHaveBeenCalled();
  });
});

describe("unregisterPushTokenWithApi (sign-out)", () => {
  it("removes this install's token from the signing-out account", async () => {
    await unregisterPushTokenWithApi("access");
    expect(mockRemovePushToken).toHaveBeenCalledWith("access", { deviceId: "device-1" });
  });

  it("is best effort: no token, or a failing server, never throws", async () => {
    await unregisterPushTokenWithApi(undefined);
    expect(mockRemovePushToken).not.toHaveBeenCalled();
    mockRemovePushToken.mockRejectedValueOnce(new Error("offline"));
    await expect(unregisterPushTokenWithApi("access")).resolves.toBeUndefined();
  });
});

describe("canRegisterWebPushToken", () => {
  it("is false off the web", () => {
    expect(canRegisterWebPushToken()).toBe(false);
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });
    beforeEach(() => {
      mockNotificationsOs.current = "web";
    });

    describe("with push support", () => {
      useBrowser({ serviceWorker: {}, notification: { permission: "granted" }, pushManager: true });

      it("is true", () => {
        expect(canRegisterWebPushToken()).toBe(true);
      });
    });

    describe("without PushManager", () => {
      useBrowser({ serviceWorker: {}, notification: { permission: "granted" } });

      it("is false", () => {
        expect(canRegisterWebPushToken()).toBe(false);
      });
    });

    describe("without a service worker", () => {
      useBrowser({ notification: { permission: "granted" }, pushManager: true });

      it("is false", () => {
        expect(canRegisterWebPushToken()).toBe(false);
      });
    });
  });
});

describe("registerWebPushSubscriptionWithApi", () => {
  usePlatform({ OS: "web" });
  let worker: ReturnType<typeof makeServiceWorker>;
  let restoreBrowser: () => void = () => {};

  /** Installs the browser and clears the module's last-registered key. */
  async function setup({
    permission = "granted",
    existing = null as unknown,
    json = SUBSCRIPTION as object,
  } = {}) {
    worker = makeServiceWorker(existing, json);
    restoreBrowser = installBrowser({
      serviceWorker: worker.serviceWorker,
      notification: { permission },
      pushManager: true,
    });
    await unsubscribeWebPushSubscription();
  }

  beforeEach(() => {
    mockNotificationsOs.current = "web";
  });
  afterEach(() => restoreBrowser());

  it("subscribes with the VAPID key and upserts the subscription", async () => {
    await setup();
    const json = await registerWebPushSubscriptionWithApi("access");
    expect(json).toEqual(SUBSCRIPTION);
    expect(worker.pushManager.subscribe).toHaveBeenCalledWith(
      expect.objectContaining({
        userVisibleOnly: true,
        applicationServerKey: expect.any(Uint8Array),
      }),
    );
    expect(mockUpsertPushToken).toHaveBeenCalledWith(
      "access",
      expect.objectContaining({
        platform: "web",
        deviceId: "device-1",
        token: JSON.stringify(SUBSCRIPTION),
      }),
    );
  });

  it("reuses an existing subscription", async () => {
    await setup({ existing: { toJSON: () => SUBSCRIPTION } });
    await registerWebPushSubscriptionWithApi("access");
    expect(worker.pushManager.subscribe).not.toHaveBeenCalled();
  });

  it("does not upsert the same subscription twice", async () => {
    await setup();
    await registerWebPushSubscriptionWithApi("access");
    await registerWebPushSubscriptionWithApi("access");
    expect(mockUpsertPushToken).toHaveBeenCalledTimes(1);
  });

  it("returns null without an access token", async () => {
    await setup();
    expect(await registerWebPushSubscriptionWithApi(undefined)).toBeNull();
  });

  it("returns null until notifications are granted", async () => {
    await setup({ permission: "default" });
    expect(await registerWebPushSubscriptionWithApi("access")).toBeNull();
  });

  it("falls back to the bundled VAPID key, and gives up without one", async () => {
    await setup();
    mockApiFetch.mockRejectedValueOnce(new Error("offline"));
    expect(await registerWebPushSubscriptionWithApi("access")).toBeNull();
    expect(worker.pushManager.subscribe).not.toHaveBeenCalled();
  });

  it("returns null when the server has no VAPID key", async () => {
    await setup();
    mockApiFetch.mockResolvedValueOnce({ publicKey: "  " });
    expect(await registerWebPushSubscriptionWithApi("access")).toBeNull();
  });

  it("returns null for an incomplete subscription", async () => {
    await setup({ json: { endpoint: "https://push.example/abc", keys: {} } });
    expect(await registerWebPushSubscriptionWithApi("access")).toBeNull();
    expect(mockUpsertPushToken).not.toHaveBeenCalled();
  });

  it("returns null when the upsert fails", async () => {
    await setup();
    mockUpsertPushToken.mockRejectedValueOnce(new Error("500") as never);
    expect(await registerWebPushSubscriptionWithApi("access")).toBeNull();
  });

  it("unsubscribes the browser subscription", async () => {
    await setup({ existing: makeServiceWorker().subscription });
    const existing = (await worker.pushManager.getSubscription()) as { unsubscribe: jest.Mock };
    await unsubscribeWebPushSubscription();
    expect(existing.unsubscribe).toHaveBeenCalled();
  });
});
