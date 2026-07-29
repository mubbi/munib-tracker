import { isRateLimited, resetMemoryRateLimits } from "../common/durable-rate-limit";

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 15 * 60 * 1000;

/** Fixed-window rate limit per user id (30 reports / 15 min). */
export async function isOssContentFailureRateLimited(userId: string): Promise<boolean> {
  return isRateLimited({
    key: `oss-content-failure:${userId}`,
    limit: RATE_LIMIT,
    windowMs: RATE_WINDOW_MS,
  });
}

export function resetOssContentFailureRateLimits(): void {
  resetMemoryRateLimits();
}
