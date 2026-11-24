import type { CookieOptions, Request, Response } from "express";
import { openAuthCookieValue, sealAuthCookieValue } from "./auth-cookies";

export const APPLE_OAUTH_SESSION_COOKIE = "mt_apple_oauth";

const SESSION_MAX_AGE_MS = 10 * 60 * 1000;

export type AppleOAuthSessionPayload = {
  codeVerifier: string;
  redirectUri: string;
  returnUrl: string;
};

function sessionCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  // Apple web OAuth uses response_mode=form_post: appleid.apple.com POSTs to this API.
  // SameSite=Lax cookies are not sent on cross-site POST, so the callback must use None+Secure.
  // Always set Secure so the cookie is never sent over clear-text HTTP.
  return {
    httpOnly: true,
    secure: true,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/v1/auth",
    maxAge: SESSION_MAX_AGE_MS,
  };
}

export function setAppleOAuthSessionCookie(res: Response, payload: AppleOAuthSessionPayload): void {
  // Inline flags so static analysis sees httpOnly + Secure on the cookie write.
  const options = sessionCookieOptions();
  // Sealed (AES-256-GCM, same key as the auth cookies) so the PKCE verifier is
  // not readable and a cookie planted from a sibling subdomain (cookie tossing)
  // cannot choose the verifier / redirect target the callback trusts.
  res.cookie(APPLE_OAUTH_SESSION_COOKIE, sealAuthCookieValue(JSON.stringify(payload)), {
    httpOnly: true,
    secure: true,
    sameSite: options.sameSite,
    path: options.path,
    maxAge: options.maxAge,
  });
}

export function clearAppleOAuthSessionCookie(res: Response): void {
  const { maxAge: _maxAge, ...options } = sessionCookieOptions();
  res.clearCookie(APPLE_OAUTH_SESSION_COOKIE, options);
}

export function readAppleOAuthSessionCookie(req: Request): AppleOAuthSessionPayload | null {
  const sealed = req.cookies?.[APPLE_OAUTH_SESSION_COOKIE];
  if (typeof sealed !== "string" || !sealed.trim()) return null;
  const raw = openAuthCookieValue(sealed.trim());
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AppleOAuthSessionPayload;
    if (
      typeof parsed.codeVerifier !== "string" ||
      !parsed.codeVerifier.trim() ||
      typeof parsed.redirectUri !== "string" ||
      !parsed.redirectUri.trim() ||
      typeof parsed.returnUrl !== "string" ||
      !parsed.returnUrl.trim()
    ) {
      return null;
    }
    return {
      codeVerifier: parsed.codeVerifier.trim(),
      redirectUri: parsed.redirectUri.trim(),
      returnUrl: parsed.returnUrl.trim(),
    };
  } catch {
    return null;
  }
}
