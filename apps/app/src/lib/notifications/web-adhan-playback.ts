import type { BuiltReminder } from "@/lib/notifications/build-reminders";

export type WebAdhanPlaybackHandler = () => void;

let handler: WebAdhanPlaybackHandler | null = null;

export function setWebAdhanPlaybackHandler(next: WebAdhanPlaybackHandler | null): void {
  handler = next;
}

/** Plays the bundled adhan when an obligatory-prayer reminder fires on web. */
export function tryPlayWebAdhanForReminder(reminder: BuiltReminder): void {
  if (reminder.channelId !== "prayerAdhan") return;
  handler?.();
}
