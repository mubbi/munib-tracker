import { describe, expect, it } from "@jest/globals";
import { applyFiqhCustom, rulesForSchool } from "@munib-tracker/shared/fiqh";
import type { ExcusedReason, ObligatoryPrayer, PrayerLog } from "@munib-tracker/shared/types";
import { addDays } from "@munib-tracker/shared/utils";

import { buildPrayerLog } from "@/test-support/fixtures/prayer";

import { bloodLimits, bloodPeriods, haydStatus, shortPeriodPromptId } from "./hayd-period";

const FARD: ObligatoryPrayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

/** Excused logs (all five fard, status pending) for `days` days from `start`. */
function excusedDays(start: string, days: number, reason: ExcusedReason): PrayerLog[] {
  return Array.from({ length: days }, (_, i) => addDays(start, i)).flatMap((date) =>
    FARD.map((prayerId) =>
      buildPrayerLog({ prayerId, date, status: "pending", isExcused: true, excusedReason: reason }),
    ),
  );
}

const hanafi = { school: "hanafi" as const, rules: rulesForSchool("hanafi") };
const shafii = { school: "shafii" as const, rules: rulesForSchool("shafii") };
const hanbali = { school: "hanbali" as const, rules: rulesForSchool("hanbali") };
const maliki = { school: "maliki" as const, rules: rulesForSchool("maliki") };
const allViews = { school: null, rules: null };

describe("bloodPeriods", () => {
  it("groups consecutive days per reason and ignores sick/travel", () => {
    const logs = [
      ...excusedDays("2026-11-01", 3, "hayd"),
      ...excusedDays("2026-11-04", 2, "travel"),
      ...excusedDays("2026-11-10", 2, "nifas"),
    ];
    expect(bloodPeriods(logs)).toEqual([
      { reason: "hayd", start: "2026-11-01", end: "2026-11-03", days: 3 },
      { reason: "nifas", start: "2026-11-10", end: "2026-11-11", days: 2 },
    ]);
  });
});

describe("bloodLimits", () => {
  it("uses the school's figures", () => {
    expect(bloodLimits(hanafi.school, hanafi.rules)).toMatchObject({
      haydMaxDays: 10,
      nifasMaxDays: 40,
      haydMinDays: 3,
      minPurityDays: 15,
    });
    expect(bloodLimits(maliki.school, maliki.rules).haydMinDays).toBe(0);
    expect(bloodLimits(hanbali.school, hanbali.rules).minPurityDays).toBe(13);
  });

  it("all views: the most cautious figure across schools, never a silent pick", () => {
    expect(bloodLimits(null, null)).toEqual({
      school: null,
      haydMaxDays: 10,
      nifasMaxDays: 40,
      haydMinDays: 3,
      minPurityDays: 15,
    });
  });

  it("respects custom maxima", () => {
    const rules = applyFiqhCustom(hanafi.rules, { haydMaxDays: 8, nifasMaxDays: 30 });
    expect(bloodLimits("hanafi", rules)).toMatchObject({ haydMaxDays: 8, nifasMaxDays: 30 });
  });
});

describe("haydStatus — day counter and beyond-maximum prompt", () => {
  const logs = excusedDays("2026-11-01", 11, "hayd");

  it("Hanafi: day 6 of a maximum of 10, no prompt", () => {
    const status = haydStatus({ logs, today: "2026-11-06", activeReason: "hayd", ...hanafi });
    expect(status.counter).toEqual({ reason: "hayd", day: 6, maxDays: 10, start: "2026-11-01" });
    expect(status.prompts).toEqual([]);
  });

  it("Hanafi: day 11 → istihada prompt", () => {
    const status = haydStatus({ logs, today: "2026-11-11", activeReason: "hayd", ...hanafi });
    expect(status.prompts).toEqual([{ kind: "beyondMax", reason: "hayd", day: 11, maxDays: 10 }]);
  });

  it("Shafi'i: day 11 is still within 15", () => {
    const status = haydStatus({ logs, today: "2026-11-11", activeReason: "hayd", ...shafii });
    expect(status.counter?.maxDays).toBe(15);
    expect(status.prompts).toEqual([]);
  });

  it("nifas uses the nifas maximum (Shafi'i 60, Hanafi 40)", () => {
    const nifas = excusedDays("2026-09-01", 45, "nifas");
    const today = "2026-10-15";
    expect(haydStatus({ logs: nifas, today, activeReason: "nifas", ...shafii }).prompts).toEqual(
      [],
    );
    expect(haydStatus({ logs: nifas, today, activeReason: "nifas", ...hanafi }).prompts).toEqual([
      { kind: "beyondMax", reason: "nifas", day: 45, maxDays: 40 },
    ]);
  });

  it("counts from yesterday's flags before today is carried forward", () => {
    const status = haydStatus({
      logs: excusedDays("2026-11-01", 4, "hayd"),
      today: "2026-11-05",
      activeReason: "hayd",
      ...hanafi,
    });
    expect(status.counter?.day).toBe(5);
  });

  it("no counter when the active reason is not hayd/nifas", () => {
    expect(
      haydStatus({ logs, today: "2026-11-06", activeReason: "travel", ...hanafi }).counter,
    ).toBeNull();
  });
});

describe("haydStatus — short period prompt", () => {
  const shortLogs = excusedDays("2026-11-01", 2, "hayd");

  it("Hanafi: a 2-day period that ended offers 'add 10 to qaza'", () => {
    const status = haydStatus({
      logs: shortLogs,
      today: "2026-11-05",
      activeReason: null,
      ...hanafi,
    });
    expect(status.prompts).toHaveLength(1);
    const prompt = status.prompts[0];
    expect(prompt).toMatchObject({ kind: "shortPeriod", minDays: 3, total: 10 });
    if (prompt?.kind === "shortPeriod") {
      expect(prompt.perPrayer).toEqual({ fajr: 2, dhuhr: 2, asr: 2, maghrib: 2, isha: 2 });
      expect(shortPeriodPromptId(prompt.period)).toBe("hayd-short-period:2026-11-01:2026-11-02");
    }
  });

  it("does not count salahs the user logged as prayed", () => {
    const logs = [
      ...shortLogs.filter((l) => !(l.prayerId === "isha" && l.date === "2026-11-02")),
      buildPrayerLog({ prayerId: "isha", date: "2026-11-02", status: "completed" }),
    ];
    const prompt = haydStatus({ logs, today: "2026-11-05", activeReason: null, ...hanafi })
      .prompts[0];
    expect(prompt).toMatchObject({ kind: "shortPeriod", total: 9 });
  });

  it("Shafi'i (min 1 day) and Maliki (no minimum): no prompt", () => {
    for (const school of [shafii, maliki]) {
      expect(
        haydStatus({ logs: shortLogs, today: "2026-11-05", activeReason: null, ...school }).prompts,
      ).toEqual([]);
    }
  });

  it("all views: prompts against the strictest minimum (labelled neutrally in the UI)", () => {
    const status = haydStatus({
      logs: shortLogs,
      today: "2026-11-05",
      activeReason: null,
      ...allViews,
    });
    expect(status.prompts[0]).toMatchObject({ kind: "shortPeriod", minDays: 3 });
  });

  it("stops prompting for old periods", () => {
    expect(
      haydStatus({ logs: shortLogs, today: "2026-12-01", activeReason: null, ...hanafi }).prompts,
    ).toEqual([]);
  });

  it("no prompt while a period is active", () => {
    expect(
      haydStatus({ logs: shortLogs, today: "2026-11-02", activeReason: "hayd", ...hanafi }).prompts,
    ).toEqual([]);
  });
});

describe("haydStatus — minimum purity", () => {
  const logs = [...excusedDays("2026-11-01", 6, "hayd"), ...excusedDays("2026-11-17", 2, "hayd")];

  it("Hanafi: 10 days of purity < 15 → info prompt", () => {
    const status = haydStatus({ logs, today: "2026-11-18", activeReason: "hayd", ...hanafi });
    expect(status.counter?.day).toBe(2);
    expect(status.prompts).toEqual([{ kind: "purityGap", gapDays: 10, minPurityDays: 15 }]);
  });

  it("Hanbali: 13 days minimum", () => {
    const later = [
      ...excusedDays("2026-11-01", 6, "hayd"),
      ...excusedDays("2026-11-21", 1, "hayd"),
    ];
    // purity 2026-11-07 … 2026-11-20 = 14 days ≥ 13
    expect(
      haydStatus({ logs: later, today: "2026-11-21", activeReason: "hayd", ...hanbali }).prompts,
    ).toEqual([]);
    expect(
      haydStatus({ logs: later, today: "2026-11-21", activeReason: "hayd", ...hanafi }).prompts,
    ).toEqual([{ kind: "purityGap", gapDays: 14, minPurityDays: 15 }]);
  });
});
