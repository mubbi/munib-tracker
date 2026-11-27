import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";
import { act } from "@testing-library/react-native";

import { resetDevicePreferencesStore } from "@/stores/device-preferences-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Seeds the real preferences store (defaults + `overrides`) so hooks reading
 * `usePreferences()` see them. Wrapped in `act` for mounted subscribers.
 *
 *   beforeEach(() => setPreferences({ timeFormat: "24" }));
 *   afterEach(resetPreferences);
 */
export async function setPreferences(overrides: Partial<UserPreferences> = {}): Promise<void> {
  await act(async () => {
    // Device preferences (B4) overlay the legacy fields — clear them so `overrides` win.
    resetDevicePreferencesStore();
    preferencesStore.setState({ prefs: { ...DEFAULT_USER_PREFERENCES, ...overrides } });
  });
}

export function resetPreferences(): Promise<void> {
  return setPreferences();
}
