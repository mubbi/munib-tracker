/**
 * Family & kids mode (NF-3.16, D7) — pure rules shared by the parent view, the
 * kids shell and the fard-status push. No React, no I/O.
 *
 * Privacy (D7): the parent view shows a child's five fard statuses (✓ / –), the
 * child's own stickers and a reward bar. Nothing else is derived or shown — no
 * qaza, no notes, no comparison between siblings, no "missed" state (absence of
 * a signal is simply "no signal").
 */
import {
  CIRCLE_LIMITS,
  type CircleRole,
  type CircleType,
  FARD_PRAYERS,
  type FardPrayer,
  type FardStatusValue,
  MANAGER_ROLES,
} from "@munib-tracker/shared/circles";
import type { PrayerStatus } from "@munib-tracker/shared/types";
import { addDays } from "@munib-tracker/shared/utils";

import type { CircleSignal, CircleSummary } from "./api";

export const EMPTY_FARD_STATUS: FardStatusValue = {
  fajr: false,
  dhuhr: false,
  asr: false,
  maghrib: false,
  isha: false,
};

/** Tracker statuses that count as "prayed" for the shared signal (late / made up included). */
const PRAYED: ReadonlySet<PrayerStatus> = new Set<PrayerStatus>(["completed", "delayed", "qaza"]);

/**
 * The closed `fard_status` value for a day, from the tracker's per-prayer
 * statuses. Only the five booleans leave the device — never notes, qaza or
 * excused reasons.
 */
export function fardValueFromStatuses(
  statuses: Partial<Record<string, PrayerStatus | undefined>>,
): FardStatusValue {
  const value = { ...EMPTY_FARD_STATUS };
  for (const prayer of FARD_PRAYERS) {
    const status = statuses[prayer];
    value[prayer] = status != null && PRAYED.has(status);
  }
  return value;
}

export function isFardStatusValue(value: unknown): value is FardStatusValue {
  if (!value || typeof value !== "object") return false;
  return FARD_PRAYERS.every((p) => typeof (value as Record<string, unknown>)[p] === "boolean");
}

export function sameFardStatus(a: FardStatusValue, b: FardStatusValue): boolean {
  return FARD_PRAYERS.every((p) => a[p] === b[p]);
}

export function prayedCount(value: FardStatusValue | null | undefined): number {
  if (!value) return 0;
  return FARD_PRAYERS.reduce((n, p) => n + (value[p] ? 1 : 0), 0);
}

export function toggleFard(value: FardStatusValue, prayer: FardPrayer): FardStatusValue {
  return { ...value, [prayer]: !value[prayer] };
}

// ---------------------------------------------------------------------------
// Signal indexing
// ---------------------------------------------------------------------------

export type MemberDay = { fard: FardStatusValue | null; rest: boolean };

/** `memberId → date → { fard, rest }` from a signals response. */
export function indexSignals(
  signals: readonly CircleSignal[],
): Map<string, Map<string, MemberDay>> {
  const out = new Map<string, Map<string, MemberDay>>();
  for (const signal of signals) {
    let days = out.get(signal.memberId);
    if (!days) {
      days = new Map();
      out.set(signal.memberId, days);
    }
    const day = days.get(signal.date) ?? { fard: null, rest: false };
    if (signal.kind === "fard_status" && isFardStatusValue(signal.value)) {
      day.fard = { ...EMPTY_FARD_STATUS, ...signal.value };
    } else if (signal.kind === "rest_day") {
      day.rest = true;
    }
    days.set(signal.date, day);
  }
  return out;
}

/** A member's `fard_status` for one date from a signals list (null = no signal). */
export function fardOn(
  signals: readonly CircleSignal[],
  memberId: string,
  date: string,
): FardStatusValue | null {
  const signal = signals.find(
    (s) => s.kind === "fard_status" && s.memberId === memberId && s.date === date,
  );
  return signal && isFardStatusValue(signal.value)
    ? { ...EMPTY_FARD_STATUS, ...signal.value }
    : null;
}

/**
 * Optimistic copy of a signals list with one member's `fard_status` for `date`
 * replaced (or added). Used so a parent tapping two prayers quickly builds the
 * second write on the first — never on a stale server copy.
 */
export function upsertFardSignal(
  signals: readonly CircleSignal[],
  memberId: string,
  date: string,
  value: FardStatusValue,
  now: Date = new Date(),
): CircleSignal[] {
  const next: CircleSignal = {
    memberId,
    date,
    kind: "fard_status",
    value: { ...value },
    updatedAt: now.toISOString(),
  };
  let replaced = false;
  const out = signals.map((s) => {
    if (s.kind !== "fard_status" || s.memberId !== memberId || s.date !== date) return s;
    replaced = true;
    return next;
  });
  if (!replaced) out.push(next);
  return out;
}

/** Oldest → newest list of `count` ISO dates ending at `today`. */
export function lastNDates(today: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => addDays(today, i - count + 1));
}

/** `{ from, to }` for a signals read covering the last `count` days (≤ server max). */
export function signalWindow(today: string, count = 7): { from: string; to: string } {
  const span = Math.min(Math.max(1, count), CIRCLE_LIMITS.signalReadMaxDays);
  return { from: addDays(today, -(span - 1)), to: today };
}

// ---------------------------------------------------------------------------
// Stars, stickers, reward, weekly digest
// ---------------------------------------------------------------------------

/** One star per prayer logged that day. */
export function starsForDay(day: MemberDay | undefined): number {
  return prayedCount(day?.fard);
}

/** A sticker is earned on a day with all five logged. */
export function earnedSticker(day: MemberDay | undefined): boolean {
  return prayedCount(day?.fard) === FARD_PRAYERS.length;
}

/** Bundled sticker set (SF Symbols / Material names), picked deterministically per date. */
export const STICKERS = [
  { ios: "star.fill", android: "star", web: "star" },
  { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" },
  { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
  { ios: "leaf.fill", android: "eco", web: "eco" },
  { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  { ios: "heart.fill", android: "favorite", web: "favorite" },
] as const;

export function stickerForDate(date: string): (typeof STICKERS)[number] {
  let hash = 0;
  for (let i = 0; i < date.length; i++) hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
  return STICKERS[hash % STICKERS.length] as (typeof STICKERS)[number];
}

/**
 * Parent-defined reward ("All 5 for 7 days → park trip"): days with all five
 * logged inside the readable window, capped at the target. Not consecutive —
 * a day off never resets progress (gentle tone, §2.5).
 */
export function rewardProgress(
  days: Map<string, MemberDay> | undefined,
  targetDays: number,
): { done: number; target: number; ratio: number; reached: boolean } {
  let done = 0;
  for (const day of days?.values() ?? []) if (earnedSticker(day)) done++;
  const target = Math.max(1, targetDays);
  const capped = Math.min(done, target);
  return { done: capped, target, ratio: capped / target, reached: capped >= target };
}

/**
 * "Ali prayed 28 of 35 this week — mashaAllah." Rest days are excluded from
 * the possible total; a week with nothing logged returns `prayed: 0` and the
 * UI shows a gentle line instead of a number.
 */
export function weeklyDigest(
  days: Map<string, MemberDay> | undefined,
  today: string,
): { prayed: number; possible: number; restDays: number } {
  let prayed = 0;
  let restDays = 0;
  for (const date of lastNDates(today, 7)) {
    const day = days?.get(date);
    if (day?.rest) {
      restDays++;
      continue;
    }
    prayed += prayedCount(day?.fard);
  }
  return { prayed, possible: (7 - restDays) * FARD_PRAYERS.length, restDays };
}

// ---------------------------------------------------------------------------
// Roles & routing
// ---------------------------------------------------------------------------

export function isCircleManager(type: CircleType, role: CircleRole): boolean {
  return MANAGER_ROLES[type].includes(role);
}

/** Family parents (owner or parent role) manage child profiles. */
export function isFamilyParent(role: CircleRole): boolean {
  return role === "owner" || role === "parent";
}

/** Family and partner circles need a linked account; guests may only join khatm groups. */
export function canUseCircleType(type: CircleType, isAccount: boolean): boolean {
  return type === "khatm_group" || isAccount;
}

/**
 * Where a circle opens from the hub. Partner and khatm screens are owned by
 * NF-3.17 / NF-3.18; keep this the only place that knows their paths.
 */
export function circleHomeHref(circle: Pick<CircleSummary, "id" | "type">): string {
  switch (circle.type) {
    case "family":
      return `/family?circleId=${encodeURIComponent(circle.id)}`;
    case "partner":
      return `/partner?circleId=${encodeURIComponent(circle.id)}`;
    default:
      return `/khatm-groups?circleId=${encodeURIComponent(circle.id)}`;
  }
}
