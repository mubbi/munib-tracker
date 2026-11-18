import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { TvNumberStepper } from "@/components/tv-number-stepper";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { isTV } from "@/lib/platform/is-tv";

/** Upper bound shared by the phone input (5 digits) and the TV stepper. */
const MAX_COUNT = 99_999;

type QazaCountEditModalProps = {
  visible: boolean;
  initialValue: number;
  onSubmit: (remaining: number) => void;
  onClose: () => void;
  /** Prayer-specific copy — used when custom `title` is not provided. */
  prayerLabel?: string;
  title?: string;
  hint?: string;
  placeholder?: string;
  accessibilityLabel?: string;
};

/** Manual remaining-qaza editor opened from a stepper value or stat. */
export function QazaCountEditModal({
  visible,
  prayerLabel,
  title,
  hint,
  placeholder,
  accessibilityLabel,
  initialValue,
  onSubmit,
  onClose,
}: QazaCountEditModalProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const tv = isTV();
  const [value, setValue] = useState(String(initialValue));

  useEffect(() => {
    if (visible) setValue(String(initialValue));
  }, [visible, initialValue]);

  const submit = () => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed < 0) return;
    onSubmit(parsed);
  };

  const parsed = Number.parseInt(value, 10);
  const canSubmit = Number.isFinite(parsed) && parsed >= 0;
  const resolvedTitle = title ?? t("qaza.editCountTitle", { prayer: prayerLabel ?? "" });
  // TV has no typing: callers pass a TV-worded hint, or we use the stepper copy.
  const resolvedHint = hint ?? tTv(t, "qaza.editCountHint", "qaza.editCountHintTv");
  const resolvedPlaceholder = placeholder ?? t("qaza.editCountPlaceholder");
  const resolvedA11y = accessibilityLabel ?? t("qaza.editCountA11y", { prayer: prayerLabel ?? "" });

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ThemedText type="subtitle">{resolvedTitle}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {resolvedHint}
      </ThemedText>
      {tv ? (
        <View style={styles.tvStepper}>
          <TvNumberStepper
            value={canSubmit ? parsed : 0}
            onChange={(next) => setValue(String(next))}
            label={resolvedA11y}
            max={MAX_COUNT}
            steps={[1, 10, 100, 1000]}
            preferredFocus
          />
        </View>
      ) : (
        <TextInput
          value={value}
          onChangeText={(text) => setValue(text.replace(/[^0-9]/g, "").slice(0, 5))}
          keyboardType="number-pad"
          // Desktop web: type straight away and press Enter to save.
          autoFocus={Platform.OS === "web"}
          selectTextOnFocus={Platform.OS === "web"}
          onSubmitEditing={Platform.OS === "web" ? submit : undefined}
          placeholder={resolvedPlaceholder}
          placeholderTextColor={colors.mutedForeground}
          accessibilityLabel={resolvedA11y}
          style={[styles.input, tokens.inputSurface, { color: colors.foreground }]}
        />
      )}
      <View style={styles.actions}>
        <Button label={t("common.cancel")} variant="ghost" onPress={onClose} />
        <Button label={t("common.save")} disabled={!canSubmit} onPress={submit} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  tvStepper: {
    marginTop: Spacing.three,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
