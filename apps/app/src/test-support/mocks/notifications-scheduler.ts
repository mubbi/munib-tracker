/**
 * `@/notifications/scheduler` with no-op async stand-ins, for suites whose
 * subject reschedules reminders as a side effect (settings writes, store
 * loads, madhhab changes) but doesn't assert on the schedule itself.
 *
 *   jest.mock("@/notifications/scheduler", () => require("@/test-support/mocks/notifications-scheduler").notificationsSchedulerMock);
 *
 * Assert with `expect(rescheduleAll).toHaveBeenCalled()` after importing it
 * from `@/notifications/scheduler`.
 */
export const notificationsSchedulerMock = {
  __esModule: true,
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
};
