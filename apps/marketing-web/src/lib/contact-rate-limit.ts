/**
 * Fixed-window rate limiting for the marketing contact form.
 * Uses Upstash Redis when configured (durable on Vercel); otherwise in-memory.
 */

type Bucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, Bucket>();

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function memoryHit(key: string): boolean {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

async function upstashHit(key: string, url: string, token: string): Promise<boolean> {
  const ttlSeconds = Math.max(1, Math.ceil(RATE_WINDOW_MS / 1000));
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
  if (!response.ok) throw new Error(`Upstash ${response.status}`);
  const results = (await response.json()) as Array<{ result: number }>;
  return Number(results[0]?.result ?? 0) > RATE_LIMIT;
}

/** Returns true when the IP should be rate-limited. */
export async function isContactRateLimited(ip: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  const key = `marketing-contact:${ip}`;
  if (url && token) {
    try {
      return await upstashHit(key, url, token);
    } catch {
      return memoryHit(key);
    }
  }
  return memoryHit(key);
}
