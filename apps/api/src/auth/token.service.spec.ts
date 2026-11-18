import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { describe, expect, it, vi } from "vitest";
import { buildConfig } from "../test-support/oauth";
import { TokenService } from "./token.service";

const SECRET = "test-secret-value";

function setup(ttl: string | undefined = "15m") {
  const jwtService = new JwtService({ secret: SECRET });
  const service = new TokenService(jwtService, buildConfig({ JWT_ACCESS_TTL: ttl }));
  return { service, jwtService };
}

/** Encodes a JWT segment as base64url without padding. */
function b64url(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

describe("TokenService", () => {
  it("round-trips a signed HS256 access token", () => {
    const { service } = setup();
    const { token } = service.signAccessToken("user-1", "session-1");
    expect(service.verifyAccessToken(token)).toEqual({ sub: "user-1", sid: "session-1" });
  });

  it.each([
    ["15m", 900],
    ["2h", 7200],
  ])("reports the TTL for %s from the signed exp/iat claims", (ttl, seconds) => {
    const { service } = setup(ttl);
    expect(service.signAccessToken("u", "s").expiresIn).toBe(seconds);
  });

  it.each([
    ["15m", 900],
    ["2h", 7200],
    ["1d", 86_400],
    ["45", 45],
    [" 30s ", 30],
    ["soon", 900],
    [undefined, 900],
  ])("parses TTL %j as %is when the token has no exp/iat", (ttl, seconds) => {
    const { service, jwtService } = setup(ttl);
    vi.spyOn(jwtService, "sign").mockReturnValue("opaque");
    vi.spyOn(jwtService, "decode").mockReturnValue(null);
    expect(service.signAccessToken("u", "s")).toEqual({ token: "opaque", expiresIn: seconds });
  });

  it.each([
    // The classic JWT bypass: strip the signature and claim `alg: none`.
    [
      "an unsigned alg:none token",
      `${b64url({ alg: "none", typ: "JWT" })}.${b64url({ sub: "a", sid: "f" })}.`,
    ],
    [
      "a non-HS256 header",
      `${b64url({ alg: "HS512", typ: "JWT" })}.${b64url({ sub: "a", sid: "f" })}.deadbeef`,
    ],
    [
      "a different secret",
      new JwtService({ secret: "other" }).sign({ sub: "u", sid: "s" }, { algorithm: "HS256" }),
    ],
    [
      "a missing session claim",
      new JwtService({ secret: SECRET }).sign({ sub: "u" }, { algorithm: "HS256" }),
    ],
  ])("rejects %s", (_label, token) => {
    const { service } = setup();
    expect(() => service.verifyAccessToken(token)).toThrow(UnauthorizedException);
  });
});
