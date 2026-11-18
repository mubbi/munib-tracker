import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { buildRequest, TEST_ACCESS_TOKEN, TEST_BEARER } from "../test-support/http";
import { ACCESS_TOKEN_COOKIE, sealAuthCookieValue } from "./auth-cookies";
import { resolveAccessToken } from "./resolve-access-token";

function requestWithAccessCookie(value: string) {
  return buildRequest({ cookies: { [ACCESS_TOKEN_COOKIE]: value } });
}

describe("resolveAccessToken", () => {
  it("prefers a real Bearer token", () => {
    const req = requestWithAccessCookie(sealAuthCookieValue("cookie-jwt"));
    expect(resolveAccessToken(req, TEST_BEARER)).toBe(TEST_ACCESS_TOKEN);
  });

  it.each([
    ["Authorization is missing", undefined],
    ["the Bearer value is the web session marker", "Bearer cookie"],
    ["the Bearer value is blank", "Bearer   "],
    ["the scheme is not Bearer", "Basic abc"],
  ])("reads the sealed access cookie when %s", (_label, authorization) => {
    const req = requestWithAccessCookie(sealAuthCookieValue("cookie-jwt"));
    expect(resolveAccessToken(req, authorization)).toBe("cookie-jwt");
  });

  it("throws when neither Bearer nor cookie is present", () => {
    expect(() => resolveAccessToken(buildRequest())).toThrow(UnauthorizedException);
  });

  it("throws when the access cookie is cleartext or malformed", () => {
    expect(() => resolveAccessToken(requestWithAccessCookie("cleartext-jwt"))).toThrow(
      UnauthorizedException,
    );
  });
});
