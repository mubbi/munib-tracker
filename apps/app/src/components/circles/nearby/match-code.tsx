import { spellMatchCode } from "@munib-tracker/shared/circles/nearby";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ltrControlViewProps } from "@/lib/rtl";

/**
 * D44: the 4 digits both phones show, large and one per box so they're easy to
 * compare at arm's length. Digits always read left-to-right (also in RTL), and
 * screen readers spell them one by one.
 */
export function MatchCode({ code }: { code: string }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const ltr = ltrControlViewProps();
  return (
    <View
      {...ltr}
      style={[ltr.style, styles.row]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={t("nearby.host.codeA11y", { code: spellMatchCode(code) })}
    >
      {code.split("").map((digit, index) => (
        <View
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed 4-digit code, position is the identity.
          key={index}
          style={[styles.box, { backgroundColor: tokens.accentSoft, borderColor: colors.border }]}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        >
          <ThemedText type="display" style={[styles.digit, { color: colors.foreground }]}>
            {digit}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: Spacing.two },
  box: {
    minWidth: 56,
    minHeight: 68,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  digit: { fontVariant: ["tabular-nums"] },
});
