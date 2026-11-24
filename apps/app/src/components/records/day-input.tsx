import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ChoiceChips } from "@/components/self-review/choice-chips";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useRecordFormat } from "@/hooks/use-record-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type DayPresetId, normalizeDayInput } from "@/lib/records/day";

import { LabeledInput } from "./labeled-input";

/**
 * A calendar-day field for the private records (`YYYY-MM-DD` stored). Typing
 * stays free-form, but the line under the field confirms the day it read in
 * the person's own date format (or says it can't read it), so a typo is caught
 * before saving. Optional quick presets (e.g. "In 1 month") fill it in one tap.
 */
export function DayInput({
  label,
  value,
  onChangeText,
  hint,
  presets,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  /** Shown while the field is empty. */
  hint?: string;
  presets?: ReadonlyArray<{ id: DayPresetId; day: string }>;
}) {
  const { t } = useTranslation();
  const { formatDate } = useRecordFormat();
  const { tokens } = useThemeTokens();
  const day = value.trim() ? normalizeDayInput(value) : null;
  const invalid = value.trim() !== "" && day == null;
  const selectedPreset = presets?.find((p) => p.day === day)?.id;

  return (
    <View style={styles.block}>
      <LabeledInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={t("debts.form.datePlaceholder")}
        keyboardType="numbers-and-punctuation"
        autoCorrect={false}
        accessibilityHint={hint}
      />
      {presets?.length ? (
        <ChoiceChips<DayPresetId>
          options={presets.map((p) => ({ id: p.id, label: t(`privateUx.date.preset.${p.id}`) }))}
          value={selectedPreset}
          onChange={(id) => {
            const preset = presets.find((p) => p.id === id);
            if (preset) onChangeText(preset.day);
          }}
          accessibilityLabel={label}
        />
      ) : null}
      <ThemedText
        type="caption"
        accessibilityLiveRegion="polite"
        themeColor={invalid ? undefined : "mutedForeground"}
        style={invalid ? { color: tokens.status.danger.text } : undefined}
      >
        {invalid
          ? t("privateUx.date.invalid")
          : day
            ? t("privateUx.date.reads", { date: formatDate(day) })
            : (hint ?? t("debts.form.dateHint"))}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
});
