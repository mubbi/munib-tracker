import { describe, expect, it } from "vitest";

import {
  makeCoachContext,
  makeCoachWeek,
  makeEmptyCoachWeek,
  makePreviousWeeks,
} from "../../test-support/coach";
import type { CoachContext, CoachGoalKind, CoachHistory } from "../../types/index";
import {
  acceptCoachGoal,
  buildCoachReport,
  buildCoachWeekReport,
  COACH_MAX_INSIGHTS,
  COACH_RULES,
  coachGoalValue,
  coachWeekFor,
  dismissCoachRule,
  emptyCoachHistory,
  mergeCoachHistory,
  normalizeCoachWeekday,
  recordCoachReport,
  restoreCoachRules,
  sanitizeCoachHistory,
  snoozeCoachWeek,
} from "./index";

const WEEK = "2026-11-13"; // Friday → Thursday 2026-11-19, reviewed on Friday 2026-11-20
const NOW = "2026-11-20T13:00:00.000Z";

const ids = (ctx: CoachContext, history: CoachHistory = emptyCoachHistory()) =>
  buildCoachReport(ctx, history).map((insight) => insight.ruleId);

/** A quiet but tracked week: steady salah, nothing else that would fire. */
const steady = () => makeCoachContext(makeCoachWeek(WEEK));

describe("coachWeekFor", () => {
  it("reviews the 7 days before the latest reflection day", () => {
    expect(coachWeekFor("2026-11-20", 5)).toEqual({
      reportDate: "2026-11-20",
      weekStart: "2026-11-13",
      weekEnd: "2026-11-19",
      nextReportDate: "2026-11-27",
    });
    // Tuesday → still last Friday's report.
    expect(coachWeekFor("2026-11-24", 5).reportDate).toBe("2026-11-20");
    expect(coachWeekFor("2026-11-24", 1).reportDate).toBe("2026-11-23");
  });

  it("falls back to Friday for a missing or invalid weekday", () => {
    expect(normalizeCoachWeekday(undefined)).toBe(5);
    expect(normalizeCoachWeekday(9)).toBe(5);
    expect(normalizeCoachWeekday(0)).toBe(0);
  });
});

describe("excused weeks pause every judgement", () => {
  it("shows only 'Rest and return' with ≥ 4 excused days, whatever else would fire", () => {
    const week = makeCoachWeek(WEEK, {
      excusedDays: 5,
      countedDays: 2,
      fard: { asr: { delayed: 4 } },
    });
    const ctx = makeCoachContext(week, {
      excused: { active: null, dominant: "hayd" },
      family: { parentDue: true, dueCount: 1, contactsThisWeek: 0 },
      qaza: { remaining: 40, madeUpThisWeek: 0, perDay: null, finishDate: null },
    });
    const history = acceptCoachGoal(
      emptyCoachHistory(),
      { kind: "fard_days", target: 5 },
      WEEK,
      NOW,
    );
    const report = buildCoachWeekReport(ctx, history);
    expect(report.mode).toBe("excused");
    expect(report.insights).toHaveLength(1);
    expect(report.insights[0]).toMatchObject({
      ruleId: "excused_week",
      variant: "hayd",
      evidenceRef: "bukhari:294",
      action: { route: "/hayd" },
    });
    expect(report.microGoal).toBeNull();
    expect(report.lastGoal).toBeNull();
  });

  it("uses the travel copy, the illness-and-travel evidence and the travel guide", () => {
    const ctx = makeCoachContext(makeCoachWeek(WEEK, { excusedDays: 4 }), {
      excused: { active: null, dominant: "travel" },
    });
    expect(buildCoachReport(ctx, emptyCoachHistory())[0]).toMatchObject({
      variant: "travel",
      evidenceRef: "bukhari:2996",
      action: { route: "/travel" },
    });
  });

  it("pauses while a period is running even if the week had fewer excused days", () => {
    const ctx = makeCoachContext(makeCoachWeek(WEEK, { excusedDays: 1 }), {
      excused: { active: "sick", dominant: "sick" },
    });
    expect(ids(ctx)).toEqual(["excused_week"]);
  });

  it("judges normally with 3 excused days (those days simply don't count)", () => {
    const ctx = makeCoachContext(makeCoachWeek(WEEK, { excusedDays: 3, countedDays: 4 }), {
      excused: { active: null, dominant: "travel" },
    });
    expect(buildCoachWeekReport(ctx, emptyCoachHistory()).mode).toBe("normal");
  });
});

describe("new users and empty data", () => {
  it("returns a quiet report (no insight, no goal) when nothing was tracked", () => {
    const report = buildCoachWeekReport(
      makeCoachContext(makeEmptyCoachWeek(WEEK)),
      emptyCoachHistory(),
    );
    expect(report).toMatchObject({ mode: "quiet", insights: [], microGoal: null });
  });

  it("only celebrates a first partial week — no single-week judgement on two days", () => {
    const week = makeCoachWeek(WEEK, {
      countedDays: 2,
      activeDays: 2,
      perfectDays: 0,
      fard: { fajr: { onTime: 0, days: 2 }, dhuhr: { onTime: 2, days: 2 } },
      rawatib: { done: 0, possible: 0, fajrDays: 0 },
    });
    const report = buildCoachWeekReport(makeCoachContext(week), emptyCoachHistory());
    expect(report.insights.map((i) => i.ruleId)).toEqual(["showed_up"]);
    expect(report.insights[0]?.params).toEqual({ done: 2 });
    expect(report.microGoal).toEqual({ kind: "fard_days", target: 2 });
  });
});

describe("vault locked", () => {
  it("skips the muhasabah and family rules when their counts are unavailable", () => {
    const ctx = makeCoachContext(makeCoachWeek(WEEK), { muhasabah: null, family: null });
    expect(ids(ctx)).toEqual(["showed_up"]);
  });

  it("uses the counts when the vault is open", () => {
    const ctx = makeCoachContext(makeCoachWeek(WEEK), {
      muhasabah: { reviewDays: 5, istighfarDays: 2 },
      family: { parentDue: true, dueCount: 2, contactsThisWeek: 1 },
    });
    const report = buildCoachWeekReport(ctx, emptyCoachHistory());
    expect(report.insights.map((i) => i.ruleId)).toEqual(["muhasabah_steady", "family_ties_due"]);
    expect(report.microGoal).toEqual({ kind: "family_contact", target: 2 });
  });
});

describe("focus lock emergency unlocks (NF-3.13, neutral count)", () => {
  it("stays silent below three unlocks or without focus lock", () => {
    expect(ids(makeCoachContext(makeCoachWeek(WEEK)))).toEqual(["showed_up"]);
    expect(
      ids(makeCoachContext(makeCoachWeek(WEEK), { focusLock: { emergencyUnlocks: 2 } })),
    ).toEqual(["showed_up"]);
    expect(ids(makeCoachContext(makeCoachWeek(WEEK), { focusLock: null }))).toEqual(["showed_up"]);
  });

  it("invites a look at the focus-lock setup from three unlocks, with the count only", () => {
    const ctx = makeCoachContext(makeCoachWeek(WEEK), { focusLock: { emergencyUnlocks: 4 } });
    const insight = buildCoachReport(ctx, emptyCoachHistory()).find(
      (i) => i.ruleId === "focus_emergency",
    );
    expect(insight).toMatchObject({
      kind: "suggest",
      area: "focus",
      params: { done: 4 },
      action: { route: "/focus-lock" },
    });
    expect(insight?.evidenceRef).toBeUndefined();
    expect(insight?.goal).toBeUndefined();
  });

  it("is paused in an excused week", () => {
    const ctx = makeCoachContext(makeCoachWeek(WEEK, { excusedDays: 4 }), {
      focusLock: { emergencyUnlocks: 6 },
    });
    expect(ids(ctx)).toEqual(["excused_week"]);
  });
});

describe("rules", () => {
  it("fajr_gap fires on a ≥ 30-point gap over two weeks, with the bedtime", () => {
    const lowFajr = { fard: { fajr: { onTime: 2, days: 7 } }, perfectDays: 2 };
    const ctx = makeCoachContext(makeCoachWeek(WEEK, lowFajr), {
      previousWeeks: makePreviousWeeks(WEEK, 1, lowFajr),
    });
    const insight = buildCoachReport(ctx, emptyCoachHistory()).find((i) => i.ruleId === "fajr_gap");
    expect(insight).toMatchObject({
      params: { done: 2, total: 7, bedtime: "22:30" },
      evidenceRef: "bukhari:568",
      goal: { kind: "prayer_on_time", prayerId: "fajr", target: 3 },
    });
  });

  it("fajr_gap needs two weeks of data and a real gap", () => {
    const lowFajr = { fard: { fajr: { onTime: 2, days: 7 } } };
    expect(ids(makeCoachContext(makeCoachWeek(WEEK, lowFajr)))).not.toContain("fajr_gap");
    const small = { fard: { fajr: { onTime: 6, days: 7 } } };
    expect(
      ids(
        makeCoachContext(makeCoachWeek(WEEK, small), {
          previousWeeks: makePreviousWeeks(WEEK, 1, small),
        }),
      ),
    ).not.toContain("fajr_gap");
  });

  it("delayed_pattern picks the salah delayed most often (≥ 3 times)", () => {
    const ctx = makeCoachContext(
      makeCoachWeek(WEEK, {
        fard: { asr: { onTime: 3, delayed: 4 }, isha: { onTime: 4, delayed: 3 } },
      }),
    );
    const insight = buildCoachReport(ctx, emptyCoachHistory()).find(
      (i) => i.ruleId === "delayed_pattern",
    );
    expect(insight?.params).toEqual({ prayer: "asr", done: 4 });
    expect(insight?.goal).toEqual({ kind: "prayer_on_time", prayerId: "asr", target: 4 });
  });

  it("keeps one suggestion per area (fajr_gap wins over delayed_pattern for salah)", () => {
    const week = { fard: { fajr: { onTime: 2, days: 7 }, asr: { onTime: 3, delayed: 4 } } };
    const ctx = makeCoachContext(makeCoachWeek(WEEK, week), {
      previousWeeks: makePreviousWeeks(WEEK, 1, week),
    });
    const picked = ids(ctx);
    expect(picked).toContain("fajr_gap");
    expect(picked).not.toContain("delayed_pattern");
  });

  it("weekday_dip needs the same weekday ≥ 25 points under the week for three weeks", () => {
    const dip = { weekdayLevels: [1, 0.4, 1, 1, 1, 1, 1] };
    const twoWeeks = makeCoachContext(makeCoachWeek(WEEK, dip), {
      previousWeeks: makePreviousWeeks(WEEK, 1, dip),
    });
    expect(ids(twoWeeks)).not.toContain("weekday_dip");
    const threeWeeks = makeCoachContext(makeCoachWeek(WEEK, dip), {
      previousWeeks: makePreviousWeeks(WEEK, 2, dip),
    });
    const insight = buildCoachReport(threeWeeks, emptyCoachHistory()).find(
      (i) => i.ruleId === "weekday_dip",
    );
    expect(insight?.params).toEqual({ weekday: 1 });
  });

  it("improvement celebrates +15 points against the 4-week baseline, in counts", () => {
    const base = { fard: { fajr: { onTime: 3 }, isha: { onTime: 3 } } }; // 27/35 on time
    const ctx = makeCoachContext(makeCoachWeek(WEEK, { perfectDays: 6 }), {
      previousWeeks: makePreviousWeeks(WEEK, 4, base),
    });
    const insight = buildCoachReport(ctx, emptyCoachHistory())[0];
    expect(insight).toMatchObject({
      ruleId: "improvement",
      variant: "fard",
      params: { done: 35, total: 35 },
      evidenceRef: "bukhari:6464",
    });
    // One earlier week is no baseline.
    const short = makeCoachContext(makeCoachWeek(WEEK), {
      previousWeeks: makePreviousWeeks(WEEK, 1, base),
    });
    expect(ids(short)).not.toContain("improvement");
  });

  it("personal_best celebrates a new longest streak only", () => {
    const fresh = makeCoachContext(makeCoachWeek(WEEK), {
      streak: { current: 12, best: 12, bestBeforeWeek: 9 },
    });
    expect(buildCoachReport(fresh, emptyCoachHistory())[0]).toMatchObject({
      ruleId: "personal_best",
      params: { days: 12 },
    });
    const old = makeCoachContext(makeCoachWeek(WEEK), {
      streak: { current: 3, best: 12, bestBeforeWeek: 12 },
    });
    expect(ids(old)).not.toContain("personal_best");
  });

  it("qaza_pace projects the finish and how much sooner one more a day would be", () => {
    const pace = makeCoachContext(makeCoachWeek(WEEK), {
      qaza: { remaining: 100, madeUpThisWeek: 7, perDay: 1, finishDate: "2027-03-01" },
    });
    const insight = buildCoachReport(pace, emptyCoachHistory()).find(
      (i) => i.ruleId === "qaza_pace",
    );
    expect(insight).toMatchObject({
      variant: "pace",
      params: { remaining: 100, date: "2027-03-01", sooner: 50 },
      goal: { kind: "qaza_week", target: 14 },
    });
    const start = makeCoachContext(makeCoachWeek(WEEK), {
      qaza: { remaining: 5, madeUpThisWeek: 0, perDay: null, finishDate: null },
    });
    expect(
      buildCoachReport(start, emptyCoachHistory()).find((i) => i.ruleId === "qaza_pace"),
    ).toMatchObject({ variant: "start", params: { remaining: 5 }, goal: { target: 5 } });
  });

  it("jama_rate needs a home masjid (no gender inference) and a low rate", () => {
    const week = makeCoachWeek(WEEK);
    expect(ids(makeCoachContext(week))).not.toContain("jama_rate");
    const insight = buildCoachReport(
      makeCoachContext(week, { homeMasjidSet: true }),
      emptyCoachHistory(),
    ).find((i) => i.ruleId === "jama_rate");
    expect(insight).toMatchObject({
      params: { done: 0 },
      evidenceRef: "bukhari:645",
      goal: { kind: "masjid_salah", target: 1 },
    });
    const often = makeCoachWeek(WEEK, { fard: { fajr: { jama: 7 }, isha: { jama: 7 } } });
    expect(ids(makeCoachContext(often, { homeMasjidSet: true }))).not.toContain("jama_rate");
  });

  it("khushu_low_prayer needs ≥ 5 entries averaging ≤ 2", () => {
    const ctx = makeCoachContext(makeCoachWeek(WEEK), {
      khushu: {
        fajr: { average: 1.8, entries: 4 },
        asr: { average: 2, entries: 6 },
        isha: { average: 3, entries: 9 },
      },
    });
    const insight = buildCoachReport(ctx, emptyCoachHistory()).find(
      (i) => i.ruleId === "khushu_low_prayer",
    );
    expect(insight?.params).toEqual({ prayer: "asr" });
  });

  it("rawatib_start suggests the Fajr sunnah when fard is steady and rawatib ≈ 0", () => {
    const ctx = makeCoachContext(
      makeCoachWeek(WEEK, { rawatib: { done: 0, possible: 0, fajrDays: 0 } }),
    );
    expect(
      buildCoachReport(ctx, emptyCoachHistory()).find((i) => i.ruleId === "rawatib_start"),
    ).toMatchObject({ evidenceRef: "muslim:1688", goal: { kind: "fajr_sunnah_days", target: 2 } });
    expect(ids(steady())).not.toContain("rawatib_start");
  });

  it("quran_streak offers a khatm plan only without one; khatm_behind offers a re-plan", () => {
    const week = makeCoachWeek(WEEK, { quranDays: 6 });
    const noPlan = buildCoachReport(makeCoachContext(week), emptyCoachHistory())[0];
    expect(noPlan).toMatchObject({
      ruleId: "quran_streak",
      params: { done: 6 },
      action: { route: "/quran/khatm" },
    });
    const behind = buildCoachReport(
      makeCoachContext(week, { khatm: { hasPlan: true, daysBehind: 4 } }),
      emptyCoachHistory(),
    );
    expect(behind[0]?.action).toBeUndefined();
    expect(behind.find((i) => i.ruleId === "khatm_behind")?.params).toEqual({ days: 4 });
  });

  it("habit_consistent names one habit or counts several kept 7/7", () => {
    const one = makeCoachContext(makeCoachWeek(WEEK), {
      habits: [
        { id: "miswak", doneDays: 7 },
        { id: "smile", doneDays: 3 },
      ],
    });
    expect(buildCoachReport(one, emptyCoachHistory())[0]).toMatchObject({
      variant: "one",
      params: { habit: "miswak" },
    });
    const many = makeCoachContext(makeCoachWeek(WEEK), {
      habits: [
        { id: "miswak", doneDays: 7 },
        { id: "smile", doneDays: 7 },
      ],
    });
    expect(buildCoachReport(many, emptyCoachHistory())[0]).toMatchObject({
      variant: "many",
      params: { done: 2 },
    });
  });

  it("every rule has a unique id and a copy key under coach.rule", () => {
    const ruleIds = COACH_RULES.map((rule) => rule.id);
    expect(new Set(ruleIds).size).toBe(ruleIds.length);
    for (const rule of COACH_RULES) expect(rule.copyKey).toBe(`coach.rule.${rule.id}`);
  });
});

describe("selection", () => {
  const busy = () => {
    const lowFajr = { fard: { fajr: { onTime: 2, days: 7 } }, quranDays: 6, adhkarDays: 6 };
    return makeCoachContext(makeCoachWeek(WEEK, lowFajr), {
      previousWeeks: makePreviousWeeks(WEEK, 1, lowFajr),
      family: { parentDue: true, dueCount: 1, contactsThisWeek: 0 },
      qaza: { remaining: 30, madeUpThisWeek: 0, perDay: null, finishDate: null },
      homeMasjidSet: true,
      voluntaryFastsKept: 1,
    });
  };

  it("returns ≤ 3 insights with a celebration first", () => {
    const insights = buildCoachReport(busy(), emptyCoachHistory());
    expect(insights.length).toBeLessThanOrEqual(COACH_MAX_INSIGHTS);
    expect(insights[0]?.kind).toBe("celebrate");
    expect(insights.map((i) => i.ruleId)).toEqual(["quran_streak", "family_ties_due", "fajr_gap"]);
  });

  it("respects dismissed rules and cooldowns, but rebuilding the same week is stable", () => {
    let history = dismissCoachRule(emptyCoachHistory(), "family_ties_due", NOW);
    expect(ids(busy(), history)).toEqual(["quran_streak", "fajr_gap", "qaza_pace"]);

    const report = buildCoachWeekReport(busy(), history);
    history = recordCoachReport(history, report);
    expect(ids(busy(), history)).toEqual(["quran_streak", "fajr_gap", "qaza_pace"]);

    // Next week: quran_streak (1 week) and fajr_gap (2 weeks) cool down.
    const next = "2026-11-20";
    const nextWeek = { fard: { fajr: { onTime: 2, days: 7 } }, quranDays: 6, adhkarDays: 6 };
    const ctx = makeCoachContext(makeCoachWeek(next, nextWeek), {
      previousWeeks: [makeCoachWeek(WEEK, nextWeek)],
      qaza: { remaining: 30, madeUpThisWeek: 0, perDay: null, finishDate: null },
      homeMasjidSet: true,
    });
    expect(ids(ctx, history)).toEqual(["adhkar_steady", "jama_rate"]);
  });

  it("the fallback celebration can't be hidden", () => {
    const history = dismissCoachRule(emptyCoachHistory(), "showed_up", NOW);
    expect(history.dismissedRules).toEqual([]);
  });
});

describe("micro-goals", () => {
  it("offers the first suggestion's goal and checks it the following week", () => {
    const ctx = makeCoachContext(makeCoachWeek(WEEK, { fard: { asr: { onTime: 3, delayed: 4 } } }));
    const report = buildCoachWeekReport(ctx, emptyCoachHistory());
    expect(report.microGoal).toEqual({ kind: "prayer_on_time", prayerId: "asr", target: 4 });

    const next = "2026-11-20";
    const goal = report.microGoal;
    if (!goal) throw new Error("expected a micro-goal");
    const accepted = acceptCoachGoal(emptyCoachHistory(), goal, next, NOW);
    const met = buildCoachWeekReport(
      makeCoachContext(makeCoachWeek(next, { fard: { asr: { onTime: 5 } } })),
      accepted,
    );
    expect(met.lastGoal).toMatchObject({ value: 5, met: true });
    const partly = buildCoachWeekReport(
      makeCoachContext(makeCoachWeek(next, { fard: { asr: { onTime: 3 } } })),
      accepted,
    );
    expect(partly.lastGoal).toMatchObject({ value: 3, met: false });
    expect(recordCoachReport(accepted, partly).goals[0]?.outcome).toEqual({ value: 3, met: false });
  });

  it("reads each goal kind from the week's own counts", () => {
    const week = makeCoachWeek(WEEK, { fard: { fajr: { onTime: 4 } } });
    const ctx = makeCoachContext(week, {
      qaza: { remaining: 100, madeUpThisWeek: 6, perDay: null, finishDate: null },
      family: { parentDue: false, dueCount: 0, contactsThisWeek: 2 },
    });
    const value = (kind: CoachGoalKind, prayerId?: "fajr") =>
      coachGoalValue({ kind, target: 1, ...(prayerId ? { prayerId } : {}) }, ctx);
    expect(value("fard_days")).toBe(week.perfectDays);
    expect(value("prayer_on_time", "fajr")).toBe(4);
    // A per-prayer goal without its prayer can't be judged.
    expect(value("prayer_on_time")).toBeNull();
    expect(value("quran_days")).toBe(week.quranDays);
    expect(value("fajr_sunnah_days")).toBe(week.rawatib.fajrDays);
    expect(value("adhkar_days")).toBe(week.adhkarDays);
    expect(value("masjid_salah")).toBeGreaterThanOrEqual(0);
    expect(value("qaza_week")).toBe(6);
    expect(value("family_contact")).toBe(2);
    expect(coachGoalValue({ kind: "qaza_week", target: 1 }, makeCoachContext(week))).toBeNull();
  });

  it("can't judge a family goal while the vault is locked", () => {
    const goal = { kind: "family_contact" as const, target: 1 };
    expect(
      coachGoalValue(goal, makeCoachContext(makeCoachWeek(WEEK), { family: null })),
    ).toBeNull();
  });
});

describe("coach history", () => {
  it("sanitizes untrusted input", () => {
    const clean = sanitizeCoachHistory({
      shown: { [WEEK]: ["fajr_gap", "nope"], bad: ["fajr_gap"] },
      goals: [{ kind: "x", target: 1, weekStart: WEEK, acceptedAt: NOW }, "junk"],
      dismissedRules: ["jama_rate", 3],
      snoozedWeek: WEEK,
      updatedAt: NOW,
    });
    expect(clean).toEqual({
      schemaVersion: 1,
      shown: { [WEEK]: ["fajr_gap"] },
      goals: [],
      dismissedRules: ["jama_rate"],
      snoozedWeek: WEEK,
      updatedAt: NOW,
    });
    expect(sanitizeCoachHistory(null)).toEqual(emptyCoachHistory());
  });

  it("merges shown ids and goals, and takes dismiss/snooze from the newer side", () => {
    const local = snoozeCoachWeek(
      { ...emptyCoachHistory(), shown: { [WEEK]: ["fajr_gap"] } },
      WEEK,
      "2026-11-21T00:00:00.000Z",
    );
    const remote = dismissCoachRule(
      acceptCoachGoal(
        { ...emptyCoachHistory(), shown: { [WEEK]: ["qaza_pace"] } },
        { kind: "quran_days", target: 3 },
        "2026-11-20",
        NOW,
      ),
      "jama_rate",
      "2026-11-20T00:00:00.000Z",
    );
    const merged = mergeCoachHistory(local, remote);
    expect(merged.shown[WEEK]).toEqual(["fajr_gap", "qaza_pace"]);
    expect(merged.goals).toHaveLength(1);
    expect(merged.snoozedWeek).toBe(WEEK);
    expect(merged.dismissedRules).toEqual([]);
    expect(mergeCoachHistory(remote, local)).toEqual(merged);
  });

  it("restores hidden tips and leaves unchanged history untouched", () => {
    const hidden = dismissCoachRule(emptyCoachHistory(), "jama_rate", NOW);
    expect(dismissCoachRule(hidden, "jama_rate", NOW)).toBe(hidden);
    expect(restoreCoachRules(hidden, NOW).dismissedRules).toEqual([]);
    const empty = emptyCoachHistory();
    expect(restoreCoachRules(empty, NOW)).toBe(empty);
    const quiet = buildCoachWeekReport(makeCoachContext(makeEmptyCoachWeek(WEEK)), empty);
    expect(recordCoachReport(empty, quiet)).toBe(empty);
  });
  it("keeps well-formed goals (rounded, capped, with prayer and outcome) and drops bad fields", () => {
    const goal = (extra: Record<string, unknown>) => ({
      kind: "quran_days",
      target: 3,
      weekStart: WEEK,
      acceptedAt: NOW,
      ...extra,
    });
    const clean = sanitizeCoachHistory({
      goals: [
        goal({ target: 0 }),
        goal({ target: Number.NaN }),
        goal({ weekStart: "13/11/2026" }),
        goal({ acceptedAt: 5 }),
        goal({ weekStart: "2026-11-06", target: 1e9, prayerId: "fajr" }),
        goal({ weekStart: "2026-10-30", prayerId: "tahajjud", outcome: { value: 2, met: "yes" } }),
        goal({ outcome: { value: 4, met: true } }),
      ],
      shown: "not a map",
      snoozedWeek: "next week",
      updatedAt: 42,
    });
    expect(clean.goals).toEqual([
      { kind: "quran_days", target: 3, weekStart: "2026-10-30", acceptedAt: NOW },
      {
        kind: "quran_days",
        target: 10_000,
        weekStart: "2026-11-06",
        acceptedAt: NOW,
        prayerId: "fajr",
      },
      {
        kind: "quran_days",
        target: 3,
        weekStart: WEEK,
        acceptedAt: NOW,
        outcome: { value: 4, met: true },
      },
    ]);
    expect(clean.shown).toEqual({});
    expect(clean.snoozedWeek).toBeUndefined();
    expect(clean.updatedAt).toBe(emptyCoachHistory().updatedAt);
  });

  it("keeps only the latest 26 weeks of shown ids and goals", () => {
    const weeks = Array.from({ length: 30 }, (_, i) =>
      new Date(Date.UTC(2026, 0, 2 + 7 * i)).toISOString().slice(0, 10),
    );
    const clean = sanitizeCoachHistory({
      shown: Object.fromEntries(weeks.map((week) => [week, ["fajr_gap"]])),
      goals: weeks.map((weekStart) => ({
        kind: "quran_days",
        target: 3,
        weekStart,
        acceptedAt: NOW,
      })),
    });
    expect(Object.keys(clean.shown)).toEqual(weeks.slice(-26));
    expect(clean.goals.map((g) => g.weekStart)).toEqual(weeks.slice(-26));
  });

  it("merges a week's goals: a recorded outcome wins, else the later acceptance", () => {
    const base = { kind: "quran_days", target: 3, weekStart: WEEK };
    const withOutcome = {
      ...emptyCoachHistory(),
      goals: [
        { ...base, acceptedAt: "2026-11-13T00:00:00.000Z", outcome: { value: 1, met: false } },
      ],
    };
    const later = {
      ...emptyCoachHistory(),
      goals: [{ ...base, target: 5, acceptedAt: "2026-11-14T00:00:00.000Z" }],
    };
    expect(mergeCoachHistory(withOutcome, later).goals[0]?.outcome).toEqual({
      value: 1,
      met: false,
    });
    expect(mergeCoachHistory(later, withOutcome).goals[0]?.outcome).toEqual({
      value: 1,
      met: false,
    });
    const earlier = {
      ...emptyCoachHistory(),
      goals: [{ ...base, target: 2, acceptedAt: "2026-11-13T00:00:00.000Z" }],
    };
    expect(mergeCoachHistory(earlier, later).goals[0]?.target).toBe(5);
    expect(mergeCoachHistory(later, earlier).goals[0]?.target).toBe(5);
  });

  it("never hides the rest message or the fallback celebration; snoozing twice is a no-op", () => {
    const empty = emptyCoachHistory();
    expect(dismissCoachRule(empty, "excused_week", NOW)).toBe(empty);
    expect(dismissCoachRule(empty, "showed_up", NOW)).toBe(empty);
    const snoozed = snoozeCoachWeek(empty, WEEK, NOW);
    expect(snoozeCoachWeek(snoozed, WEEK, NOW)).toBe(snoozed);
  });

  it("accepts a prayer-specific goal, replacing that week's earlier choice", () => {
    const first = acceptCoachGoal(
      emptyCoachHistory(),
      { kind: "quran_days", target: 3 },
      WEEK,
      NOW,
    );
    const second = acceptCoachGoal(
      first,
      { kind: "prayer_on_time", target: 5, prayerId: "fajr" },
      WEEK,
      NOW,
    );
    expect(second.goals).toEqual([
      { kind: "prayer_on_time", target: 5, weekStart: WEEK, acceptedAt: NOW, prayerId: "fajr" },
    ]);
  });
});
