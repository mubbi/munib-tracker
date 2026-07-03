import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import AppearanceScreen from "@/app/settings/appearance";
import { renderWithProviders } from "@/test-support/render";

describe("Settings screen feature", () => {
  it("updates accent color when a swatch is selected", async () => {
    renderWithProviders(<AppearanceScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Current mode:/)).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Teal"));

    await waitFor(() => {
      expect(screen.getByText(/accent: teal/i)).toBeTruthy();
    });
  });

  it("updates color mode when dark is selected", async () => {
    renderWithProviders(<AppearanceScreen />);

    await waitFor(() => {
      expect(screen.getByText("Dark")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Dark"));

    await waitFor(() => {
      expect(screen.getByText(/Current mode: dark/i)).toBeTruthy();
    });
  });
});
