import { UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { readAccessTokenFromRequest } from "./auth-cookies";

/**
 * Resolve the access JWT from either an Authorization Bearer header or the
 * HttpOnly `mt_access_token` cookie (web cookie sessions).
 *
 * The literal `"cookie"` marker used by the Expo web client must never be
 * treated as a JWT — fall through to the real cookie instead.
 */
export function resolveAccessToken(req: Request, authorization?: string): string {
  if (authorization?.startsWith("Bearer ")) {
    const bearer = authorization.slice("Bearer ".length).trim();
    if (bearer && bearer !== "cookie") {
      return bearer;
    }
  }
  const fromCookie = readAccessTokenFromRequest(req);
  if (fromCookie) return fromCookie;
  throw new UnauthorizedException("Missing bearer token");
}
