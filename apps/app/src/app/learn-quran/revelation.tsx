import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  LearnTwoColumnTimeline,
  useLearnTimelineTwoColumn,
} from "@/components/learn-guide/learn-timeline";
import { useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  ensureQuranGuideContent,
  getQuranGuideTimeline,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";

const noop = () => {};

export default function LearnQuranRevelationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const events = getQuranGuideTimeline();
  const tv = isTV();
  const { maxContentWidth } = useLearnWideLayout();
  // Desktop: staggered two-column timeline across the wide canvas.
  const twoColumn = useLearnTimelineTwoColumn();
  const listenText = useMemo(
    () => events.map((event) => `${event.title}. ${event.body}`).join("\n\n"),
    [events],
  );

  const renderCard = (event: (typeof events)[number]) => (
    <PressableScale
      haptic="light"
      // TV: keep link-less events focusable so the D-pad can scroll the timeline.
      disabled={!event.topicId && !tv}
      accessibilityRole={event.topicId ? "button" : "text"}
      onPress={
        event.topicId
          ? () => router.push(`/learn-quran/${event.topicId}` as Href)
          : tv
            ? noop
            : undefined
      }
      style={twoColumn ? styles.timelineCardPressable : styles.cardPressable}
    >
      <Card padding="three" style={twoColumn ? undefined : styles.card}>
        <View style={styles.badges}>
          <Pill
            label={t("seerah.ceBadge", { year: event.year })}
            compact
            color={colors.accentText}
            background={tokens.accentSoft}
          />
          {event.ah != null ? (
            <Pill
              label={t("seerah.ahBadge", { ah: event.ah })}
              compact
              color={tokens.status.success.color}
              background={tokens.status.success.soft}
            />
          ) : null}
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
        {event.topicId ? (
          <View style={styles.linkRow}>
            <ThemedText type="caption" style={{ color: colors.accent }}>
              {t("learnQuran.readArticle")}
            </ThemedText>
            <SymbolView name={chevronForwardIcon} size={12} tintColor={colors.accent} />
          </View>
        ) : null}
      </Card>
    </PressableScale>
  );

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.revelationTitle")}
      subtitle={t("learnQuran.revelationSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
      maxContentWidth={twoColumn ? maxContentWidth : undefined}
    >
      <Seo path="/learn-quran/revelation" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("learnQuran.revelationIntro")}</JannahCallout>

          <LearnReadingChrome surface="learn_quran" listenText={listenText}>
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
          </LearnReadingChrome>

          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: Spacing.three },
  railColumn: { alignItems: "center", width: 16, paddingTop: Spacing.three },
  dot: { width: 12, height: 12, borderRadius: Radius.pill },
  rail: { width: 2, flex: 1, marginTop: Spacing.one },
  cardPressable: {
    flex: 1,
    marginBottom: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  card: { flex: 1 },
  timelineCardPressable: {
    marginBottom: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
    marginBottom: Spacing.two,
  },
  location: { flexDirection: "row", alignItems: "center", gap: 2 },
  title: { marginBottom: Spacing.one },
  linkRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one, marginTop: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/revelation");
