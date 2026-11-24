/**
 * Voluntary (nafl) fasting tracker — NF-3.2. The Ramadan log keeps its own
 * store (`fasting`); this model covers every other fast. Day kinds are derived
 * from the date (`classifyFastDay` in `utils/fasting-calendar.ts`), never stored.
 */

/** Recommended-fast kinds a calendar day can match. */
export type VoluntaryFastKind =
  | "monday"
  | "thursday"
  | "white_day"
  | "shawwal_six"
  | "arafah"
  | "tasua"
  | "ashura"
  | "muharram"
  | "shaban"
  | "dhul_hijjah_nine"
  | "dawud"
  | "other";

/** Ordered list of every kind (stable UI order). */
export const VOLUNTARY_FAST_KINDS: readonly VoluntaryFastKind[] = [
  "monday",
  "thursday",
  "white_day",
  "shawwal_six",
  "arafah",
  "tasua",
  "ashura",
  "muharram",
  "shaban",
  "dhul_hijjah_nine",
  "dawud",
  "other",
];

/** Weekly habit kinds (Mon/Thu) — the `weekly` reminder toggle; everything else is seasonal. */
export const WEEKLY_FAST_KINDS: readonly VoluntaryFastKind[] = ["monday", "thursday"];

export type FastDayRuling = "recommended" | "permitted" | "disliked" | "prohibited";

export type VoluntaryFastStatus = "intended" | "fasted" | "broken";

export interface VoluntaryFastEntry {
  status: VoluntaryFastStatus;
  /** When true this day is a qaza (make-up) fast, decrementing roza debt. */
  asQaza?: boolean;
  /**
   * Idempotency flag (mirrors `PrayerLog.qazaDebtAdded`): true once this entry
   * has decremented the roza qaza counter, so re-marking never double-counts and
   * undo restores exactly one day.
   */
  qazaCounted?: boolean;
  note?: string;
  /**
   * Tombstone: the user cleared this day. Kept (with a fresh `updatedAt`) so the
   * per-date last-write-wins sync merge propagates the removal.
   */
  deleted?: boolean;
  /** ISO datetime of the last change (per-date sync LWW). */
  updatedAt: string;
}

/** Local `YYYY-MM-DD` → entry. */
export type VoluntaryFastingMap = Record<string, VoluntaryFastEntry>;

export interface VoluntaryFastingPrefs {
  /** Kinds the user follows (reminders + suggestions). */
  enabledKinds: VoluntaryFastKind[];
  /** Fast of Dawud: alternate days counted from `startDate` (YYYY-MM-DD). */
  dawudMode?: { startDate: string } | null;
  /** "HH:mm" (default "21:00") or "isha+<minutes>" for the night-before intent reminder. */
  intentReminderTime: string;
  /** Optional suhoor alarm at Fajr − 45 min on intended days. */
  suhoorAlarm: boolean;
  /** Performing Hajj — Arafah is not recommended for the pilgrim at Arafah. Scoped by `pilgrimHijriYear`. */
  isPilgrimThisYear?: boolean;
  /**
   * Hijri year of the Hajj the flag applies to. The flag only counts in that
   * year, so it expires by itself after that Dhul-Hijjah (a flag with no year
   * is ignored). See `isPilgrimInHijriYear`.
   */
  pilgrimHijriYear?: number | null;
}

/** `notificationPrefs.voluntaryFasting` — weekly (Mon/Thu) vs seasonal kinds. */
export interface VoluntaryFastingNotificationPrefs {
  weekly: boolean;
  seasonal: boolean;
}

export const DEFAULT_VOLUNTARY_FASTING_PREFS: VoluntaryFastingPrefs = {
  enabledKinds: ["monday", "thursday", "white_day", "shawwal_six", "arafah", "tasua", "ashura"],
  dawudMode: null,
  intentReminderTime: "21:00",
  suhoorAlarm: false,
  isPilgrimThisYear: false,
  pilgrimHijriYear: null,
};

export const DEFAULT_VOLUNTARY_FASTING_NOTIFICATION_PREFS: VoluntaryFastingNotificationPrefs = {
  weekly: false,
  seasonal: true,
};

/** Result of classifying one calendar day. */
export interface FastDayClassification {
  /** Recommended kinds the day matches (empty on Eid / Tashriq / Ramadan). */
  kinds: VoluntaryFastKind[];
  ruling: FastDayRuling;
  /** i18n keys (`voluntaryFasting.reason.*`) explaining the ruling, most important first. */
  reasons: string[];
  /** Eid / Tashriq: logging `fasted` is blocked with an explanation. */
  blocking: boolean;
  /** Ramadan days belong to the Ramadan store and are excluded here. */
  isRamadan: boolean;
  /** Fiqh difference id to show a `MadhhabNote` for, when the day's ruling depends on the school. */
  madhhabNoteId?: "fasting.afterMidShaban";
  /** Hijri date the classification used. */
  hijri: { year: number; month: number; day: number };
}
