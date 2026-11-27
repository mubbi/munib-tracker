import type {
  TajweedCoachingPlan,
  TajweedCoachingState,
  TajweedDrillHeadId,
  TajweedHeadProgress,
  TajweedListenCategory,
  TajweedListenProgress,
  TajweedPlanItem,
  TajweedRecentVerdict,
  TajweedWordCard,
  TajweedWordRef,
} from "@munib-tracker/shared/types";
import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";

import type { DrillVerdict } from "@/lib/quran-companion/pronunciation/judge";
import { LADDER_DAYS } from "@/lib/quran-companion/revision-schedule";

import {
  DRILL_HEAD_IDS,
  isDrillHead,
  isListenCategory,
  LISTEN_CATEGORIES,
  planItemCategory,
} from "./categories";

/**
 * NF-3.15 drill history (`tajweed_coaching` blob): counts and spacing only.
 * Spacing reuses the revision ladder (`revision-schedule.ts`, 0 → 1 → 3 → 7 →
 * 14 → 30 days): a `matched` take moves a head one rung out, `try-again`
 * brings it one rung in, and `not-sure` changes nothing but the counts.
 */
export const EMPTY_TAJWEED_COACHING: TajweedCoachingState = { schemaVersion: 1, heads: {} };

/** Judged outcomes kept for `recentTryAgainRate`. */
export const RECENT_LIMIT = 10;
/** Plan caps (a stored plan from a newer client is trimmed to these). */
export const MAX_PLAN_ITEMS = 8;
export const MAX_PLAN_WORDS = 6;
export const MAX_WORD_CARDS = 8;

function rungUp(intervalDays: number): number {
  return LADDER_DAYS.find((d) => d > intervalDays) ?? LADDER_DAYS[LADDER_DAYS.length - 1];
}

function rungDown(intervalDays: number): number {
  let out = 0;
  for (const d of LADDER_DAYS) if (d < intervalDays) out = d;
  return out;
}

function emptyHead(): TajweedHeadProgress {
  return { attempts: 0, matched: 0, tryAgain: 0, notSure: 0 };
}

/** Record one drill take for a head. Pure; returns a new state. */
export function recordDrillVerdict(
  state: TajweedCoachingState,
  head: TajweedDrillHeadId,
  verdict: DrillVerdict,
  now: Date,
): TajweedCoachingState {
  const base = state.heads[head] ?? emptyHead();
  const today = getLocalDateString(now);
  const next: TajweedHeadProgress = {
    ...base,
    attempts: base.attempts + 1,
    lastAt: now.toISOString(),
  };
  const interval = base.intervalDays ?? 0;
  if (verdict === "matched") {
    next.matched = base.matched + 1;
    next.intervalDays = rungUp(interval);
    next.nextDueAt = addDays(today, next.intervalDays);
    next.recent = [...(base.recent ?? []), "m" as const].slice(-RECENT_LIMIT);
  } else if (verdict === "try-again") {
    next.tryAgain = base.tryAgain + 1;
    next.intervalDays = rungDown(interval);
    next.nextDueAt = addDays(today, next.intervalDays);
    next.recent = [...(base.recent ?? []), "t" as const].slice(-RECENT_LIMIT);
  } else {
    next.notSure = base.notSure + 1;
  }
  return { ...state, heads: { ...state.heads, [head]: next } };
}

/** "I listened and repeated" on a listen card: self-reported, moves it out one rung. */
export function recordListened(
  state: TajweedCoachingState,
  category: TajweedListenCategory,
  now: Date,
): TajweedCoachingState {
  const base = state.listened?.[category] ?? { count: 0 };
  const intervalDays = rungUp(base.intervalDays ?? 0);
  const next: TajweedListenProgress = {
    count: base.count + 1,
    lastAt: now.toISOString(),
    intervalDays,
    nextDueAt: addDays(getLocalDateString(now), intervalDays),
  };
  return { ...state, listened: { ...state.listened, [category]: next } };
}

/** Share of the head's recent judged takes that were "try again" (0 with none). */
export function recentTryAgainRate(progress: TajweedHeadProgress | undefined): number {
  const recent = progress?.recent ?? [];
  if (recent.length === 0) return 0;
  return recent.filter((v) => v === "t").length / recent.length;
}

/** Next due day of a plan item, or null when it was never practised (due now). */
export function itemNextDue(state: TajweedCoachingState, key: string): string | null {
  const category = planItemCategory(key);
  if (!category) return null;
  if (isDrillHead(category)) return state.heads[category]?.nextDueAt ?? null;
  return state.listened?.[category as TajweedListenCategory]?.nextDueAt ?? null;
}

export function isItemDue(state: TajweedCoachingState, key: string, day: string): boolean {
  const next = itemNextDue(state, key);
  return next == null || next <= day;
}

/** Plan items due on `day` (local YYYY-MM-DD). */
export function duePlanItems(state: TajweedCoachingState, day: string): TajweedPlanItem[] {
  return (state.plan?.items ?? []).filter((item) => isItemDue(state, item.head, day));
}

/** Per local day for the next `days` days: does the plan have anything to practise? */
export function coachingDueByDay(
  state: TajweedCoachingState,
  now: Date,
  days: number,
): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  const start = getLocalDateString(now);
  for (let i = 0; i < days; i++) {
    const day = addDays(start, i);
    out[day] = duePlanItems(state, day).length > 0;
  }
  return out;
}

// ── sanitize + merge (blob sync) ───────────────────────────────────────────────

const isObj = (v: unknown): v is Record<string, unknown> =>
  v != null && typeof v === "object" && !Array.isArray(v);
const count = (v: unknown): number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
const str = (v: unknown): string | undefined => (typeof v === "string" && v ? v : undefined);
const interval = (v: unknown): number | undefined =>
  typeof v === "number" && (LADDER_DAYS as readonly number[]).includes(v) ? v : undefined;

function sanitizeHead(v: unknown): TajweedHeadProgress | null {
  if (!isObj(v)) return null;
  const out: TajweedHeadProgress = {
    attempts: count(v.attempts),
    matched: count(v.matched),
    tryAgain: count(v.tryAgain),
    notSure: count(v.notSure),
  };
  const lastAt = str(v.lastAt);
  const nextDueAt = str(v.nextDueAt);
  const intervalDays = interval(v.intervalDays);
  if (lastAt) out.lastAt = lastAt;
  if (nextDueAt) out.nextDueAt = nextDueAt;
  if (intervalDays != null) out.intervalDays = intervalDays;
  if (Array.isArray(v.recent)) {
    out.recent = v.recent
      .filter((x): x is TajweedRecentVerdict => x === "m" || x === "t")
      .slice(-RECENT_LIMIT);
  }
  return out;
}

function sanitizeListen(v: unknown): TajweedListenProgress | null {
  if (!isObj(v)) return null;
  const out: TajweedListenProgress = { count: count(v.count) };
  const lastAt = str(v.lastAt);
  const nextDueAt = str(v.nextDueAt);
  const intervalDays = interval(v.intervalDays);
  if (lastAt) out.lastAt = lastAt;
  if (nextDueAt) out.nextDueAt = nextDueAt;
  if (intervalDays != null) out.intervalDays = intervalDays;
  return out;
}

function sanitizeWordRef(v: unknown): TajweedWordRef | null {
  if (!isObj(v)) return null;
  const { surah, ayah, wordIndex } = v;
  if (
    !Number.isInteger(surah) ||
    !Number.isInteger(ayah) ||
    !Number.isInteger(wordIndex) ||
    (surah as number) < 1 ||
    (surah as number) > 114 ||
    (ayah as number) < 1 ||
    (wordIndex as number) < 0
  )
    return null;
  return { surah: surah as number, ayah: ayah as number, wordIndex: wordIndex as number };
}

function sanitizePlan(v: unknown): TajweedCoachingPlan | undefined {
  if (!isObj(v)) return undefined;
  const createdAt = str(v.createdAt);
  if (!createdAt || !Array.isArray(v.items)) return undefined;
  const items: TajweedPlanItem[] = [];
  for (const raw of v.items) {
    if (!isObj(raw) || typeof raw.head !== "string" || !planItemCategory(raw.head)) continue;
    const words = (Array.isArray(raw.words) ? raw.words : [])
      .map(sanitizeWordRef)
      .filter((w): w is TajweedWordRef => w != null)
      .slice(0, MAX_PLAN_WORDS);
    const item: TajweedPlanItem = { head: raw.head as TajweedPlanItem["head"], words };
    if (typeof raw.occurrences === "number") item.occurrences = count(raw.occurrences);
    items.push(item);
  }
  const plan: TajweedCoachingPlan = { createdAt, items: items.slice(0, MAX_PLAN_ITEMS) };
  if (Array.isArray(v.wordCards)) {
    const cards: TajweedWordCard[] = [];
    for (const raw of v.wordCards) {
      const ref = sanitizeWordRef(raw);
      if (!ref || !isObj(raw) || !Array.isArray(raw.categories)) continue;
      const categories = raw.categories.filter(
        (c): c is TajweedWordCard["categories"][number] =>
          typeof c === "string" && (isDrillHead(c) || isListenCategory(c)),
      );
      if (categories.length) cards.push({ ...ref, categories });
    }
    plan.wordCards = cards.slice(0, MAX_WORD_CARDS);
  }
  return plan;
}

/** Stored / remote value → a valid state (unknown keys dropped, counts clamped). */
export function sanitizeTajweedCoaching(value: unknown): TajweedCoachingState {
  if (!isObj(value)) return { ...EMPTY_TAJWEED_COACHING, heads: {} };
  const heads: TajweedCoachingState["heads"] = {};
  if (isObj(value.heads)) {
    for (const id of DRILL_HEAD_IDS) {
      const head = sanitizeHead(value.heads[id]);
      if (head) heads[id] = head;
    }
  }
  const out: TajweedCoachingState = { schemaVersion: 1, heads };
  if (isObj(value.listened)) {
    const listened: NonNullable<TajweedCoachingState["listened"]> = {};
    for (const id of LISTEN_CATEGORIES) {
      const entry = sanitizeListen(value.listened[id]);
      if (entry) listened[id] = entry;
    }
    out.listened = listened;
  }
  const plan = sanitizePlan(value.plan);
  if (plan) out.plan = plan;
  return out;
}

function later<T extends { lastAt?: string }>(
  a: T | undefined,
  b: T | undefined,
  size: (x: T) => number,
): T | undefined {
  if (!a) return b;
  if (!b) return a;
  const la = a.lastAt ?? "";
  const lb = b.lastAt ?? "";
  if (la !== lb) return la > lb ? a : b;
  return size(a) >= size(b) ? a : b;
}

/**
 * Blob-sync merge: per head / listen card, the record with the later `lastAt`
 * wins (ties → more attempts); the newer plan wins. Both devices converge.
 */
export function mergeTajweedCoaching(local: unknown, remote: unknown): TajweedCoachingState {
  const a = sanitizeTajweedCoaching(local);
  const b = sanitizeTajweedCoaching(remote);
  const heads: TajweedCoachingState["heads"] = {};
  for (const id of DRILL_HEAD_IDS) {
    const winner = later(a.heads[id], b.heads[id], (h) => h.attempts);
    if (winner) heads[id] = winner;
  }
  const out: TajweedCoachingState = { schemaVersion: 1, heads };
  if (a.listened || b.listened) {
    const listened: NonNullable<TajweedCoachingState["listened"]> = {};
    for (const id of LISTEN_CATEGORIES) {
      const winner = later(a.listened?.[id], b.listened?.[id], (l) => l.count);
      if (winner) listened[id] = winner;
    }
    out.listened = listened;
  }
  const plan =
    !a.plan || (b.plan && b.plan.createdAt > a.plan.createdAt) ? (b.plan ?? a.plan) : a.plan;
  if (plan) out.plan = plan;
  return out;
}
