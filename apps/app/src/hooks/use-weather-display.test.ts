import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import { renderHook } from "@testing-library/react-native";

import i18n from "@/i18n";
import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { useWeatherDisplay } from "./use-weather-display";

jest.mock("@/stores/weather-store", () => ({ useWeatherSnapshot: () => mockSnapshot.current }));

const mockSnapshot: { current: { temperatureCelsius: number; condition: string } | null } = {
  current: null,
};

async function display(unit: "celsius" | "fahrenheit" = "celsius") {
  await setPreferences({ weatherPrefs: { ...DEFAULT_USER_PREFERENCES.weatherPrefs, unit } });
  const { result } = await renderHook(() => useWeatherDisplay());
  return result.current;
}

afterEach(resetPreferences);

describe("useWeatherDisplay", () => {
  it("is null without a weather snapshot", async () => {
    mockSnapshot.current = null;
    expect(await display()).toBeNull();
  });

  it("formats temperature and condition in the preferred unit", async () => {
    mockSnapshot.current = { temperatureCelsius: 20, condition: "clear" };
    const condition = i18n.t("weather.condition.clear");
    expect(await display("fahrenheit")).toEqual({
      temperature: "68°",
      condition,
      summary: `68° · ${condition}`,
      accessibilityLabel: i18n.t("hero.weatherA11y", { temp: "68°", condition }),
    });
  });
});
