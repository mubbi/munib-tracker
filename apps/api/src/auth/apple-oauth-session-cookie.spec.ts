import { afterEach, describe, expect, it } from "vitest";
import { buildRequest, buildResponse } from "../test-support/http";
import {
  APPLE_OAUTH_SESSION_COOKIE,
  clearAppleOAuthSessionCookie,
  readAppleOAuthSessionCookie,
  setAppleOAuthSessionCookie,
} from "./apple-oauth-session-cookie";

const PAYLOAD = {
  codeVerifier: "verifier-123",
  redirectUri: "https://app.example/callback",
  returnUrl: "https://app.example/login",
};

function requestWithCookie(value?: string) {
  return buildRequest({
    cookies: value === undefined ? {} : { [APPLE_OAUTH_SESSION_COOKIE]: value },
  });
}

describe("apple-oauth-session-cookie", () => {
  const prevNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = prevNodeEnv;
  });

  // Apple form_post is a cross-site POST, so production needs SameSite=None.
  it.each([
    ["development", "lax"],
    ["production", "none"],
  ])("sets the JSON session cookie in %s with SameSite=%s", (nodeEnv, sameSite) => {
    process.env.NODE_ENV = nodeEnv;
    const res = buildResponse();
    setAppleOAuthSessionCookie(res, PAYLOAD);
    expect(res.cookie).toHaveBeenCalledWith(APPLE_OAUTH_SESSION_COOKIE, JSON.stringify(PAYLOAD), {
      httpOnly: true,
      secure: true,
      sameSite,
      path: "/api/v1/auth",
      maxAge: 10 * 60 * 1000,
    });
  });

  it("clears the session cookie with matching options and no maxAge", () => {
    process.env.NODE_ENV = "production";
    const res = buildResponse();
    clearAppleOAuthSessionCookie(res);
    expect(res.clearCookie).toHaveBeenCalledWith(APPLE_OAUTH_SESSION_COOKIE, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/api/v1/auth",
    });
  });

  it("reads and trims a valid session cookie", () => {
    const req = requestWithCookie(
      JSON.stringify({
        codeVerifier: "  verifier  ",
        redirectUri: " https://app.example/callback ",
        returnUrl: " https://app.example/login ",
      }),
    );
    expect(readAppleOAuthSessionCookie(req)).toEqual({
      codeVerifier: "verifier",
      redirectUri: "https://app.example/callback",
      returnUrl: "https://app.example/login",
    });
  });

  it.each([
    ["a missing cookie", undefined],
    ["a blank cookie", "  "],
    ["invalid JSON", "{not-json"],
    ["an empty codeVerifier", JSON.stringify({ ...PAYLOAD, codeVerifier: "" })],
    ["a missing codeVerifier", JSON.stringify({ ...PAYLOAD, codeVerifier: undefined })],
    ["a blank redirectUri", JSON.stringify({ ...PAYLOAD, redirectUri: " " })],
    ["a non-string returnUrl", JSON.stringify({ ...PAYLOAD, returnUrl: 1 })],
  ])("returns null for %s", (_label, value) => {
    expect(readAppleOAuthSessionCookie(requestWithCookie(value))).toBeNull();
  });
});
