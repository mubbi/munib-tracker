import { UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { describe, expect, it } from "vitest";
import { ACCESS_TOKEN_COOKIE } from "./auth-cookies";
import { resolveAccessToken } from "./resolve-access-token";

function mockReq(cookies?: Record<string, string>): Request {
  return { cookies: cookies ?? {} } as Request;
}

describe("resolveAccessToken", () => {
  it("prefers a real Bearer token", () => {
    expect(resolveAccessToken(mockReq(), "Bearer real-jwt")).toBe("real-jwt");
  });

  it("reads the access cookie when Authorization is missing", () => {
    expect(resolveAccessToken(mockReq({ [ACCESS_TOKEN_COOKIE]: "cookie-jwt" }))).toBe("cookie-jwt");
  });

  it("ignores the web session marker Bearer cookie and falls back to the HttpOnly cookie", () => {
    expect(
      resolveAccessToken(mockReq({ [ACCESS_TOKEN_COOKIE]: "cookie-jwt" }), "Bearer cookie"),
    ).toBe("cookie-jwt");
  });

  it("throws when neither Bearer nor cookie is present", () => {
    expect(() => resolveAccessToken(mockReq())).toThrow(UnauthorizedException);
  });
});
