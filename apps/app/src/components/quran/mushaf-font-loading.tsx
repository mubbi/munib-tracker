import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/** Full-area placeholder while a QCF mushaf page font registers (avoids icon/glyph FOUT). */
export function MushafFontLoading() {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();

  return (
    <View style={styles.root}>
      <ActivityIndicator color={tokens.mushaf.ink} />
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("quran.loadingMushafFont")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
});
