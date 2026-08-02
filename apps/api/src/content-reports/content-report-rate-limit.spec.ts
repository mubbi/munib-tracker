import { beforeEach, describe, expect, it } from "vitest";
import {
  isContentReportRateLimited,
  resetContentReportRateLimits,
} from "./content-report-rate-limit";

describe("content-report-rate-limit", () => {
  beforeEach(() => {
    resetContentReportRateLimits();
  });

  it("allows up to 10 reports per window", async () => {
    for (let i = 0; i < 10; i++) {
      expect(await isContentReportRateLimited("user-1")).toBe(false);
    }
    expect(await isContentReportRateLimited("user-1")).toBe(true);
  });
});
