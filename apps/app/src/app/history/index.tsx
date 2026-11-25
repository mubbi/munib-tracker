import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { LearnHubScreen, type LearnHubSection } from "@/components/learn-guide/learn-hub-screen";
import {
  LearnTwoColumnTimeline,
  useLearnTimelineTwoColumn,
} from "@/components/learn-guide/learn-timeline";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { IconSize, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ensureIslamicHistoryContent,
  getIslamicHistoryEvents,
  isIslamicHistoryContentReady,
} from "@/lib/islamic-history";
import { routeMetadata } from "@/lib/seo/route-metadata";

type HistoryEvent = ReturnType<typeof getIslamicHistoryEvents>[number];

function HistoryEventCard({ event, flex }: { event: HistoryEvent; flex: boolean }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  // TV: prose-only event cards are D-pad stops so the timeline scrolls by remote.
  return (
    <TvReadableBlock style={flex ? styles.flex : undefined}>
      <View style={[styles.card, { backgroundColor: colors.muted }]}>
        <View style={styles.badges}>
          <Pill label={t("history.ceBadge", { year: event.year })} compact tone="accent" />
          {event.ah != null ? (
            <Pill label={t("history.ahBadge", { ah: event.ah })} compact tone="neutral" />
          ) : null}
          <Pill label={t(`history.era.${event.era}`)} compact tone="neutral" />
          {event.location ? (
            <View style={styles.location}>
              <SymbolView
                name={{ ios: "mappin", android: "place", web: "place" }}
                size={IconSize.xs}
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
      </View>
    </TvReadableBlock>
  );
}

export default function HistoryScreen() {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const content = useEnsureContent(ensureIslamicHistoryContent, isIslamicHistoryContentReady);
  const contentVersion = content.version;
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const events = useMemo(() => getIslamicHistoryEvents(), [i18n.language, contentVersion]);
  // Desktop: staggered two-column timeline across the wide canvas.
  const twoColumn = useLearnTimelineTwoColumn();
  const listenText = useMemo(
    () => events.map((event) => `${event.title}. ${event.body}`).join("\n\n"),
    [events],
  );

  const sections = useMemo<LearnHubSection[]>(
    () => [
      {
        id: "timeline",
        title: t("history.title"),
        icon: { ios: "calendar", android: "history_edu", web: "history_edu" },
        children: (
          <LearnReadingChrome surface="battles" listenText={listenText}>
            {twoColumn ? (
              <LearnTwoColumnTimeline
                items={events}
                keyOf={(event) => event.id}
                renderCard={(event) => <HistoryEventCard event={event} flex={false} />}
              />
            ) : (
              events.map((event, index) => (
                <View key={event.id} style={styles.row}>
                  <View style={styles.railColumn}>
                    <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                    {index < events.length - 1 ? (
                      <View style={[styles.rail, { backgroundColor: tokens.hairline }]} />
                    ) : null}
                  </View>
                  <HistoryEventCard event={event} flex />
                </View>
              ))
            )}
          </LearnReadingChrome>
        ),
      },
    ],
    [t, events, listenText, twoColumn, colors.accent, tokens.hairline],
  );

  return (
    <LearnHubScreen
      ns="history"
      basePath="/history"
      intro={null}
      content={content}
      sections={sections}
      quiz
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: "row", gap: Spacing.three },
  railColumn: { alignItems: "center", width: Spacing.three, paddingTop: Spacing.three },
  dot: { width: tvDp(12), height: tvDp(12), borderRadius: Radius.pill },
  rail: { width: 2, flex: 1, marginTop: Spacing.one },
  card: {
    padding: Spacing.three,
    marginBottom: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
    marginBottom: Spacing.two,
  },
  location: { flexDirection: "row", alignItems: "center", gap: Spacing.half },
  title: { marginBottom: Spacing.one },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/history");
