import { beforeEach, describe, expect, it } from "vitest";
import { isAppFeedbackRateLimited, resetAppFeedbackRateLimits } from "./app-feedback-rate-limit";

describe("app-feedback-rate-limit", () => {
  beforeEach(() => {
    resetAppFeedbackRateLimits();
  });

  it("allows up to 10 submissions per window", async () => {
    for (let i = 0; i < 10; i++) {
      expect(await isAppFeedbackRateLimited("user-1")).toBe(false);
    }
    expect(await isAppFeedbackRateLimited("user-1")).toBe(true);
  });
});
