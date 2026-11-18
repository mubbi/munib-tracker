import type { BuiltReminder } from "@/lib/notifications/build-reminders";

/** A one-shot reminder firing at 2026-07-03T12:00Z on the default channel. */
export function buildReminder(overrides: Partial<BuiltReminder> = {}): BuiltReminder {
  return {
    id: "reminder-1",
    fireAt: new Date("2026-07-03T12:00:00.000Z"),
    title: "Reminder",
    body: "Body",
    channelId: "prayer",
    repeat: "date",
    route: "/",
    priority: 1,
    ...overrides,
  };
}
