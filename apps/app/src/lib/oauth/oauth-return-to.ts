import type { Href } from "expo-router";

/** Fallback after Android Custom Tab / App Link OAuth resume. */
export const OAUTH_RESUME_FALLBACK_HREF = "/profile" as const;

/**
 * Restrict OAuth resume navigation to in-app paths only.
 * Pending sessions may be restored after process death, so treat `returnTo` as untrusted.
 */
export function sanitizeOAuthReturnTo(value: unknown): Href {
  if (typeof value !== "string") return OAUTH_RESUME_FALLBACK_HREF;
  const path = value.trim();
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("://") ||
    path.includes("\\") ||
    path.length > 200
  ) {
    return OAUTH_RESUME_FALLBACK_HREF;
  }
  return path as Href;
}
