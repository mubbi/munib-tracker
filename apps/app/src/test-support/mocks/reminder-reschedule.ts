/**
 * `@/lib/notifications/reschedule` (the single "rebuild local reminders" entry
 * point) with both exports as `jest.fn`s — keeps the notification scheduler
 * graph out of vault / records / store suites that only trigger it as a side
 * effect.
 *
 *   jest.mock("@/lib/notifications/reschedule", () => require("@/test-support/mocks/reminder-reschedule").reminderRescheduleMock);
 */
export const reminderRescheduleMock = {
  __esModule: true,
  rescheduleReminders: jest.fn(async () => undefined),
  requestReminderReschedule: jest.fn(),
};
