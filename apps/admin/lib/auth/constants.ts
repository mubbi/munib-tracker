/** Edge-safe auth constants (no Node.js imports — safe for proxy). */
export const SESSION_COOKIE = "mt_admin_session";

/**
 * Local-only auth bypass (super_admin). Never on Vercel preview/prod.
 * Requires NODE_ENV=development, no VERCEL, and ADMIN_DEV_BYPASS_AUTH=1|true.
 */
export function isLocalAuthBypassEnabled(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  if (process.env.VERCEL) return false;
  const flag = process.env.ADMIN_DEV_BYPASS_AUTH?.trim().toLowerCase();
  return flag === "1" || flag === "true";
}
