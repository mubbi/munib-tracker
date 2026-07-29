import { describe, expect, it } from "vitest";
import { isValidWebPushSubscription } from "./web-push.js";

describe("isValidWebPushSubscription", () => {
  it("accepts a well-formed subscription", () => {
    expect(
      isValidWebPushSubscription({
        endpoint: "https://updates.push.services.mozilla.com/wpush/v2/abc",
        keys: { p256dh: "abc", auth: "def" },
      }),
    ).toBe(true);
  });

  it("rejects http endpoints and missing keys", () => {
    expect(
      isValidWebPushSubscription({
        endpoint: "http://example.com",
        keys: { p256dh: "abc", auth: "def" },
      }),
    ).toBe(false);
    expect(
      isValidWebPushSubscription({ endpoint: "https://x", keys: { p256dh: "", auth: "a" } }),
    ).toBe(false);
  });
});
