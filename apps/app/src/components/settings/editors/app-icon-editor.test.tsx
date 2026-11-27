import { act, fireEvent, screen } from "@testing-library/react-native";

import { devicePreferencesStore } from "@/stores/device-preferences-store";
import { renderWithTheme } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

import { AppIconEditor } from "./app-icon-editor";

const CHOICES = [
  "Seasonal",
  "Classic",
  "Ramadan",
  "Last ten nights",
  "Eid al-Fitr",
  "Dhul-Hijjah",
  "Eid al-Adha",
  "Islamic New Year",
  "Days of Ashura",
];

describe("AppIconEditor (NF-2.23b)", () => {
  beforeEach(async () => {
    await resetSettingsStores();
  });

  it("offers seasonal, classic and every seasonal icon — seasonal by default on iOS", async () => {
    await renderWithTheme(<AppIconEditor />);
    for (const name of CHOICES) {
      expect(screen.getByRole("button", { name })).toBeTruthy();
    }
    expect(screen.getByRole("button", { name: "Seasonal" })).toBeSelected();
    // Either the icon showing now or the next season to come.
    expect(screen.getByText(/^(Showing now|Next): /)).toBeTruthy();
    expect(screen.getByText("iOS shows a short message whenever the icon changes.")).toBeTruthy();
  });

  it("stores a fixed icon on this device only", async () => {
    await renderWithTheme(<AppIconEditor />);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Eid al-Adha" }));
    });
    expect(devicePreferencesStore.getState().prefs.appIcon).toBe("eidAdha");
    expect(screen.getByRole("button", { name: "Eid al-Adha" })).toBeSelected();
    expect(screen.queryByText(/^(Showing now|Next): /)).toBeNull();
  });
});
