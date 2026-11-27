/**
 * Notification budget tiers (plan §11). iOS keeps ~64 pending local
 * notifications, so when `buildReminders` produces more than
 * `MAX_PENDING_REMINDERS` the lowest tier is dropped first:
 *
 * | Tier     | Kinds                                                                |
 * | -------- | -------------------------------------------------------------------- |
 * | 1 (keep) | Salah, Adhan, existing Qaza                                          |
 * | 2        | Iqamah (home masjid), focus-lock confirm, suhoor (intended fasts)    |
 * | 3        | Fast intent (night before), Dhul-Hijjah / Arafah / Ashura seasonal   |
 * | 4        | Debts due, wasiyyah review                                           |
 * | 5        | Family-ties digest, muhasabah, habits, coach, rawatib nudge          |
 *
 * A reminder's numeric `priority` encodes both: `tier × 100 + rank`, where the
 * rank (0–99) orders kinds inside a tier (lower keeps its slot). Use
 * {@link budgetPriority} for new kinds — e.g. `budgetPriority(5)` for a
 * muhasabah nudge — so a new kind can never outrank a Salah alert by accident.
 * A bare tier (1–5) is also accepted and sorts last inside that tier.
 *
 * Kinds §11 doesn't name sit where they fit best, never in tier 1:
 * - D40 preferred time → tier 2, ranked after iqamah and suhoor (both carry a
 *   hard real-world deadline; the preferred time is an optional extra).
 * - Zikr nudges (after-Adhan, before/after-Salah, morning/evening/sleep adhkar),
 *   daily content, Jumu'ah / hour of acceptance, White Days, Qur'an revision →
 *   tier 3, ranked after the named fast-intent / seasonal kinds.
 *
 * In-tier ranks in use (lower keeps its slot): tier 2 — suhoor 5, iqamah 10,
 * preferred time 30; tier 3 — Dhul-Hijjah 60–68, fast intent 70, fasting
 * seasonal 72, zikr nudges 73–78, daily nudges 80–90.
 */

export type ReminderBudgetTier = 1 | 2 | 3 | 4 | 5;

/** §11 table, by reminder kind. New kinds add a row here (and a `notificationPrefs` toggle). */
export const REMINDER_BUDGET_TIER = {
  prayer: 1,
  adhan: 1,
  qaza: 1,
  iqamah: 2,
  focusLockConfirm: 2,
  suhoor: 2,
  /** D40 preferred-time reminder (school's preferred band) — prayer-adjacent, below iqamah and suhoor. */
  preferredTime: 2,
  fastIntent: 3,
  seasonal: 3,
  /**
   * Before/after-Salah and after-Adhan zikr nudges, morning/evening/sleep adhkar.
   * Not in §11 tier 1 (only Salah, Adhan and Qaza are), so a full budget drops
   * them before any suhoor, iqamah or fast-intent reminder.
   */
  salahZikr: 3,
  /** Daily content, Jumu'ah / hour of acceptance, White Days, Qur'an revision. */
  dailyNudge: 3,
  debtsDue: 4,
  wasiyyahReview: 4,
  familyTies: 5,
  muhasabah: 5,
  habits: 5,
  coach: 5,
  rawatibNudge: 5,
} as const satisfies Record<string, ReminderBudgetTier>;

export type ReminderBudgetKind = keyof typeof REMINDER_BUDGET_TIER;

const TIER_SPAN = 100;
const MAX_RANK = TIER_SPAN - 1;

/** Numeric priority for a tier plus an optional in-tier rank (0–99, lower keeps its slot first). */
export function budgetPriority(tier: ReminderBudgetTier, rank = MAX_RANK): number {
  const clamped = Math.min(MAX_RANK, Math.max(0, Math.round(rank)));
  return tier * TIER_SPAN + clamped;
}

/** Priority for a §11 kind (see {@link REMINDER_BUDGET_TIER}). */
export function priorityForKind(kind: ReminderBudgetKind, rank?: number): number {
  return budgetPriority(REMINDER_BUDGET_TIER[kind], rank);
}

/**
 * Normalises any stored priority onto the combined scale: a bare tier (1–5)
 * becomes the last rank of that tier; anything else is taken as-is.
 */
export function normalizedBudgetPriority(priority: number): number {
  if (Number.isInteger(priority) && priority >= 1 && priority <= 5) {
    return budgetPriority(priority as ReminderBudgetTier);
  }
  return priority;
}

/** The §11 tier a priority belongs to (out-of-range values clamp to 1 or 5). */
export function reminderBudgetTier(priority: number): ReminderBudgetTier {
  const tier = Math.floor(normalizedBudgetPriority(priority) / TIER_SPAN);
  return Math.min(5, Math.max(1, tier)) as ReminderBudgetTier;
}
