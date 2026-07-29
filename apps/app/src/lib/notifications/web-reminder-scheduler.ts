import type { BuiltReminder } from "@/lib/notifications/build-reminders";

/** setTimeout max delay (~24.8 days). Reminders beyond this are picked up on the next reschedule pass. */
const MAX_TIMEOUT_MS = 2_147_483_647;

export type WebReminderFireHandler = (reminder: BuiltReminder) => void;

let onFire: WebReminderFireHandler | null = null;
const timers = new Map<string, ReturnType<typeof setTimeout>>();

export function setWebReminderFireHandler(handler: WebReminderFireHandler | null): void {
  onFire = handler;
}

export function cancelWebReminderTimers(options?: { preserveSnoozes?: boolean }): void {
  for (const [id, timer] of timers.entries()) {
    if (options?.preserveSnoozes && id.startsWith("snooze:")) continue;
    clearTimeout(timer);
    timers.delete(id);
  }
}

/**
 * Arm one-shot timers for future reminders. Does not deliver immediately — only
 * when each reminder's `fireAt` instant is reached.
 */
export function scheduleWebReminderTimers(reminders: BuiltReminder[], now = new Date()): void {
  cancelWebReminderTimers({ preserveSnoozes: true });
  for (const reminder of reminders) {
    armWebReminderTimer(reminder, now);
  }
}

/**
 * Arms a single one-shot reminder without clearing existing timers (used by Snooze).
 */
export function armWebReminderTimer(reminder: BuiltReminder, now = new Date()): void {
  const handler = onFire;
  if (!handler) return;

  const delay = reminder.fireAt.getTime() - now.getTime();
  if (delay <= 0 || delay > MAX_TIMEOUT_MS) return;

  const existing = timers.get(reminder.id);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(() => {
    timers.delete(reminder.id);
    handler(reminder);
  }, delay);
  timers.set(reminder.id, timer);
}
