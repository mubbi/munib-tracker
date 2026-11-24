import { OBLIGATORY_PRAYERS } from "../../constants/index";
import type {
  CoachGoal,
  CoachGoalKind,
  CoachGoalTemplate,
  CoachHistory,
  CoachReport,
  CoachRuleId,
  ObligatoryPrayer,
} from "../../types/index";

/**
 * `coach_history` blob (NF-3.14): shown rule ids per reviewed week, accepted
 * micro-goals + outcomes, and the user's dismiss / snooze choices. All
 * transitions are pure and return the same object when nothing changed.
 */

/** Weeks of shown-insight history kept (cooldowns look back ≤ 4 weeks). */
export const COACH_HISTORY_WEEKS = 26;
const EPOCH = "1970-01-01T00:00:00.000Z";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const COACH_RULE_IDS: readonly CoachRuleId[] = [
  "excused_week",
  "personal_best",
  "improvement",
  "quran_streak",
  "habit_consistent",
  "adhkar_steady",
  "fasting_kept",
  "muhasabah_steady",
  "showed_up",
  "fajr_gap",
  "delayed_pattern",
  "weekday_dip",
  "family_ties_due",
  "khatm_behind",
  "qaza_pace",
  "khushu_low_prayer",
  "rawatib_start",
  "jama_rate",
];

const GOAL_KINDS: readonly CoachGoalKind[] = [
  "fard_days",
  "prayer_on_time",
  "quran_days",
  "fajr_sunnah_days",
  "adhkar_days",
  "masjid_salah",
  "qaza_week",
  "family_contact",
];

const RULE_SET = new Set<string>(COACH_RULE_IDS);
const GOAL_SET = new Set<string>(GOAL_KINDS);
const PRAYER_SET = new Set<string>(OBLIGATORY_PRAYERS);

export function emptyCoachHistory(): CoachHistory {
  return { schemaVersion: 1, shown: {}, goals: [], dismissedRules: [], updatedAt: EPOCH };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function ruleIds(value: unknown): CoachRuleId[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is CoachRuleId => RULE_SET.has(id as string)))];
}

function cleanGoal(value: unknown): CoachGoal | null {
  if (!isRecord(value)) return null;
  const { kind, target, prayerId, weekStart, acceptedAt, outcome } = value;
  if (typeof kind !== "string" || !GOAL_SET.has(kind)) return null;
  if (typeof target !== "number" || !Number.isFinite(target) || target < 1) return null;
  if (typeof weekStart !== "string" || !DATE_RE.test(weekStart)) return null;
  if (typeof acceptedAt !== "string") return null;
  const goal: CoachGoal = {
    kind: kind as CoachGoalKind,
    target: Math.min(10_000, Math.round(target)),
    weekStart,
    acceptedAt,
  };
  if (typeof prayerId === "string" && PRAYER_SET.has(prayerId)) {
    goal.prayerId = prayerId as ObligatoryPrayer;
  }
  if (
    isRecord(outcome) &&
    typeof outcome.value === "number" &&
    Number.isFinite(outcome.value) &&
    typeof outcome.met === "boolean"
  ) {
    goal.outcome = { value: outcome.value, met: outcome.met };
  }
  return goal;
}

function trimShown(shown: Record<string, CoachRuleId[]>): Record<string, CoachRuleId[]> {
  const weeks = Object.keys(shown).sort().slice(-COACH_HISTORY_WEEKS);
  return Object.fromEntries(weeks.map((week) => [week, shown[week] ?? []]));
}

function trimGoals(goals: CoachGoal[]): CoachGoal[] {
  return [...goals]
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart))
    .slice(-COACH_HISTORY_WEEKS);
}

/** Sync / backup input is untrusted: keep only well-formed fields. */
export function sanitizeCoachHistory(raw: unknown): CoachHistory {
  if (!isRecord(raw)) return emptyCoachHistory();
  const shown: Record<string, CoachRuleId[]> = {};
  if (isRecord(raw.shown)) {
    for (const [week, ids] of Object.entries(raw.shown)) {
      if (DATE_RE.test(week)) shown[week] = ruleIds(ids);
    }
  }
  const byWeek = new Map<string, CoachGoal>();
  for (const goal of Array.isArray(raw.goals) ? raw.goals : []) {
    const clean = cleanGoal(goal);
    if (clean) byWeek.set(clean.weekStart, clean);
  }
  const history: CoachHistory = {
    schemaVersion: 1,
    shown: trimShown(shown),
    goals: trimGoals([...byWeek.values()]),
    dismissedRules: ruleIds(raw.dismissedRules),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : EPOCH,
  };
  if (typeof raw.snoozedWeek === "string" && DATE_RE.test(raw.snoozedWeek)) {
    history.snoozedWeek = raw.snoozedWeek;
  }
  return history;
}

function pickGoal(a: CoachGoal, b: CoachGoal): CoachGoal {
  if (a.outcome && !b.outcome) return a;
  if (b.outcome && !a.outcome) return b;
  return a.acceptedAt >= b.acceptedAt ? a : b;
}

/**
 * Sync merge: shown ids and goals union (per week; a goal with an outcome or
 * the later acceptance wins); dismiss / snooze follow the newer `updatedAt`.
 */
export function mergeCoachHistory(localRaw: unknown, remoteRaw: unknown): CoachHistory {
  const local = sanitizeCoachHistory(localRaw);
  const remote = sanitizeCoachHistory(remoteRaw);
  const shown: Record<string, CoachRuleId[]> = { ...remote.shown };
  for (const [week, ids] of Object.entries(local.shown)) {
    const union = new Set([...(shown[week] ?? []), ...ids]);
    // Rule order keeps the merge symmetric (same result on both devices).
    shown[week] = COACH_RULE_IDS.filter((id) => union.has(id));
  }
  const goals = new Map<string, CoachGoal>();
  for (const goal of [...remote.goals, ...local.goals]) {
    const existing = goals.get(goal.weekStart);
    goals.set(goal.weekStart, existing ? pickGoal(existing, goal) : goal);
  }
  const newer = local.updatedAt >= remote.updatedAt ? local : remote;
  const merged: CoachHistory = {
    schemaVersion: 1,
    shown: trimShown(shown),
    goals: trimGoals([...goals.values()]),
    dismissedRules: newer.dismissedRules,
    updatedAt: newer.updatedAt,
  };
  if (newer.snoozedWeek) merged.snoozedWeek = newer.snoozedWeek;
  return merged;
}

function sameIds(a: readonly string[] | undefined, b: readonly string[]): boolean {
  return a != null && a.length === b.length && a.every((id, i) => id === b[i]);
}

/**
 * Records what a report showed (for cooldowns) and the outcome of the goal it
 * checked. Pure; returns `history` unchanged when there is nothing new.
 */
export function recordCoachReport(history: CoachHistory, report: CoachReport): CoachHistory {
  const ids = report.insights.map((insight) => insight.ruleId);
  let next = history;
  if (ids.length > 0 && !sameIds(history.shown[report.weekStart], ids)) {
    next = { ...next, shown: trimShown({ ...next.shown, [report.weekStart]: ids }) };
  }
  const last = report.lastGoal;
  if (last) {
    const current = next.goals.find((goal) => goal.weekStart === last.goal.weekStart);
    if (current && (current.outcome?.value !== last.value || current.outcome?.met !== last.met)) {
      next = {
        ...next,
        goals: next.goals.map((goal) =>
          goal === current ? { ...goal, outcome: { value: last.value, met: last.met } } : goal,
        ),
      };
    }
  }
  return next;
}

/** Accepts the micro-goal for the week starting `forWeekStart` (replaces any earlier choice). */
export function acceptCoachGoal(
  history: CoachHistory,
  template: CoachGoalTemplate,
  forWeekStart: string,
  nowIso: string,
): CoachHistory {
  const goal: CoachGoal = {
    kind: template.kind,
    target: template.target,
    weekStart: forWeekStart,
    acceptedAt: nowIso,
    ...(template.prayerId ? { prayerId: template.prayerId } : {}),
  };
  return {
    ...history,
    goals: trimGoals([...history.goals.filter((g) => g.weekStart !== forWeekStart), goal]),
  };
}

/** "Hide tips like this." The rest message and the fallback celebration can't be hidden. */
export function dismissCoachRule(
  history: CoachHistory,
  ruleId: CoachRuleId,
  nowIso: string,
): CoachHistory {
  if (ruleId === "excused_week" || ruleId === "showed_up") return history;
  if (history.dismissedRules.includes(ruleId)) return history;
  return { ...history, dismissedRules: [...history.dismissedRules, ruleId], updatedAt: nowIso };
}

export function restoreCoachRules(history: CoachHistory, nowIso: string): CoachHistory {
  if (history.dismissedRules.length === 0) return history;
  return { ...history, dismissedRules: [], updatedAt: nowIso };
}

/** Hide the home card until the next reflection. */
export function snoozeCoachWeek(
  history: CoachHistory,
  weekStart: string,
  nowIso: string,
): CoachHistory {
  if (history.snoozedWeek === weekStart) return history;
  return { ...history, snoozedWeek: weekStart, updatedAt: nowIso };
}
