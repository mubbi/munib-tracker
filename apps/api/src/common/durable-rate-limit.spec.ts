import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isRateLimited, resetMemoryRateLimits } from "./durable-rate-limit";

vi.mock("../redis/redisClient", () => ({
  getRedisClient: vi.fn(() => null),
}));

describe("durable-rate-limit (memory path)", () => {
  beforeEach(() => {
    resetMemoryRateLimits();
  });

  afterEach(() => {
    resetMemoryRateLimits();
  });

  it("allows requests up to the limit then blocks", async () => {
    const options = { key: "test:user-1", limit: 3, windowMs: 60_000 };

    expect(await isRateLimited(options)).toBe(false);
    expect(await isRateLimited(options)).toBe(false);
    expect(await isRateLimited(options)).toBe(false);
    expect(await isRateLimited(options)).toBe(true);
  });

  it("resetMemoryRateLimits clears buckets", async () => {
    const options = { key: "test:user-2", limit: 1, windowMs: 60_000 };

    expect(await isRateLimited(options)).toBe(false);
    expect(await isRateLimited(options)).toBe(true);

    resetMemoryRateLimits();

    expect(await isRateLimited(options)).toBe(false);
  });
});
