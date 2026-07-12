import { afterEach, describe, expect, it } from "vitest";
import { getRedisHealth, isRedisConfigured } from "./redisClient";

describe("getRedisHealth", () => {
  const prevUrl = process.env.REDIS_URL;

  afterEach(() => {
    if (prevUrl === undefined) {
      delete process.env.REDIS_URL;
    } else {
      process.env.REDIS_URL = prevUrl;
    }
  });

  it("reports disabled when REDIS_URL is unset", () => {
    delete process.env.REDIS_URL;
    expect(isRedisConfigured()).toBe(false);
    expect(getRedisHealth()).toMatchObject({
      configured: false,
      connected: false,
      connectAttempts: 0,
      lastConnectAttemptAt: null,
      lastConnectAttemptAgeMs: null,
      lastConnectedAt: null,
      lastErrorAt: null,
    });
  });

  it("reports configured but not connected when URL is set", () => {
    process.env.REDIS_URL = "redis://localhost:6379";
    expect(isRedisConfigured()).toBe(true);
    expect(getRedisHealth()).toMatchObject({
      configured: true,
      connected: false,
    });
    expect(getRedisHealth().connectAttempts).toBeGreaterThanOrEqual(0);
  });
});
