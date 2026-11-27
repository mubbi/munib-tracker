import { describe, expect, it } from "vitest";
import { hashSessionToken, parseSessionClaims, SESSION_JWT_ALGORITHMS } from "./session-claims";

const TOK = "a".repeat(32) + "0123456789abcdef".repeat(2);

describe("parseSessionClaims", () => {
  const valid = { sessionId: 7, adminUserId: 3, email: "a@b.co", role: "support", tok: TOK };

  it("accepts a well-formed session payload", () => {
    expect(parseSessionClaims(valid)).toEqual(valid);
  });

  it("rejects legacy tokens without the per-session secret", () => {
    const { tok: _tok, ...legacy } = valid;
    expect(parseSessionClaims(legacy)).toBeNull();
    expect(parseSessionClaims({ ...valid, tok: "" })).toBeNull();
    expect(parseSessionClaims({ ...valid, tok: "not-hex" })).toBeNull();
  });

  it("rejects other JWTs signed with the same secret (OAuth state)", () => {
    expect(parseSessionClaims({ purpose: "google_oauth", iat: 1, exp: 2 })).toBeNull();
  });

  it("rejects non-integer or non-positive ids (bypass sessionId 0 is never a cookie)", () => {
    expect(parseSessionClaims({ ...valid, sessionId: 0 })).toBeNull();
    expect(parseSessionClaims({ ...valid, sessionId: 1.5 })).toBeNull();
    expect(parseSessionClaims({ ...valid, sessionId: "7" })).toBeNull();
    expect(parseSessionClaims({ ...valid, adminUserId: -1 })).toBeNull();
  });
});

describe("hashSessionToken", () => {
  it("is a stable SHA-256 hex digest", () => {
    expect(hashSessionToken("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });
});

describe("SESSION_JWT_ALGORITHMS", () => {
  it("pins HS256 only", () => {
    expect(SESSION_JWT_ALGORITHMS).toEqual(["HS256"]);
  });
});
