import { afterEach, describe, expect, it, vi } from "vitest";
import { isLocalAuthBypassEnabled } from "./constants";

function stubDevBypass(overrides: Record<string, string | undefined> = {}) {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("VERCEL", "");
  vi.stubEnv("ADMIN_DEV_BYPASS_AUTH", "1");
  vi.stubEnv("ADMIN_URL", "http://localhost:3002");
  for (const [key, value] of Object.entries(overrides)) {
    vi.stubEnv(key, value ?? "");
  }
}

describe("isLocalAuthBypassEnabled", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is enabled only for local next dev with the flag on", () => {
    stubDevBypass();
    expect(isLocalAuthBypassEnabled()).toBe(true);
    stubDevBypass({ ADMIN_DEV_BYPASS_AUTH: "true", ADMIN_URL: "http://127.0.0.1:3002" });
    expect(isLocalAuthBypassEnabled()).toBe(true);
    stubDevBypass({ ADMIN_URL: "" });
    expect(isLocalAuthBypassEnabled()).toBe(true);
  });

  it("is never enabled outside NODE_ENV=development", () => {
    stubDevBypass({ NODE_ENV: "production" });
    expect(isLocalAuthBypassEnabled()).toBe(false);
    stubDevBypass({ NODE_ENV: "test" });
    expect(isLocalAuthBypassEnabled()).toBe(false);
  });

  it("is never enabled on Vercel", () => {
    stubDevBypass({ VERCEL: "1" });
    expect(isLocalAuthBypassEnabled()).toBe(false);
  });

  it("requires the explicit flag", () => {
    stubDevBypass({ ADMIN_DEV_BYPASS_AUTH: "" });
    expect(isLocalAuthBypassEnabled()).toBe(false);
    stubDevBypass({ ADMIN_DEV_BYPASS_AUTH: "0" });
    expect(isLocalAuthBypassEnabled()).toBe(false);
    stubDevBypass({ ADMIN_DEV_BYPASS_AUTH: "yes" });
    expect(isLocalAuthBypassEnabled()).toBe(false);
  });

  it("refuses when ADMIN_URL points at a public host", () => {
    stubDevBypass({ ADMIN_URL: "https://admin.munibtracker.app" });
    expect(isLocalAuthBypassEnabled()).toBe(false);
    stubDevBypass({ ADMIN_URL: "http://localhost.evil.test:3002" });
    expect(isLocalAuthBypassEnabled()).toBe(false);
    stubDevBypass({ ADMIN_URL: "not a url" });
    expect(isLocalAuthBypassEnabled()).toBe(false);
  });
});
