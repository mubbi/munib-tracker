import { beforeEach, describe, expect, it, vi } from "vitest";

const webPushMock = vi.hoisted(() => ({
  sendNotification: vi.fn(),
  setVapidDetails: vi.fn(),
}));

vi.mock("web-push", () => webPushMock);

import type { SurfaceSendOptions } from "./types.js";
import {
  createWebPushSender,
  isAllowedWebPushEndpoint,
  isValidWebPushSubscription,
  type WebPushSenderConfig,
} from "./web-push.js";

const SUBSCRIPTION = {
  endpoint: "https://updates.push.services.mozilla.com/wpush/v2/abc",
  keys: { p256dh: "abc", auth: "def" },
};

const CONFIG: WebPushSenderConfig = {
  publicKey: "pub",
  privateKey: "priv",
  subject: "mailto:ops@example.com",
};

function setup(config: Partial<WebPushSenderConfig> = {}) {
  const sender = createWebPushSender({ ...CONFIG, ...config });
  const send = (
    target: string = JSON.stringify(SUBSCRIPTION),
    options?: SurfaceSendOptions,
    payload = "{}",
  ) => sender.send(target, payload, options);
  return { sender, send };
}

describe("isValidWebPushSubscription", () => {
  it("accepts a well-formed subscription", () => {
    expect(isValidWebPushSubscription(SUBSCRIPTION)).toBe(true);
  });

  it.each([
    ["null", null],
    ["a string", "https://x"],
    ["a non-string endpoint", { endpoint: 42 }],
    ["an http endpoint", { endpoint: "http://example.com", keys: SUBSCRIPTION.keys }],
    ["missing keys", { endpoint: "https://x" }],
    ["missing auth", { endpoint: "https://x", keys: { p256dh: "a" } }],
    ["empty p256dh", { endpoint: "https://x", keys: { p256dh: "", auth: "a" } }],
    ["empty auth", { endpoint: "https://x", keys: { p256dh: "a", auth: "" } }],
    [
      "an endpoint outside the push-service allowlist",
      { endpoint: "https://169.254.169.254/latest", keys: SUBSCRIPTION.keys },
    ],
  ])("rejects %s", (_label, value) => {
    expect(isValidWebPushSubscription(value)).toBe(false);
  });
});

describe("isAllowedWebPushEndpoint", () => {
  it.each([
    "https://fcm.googleapis.com/fcm/send/abc",
    "https://android.googleapis.com/gcm/send/abc",
    "https://updates.push.services.mozilla.com/wpush/v2/abc",
    "https://web.push.apple.com/QAbc",
    "https://wns2-par02p.notify.windows.com/w/?token=abc",
    "https://FCM.googleapis.com/fcm/send/abc",
  ])("accepts known push service %s", (endpoint) => {
    expect(isAllowedWebPushEndpoint(endpoint)).toBe(true);
  });

  it.each([
    ["a non-string", 42],
    ["an unparsable URL", "https://"],
    ["http", "http://fcm.googleapis.com/fcm/send/abc"],
    ["an explicit port", "https://fcm.googleapis.com:8443/fcm/send/abc"],
    ["credentials", "https://user:pw@fcm.googleapis.com/fcm/send/abc"],
    ["a metadata IP", "https://169.254.169.254/latest/meta-data"],
    ["localhost", "https://localhost/push"],
    ["an arbitrary host", "https://attacker.example/push"],
    ["a lookalike suffix", "https://evilfcm.googleapis.com.attacker.example/x"],
    ["a bare suffix", "https://notify.windows.com/x"],
    ["an over-long URL", `https://fcm.googleapis.com/${"a".repeat(2048)}`],
  ])("rejects %s", (_label, endpoint) => {
    expect(isAllowedWebPushEndpoint(endpoint)).toBe(false);
  });
});

describe("createWebPushSender", () => {
  beforeEach(() => {
    webPushMock.sendNotification.mockReset().mockResolvedValue({ statusCode: 201 });
    webPushMock.setVapidDetails.mockReset();
  });

  it("configures VAPID details and exposes the web_push channel", () => {
    const { sender } = setup();

    expect(sender.channel).toBe("web_push");
    expect(webPushMock.setVapidDetails).toHaveBeenCalledWith(
      "mailto:ops@example.com",
      "pub",
      "priv",
    );
  });

  it.each([
    ["malformed JSON", "{nope", "Malformed Web Push subscription"],
    [
      "an invalid subscription",
      JSON.stringify({ endpoint: "http://x", keys: SUBSCRIPTION.keys }),
      "Invalid Web Push subscription",
    ],
    [
      "an endpoint outside the push-service allowlist",
      JSON.stringify({ endpoint: "https://169.254.169.254/latest", keys: SUBSCRIPTION.keys }),
      "Web Push endpoint is not a known push service",
    ],
  ])("invalidates %s without sending", async (_label, target, reason) => {
    const { send } = setup();

    await expect(send(target)).resolves.toEqual({
      ok: false,
      reason,
      retryable: false,
      invalidateToken: true,
    });
    expect(webPushMock.sendNotification).not.toHaveBeenCalled();
  });

  it("sends with the default TTL and high urgency", async () => {
    const { send } = setup();

    await expect(
      send(JSON.stringify({ ...SUBSCRIPTION, expirationTime: null }), undefined, '{"phase":"x"}'),
    ).resolves.toEqual({ ok: true });
    expect(webPushMock.sendNotification).toHaveBeenCalledWith(
      { endpoint: SUBSCRIPTION.endpoint, keys: SUBSCRIPTION.keys },
      '{"phase":"x"}',
      { TTL: 86_400, urgency: "high" },
    );
  });

  it.each([
    [60, 60],
    [6_000, 600],
  ])("caps a per-send TTL of %i at the smaller of config and option", async (ttl, expected) => {
    const { send } = setup({ ttlSeconds: 600 });

    await send(undefined, { ttlSeconds: ttl });

    expect(webPushMock.sendNotification.mock.calls[0]?.[2]).toEqual({
      TTL: expected,
      urgency: "high",
    });
  });

  it.each([
    [404, { reason: "Subscription gone (404)", retryable: false, invalidateToken: true }],
    [410, { reason: "Subscription gone (410)", retryable: false, invalidateToken: true }],
    [429, { reason: "Transient Web Push failure (429)", retryable: true, invalidateToken: false }],
    [500, { reason: "Transient Web Push failure (500)", retryable: true, invalidateToken: false }],
    [400, { reason: "Bad request", retryable: false, invalidateToken: false }],
  ])("maps HTTP %i provider errors", async (statusCode, expected) => {
    webPushMock.sendNotification.mockRejectedValue(
      Object.assign(new Error("Bad request"), { statusCode }),
    );
    const { send } = setup();

    await expect(send()).resolves.toEqual({ ok: false, status: statusCode, ...expected });
  });

  it.each([
    [new Error("socket hang up"), "socket hang up"],
    ["weird", "Web Push send failed"],
  ])("returns a permanent failure for status-less error %s", async (error, reason) => {
    webPushMock.sendNotification.mockRejectedValue(error);
    const { send } = setup();

    await expect(send()).resolves.toEqual({
      ok: false,
      status: undefined,
      reason,
      retryable: false,
      invalidateToken: false,
    });
  });
});
