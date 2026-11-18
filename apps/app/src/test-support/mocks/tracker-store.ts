/**
 * `@/stores/tracker-store` with the excused-day hooks made controllable (the
 * rest of the module stays real):
 *
 *   jest.mock("@/stores/tracker-store", () =>
 *     require("@/test-support/mocks/tracker-store").trackerStoreExcusedMock());
 *   import { mockTrackerExcused, resetTrackerExcusedMock } from "@/test-support/mocks/tracker-store";
 *   mockTrackerExcused.reason = "travel";
 *   expect(mockTrackerExcused.setDayExcused).toHaveBeenCalledWith(null);
 */
import type { ExcusedReason } from "@munib-tracker/shared/types";

export const mockTrackerExcused = {
  reason: null as ExcusedReason | null,
  setDayExcused: jest.fn(async (_reason: ExcusedReason | null) => undefined),
};

export function resetTrackerExcusedMock(): void {
  mockTrackerExcused.reason = null;
  mockTrackerExcused.setDayExcused.mockClear();
}

export function trackerStoreExcusedMock(): Record<string, unknown> {
  const actual = jest.requireActual("@/stores/tracker-store") as Record<string, unknown> & {
    useTrackerActions: () => Record<string, unknown>;
  };
  return {
    ...actual,
    useDayExcused: () => mockTrackerExcused.reason,
    useTrackerActions: () => ({
      ...actual.useTrackerActions(),
      setDayExcused: mockTrackerExcused.setDayExcused,
    }),
  };
}
