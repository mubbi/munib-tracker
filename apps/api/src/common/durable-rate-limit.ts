/**
 * Fixed-window rate limiting with optional Upstash Redis (durable on serverless)
 * and an in-memory fallback for local/dev when Redis is not configured.
 */

type Bucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, Bucket>();

export type RateLimitOptions = {
  /** Unique key, e.g. `content-report:user-123`. */
  key: string;
  limit: number;
  windowMs: number;
  /** Upstash REST URL — when set with token, uses Redis INCR + EXPIRE. */
  upstashUrl?: string;
  upstashToken?: string;
};

function memoryHit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}

async function upstashHit(
  key: string,
  limit: number,
  windowMs: number,
  url: string,
  token: string,
): Promise<boolean> {
  const ttlSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, ttlSeconds, "NX"],
    ]),
  });

  if (!response.ok) {
    throw new Error(`Upstash rate-limit failed: ${response.status}`);
  }

  const results = (await response.json()) as Array<{ result: number }>;
  const count = Number(results[0]?.result ?? 0);
  return count > limit;
}

/**
 * Returns `true` when the caller should be rate-limited (over quota).
 * Falls back to memory if Upstash is unset or the Redis call fails.
 */
export async function isRateLimited(options: RateLimitOptions): Promise<boolean> {
  const { key, limit, windowMs, upstashUrl, upstashToken } = options;
  if (upstashUrl?.trim() && upstashToken?.trim()) {
    try {
      return await upstashHit(key, limit, windowMs, upstashUrl.trim(), upstashToken.trim());
    } catch {
      // Fail open to memory so a Redis outage does not block all reports.
      return memoryHit(key, limit, windowMs);
    }
  }
  return memoryHit(key, limit, windowMs);
}

/** Test helper — clears in-memory buckets between suites. */
export function resetMemoryRateLimits(): void {
  memoryBuckets.clear();
}
