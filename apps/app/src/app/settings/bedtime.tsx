import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatHhMm, parseHhMm } from "@/lib/time";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

export default function BedtimeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();
  const [{ hour: h, minute: m }, setTime] = useState(() =>
    parseHhMm(prefs.bedtime, { hour: 22, minute: 30 }),
  );

  const apply = (nextH: number, nextM: number) => {
    const wrappedH = (nextH + 24) % 24;
    const wrappedM = (nextM + 60) % 60;
    setTime({ hour: wrappedH, minute: wrappedM });
    void update({ bedtime: formatHhMm(wrappedH, wrappedM) });
  };

  return (
    <ScreenLayout
      eyebrow={t("bedtime.eyebrow")}
      title={t("settings.bedtime")}
      subtitle={t("bedtime.subtitle")}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Card style={styles.card}>
        <View style={styles.picker}>
          <TimeColumn
            value={`${h}`.padStart(2, "0")}
            unitKey="hour"
            onUp={() => apply(h + 1, m)}
            onDown={() => apply(h - 1, m)}
          />
          <ThemedText type="display">:</ThemedText>
          <TimeColumn
            value={`${m}`.padStart(2, "0")}
            unitKey="min"
            onUp={() => apply(h, m + 5)}
            onDown={() => apply(h, m - 5)}
          />
        </View>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          {t("bedtime.hint")}
        </ThemedText>
      </Card>
    </ScreenLayout>
  );
}

function TimeColumn({
  value,
  unitKey,
  onUp,
  onDown,
}: {
  value: string;
  unitKey: "hour" | "min";
  onUp: () => void;
  onDown: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const unit = t(`bedtime.${unitKey}`);
  return (
    <View style={styles.column}>
      <ArrowButton
        icon={{ ios: "chevron.up", android: "keyboard_arrow_up", web: "keyboard_arrow_up" }}
        label={t("bedtime.increase", { unit })}
        onPress={onUp}
      />
      <View style={[styles.value, { backgroundColor: tokens.accentSoft }]}>
        <ThemedText type="display" style={{ color: colors.accent }}>
          {value}
        </ThemedText>
      </View>
      <ArrowButton
        icon={{ ios: "chevron.down", android: "keyboard_arrow_down", web: "keyboard_arrow_down" }}
        label={t("bedtime.decrease", { unit })}
        onPress={onDown}
      />
    </View>
  );
}

function ArrowButton({
  icon,
  label,
  onPress,
}: {
  icon: Parameters<typeof SymbolView>[0]["name"];
  label: string;
  onPress: () => void;
}) {
  const { colors } = useThemeTokens();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={styles.arrow}
    >
      <SymbolView name={icon} size={24} tintColor={colors.foreground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    paddingVertical: Spacing.five,
    gap: Spacing.three,
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  column: {
    alignItems: "center",
    gap: Spacing.two,
  },
  value: {
    width: 88,
    paddingVertical: Spacing.two,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    alignItems: "center",
  },
  arrow: {
    padding: Spacing.one,
  },
  hint: {
    textAlign: "center",
  },
});
