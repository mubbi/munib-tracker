import { createHash, timingSafeEqual } from "node:crypto";
import { UnauthorizedException } from "@nestjs/common";

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Constant-time string comparison (hashing first so lengths never leak). */
export function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(digest(a), digest(b));
}

/**
 * Guards an internal cron endpoint with `Authorization: Bearer <secret>`.
 * `label` names the job in the 401 messages (label "surface push" → "Surface
 * push cron is not configured" / "Invalid surface push cron secret"). An unset
 * secret refuses every call so a missing env var can never open the endpoint.
 */
export function assertCronSecret(
  authorization: string | undefined,
  configuredSecret: string | undefined,
  label: string,
): void {
  const secret = configuredSecret?.trim();
  if (!secret) {
    const title = label.charAt(0).toUpperCase() + label.slice(1);
    throw new UnauthorizedException(`${title} cron is not configured`);
  }
  if (!authorization || !safeEqual(authorization, `Bearer ${secret}`)) {
    throw new UnauthorizedException(`Invalid ${label} cron secret`);
  }
}
