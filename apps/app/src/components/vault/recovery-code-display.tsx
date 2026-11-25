import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Checkbox } from "@/components/ui/checkbox";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type RecoveryCodeDisplayProps = {
  words: readonly string[];
  /** Called once the user confirms they saved the code; the words are then discarded. */
  onConfirmed: () => void;
  /**
   * The host blocked a dismiss attempt (scrim, swipe, Back, Escape): show why,
   * next to the check box that unlocks "Done".
   */
  dismissBlocked?: boolean;
};

/**
 * Shows the 24-word recovery code exactly once. The host sheet must not be
 * dismissable while this is shown (S-01): only `onConfirmed` — enabled once the
 * "I've saved it" box is ticked — may close it, because closing discards the
 * words for good. The words are the English
 * BIP-39 list in every locale (they must match on any device), so the grid is
 * always laid out left-to-right with Latin numerals.
 */
export function RecoveryCodeDisplay({
  words,
  onConfirmed,
  dismissBlocked = false,
}: RecoveryCodeDisplayProps) {
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
      <Callout tone="warning">{t("vault.recovery.onlyOnce")}</Callout>
      <Checkbox label={t("vault.recovery.confirmSaved")} checked={saved} onChange={setSaved} />
      {dismissBlocked && !saved ? (
        <Callout tone="danger">{t("vault.recovery.saveFirst")}</Callout>
      ) : null}
      <Button
        label={t("vault.recovery.done")}
        disabled={!saved}
        accessibilityHint={saved ? undefined : t("vault.recovery.doneHint")}
        fullWidth
        onPress={onConfirmed}
      />
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
    borderWidth: BorderWidth.hairline,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    padding: Spacing.two,
    rowGap: Spacing.one,
  },
  cell: { width: "33.33%", flexDirection: "row", alignItems: "baseline", gap: Spacing.one },
  number: { minWidth: 20, textAlign: "right", writingDirection: "ltr" },
  word: { writingDirection: "ltr" },
});
