import { useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useTimeFormat } from "@/hooks/use-time-format";
import {
  type DayPeriod,
  formatHhMm,
  formatStoredTime,
  from12HourParts,
  parseHhMm,
  to12HourParts,
} from "@/lib/time";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

export default function BedtimeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const timeFormat = useTimeFormat();
  const { update } = usePreferencesActions();
  const [{ hour: h, minute: m }, setTime] = useState(() =>
    parseHhMm(prefs.bedtime, { hour: 22, minute: 30 }),
  );
  const [period, setPeriod] = useState<DayPeriod>(() => to12HourParts(h).period);

  const apply24 = (hour24: number, minute: number) => {
    const wrappedH = (hour24 + 24) % 24;
    const wrappedM = (minute + 60) % 60;
    setTime({ hour: wrappedH, minute: wrappedM });
    setPeriod(to12HourParts(wrappedH).period);
    void update({ bedtime: formatHhMm(wrappedH, wrappedM) });
  };

  const hour12 = to12HourParts(h).hour;
  const hourDisplay = timeFormat === "12" ? `${hour12}` : `${h}`.padStart(2, "0");
  const minuteDisplay = `${m}`.padStart(2, "0");

  return (
    <ScreenLayout
      eyebrow={t("bedtime.eyebrow")}
      title={t("settings.bedtime")}
      subtitle={t("bedtime.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/settings/bedtime" />
      <Card style={styles.card}>
        <View style={styles.picker}>
          <TimeColumn
            value={hourDisplay}
            unitKey="hour"
            onUp={() =>
              timeFormat === "12"
                ? apply24(from12HourParts(hour12 === 12 ? 1 : hour12 + 1, period), m)
                : apply24(h + 1, m)
            }
            onDown={() =>
              timeFormat === "12"
                ? apply24(from12HourParts(hour12 === 1 ? 12 : hour12 - 1, period), m)
                : apply24(h - 1, m)
            }
          />
          <ThemedText type="display">:</ThemedText>
          <TimeColumn
            value={minuteDisplay}
            unitKey="min"
            onUp={() => apply24(h, m + 5)}
            onDown={() => apply24(h, m - 5)}
          />
        </View>
        {timeFormat === "12" ? (
          <SegmentedControl
            options={[
              { id: "AM" as DayPeriod, label: t("timeFormat.am") },
              { id: "PM" as DayPeriod, label: t("timeFormat.pm") },
            ]}
            value={period}
            onChange={(next) => apply24(from12HourParts(hour12, next), m)}
          />
        ) : null}
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          {t("bedtime.hint", {
            preview: formatStoredTime(formatHhMm(h, m), timeFormat),
          })}
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
  icon: SymbolViewProps["name"];
  label: string;
  onPress: () => void;
}) {
  const { colors } = useThemeTokens();
  return (
    <IconButton
      accessibilityLabel={label}
      onPress={onPress}
      name={icon}
      size={24}
      tintColor={colors.foreground}
    />
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
  hint: {
    textAlign: "center",
  },
});
