import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type RecoveryCodeDisplayProps = {
  words: readonly string[];
  /** Called once the user confirms they saved the code; the words are then discarded. */
  onConfirmed: () => void;
};

/**
 * Shows the 24-word recovery code exactly once. The words are the English
 * BIP-39 list in every locale (they must match on any device), so the grid is
 * always laid out left-to-right with Latin numerals.
 */
export function RecoveryCodeDisplay({ words, onConfirmed }: RecoveryCodeDisplayProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.wrap}>
      <ThemedText type="subtitle" heading={2}>
        {t("vault.recovery.title")}
      </ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("vault.recovery.body", { total: words.length })}
      </ThemedText>
      <View
        style={[
          styles.grid,
          { borderColor: colors.border, backgroundColor: tokens.inputSurface.backgroundColor },
        ]}
        accessible
        accessibilityLabel={t("vault.recovery.a11yList", {
          total: words.length,
          words: words.join(", "),
        })}
      >
        {words
          .map((word, index) => ({ word, position: index + 1 }))
          .map((cell) => (
            <View key={cell.position} style={styles.cell}>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.number}>
                {cell.position}
              </ThemedText>
              <ThemedText type="code" selectable style={styles.word}>
                {cell.word}
              </ThemedText>
            </View>
          ))}
      </View>
      <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
        {t("vault.recovery.onlyOnce")}
      </ThemedText>
      <Pressable
        style={styles.confirmRow}
        onPress={() => setSaved((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: saved }}
        accessibilityLabel={t("vault.recovery.confirmSaved")}
      >
        <ThemedText type="small" style={styles.confirmLabel}>
          {t("vault.recovery.confirmSaved")}
        </ThemedText>
        {/* The row is the one accessible checkbox; the switch is its visual only. */}
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <ThemedSwitch
            value={saved}
            onValueChange={setSaved}
            accessibilityLabel={t("vault.recovery.confirmSaved")}
          />
        </View>
      </Pressable>
      <Button label={t("vault.recovery.done")} disabled={!saved} fullWidth onPress={onConfirmed} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
  grid: {
    // Word order stays left-to-right in RTL locales. RN Web rejects the Yoga
    // `direction` prop; it maps `writingDirection` to CSS `direction`.
    ...Platform.select({
      web: { writingDirection: "ltr" } as const,
      default: { direction: "ltr" } as const,
    }),
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    padding: Spacing.two,
    rowGap: Spacing.one,
  },
  cell: { width: "33.33%", flexDirection: "row", alignItems: "baseline", gap: Spacing.one },
  number: { minWidth: 20, textAlign: "right", writingDirection: "ltr" },
  word: { writingDirection: "ltr" },
  confirmRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  confirmLabel: { flex: 1 },
});
