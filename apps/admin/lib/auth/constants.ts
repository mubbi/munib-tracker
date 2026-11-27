/** Edge-safe auth constants (no Node.js imports — safe for proxy). */
export const SESSION_COOKIE = "mt_admin_session";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

/** True when `ADMIN_URL` is unset or points at a loopback host (local `next dev`). */
function isLoopbackAdminUrl(raw: string | undefined): boolean {
  const value = raw?.trim();
  if (!value) return true;
  try {
    return LOOPBACK_HOSTS.has(new URL(value).hostname.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Local-only auth bypass (super_admin). Never on Vercel preview/prod.
 * Requires NODE_ENV=development, no VERCEL, ADMIN_DEV_BYPASS_AUTH=1|true, and an
 * `ADMIN_URL` that is unset or loopback — a `next dev` exposed on a public
 * hostname must never hand out a synthetic super_admin session.
 */
export function isLocalAuthBypassEnabled(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  if (process.env.VERCEL) return false;
  const flag = process.env.ADMIN_DEV_BYPASS_AUTH?.trim().toLowerCase();
  if (flag !== "1" && flag !== "true") return false;
  return isLoopbackAdminUrl(process.env.ADMIN_URL);
}
