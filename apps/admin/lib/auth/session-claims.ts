import { createHash } from "node:crypto";
import type { AdminRole } from "@munib-tracker/db/schema";

/** Pin the JWT algorithm — never let the token header pick it. */
export const SESSION_JWT_ALGORITHMS = ["HS256"];

export type AdminSessionClaims = {
  sessionId: number;
  adminUserId: number;
  email: string;
  role: AdminRole;
  /** Raw per-session random token; its SHA-256 is `admin_sessions.token_hash`. */
  tok: string;
};

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Validate the verified JWT payload shape. Tokens minted before `tok` existed (or
 * any other JWT signed with the same secret, e.g. OAuth state) are rejected.
 */
export function parseSessionClaims(payload: Record<string, unknown>): AdminSessionClaims | null {
  const { sessionId, adminUserId, email, role, tok } = payload;
  if (
    typeof tok !== "string" ||
    !/^[0-9a-f]{64}$/.test(tok) ||
    typeof sessionId !== "number" ||
    !Number.isSafeInteger(sessionId) ||
    sessionId <= 0 ||
    typeof adminUserId !== "number" ||
    !Number.isSafeInteger(adminUserId) ||
    adminUserId <= 0 ||
    typeof email !== "string" ||
    typeof role !== "string"
  ) {
    return null;
  }
  return { sessionId, adminUserId, email, role: role as AdminRole, tok };
}
