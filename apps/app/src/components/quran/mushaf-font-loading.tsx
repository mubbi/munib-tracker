import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
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

/** Shown when a page font could not be fetched from any source. */
export function MushafFontError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.root} accessibilityRole="alert">
      <ThemedText type="smallBold">{t("quran.mushafFontFailedTitle")}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.body}>
        {t("quran.mushafFontFailedBody")}
      </ThemedText>
      <Button label={t("common.tryAgain")} variant="secondary" size="sm" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { textAlign: "center", maxWidth: 320 },
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
});
