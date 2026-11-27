import { afterEach, describe, expect, it, vi } from "vitest";
import { isWeakSessionSecret } from "./env";

/** getAdminEnv() memoises outside development — load a fresh module per case. */
async function freshEnv() {
  vi.resetModules();
  return import("./env");
}

const STRONG = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";
const PLACEHOLDER = "change-me-to-a-long-random-string-at-least-32-chars";

function stubAuthEnv(secret: string, nodeEnv = "production") {
  vi.stubEnv("NODE_ENV", nodeEnv);
  vi.stubEnv("DATABASE_URL", "postgresql://localhost:5432/test");
  vi.stubEnv("GOOGLE_CLIENT_ID", "client-id");
  vi.stubEnv("GOOGLE_CLIENT_SECRET", "client-secret");
  vi.stubEnv("ADMIN_SESSION_SECRET", secret);
}

describe("isWeakSessionSecret", () => {
  it("flags placeholders, short and low-entropy values", () => {
    expect(isWeakSessionSecret(undefined)).toBe(true);
    expect(isWeakSessionSecret(PLACEHOLDER)).toBe(true);
    expect(isWeakSessionSecret("short")).toBe(true);
    expect(isWeakSessionSecret("a".repeat(64))).toBe(true);
    expect(isWeakSessionSecret("abababababababababababababababababab")).toBe(true);
  });

  it("accepts a random hex secret", () => {
    expect(isWeakSessionSecret(STRONG)).toBe(false);
  });
});

describe("session secret enforcement", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("refuses the .env.example placeholder in production", async () => {
    stubAuthEnv(PLACEHOLDER);
    const { requireAdminEnv, isAuthConfigured } = await freshEnv();
    expect(() => requireAdminEnv()).toThrow(/placeholder or too weak/);
    expect(isAuthConfigured()).toBe(false);
  });

  it("allows a strong secret in production", async () => {
    stubAuthEnv(STRONG);
    const { requireAdminEnv, isAuthConfigured } = await freshEnv();
    expect(requireAdminEnv().ADMIN_SESSION_SECRET).toBe(STRONG);
    expect(isAuthConfigured()).toBe(true);
  });

  it("tolerates the placeholder in local development", async () => {
    stubAuthEnv(PLACEHOLDER, "development");
    const { requireAdminEnv } = await freshEnv();
    expect(() => requireAdminEnv()).not.toThrow();
  });
});
