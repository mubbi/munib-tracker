import { describe, expect, it } from "vitest";
import { isRedisCloudHost, normalizeRedisUrl, parseRedisTlsEnvFlag } from "./normalize-redis-url";

describe("normalizeRedisUrl", () => {
  it("keeps Redis Cloud redis:// as plaintext (TLS off in console)", () => {
    const input = "redis://default:secret@oceanic-main-jelly-57080.db.redis.io:15123";
    expect(normalizeRedisUrl(input)).toBe(input);
  });

  it("keeps rediss:// Redis Cloud URLs unchanged", () => {
    const input = "rediss://default:secret@host.db.redis.io:15123";
    expect(normalizeRedisUrl(input)).toBe(input);
  });

  it("leaves local redis:// unchanged", () => {
    expect(normalizeRedisUrl("redis://localhost:6379")).toBe("redis://localhost:6379");
  });

  it("forceTls true upgrades redis:// to rediss://", () => {
    const out = normalizeRedisUrl("redis://default:pw@host.db.redis.io:15123", {
      forceTls: true,
    });
    expect(out.startsWith("rediss://")).toBe(true);
  });

  it("forceTls false downgrades rediss:// to redis://", () => {
    const out = normalizeRedisUrl("rediss://default:pw@host.db.redis.io:15123", {
      forceTls: false,
    });
    expect(out.startsWith("redis://")).toBe(true);
  });
});

describe("parseRedisTlsEnvFlag", () => {
  it("parses common truthy/falsy values", () => {
    expect(parseRedisTlsEnvFlag(undefined)).toBeUndefined();
    expect(parseRedisTlsEnvFlag("")).toBeUndefined();
    expect(parseRedisTlsEnvFlag("true")).toBe(true);
    expect(parseRedisTlsEnvFlag("1")).toBe(true);
    expect(parseRedisTlsEnvFlag("false")).toBe(false);
    expect(parseRedisTlsEnvFlag("0")).toBe(false);
  });
});

describe("isRedisCloudHost", () => {
  it("detects Redis Cloud FQDNs", () => {
    expect(isRedisCloudHost("oceanic-main-jelly-57080.db.redis.io")).toBe(true);
    expect(isRedisCloudHost("foo.redislabs.com")).toBe(true);
    expect(isRedisCloudHost("localhost")).toBe(false);
  });
});
