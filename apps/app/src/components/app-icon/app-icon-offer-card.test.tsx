import { act, fireEvent, screen } from "@testing-library/react-native";

import { devicePreferencesStore } from "@/stores/device-preferences-store";
import { renderWithProviders } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

import { AppIconOfferCard } from "./app-icon-offer-card";

const OFFER = { id: "ramadan", key: "ramadan:1448" } as const;

describe("AppIconOfferCard (D75)", () => {
  beforeEach(async () => {
    await resetSettingsStores();
  });

  it("names the season and turns seasonal icons on", async () => {
    await renderWithProviders(<AppIconOfferCard offer={OFFER} />);
    expect(screen.getByText("Seasonal app icon: Ramadan")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Use seasonal icons" }));
    });
    expect(devicePreferencesStore.getState().prefs.appIcon).toBe("seasonal");
  });

  it("'Not now' hides only this season's offer", async () => {
    await renderWithProviders(<AppIconOfferCard offer={OFFER} />);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Not now" }));
    });
    const prefs = devicePreferencesStore.getState().prefs;
    expect(prefs.appIconOffersSeen).toEqual(["ramadan:1448"]);
    expect(prefs.appIcon).toBeUndefined();
  });
});
