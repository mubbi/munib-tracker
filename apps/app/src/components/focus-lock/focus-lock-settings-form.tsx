import {
  FOCUS_LOCK_PRAYERS,
  FOCUS_LOCK_UNLOCK_MODES,
  type FocusLockPrefs,
  type FocusLockUnlockMode,
} from "@munib-tracker/shared/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stepper } from "@/components/ui/stepper";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { focusLockCapability, focusLockPlatform } from "@/lib/focus-lock/native";
import {
  FOCUS_LOCK_BOUNDS,
  minEmergencyUnlocks,
  patchFocusLockPrefs,
  resetWeekendDays,
  toggleFocusPrayer,
  toggleWeekendDay,
} from "@/lib/focus-lock/prefs";
import {
  effectiveWeekendDays,
  regionWeekendDays,
  weekendRegionFor,
} from "@/lib/focus-lock/weekend";
import { localeToBcp47 } from "@/lib/locale-bcp47";
import { useSetting } from "@/lib/settings/use-setting";
import { useLocation } from "@/stores/location-store";

/** `UserPreferences.focusLock` (account-synced) through its registered setting — the single write path. */
export function useFocusLockPrefs(): [FocusLockPrefs, (next: FocusLockPrefs) => Promise<void>] {
  const { value, setValue } = useSetting<FocusLockPrefs>("devices.focusLock");
  return [value, setValue];
}

/**
 * NF-3.13 setup step 4 and the hub's "Timing and mode" card: which Salah,
 * the anchor (iqamah only with home-masjid times), offset, duration, unlock
 * mode, emergency allowance and the excused / weekday rules. The Jumu'ah
 * window has its own length (D38) and "Weekdays only" skips the user's own
 * weekend days, defaulting from their region (D37).
 */
export function FocusLockSettingsForm({
  iqamahAvailable,
  readOnly = false,
}: {
  iqamahAvailable: boolean;
  readOnly?: boolean;
}) {
  const { t } = useTranslation();
  const [prefs, save] = useFocusLockPrefs();
  const set = (patch: Partial<FocusLockPrefs>) => void save(patchFocusLockPrefs(prefs, patch));
  const { durationMin, jumuahDurationMin, offsetMin, emergencyUnlocksPerDay } = FOCUS_LOCK_BOUNDS;
  const location = useLocation();
  const region = weekendRegionFor(location);
  const weekend = effectiveWeekendDays(prefs.schedule, region);
  const regionDefault = regionWeekendDays(region);
  // D39: the iOS shield has no press-and-hold, so gentle mode lifts it on one tap there.
  const modeHintKey =
    prefs.unlockMode === "gentle" &&
    focusLockPlatform() === "ios" &&
    focusLockCapability() === "hard"
      ? "focusLock.form.modeHint.gentleIos"
      : `focusLock.form.modeHint.${prefs.unlockMode}`;

  return (
    <View style={styles.stack}>
      {/* Six Salah as one compact chip group instead of six switch rows. */}
      <ToggleChips
        title={t("focusLock.form.prayersTitle")}
        options={FOCUS_LOCK_PRAYERS.map((prayer) => {
          const label = prayer === "jumuah" ? t("focusLock.jumuah") : t(`prayers.${prayer}`);
          return { id: prayer, short: label, long: label };
        })}
        selected={prefs.prayers}
        readOnly={readOnly}
        onToggle={(prayer, on) => void save(toggleFocusPrayer(prefs, prayer, on))}
      />

      {iqamahAvailable ? (
        <>
          <ThemedText type="smallBold">{t("focusLock.form.anchorTitle")}</ThemedText>
          <SegmentedControl
            options={[
              { id: "adhan", label: t("focusLock.form.anchor.adhan") },
              { id: "iqamah", label: t("focusLock.form.anchor.iqamah") },
            ]}
            value={prefs.start.anchor}
            onChange={(anchor) => !readOnly && set({ start: { ...prefs.start, anchor } })}
          />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("focusLock.form.anchorHint")}
          </ThemedText>
        </>
      ) : null}

      <StepperRow
        label={t("focusLock.form.offset")}
        value={prefs.start.offsetMin}
        step={offsetMin.step}
        min={offsetMin.min}
        max={offsetMin.max}
        readOnly={readOnly}
        onChange={(v) => set({ start: { ...prefs.start, offsetMin: v } })}
      />
      <StepperRow
        label={t("focusLock.form.duration")}
        value={prefs.durationMin}
        step={durationMin.step}
        min={durationMin.min}
        max={durationMin.max}
        readOnly={readOnly}
        onChange={(v) => set({ durationMin: v })}
      />
      {prefs.prayers.includes("jumuah") ? (
        <>
          <StepperRow
            label={t("focusLock.form.jumuahDuration")}
            value={prefs.jumuahDurationMin}
            step={jumuahDurationMin.step}
            min={jumuahDurationMin.min}
            max={jumuahDurationMin.max}
            readOnly={readOnly}
            onChange={(v) => set({ jumuahDurationMin: v })}
          />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("focusLock.form.jumuahDurationHint")}
          </ThemedText>
        </>
      ) : null}

      <ThemedText type="smallBold">{t("focusLock.form.modeTitle")}</ThemedText>
      <SegmentedControl<FocusLockUnlockMode>
        options={FOCUS_LOCK_UNLOCK_MODES.map((id) => ({
          id,
          label: t(`focusLock.form.mode.${id}`),
        }))}
        value={prefs.unlockMode}
        onChange={(unlockMode) => !readOnly && set({ unlockMode })}
      />
      <ThemedText type="caption" themeColor="mutedForeground">
        {t(modeHintKey)}
      </ThemedText>
      <StepperRow
        label={t("focusLock.form.emergency")}
        value={prefs.emergencyUnlocksPerDay}
        step={1}
        min={minEmergencyUnlocks(prefs.unlockMode)}
        max={emergencyUnlocksPerDay.max}
        readOnly={readOnly}
        onChange={(v) => set({ emergencyUnlocksPerDay: v })}
      />

      <ToggleRow
        label={t("focusLock.form.pauseExcused")}
        hint={t("focusLock.form.pauseExcusedHint")}
        value={prefs.pauseWhileExcused}
        readOnly={readOnly}
        onChange={(pauseWhileExcused) => set({ pauseWhileExcused })}
      />
      <ToggleRow
        label={t("focusLock.form.weekdaysOnly")}
        hint={t("focusLock.form.weekendHint")}
        value={prefs.schedule.weekdaysOnly === true}
        readOnly={readOnly}
        onChange={(weekdaysOnly) => set({ schedule: { ...prefs.schedule, weekdaysOnly } })}
      />
      {prefs.schedule.weekdaysOnly ? (
        <WeekendDayChips
          selected={weekend}
          readOnly={readOnly}
          onToggle={(day, on) => void save(toggleWeekendDay(prefs, weekend, day, on))}
          onReset={
            prefs.schedule.weekendDays && !sameDays(prefs.schedule.weekendDays, regionDefault)
              ? () => void save(resetWeekendDays(prefs))
              : undefined
          }
        />
      ) : null}
    </View>
  );
}

function sameDays(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((d) => b.includes(d));
}

type ChipOption<T> = { id: T; short: string; long: string };

/**
 * Multi-select chips (checkbox semantics, 44pt targets). `max` keeps at least
 * one option unselected (the weekend can't be the whole week).
 */
function ToggleChips<T extends string | number>({
  title,
  options,
  selected,
  readOnly,
  max,
  onToggle,
}: {
  title: string;
  options: readonly ChipOption<T>[];
  selected: readonly T[];
  readOnly?: boolean;
  max?: number;
  onToggle: (id: T, on: boolean) => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const full = max != null && selected.length >= max;
  return (
    <View style={styles.weekend}>
      <ThemedText type="smallBold" accessibilityRole="header">
        {title}
      </ThemedText>
      <View style={styles.chips}>
        {options.map(({ id, short, long }) => {
          const on = selected.includes(id);
          const disabled = readOnly || (!on && full);
          return (
            <PressableScale
              key={String(id)}
              haptic="selection"
              scaleTo={0.95}
              disabled={disabled}
              accessibilityRole="checkbox"
              accessibilityLabel={long}
              accessibilityState={{ checked: on, disabled }}
              onPress={() => onToggle(id, !on)}
              style={[
                styles.chip,
                {
                  backgroundColor: on ? tokens.accentSoft : colors.card,
                  borderColor: on ? colors.accent : colors.border,
                },
              ]}
            >
              <ThemedText type="caption" numberOfLines={1}>
                {short}
              </ThemedText>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

/** Seven Sunday-first day chips (D37); the selected days are the weekend. */
function WeekendDayChips({
  selected,
  readOnly,
  onToggle,
  onReset,
}: {
  selected: readonly number[];
  readOnly?: boolean;
  onToggle: (day: number, on: boolean) => void;
  onReset?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const days = useMemo(
    () =>
      weekdayNames(localeToBcp47(i18n.language)).map(({ day, short, long }) => ({
        id: day,
        short,
        long,
      })),
    [i18n.language],
  );

  return (
    <View style={styles.weekend}>
      {/* Keep at least one working day. */}
      <ToggleChips
        title={t("focusLock.form.weekendDaysTitle")}
        options={days}
        selected={selected}
        readOnly={readOnly}
        max={6}
        onToggle={onToggle}
      />
      {onReset && !readOnly ? (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("focusLock.form.weekendReset")}
          onPress={onReset}
          style={styles.reset}
        >
          <ThemedText type="caption" themeColor="accent">
            {t("focusLock.form.weekendReset")}
          </ThemedText>
        </PressableScale>
      ) : null}
    </View>
  );
}

/** Sunday-first weekday names (index = JS weekday); plain numbers if `Intl` is missing. */
function weekdayNames(bcp47: string): { day: number; short: string; long: string }[] {
  let short: Intl.DateTimeFormat | null = null;
  let long: Intl.DateTimeFormat | null = null;
  try {
    short = new Intl.DateTimeFormat(bcp47, { weekday: "short" });
    long = new Intl.DateTimeFormat(bcp47, { weekday: "long" });
  } catch {
    // Fall through to numbers.
  }
  // 2023-01-01 was a Sunday.
  return Array.from({ length: 7 }, (_, day) => {
    const date = new Date(2023, 0, 1 + day, 12);
    return {
      day,
      short: short?.format(date) ?? String(day + 1),
      long: long?.format(date) ?? String(day + 1),
    };
  });
}

export function ToggleRow({
  label,
  hint,
  value,
  readOnly,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  readOnly?: boolean;
  onChange: (next: boolean) => void;
}) {
  const { colors } = useThemeTokens();
  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <View style={styles.copy}>
        <ThemedText type="small">{label}</ThemedText>
        {hint ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {hint}
          </ThemedText>
        ) : null}
      </View>
      <ThemedSwitch
        value={value}
        disabled={readOnly}
        onValueChange={onChange}
        accessibilityLabel={label}
      />
    </View>
  );
}

function StepperRow({
  label,
  value,
  step,
  min,
  max,
  readOnly,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  min: number;
  max: number;
  readOnly?: boolean;
  onChange: (next: number) => void;
}) {
  const { colors } = useThemeTokens();
  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <ThemedText type="small" style={styles.copy}>
        {label}
      </ThemedText>
      {readOnly ? (
        <ThemedText type="smallBold">{value}</ThemedText>
      ) : (
        <Stepper
          label={label}
          value={value}
          min={min}
          size="sm"
          onDecrement={() => onChange(Math.max(min, value - step))}
          onIncrement={() => onChange(Math.min(max, value + step))}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  row: {
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  copy: { flex: 1, gap: Spacing.half },
  weekend: { gap: Spacing.two },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  chip: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.two,
  },
  reset: { alignSelf: "flex-start", paddingVertical: Spacing.one },
});
