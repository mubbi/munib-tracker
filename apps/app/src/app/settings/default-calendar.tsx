import type { CalendarMode } from "@munib-tracker/shared/types";
import { goBackOrReplace } from "@/lib/navigation";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

const CALENDARS: {
  id: CalendarMode;
  labelKey: "optionGregorian" | "optionHijri";
  exampleKey: "exampleGregorian" | "exampleHijri";
}[] = [
  { id: "gregorian", labelKey: "optionGregorian", exampleKey: "exampleGregorian" },
  { id: "hijri", labelKey: "optionHijri", exampleKey: "exampleHijri" },
];

export default function DefaultCalendarScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("defaultCalendar.title")}
      subtitle={t("defaultCalendar.subtitle")}
      onBack={() => (goBackOrReplace(router, "/"))}
    >
      <Seo path="/settings/default-calendar" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("defaultCalendar.title")}
            icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("defaultCalendar.hint")}
          </ThemedText>
          <Choices
            value={prefs.defaultCalendar}
            onChange={(id) => update({ defaultCalendar: id })}
          />
        </Card>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
          {t("defaultCalendar.footer")}
        </ThemedText>
      </Stagger>
    </ScreenLayout>
  );
}

function Choices({
  value,
  onChange,
}: {
  value: CalendarMode;
  onChange: (id: CalendarMode) => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <View style={styles.rows}>
      {CALENDARS.map((calendar) => {
        const selected = calendar.id === value;
        return (
          <PressableScale
            key={calendar.id}
            haptic="selection"
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(calendar.id)}
            style={[styles.row, { backgroundColor: selected ? tokens.accentSoft : colors.muted }]}
          >
            <View style={styles.rowBody}>
              <ThemedText type="small">{t(`defaultCalendar.${calendar.labelKey}`)}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t(`defaultCalendar.${calendar.exampleKey}`)}
              </ThemedText>
            </View>
            {selected ? (
              <SymbolView
                name={{
                  ios: "checkmark.circle.fill",
                  android: "check_circle",
                  web: "check_circle",
                }}
                size={22}
                tintColor={colors.accent}
              />
            ) : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowBody: {
    gap: 2,
  },
  hint: {
    marginTop: Spacing.two,
  },
  footer: {
    textAlign: "center",
  },
});
