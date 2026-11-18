import { buildDueQueue, dueCountsByDay, todaysSitting } from "./due-queue";
import type { MemorizationRecord } from "./types";

function rec(nextReviewAt: string, lapses = 0): MemorizationRecord {
  return {
    status: "practising",
    successStreak: 1,
    intervalDays: 1,
    nextReviewAt,
    lastAttemptAt: "2026-11-01T00:00:00.000Z",
    lapses,
    updatedAt: "2026-11-01T00:00:00.000Z",
  };
}

const TODAY = "2026-11-17";

describe("buildDueQueue (§10)", () => {
  const records = {
    "2:5": rec("2026-11-17"),
    "1:3": rec("2026-11-15"),
    "2:1": rec("2026-11-17", 3),
    "3:1": rec("2026-11-20"),
  };
  const hifz = { "4:1": "review" as const, "1:3": "review" as const, "5:1": "memorized" as const };

  it("orders overdue first, then lapses, then mushaf order", () => {
    const q = buildDueQueue({ records, hifz, includeHifzReview: false, today: TODAY });
    expect(q.map((i) => i.key)).toEqual(["1:3", "2:1", "2:5"]);
    expect(q[0].overdueDays).toBe(2);
  });

  it("adds hifz review ayahs once, as 0 lapses, when the pref is on", () => {
    const q = buildDueQueue({ records, hifz, includeHifzReview: true, today: TODAY });
    expect(q.map((i) => i.key)).toEqual(["1:3", "2:1", "2:5", "4:1"]);
    expect(q.find((i) => i.key === "4:1")?.source).toBe("hifz");
  });

  it("leaves out a hifz review ayah whose ladder record is not due yet", () => {
    const q = buildDueQueue({
      records: { "4:1": rec("2026-11-30") },
      hifz: { "4:1": "review" },
      includeHifzReview: true,
      today: TODAY,
    });
    expect(q).toEqual([]);
  });

  it("caps today's sitting and reports the remainder", () => {
    const q = buildDueQueue({ records, hifz, includeHifzReview: true, today: TODAY });
    expect(todaysSitting(q, 2)).toMatchObject({ remaining: 2 });
    expect(todaysSitting(q, 10).remaining).toBe(0);
  });

  it("counts due ayahs per day for the reminder", () => {
    const counts = dueCountsByDay(
      { records, hifz: {}, includeHifzReview: false },
      new Date(2026, 10, 19, 8, 0),
      2,
    );
    expect(counts).toEqual({ "2026-11-19": 3, "2026-11-20": 4 });
  });
});
