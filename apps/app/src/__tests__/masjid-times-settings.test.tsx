import { masjidKey } from "@munib-tracker/shared/masjid";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import MasjidTimesScreen from "@/app/masjids/times";
import { homeMasjidTimesStore } from "@/stores/home-masjid-times-store";
import { preferencesStore } from "@/stores/preferences-store";
import { setPreferences } from "@/test-support/preferences";
import { renderWithProviders } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock(
  "@/notifications/scheduler",
  () => require("@/test-support/mocks/notifications-scheduler").notificationsSchedulerMock,
);

const HOME = { osmType: "node" as const, osmId: "1", name: "East Masjid", lat: 51.5, lon: -0.12 };

beforeEach(async () => {
  await resetSettingsStores();
  await act(async () => {
    await setPreferences({ homeMasjid: HOME, masjidWalkMinutes: 10 });
  });
});

describe("Masjid times — reminder settings (B-37)", () => {
  it("the walk time saves on its own and never rewrites the private times record", async () => {
    const save = jest.spyOn(homeMasjidTimesStore.getState(), "save");
    await renderWithProviders(<MasjidTimesScreen />);
    await fireEvent.press(await screen.findByRole("button", { name: /increase/i }));
    await waitFor(() => expect(preferencesStore.getState().prefs.masjidWalkMinutes).toBe(15));
    expect(save).not.toHaveBeenCalled();
    // Nothing became a pending form edit: Save stays disabled.
    expect(screen.queryByText(/unsaved/i)).toBeNull();
    expect(homeMasjidTimesStore.getState().times[masjidKey(HOME)]).toBeUndefined();
  });
});
