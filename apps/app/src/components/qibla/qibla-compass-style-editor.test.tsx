import { act, fireEvent, screen } from "@testing-library/react-native";

import { preferencesStore } from "@/stores/preferences-store";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

import { QiblaCompassStyleEditor, qiblaCardWidth } from "./qibla-compass-style-editor";

const NAMES = [
  "Classic",
  "Minimal",
  "Mariner",
  "Precision",
  "Astrolabe",
  "Mihrab",
  "Radar",
  "Night sky",
  "Bold arrow",
];

describe("QiblaCompassStyleEditor", () => {
  afterEach(async () => {
    await resetPreferences();
  });

  it("offers every style with Classic selected by default", async () => {
    await renderWithTheme(<QiblaCompassStyleEditor />);
    for (const name of NAMES) {
      expect(screen.getByRole("button", { name })).toBeTruthy();
    }
    expect(screen.getByRole("button", { name: "Classic" })).toBeSelected();
    expect(
      screen.getByText(
        "The original dial with soft rings, cardinal points and the Kaaba on the rim.",
      ),
    ).toBeTruthy();
  });

  it("writes the chosen style to the synced preferences", async () => {
    await renderWithTheme(<QiblaCompassStyleEditor />);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Night sky" }));
    });
    expect(preferencesStore.getState().prefs.qiblaCompassStyle).toBe("night");
    expect(screen.getByRole("button", { name: "Night sky" })).toBeSelected();
    expect(
      screen.getByText("A starlit sky where the Kaaba shines as the brightest star."),
    ).toBeTruthy();
  });

  it("falls back to Classic for a style this build doesn't know", async () => {
    // e.g. synced from a newer client.
    await setPreferences({ qiblaCompassStyle: "hologram" as never });
    await act(async () => {
      await preferencesStore.getState().update({ qiblaCompassStyle: "hologram" as never });
    });
    await renderWithTheme(<QiblaCompassStyleEditor />);
    expect(screen.getByRole("button", { name: "Classic" })).toBeSelected();
  });
});

describe("qiblaCardWidth", () => {
  it("fits whole cards in a row with no ragged gap", () => {
    expect(qiblaCardWidth(328)).toBe(104); // 3 per row on a phone
    expect(qiblaCardWidth(600)).toBe(113); // 5 per row on a tablet sheet
    expect(qiblaCardWidth(80)).toBe(80); // never fewer than one
  });
});
