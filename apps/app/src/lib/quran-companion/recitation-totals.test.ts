import { buildPracticeSummary } from "@/test-support/fixtures/quran-companion";

import {
  asRecitationTotals,
  creditRecitationTotals,
  EMPTY_RECITATION_TOTALS,
  MAX_CREDITED_IDS,
  MAX_REVISION_DAYS,
  recitationStatsFrom,
} from "./recitation-totals";

/** Local noon on `day` so the local session date never shifts across time zones. */
function endedOn(day: string): string {
  const [y, m, d] = day.split("-").map(Number) as [number, number, number];
  return new Date(y, m - 1, d, 12).toISOString();
}

function revisionOn(day: string, id = `r-${day}`) {
  return buildPracticeSummary({ id, mode: "revision", endedAt: endedOn(day), heardAyahs: [1] });
}

describe("recitation totals (D71 lifetime ledger)", () => {
  it("credits sessions, heard ayahs and revision days", () => {
    const totals = creditRecitationTotals(EMPTY_RECITATION_TOTALS, [
      buildPracticeSummary({ id: "a", heardAyahs: [1, 2, 3] }),
      // Ayah 9 is outside 1–7: the reading-credit rule doesn't count it.
      buildPracticeSummary({ id: "b", heardAyahs: [4, 9] }),
      revisionOn("2026-11-01"),
      revisionOn("2026-11-02"),
    ]);
    expect(totals).toMatchObject({
      sessions: 4,
      ayahsRecited: 6,
      bestRevisionStreak: 2,
      revisionDays: ["2026-11-01", "2026-11-02"],
      creditedIds: ["a", "b", "r-2026-11-01", "r-2026-11-02"],
    });
  });

  it("is idempotent per session id and returns the same object when nothing is new", () => {
    const a = buildPracticeSummary({ id: "a", heardAyahs: [1, 2] });
    const once = creditRecitationTotals(EMPTY_RECITATION_TOTALS, [a, a]);
    expect(once.sessions).toBe(1);
    expect(once.ayahsRecited).toBe(2);
    expect(creditRecitationTotals(once, [a, { ...a, heardAyahs: [1, 2, 3, 4] }])).toBe(once);
  });

  it("keeps the totals after rows leave the 30-row history", () => {
    let totals = EMPTY_RECITATION_TOTALS;
    const all = Array.from({ length: 40 }, (_, i) =>
      buildPracticeSummary({ id: `s${i}`, heardAyahs: [1, 2] }),
    );
    // Each save sees only the newest 30 rows, like the capped history.
    for (let i = 0; i < all.length; i++) {
      totals = creditRecitationTotals(totals, all.slice(Math.max(0, i - 29), i + 1));
    }
    expect(totals.sessions).toBe(40);
    expect(totals.ayahsRecited).toBe(80);
  });

  it("keeps a revision streak running past the history window and keeps the best run", () => {
    let totals = EMPTY_RECITATION_TOTALS;
    for (let day = 1; day <= 30; day++) {
      totals = creditRecitationTotals(totals, [
        revisionOn(`2026-11-${String(day).padStart(2, "0")}`),
      ]);
    }
    for (let day = 1; day <= 10; day++) {
      totals = creditRecitationTotals(totals, [
        revisionOn(`2026-12-${String(day).padStart(2, "0")}`),
      ]);
    }
    expect(totals.bestRevisionStreak).toBe(40);
    // A gap starts a new run; the best one stays.
    totals = creditRecitationTotals(totals, [revisionOn("2026-12-20")]);
    expect(totals.bestRevisionStreak).toBe(40);
  });

  it("bounds the stored ids and revision days", () => {
    const many = Array.from({ length: MAX_CREDITED_IDS + 20 }, (_, i) =>
      buildPracticeSummary({ id: `s${i}`, heardAyahs: [] }),
    );
    const totals = creditRecitationTotals(EMPTY_RECITATION_TOTALS, many);
    expect(totals.sessions).toBe(MAX_CREDITED_IDS + 20);
    expect(totals.creditedIds).toHaveLength(MAX_CREDITED_IDS);
    expect(totals.creditedIds.at(-1)).toBe(`s${MAX_CREDITED_IDS + 19}`);

    const start = new Date(2020, 0, 1, 12);
    const days = Array.from({ length: MAX_REVISION_DAYS + 5 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return buildPracticeSummary({ id: `d${i}`, mode: "revision", endedAt: d.toISOString() });
    });
    const long = creditRecitationTotals(EMPTY_RECITATION_TOTALS, days);
    expect(long.revisionDays).toHaveLength(MAX_REVISION_DAYS);
    expect(long.bestRevisionStreak).toBe(MAX_REVISION_DAYS);
  });

  it("reads only well-formed v1 values and never goes below the history's own sums", () => {
    expect(asRecitationTotals(null)).toBeNull();
    expect(asRecitationTotals({ schemaVersion: 2 })).toBeNull();
    expect(
      asRecitationTotals({ schemaVersion: 1, sessions: -3, ayahsRecited: "x", creditedIds: [1] }),
    ).toEqual(EMPTY_RECITATION_TOTALS);
    expect(
      recitationStatsFrom(
        { ...EMPTY_RECITATION_TOTALS, sessions: 40, ayahsRecited: 10, bestRevisionStreak: 2 },
        { sessions: 30, ayahsRecited: 12, bestRevisionStreak: 3 },
      ),
    ).toEqual({ sessions: 40, ayahsRecited: 12, bestRevisionStreak: 3 });
  });
});
