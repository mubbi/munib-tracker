import { isRateLimited, resetMemoryRateLimits } from "../common/durable-rate-limit";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 15 * 60 * 1000;

let upstashUrl: string | undefined;
let upstashToken: string | undefined;

export function configureAppFeedbackRateLimit(options: {
  upstashUrl?: string;
  upstashToken?: string;
}): void {
  upstashUrl = options.upstashUrl;
  upstashToken = options.upstashToken;
}

/** Fixed-window rate limit per user id (10 submissions / 15 min). */
export async function isAppFeedbackRateLimited(userId: string): Promise<boolean> {
  return isRateLimited({
    key: `app-feedback:${userId}`,
    limit: RATE_LIMIT,
    windowMs: RATE_WINDOW_MS,
    upstashUrl,
    upstashToken,
  });
}

export function resetAppFeedbackRateLimits(): void {
  resetMemoryRateLimits();
}
