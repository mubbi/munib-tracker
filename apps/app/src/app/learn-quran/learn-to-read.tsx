import type { QuranGuideReadingLevel } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { QuranGuideClipPlayButton } from "@/components/quran-guide/ayah-play-button";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
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
import {
  ensureQuranGuideContent,
  getQuranGuideReadingLevels,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";

function LevelCard({ level }: { level: QuranGuideReadingLevel }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();
  const bodySize = sizes.translation;
  const topicSize = Math.max(12, sizes.transliteration);

  return (
    <Card padding="three" style={styles.card}>
      <View style={styles.cardHeader}>
        <Pill
          label={t("learnQuran.levelBadge", { level: level.level })}
          compact
          color={colors.accentText}
          background={tokens.accentSoft}
          style={styles.badge}
        />
        {level.practiceAudio ? (
          <QuranGuideClipPlayButton
            audio={level.practiceAudio}
            sourceHref="/learn-quran/learn-to-read"
            compact
          />
        ) : null}
      </View>
      <ThemedText type="header" heading={3}>
        {level.title}
      </ThemedText>
      <ThemedText
        type="small"
        themeColor="mutedForeground"
        style={{ fontSize: bodySize, lineHeight: bodySize * 1.45 }}
      >
        {level.summary}
      </ThemedText>
      <View style={[styles.topics, { borderTopColor: tokens.hairline }]}>
        {level.topics.map((topic) => (
          <ThemedText
            key={topic}
            type="caption"
            themeColor="mutedForeground"
            style={{ fontSize: topicSize, lineHeight: topicSize * 1.4 }}
          >
            • {topic}
          </ThemedText>
        ))}
      </View>
    </Card>
  );
}

export default function LearnQuranLearnToReadScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
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
      <LearnContentGate ready={contentReady}>
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
                <LevelCard level={level} />
              </View>
            ))}
          </LearnReadingChrome>

          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  levelRow: { width: "100%", alignItems: "center" },
  arrow: { marginVertical: Spacing.one },
  card: { width: "100%", gap: Spacing.two },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  badge: { alignSelf: "flex-start" },
  topics: {
    gap: Spacing.one,
    marginTop: Spacing.one,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
