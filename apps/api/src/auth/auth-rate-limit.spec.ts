import { beforeEach, describe, expect, it } from "vitest";
import {
  isAuthDeleteAccountRateLimited,
  isAuthGuestRateLimited,
  isAuthOAuthRateLimited,
  isAuthRefreshRateLimited,
  isAuthResetAppDataRateLimited,
  isAuthTvPairClaimRateLimited,
  isAuthTvPairCreateRateLimited,
  isAuthTvPairPollRateLimited,
  resetAuthRateLimits,
} from "./auth-rate-limit";

/** Calls the limiter `times` times and returns whether the last call was limited. */
async function hit(
  limiter: (identity: string) => Promise<boolean>,
  identity: string,
  times: number,
) {
  let limited = false;
  for (let i = 0; i < times; i++) limited = await limiter(identity);
  return limited;
}

describe("auth-rate-limit", () => {
  beforeEach(() => {
    resetAuthRateLimits();
  });

  it.each([
    ["guest", isAuthGuestRateLimited, 30],
    ["refresh", isAuthRefreshRateLimited, 60],
    ["oauth", isAuthOAuthRateLimited, 30],
    ["delete-account", isAuthDeleteAccountRateLimited, 3],
    ["reset-app-data", isAuthResetAppDataRateLimited, 3],
    ["tv-pair-create", isAuthTvPairCreateRateLimited, 20],
    ["tv-pair-poll", isAuthTvPairPollRateLimited, 120],
    ["tv-pair-claim", isAuthTvPairClaimRateLimited, 30],
  ] as const)("allows %s up to %i calls per window, then limits", async (_kind, limiter, limit) => {
    expect(await hit(limiter, "ip:203.0.113.9", limit)).toBe(false);
    expect(await limiter("ip:203.0.113.9")).toBe(true);
  });

  it("tracks identities independently", async () => {
    await hit(isAuthGuestRateLimited, "client-a", 31);
    expect(await isAuthGuestRateLimited("client-b")).toBe(false);
  });

  it("keeps buckets separate per limiter kind", async () => {
    await hit(isAuthDeleteAccountRateLimited, "shared", 4);
    expect(await isAuthResetAppDataRateLimited("shared")).toBe(false);
  });

  it("resets all buckets", async () => {
    await hit(isAuthDeleteAccountRateLimited, "reset-me", 4);
    resetAuthRateLimits();
    expect(await isAuthDeleteAccountRateLimited("reset-me")).toBe(false);
  });
});
