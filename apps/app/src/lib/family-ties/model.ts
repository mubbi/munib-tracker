import type {
  ContactKind,
  FamilyTiesItem,
  FamilyTiesSettings,
  FamilyTiesSummary,
  Kinship,
  Relative,
  RelativeContactLog,
} from "@munib-tracker/shared/types";
import { addDays, diffInDays } from "@munib-tracker/shared/utils";

/**
 * Silat al-rahim (NF-3.7, plan §6) — pure model and due-list logic. Screens and
 * the store call these; nothing here reads the vault or the clock implicitly.
 */

export const KINSHIPS: readonly Kinship[] = [
  "mother",
  "father",
  "grandparent",
  "sibling",
  "child",
  "spouse_parent",
  "aunt_paternal",
  "aunt_maternal",
  "uncle_paternal",
  "uncle_maternal",
  "cousin",
  "niece_nephew",
  "other",
];

export const CONTACT_KINDS: readonly ContactKind[] = ["call", "visit", "message", "gift", "dua"];

/**
 * Default days between contacts, by kinship (plan: parents 2, grandparents 7,
 * siblings 7, aunts/uncles 30, cousins 60, other 90). Children follow siblings;
 * in-laws follow aunts/uncles; nieces/nephews follow cousins (conventional
 * choices for kinships the plan doesn't list — the person can edit any value).
 */
export const DEFAULT_CADENCE_DAYS: Record<Kinship, number> = {
  mother: 2,
  father: 2,
  grandparent: 7,
  sibling: 7,
  child: 7,
  spouse_parent: 30,
  aunt_paternal: 30,
  aunt_maternal: 30,
  uncle_paternal: 30,
  uncle_maternal: 30,
  cousin: 60,
  niece_nephew: 60,
  other: 90,
};

/** Priority weight (plan: mother 3, father 2, grandparents 1.5, siblings/children 1.2, others 1). */
export const KINSHIP_WEIGHT: Record<Kinship, number> = {
  mother: 3,
  father: 2,
  grandparent: 1.5,
  sibling: 1.2,
  child: 1.2,
  spouse_parent: 1,
  aunt_paternal: 1,
  aunt_maternal: 1,
  uncle_paternal: 1,
  uncle_maternal: 1,
  cousin: 1,
  niece_nephew: 1,
  other: 1,
};

export const CADENCE_MIN_DAYS = 1;
export const CADENCE_MAX_DAYS = 365;
/** One-tap cadence choices in the add/edit form (the stepper still allows any 1–365). */
export const CADENCE_PRESET_DAYS: readonly number[] = [2, 7, 14, 30, 60, 90];
/** A dua resets the due date only for relatives contacted this rarely or less (plan §6). */
export const DUA_RESETS_CADENCE_FROM_DAYS = 30;
export const RELATIVE_NAME_MAX_LENGTH = 60;
export const RELATIVE_NOTES_MAX_LENGTH = 280;

export const FAMILY_TIES_SETTINGS_ID = "settings";
export const DEFAULT_FAMILY_TIES_SETTINGS: FamilyTiesSettings = {
  type: "settings",
  digestWeekday: 5,
  digestTime: "after-jumuah",
};

export function isParent(kinship: Kinship): boolean {
  return kinship === "mother" || kinship === "father";
}

export function isRelative<T extends FamilyTiesItem>(
  item: T | undefined,
): item is Extract<T, Relative> {
  return item?.type === "relative";
}

export function isContactLog<T extends FamilyTiesItem>(
  item: T | undefined,
): item is Extract<T, RelativeContactLog> {
  return item?.type === "log";
}

export function isFamilyTiesSettings<T extends FamilyTiesItem>(
  item: T | undefined,
): item is Extract<T, FamilyTiesSettings> {
  return item?.type === "settings";
}

export function clampCadence(days: number): number {
  if (!Number.isFinite(days)) return DEFAULT_CADENCE_DAYS.other;
  return Math.min(CADENCE_MAX_DAYS, Math.max(CADENCE_MIN_DAYS, Math.round(days)));
}

export function normalizeFamilyTiesSettings(
  raw: Partial<FamilyTiesSettings> | undefined,
): FamilyTiesSettings {
  const weekday = raw?.digestWeekday;
  const time = raw?.digestTime;
  return {
    type: "settings",
    digestWeekday:
      typeof weekday === "number" && Number.isInteger(weekday) && weekday >= 0 && weekday <= 6
        ? weekday
        : DEFAULT_FAMILY_TIES_SETTINGS.digestWeekday,
    digestTime:
      time === "after-jumuah" || (typeof time === "string" && /^\d{2}:\d{2}$/.test(time))
        ? time
        : DEFAULT_FAMILY_TIES_SETTINGS.digestTime,
  };
}

/** The editable fields of a relative (prefills the edit form). */
export function relativeToInput(
  relative: Relative,
): Pick<Relative, "name" | "kinship" | "phone" | "cadenceDays" | "notes" | "paused" | "deceased"> {
  return {
    name: relative.name,
    kinship: relative.kinship,
    cadenceDays: relative.cadenceDays,
    ...(relative.phone ? { phone: relative.phone } : {}),
    ...(relative.notes ? { notes: relative.notes } : {}),
    ...(relative.paused ? { paused: true } : {}),
    ...(relative.deceased ? { deceased: true } : {}),
  };
}

// ── Due list ────────────────────────────────────────────────────────────────

/** Relatives that take part in reminders: living, not paused. */
export function isTracked(relative: Relative): boolean {
  return !relative.deceased && !relative.paused;
}

/** `lastContact.date + cadenceDays`; with no contact yet the relative is due on the day added. */
export function relativeDueDate(relative: Relative): string {
  if (!relative.lastContact) return relative.createdAt.slice(0, 10);
  return addDays(relative.lastContact.date, clampCadence(relative.cadenceDays));
}

/** Whole days past the due date (0 on the due date, negative before it). */
export function overdueDays(relative: Relative, today: string): number {
  return diffInDays(today, relativeDueDate(relative));
}

export function isDue(relative: Relative, today: string): boolean {
  return isTracked(relative) && overdueDays(relative, today) >= 0;
}

/** `overdueDays / cadenceDays × kinshipWeight` (plan §6). */
export function priorityScore(relative: Relative, today: string): number {
  const cadence = clampCadence(relative.cadenceDays);
  return (Math.max(0, overdueDays(relative, today)) / cadence) * KINSHIP_WEIGHT[relative.kinship];
}

export interface DueRelative<T extends Relative = Relative> {
  relative: T;
  dueDate: string;
  overdueDays: number;
  score: number;
}

/**
 * Relatives due today, highest priority first. Ties go to the kinship weight
 * (parents first), then the longest wait, then the name.
 */
export function buildDueList<T extends Relative>(
  relatives: readonly T[],
  today: string,
): DueRelative<T>[] {
  return relatives
    .filter((relative) => isDue(relative, today))
    .map((relative) => ({
      relative,
      dueDate: relativeDueDate(relative),
      overdueDays: overdueDays(relative, today),
      score: priorityScore(relative, today),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        KINSHIP_WEIGHT[b.relative.kinship] - KINSHIP_WEIGHT[a.relative.kinship] ||
        b.overdueDays - a.overdueDays ||
        a.relative.name.localeCompare(b.relative.name),
    );
}

/** Tracked relatives not yet due, soonest first. */
export function buildUpcomingList<T extends Relative>(
  relatives: readonly T[],
  today: string,
): DueRelative<T>[] {
  return relatives
    .filter((relative) => isTracked(relative) && !isDue(relative, today))
    .map((relative) => ({
      relative,
      dueDate: relativeDueDate(relative),
      overdueDays: overdueDays(relative, today),
      score: 0,
    }))
    .sort(
      (a, b) =>
        a.dueDate.localeCompare(b.dueDate) || a.relative.name.localeCompare(b.relative.name),
    );
}

// ── Logging a contact ───────────────────────────────────────────────────────

/**
 * Applies a contact to a relative. Every contact is logged; a dua moves the due
 * date only when the relative's cadence is ≥ 30 days — a dua is valuable but
 * doesn't replace contact (plan §6). An older back-dated contact never moves
 * `lastContact` backwards.
 */
export function applyContact(relative: Relative, kind: ContactKind, date: string): Relative {
  if (kind === "dua" && clampCadence(relative.cadenceDays) < DUA_RESETS_CADENCE_FROM_DAYS) {
    return relative;
  }
  if (relative.lastContact && relative.lastContact.date > date) return relative;
  return { ...relative, lastContact: { date, kind } };
}

/**
 * Recomputes `lastContact` from the remaining logs (after a log is removed),
 * applying the same dua rule. Undefined when no qualifying log remains.
 */
export function lastContactFromLogs(
  relativeId: string,
  relative: Relative,
  logs: readonly RelativeContactLog[],
): Relative["lastContact"] {
  let latest: Relative["lastContact"];
  for (const log of logs) {
    if (log.relativeId !== relativeId) continue;
    if (
      log.contact === "dua" &&
      clampCadence(relative.cadenceDays) < DUA_RESETS_CADENCE_FROM_DAYS
    ) {
      continue;
    }
    if (!latest || log.date > latest.date) latest = { date: log.date, kind: log.contact };
  }
  return latest;
}

// ── Read-only summary (home count + NF-3.14 coach) ──────────────────────────

/** Counts only — never names, numbers or notes. */
export function summarizeFamilyTies(
  relatives: readonly Relative[],
  logs: readonly RelativeContactLog[],
  asOf: string,
): FamilyTiesSummary {
  const tracked = relatives.filter(isTracked);
  const due = tracked.filter((relative) => isDue(relative, asOf));
  const weekStart = addDays(asOf, -6);
  return {
    tracked: tracked.length,
    dueCount: due.length,
    parentDue: due.some(
      (relative) => isParent(relative.kinship) && overdueDays(relative, asOf) > 0,
    ),
    contactsThisWeek: logs.filter((log) => log.date >= weekStart && log.date <= asOf).length,
    asOf,
  };
}

// ── Reminder inputs (no names) ──────────────────────────────────────────────

export interface FamilyTiesReminderInput {
  /** Due date per tracked relative (so the digest can count what's due on its fire day). */
  dueDates: string[];
  /** The first overdue day of each parent (one gentle nudge per episode). */
  parentNudgeDates: string[];
  digestWeekday: number;
  digestTime: string;
}

export function familyTiesReminderInput(
  relatives: readonly Relative[],
  settings: FamilyTiesSettings,
): FamilyTiesReminderInput {
  const tracked = relatives.filter(isTracked);
  return {
    dueDates: tracked.map(relativeDueDate),
    parentNudgeDates: tracked
      .filter((relative) => isParent(relative.kinship))
      .map((relative) => addDays(relativeDueDate(relative), 1)),
    digestWeekday: settings.digestWeekday,
    digestTime: settings.digestTime,
  };
}

/** How many of `dueDates` are due on `date`. */
export function dueCountOn(dueDates: readonly string[], date: string): number {
  return dueDates.filter((due) => due <= date).length;
}

// ── Contact actions (tel / sms / WhatsApp) ──────────────────────────────────

/** Keeps a leading "+" and digits only. `null` when too short to dial. */
export function normalizePhone(phone: string | undefined): string | null {
  if (!phone) return null;
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 3) return null;
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

export function telUrl(phone: string | undefined): string | null {
  const number = normalizePhone(phone);
  return number ? `tel:${number}` : null;
}

export function smsUrl(phone: string | undefined): string | null {
  const number = normalizePhone(phone);
  return number ? `sms:${number}` : null;
}

/** WhatsApp needs the international number without "+" (wa.me / whatsapp://send). */
export function whatsappUrls(phone: string | undefined): { app: string; web: string } | null {
  const number = normalizePhone(phone);
  if (!number) return null;
  const digits = number.replace(/^\+/, "");
  return { app: `whatsapp://send?phone=${digits}`, web: `https://wa.me/${digits}` };
}
