import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureQuranGuideContent, getQuranGuideReadingLevels } from "@/lib/quran-guide";

export default function LearnQuranLearnToReadScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureContent(ensureQuranGuideContent);
  const levels = getQuranGuideReadingLevels();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.readingTitle")}
      subtitle={t("learnQuran.readingSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/learn-to-read" />
      <Stagger>
        <JannahCallout tone="info">{t("learnQuran.readingIntro")}</JannahCallout>

        <LearnReadingChrome surface="learn_quran">
          {levels.map((level, index) => (
            <View key={level.level} style={styles.levelRow}>
              {index > 0 ? (
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.arrow}>
                  ↓
                </ThemedText>
              ) : null}
              <Card padding="three" style={styles.card}>
                <Pill
                  label={t("learnQuran.levelBadge", { level: level.level })}
                  compact
                  color={colors.accentText}
                  background={tokens.accentSoft}
                />
                <ThemedText type="title" style={styles.levelTitle}>
                  {level.title}
                </ThemedText>
                <ThemedText type="small" themeColor="mutedForeground">
                  {level.summary}
                </ThemedText>
                <View style={styles.topics}>
                  {level.topics.map((topic) => (
                    <ThemedText key={topic} type="caption" themeColor="mutedForeground">
                      • {topic}
                    </ThemedText>
                  ))}
                </View>
              </Card>
            </View>
          ))}
        </LearnReadingChrome>

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  levelRow: { alignItems: "center" },
  arrow: { marginVertical: Spacing.one },
  card: { width: "100%", gap: Spacing.two },
  levelTitle: { lineHeight: 28 },
  topics: { gap: Spacing.one, marginTop: Spacing.two },
});
