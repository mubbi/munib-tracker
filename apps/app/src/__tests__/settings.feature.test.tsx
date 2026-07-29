import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import AppearanceScreen from "@/app/settings/appearance";
import { renderWithProviders } from "@/test-support/render";

/** Theme prefs hydrate from AsyncStorage before swatches paint. */
async function waitForAppearanceScreen() {
  await waitFor(
    () => {
      expect(screen.getByLabelText("Teal")).toBeTruthy();
    },
    { timeout: 15_000 },
  );
}

describe("Settings screen feature", () => {
  jest.setTimeout(30_000);

  it("updates accent color when a swatch is selected", async () => {
    renderWithProviders(<AppearanceScreen />);
    await waitForAppearanceScreen();

    fireEvent.press(screen.getByLabelText("Teal"));

    await waitFor(
      () => {
        expect(screen.getByText(/accent: teal/i)).toBeTruthy();
      },
      { timeout: 10_000 },
    );
  });

  it("updates color mode when dark is selected", async () => {
    renderWithProviders(<AppearanceScreen />);
    await waitForAppearanceScreen();

    fireEvent.press(screen.getByText("Dark"));

    await waitFor(
      () => {
        expect(screen.getByText(/Current mode: dark/i)).toBeTruthy();
      },
      { timeout: 10_000 },
    );
  });
});
