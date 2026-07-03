import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import AppearanceScreen from "@/app/settings/appearance";
import { renderWithProviders } from "@/test-support/render";

async function waitForAppearanceScreen() {
  await waitFor(
    () => {
      expect(screen.getByLabelText("Teal")).toBeTruthy();
    },
    { timeout: 5000 },
  );
}

describe("Settings screen feature", () => {
  it("updates accent color when a swatch is selected", async () => {
    renderWithProviders(<AppearanceScreen />);
    await waitForAppearanceScreen();

    fireEvent.press(screen.getByLabelText("Teal"));

    await waitFor(() => {
      expect(screen.getByText(/accent: teal/i)).toBeTruthy();
    });
  });

  it("updates color mode when dark is selected", async () => {
    renderWithProviders(<AppearanceScreen />);
    await waitForAppearanceScreen();

    fireEvent.press(screen.getByText("Dark"));

    await waitFor(() => {
      expect(screen.getByText(/Current mode: dark/i)).toBeTruthy();
    });
  });
});
