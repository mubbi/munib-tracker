import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  ContentInlineLink,
  ContentInlineLinkGroup,
} from "@/components/content/content-inline-link";
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
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { BorderWidth, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ensureBattlesContent,
  getBattlesFigures,
  getBattlesTopic,
  isBattlesContentReady,
} from "@/lib/battles";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function BattlesFiguresScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const {
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const figures = getBattlesFigures();
  const wide = useLearnHubLayout();
  // Wide web / tablets: figure profiles flow into 2–3 columns.
  const columns = learnColumnsFor(wide.contentWidth, { minCell: 340, gap: Spacing.four, max: 3 });

  const figureCards = figures.map((figure) => {
    const isFocused = focus === figure.id;
    return (
      <Card
        key={figure.id}
        style={
          isFocused ? { borderColor: colors.accent, borderWidth: BorderWidth.thin } : undefined
        }
      >
        <TvReadableBlock preferredFocus={isFocused}>
          <SectionHeader
            title={figure.name}
            icon={{ ios: "person.fill", android: "person", web: "person" }}
          />
          {figure.epithet ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {figure.epithet}
            </ThemedText>
          ) : null}
          <LearnProseText style={styles.summary}>{figure.summary}</LearnProseText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("battles.figureRole", { role: figure.role })}
          </ThemedText>
        </TvReadableBlock>

        <View style={styles.battles}>
          <ThemedText type="smallBold">{t("battles.figureBattles")}</ThemedText>
          <ContentInlineLinkGroup>
            {figure.battles.map((battleId) => {
              const battle = getBattlesTopic(battleId);
              if (!battle) return null;
              return (
                <ContentInlineLink
                  key={battleId}
                  label={battle.title}
                  onPress={() =>
                    router.push({
                      pathname: "/battles/[topic]",
                      params: { topic: battleId },
                    })
                  }
                />
              );
            })}
          </ContentInlineLinkGroup>
        </View>

        <TvReadableBlock>
          <View style={styles.lesson}>
            <ThemedText type="smallBold">{t("battles.figureLesson")}</ThemedText>
            <LearnProseText themeColor="mutedForeground">{figure.lesson}</LearnProseText>
          </View>
        </TvReadableBlock>
      </Card>
    );
  });

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.figuresTitle")}
      subtitle={t("battles.figuresSubtitle")}
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/battles/figures" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retryContent}>
        <Stagger>
          <JannahCallout tone="info">{t("battles.figuresIntro")}</JannahCallout>

          <LearnReadingChrome surface="battles">
            {columns > 1 ? (
              <LearnColumnsGrid columns={columns} gap={Spacing.four}>
                {figureCards}
              </LearnColumnsGrid>
            ) : (
              figureCards
            )}
          </LearnReadingChrome>

          <JannahDisclaimer textKey="battles.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  summary: { marginTop: Spacing.two },
  battles: { marginTop: Spacing.three, gap: Spacing.one },
  lesson: { marginTop: Spacing.three, gap: Spacing.one },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/battles/figures");
