import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { getQuranGuideLetters } from "@/lib/quran-guide";

export default function LearnQuranLettersScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const letters = getQuranGuideLetters();

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.lettersTitle")}
      subtitle={t("learnQuran.lettersSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/letters" />
      <Stagger>
        <JannahCallout tone="info">{t("learnQuran.lettersIntro")}</JannahCallout>

        <LearnReadingChrome surface="learn_quran">
          <View style={styles.grid}>
            {letters.map((letter) => (
              <Card key={letter.id} padding="three" style={styles.tile}>
                <ThemedText type="arabic" style={styles.glyph}>
                  {letter.letter}
                </ThemedText>
                <ThemedText type="smallBold">{letter.name}</ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {letter.transliteration}
                </ThemedText>
                <ThemedText type="caption" style={styles.pronunciation}>
                  {letter.pronunciation}
                </ThemedText>
                <View style={[styles.examplesBox, { backgroundColor: tokens.accentSoft }]}>
                  {letter.examples.map((ex) => (
                    <ThemedText key={ex} type="caption" style={{ color: colors.accent }}>
                      {ex}
                    </ThemedText>
                  ))}
                </View>
              </Card>
            ))}
          </View>
        </LearnReadingChrome>

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  tile: {
    width: "47%",
    gap: Spacing.one,
    flexGrow: 1,
  },
  glyph: { fontSize: 36, lineHeight: 52, textAlign: "center" },
  pronunciation: { lineHeight: 16 },
  examplesBox: {
    marginTop: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    gap: 2,
  },
});
