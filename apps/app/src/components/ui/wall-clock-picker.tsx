import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Control, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useTimeFormat } from "@/hooks/use-time-format";
import { triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";
import { useIsRTL } from "@/lib/rtl";
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

/** Minutes per tap; holding an arrow steps one minute at a time. */
export const MINUTE_TAP_STEP = 5;
/** Hold-to-repeat: first repeat after this delay, then every `REPEAT_INTERVAL_MS`. */
export const REPEAT_DELAY_MS = 400;
export const REPEAT_INTERVAL_MS = 110;

/** Equal width / height for both number boxes so the columns line up. */
const VALUE_MIN_WIDTH = tvDp(92);
/** Fits the display digits at their 1.3× large-text cap (58pt line × 1.3 ≈ 76). */
const VALUE_HEIGHT = tvDp(80);

const wrap = (value: number, size: number) => ((value % size) + size) % size;

/** Parses typed digits for a column; null when out of range. */
export function parseTypedTime(
  text: string,
  unit: "hour" | "min",
  format: "12" | "24",
): number | null {
  const digits = text.replace(/\D/g, "");
  if (digits.length === 0 || digits.length > 2) return null;
  const n = Number.parseInt(digits, 10);
  if (unit === "min") return n <= 59 ? n : null;
  if (format === "12") return n >= 1 && n <= 12 ? n : null;
  return n <= 23 ? n : null;
}

/**
 * Hour : minute picker for wall-clock times (bedtime, last third of the night,
 * masjid iqamah times, muhasabah, family ties). Two equal number boxes with
 * arrows above and below on one shared baseline, tabular digits that never wrap
 * (one line, shrink-to-fit at large text sizes), the hour zero-padded in 24-hour
 * and centred in 12-hour, and a compact AM / PM control under the boxes.
 *
 * Tap an arrow: ±1 hour / ±5 minutes; hold it: repeats ±1 (hours and minutes).
 * Web: a number box is also a numeric text field (type, then Enter / blur). The
 * digits always read hour → minute left to right, also in RTL locales.
 */
export function WallClockPicker({ label, value, onChange }: WallClockPickerProps) {
  const { t } = useTranslation();
  const timeFormat = useTimeFormat();
  const rtl = useIsRTL();
  const tv = isTV();
  const { hour: h, minute: m } = value;
  const { hour: hour12, period } = to12HourParts(h);

  // Hold-to-repeat calls onChange many times between renders: read the latest value.
  const valueRef = useRef(value);
  valueRef.current = value;

  const apply24 = (hour24: number, minute: number) => {
    onChange({ hour: wrap(hour24, 24), minute: wrap(minute, 60) });
  };
  const stepHour = (delta: number) => {
    const { hour, minute } = valueRef.current;
    if (timeFormat === "12") {
      const parts = to12HourParts(hour);
      const next12 = wrap(parts.hour - 1 + delta, 12) + 1;
      apply24(from12HourParts(next12, parts.period), minute);
    } else {
      apply24(hour + delta, minute);
    }
  };
  const stepMinute = (delta: number) => {
    const { hour, minute } = valueRef.current;
    apply24(hour, minute + delta);
  };

  const hourDisplay = timeFormat === "12" ? `${hour12}` : `${h}`.padStart(2, "0");
  const minuteDisplay = `${m}`.padStart(2, "0");

  return (
    <View style={styles.root}>
      {label ? <ThemedText type="smallBold">{label}</ThemedText> : null}
      <View
        testID="wall-clock-row"
        // Digits read hour → minute left to right in every locale (RTL flips `row`).
        style={[styles.picker, { flexDirection: rtl ? "row-reverse" : "row" }]}
      >
        <TimeColumn
          value={hourDisplay}
          unit="hour"
          onStep={stepHour}
          tapStep={1}
          onType={(n) => {
            const { minute } = valueRef.current;
            apply24(timeFormat === "12" ? from12HourParts(n, period) : n, minute);
          }}
          timeFormat={timeFormat}
        />
        <View style={styles.colonColumn} accessible={false} importantForAccessibility="no">
          <ThemedText type="display" numberOfLines={1} style={styles.colon}>
            :
          </ThemedText>
        </View>
        <TimeColumn
          value={minuteDisplay}
          unit="min"
          onStep={stepMinute}
          tapStep={MINUTE_TAP_STEP}
          onType={(n) => apply24(valueRef.current.hour, n)}
          timeFormat={timeFormat}
        />
      </View>
      {timeFormat === "12" ? (
        <View style={[styles.period, tv && styles.periodTv]}>
          <SegmentedControl
            options={[
              { id: "AM" as DayPeriod, label: t("timeFormat.am") },
              { id: "PM" as DayPeriod, label: t("timeFormat.pm") },
            ]}
            value={period}
            onChange={(next) => apply24(from12HourParts(hour12, next), m)}
          />
        </View>
      ) : null}
    </View>
  );
}

function TimeColumn({
  value,
  unit,
  onStep,
  tapStep,
  onType,
  timeFormat,
}: {
  value: string;
  unit: "hour" | "min";
  /** ±delta from the current value. */
  onStep: (delta: number) => void;
  /** Delta of one tap (hold always repeats ±1). */
  tapStep: number;
  onType: (value: number) => void;
  timeFormat: "12" | "24";
}) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const unitLabel = t(`bedtime.${unit}`);
  const web = Platform.OS === "web" && !isTV();

  return (
    <View style={styles.column}>
      <ArrowButton
        icon={{ ios: "chevron.up", android: "keyboard_arrow_up", web: "keyboard_arrow_up" }}
        label={t("bedtime.increase", { unit: unitLabel })}
        onTap={() => onStep(tapStep)}
        onRepeat={() => onStep(1)}
      />
      <View
        style={[styles.value, { backgroundColor: tokens.accentSoft }]}
        accessible={!web}
        accessibilityLabel={`${unitLabel}, ${value}`}
      >
        {web ? (
          <TypedValue
            value={value}
            unit={unit}
            unitLabel={unitLabel}
            timeFormat={timeFormat}
            onType={onType}
            color={tokens.accentOnSoft}
            caret={colors.accent}
          />
        ) : (
          <ThemedText
            type="display"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            style={[styles.digits, { color: tokens.accentOnSoft }]}
          >
            {value}
          </ThemedText>
        )}
      </View>
      <ArrowButton
        icon={{ ios: "chevron.down", android: "keyboard_arrow_down", web: "keyboard_arrow_down" }}
        label={t("bedtime.decrease", { unit: unitLabel })}
        onTap={() => onStep(-tapStep)}
        onRepeat={() => onStep(-1)}
      />
    </View>
  );
}

/** Web: the number box doubles as a numeric field (no native time wheel dependency). */
function TypedValue({
  value,
  unit,
  unitLabel,
  timeFormat,
  onType,
  color,
  caret,
}: {
  value: string;
  unit: "hour" | "min";
  unitLabel: string;
  timeFormat: "12" | "24";
  onType: (value: number) => void;
  color: string;
  caret: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft == null) return;
    const parsed = parseTypedTime(draft, unit, timeFormat);
    if (parsed != null) onType(parsed);
    setDraft(null);
  };
  return (
    <TextInput
      testID={`wall-clock-input-${unit}`}
      accessibilityLabel={unitLabel}
      value={draft ?? value}
      onChangeText={(text) => setDraft(text.replace(/\D/g, "").slice(0, 2))}
      onFocus={() => setDraft(value)}
      onBlur={commit}
      onSubmitEditing={commit}
      inputMode="numeric"
      keyboardType="number-pad"
      maxLength={2}
      selectTextOnFocus
      selectionColor={caret}
      style={[styles.input, { color }]}
    />
  );
}

/**
 * Arrow with tap + press-and-hold auto-repeat. A tap steps `onTap` once; holding
 * past {@link REPEAT_DELAY_MS} runs `onRepeat` every {@link REPEAT_INTERVAL_MS}
 * (with a selection haptic) until release, and the release is not also a tap.
 */
function ArrowButton({
  icon,
  label,
  onTap,
  onRepeat,
}: {
  icon: SymbolViewProps["name"];
  label: string;
  onTap: () => void;
  onRepeat: () => void;
}) {
  const { colors } = useThemeTokens();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeated = useRef(false);
  const repeatRef = useRef(onRepeat);
  repeatRef.current = onRepeat;

  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const tick = () => {
    repeated.current = true;
    triggerHaptic("selection");
    repeatRef.current();
    timer.current = setTimeout(tick, REPEAT_INTERVAL_MS);
  };

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      haptic="selection"
      scaleTo={0.9}
      hitSlop={4}
      onPressIn={() => {
        repeated.current = false;
        stop();
        // TV: D-pad Select has no hold — taps only.
        if (!isTV()) timer.current = setTimeout(tick, REPEAT_DELAY_MS);
      }}
      onPressOut={stop}
      onPress={() => {
        if (repeated.current) return;
        onTap();
      }}
      style={styles.arrow}
    >
      <SymbolView name={icon} size={24} tintColor={colors.foreground} />
    </PressableScale>
  );
}

const ARROW = Math.max(Control.md, Control.minTouch);
/** The `title` ramp step (40pt): a TextInput can't take a ThemedText variant. */
const INPUT_FONT_SIZE = 40;

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    gap: Spacing.two,
  },
  picker: {
    alignItems: "center",
    gap: Spacing.two,
  },
  column: {
    alignItems: "center",
    gap: Spacing.one,
  },
  arrow: {
    width: ARROW,
    height: ARROW,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  value: {
    minWidth: VALUE_MIN_WIDTH,
    height: VALUE_HEIGHT,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  digits: {
    textAlign: "center",
    fontVariant: ["tabular-nums"],
    includeFontPadding: false,
  },
  input: {
    minWidth: VALUE_MIN_WIDTH - Spacing.two * 2,
    textAlign: "center",
    fontSize: INPUT_FONT_SIZE,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    padding: 0,
  },
  /** Same box height as the numbers, centred between the two arrow rows. */
  colonColumn: {
    height: VALUE_HEIGHT,
    justifyContent: "center",
  },
  colon: {
    includeFontPadding: false,
  },
  period: {
    minWidth: tvDp(160),
  },
  periodTv: {
    minWidth: tvDp(240),
  },
});
