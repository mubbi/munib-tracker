import { UnauthorizedException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { beforeEach, describe, expect, it } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { TokenService } from "./token.service";

const SECRET = "test-secret-value";

function makeTokenService(): TokenService {
  const jwtService = new JwtService({ secret: SECRET });
  const configService = {
    get: (key: string) => (key === "JWT_ACCESS_TTL" ? "15m" : undefined),
  } as unknown as ConfigService<EnvironmentVariables, true>;
  return new TokenService(jwtService, configService);
}

/** Encodes a JWT segment as base64url without padding. */
function b64url(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

describe("TokenService", () => {
  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = makeTokenService();
  });

  it("round-trips a signed HS256 access token", () => {
    const { token, expiresIn } = tokenService.signAccessToken("user-1", "session-1");
    expect(expiresIn).toBeGreaterThan(0);
    const claims = tokenService.verifyAccessToken(token);
    expect(claims).toEqual({ sub: "user-1", sid: "session-1" });
  });

  it("rejects an unsigned `alg: none` token", () => {
    // The classic JWT bypass: strip the signature and claim `alg: none`.
    const header = b64url({ alg: "none", typ: "JWT" });
    const payload = b64url({ sub: "attacker", sid: "forged" });
    const forged = `${header}.${payload}.`;

    expect(() => tokenService.verifyAccessToken(forged)).toThrow(UnauthorizedException);
  });

  it("rejects a token whose header advertises a non-HS256 algorithm", () => {
    const header = b64url({ alg: "HS512", typ: "JWT" });
    const payload = b64url({ sub: "attacker", sid: "forged" });
    const forged = `${header}.${payload}.deadbeef`;

    expect(() => tokenService.verifyAccessToken(forged)).toThrow(UnauthorizedException);
  });

  it("rejects a token signed with a different secret", () => {
    const otherSigner = new JwtService({ secret: "a-different-secret" });
    const foreign = otherSigner.sign({ sub: "user-1", sid: "session-1" }, { algorithm: "HS256" });

    expect(() => tokenService.verifyAccessToken(foreign)).toThrow(UnauthorizedException);
  });
});
