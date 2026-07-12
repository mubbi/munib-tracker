import { isRateLimited, resetMemoryRateLimits } from "../common/durable-rate-limit";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

/** Fixed-window rate limit per user id (10 reports / hour). */
export async function isContentReportRateLimited(userId: string): Promise<boolean> {
  return isRateLimited({
    key: `content-report:${userId}`,
    limit: RATE_LIMIT,
    windowMs: RATE_WINDOW_MS,
  });
}

/** Test helper — clears in-memory buckets between suites. */
export function resetContentReportRateLimits(): void {
  resetMemoryRateLimits();
}
