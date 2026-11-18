import { requestReminderReschedule } from "./reschedule";

const mockRescheduleAll = jest.fn();
jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: (...args: unknown[]) => mockRescheduleAll(...args),
}));
jest.mock("@/stores/preferences-store", () => ({
  preferencesStore: { getState: () => ({ prefs: { id: "prefs" } }) },
}));
jest.mock("@/stores/location-store", () => ({
  locationStore: { getState: () => ({ location: { id: "loc" } }) },
}));

describe("requestReminderReschedule", () => {
  it("reschedules with the current preferences and location", () => {
    mockRescheduleAll.mockResolvedValueOnce(undefined);
    requestReminderReschedule();
    expect(mockRescheduleAll).toHaveBeenCalledWith({ id: "prefs" }, { id: "loc" });
  });

  it("swallows reschedule failures", async () => {
    mockRescheduleAll.mockRejectedValueOnce(new Error("no permission"));
    expect(() => requestReminderReschedule()).not.toThrow();
    await Promise.resolve();
  });
});
