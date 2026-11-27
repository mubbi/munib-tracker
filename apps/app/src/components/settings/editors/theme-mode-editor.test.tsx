import { fireEvent, screen } from "@testing-library/react-native";

import en from "@/i18n/en.json";
import { getSetting } from "@/lib/settings/registry";
import { preferencesStore } from "@/stores/preferences-store";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

import { ThemeModeEditor } from "./theme-mode-editor";

afterEach(resetPreferences);

describe("ThemeModeEditor", () => {
  it("shows Light / Dark / System as a radio group of preview tiles", async () => {
    await setPreferences({ colorMode: "dark" });
    await renderWithTheme(<ThemeModeEditor settingId="appearance.theme" />);

    expect(screen.getByTestId("theme-tiles").props.accessibilityRole).toBe("radiogroup");
    const radios = screen.getAllByRole("radio");
    expect(radios.map((r) => r.props.accessibilityLabel)).toEqual([
      en.appearance.modeLight,
      en.appearance.modeDark,
      en.appearance.modeSystem,
    ]);
    expect(screen.getByTestId("theme-tile-dark").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });

  it("writes the choice through the registered setting", async () => {
    await setPreferences({ colorMode: "dark" });
    await renderWithTheme(<ThemeModeEditor settingId="appearance.theme" />);

    await fireEvent.press(screen.getByTestId("theme-tile-system"));

    expect(preferencesStore.getState().prefs.colorMode).toBe("system");
  });

  it("keeps the registry semantics (summary, default) for appearance.theme", () => {
    const def = getSetting("appearance.theme");
    expect(def?.control.kind).toBe("custom");
    expect(def?.defaultValue).toBe("dark");
    expect(def?.summary?.("system", (key: string) => key)).toBe("appearance.modeSystem");
  });
});
