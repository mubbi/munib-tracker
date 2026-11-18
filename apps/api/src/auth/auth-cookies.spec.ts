import { afterEach, describe, expect, it } from "vitest";
import { buildRequest, buildResponse, type RequestOverrides } from "../test-support/http";
import {
  ACCESS_TOKEN_COOKIE,
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  isWebAuthClient,
  openAuthCookieValue,
  REFRESH_TOKEN_COOKIE,
  readAccessTokenFromRequest,
  readRefreshTokenFromRequest,
  sealAuthCookieValue,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "./auth-cookies";

const COOKIE_FLAGS = { httpOnly: true, secure: true, sameSite: "lax" };

describe("sealAuthCookieValue / openAuthCookieValue", () => {
  const prevSecret = process.env.JWT_SECRET;

  afterEach(() => {
    if (prevSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = prevSecret;
  });

  it("round-trips a token through seal/open", () => {
    const token = "eyJhbGciOiJIUzI1NiJ9.test-payload.sig";
    expect(openAuthCookieValue(sealAuthCookieValue(token))).toBe(token);
  });

  it("produces a versioned value that does not contain the token", () => {
    const sealed = sealAuthCookieValue("refresh-token-value");
    expect(sealed.startsWith("v1.")).toBe(true);
    expect(sealed).not.toContain("refresh-token-value");
  });

  it.each([["cleartext-jwt"], ["v1.bad"], ["v1.a.b.c"]])("rejects malformed value %j", (value) => {
    expect(openAuthCookieValue(value)).toBeNull();
  });

  it("rejects tampered ciphertext", () => {
    const parts = sealAuthCookieValue("refresh-token-value").split(".");
    parts[3] = Buffer.from("tampered").toString("base64url");
    expect(openAuthCookieValue(parts.join("."))).toBeNull();
  });

  it("cannot open a value sealed under a different JWT_SECRET", () => {
    process.env.JWT_SECRET = "secret-one";
    const sealed = sealAuthCookieValue("token");
    process.env.JWT_SECRET = "secret-two";
    expect(openAuthCookieValue(sealed)).toBeNull();
  });

  it("falls back to the dev secret when JWT_SECRET is blank", () => {
    process.env.JWT_SECRET = "   ";
    expect(openAuthCookieValue(sealAuthCookieValue("dev"))).toBe("dev");
  });
});

describe("isWebAuthClient", () => {
  it.each<[RequestOverrides["headers"], boolean]>([
    [{ "x-munib-tracker-client": " WEB " }, true],
    [{ "x-client-platform": "web" }, true],
    [{ "x-munib-tracker-client": "ios", "x-client-platform": "Web" }, true],
    [{ "x-munib-tracker-client": "ios" }, false],
    [{ "x-munib-tracker-client": ["web"] }, false],
    [{ "x-client-platform": "android" }, false],
    [{}, false],
  ])("treats headers %j as web=%s", (headers, expected) => {
    expect(isWebAuthClient(buildRequest({ headers }))).toBe(expected);
  });
});

describe("auth cookie writers", () => {
  it.each([
    [
      "refresh",
      setRefreshTokenCookie,
      REFRESH_TOKEN_COOKIE,
      "/api/v1/auth",
      30 * 24 * 60 * 60 * 1000,
    ],
    ["access", setAccessTokenCookie, ACCESS_TOKEN_COOKIE, "/api/v1", 15 * 60 * 1000],
  ])("sets the sealed %s cookie on its scoped path", (_label, write, name, path, maxAge) => {
    const res = buildResponse();
    write(res, "token-value");
    const [cookieName, value, options] = res.cookie.mock.calls[0] ?? [];
    expect(cookieName).toBe(name);
    expect(openAuthCookieValue(value)).toBe("token-value");
    expect(options).toEqual({ ...COOKIE_FLAGS, path, maxAge });
  });

  it.each([
    ["access", clearAccessTokenCookie, ACCESS_TOKEN_COOKIE, "/api/v1"],
    ["refresh", clearRefreshTokenCookie, REFRESH_TOKEN_COOKIE, "/api/v1/auth"],
  ])("clears the %s cookie on its scoped path", (_label, clear, name, path) => {
    const res = buildResponse();
    clear(res);
    expect(res.clearCookie).toHaveBeenCalledWith(name, { ...COOKIE_FLAGS, path });
  });
});

describe("auth cookie readers", () => {
  const readers = [
    ["access", readAccessTokenFromRequest, ACCESS_TOKEN_COOKIE],
    ["refresh", readRefreshTokenFromRequest, REFRESH_TOKEN_COOKIE],
  ] as const;

  it.each(readers)("opens a sealed %s cookie, trimming whitespace", (_label, read, name) => {
    const req = buildRequest({ cookies: { [name]: ` ${sealAuthCookieValue("t")} ` } });
    expect(read(req)).toBe("t");
  });

  it.each([
    ["no cookie jar", undefined],
    ["no auth cookies", {}],
    ["blank values", { [ACCESS_TOKEN_COOKIE]: "   ", [REFRESH_TOKEN_COOKIE]: "   " }],
    ["non-string values", { [ACCESS_TOKEN_COOKIE]: 1, [REFRESH_TOKEN_COOKIE]: 2 }],
    ["unsealed values", { [ACCESS_TOKEN_COOKIE]: "plain", [REFRESH_TOKEN_COOKIE]: "plain" }],
  ])("returns null for %s", (_label, cookies) => {
    const req = buildRequest({ cookies } as RequestOverrides);
    expect([readAccessTokenFromRequest(req), readRefreshTokenFromRequest(req)]).toEqual([
      null,
      null,
    ]);
  });
});
