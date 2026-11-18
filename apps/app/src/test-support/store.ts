import AsyncStorage from "@react-native-async-storage/async-storage";
import { act } from "@testing-library/react-native";

import { trackerStore } from "@/stores/tracker-store";

/** Rehydrates the store from AsyncStorage without wiping it — models an app relaunch. */
export async function loadTrackerStore(): Promise<void> {
  await act(async () => {
    await trackerStore.getState().load();
  });
}

/**
 * Returns the tracker store to a clean, freshly-loaded state: wipes AsyncStorage
 * (offline persistence layer) and rehydrates the store. Wrapped in `act` so
 * store subscribers settle before assertions. Call from `beforeEach`.
 */
export async function resetTrackerStore(): Promise<void> {
  await AsyncStorage.clear();
  await loadTrackerStore();
}

/** Snapshot of the tracker store (data + real actions) before any test touched it. */
const pristineTrackerState = trackerStore.getState();

/**
 * Merges `partial` into the tracker store inside `act` — seed data
 * (`qazaCounters`, `prayerStatus` …) or stub actions with `jest.fn()`
 * (components reach actions through `getState()`). Pair with `restoreTrackerStore`.
 */
export async function seedTrackerStore(
  partial: Partial<ReturnType<typeof trackerStore.getState>>,
): Promise<void> {
  await act(async () => {
    trackerStore.setState(partial);
  });
}

/** Puts back the pristine tracker state and real actions. Use in `afterEach`. */
export function restoreTrackerStore(): void {
  trackerStore.setState(pristineTrackerState, true);
}
