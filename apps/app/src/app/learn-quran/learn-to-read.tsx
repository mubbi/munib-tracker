import type { QuranGuideReadingLevel } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { QuranGuideClipPlayButton } from "@/components/quran-guide/ayah-play-button";
import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideReadingLevels,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

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
          compact
          label={t("learnQuran.levelBadge", { level: level.level })}
          color={colors.accentText}
          background={tokens.accentSoft}
          style={styles.badge}
        />
        {level.practiceAudio ? (
          <QuranGuideClipPlayButton
            audio={level.practiceAudio}
            sourceHref="/learn-quran/learn-to-read"
          />
        ) : null}
      </View>
      <ThemedText type="header" heading={3}>
        {level.title}
      </ThemedText>
      {/* TV: prose is a D-pad stop so levels without audio can still be scrolled to. */}
      <TvReadableBlock style={styles.prose}>
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
      </TvReadableBlock>
    </Card>
  );
}

export default function LearnQuranLearnToReadScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
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
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/learn-quran/learn-to-read" />
      <LearnContentGate ready={contentReady}>
        <LearnSplitLayout aside={<QuranGuideTopicAside currentId="learn-to-read" />}>
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
        </LearnSplitLayout>
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
  prose: { gap: Spacing.two },
  topics: {
    gap: Spacing.one,
    marginTop: Spacing.one,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/learn-to-read");
