import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  appVersionPlatformConfigKey,
  authMeKey,
  cacheDel,
  cacheGetJson,
  cacheSetJson,
  userActiveKey,
} from "./redisJsonCache";

const getRedisClient = vi.fn();

vi.mock("./redisClient", () => ({
  getRedisClient: () => getRedisClient(),
}));

describe("redisJsonCache", () => {
  beforeEach(() => {
    getRedisClient.mockReset();
    process.env.NODE_ENV = "test";
    delete process.env.REDIS_KEY_PREFIX;
  });

  describe("key helpers", () => {
    it("builds namespaced keys", () => {
      expect(authMeKey("user-1")).toBe("mt:test:auth:me:user-1");
      expect(userActiveKey("user-1")).toBe("mt:test:user:active:user-1");
      expect(appVersionPlatformConfigKey("ios")).toBe("mt:test:app_ver:cfg:ios");
    });
  });

  describe("cacheGetJson", () => {
    it("returns null when Redis is unavailable", async () => {
      getRedisClient.mockReturnValue(null);
      await expect(cacheGetJson("key")).resolves.toBeNull();
    });

    it("parses JSON strings from Redis", async () => {
      getRedisClient.mockReturnValue({
        isOpen: true,
        get: vi.fn().mockResolvedValue(JSON.stringify({ ok: true })),
      });

      await expect(cacheGetJson<{ ok: boolean }>("key")).resolves.toEqual({ ok: true });
    });

    it("returns null for missing keys and non-string values", async () => {
      getRedisClient.mockReturnValue({
        isOpen: true,
        get: vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({}),
      });

      await expect(cacheGetJson("missing")).resolves.toBeNull();
      await expect(cacheGetJson("bad")).resolves.toBeNull();
    });

    it("returns null when Redis get throws", async () => {
      getRedisClient.mockReturnValue({
        isOpen: true,
        get: vi.fn().mockRejectedValue(new Error("redis down")),
      });

      await expect(cacheGetJson("key")).resolves.toBeNull();
    });
  });

  describe("cacheSetJson", () => {
    it("no-ops when Redis is unavailable", async () => {
      getRedisClient.mockReturnValue(null);
      await expect(cacheSetJson("key", { ok: true }, 60)).resolves.toBeUndefined();
    });

    it("writes JSON with TTL", async () => {
      const set = vi.fn().mockResolvedValue("OK");
      getRedisClient.mockReturnValue({ isOpen: true, set });

      await cacheSetJson("key", { ok: true }, 60);

      expect(set).toHaveBeenCalledWith("key", JSON.stringify({ ok: true }), { EX: 60 });
    });

    it("skips writes when ttlSeconds is zero or negative", async () => {
      const set = vi.fn();
      getRedisClient.mockReturnValue({ isOpen: true, set });

      await cacheSetJson("key", { ok: true }, 0);
      await cacheSetJson("key", { ok: true }, -1);

      expect(set).not.toHaveBeenCalled();
    });
  });

  describe("cacheDel", () => {
    it("no-ops when Redis is unavailable or keys are empty", async () => {
      getRedisClient.mockReturnValue(null);
      await expect(cacheDel()).resolves.toBeUndefined();
    });

    it("deletes provided keys", async () => {
      const del = vi.fn().mockResolvedValue(1);
      getRedisClient.mockReturnValue({ isOpen: true, del });

      await cacheDel("a", "b");

      expect(del).toHaveBeenCalledWith(["a", "b"]);
    });
  });
});
