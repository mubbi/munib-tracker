import { beforeEach, describe, expect, it } from "vitest";
import { isAppFeedbackRateLimited, resetAppFeedbackRateLimits } from "./app-feedback-rate-limit";

describe("app-feedback-rate-limit", () => {
  beforeEach(() => {
    resetAppFeedbackRateLimits();
  });

  it("allows up to 10 submissions per window", () => {
    for (let i = 0; i < 10; i++) {
      expect(isAppFeedbackRateLimited("user-1")).toBe(false);
    }
    expect(isAppFeedbackRateLimited("user-1")).toBe(true);
  });
});
