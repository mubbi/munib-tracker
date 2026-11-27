import { buildPracticeSummary } from "@/test-support/fixtures/quran-companion";

import { practiceTotals, withLifetimeTotals } from "./statistics-practice";

/** Local noon on `day` so the local session date never shifts across time zones. */
function endedOn(day: string): string {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  return new Date(y, m - 1, d, 12).toISOString();
}

describe("practiceTotals (Statistics › Qur'an practice, D68)", () => {
  it("is empty without history", () => {
    expect(practiceTotals(null)).toEqual({
      sessions: 0,
      minutes: 0,
      ayahsRecited: 0,
      bestRevisionStreak: 0,
    });
  });

  it("sums minutes and heard ayahs per session, and the longest revision run", () => {
    const items = [
      buildPracticeSummary({ id: "a", durationMs: 90_000, heardAyahs: [1, 2, 3] }),
      buildPracticeSummary({ id: "b", durationMs: 45_000, heardAyahs: [1, 9] }),
      ...["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-05"].map((day, i) =>
        buildPracticeSummary({
          id: `r${i}`,
          mode: "revision",
          durationMs: 30_000,
          endedAt: endedOn(day),
          heardAyahs: [],
        }),
      ),
    ];
    const totals = practiceTotals({ schemaVersion: 1, items });
    expect(totals.sessions).toBe(6);
    // 90 + 45 + 4 × 30 s = 255 s → 4 whole minutes.
    expect(totals.minutes).toBe(4);
    // Ayah 9 is outside 1–7 and does not count.
    expect(totals.ayahsRecited).toBe(4);
    expect(totals.bestRevisionStreak).toBe(3);
  });

  it("ignores bad durations", () => {
    const items = [buildPracticeSummary({ durationMs: Number.NaN, heardAyahs: [] })];
    expect(practiceTotals({ schemaVersion: 1, items }).minutes).toBe(0);
  });
});

describe("withLifetimeTotals (D71)", () => {
  const totals = { sessions: 30, minutes: 50, ayahsRecited: 90, bestRevisionStreak: 4 };

  it("raises the counts to the lifetime totals and keeps the minutes", () => {
    expect(
      withLifetimeTotals(totals, { sessions: 42, ayahsRecited: 80, bestRevisionStreak: 9 }),
    ).toEqual({ sessions: 42, minutes: 50, ayahsRecited: 90, bestRevisionStreak: 9 });
  });

  it("returns the history totals when there are no lifetime totals (TV / not loaded)", () => {
    expect(withLifetimeTotals(totals, null)).toBe(totals);
  });
});
