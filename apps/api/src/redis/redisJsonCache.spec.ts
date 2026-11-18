import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildFakeRedis, type FakeRedis } from "../test-support/redis";
import {
  appVersionPlatformConfigKey,
  authMeKey,
  cacheDel,
  cacheDelPattern,
  cacheGetJson,
  cacheSetJson,
  invalidateAppVersionCache,
  userActiveKey,
} from "./redisJsonCache";

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

/** A `scanIterator` that yields the given batches in order. */
function scanYielding(...batches: unknown[]) {
  return vi.fn(async function* () {
    for (const batch of batches) yield batch;
  });
}

describe("redisJsonCache", () => {
  beforeEach(() => {
    getRedisClient.mockReset();
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("REDIS_KEY_PREFIX", undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("key helpers", () => {
    it.each([
      [authMeKey("user-1"), "mt:test:auth:me:user-1"],
      [userActiveKey("user-1"), "mt:test:user:active:user-1"],
      [appVersionPlatformConfigKey("ios"), "mt:test:app_ver:cfg:ios"],
    ])("%s is namespaced", (key, expected) => {
      expect(key).toBe(expected);
    });
  });

  describe("when Redis is unavailable", () => {
    it.each([
      ["disabled", null],
      ["closed", { isOpen: false }],
    ])("cacheGetJson returns null (%s)", async (_label, overrides) => {
      setup(overrides);
      await expect(cacheGetJson("key")).resolves.toBeNull();
    });

    it.each([
      ["cacheSetJson", () => cacheSetJson("key", 1, 60)],
      ["cacheDel", () => cacheDel("a")],
      ["cacheDelPattern", () => cacheDelPattern("mt:*")],
    ])("%s does not touch a closed client", async (_label, run) => {
      const redis = setup({ isOpen: false });
      await run();
      expect(redis.set).not.toHaveBeenCalled();
      expect(redis.del).not.toHaveBeenCalled();
      expect(redis.scanIterator).not.toHaveBeenCalled();
    });

    it.each([
      ["cacheSetJson", () => cacheSetJson("key", 1, 60)],
      ["cacheDel", () => cacheDel("a")],
      ["cacheDelPattern", () => cacheDelPattern("mt:*")],
    ])("%s resolves when Redis is disabled", async (_label, run) => {
      setup(null);
      await expect(run()).resolves.toBeUndefined();
    });
  });

  describe("cacheGetJson", () => {
    it("parses JSON strings", async () => {
      setup({ get: vi.fn().mockResolvedValue(JSON.stringify({ ok: true })) });
      await expect(cacheGetJson<{ ok: boolean }>("key")).resolves.toEqual({ ok: true });
    });

    it.each([
      ["a missing key", vi.fn().mockResolvedValue(null)],
      ["a non-string value", vi.fn().mockResolvedValue({})],
      ["malformed JSON", vi.fn().mockResolvedValue("{nope")],
      ["a Redis failure", vi.fn().mockRejectedValue(new Error("redis down"))],
    ])("returns null for %s", async (_label, get) => {
      setup({ get });
      await expect(cacheGetJson("key")).resolves.toBeNull();
    });
  });

  describe("cacheSetJson", () => {
    it("writes JSON with a TTL", async () => {
      const redis = setup();
      await cacheSetJson("key", { ok: true }, 60);
      expect(redis.set).toHaveBeenCalledWith("key", JSON.stringify({ ok: true }), { EX: 60 });
    });

    it.each([0, -1])("skips writes when ttlSeconds is %i", async (ttl) => {
      const redis = setup();
      await cacheSetJson("key", { ok: true }, ttl);
      expect(redis.set).not.toHaveBeenCalled();
    });

    it("swallows write failures", async () => {
      setup({ set: vi.fn().mockRejectedValue(new Error("down")) });
      await expect(cacheSetJson("key", { a: 1 }, 30)).resolves.toBeUndefined();
    });
  });

  describe("cacheDel", () => {
    it("deletes the provided keys", async () => {
      const redis = setup();
      await cacheDel("a", "b");
      expect(redis.del).toHaveBeenCalledWith(["a", "b"]);
    });

    it("skips the call when no keys are given", async () => {
      const redis = setup();
      await cacheDel();
      expect(redis.del).not.toHaveBeenCalled();
    });

    it("swallows delete failures", async () => {
      setup({ del: vi.fn().mockRejectedValue(new Error("down")) });
      await expect(cacheDel("a")).resolves.toBeUndefined();
    });
  });

  describe("cacheDelPattern", () => {
    it("scans with the pattern and a batch size", async () => {
      const redis = setup();
      await cacheDelPattern("mt:test:x:*");
      expect(redis.scanIterator).toHaveBeenCalledWith({ MATCH: "mt:test:x:*", COUNT: 128 });
    });

    it("deletes array and single-key batches, skipping empty and non-string entries", async () => {
      const redis = setup({ scanIterator: scanYielding(["k1", "k2"], "k3", [], [42, "k4"]) });
      await cacheDelPattern("mt:*");
      expect(redis.del.mock.calls).toEqual([[["k1", "k2"]], [["k3"]], [["k4"]]]);
    });

    it("stops quietly when the scan fails mid-way", async () => {
      const redis = setup({
        scanIterator: vi.fn(async function* () {
          yield ["k1"];
          throw new Error("scan broke");
        }),
      });
      await expect(cacheDelPattern("mt:*")).resolves.toBeUndefined();
      expect(redis.del).toHaveBeenCalledWith(["k1"]);
    });
  });

  describe("invalidateAppVersionCache", () => {
    it("deletes one platform key without scanning", async () => {
      const redis = setup();
      await invalidateAppVersionCache("android");
      expect(redis.del).toHaveBeenCalledWith(["mt:test:app_ver:cfg:android"]);
      expect(redis.scanIterator).not.toHaveBeenCalled();
    });

    it("scans the whole app_ver namespace without a platform", async () => {
      const redis = setup({ scanIterator: scanYielding(["mt:test:app_ver:cfg:ios"]) });
      await invalidateAppVersionCache();
      expect(redis.scanIterator).toHaveBeenCalledWith({ MATCH: "mt:test:app_ver:*", COUNT: 128 });
      expect(redis.del).toHaveBeenCalledWith(["mt:test:app_ver:cfg:ios"]);
    });
  });
});
