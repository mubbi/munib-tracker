/**
 * `@/lib/quran-companion/reschedule` with `requestReminderReschedule` as a
 * `jest.fn` — keeps the notification scheduler graph out of vault / records
 * store suites that only trigger it as a side effect.
 *
 *   jest.mock("@/lib/quran-companion/reschedule", () => require("@/test-support/mocks/reminder-reschedule").reminderRescheduleMock);
 */
export const reminderRescheduleMock = {
  __esModule: true,
  requestReminderReschedule: jest.fn(),
};
