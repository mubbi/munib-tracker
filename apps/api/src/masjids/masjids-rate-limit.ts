import { createHash } from "node:crypto";
import { isRateLimited, resetMemoryRateLimits } from "../common/durable-rate-limit";

/**
 * Masjids proxy rate limits (NF-3.11).
 *
 * - Per client: keyed by a truncated SHA-256 of the client IP so no raw IP (and
 *   never a location) ends up in Redis keys. The IP comes from
 *   `clientIp()` (`common/client-ip.ts`: trusted hop, not the client-supplied first
 *   `X-Forwarded-For` value).
 * - Upstream budget: a global cap on Overpass calls, well under the public
 *   instances' guidance (~10,000 queries/day), so a burst of cold cells can
 *   never get the API banned. Over budget ⇒ the service serves stale/empty.
 * - Fairness (M10): each client may spend only a small share of that budget,
 *   charged before the global counters are touched — a client over its share
 *   gets cache-only answers and can't drain the budget for everyone else.
 *   Detail lookups have their own, smaller sub-budget, and refs never seen in
 *   a cached cell (unverified ids) a much smaller one again.
 */

const LIST_LIMIT = 60;
const DETAIL_LIMIT = 120;
const CLIENT_WINDOW_MS = 10 * 60 * 1000;
const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * 60 * 1000;

export const UPSTREAM_PER_MINUTE = 20;
export const UPSTREAM_PER_DAY = 5_000;
/** One client's share of the global budget: 20% of a minute, 2% of a day. */
export const CLIENT_UPSTREAM_PER_MINUTE = 4;
export const CLIENT_UPSTREAM_PER_DAY = 100;
/** Detail lookups' own slice of the global budget. */
export const DETAIL_UPSTREAM_PER_MINUTE = 8;
export const DETAIL_UPSTREAM_PER_DAY = 1_500;
/** Detail lookups for refs no cached cell listed (deep links to a cold masjid). */
export const UNVERIFIED_DETAIL_PER_CLIENT_DAY = 10;
export const UNVERIFIED_DETAIL_PER_DAY = 300;

/** What an upstream call is for — decides which sub-budgets it is charged to. */
export type UpstreamCall = "cell" | "detail" | "unverifiedDetail";

export function clientFingerprint(ip: string): string {
  return createHash("sha256").update(`masjids:${ip}`).digest("hex").slice(0, 16);
}

export function isMasjidListRateLimited(ip: string): Promise<boolean> {
  return isRateLimited({
    key: `masjids:list:${clientFingerprint(ip)}`,
    limit: LIST_LIMIT,
    windowMs: CLIENT_WINDOW_MS,
  });
}

export function isMasjidDetailRateLimited(ip: string): Promise<boolean> {
  return isRateLimited({
    key: `masjids:detail:${clientFingerprint(ip)}`,
    limit: DETAIL_LIMIT,
    windowMs: CLIENT_WINDOW_MS,
  });
}

type Counter = { key: string; limit: number; windowMs: number; scope: "client" | "global" };

/** Counters charged for one upstream call, most specific (per client) first. */
function countersFor(call: UpstreamCall, client: string | null): Counter[] {
  const counters: Counter[] = [];
  const fp = client != null ? clientFingerprint(client) : null;
  if (fp) {
    counters.push(
      {
        key: `masjids:upstream:client:${fp}:minute`,
        limit: CLIENT_UPSTREAM_PER_MINUTE,
        windowMs: MINUTE_MS,
        scope: "client",
      },
      {
        key: `masjids:upstream:client:${fp}:day`,
        limit: CLIENT_UPSTREAM_PER_DAY,
        windowMs: DAY_MS,
        scope: "client",
      },
    );
    if (call === "unverifiedDetail") {
      counters.push({
        key: `masjids:upstream:unverified:${fp}:day`,
        limit: UNVERIFIED_DETAIL_PER_CLIENT_DAY,
        windowMs: DAY_MS,
        scope: "client",
      });
    }
  }
  if (call === "unverifiedDetail") {
    counters.push({
      key: "masjids:upstream:unverified:day",
      limit: UNVERIFIED_DETAIL_PER_DAY,
      windowMs: DAY_MS,
      scope: "global",
    });
  }
  if (call !== "cell") {
    counters.push(
      {
        key: "masjids:upstream:detail:minute",
        limit: DETAIL_UPSTREAM_PER_MINUTE,
        windowMs: MINUTE_MS,
        scope: "global",
      },
      {
        key: "masjids:upstream:detail:day",
        limit: DETAIL_UPSTREAM_PER_DAY,
        windowMs: DAY_MS,
        scope: "global",
      },
    );
  }
  counters.push(
    {
      key: "masjids:upstream:minute",
      limit: UPSTREAM_PER_MINUTE,
      windowMs: MINUTE_MS,
      scope: "global",
    },
    { key: "masjids:upstream:day", limit: UPSTREAM_PER_DAY, windowMs: DAY_MS, scope: "global" },
  );
  return counters;
}

/**
 * Charges one upstream (Overpass) call, per-client share first. Returns null
 * when the call may go ahead, else which budget is spent (`client`: this
 * client's share — serve it from cache; `global`: everyone's budget). A
 * counter that refuses stops the walk, so a client over its share never
 * touches the shared counters. `client` null (internal callers) skips the
 * per-client share.
 */
export async function spendUpstreamBudget(
  call: UpstreamCall,
  client: string | null,
): Promise<"client" | "global" | null> {
  for (const counter of countersFor(call, client)) {
    if (await isRateLimited(counter)) return counter.scope;
  }
  return null;
}

/** True when the global Overpass budget is spent (counts this call when not). */
export async function isUpstreamBudgetExhausted(): Promise<boolean> {
  return (await spendUpstreamBudget("cell", null)) != null;
}

export function resetMasjidRateLimits(): void {
  resetMemoryRateLimits();
}
