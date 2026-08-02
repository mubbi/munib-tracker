import { BROADCAST_BATCH_GUARD, BROADCAST_USER_BATCH_SIZE } from "@munib-tracker/shared";
import { describe, expect, it } from "vitest";
import { estimateImmediateBroadcastDuration, formatBroadcastDuration } from "./broadcastEstimate";

describe("formatBroadcastDuration", () => {
  it("formats seconds under a minute", () => {
    expect(formatBroadcastDuration(45)).toBe("~45 seconds");
  });

  it("formats minutes under an hour", () => {
    expect(formatBroadcastDuration(60)).toBe("~1 minute");
    expect(formatBroadcastDuration(120)).toBe("~2 minutes");
  });

  it("formats hours and remainder minutes", () => {
    expect(formatBroadcastDuration(3600)).toBe("~1 hour");
    expect(formatBroadcastDuration(5400)).toBe("~1h 30m");
    expect(formatBroadcastDuration(7200)).toBe("~2 hours");
  });
});

describe("estimateImmediateBroadcastDuration", () => {
  it("returns dash label for zero users", () => {
    expect(estimateImmediateBroadcastDuration(0)).toEqual({
      batchCount: 0,
      estimatedSeconds: 0,
      label: "—",
    });
  });

  it("estimates a single batch", () => {
    const estimate = estimateImmediateBroadcastDuration(BROADCAST_USER_BATCH_SIZE);
    expect(estimate.batchCount).toBe(1);
    expect(estimate.estimatedSeconds).toBe(3);
    expect(estimate.label).toBe("~3 seconds");
  });

  it("accounts for multiple requests when batch guard is exceeded", () => {
    const users = BROADCAST_USER_BATCH_SIZE * BROADCAST_BATCH_GUARD + 1;
    const estimate = estimateImmediateBroadcastDuration(users);
    expect(estimate.batchCount).toBe(BROADCAST_BATCH_GUARD + 1);
    expect(estimate.estimatedSeconds).toBeGreaterThan(BROADCAST_BATCH_GUARD * 3);
  });

  it("floors negative user counts to zero", () => {
    expect(estimateImmediateBroadcastDuration(-10).batchCount).toBe(0);
  });
});
