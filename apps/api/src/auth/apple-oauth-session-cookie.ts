import type { CookieOptions, Request, Response } from "express";

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
  res.cookie(APPLE_OAUTH_SESSION_COOKIE, JSON.stringify(payload), {
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
  const raw = req.cookies?.[APPLE_OAUTH_SESSION_COOKIE];
  if (typeof raw !== "string" || !raw.trim()) return null;
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
