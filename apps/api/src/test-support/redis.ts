import { type Mock, vi } from "vitest";

/**
 * In-memory stand-in for the node-redis client returned by `getRedisClient()`.
 * Specs still `vi.mock("…/redis/redisClient")` themselves (hoisting is per file)
 * and return this from the mocked getter.
 */
export type FakeRedis = {
  isOpen: boolean;
  get: Mock;
  set: Mock;
  del: Mock;
  incr: Mock;
  expire: Mock;
  ttl: Mock;
  scanIterator: Mock;
};

export function buildFakeRedis(overrides: Partial<FakeRedis> = {}): FakeRedis {
  return {
    isOpen: true,
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue("OK"),
    del: vi.fn().mockResolvedValue(1),
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(true),
    ttl: vi.fn().mockResolvedValue(60),
    scanIterator: vi.fn(async function* () {}),
    ...overrides,
  };
}
