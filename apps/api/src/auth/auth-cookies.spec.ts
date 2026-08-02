import { describe, expect, it } from "vitest";
import { openAuthCookieValue, sealAuthCookieValue } from "./auth-cookies";

describe("auth cookie sealing", () => {
  it("round-trips a token through seal/open", () => {
    const token = "eyJhbGciOiJIUzI1NiJ9.test-payload.sig";
    const sealed = sealAuthCookieValue(token);
    expect(sealed.startsWith("v1.")).toBe(true);
    expect(sealed).not.toContain(token);
    expect(openAuthCookieValue(sealed)).toBe(token);
  });

  it("rejects cleartext and malformed values", () => {
    expect(openAuthCookieValue("cleartext-jwt")).toBeNull();
    expect(openAuthCookieValue("v1.bad")).toBeNull();
    expect(openAuthCookieValue("v1.a.b.c")).toBeNull();
  });

  it("rejects tampered ciphertext", () => {
    const sealed = sealAuthCookieValue("refresh-token-value");
    const parts = sealed.split(".");
    parts[3] = Buffer.from("tampered").toString("base64url");
    expect(openAuthCookieValue(parts.join("."))).toBeNull();
  });
});
