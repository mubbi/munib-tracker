import {
  __resetTrackingChangesForTests,
  hasUnsyncedTrackingChanges,
  markTrackingChanged,
  markTrackingSynced,
  onTrackingChanged,
  trackingChangeVersion,
} from "@/lib/sync/tracking-changes";

beforeEach(() => __resetTrackingChangesForTests());

describe("tracking change signal", () => {
  it("notifies listeners and stays unsynced until a sync covers the change", () => {
    const listener = jest.fn();
    const unsubscribe = onTrackingChanged(listener);
    expect(hasUnsyncedTrackingChanges()).toBe(false);

    markTrackingChanged();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(hasUnsyncedTrackingChanges()).toBe(true);

    markTrackingSynced(trackingChangeVersion());
    expect(hasUnsyncedTrackingChanges()).toBe(false);

    unsubscribe();
    markTrackingChanged();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps edits made during a sync pending", () => {
    markTrackingChanged();
    const upTo = trackingChangeVersion(); // sync starts
    markTrackingChanged(); // edit lands mid-sync
    markTrackingSynced(upTo); // sync finishes
    expect(hasUnsyncedTrackingChanges()).toBe(true);
  });
});
