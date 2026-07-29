import type { CookieOptions, Request, Response } from "express";

export const REFRESH_TOKEN_COOKIE = "mt_refresh_token";
export const ACCESS_TOKEN_COOKIE = "mt_access_token";
export const WEB_CLIENT_HEADER = "x-munib-tracker-client";
export const CLIENT_PLATFORM_HEADER = "x-client-platform";

const AUTH_COOKIE_PATH = "/api/v1/auth";
const API_COOKIE_PATH = "/api/v1";
/** Matches typical JWT access token lifetime. */
const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;

export function isWebAuthClient(req: Request): boolean {
  const client = req.headers[WEB_CLIENT_HEADER];
  if (typeof client === "string" && client.trim().toLowerCase() === "web") {
    return true;
  }
  const platform = req.headers[CLIENT_PLATFORM_HEADER];
  return typeof platform === "string" && platform.trim().toLowerCase() === "web";
}

function cookieBase(): Pick<CookieOptions, "httpOnly" | "secure" | "sameSite"> {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  };
}

function refreshCookieOptions(): CookieOptions {
  return {
    ...cookieBase(),
    path: AUTH_COOKIE_PATH,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
}

function accessCookieOptions(): CookieOptions {
  return {
    ...cookieBase(),
    path: API_COOKIE_PATH,
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
  };
}

export function setRefreshTokenCookie(res: Response, refreshToken: string): void {
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshCookieOptions());
}

export function setAccessTokenCookie(res: Response, accessToken: string): void {
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessCookieOptions());
}

export function clearAccessTokenCookie(res: Response): void {
  res.clearCookie(ACCESS_TOKEN_COOKIE, {
    ...cookieBase(),
    path: API_COOKIE_PATH,
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    ...cookieBase(),
    path: AUTH_COOKIE_PATH,
  });
}

export function readAccessTokenFromRequest(req: Request): string | null {
  const fromCookie = req.cookies?.[ACCESS_TOKEN_COOKIE];
  if (typeof fromCookie === "string" && fromCookie.trim()) {
    return fromCookie.trim();
  }
  return null;
}

export function readRefreshTokenFromRequest(req: Request): string | null {
  const fromCookie = req.cookies?.[REFRESH_TOKEN_COOKIE];
  if (typeof fromCookie === "string" && fromCookie.trim()) {
    return fromCookie.trim();
  }
  return null;
}
