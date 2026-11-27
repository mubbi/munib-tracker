import type {
  CoachContext,
  CoachGoalTemplate,
  CoachHistory,
  CoachInsight,
  CoachReport,
  ExcusedReason,
} from "../../types/index";
import { addDays, diffInDays } from "../date";
import {
  COACH_EVIDENCE,
  COACH_EXCUSED_WEEK_DAYS,
  COACH_RULES,
  type CoachRule,
  clampDayTarget,
  fardTotals,
  SHOWED_UP_RULE,
} from "./rules";

/** At most three insights a week, at least one of them a celebration. */
export const COACH_MAX_INSIGHTS = 3;

/** Excused week: ≥ 4 excused days, or a period running right now (pauses every judgement). */
export function isCoachExcusedWeek(ctx: CoachContext): boolean {
  return ctx.week.excusedDays >= COACH_EXCUSED_WEEK_DAYS || ctx.excused.active != null;
}

const EXCUSED_GUIDE: Record<ExcusedReason, { route: string; labelKey: string }> = {
  hayd: { route: "/hayd", labelKey: "coach.action.haydGuide" },
  nifas: { route: "/hayd", labelKey: "coach.action.haydGuide" },
  sick: { route: "/sick", labelKey: "coach.action.sickGuide" },
  travel: { route: "/travel", labelKey: "coach.action.travelGuide" },
};

const EXCUSED_EVIDENCE: Partial<Record<ExcusedReason, string>> = {
  hayd: COACH_EVIDENCE.haydDecreed,
  sick: COACH_EVIDENCE.illOrTravel,
  travel: COACH_EVIDENCE.illOrTravel,
};

/** The only message of an excused week — "Rest and return — your streak is safe". */
export function excusedInsight(ctx: CoachContext): CoachInsight {
  const reason = ctx.excused.active ?? ctx.excused.dominant;
  const evidenceRef = reason ? EXCUSED_EVIDENCE[reason] : undefined;
  return {
    ruleId: "excused_week",
    kind: "celebrate",
    area: "rest",
    copyKey: "coach.rule.excused_week",
    variant: reason ?? "generic",
    params: {},
    ...(reason ? { action: EXCUSED_GUIDE[reason] } : {}),
    ...(evidenceRef ? { evidenceRef } : {}),
  };
}

function onCooldown(rule: CoachRule, history: CoachHistory, weekStart: string): boolean {
  if (rule.cooldownWeeks <= 0) return false;
  for (const [shownWeek, ids] of Object.entries(history.shown)) {
    // The week being built never cools itself down — rebuilding it is stable.
    if (shownWeek >= weekStart) continue;
    if (diffInDays(weekStart, shownWeek) > rule.cooldownWeeks * 7) continue;
    if (ids.includes(rule.id)) return true;
  }
  return false;
}

function toInsight(rule: CoachRule, ctx: CoachContext): CoachInsight | null {
  const evidence = rule.evaluate(ctx);
  if (!evidence) return null;
  const action = evidence.action === undefined ? rule.action : (evidence.action ?? undefined);
  return {
    ruleId: rule.id,
    kind: rule.kind,
    area: rule.area,
    copyKey: rule.copyKey,
    params: evidence.params,
    ...(evidence.variant ? { variant: evidence.variant } : {}),
    ...(action ? { action } : {}),
    ...(evidence.evidenceRef ? { evidenceRef: evidence.evidenceRef } : {}),
    ...(evidence.goal ? { goal: evidence.goal } : {}),
  };
}

/**
 * The week's insights (plan signature): ≤ 3, ≥ 1 celebrate while anything was
 * tracked, at most one suggestion per area, dismissed rules and cooldowns
 * respected. An excused week returns only the rest message; an empty week
 * returns nothing (no nagging new or resting users).
 */
export function buildCoachReport(ctx: CoachContext, history: CoachHistory): CoachInsight[] {
  if (isCoachExcusedWeek(ctx)) return [excusedInsight(ctx)];
  if (ctx.week.activeDays === 0) return [];

  const weekStart = ctx.week.weekStart;
  const dismissed = new Set(history.dismissedRules);
  const candidates = COACH_RULES.filter(
    (rule) => !dismissed.has(rule.id) && !onCooldown(rule, history, weekStart),
  )
    .slice()
    .sort((a, b) => b.priority - a.priority)
    .map((rule) => toInsight(rule, ctx))
    .filter((insight): insight is CoachInsight => insight != null);

  const celebrations = candidates.filter((i) => i.kind === "celebrate");
  const suggestions = candidates.filter((i) => i.kind !== "celebrate");

  const first = celebrations[0] ?? toInsight(SHOWED_UP_RULE, ctx);
  const picked: CoachInsight[] = first ? [first] : [];
  const areas = new Set<string>();
  for (const suggestion of suggestions) {
    if (picked.length >= COACH_MAX_INSIGHTS) break;
    if (areas.has(suggestion.area)) continue;
    areas.add(suggestion.area);
    picked.push(suggestion);
  }
  for (const celebration of celebrations.slice(1)) {
    if (picked.length >= COACH_MAX_INSIGHTS) break;
    picked.splice(picked.filter((i) => i.kind === "celebrate").length, 0, celebration);
  }
  return picked;
}

/** How far the user got on a goal during the week in `ctx` (null = can't tell, e.g. vault locked). */
export function coachGoalValue(goal: CoachGoalTemplate, ctx: CoachContext): number | null {
  const { week } = ctx;
  switch (goal.kind) {
    case "fard_days":
      return week.perfectDays;
    case "prayer_on_time":
      return goal.prayerId ? week.fard[goal.prayerId].onTime : null;
    case "quran_days":
      return week.quranDays;
    case "fajr_sunnah_days":
      return week.rawatib.fajrDays;
    case "adhkar_days":
      return week.adhkarDays;
    case "masjid_salah":
      return fardTotals(week).jama;
    case "qaza_week":
      return ctx.qaza ? ctx.qaza.madeUpThisWeek : null;
    case "family_contact":
      return ctx.family ? ctx.family.contactsThisWeek : null;
  }
}

/** Full weekly report: mode, insights, the micro-goal to offer and last week's goal outcome. */
export function buildCoachWeekReport(ctx: CoachContext, history: CoachHistory): CoachReport {
  const weekStart = ctx.week.weekStart;
  const weekEnd = addDays(weekStart, 6);
  const insights = buildCoachReport(ctx, history);
  if (isCoachExcusedWeek(ctx)) {
    // Judgement paused: no goal check, no new goal.
    return { weekStart, weekEnd, mode: "excused", insights, microGoal: null, lastGoal: null };
  }
  if (insights.length === 0) {
    return { weekStart, weekEnd, mode: "quiet", insights, microGoal: null, lastGoal: null };
  }

  const fromSuggestion = insights.find((i) => i.kind !== "celebrate" && i.goal)?.goal;
  const fromCelebration = insights.find((i) => i.goal)?.goal;
  const microGoal: CoachGoalTemplate = fromSuggestion ??
    fromCelebration ?? {
      kind: "fard_days",
      target: clampDayTarget(ctx.week.perfectDays + 1),
    };

  const accepted = history.goals.find((goal) => goal.weekStart === weekStart);
  let lastGoal: CoachReport["lastGoal"] = null;
  if (accepted) {
    const value = coachGoalValue(accepted, ctx);
    if (value != null) lastGoal = { goal: accepted, value, met: value >= accepted.target };
  }
  return { weekStart, weekEnd, mode: "normal", insights, microGoal, lastGoal };
}
