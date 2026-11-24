/**
 * NF-3.17 Accountability partner — pure rules (no React, no I/O).
 *
 * Privacy model (docs/CIRCLES.md, plan NF-3.17):
 *  - "My daily goal" stays on this device and is NEVER sent anywhere.
 *  - The only shared signal is `goal_done: { done: true }` for a local date.
 *    There is no "missed" state: a day is "done" or "no signal" (which also
 *    covers excused, private and skipped days).
 *  - No percentages, streak counts, totals or rankings — only dots.
 *  - Nudges are anonymous; a gentle reminder is shown to the receiver only after
 *    their own local Isha (the server doesn't know prayer times), and never
 *    during an excused period.
 */
import { CIRCLE_LIMITS, type CircleNudgeKind } from "@munib-tracker/shared/circles";
import type { PrayerStatus } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import type { CircleMember, CircleSignal, Nudge } from "./api";
import { circleErrorStatus } from "./api";
import { fardValueFromStatuses, lastNDates } from "./family";

// ---------------------------------------------------------------------------
// The private goal (device only)
// ---------------------------------------------------------------------------

export const PARTNER_GOAL_KINDS = ["fard5", "wird", "quranPages", "custom"] as const;
export type PartnerGoalKind = (typeof PARTNER_GOAL_KINDS)[number];

export type PartnerGoal =
  | { kind: "fard5" }
  | { kind: "wird" }
  | { kind: "quranPages"; pages: number }
  | { kind: "custom"; label: string };

export const PARTNER_GOAL_PAGES = { min: 1, max: 604, default: 2 } as const;
export const PARTNER_GOAL_LABEL_MAX = 60;

/** Normalizes any stored / edited value into a valid goal, or `null`. */
export function sanitizePartnerGoal(raw: unknown): PartnerGoal | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  switch (value.kind) {
    case "fard5":
    case "wird":
      return { kind: value.kind };
    case "quranPages": {
      const pages = Math.round(Number(value.pages));
      if (!Number.isFinite(pages)) return null;
      return {
        kind: "quranPages",
        pages: Math.min(PARTNER_GOAL_PAGES.max, Math.max(PARTNER_GOAL_PAGES.min, pages)),
      };
    }
    case "custom": {
      const label =
        typeof value.label === "string"
          ? value.label
              .replace(/\p{Cc}+/gu, " ")
              .trim()
              .slice(0, PARTNER_GOAL_LABEL_MAX)
          : "";
      return label ? { kind: "custom", label } : null;
    }
    default:
      return null;
  }
}

/** Goals keyed by circle id (each partner circle may have its own private goal). */
export type PartnerGoalMap = Record<string, PartnerGoal>;

export function sanitizePartnerGoalMap(raw: unknown): PartnerGoalMap {
  if (!raw || typeof raw !== "object") return {};
  const out: PartnerGoalMap = {};
  for (const [circleId, goal] of Object.entries(raw as Record<string, unknown>)) {
    const clean = sanitizePartnerGoal(goal);
    if (clean && circleId) out[circleId] = clean;
  }
  return out;
}

/** "All 5 fard" is met when every fard Salah is logged as prayed (late / made up count). */
export function fard5GoalMet(statuses: Partial<Record<string, PrayerStatus | undefined>>): boolean {
  return Object.values(fardValueFromStatuses(statuses)).every(Boolean);
}

/**
 * A local hint only ("Looks done — share it?"). The app never auto-shares:
 * the member confirms every day, and may skip sharing any day.
 */
export function goalLooksMet(
  goal: PartnerGoal | null,
  statuses: Partial<Record<string, PrayerStatus | undefined>>,
): boolean {
  return goal?.kind === "fard5" && fard5GoalMet(statuses);
}

// ---------------------------------------------------------------------------
// Dots ("done" / "no signal")
// ---------------------------------------------------------------------------

export type PartnerDayState = "done" | "none";

export type PartnerMemberRow = {
  memberId: string;
  displayName: string | null;
  isMe: boolean;
  paused: boolean;
  /** Oldest → newest; the last entry is today. */
  days: Array<{ date: string; state: PartnerDayState }>;
};

export const PARTNER_DOT_DAYS = 7;

/**
 * One row per adult member (me first, then by join time). A paused member's
 * dots are all "no signal" for everyone else; the server already hides their
 * signals, this keeps the UI honest if a cached read is shown.
 */
export function buildPartnerRows(
  members: readonly CircleMember[],
  signals: readonly CircleSignal[],
  today: string,
  dayCount = PARTNER_DOT_DAYS,
): PartnerMemberRow[] {
  const dates = lastNDates(today, dayCount);
  const done = new Set(
    signals
      .filter((s) => s.kind === "goal_done" && s.value?.done === true)
      .map((s) => `${s.memberId}|${s.date}`),
  );
  return members
    .filter((m) => m.memberKind === "user")
    .slice()
    .sort((a, b) => {
      if (a.isMe !== b.isMe) return a.isMe ? -1 : 1;
      return a.joinedAt.localeCompare(b.joinedAt);
    })
    .map((m) => ({
      memberId: m.memberId,
      displayName: m.displayName,
      isMe: m.isMe,
      paused: m.paused,
      days: dates.map((date) => ({
        date,
        state:
          (!m.paused || m.isMe) && done.has(`${m.memberId}|${date}`)
            ? ("done" as const)
            : ("none" as const),
      })),
    }));
}

/** Did I share "done" for `date`? */
export function sharedDoneOn(
  signals: readonly CircleSignal[],
  myMemberId: string,
  date: string,
): boolean {
  return signals.some(
    (s) => s.kind === "goal_done" && s.memberId === myMemberId && s.date === date && s.value?.done,
  );
}

export function partnerRoomLeft(memberCount: number): number {
  return Math.max(0, CIRCLE_LIMITS.partnerMaxMembers - memberCount);
}

// ---------------------------------------------------------------------------
// Received nudges (anonymous)
// ---------------------------------------------------------------------------

/** Fallback when Isha can't be computed (polar days, no location): 21:00 local. */
const FALLBACK_REMINDER_HOUR = 21;

export function reminderVisibleFrom(today: Date, isha: Date | null): Date {
  if (isha && !Number.isNaN(isha.getTime())) return isha;
  const fallback = new Date(today);
  fallback.setHours(FALLBACK_REMINDER_HOUR, 0, 0, 0);
  return fallback;
}

export type VisibleNudges = {
  /** Anonymous "someone made dua for you" (last 7 days, server window). */
  duas: Nudge[];
  /** Today's gentle reminder — only after local Isha, never while excused. */
  reminder: Nudge | null;
};

/**
 * What the receiver sees. Duas show as they arrive. A reminder sent today shows
 * once the receiver's own Isha time has begun (plan: "only after Isha time in
 * the receiver's timezone"); older reminders are stale and dropped, and an
 * excused period hides reminders entirely (gentle-tone rule §2.5).
 */
export function visibleNudges(
  nudges: readonly Nudge[],
  opts: { now: Date; isha: Date | null; excused: boolean },
): VisibleNudges {
  const today = getLocalDateString(opts.now);
  const showRemindersFrom = reminderVisibleFrom(opts.now, opts.isha);
  const duas = nudges
    .filter((n) => n.kind === "dua")
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const reminder =
    opts.excused || opts.now.getTime() < showRemindersFrom.getTime()
      ? null
      : (nudges.find(
          (n) => n.kind === "reminder" && getLocalDateString(new Date(n.createdAt)) === today,
        ) ?? null);
  return { duas, reminder };
}

/** Duas received today (local) — the banner says "Someone made dua for you". */
export function duasToday(duas: readonly Nudge[], now: Date): number {
  const today = getLocalDateString(now);
  return duas.filter((n) => getLocalDateString(new Date(n.createdAt)) === today).length;
}

// ---------------------------------------------------------------------------
// Sending nudges
// ---------------------------------------------------------------------------

/** `${toMemberId}|${kind}` — D32: one nudge per kind per pair per (UTC) day. */
export function nudgeSlotKey(toMemberId: string, kind: CircleNudgeKind): string {
  return `${toMemberId}|${kind}`;
}

export type NudgeOutcome = "sent" | "alreadySent" | "offline" | "error";

export function nudgeOutcomeFromError(error: unknown): NudgeOutcome {
  const status = circleErrorStatus(error);
  if (status === 429) return "alreadySent";
  if (status === 0) return "offline";
  return "error";
}

/** i18n key for a send result (429 copy is per kind, D32). */
export function nudgeOutcomeKey(kind: CircleNudgeKind, outcome: NudgeOutcome): string {
  switch (outcome) {
    case "sent":
      return kind === "dua" ? "partnerCircle.nudge.duaSent" : "partnerCircle.nudge.reminderSent";
    case "alreadySent":
      return kind === "dua"
        ? "partnerCircle.nudge.alreadyDua"
        : "partnerCircle.nudge.alreadyReminder";
    case "offline":
      return "partnerCircle.nudge.offline";
    default:
      return "partnerCircle.nudge.error";
  }
}
