import type { TemperatureUnit } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ToggleRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

const UNITS: { id: TemperatureUnit; labelKey: "unitCelsius" | "unitFahrenheit" }[] = [
  { id: "celsius", labelKey: "unitCelsius" },
  { id: "fahrenheit", labelKey: "unitFahrenheit" },
];

export default function WeatherSettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { setWeatherPrefs } = usePreferencesActions();

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("weather.title")}
      subtitle={t("weather.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/settings/weather" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("weather.effectsTitle")}
            icon={{ ios: "cloud.sun.fill", android: "partly_cloudy_day", web: "partly_cloudy_day" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("weather.effectsHint")}
          </ThemedText>
          <View style={styles.group}>
            <ToggleRow
              title={t("weather.effectsToggle")}
              subtitle={t("weather.effectsToggleSub")}
              value={prefs.weatherPrefs.effectsEnabled}
              onValueChange={(effectsEnabled) => setWeatherPrefs({ effectsEnabled })}
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("weather.unitTitle")}
            icon={{
              ios: "thermometer.medium",
              android: "device_thermostat",
              web: "device_thermostat",
            }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("weather.unitHint")}
          </ThemedText>
          <UnitChoices
            value={prefs.weatherPrefs.unit}
            onChange={(unit) => setWeatherPrefs({ unit })}
          />
        </Card>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
          {t("weather.footer")}
        </ThemedText>
      </Stagger>
    </ScreenLayout>
  );
}

function UnitChoices({
  value,
  onChange,
}: {
  value: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <View style={styles.rows}>
      {UNITS.map((unit) => {
        const selected = unit.id === value;
        return (
          <PressableScale
            key={unit.id}
            haptic="selection"
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(unit.id)}
            style={[styles.row, { backgroundColor: selected ? tokens.accentSoft : colors.muted }]}
          >
            <ThemedText type="small">{t(`weather.${unit.labelKey}`)}</ThemedText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginTop: Spacing.three,
  },
  hint: {
    marginTop: Spacing.two,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  row: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  footer: {
    textAlign: "center",
  },
});
