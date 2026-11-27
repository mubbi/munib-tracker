import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * Marks a setting that only applies to (and is stored on) this device. A compact
 * pill (small glyph + caption) meant for a row's title line, where it wraps under
 * a long title instead of taking width from the text column.
 */
export function ThisDeviceBadge() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <View testID="this-device-badge" style={[styles.pill, { backgroundColor: tokens.hairline }]}>
      <SymbolView
        name={{ ios: "iphone", android: "smartphone", web: "smartphone" }}
        size={11}
        tintColor={colors.mutedForeground}
      />
      <ThemedText
        type="caption"
        themeColor="mutedForeground"
        numberOfLines={1}
        maxFontSizeMultiplier={1.3}
      >
        {t("settingsPanel.thisDevice")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    flexShrink: 0,
    gap: Spacing.one,
    paddingHorizontal: Spacing.oneHalf,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
});
