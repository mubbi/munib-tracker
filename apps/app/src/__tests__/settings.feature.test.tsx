import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import AppearanceScreen from "@/app/settings/appearance";
import { renderWithProviders } from "@/test-support/render";

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

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
  it("updates accent color when a swatch is selected", async () => {
    await renderWithProviders(<AppearanceScreen />);
    await waitForAppearanceScreen();

    await fireEvent.press(screen.getByLabelText("Teal"));

    await waitFor(
      () => {
        expect(screen.getByLabelText("Teal").props.accessibilityState).toEqual(
          expect.objectContaining({ selected: true }),
        );
      },
      { timeout: 10_000 },
    );
  });

  it("updates color mode when dark is selected", async () => {
    await renderWithProviders(<AppearanceScreen />);
    await waitForAppearanceScreen();

    await fireEvent.press(screen.getByRole("radio", { name: "Dark" }));

    await waitFor(
      () => {
        expect(screen.getByRole("radio", { name: "Dark" }).props.accessibilityState).toEqual(
          expect.objectContaining({ selected: true }),
        );
      },
      { timeout: 10_000 },
    );
  });
});
