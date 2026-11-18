import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  LearnTwoColumnTimeline,
  useLearnTimelineTwoColumn,
} from "@/components/learn-guide/learn-timeline";
import { useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ensureIslamicHistoryContent,
  getIslamicHistoryEvents,
  isIslamicHistoryContentReady,
} from "@/lib/islamic-history";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function HistoryScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureIslamicHistoryContent,
    isIslamicHistoryContentReady,
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const events = useMemo(() => getIslamicHistoryEvents(), [i18n.language, contentVersion]);
  const tv = isTV();
  const { maxContentWidth } = useLearnWideLayout();
  // Desktop: staggered two-column timeline across the wide canvas.
  const twoColumn = useLearnTimelineTwoColumn();
  const listenText = useMemo(
    () => events.map((event) => `${event.title}. ${event.body}`).join("\n\n"),
    [events],
  );

  // TV: prose-only event cards are D-pad stops so the timeline scrolls by remote.
  const renderCard = (event: (typeof events)[number]) => (
    <TvReadableBlock style={styles.card}>
      <Card padding="three" style={tv ? undefined : twoColumn ? styles.timelineCard : styles.card}>
        <View style={styles.badges}>
          <Pill
            label={t("history.ceBadge", { year: event.year })}
            compact
            color={colors.accentText}
            background={tokens.accentSoft}
          />
          {event.ah != null ? (
            <Pill
              label={t("history.ahBadge", { ah: event.ah })}
              compact
              color={tokens.status.success.color}
              background={tokens.status.success.soft}
            />
          ) : null}
          <Pill
            label={t(`history.era.${event.era}`)}
            compact
            color={tokens.status.info.color}
            background={tokens.status.info.soft}
          />
          {event.location ? (
            <View style={styles.location}>
              <SymbolView
                name={{ ios: "mappin", android: "place", web: "place" }}
                size={11}
                tintColor={colors.mutedForeground}
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {event.location}
              </ThemedText>
            </View>
          ) : null}
        </View>
        <LearnProseText proseRole="title" style={styles.title}>
          {event.title}
        </LearnProseText>
        <LearnProseText themeColor="mutedForeground">{event.body}</LearnProseText>
      </Card>
    </TvReadableBlock>
  );

  return (
    <ScreenLayout
      eyebrow={t("history.eyebrow")}
      title={t("history.title")}
      subtitle={t("history.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
      maxContentWidth={twoColumn ? maxContentWidth : undefined}
    >
      <Seo path="/history" />
      <LearnReadingChrome surface="battles" listenText={listenText}>
        <LearnContentGate ready={contentReady}>
          <Stagger>
            <LearnQuizNavRow
              quizPath={"/history/quiz" as Href}
              titleKey="common.learnQuiz.title"
              subtitleKey="common.learnQuiz.hint"
            />
            {twoColumn ? (
              <LearnTwoColumnTimeline
                items={events}
                keyOf={(event) => event.id}
                renderCard={renderCard}
              />
            ) : null}
            {twoColumn
              ? null
              : events.map((event, index) => (
                  <View key={event.id} style={styles.row}>
                    <View style={styles.railColumn}>
                      <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                      {index < events.length - 1 ? (
                        <View style={[styles.rail, { backgroundColor: tokens.hairline }]} />
                      ) : null}
                    </View>
                    {renderCard(event)}
                  </View>
                ))}
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
              {t("history.disclaimer")}
            </ThemedText>
          </Stagger>
        </LearnContentGate>
      </LearnReadingChrome>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: Spacing.three },
  railColumn: { alignItems: "center", width: 16, paddingTop: Spacing.three },
  dot: {
    width: 12,
    height: 12,
    borderRadius: Radius.pill,
  },
  rail: { width: 2, flex: 1, marginTop: Spacing.one },
  card: { flex: 1, marginBottom: Spacing.three },
  timelineCard: { marginBottom: Spacing.three },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
    marginBottom: Spacing.two,
  },
  location: { flexDirection: "row", alignItems: "center", gap: 2 },
  title: { marginBottom: Spacing.one },
  disclaimer: { textAlign: "center", marginBottom: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/history");
