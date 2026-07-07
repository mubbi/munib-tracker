import type { MushafLine, MushafPageLayout } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useQcfPageFont } from "@/hooks/use-qcf-page-font";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { parseVerseRange } from "@/lib/quran";

type MushafLineRendererProps = {
  layout: MushafPageLayout;
  page: number;
  highlightAyah?: { surah: number; ayah: number };
  onAyahPress?: (surah: number, ayah: number) => void;
};

function mushafLineKey(page: number, line: MushafLine): string {
  switch (line.type) {
    case "surah_name":
      return `${page}:surah:${line.surah}:${line.text}`;
    case "basmala":
      return `${page}:basmala:${line.glyphs}`;
    case "text":
      return `${page}:text:${line.verseRange ?? "x"}:${line.alignment}:${line.glyphs}`;
  }
}

/** Level B — 15-line Madani mushaf with QPC V2 glyph font. */
export function MushafLineRenderer({
  layout,
  page,
  highlightAyah,
  onAyahPress,
}: MushafLineRendererProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ready, fontFamily } = useQcfPageFont(page);

  return (
    <Card padding="four" style={styles.card}>
      {!ready ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent} />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quran.loadingMushafFont")}
          </ThemedText>
        </View>
      ) : null}
      <View style={styles.lines}>
        {layout.lines.map((line) => {
          const lineKey = mushafLineKey(page, line);
          if (line.type === "surah_name") {
            return (
              <ThemedText
                key={lineKey}
                type="arabic"
                style={[styles.surahName, { fontFamily, color: colors.accent }]}
              >
                {line.text}
              </ThemedText>
            );
          }
          if (line.type === "basmala") {
            return (
              <ThemedText
                key={lineKey}
                type="arabic"
                style={[styles.basmala, { fontFamily, textAlign: "center" }]}
              >
                {line.glyphs}
              </ThemedText>
            );
          }
          const refs = parseVerseRange(line.verseRange);
          const primary = refs[0];
          const highlighted =
            primary &&
            highlightAyah?.surah === primary.surah &&
            highlightAyah?.ayah === primary.ayah;
          return (
            <PressableScale
              key={lineKey}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={
                primary
                  ? t("quran.ayahRef", { surah: primary.surah, ayah: primary.ayah })
                  : t("quran.pageN", { n: page })
              }
              onPress={() => primary && onAyahPress?.(primary.surah, primary.ayah)}
              style={[
                styles.textLine,
                line.alignment === "centered" ? styles.centered : styles.justified,
                highlighted ? { backgroundColor: tokens.accentSoft } : null,
              ]}
            >
              <ThemedText
                type="arabic"
                style={[
                  styles.mushafText,
                  { fontFamily },
                  line.alignment === "centered" ? styles.centeredText : styles.justifiedText,
                ]}
              >
                {line.glyphs}
              </ThemedText>
            </PressableScale>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minHeight: 420 },
  loading: {
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  lines: { gap: Spacing.two },
  surahName: {
    fontSize: 22,
    lineHeight: 36,
    textAlign: "center",
    marginVertical: Spacing.two,
  },
  basmala: {
    fontSize: 20,
    lineHeight: 34,
    marginBottom: Spacing.two,
  },
  textLine: {
    paddingVertical: Spacing.one,
    borderRadius: 6,
  },
  mushafText: {
    fontSize: 22,
    lineHeight: 40,
    writingDirection: "rtl",
  },
  centered: { alignItems: "center" },
  justified: { width: "100%" },
  centeredText: { textAlign: "center" },
  justifiedText: { textAlign: "justify", width: "100%" },
});
