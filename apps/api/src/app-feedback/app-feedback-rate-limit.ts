const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 15 * 60 * 1000;

const buckets = new Map<string, { count: number; resetAt: number }>();

/** Fixed-window rate limit per user id (10 submissions / 15 min). */
export function isAppFeedbackRateLimited(userId: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(userId);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

export function resetAppFeedbackRateLimits(): void {
  buckets.clear();
}
