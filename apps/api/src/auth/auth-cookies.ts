import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import type { CookieOptions, Request, Response } from "express";
import { DEV_JWT_SECRET } from "../config/env.schema";

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
  return {
    httpOnly: true,
    // Always Secure — browsers treat http://localhost as a secure context.
    secure: true,
    sameSite: "lax",
  };
}

/** 32-byte AES key derived from JWT_SECRET (dedicated purpose string). */
function cookieEncryptionKey(): Buffer {
  const secret = process.env.JWT_SECRET?.trim() || DEV_JWT_SECRET;
  return createHash("sha256").update(`auth-cookie:${secret}`).digest();
}

/**
 * Encrypt a session token before writing it to an HttpOnly cookie.
 * Format: `v1.<iv>.<tag>.<ciphertext>` (base64url parts).
 */
export function sealAuthCookieValue(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", cookieEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return ["v1", iv, cipher.getAuthTag(), encrypted]
    .map((part) => (typeof part === "string" ? part : part.toString("base64url")))
    .join(".");
}

/** Decrypt a sealed auth cookie value; returns null if malformed or tampered. */
export function openAuthCookieValue(sealed: string): string | null {
  const [version, iv, tag, encrypted] = sealed.split(".");
  if (version !== "v1" || !iv || !tag || !encrypted) {
    return null;
  }
  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      cookieEncryptionKey(),
      Buffer.from(iv, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(encrypted, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}

export function setRefreshTokenCookie(res: Response, refreshToken: string): void {
  res.cookie(REFRESH_TOKEN_COOKIE, sealAuthCookieValue(refreshToken), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: AUTH_COOKIE_PATH,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function setAccessTokenCookie(res: Response, accessToken: string): void {
  res.cookie(ACCESS_TOKEN_COOKIE, sealAuthCookieValue(accessToken), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: API_COOKIE_PATH,
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
  });
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
    return openAuthCookieValue(fromCookie.trim());
  }
  return null;
}

export function readRefreshTokenFromRequest(req: Request): string | null {
  const fromCookie = req.cookies?.[REFRESH_TOKEN_COOKIE];
  if (typeof fromCookie === "string" && fromCookie.trim()) {
    return openAuthCookieValue(fromCookie.trim());
  }
  return null;
}
