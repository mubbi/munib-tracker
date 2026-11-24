const mockRescheduleAll = jest.fn();
const mockStores = {
  prefs: { id: "prefs-1" } as Record<string, unknown>,
  location: { id: "loc-1" } as Record<string, unknown>,
};

jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: (...args: unknown[]) => mockRescheduleAll(...args),
}));
jest.mock("@/stores/preferences-store", () => ({
  preferencesStore: { getState: () => ({ prefs: mockStores.prefs }) },
}));
jest.mock("@/stores/location-store", () => ({
  locationStore: { getState: () => ({ location: mockStores.location }) },
}));

import { requestReminderReschedule, rescheduleReminders } from "./reschedule";

const flush = () => new Promise((resolve) => setImmediate(resolve));

beforeEach(() => {
  mockRescheduleAll.mockReset();
  mockRescheduleAll.mockResolvedValue(undefined);
  mockStores.prefs = { id: "prefs-1" };
  mockStores.location = { id: "loc-1" };
});

describe("rescheduleReminders", () => {
  it("reschedules with the prefs and location in the stores when the pass runs", async () => {
    const pass = rescheduleReminders();
    // Written after the request, before the pass reads the stores.
    mockStores.prefs = { id: "prefs-2" };
    await pass;
    expect(mockRescheduleAll).toHaveBeenCalledWith({ id: "prefs-2" }, { id: "loc-1" });
  });

  it("collapses requests made before the pass starts into one pass", async () => {
    const first = rescheduleReminders();
    const second = rescheduleReminders();
    expect(second).toBe(first);
    await Promise.all([first, second]);
    expect(mockRescheduleAll).toHaveBeenCalledTimes(1);
  });

  it("runs a fresh pass for a request made after the previous one started", async () => {
    await rescheduleReminders();
    await rescheduleReminders();
    expect(mockRescheduleAll).toHaveBeenCalledTimes(2);
  });

  it("rejects with the scheduler's error and recovers for the next request", async () => {
    mockRescheduleAll.mockRejectedValueOnce(new Error("no permission"));
    await expect(rescheduleReminders()).rejects.toThrow("no permission");
    await expect(rescheduleReminders()).resolves.toBeUndefined();
    expect(mockRescheduleAll).toHaveBeenCalledTimes(2);
  });
});

describe("requestReminderReschedule", () => {
  it("is fire-and-forget and swallows failures", async () => {
    mockRescheduleAll.mockRejectedValueOnce(new Error("boom"));
    expect(() => requestReminderReschedule()).not.toThrow();
    await flush();
    expect(mockRescheduleAll).toHaveBeenCalledTimes(1);
  });
});
