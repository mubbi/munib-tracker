import type { Request, Response } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  APPLE_OAUTH_SESSION_COOKIE,
  clearAppleOAuthSessionCookie,
  readAppleOAuthSessionCookie,
  setAppleOAuthSessionCookie,
} from "./apple-oauth-session-cookie";

function mockResponse() {
  const res = {
    cookie: vi.fn(),
    clearCookie: vi.fn(),
  };
  return res as unknown as Response & { cookie: ReturnType<typeof vi.fn> };
}

function mockRequest(cookies: Record<string, string> = {}) {
  return { cookies } as unknown as Request;
}

describe("apple-oauth-session-cookie", () => {
  const prevNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = prevNodeEnv;
  });

  it("sets a sealed JSON session cookie", () => {
    process.env.NODE_ENV = "development";
    const res = mockResponse();
    const payload = {
      codeVerifier: "verifier-123",
      redirectUri: "https://app.example/callback",
      returnUrl: "https://app.example/login",
    };

    setAppleOAuthSessionCookie(res, payload);

    expect(res.cookie).toHaveBeenCalledWith(
      APPLE_OAUTH_SESSION_COOKIE,
      JSON.stringify(payload),
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/api/v1/auth",
      }),
    );
  });

  it("clears the session cookie", () => {
    process.env.NODE_ENV = "production";
    const res = mockResponse();

    clearAppleOAuthSessionCookie(res);

    expect(res.clearCookie).toHaveBeenCalledWith(
      APPLE_OAUTH_SESSION_COOKIE,
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/api/v1/auth",
      }),
    );
  });

  it("reads and trims a valid session cookie", () => {
    const req = mockRequest({
      [APPLE_OAUTH_SESSION_COOKIE]: JSON.stringify({
        codeVerifier: "  verifier  ",
        redirectUri: " https://app.example/callback ",
        returnUrl: " https://app.example/login ",
      }),
    });

    expect(readAppleOAuthSessionCookie(req)).toEqual({
      codeVerifier: "verifier",
      redirectUri: "https://app.example/callback",
      returnUrl: "https://app.example/login",
    });
  });

  it("returns null for missing cookie", () => {
    expect(readAppleOAuthSessionCookie(mockRequest())).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    const req = mockRequest({ [APPLE_OAUTH_SESSION_COOKIE]: "{not-json" });
    expect(readAppleOAuthSessionCookie(req)).toBeNull();
  });

  it("returns null when required fields are missing or empty", () => {
    expect(
      readAppleOAuthSessionCookie(
        mockRequest({
          [APPLE_OAUTH_SESSION_COOKIE]: JSON.stringify({
            codeVerifier: "",
            redirectUri: "https://app.example/callback",
            returnUrl: "https://app.example/login",
          }),
        }),
      ),
    ).toBeNull();

    expect(
      readAppleOAuthSessionCookie(
        mockRequest({
          [APPLE_OAUTH_SESSION_COOKIE]: JSON.stringify({
            redirectUri: "https://app.example/callback",
            returnUrl: "https://app.example/login",
          }),
        }),
      ),
    ).toBeNull();
  });
});
