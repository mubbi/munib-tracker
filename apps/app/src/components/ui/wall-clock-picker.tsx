import type { SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useTimeFormat } from "@/hooks/use-time-format";
import { type DayPeriod, from12HourParts, to12HourParts } from "@/lib/time";

export interface WallClockValue {
  hour: number;
  minute: number;
}

type WallClockPickerProps = {
  /** Optional heading above the picker; omit when the parent already labels it. */
  label?: string;
  value: WallClockValue;
  onChange: (next: WallClockValue) => void;
};

export function WallClockPicker({ label, value, onChange }: WallClockPickerProps) {
  const { t } = useTranslation();
  const timeFormat = useTimeFormat();
  const { hour: h, minute: m } = value;
  const { hour: hour12, period } = to12HourParts(h);

  const apply24 = (hour24: number, minute: number) => {
    const wrappedH = (hour24 + 24) % 24;
    const wrappedM = (minute + 60) % 60;
    onChange({ hour: wrappedH, minute: wrappedM });
  };

  const hourDisplay = timeFormat === "12" ? `${hour12}` : `${h}`.padStart(2, "0");
  const minuteDisplay = `${m}`.padStart(2, "0");

  return (
    <View style={styles.root}>
      {label ? <ThemedText type="smallBold">{label}</ThemedText> : null}
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
    </View>
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
  root: {
    alignItems: "center",
    gap: Spacing.two,
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
    width: 72,
    paddingVertical: Spacing.two,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    alignItems: "center",
  },
});
