/**
 * NF-3.18 Group khatm — pure client rules (no React, no I/O).
 *
 * The server is authoritative (compare-and-set part transitions, 409 on a lost
 * race — docs/CIRCLES.md). This module gives the UI: which actions a member may
 * take on a part, an optimistic copy of the grid while a request is in flight,
 * error classification, the reader deep link for a part and calm progress /
 * deadline numbers. No leaderboards: there is no per-member tally anywhere.
 */
import {
  applyKhatmDeal,
  type CircleRole,
  isKhatmDeadlinePassed,
  KHATM_ROUND_ROBIN_MIN_MEMBERS,
  KHATM_UNIT_PART_COUNT,
  type KhatmAssignmentMode,
  type KhatmDealMove,
  type KhatmUnit,
  MANAGER_ROLES,
  planKhatmDeal,
} from "@munib-tracker/shared/circles";
import { diffInDays } from "@munib-tracker/shared/utils";

import type { CircleMember, Khatm, KhatmDetail, KhatmPart, KhatmPartAction } from "./api";
import { circleErrorStatus } from "./api";

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

/** Khatm-group managers (owner / admin) can assign, reassign, extend and start rounds. */
export function isKhatmManager(role: CircleRole): boolean {
  return MANAGER_ROLES.khatm_group.includes(role);
}

/** The active khatm of a group (newest first from the API), else the latest one. */
export function currentKhatm<T extends Pick<Khatm, "status" | "createdAt">>(
  khatms: readonly T[],
): T | null {
  return khatms.find((k) => k.status === "active") ?? khatms[0] ?? null;
}

// ---------------------------------------------------------------------------
// Part actions
// ---------------------------------------------------------------------------

export type KhatmUiAction = KhatmPartAction | "read" | "assign" | "reassignStale";

export type PartActionContext = {
  myMemberId: string;
  isManager: boolean;
  khatm: Pick<Khatm, "status" | "assignmentMode" | "deadlinePassed">;
  /** TV is read-only. */
  readOnly?: boolean;
};

/**
 * Actions offered for one part, in display order. Mirrors the server rules so
 * the UI never offers a button that is bound to fail:
 *  - open → claim (in creator-assigns mode only managers, or anyone once the
 *    deadline has passed), managers may assign;
 *  - mine → read (opens the reader), mark reading, done, give back;
 *  - someone else's → managers may reassign once it is stale (or in
 *    creator-assigns mode / after the deadline), and the UI asks them to check
 *    with the member first;
 *  - done → nothing.
 */
export function partActions(part: KhatmPart, ctx: PartActionContext): KhatmUiAction[] {
  if (ctx.readOnly || ctx.khatm.status !== "active" || part.status === "done") return [];
  const mine = part.assigneeMemberId != null && part.assigneeMemberId === ctx.myMemberId;
  if (part.status === "open") {
    const actions: KhatmUiAction[] = [];
    if (
      ctx.khatm.assignmentMode !== "creator_assigns" ||
      ctx.isManager ||
      ctx.khatm.deadlinePassed
    ) {
      actions.push("claim");
    }
    if (ctx.isManager) actions.push("assign");
    return actions;
  }
  if (mine) {
    const actions: KhatmUiAction[] = ["read"];
    if (part.status === "assigned") actions.push("reading");
    actions.push("complete", "release");
    return actions;
  }
  if (ctx.isManager) {
    const reassignable =
      part.stale || ctx.khatm.assignmentMode === "creator_assigns" || ctx.khatm.deadlinePassed;
    return reassignable ? ["reassignStale", "release"] : [];
  }
  return [];
}

/**
 * Optimistic copy of the grid after `action` on `partNo` by `myMemberId`.
 * The server answer replaces it; a 409 rolls back and refetches.
 */
export function applyOptimisticPartAction(
  detail: KhatmDetail,
  partNo: number,
  action: KhatmPartAction | { assign: string | null },
  myMemberId: string,
  now: Date = new Date(),
): KhatmDetail {
  const updatedAt = now.toISOString();
  let doneDelta = 0;
  const parts = detail.parts.map((part) => {
    if (part.partNo !== partNo) return part;
    const next = nextPartState(part, action, myMemberId);
    if (next.status === "done" && part.status !== "done") doneDelta += 1;
    if (next.status !== "done" && part.status === "done") doneDelta -= 1;
    return { ...next, updatedAt, stale: false };
  });
  const doneCount = Math.max(0, detail.doneCount + doneDelta);
  return {
    ...detail,
    parts,
    doneCount,
    status: doneCount >= detail.partCount ? "completed" : detail.status,
  };
}

function nextPartState(
  part: KhatmPart,
  action: KhatmPartAction | { assign: string | null },
  myMemberId: string,
): KhatmPart {
  // A claim or a manager's pick is never re-dealt (`dealt: false`, as on the server).
  if (typeof action === "object") {
    return action.assign
      ? { ...part, assigneeMemberId: action.assign, status: "assigned", dealt: false }
      : { ...part, assigneeMemberId: null, status: "open", dealt: false };
  }
  switch (action) {
    case "claim":
      return { ...part, assigneeMemberId: myMemberId, status: "assigned", dealt: false };
    case "release":
      return { ...part, assigneeMemberId: null, status: "open", dealt: false };
    case "reading":
      return { ...part, status: "reading", dealt: false };
    case "complete":
      return { ...part, status: "done", dealt: false };
  }
}

// ---------------------------------------------------------------------------
// Round-robin dealing (mirrors the server's `planKhatmDeal` — docs/CIRCLES.md)
// ---------------------------------------------------------------------------

/** Account members in join order — the order the server deals round-robin parts in. */
export function roundRobinMemberIds(members: readonly CircleMember[]): string[] {
  return members
    .filter((m) => m.memberKind === "user")
    .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt) || a.memberId.localeCompare(b.memberId))
    .map((m) => m.memberId);
}

export type KhatmDealState =
  /** Not a round-robin khatm, not active, or not a manager / read-only: no deal UI. */
  | { kind: "none" }
  /** Round-robin with fewer than 2 members: parts stay open until someone joins. */
  | { kind: "waiting" }
  /** Some not-started parts can be dealt (`moves` is the server's plan). */
  | { kind: "ready"; moves: KhatmDealMove[] }
  /** Everything not started is already shared out evenly. */
  | { kind: "balanced" };

/** What the "Deal remaining parts" card should show for a manager. */
export function khatmDealState(
  detail: Pick<KhatmDetail, "assignmentMode" | "status" | "parts">,
  members: readonly CircleMember[],
  ctx: { isManager: boolean; readOnly?: boolean },
): KhatmDealState {
  if (!ctx.isManager || ctx.readOnly) return { kind: "none" };
  if (detail.assignmentMode !== "round_robin" || detail.status !== "active") {
    return { kind: "none" };
  }
  const ids = roundRobinMemberIds(members);
  if (ids.length < KHATM_ROUND_ROBIN_MIN_MEMBERS) return { kind: "waiting" };
  const moves = planKhatmDeal(detail.parts, ids);
  return moves.length ? { kind: "ready", moves } : { kind: "balanced" };
}

/** Optimistic grid after "Deal remaining parts"; the server answer replaces it. */
export function applyOptimisticDeal(
  detail: KhatmDetail,
  members: readonly CircleMember[],
  now: Date = new Date(),
): KhatmDetail {
  const moves = planKhatmDeal(detail.parts, roundRobinMemberIds(members));
  if (!moves.length) return detail;
  const moved = new Set(moves.map((m) => m.partNo));
  const updatedAt = now.toISOString();
  return {
    ...detail,
    parts: applyKhatmDeal(detail.parts, moves).map((part) =>
      moved.has(part.partNo) ? { ...part, updatedAt, stale: false } : part,
    ),
  };
}

/** i18n key for the "how parts are shared out" hint of an assignment mode. */
export function assignmentModeHintKey(mode: KhatmAssignmentMode): string {
  return mode === "round_robin" ? "khatmGroups.deal.hint" : `khatmGroups.grid.hint.${mode}`;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export type KhatmErrorKind =
  | "conflict"
  | "gone"
  | "notFound"
  | "forbidden"
  | "rateLimited"
  | "offline"
  | "unknown";

/** 409 = lost a race (someone else took / changed it), 410 = invite gone. */
export function classifyKhatmError(error: unknown): KhatmErrorKind {
  const status = circleErrorStatus(error);
  if (status === 0) return "offline";
  if (status === 409) return "conflict";
  if (status === 410) return "gone";
  if (status === 404) return "notFound";
  if (status === 403) return "forbidden";
  if (status === 429) return "rateLimited";
  return "unknown";
}

export function khatmErrorKey(kind: KhatmErrorKind): string {
  return `khatmGroups.error.${kind}`;
}

// ---------------------------------------------------------------------------
// Progress & deadline (calm — no rankings)
// ---------------------------------------------------------------------------

export type KhatmProgress = {
  done: number;
  reading: number;
  claimed: number;
  open: number;
  total: number;
  /** 0..1 for a progress bar. */
  fraction: number;
};

export function khatmProgress(detail: Pick<KhatmDetail, "parts" | "partCount">): KhatmProgress {
  const counts = { done: 0, reading: 0, claimed: 0, open: 0 };
  for (const part of detail.parts) {
    if (part.status === "done") counts.done += 1;
    else if (part.status === "reading") counts.reading += 1;
    else if (part.status === "assigned") counts.claimed += 1;
    else counts.open += 1;
  }
  const total = detail.partCount || detail.parts.length;
  return { ...counts, total, fraction: total ? counts.done / total : 0 };
}

export type DeadlineState =
  | { kind: "none" }
  | { kind: "upcoming"; daysLeft: number }
  | { kind: "today" }
  | { kind: "passed"; daysAgo: number };

/** Countdown in whole local days (`today` and `deadline` are YYYY-MM-DD). */
export function deadlineState(deadline: string | null, today: string): DeadlineState {
  if (!deadline) return { kind: "none" };
  const days = diffInDays(deadline, today);
  if (days > 0) return { kind: "upcoming", daysLeft: days };
  if (days === 0) return { kind: "today" };
  return { kind: "passed", daysAgo: -days };
}

/** Deadline passed while parts are still unfinished → managers may extend or open them. */
export function needsDeadlineDecision(
  khatm: Pick<KhatmDetail, "deadline" | "deadlinePassed" | "status" | "doneCount" | "partCount">,
  now: Date = new Date(),
): boolean {
  const passed = khatm.deadlinePassed || isKhatmDeadlinePassed(khatm.deadline, now);
  return khatm.status === "active" && passed && khatm.doneCount < khatm.partCount;
}

export function myParts(detail: Pick<KhatmDetail, "parts">, myMemberId: string): KhatmPart[] {
  return detail.parts.filter((p) => p.assigneeMemberId === myMemberId);
}

// ---------------------------------------------------------------------------
// Members (display names only — never account names)
// ---------------------------------------------------------------------------

/** Up to two letters for a grid cell, from the per-circle display name. */
export function memberInitials(displayName: string | null | undefined): string {
  const words = (displayName ?? "").trim().split(/\s+/u).filter(Boolean);
  if (!words.length) return "";
  const letters =
    words.length === 1 ? [...words[0]].slice(0, 2) : [[...words[0]][0], [...words[1]][0]];
  return letters.join("").toLocaleUpperCase();
}

export function memberById(
  members: readonly CircleMember[] | undefined,
  memberId: string | null,
): CircleMember | undefined {
  return memberId ? members?.find((m) => m.memberId === memberId) : undefined;
}

// ---------------------------------------------------------------------------
// Reader deep links
// ---------------------------------------------------------------------------

/**
 * Hizb starts (surah, ayah) from the bundled `assets/data/quran/ayah-meta`
 * (`hizb` field, 1..60). Metadata only — no scripture. A unit test checks this
 * table against the dataset.
 */
export const HIZB_STARTS: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [2, 75],
  [2, 142],
  [2, 203],
  [2, 253],
  [3, 15],
  [3, 93],
  [3, 171],
  [4, 24],
  [4, 88],
  [4, 148],
  [5, 27],
  [5, 82],
  [6, 36],
  [6, 111],
  [7, 1],
  [7, 88],
  [7, 171],
  [8, 41],
  [9, 34],
  [9, 93],
  [10, 26],
  [11, 6],
  [11, 84],
  [12, 53],
  [13, 19],
  [15, 1],
  [16, 51],
  [17, 1],
  [17, 99],
  [18, 75],
  [20, 1],
  [21, 1],
  [22, 1],
  [23, 1],
  [24, 21],
  [25, 21],
  [26, 111],
  [27, 56],
  [28, 51],
  [29, 46],
  [31, 22],
  [33, 31],
  [34, 24],
  [36, 28],
  [37, 145],
  [39, 32],
  [40, 41],
  [41, 47],
  [43, 24],
  [46, 1],
  [48, 18],
  [51, 31],
  [55, 1],
  [58, 1],
  [62, 1],
  [67, 1],
  [72, 1],
  [78, 1],
  [87, 1],
];

export function isValidPartNo(unit: KhatmUnit, partNo: number): boolean {
  return Number.isInteger(partNo) && partNo >= 1 && partNo <= KHATM_UNIT_PART_COUNT[unit];
}

/**
 * Where a part starts, for opening the Qur'an reader: a juz uses the standard
 * Hafs juz starts (`quran-meta` JUZ_STARTS, passed in to keep this module free
 * of the meta JSON), a hizb uses {@link HIZB_STARTS}, a surah opens at ayah 1.
 */
export function partStartAyah(
  unit: KhatmUnit,
  partNo: number,
  juzStarts: ReadonlyArray<readonly [number, number]>,
): { surah: number; ayah: number } | null {
  if (!isValidPartNo(unit, partNo)) return null;
  const start =
    unit === "juz"
      ? juzStarts[partNo - 1]
      : unit === "hizb"
        ? HIZB_STARTS[partNo - 1]
        : [partNo, 1];
  return start ? { surah: start[0], ayah: start[1] } : null;
}

/** i18n key + params for a part's short label ("Juz 3", "Hizb 12", "Surah 18"). */
export function partLabel(unit: KhatmUnit, partNo: number): { key: string; no: number } {
  return { key: `khatmGroups.unitPart.${unit}`, no: partNo };
}
