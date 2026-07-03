import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

function parseTime(value: string | undefined): { h: number; m: number } {
  const [h, m] = (value ?? "22:30").split(":").map((part) => Number.parseInt(part, 10));
  return { h: Number.isFinite(h) ? h : 22, m: Number.isFinite(m) ? m : 30 };
}

function format(h: number, m: number): string {
  return `${`${h}`.padStart(2, "0")}:${`${m}`.padStart(2, "0")}`;
}

export default function BedtimeScreen() {
  const router = useRouter();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();
  const [{ h, m }, setTime] = useState(() => parseTime(prefs.bedtime));

  const apply = (nextH: number, nextM: number) => {
    const wrappedH = (nextH + 24) % 24;
    const wrappedM = (nextM + 60) % 60;
    setTime({ h: wrappedH, m: wrappedM });
    void update({ bedtime: format(wrappedH, wrappedM) });
  };

  return (
    <ScreenLayout
      eyebrow="Settings"
      title="Bedtime"
      subtitle="When should before-sleep adhkar remind you?"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Card style={styles.card}>
        <View style={styles.picker}>
          <TimeColumn
            value={`${h}`.padStart(2, "0")}
            label="hour"
            onUp={() => apply(h + 1, m)}
            onDown={() => apply(h - 1, m)}
          />
          <ThemedText type="display">:</ThemedText>
          <TimeColumn
            value={`${m}`.padStart(2, "0")}
            label="min"
            onUp={() => apply(h, m + 5)}
            onDown={() => apply(h, m - 5)}
          />
        </View>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          Saved automatically · 24-hour time
        </ThemedText>
      </Card>
    </ScreenLayout>
  );
}

function TimeColumn({
  value,
  label,
  onUp,
  onDown,
}: {
  value: string;
  label: string;
  onUp: () => void;
  onDown: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View style={styles.column}>
      <ArrowButton
        icon={{ ios: "chevron.up", android: "keyboard_arrow_up", web: "keyboard_arrow_up" }}
        label={`Increase ${label}`}
        onPress={onUp}
      />
      <View style={[styles.value, { backgroundColor: tokens.accentSoft }]}>
        <ThemedText type="display" style={{ color: colors.accent }}>
          {value}
        </ThemedText>
      </View>
      <ArrowButton
        icon={{ ios: "chevron.down", android: "keyboard_arrow_down", web: "keyboard_arrow_down" }}
        label={`Decrease ${label}`}
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
