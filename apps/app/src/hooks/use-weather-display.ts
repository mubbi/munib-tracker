import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { formatTemperature } from "@/lib/weather/format";
import { usePreferences } from "@/stores/preferences-store";
import { useWeatherSnapshot } from "@/stores/weather-store";

export interface WeatherDisplay {
  temperature: string;
  condition: string;
  summary: string;
  accessibilityLabel: string;
}

export function useWeatherDisplay(): WeatherDisplay | null {
  const snapshot = useWeatherSnapshot();
  const { weatherPrefs } = usePreferences();
  const { t } = useTranslation();

  return useMemo(() => {
    if (!snapshot) return null;
    const temperature = formatTemperature(snapshot.temperatureCelsius, weatherPrefs.unit);
    const condition = t(`weather.condition.${snapshot.condition}`);
    const summary = `${temperature} · ${condition}`;
    return {
      temperature,
      condition,
      summary,
      accessibilityLabel: t("hero.weatherA11y", { temp: temperature, condition }),
    };
  }, [snapshot, weatherPrefs.unit, t]);
}
