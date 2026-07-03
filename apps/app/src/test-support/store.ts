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
