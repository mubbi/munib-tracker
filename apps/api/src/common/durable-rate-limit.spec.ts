import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildFakeRedis, type FakeRedis } from "../test-support/redis";
import {
  assertWithinRateLimit,
  isRateLimited,
  MEMORY_SWEEP_THRESHOLD,
  resetMemoryRateLimits,
} from "./durable-rate-limit";

const getRedisClient = vi.fn();

vi.mock("../redis/redisClient", () => ({
  getRedisClient: () => getRedisClient(),
}));

/** Installs a fake client (or `null` for "Redis disabled") behind `getRedisClient()`. */
function setup(overrides: Partial<FakeRedis> | null = {}): FakeRedis {
  const redis = buildFakeRedis(overrides ?? {});
  getRedisClient.mockReturnValue(overrides === null ? null : redis);
  return redis;
}

/** Calls `isRateLimited` `times` times and returns each verdict. */
async function hit(options: { key: string; limit: number; windowMs: number }, times: number) {
  const verdicts: boolean[] = [];
  for (let i = 0; i < times; i++) verdicts.push(await isRateLimited(options));
  return verdicts;
}

describe("isRateLimited", () => {
  beforeEach(() => {
    getRedisClient.mockReset();
    resetMemoryRateLimits();
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("REDIS_KEY_PREFIX", undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  describe("memory path", () => {
    it("allows requests up to the limit then blocks", async () => {
      setup(null);
      await expect(hit({ key: "m:1", limit: 3, windowMs: 60_000 }, 4)).resolves.toEqual([
        false,
        false,
        false,
        true,
      ]);
    });

    it("resetMemoryRateLimits clears buckets", async () => {
      setup(null);
      const options = { key: "m:2", limit: 1, windowMs: 60_000 };
      await hit(options, 2);
      resetMemoryRateLimits();
      await expect(isRateLimited(options)).resolves.toBe(false);
    });

    it("starts a fresh window once the previous one expires", async () => {
      setup(null);
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      const options = { key: "m:3", limit: 1, windowMs: 1_000 };
      await hit(options, 2);

      vi.setSystemTime(new Date("2026-01-01T00:00:01Z"));

      await expect(isRateLimited(options)).resolves.toBe(false);
    });

    it("sweeps expired buckets once the map reaches the threshold", async () => {
      setup(null);
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      for (let i = 0; i < MEMORY_SWEEP_THRESHOLD; i++) {
        await isRateLimited({ key: `sweep:${i}`, limit: 1, windowMs: 1_000 });
      }
      const live = { key: "sweep:live", limit: 1, windowMs: 60_000 };
      vi.setSystemTime(new Date("2026-01-01T00:00:00.500Z"));
      await isRateLimited(live);

      // Old windows expired: the next hit sweeps them, but live buckets keep counting.
      vi.setSystemTime(new Date("2026-01-01T00:00:02Z"));
      await expect(isRateLimited(live)).resolves.toBe(true);
      await expect(isRateLimited({ key: "sweep:0", limit: 1, windowMs: 1_000 })).resolves.toBe(
        false,
      );
    });

    it("is used when the client is closed", async () => {
      const redis = setup({ isOpen: false });
      await isRateLimited({ key: "m:4", limit: 1, windowMs: 60_000 });
      expect(redis.incr).not.toHaveBeenCalled();
    });
  });

  describe("Redis path", () => {
    it("blocks once the Redis counter exceeds the limit", async () => {
      setup({ incr: vi.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(2) });
      await expect(hit({ key: "r", limit: 1, windowMs: 60_000 }, 2)).resolves.toEqual([
        false,
        true,
      ]);
    });

    it("increments a namespaced key", async () => {
      const redis = setup();
      await isRateLimited({ key: "rl:user-1", limit: 2, windowMs: 1_500 });
      expect(redis.incr).toHaveBeenCalledWith("mt:test:rl:rl:user-1");
    });

    it.each([
      ["rounds the window up to whole seconds", 1_500, 2],
      ["enforces a 1s minimum TTL", 10, 1],
    ])("%s", async (_label, windowMs, ttlSeconds) => {
      const redis = setup();
      await isRateLimited({ key: "k", limit: 2, windowMs });
      expect(redis.expire).toHaveBeenCalledWith("mt:test:rl:k", ttlSeconds);
    });

    it("sets the TTL on the first hit only", async () => {
      const redis = setup({ incr: vi.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(2) });
      await hit({ key: "k", limit: 5, windowMs: 60_000 }, 2);
      expect(redis.expire).toHaveBeenCalledTimes(1);
    });

    it("re-arms a TTL-less key when it refuses a caller", async () => {
      const redis = setup({
        incr: vi.fn().mockResolvedValue(3),
        ttl: vi.fn().mockResolvedValue(-1),
      });
      await expect(isRateLimited({ key: "stuck", limit: 2, windowMs: 60_000 })).resolves.toBe(true);
      expect(redis.expire).toHaveBeenCalledWith("mt:test:rl:stuck", 60);
    });

    it("leaves a key with a live TTL alone", async () => {
      const redis = setup({ incr: vi.fn().mockResolvedValue(3) });
      await isRateLimited({ key: "ok", limit: 2, windowMs: 60_000 });
      expect(redis.expire).not.toHaveBeenCalled();
    });

    it("coerces string counters", async () => {
      setup({ incr: vi.fn().mockResolvedValue("5") });
      await expect(isRateLimited({ key: "k", limit: 3, windowMs: 60_000 })).resolves.toBe(true);
    });

    it("falls back to memory when Redis errors", async () => {
      setup({ incr: vi.fn().mockRejectedValue(new Error("down")) });
      await expect(hit({ key: "fb", limit: 1, windowMs: 60_000 }, 2)).resolves.toEqual([
        false,
        true,
      ]);
    });

    it("falls back to memory when Redis closes between checks", async () => {
      const redis = buildFakeRedis();
      getRedisClient.mockReturnValueOnce(redis).mockReturnValueOnce(null);
      await expect(isRateLimited({ key: "race", limit: 1, windowMs: 60_000 })).resolves.toBe(false);
      expect(redis.incr).not.toHaveBeenCalled();
    });
  });
});

describe("assertWithinRateLimit", () => {
  beforeEach(() => {
    getRedisClient.mockReturnValue(null);
    resetMemoryRateLimits();
  });

  it("passes under quota and throws 429 with the message over it", async () => {
    const options = { key: "assert", limit: 1, windowMs: 60_000 };
    await expect(assertWithinRateLimit(options, "Slow down")).resolves.toBeUndefined();
    await expect(assertWithinRateLimit(options, "Slow down")).rejects.toMatchObject({
      message: "Slow down",
      status: 429,
    });
  });
});
