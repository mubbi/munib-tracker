import { MADHHAB_IDS, type MadhhabId } from "@munib-tracker/shared/fiqh/core";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

const CHECK_ICON = {
  ios: "checkmark.circle.fill",
  android: "check_circle",
  web: "check_circle",
} as const;
const EMPTY_ICON = {
  ios: "circle",
  android: "radio_button_unchecked",
  web: "radio_button_unchecked",
} as const;
const INFO_ICON = { ios: "questionmark.circle", android: "help", web: "help" } as const;

/** Picker value: a school, or `null` = "Show all views". */
export type MadhhabChoice = MadhhabId | null;

type MadhhabPickerProps = {
  /** Current choice; `undefined` = never asked (nothing selected yet). */
  value: MadhhabChoice | undefined;
  onChange: (choice: MadhhabChoice) => void;
  /** Hide the "Show all views" option (e.g. per-domain overrides that already inherit). */
  hideAllViews?: boolean;
  /** Hide the "Not sure?" explainer (when the host shows its own). */
  hideNotSure?: boolean;
};

type Option = { key: string; choice: MadhhabChoice; name: string; description: string };

/**
 * Reusable "My madhhab" picker (NF-3.0a): the four schools in a fixed, neutral
 * order plus "Show all views", each with a short factual description and no
 * ranking. The "Not sure?" explainer never recommends a school. Shared by
 * onboarding, Settings › Fiqh & madhhab and the lazy sheet.
 */
export function MadhhabPicker({
  value,
  onChange,
  hideAllViews = false,
  hideNotSure = false,
}: MadhhabPickerProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [notSureOpen, setNotSureOpen] = useState(false);
  const tv = isTV();

  const options: Option[] = MADHHAB_IDS.map((id) => ({
    key: id,
    choice: id,
    name: t(`fiqh.school.${id}`),
    description: t(`fiqh.picker.desc.${id}`),
  }));
  if (!hideAllViews) {
    options.push({
      key: "all",
      choice: null,
      name: t("fiqh.picker.allViews"),
      description: t("fiqh.picker.allViewsDesc"),
    });
  }

  return (
    <View
      style={styles.root}
      accessibilityRole="radiogroup"
      accessibilityLabel={t("fiqh.picker.title")}
    >
      {options.map((option, index) => {
        const selected = value !== undefined && value === option.choice;
        return (
          <PressableScale
            key={option.key}
            testID={`madhhab-option-${option.key}`}
            haptic="selection"
            scaleTo={0.98}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected }}
            accessibilityLabel={t("fiqh.picker.optionA11y", {
              name: option.name,
              description: option.description,
            })}
            onPress={() => onChange(option.choice)}
            {...(tv && (selected || (value === undefined && index === 0))
              ? { hasTVPreferredFocus: true }
              : {})}
            style={[
              styles.option,
              {
                backgroundColor: selected ? tokens.accentSoft : colors.card,
                borderColor: selected ? tokens.accentBorder : colors.cardBorder,
              },
            ]}
          >
            <View style={styles.optionText}>
              <ThemedText type="smallBold">{option.name}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {option.description}
              </ThemedText>
            </View>
            <SymbolView
              name={selected ? CHECK_ICON : EMPTY_ICON}
              size={20}
              tintColor={selected ? colors.accent : colors.mutedForeground}
            />
          </PressableScale>
        );
      })}
      {hideNotSure ? null : (
        <View style={styles.notSure}>
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityState={{ expanded: notSureOpen }}
            accessibilityLabel={t("fiqh.picker.notSure.a11y")}
            onPress={() => setNotSureOpen((open) => !open)}
            style={styles.notSureToggle}
          >
            <SymbolView name={INFO_ICON} size={16} tintColor={colors.accentText} />
            <ThemedText type="label" style={{ color: colors.accentText }}>
              {t("fiqh.picker.notSure.title")}
            </ThemedText>
          </PressableScale>
          {notSureOpen ? (
            <ThemedText type="small" themeColor="mutedForeground">
              {t("fiqh.picker.notSure.body")}
            </ThemedText>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.two },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  optionText: { flex: 1, gap: Spacing.half },
  notSure: { gap: Spacing.two, marginTop: Spacing.one },
  notSureToggle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.one,
  },
});
