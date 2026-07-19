import {
  ACCEPTANCE_HOUR_FALLBACK_END,
  ACCEPTANCE_HOUR_FALLBACK_START,
  acceptanceHourMidpoint,
  isAcceptanceHourFallbackWindow,
  isAcceptanceHourWindow,
} from "@/lib/acceptance-hour";

describe("acceptance-hour", () => {
  it("treats [asr, maghrib) as the seekable window", () => {
    const asr = new Date("2026-07-03T12:00:00.000Z");
    const maghrib = new Date("2026-07-03T15:00:00.000Z");

    expect(isAcceptanceHourWindow(asr, asr, maghrib)).toBe(true);
    expect(isAcceptanceHourWindow(new Date("2026-07-03T13:30:00.000Z"), asr, maghrib)).toBe(true);
    expect(isAcceptanceHourWindow(new Date("2026-07-03T11:59:59.000Z"), asr, maghrib)).toBe(false);
    expect(isAcceptanceHourWindow(maghrib, asr, maghrib)).toBe(false);
  });

  it("rejects inverted or equal asr/maghrib bounds", () => {
    const asr = new Date("2026-07-03T15:00:00.000Z");
    const maghrib = new Date("2026-07-03T12:00:00.000Z");
    expect(isAcceptanceHourWindow(asr, asr, maghrib)).toBe(false);
  });

  it("places the mid nudge halfway between Asr and Maghrib", () => {
    const asr = new Date("2026-07-03T12:00:00.000Z");
    const maghrib = new Date("2026-07-03T16:00:00.000Z");
    expect(acceptanceHourMidpoint(asr, maghrib).toISOString()).toBe("2026-07-03T14:00:00.000Z");
  });

  it("uses a fixed local afternoon fallback when prayer times are unknown", () => {
    const before = new Date(2026, 6, 3, ACCEPTANCE_HOUR_FALLBACK_START.hour - 1, 0, 0);
    const start = new Date(
      2026,
      6,
      3,
      ACCEPTANCE_HOUR_FALLBACK_START.hour,
      ACCEPTANCE_HOUR_FALLBACK_START.minute,
      0,
    );
    const mid = new Date(2026, 6, 3, 16, 0, 0);
    const end = new Date(
      2026,
      6,
      3,
      ACCEPTANCE_HOUR_FALLBACK_END.hour,
      ACCEPTANCE_HOUR_FALLBACK_END.minute,
      0,
    );

    expect(isAcceptanceHourFallbackWindow(before)).toBe(false);
    expect(isAcceptanceHourFallbackWindow(start)).toBe(true);
    expect(isAcceptanceHourFallbackWindow(mid)).toBe(true);
    expect(isAcceptanceHourFallbackWindow(end)).toBe(false);
  });
});
