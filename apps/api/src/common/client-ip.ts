import type { Request } from "express";

/** Upper bound for `TRUST_PROXY_HOPS` — anything deeper is a misconfiguration. */
export const MAX_TRUST_PROXY_HOPS = 10;

/**
 * How many reverse-proxy hops in front of the API Express should trust when
 * resolving `req.ip` (`app.set("trust proxy", hops)` in `create-app.ts`).
 *
 * Deployment model (docs/PRODUCTION.md → "Client IP & rate limits"): production
 * runs as a Vercel function behind exactly ONE trusted hop — Vercel's edge, which
 * overwrites `X-Forwarded-For` with the real client address. So on Vercel
 * (`VERCEL` is set at build and runtime) we trust 1 hop. `TRUST_PROXY_HOPS`
 * overrides this for other hosts (e.g. `1` behind Fly's proxy, `2` behind
 * Cloudflare → load balancer, `0` to disable). Local `pnpm dev:api` talks to
 * clients directly, so it trusts nothing and `req.ip` is the socket address.
 */
export function trustProxyHops(env: NodeJS.ProcessEnv = process.env): number {
  const raw = env.TRUST_PROXY_HOPS?.trim();
  if (raw) {
    const hops = Number(raw);
    if (Number.isInteger(hops) && hops >= 0 && hops <= MAX_TRUST_PROXY_HOPS) return hops;
  }
  return env.VERCEL ? 1 : 0;
}

/**
 * Client address for per-IP rate limits and abuse keys. Never log it.
 *
 * The FIRST `X-Forwarded-For` value is whatever the client sent, so keying a
 * limit on it lets one client pose as unlimited others. Instead:
 *
 * 1. When Express `trust proxy` is configured (production — see
 *    {@link trustProxyHops}), `req.ip` already walks exactly the trusted hops
 *    from the right — use it.
 * 2. Otherwise the right-most `X-Forwarded-For` hop: the address our nearest
 *    proxy saw and appended, which a client cannot forge. (Vercel's edge
 *    overwrites the header with the client address, so there it is the only
 *    hop.)
 * 3. No header (direct connection): the socket address.
 */
export function clientIp(req: Request): string {
  const trust = typeof req.app?.get === "function" ? req.app.get("trust proxy") : undefined;
  if (trust) return req.ip?.trim() || "unknown";

  const header = req.headers["x-forwarded-for"];
  const values = Array.isArray(header) ? header : header ? [header] : [];
  const hops = values
    .flatMap((value) => value.split(","))
    .map((hop) => hop.trim())
    .filter(Boolean);
  const nearest = hops[hops.length - 1];
  if (nearest) return nearest;
  return req.ip?.trim() || req.socket?.remoteAddress?.trim() || "unknown";
}
