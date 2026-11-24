import { describe, expect, it } from "vitest";
import { isAllowedWebPushEndpoint, parseWebPushSubscriptionTarget } from "./web-push-endpoint";

const KEYS = { p256dh: "p256", auth: "auth" };

describe("isAllowedWebPushEndpoint", () => {
  it.each([
    "https://fcm.googleapis.com/fcm/send/abc",
    "https://updates.push.services.mozilla.com/wpush/v2/abc",
    "https://web.push.apple.com/QAbc",
    "https://wns2-par02p.notify.windows.com/w/?token=abc",
  ])("accepts the push service %s", (endpoint) => {
    expect(isAllowedWebPushEndpoint(endpoint)).toBe(true);
  });

  it.each([
    ["plain http", "http://fcm.googleapis.com/fcm/send/abc"],
    ["a private IP", "https://10.0.0.5/push"],
    ["loopback", "https://localhost/push"],
    ["cloud metadata", "https://169.254.169.254/latest/meta-data"],
    ["an unknown host", "https://attacker.example/collect"],
    ["a look-alike suffix", "https://fcm.googleapis.com.attacker.example/x"],
    ["a bare suffix", "https://notify.windows.com/x"],
    ["a custom port", "https://fcm.googleapis.com:8443/fcm/send/abc"],
    ["credentials", "https://user:pass@fcm.googleapis.com/fcm/send/abc"],
    ["not a URL", "fcm.googleapis.com/fcm/send/abc"],
    ["a non-string", 42],
  ])("rejects %s", (_label, endpoint) => {
    expect(isAllowedWebPushEndpoint(endpoint)).toBe(false);
  });
});

describe("parseWebPushSubscriptionTarget", () => {
  it("returns the canonical subscription", () => {
    const raw = JSON.stringify({
      endpoint: "https://fcm.googleapis.com/fcm/send/abc",
      keys: KEYS,
      extra: "dropped",
    });
    expect(parseWebPushSubscriptionTarget(raw)).toEqual({
      endpoint: "https://fcm.googleapis.com/fcm/send/abc",
      expirationTime: null,
      keys: KEYS,
    });
  });

  it.each([
    ["non-JSON", "{nope"],
    ["missing keys", JSON.stringify({ endpoint: "https://fcm.googleapis.com/fcm/send/abc" })],
    ["a disallowed host", JSON.stringify({ endpoint: "https://10.0.0.1/x", keys: KEYS })],
  ])("returns null for %s", (_label, raw) => {
    expect(parseWebPushSubscriptionTarget(raw)).toBeNull();
  });
});
