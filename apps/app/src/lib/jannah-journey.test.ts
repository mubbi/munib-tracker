import { describe, expect, it } from "@jest/globals";

import { buildJannahJourney } from "./jannah-journey";

describe("buildJannahJourney", () => {
  it("builds rows from tracker summary without implying rank", () => {
    const snapshot = buildJannahJourney({
      summary: {
        date: "2026-07-06",
        salahCompleted: 3,
        salahTotal: 5,
        zikrCompleted: 1,
        zikrTotal: 2,
        qazaRemaining: 10,
        qazaTargetToday: 4,
        qazaCompletedToday: 2,
        streakDays: 5,
      },
      streak: 5,
      khushuThisWeek: 2,
      tahajjudThisWeek: 1,
      formatCount: (n) => String(n),
    });

    expect(snapshot.rows.length).toBeGreaterThan(0);
    expect(snapshot.hasActivity).toBe(true);
    const salah = snapshot.rows.find((r) => r.id === "salah");
    expect(salah?.value).toBe("3/5");
    expect(salah?.progress).toBeCloseTo(0.6);
  });
});
