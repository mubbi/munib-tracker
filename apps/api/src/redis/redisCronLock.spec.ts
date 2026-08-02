import { beforeEach, describe, expect, it, vi } from "vitest";
import { tryAcquireCronLock } from "./redisCronLock";

const getRedisClient = vi.fn();

vi.mock("./redisClient", () => ({
  getRedisClient: () => getRedisClient(),
}));

describe("tryAcquireCronLock", () => {
  beforeEach(() => {
    getRedisClient.mockReset();
  });

  it("returns true when Redis is unavailable", async () => {
    getRedisClient.mockReturnValue(null);
    await expect(tryAcquireCronLock("job", "2026-08-03T00:00:00Z", 60_000)).resolves.toBe(true);
  });

  it("returns true when lock is acquired (SET NX OK)", async () => {
    getRedisClient.mockReturnValue({
      isOpen: true,
      set: vi.fn().mockResolvedValue("OK"),
    });

    await expect(tryAcquireCronLock("job", "bucket-1", 60_000)).resolves.toBe(true);
  });

  it("returns false when another instance holds the lock (SET returns null)", async () => {
    getRedisClient.mockReturnValue({
      isOpen: true,
      set: vi.fn().mockResolvedValue(null),
    });

    await expect(tryAcquireCronLock("job", "bucket-1", 60_000)).resolves.toBe(false);
  });

  it("returns true when Redis set throws", async () => {
    getRedisClient.mockReturnValue({
      isOpen: true,
      set: vi.fn().mockRejectedValue(new Error("redis down")),
    });

    await expect(tryAcquireCronLock("job", "bucket-1", 60_000)).resolves.toBe(true);
  });
});
