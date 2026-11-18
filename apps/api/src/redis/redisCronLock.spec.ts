import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildFakeRedis, type FakeRedis } from "../test-support/redis";
import { tryAcquireCronLock } from "./redisCronLock";

const getRedisClient = vi.fn();

vi.mock("./redisClient", () => ({
  getRedisClient: () => getRedisClient(),
}));

/** Installs a fake client (or `null` for "Redis disabled") behind `getRedisClient()`. */
function setup(overrides: Partial<FakeRedis> | null = {}): FakeRedis {
  const redis = buildFakeRedis(overrides ?? {});
  getRedisClient.mockReturnValue(overrides === null ? null : redis);
  return redis;
}

const acquire = () => tryAcquireCronLock("job", "bucket-1", 60_000);

describe("tryAcquireCronLock", () => {
  beforeEach(() => {
    getRedisClient.mockReset();
  });

  it.each([
    ["Redis is disabled", null, true],
    ["the client is closed", { isOpen: false }, true],
    ["SET NX succeeds", { set: vi.fn().mockResolvedValue("OK") }, true],
    ["another instance holds the lock", { set: vi.fn().mockResolvedValue(null) }, false],
    ["SET throws", { set: vi.fn().mockRejectedValue(new Error("redis down")) }, true],
  ])("%s → %s", async (_label, overrides, expected) => {
    setup(overrides);
    await expect(acquire()).resolves.toBe(expected);
  });

  it("does not touch a closed client", async () => {
    const redis = setup({ isOpen: false });
    await acquire();
    expect(redis.set).not.toHaveBeenCalled();
  });

  it("sets a namespaced NX key with the given TTL", async () => {
    const redis = setup();
    await tryAcquireCronLock("digest", "2026-08-03", 5_000);
    expect(redis.set).toHaveBeenCalledWith(
      expect.stringMatching(/^mt:[^:]+:cron:lock:digest:2026-08-03$/),
      "1",
      { PX: 5_000, NX: true },
    );
  });
});
