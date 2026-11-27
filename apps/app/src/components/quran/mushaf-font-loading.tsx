import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";
import { Spacing } from "@/constants/theme";

/** Line widths of the page-shaped placeholder (a justified block with a short last line). */
const LINE_WIDTHS = ["100%", "100%", "100%", "100%", "100%", "62%"] as const;

/**
 * Page-shaped placeholder while a QCF mushaf page font registers (avoids glyph
 * FOUT). One announced "Loading…" stop; the bones are decorative.
 */
export function MushafFontLoading() {
  const { t } = useTranslation();

  return (
    <SkeletonGroup accessibilityLabel={t("quran.loadingMushafFont")} style={styles.root}>
      <View style={styles.lines}>
        {LINE_WIDTHS.map((width, index) => (
          // Static, never reordered — the index is the line's identity.
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative bones
          <Skeleton key={index} width={width} height={18} style={styles.line} />
        ))}
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("quran.loadingMushafFont")}
      </ThemedText>
    </SkeletonGroup>
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
  lines: { width: "100%", maxWidth: 480, gap: Spacing.three },
  line: { alignSelf: "flex-end" },
  root: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.five,
  },
});
