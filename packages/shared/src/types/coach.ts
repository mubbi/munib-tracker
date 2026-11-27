import type { ExcusedReason, ObligatoryPrayer } from "./prayer";

/**
 * NF-3.14 weekly gentle coach (D3: on-device only, deterministic rules + i18n
 * templates). The app builds a {@link CoachContext} from its trackers' public
 * read APIs; the pure engine in `utils/coach` turns it into a few kind,
 * actionable insights. Nothing here ever holds journal text, names or notes —
 * only counts.
 */

export type CoachRuleKind = "celebrate" | "suggest" | "plan";

/** One suggestion per area at most (tone rule). */
export type CoachArea =
  | "rest"
  | "progress"
  | "salah"
  | "rawatib"
  | "masjid"
  | "khushu"
  | "quran"
  | "qaza"
  | "habits"
  | "zikr"
  | "fasting"
  | "reflection"
  | "family"
  | "focus";

export type CoachRuleId =
  | "excused_week"
  | "personal_best"
  | "improvement"
  | "quran_streak"
  | "habit_consistent"
  | "adhkar_steady"
  | "fasting_kept"
  | "muhasabah_steady"
  | "showed_up"
  | "fajr_gap"
  | "delayed_pattern"
  | "weekday_dip"
  | "family_ties_due"
  | "khatm_behind"
  | "qaza_pace"
  | "khushu_low_prayer"
  | "rawatib_start"
  | "jama_rate"
  | "focus_emergency";

/** Per-fard tallies for one week (excused days left out, as in statistics). */
export interface CoachPrayerWeek {
  /** Logged "completed" (on time). */
  onTime: number;
  /** Logged "delayed". */
  delayed: number;
  /** Prayed in congregation (`isJama`) — completed or delayed. */
  jama: number;
  /** Days this salah counted (rate denominator). */
  days: number;
}

/** One week's figures, mapped by the app from `lib/statistics.ts` and friends. */
export interface CoachWeekStats {
  /** First day (YYYY-MM-DD) of the 7-day window. */
  weekStart: string;
  /** Days that count toward rates (tracked, not excused). */
  countedDays: number;
  excusedDays: number;
  /** Days with any tracked worship (salah, Qur'an, adhkar, habits, fasting). */
  activeDays: number;
  /** Days with all five fard on time. */
  perfectDays: number;
  fard: Record<ObligatoryPrayer, CoachPrayerWeek>;
  /** On-time fard share per weekday (index 0 = Sunday); null = that day didn't count. */
  weekdayLevels: readonly (number | null)[];
  /** Mu'akkadah rawatib rows completed / possible over counted days, and days with the Fajr sunnah. */
  rawatib: { done: number; possible: number; fajrDays: number };
  /** Days with Qur'an reading or practice. */
  quranDays: number;
  /** Days with the morning or evening adhkar set completed. */
  adhkarDays: number;
}

export interface CoachQazaInput {
  /** Fard qaza still owed (the user's own make-up tracker). */
  remaining: number;
  madeUpThisWeek: number;
  /** Projection at the recent pace / daily plan (`projectQazaFinish`), null without one. */
  perDay: number | null;
  finishDate: string | null;
}

export interface CoachKhatmInput {
  hasPlan: boolean;
  /** Whole days the reading trails the plan at the start of today (0 when on track). */
  daysBehind: number;
}

export interface CoachKhushuInput {
  /** Mean 1–5 self-rating over the last four weeks. */
  average: number;
  entries: number;
}

export interface CoachContext {
  week: CoachWeekStats;
  /** Up to four earlier weeks, newest first (for multi-week rules). */
  previousWeeks: readonly CoachWeekStats[];
  excused: {
    /** The period running right now (`activeExcusedReason`), if any. */
    active: ExcusedReason | null;
    /** The reason with the most excused days in the week, if any. */
    dominant: ExcusedReason | null;
  };
  /** Salah streaks (`computeStreak` / `longestStreak`); a broken streak never takes back what was earned. */
  streak: { current: number; best: number; bestBeforeWeek: number };
  qaza: CoachQazaInput | null;
  khatm: CoachKhatmInput;
  khushu: Partial<Record<ObligatoryPrayer, CoachKhushuInput>>;
  /** Selected Sunnah habits: days kept in the week (titles are resolved by the UI). */
  habits: readonly { id: string; doneDays: number }[];
  voluntaryFastsKept: number;
  homeMasjidSet: boolean;
  /** HH:mm bedtime preference (before-sleep reminder). */
  bedtime: string | null;
  /** Vault counts only; null when the vault can't be opened (rules skipped). */
  muhasabah: { reviewDays: number; istighfarDays: number } | null;
  family: { parentDue: boolean; dueCount: number; contactsThisWeek: number } | null;
  /**
   * NF-3.13 salah focus lock on this device: emergency unlocks during the
   * reviewed week (a neutral count — never a score). Null/absent when focus
   * lock was never set up here.
   */
  focusLock?: { emergencyUnlocks: number } | null;
}

/** Numbers (and ids such as a prayer or habit id) the copy template interpolates. */
export type CoachParams = Readonly<Record<string, number | string>>;

export type CoachGoalKind =
  | "fard_days"
  | "prayer_on_time"
  | "quran_days"
  | "fajr_sunnah_days"
  | "adhkar_days"
  | "masjid_salah"
  | "qaza_week"
  | "family_contact";

/** A micro-goal the user can accept for the coming week. */
export interface CoachGoalTemplate {
  kind: CoachGoalKind;
  target: number;
  prayerId?: ObligatoryPrayer;
}

export interface CoachEvidence {
  params: CoachParams;
  /** Variant suffix of the copy key (`<copyKey>.<variant>`), e.g. the metric or excused reason. */
  variant?: string;
  /** Corpus id rendered by reference only (`bukhari:6464`) — see docs/proofs/weekly-coach.md. */
  evidenceRef?: string;
  goal?: CoachGoalTemplate;
  /** Overrides the rule's default action (e.g. no khatm plan yet). */
  action?: CoachAction | null;
}

export interface CoachAction {
  /** App route (the app maps a few to settings rows). */
  route: string;
  labelKey: string;
}

export interface CoachInsight {
  ruleId: CoachRuleId;
  kind: CoachRuleKind;
  area: CoachArea;
  /** i18n base key; the UI reads `<copyKey>.title` and `<copyKey>.body[.<variant>]`. */
  copyKey: string;
  variant?: string;
  params: CoachParams;
  action?: CoachAction;
  evidenceRef?: string;
  goal?: CoachGoalTemplate;
}

/** An accepted micro-goal, checked against the week it applies to. */
export interface CoachGoal extends CoachGoalTemplate {
  /** First day of the week the goal is for. */
  weekStart: string;
  acceptedAt: string;
  /** Filled in once that week has been reviewed. */
  outcome?: { value: number; met: boolean };
}

/**
 * Blob entity `coach_history`: which insights were shown, accepted goals and
 * their outcomes, and the user's dismiss / snooze choices. No raw data.
 */
export interface CoachHistory {
  schemaVersion: 1;
  /** Reviewed week start → rule ids shown (drives cooldowns). */
  shown: Record<string, CoachRuleId[]>;
  goals: CoachGoal[];
  /** "Hide tips like this" — rules never shown again until restored. */
  dismissedRules: CoachRuleId[];
  /** Reviewed week whose home card was hidden ("until next week"). */
  snoozedWeek?: string;
  /** Last change to `dismissedRules` / `snoozedWeek` (LWW across devices). */
  updatedAt: string;
}

export type CoachMode = "normal" | "excused" | "quiet";

export interface CoachReport {
  weekStart: string;
  weekEnd: string;
  mode: CoachMode;
  insights: CoachInsight[];
  /** One micro-goal to accept (null when resting or nothing was tracked). */
  microGoal: CoachGoalTemplate | null;
  /** The goal accepted for this week, with how it went (never framed as failure). */
  lastGoal: { goal: CoachGoal; value: number; met: boolean } | null;
}
