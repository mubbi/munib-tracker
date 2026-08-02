import { afterEach, describe, expect, it } from "vitest";
import { redisNamespace } from "./cacheKeys";

describe("redisNamespace", () => {
  const prevPrefix = process.env.REDIS_KEY_PREFIX;
  const prevNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    if (prevPrefix === undefined) {
      delete process.env.REDIS_KEY_PREFIX;
    } else {
      process.env.REDIS_KEY_PREFIX = prevPrefix;
    }
    process.env.NODE_ENV = prevNodeEnv;
  });

  it("uses REDIS_KEY_PREFIX when set", () => {
    process.env.REDIS_KEY_PREFIX = "staging";
    expect(redisNamespace()).toBe("mt:staging");
  });

  it("falls back to NODE_ENV when REDIS_KEY_PREFIX is unset", () => {
    delete process.env.REDIS_KEY_PREFIX;
    process.env.NODE_ENV = "test";
    expect(redisNamespace()).toBe("mt:test");
  });

  it("falls back to development when neither prefix nor NODE_ENV is set", () => {
    delete process.env.REDIS_KEY_PREFIX;
    delete process.env.NODE_ENV;
    expect(redisNamespace()).toBe("mt:development");
  });
});
