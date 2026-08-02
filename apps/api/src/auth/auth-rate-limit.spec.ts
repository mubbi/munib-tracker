import { beforeEach, describe, expect, it } from "vitest";
import { isAuthGuestRateLimited, resetAuthRateLimits } from "./auth-rate-limit";

describe("auth-rate-limit", () => {
  beforeEach(() => {
    resetAuthRateLimits();
  });

  it("allows up to 30 guest creations per window", async () => {
    for (let i = 0; i < 30; i++) {
      expect(await isAuthGuestRateLimited("192.0.2.1")).toBe(false);
    }
    expect(await isAuthGuestRateLimited("192.0.2.1")).toBe(true);
  });

  it("tracks identities independently", async () => {
    for (let i = 0; i < 30; i++) {
      expect(await isAuthGuestRateLimited("client-a")).toBe(false);
    }
    expect(await isAuthGuestRateLimited("client-a")).toBe(true);
    expect(await isAuthGuestRateLimited("client-b")).toBe(false);
  });
});
