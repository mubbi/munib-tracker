import "reflect-metadata";
import { describe, expect, it } from "vitest";
import { DEV_JWT_SECRET } from "./env.schema";
import { parseCorsOrigins, validateEnvironment } from "./env.validation";

const STRONG_SECRET = "a".repeat(48);

/** Minimal production config that passes the class-validator decorators. */
function prodConfig(overrides: Record<string, unknown> = {}) {
  return {
    NODE_ENV: "production",
    DATABASE_TYPE: "postgres",
    JWT_SECRET: STRONG_SECRET,
    CORS_ORIGINS: "https://app.example.com",
    ...overrides,
  };
}

describe("validateEnvironment", () => {
  it("accepts dev/test defaults (insecure JWT secret allowed outside production)", () => {
    const env = validateEnvironment({ NODE_ENV: "test", DATABASE_TYPE: "sqlite" });
    expect(env.JWT_SECRET).toBe(DEV_JWT_SECRET);
  });

  it("rejects the development JWT secret in production", () => {
    expect(() => validateEnvironment(prodConfig({ JWT_SECRET: DEV_JWT_SECRET }))).toThrow(
      /JWT_SECRET/,
    );
  });

  it("rejects a too-short JWT secret in production", () => {
    expect(() => validateEnvironment(prodConfig({ JWT_SECRET: "short-secret" }))).toThrow(
      /at least 32/,
    );
  });

  it("accepts a strong unique JWT secret in production", () => {
    expect(() => validateEnvironment(prodConfig())).not.toThrow();
  });

  it("requires an explicit CORS allowlist in production", () => {
    expect(() => validateEnvironment(prodConfig({ CORS_ORIGINS: "" }))).toThrow(/CORS_ORIGINS/);
  });
});

describe("parseCorsOrigins", () => {
  it("denies (returns false) when unset so credentialed CORS never reflects an origin", () => {
    expect(parseCorsOrigins(undefined)).toBe(false);
    expect(parseCorsOrigins("")).toBe(false);
    expect(parseCorsOrigins("   ")).toBe(false);
  });

  it("returns the parsed allowlist when configured", () => {
    expect(parseCorsOrigins("https://a.com, https://b.com")).toEqual([
      "https://a.com",
      "https://b.com",
    ]);
  });
});
