import { OBLIGATORY_PRAYERS } from "../../constants/index";
import type {
  CoachAction,
  CoachArea,
  CoachContext,
  CoachEvidence,
  CoachGoalTemplate,
  CoachPrayerWeek,
  CoachRuleId,
  CoachRuleKind,
  CoachWeekStats,
  ObligatoryPrayer,
} from "../../types/index";

/**
 * The NF-3.14 rule set (plan table + the gentle "celebrate" rules the listed
 * inputs support). Every rule is pure: it reads counts from the context and
 * returns evidence numbers, or null when it doesn't apply. Copy lives in i18n
 * (`coach.rule.<id>.*`); refs are corpus ids recorded in docs/proofs/weekly-coach.md.
 */
export interface CoachRule {
  id: CoachRuleId;
  kind: CoachRuleKind;
  area: CoachArea;
  /** Returns evidence numbers or null if not applicable. Pure. */
  evaluate(ctx: CoachContext): CoachEvidence | null;
  /** Higher first. */
  priority: number;
  /** Don't repeat within N weeks (0 = may repeat every week). */
  cooldownWeeks: number;
  /** i18n base key with {{params}}. */
  copyKey: string;
  action?: CoachAction;
}

/** Corpus ids (rendered by reference only — never typed). */
export const COACH_EVIDENCE = {
  /** Bukhari 6464 — the most beloved deed is the most regular, even if little. */
  consistency: "bukhari:6464",
  /** Bukhari 568 — disliked sleeping before Isha and talking after it. */
  sleepAfterIsha: "bukhari:568",
  /** Muslim 725 (Abd al-Baqi) = corpus 1688 — the two rakahs of Fajr. */
  fajrSunnah: "muslim:1688",
  /** Bukhari 645 — salah in congregation, twenty-seven degrees. */
  congregation: "bukhari:645",
  /** Bukhari 2996 — the ill or travelling keep the reward of their usual deeds. */
  illOrTravel: "bukhari:2996",
  /** Bukhari 1117 — pray standing; if you can't, sitting; if you can't, on your side. */
  prayAsAble: "bukhari:1117",
  /** Bukhari 294 — "a thing Allah has decreed for the daughters of Adam". */
  haydDecreed: "bukhari:294",
} as const;

/** Single-week rules need at least this many counted days (no judging a partial week). */
export const COACH_MIN_COUNTED_DAYS = 4;
/** An excused week (hayd / illness / travel ≥ 4 days) pauses every judgement. */
export const COACH_EXCUSED_WEEK_DAYS = 4;

const FARD: readonly ObligatoryPrayer[] = OBLIGATORY_PRAYERS;
const EPS = 1e-9;

export function hasCoachData(week: CoachWeekStats): boolean {
  return week.countedDays >= COACH_MIN_COUNTED_DAYS;
}

/** Day-based goal targets stay between 2 and 7 — small, reachable steps. */
export function clampDayTarget(n: number): number {
  return Math.min(7, Math.max(2, Math.round(n)));
}

function sumPrayer(weeks: readonly CoachWeekStats[], prayer: ObligatoryPrayer): CoachPrayerWeek {
  const total: CoachPrayerWeek = { onTime: 0, delayed: 0, jama: 0, days: 0 };
  for (const week of weeks) {
    const row = week.fard[prayer];
    total.onTime += row.onTime;
    total.delayed += row.delayed;
    total.jama += row.jama;
    total.days += row.days;
  }
  return total;
}

/** All five fard together for one week. */
export function fardTotals(week: CoachWeekStats): CoachPrayerWeek {
  const total: CoachPrayerWeek = { onTime: 0, delayed: 0, jama: 0, days: 0 };
  for (const prayer of FARD) {
    const row = sumPrayer([week], prayer);
    total.onTime += row.onTime;
    total.delayed += row.delayed;
    total.jama += row.jama;
    total.days += row.days;
  }
  return total;
}

type Metric = "fard" | "rawatib" | "quran" | "adhkar";
const METRICS: readonly Metric[] = ["fard", "rawatib", "quran", "adhkar"];

function metricOf(week: CoachWeekStats, metric: Metric): { done: number; total: number } | null {
  switch (metric) {
    case "fard": {
      const totals = fardTotals(week);
      return hasCoachData(week) && totals.days > 0
        ? { done: totals.onTime, total: totals.days }
        : null;
    }
    case "rawatib":
      return hasCoachData(week) && week.rawatib.possible > 0
        ? { done: week.rawatib.done, total: week.rawatib.possible }
        : null;
    case "quran":
      return week.activeDays > 0 ? { done: week.quranDays, total: 7 } : null;
    case "adhkar":
      return week.activeDays > 0 ? { done: week.adhkarDays, total: 7 } : null;
  }
}

function goalForMetric(metric: Metric, week: CoachWeekStats): CoachGoalTemplate {
  switch (metric) {
    case "fard":
      return { kind: "fard_days", target: clampDayTarget(week.perfectDays) };
    case "rawatib":
      return { kind: "fajr_sunnah_days", target: clampDayTarget(week.rawatib.fajrDays) };
    case "quran":
      return { kind: "quran_days", target: clampDayTarget(week.quranDays) };
    case "adhkar":
      return { kind: "adhkar_days", target: clampDayTarget(week.adhkarDays) };
  }
}

function nextFardDaysGoal(week: CoachWeekStats): CoachGoalTemplate {
  return { kind: "fard_days", target: clampDayTarget(week.perfectDays + 1) };
}

// ── celebrate ────────────────────────────────────────────────────────────────

const personalBest: CoachRule = {
  id: "personal_best",
  kind: "celebrate",
  area: "salah",
  priority: 95,
  cooldownWeeks: 0,
  copyKey: "coach.rule.personal_best",
  evaluate: ({ streak, week }) =>
    streak.best >= 3 && streak.best > streak.bestBeforeWeek
      ? { params: { days: streak.best }, goal: nextFardDaysGoal(week) }
      : null,
};

const improvement: CoachRule = {
  id: "improvement",
  kind: "celebrate",
  area: "progress",
  priority: 90,
  cooldownWeeks: 1,
  copyKey: "coach.rule.improvement",
  evaluate: ({ week, previousWeeks }) => {
    let best: { metric: Metric; gain: number; done: number; total: number } | null = null;
    for (const metric of METRICS) {
      const now = metricOf(week, metric);
      if (!now || now.done === 0) continue;
      const baseline = previousWeeks
        .slice(0, 4)
        .map((w) => metricOf(w, metric))
        .filter((m): m is { done: number; total: number } => m != null);
      if (baseline.length < 2) continue;
      const base = baseline.reduce((s, m) => s + m.done / m.total, 0) / baseline.length;
      const gain = now.done / now.total - base;
      if (gain + EPS < 0.15) continue;
      if (!best || gain > best.gain + EPS) best = { metric, gain, ...now };
    }
    if (!best) return null;
    return {
      variant: best.metric,
      params: { done: best.done, total: best.total },
      evidenceRef: COACH_EVIDENCE.consistency,
      goal: goalForMetric(best.metric, week),
    };
  },
};

const quranStreak: CoachRule = {
  id: "quran_streak",
  kind: "celebrate",
  area: "quran",
  priority: 75,
  cooldownWeeks: 1,
  copyKey: "coach.rule.quran_streak",
  evaluate: ({ week, khatm }) =>
    week.quranDays >= 5
      ? {
          params: { done: week.quranDays },
          goal: { kind: "quran_days", target: clampDayTarget(week.quranDays) },
          action: khatm.hasPlan
            ? null
            : { route: "/quran/khatm", labelKey: "coach.action.startKhatm" },
        }
      : null,
};

const habitConsistent: CoachRule = {
  id: "habit_consistent",
  kind: "celebrate",
  area: "habits",
  priority: 70,
  cooldownWeeks: 1,
  copyKey: "coach.rule.habit_consistent",
  action: { route: "/habits", labelKey: "coach.action.habits" },
  evaluate: ({ habits }): CoachEvidence | null => {
    const kept = habits.filter((habit) => habit.doneDays >= 7);
    if (kept.length === 0) return null;
    const first = kept[0] as { id: string };
    return kept.length === 1
      ? { variant: "one", params: { habit: first.id } }
      : { variant: "many", params: { done: kept.length } };
  },
};

const adhkarSteady: CoachRule = {
  id: "adhkar_steady",
  kind: "celebrate",
  area: "zikr",
  priority: 65,
  cooldownWeeks: 1,
  copyKey: "coach.rule.adhkar_steady",
  action: { route: "/zikr", labelKey: "coach.action.adhkar" },
  evaluate: ({ week }) =>
    week.adhkarDays >= 5
      ? {
          params: { done: week.adhkarDays },
          goal: { kind: "adhkar_days", target: clampDayTarget(week.adhkarDays) },
        }
      : null,
};

const fastingKept: CoachRule = {
  id: "fasting_kept",
  kind: "celebrate",
  area: "fasting",
  priority: 60,
  cooldownWeeks: 0,
  copyKey: "coach.rule.fasting_kept",
  action: { route: "/fasting", labelKey: "coach.action.fasting" },
  evaluate: ({ voluntaryFastsKept }) =>
    voluntaryFastsKept >= 1 ? { params: { done: voluntaryFastsKept } } : null,
};

const muhasabahSteady: CoachRule = {
  id: "muhasabah_steady",
  kind: "celebrate",
  area: "reflection",
  priority: 55,
  cooldownWeeks: 1,
  copyKey: "coach.rule.muhasabah_steady",
  action: { route: "/muhasabah", labelKey: "coach.action.muhasabah" },
  // Vault locked / unavailable ⇒ null ⇒ skipped (plan "Storage").
  evaluate: ({ muhasabah }) =>
    muhasabah && muhasabah.reviewDays >= 4 ? { params: { done: muhasabah.reviewDays } } : null,
};

/** Fallback so every report has one celebration while anything was tracked. */
export const SHOWED_UP_RULE: CoachRule = {
  id: "showed_up",
  kind: "celebrate",
  area: "progress",
  priority: 1,
  cooldownWeeks: 0,
  copyKey: "coach.rule.showed_up",
  evaluate: ({ week }) =>
    week.activeDays >= 1
      ? {
          params: { done: week.activeDays },
          evidenceRef: COACH_EVIDENCE.consistency,
          goal: nextFardDaysGoal(week),
        }
      : null,
};

// ── suggest / plan ───────────────────────────────────────────────────────────

const familyTiesDue: CoachRule = {
  id: "family_ties_due",
  kind: "suggest",
  area: "family",
  priority: 88,
  cooldownWeeks: 1,
  copyKey: "coach.rule.family_ties_due",
  action: { route: "/family-ties", labelKey: "coach.action.familyTies" },
  evaluate: ({ family }) =>
    family?.parentDue
      ? {
          params: {},
          goal: { kind: "family_contact", target: Math.max(1, family.contactsThisWeek + 1) },
        }
      : null,
};

const fajrGap: CoachRule = {
  id: "fajr_gap",
  kind: "suggest",
  area: "salah",
  priority: 85,
  cooldownWeeks: 2,
  copyKey: "coach.rule.fajr_gap",
  action: { route: "/settings/bedtime", labelKey: "coach.action.bedtime" },
  evaluate: ({ week, previousWeeks, bedtime }) => {
    const previous = previousWeeks[0];
    if (!previous || !hasCoachData(week) || !hasCoachData(previous)) return null;
    const weeks = [week, previous];
    const fajr = sumPrayer(weeks, "fajr");
    if (fajr.days < 6) return null;
    const others = FARD.filter((p) => p !== "fajr")
      .map((p) => sumPrayer(weeks, p))
      .filter((row) => row.days > 0)
      .map((row) => row.onTime / row.days);
    if (others.length < 2) return null;
    const mean = others.reduce((s, r) => s + r, 0) / others.length;
    if (mean - fajr.onTime / fajr.days + EPS < 0.3) return null;
    const row = week.fard.fajr;
    return {
      variant: bedtime ? "bedtime" : "noBedtime",
      params: { done: row.onTime, total: row.days, bedtime: bedtime ?? "" },
      evidenceRef: COACH_EVIDENCE.sleepAfterIsha,
      goal: { kind: "prayer_on_time", prayerId: "fajr", target: clampDayTarget(row.onTime + 1) },
    };
  },
};

const delayedPattern: CoachRule = {
  id: "delayed_pattern",
  kind: "suggest",
  area: "salah",
  priority: 80,
  cooldownWeeks: 2,
  copyKey: "coach.rule.delayed_pattern",
  action: { route: "/settings/reminder-offsets", labelKey: "coach.action.reminderOffset" },
  evaluate: ({ week }) => {
    let pick: ObligatoryPrayer | null = null;
    for (const prayer of FARD) {
      const delayed = week.fard[prayer].delayed;
      if (delayed >= 3 && (pick == null || delayed > week.fard[pick].delayed)) pick = prayer;
    }
    if (!pick) return null;
    const row = week.fard[pick];
    return {
      params: { prayer: pick, done: row.delayed },
      goal: { kind: "prayer_on_time", prayerId: pick, target: clampDayTarget(row.onTime + 1) },
    };
  },
};

const khatmBehind: CoachRule = {
  id: "khatm_behind",
  kind: "plan",
  area: "quran",
  priority: 70,
  cooldownWeeks: 1,
  copyKey: "coach.rule.khatm_behind",
  action: { route: "/quran/khatm", labelKey: "coach.action.adjustKhatm" },
  evaluate: ({ khatm, week }) =>
    khatm.hasPlan && khatm.daysBehind > 2
      ? {
          params: { days: khatm.daysBehind },
          goal: { kind: "quran_days", target: clampDayTarget(week.quranDays + 1) },
        }
      : null,
};

const WEEKDAY_DIP_WEEKS = 3;

const weekdayDip: CoachRule = {
  id: "weekday_dip",
  kind: "plan",
  area: "salah",
  priority: 68,
  cooldownWeeks: 3,
  copyKey: "coach.rule.weekday_dip",
  action: { route: "/schedule", labelKey: "coach.action.schedule" },
  evaluate: ({ week, previousWeeks }) => {
    const weeks = [week, ...previousWeeks].slice(0, WEEKDAY_DIP_WEEKS);
    if (weeks.length < WEEKDAY_DIP_WEEKS || !weeks.every(hasCoachData)) return null;
    let pick: { weekday: number; avg: number } | null = null;
    for (let weekday = 0; weekday < 7; weekday += 1) {
      let dipWeeks = 0;
      let sum = 0;
      for (const w of weeks) {
        const level = w.weekdayLevels[weekday];
        const others = w.weekdayLevels.filter((l): l is number => l != null);
        if (level == null || others.length < COACH_MIN_COUNTED_DAYS) break;
        const mean = others.reduce((s, l) => s + l, 0) / others.length;
        if (level > mean - 0.25 + EPS) break;
        dipWeeks += 1;
        sum += level;
      }
      if (dipWeeks < WEEKDAY_DIP_WEEKS) continue;
      const avg = sum / dipWeeks;
      if (!pick || avg < pick.avg - EPS) pick = { weekday, avg };
    }
    return pick ? { params: { weekday: pick.weekday }, goal: nextFardDaysGoal(week) } : null;
  },
};

const qazaPace: CoachRule = {
  id: "qaza_pace",
  kind: "plan",
  area: "qaza",
  priority: 60,
  cooldownWeeks: 2,
  copyKey: "coach.rule.qaza_pace",
  action: { route: "/qaza/planner", labelKey: "coach.action.qazaPlan" },
  evaluate: ({ qaza }): CoachEvidence | null => {
    if (!qaza || qaza.remaining <= 0) return null;
    const { remaining, perDay, finishDate } = qaza;
    if (perDay != null && perDay > 0 && finishDate) {
      const sooner = Math.ceil(remaining / perDay) - Math.ceil(remaining / (perDay + 1));
      return {
        variant: "pace",
        params: { remaining, date: finishDate, sooner },
        goal: {
          kind: "qaza_week",
          target: Math.min(remaining, Math.round(perDay * 7) + 7),
        },
      };
    }
    return {
      variant: "start",
      params: { remaining },
      goal: { kind: "qaza_week", target: Math.min(remaining, 7) },
    };
  },
};

const khushuLowPrayer: CoachRule = {
  id: "khushu_low_prayer",
  kind: "suggest",
  area: "khushu",
  priority: 55,
  cooldownWeeks: 3,
  copyKey: "coach.rule.khushu_low_prayer",
  action: { route: "/salah-guide/phrases", labelKey: "coach.action.meanings" },
  evaluate: ({ khushu }) => {
    let pick: { prayer: ObligatoryPrayer; average: number } | null = null;
    for (const prayer of FARD) {
      const row = khushu[prayer];
      if (!row || row.entries < 5 || row.average > 2 + EPS) continue;
      if (!pick || row.average < pick.average - EPS) pick = { prayer, average: row.average };
    }
    return pick ? { params: { prayer: pick.prayer } } : null;
  },
};

const rawatibStart: CoachRule = {
  id: "rawatib_start",
  kind: "suggest",
  area: "rawatib",
  priority: 50,
  cooldownWeeks: 4,
  copyKey: "coach.rule.rawatib_start",
  action: { route: "/rawatib", labelKey: "coach.action.rawatib" },
  evaluate: ({ week }) => {
    if (!hasCoachData(week)) return null;
    const totals = fardTotals(week);
    if (totals.days === 0 || totals.onTime / totals.days + EPS < 0.9) return null;
    if (week.rawatib.done > 1) return null;
    return {
      params: {},
      evidenceRef: COACH_EVIDENCE.fajrSunnah,
      goal: { kind: "fajr_sunnah_days", target: 2 },
    };
  },
};

const jamaRate: CoachRule = {
  id: "jama_rate",
  kind: "suggest",
  area: "masjid",
  priority: 45,
  cooldownWeeks: 3,
  copyKey: "coach.rule.jama_rate",
  action: { route: "/masjids", labelKey: "coach.action.masjids" },
  // No gender inference: only for users who set a home masjid themselves.
  evaluate: ({ homeMasjidSet, week }) => {
    if (!homeMasjidSet) return null;
    const totals = fardTotals(week);
    const prayed = totals.onTime + totals.delayed;
    if (prayed < 10 || totals.jama / prayed + EPS >= 0.2) return null;
    return {
      params: { done: totals.jama },
      evidenceRef: COACH_EVIDENCE.congregation,
      goal: { kind: "masjid_salah", target: totals.jama + 1 },
    };
  },
};

/** Emergency unlocks in a week before the focus-lock invitation shows (NF-3.13: neutral count). */
export const COACH_FOCUS_EMERGENCY_MIN = 3;

/**
 * NF-3.13 §5: emergency unlocks reach the coach only as a neutral count. From
 * three in a week, one gentle invitation to look at the windows / unlock mode
 * — no judgement, no ruling, and (like every rule) silent in an excused week.
 */
const focusEmergency: CoachRule = {
  id: "focus_emergency",
  kind: "suggest",
  area: "focus",
  priority: 40,
  cooldownWeeks: 2,
  copyKey: "coach.rule.focus_emergency",
  action: { route: "/focus-lock", labelKey: "coach.action.focusLock" },
  evaluate: ({ focusLock }) =>
    focusLock && focusLock.emergencyUnlocks >= COACH_FOCUS_EMERGENCY_MIN
      ? { params: { done: focusLock.emergencyUnlocks } }
      : null,
};

/** Every rule except the excused-week message and the fallback celebration. */
export const COACH_RULES: readonly CoachRule[] = [
  personalBest,
  improvement,
  quranStreak,
  habitConsistent,
  adhkarSteady,
  fastingKept,
  muhasabahSteady,
  familyTiesDue,
  fajrGap,
  delayedPattern,
  khatmBehind,
  weekdayDip,
  qazaPace,
  khushuLowPrayer,
  rawatibStart,
  jamaRate,
  focusEmergency,
];
