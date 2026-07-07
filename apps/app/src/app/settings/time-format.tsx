import type { TimeFormat } from "@munib-tracker/shared/types";
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

const FORMATS: {
  id: TimeFormat;
  labelKey: "option12" | "option24";
  exampleKey: "example12" | "example24";
}[] = [
  { id: "12", labelKey: "option12", exampleKey: "example12" },
  { id: "24", labelKey: "option24", exampleKey: "example24" },
];

export default function TimeFormatScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("timeFormat.title")}
      subtitle={t("timeFormat.subtitle")}
      onBack={() => (goBackOrReplace(router, "/"))}
    >
      <Seo path="/settings/time-format" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("timeFormat.title")}
            icon={{ ios: "clock.fill", android: "schedule", web: "schedule" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("timeFormat.hint")}
          </ThemedText>
          <Choices value={prefs.timeFormat} onChange={(id) => update({ timeFormat: id })} />
        </Card>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
          {t("timeFormat.footer")}
        </ThemedText>
      </Stagger>
    </ScreenLayout>
  );
}

function Choices({ value, onChange }: { value: TimeFormat; onChange: (id: TimeFormat) => void }) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();

  return (
    <View style={styles.rows}>
      {FORMATS.map((format) => {
        const selected = format.id === value;
        return (
          <PressableScale
            key={format.id}
            haptic="selection"
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(format.id)}
            style={[styles.row, { backgroundColor: selected ? tokens.accentSoft : colors.muted }]}
          >
            <View style={styles.rowBody}>
              <ThemedText type="small">{t(`timeFormat.${format.labelKey}`)}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t(`timeFormat.${format.exampleKey}`)}
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
