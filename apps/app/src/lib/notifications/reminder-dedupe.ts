import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { normalizedBudgetPriority } from "@/lib/notifications/reminder-budget";

/**
 * With every reminder toggle on, several builders can alert for the same Salah
 * at the same moment — e.g. a +2 min Isha offset lands on the after-Adhan nudge,
 * a +10 min offset on the after-Salah nudge, the Tashriq takbir (fard + 10) on
 * the after-Salah adhkar, a 0-minute iqamah walk on the Salah alert. Two banners in the same minute
 * read as a duplicate, so {@link dedupeCollidingReminders} keeps one: the more
 * important (lower §11 priority), the earlier-built on a tie.
 *
 * The Friday hour-of-acceptance nudge at Asr is deliberately NOT anchored to the
 * Asr Salah: it is a different message (a Dua window), not a second Salah alert.
 */

/** Reminders closer than this for the same Salah (or with identical text) collide. */
export const REMINDER_COLLISION_WINDOW_MS = 60_000;

/** `prayer:isha:2026-11-24` → `isha|2026-11-24`, for every Salah-anchored id shape. */
export function prayerAnchorKey(id: string): string | null {
  const parts = id.split(":");
  if (parts.length !== 3) return null;
  const [kind, a, b] = parts as [string, string, string];
  switch (kind) {
    case "prayer":
    case "afterAzan":
    case "beforePrayer":
    case "afterPrayer":
    case "iqamah":
    case "preferredTime":
      return `${a}|${b}`;
    // `takbirTashriq:<day>:<prayer>`
    case "takbirTashriq":
      return `${b}|${a}`;
    default:
      return null;
  }
}

function collides(a: BuiltReminder, b: BuiltReminder): boolean {
  if (Math.abs(a.fireAt.getTime() - b.fireAt.getTime()) >= REMINDER_COLLISION_WINDOW_MS) {
    return false;
  }
  const keyA = prayerAnchorKey(a.id);
  if (keyA != null && keyA === prayerAnchorKey(b.id)) return true;
  return a.title === b.title && a.body === b.body;
}

/** Drops the less important of any two colliding reminders. Order is preserved. */
export function dedupeCollidingReminders(reminders: BuiltReminder[]): BuiltReminder[] {
  const ranked = reminders
    .map((reminder, index) => ({ reminder, index }))
    .sort(
      (x, y) =>
        normalizedBudgetPriority(x.reminder.priority) -
          normalizedBudgetPriority(y.reminder.priority) || x.index - y.index,
    );
  const kept: BuiltReminder[] = [];
  const keptIndexes = new Set<number>();
  for (const { reminder, index } of ranked) {
    if (kept.some((other) => collides(other, reminder))) continue;
    kept.push(reminder);
    keptIndexes.add(index);
  }
  return reminders.filter((_, index) => keptIndexes.has(index));
}
