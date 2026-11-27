import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ensureBattlesContent, getBattlesLessonCards, isBattlesContentReady } from "@/lib/battles";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function BattlesLessonsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const {
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const cards = getBattlesLessonCards();
  const wide = useLearnHubLayout();
  // Wide web / tablets: lesson cards flow into 2–3 columns.
  const columns = learnColumnsFor(wide.contentWidth, { minCell: 320, gap: Spacing.four, max: 3 });

  const lessonCards = cards.map((card) => (
    <PressableScale
      key={card.id}
      haptic="light"
      accessibilityRole="button"
      style={columns > 1 ? styles.fill : undefined}
      onPress={() =>
        router.push({
          pathname: "/battles/[topic]",
          params: { topic: card.battleId },
        })
      }
    >
      <Card style={[styles.card, columns > 1 && styles.fill]}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {card.battleTitle}
        </ThemedText>
        <LearnProseText proseRole="title">{card.lesson}</LearnProseText>
        <LearnProseText themeColor="mutedForeground">{card.detail}</LearnProseText>
        <View style={[styles.chip, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="caption" style={{ color: tokens.accentOnSoft }}>
            {t("battles.readBattle")}
          </ThemedText>
        </View>
      </Card>
    </PressableScale>
  ));

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.lessonsTitle")}
      subtitle={t("battles.lessonsSubtitle")}
      readingProgress
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/battles/lessons" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retryContent}>
        <Stagger>
          <JannahCallout tone="info">{t("battles.lessonsIntro")}</JannahCallout>

          <LearnReadingChrome surface="battles">
            {columns > 1 ? (
              <LearnColumnsGrid columns={columns} gap={Spacing.four}>
                {lessonCards}
              </LearnColumnsGrid>
            ) : (
              lessonCards
            )}
          </LearnReadingChrome>

          <JannahDisclaimer textKey="battles.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  // Grid cells: equal-height cards per row.
  fill: { flexGrow: 1 },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/battles/lessons");
