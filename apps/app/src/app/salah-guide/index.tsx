import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  JannahCallout,
  JannahDisclaimer,
  JannahDuaBlock,
  JannahNavRow,
  JannahQuickLinkGrid,
} from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureSalahGuideContent,
  getPrayerRakats,
  getSalahGuideLessonCount,
  getSalahGuidePhrases,
  getSalahGuideTopicsByJourney,
  isSalahGuideContentReady,
} from "@/lib/salah-guide";
import {
  useEnsureSalahGuideProgressLoaded,
  useSalahGuideCompletedCount,
} from "@/stores/salah-guide-progress-store";

const JOURNEY_ORDER = ["why", "prepare", "learn", "practice", "perfect", "consistency"] as const;

const TOPIC_ICONS: Record<string, AppIcon> = {
  introduction: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  "why-salah": { ios: "heart.fill", android: "favorite", web: "favorite" },
  importance: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  "who-must-pray": { ios: "person.3.fill", android: "groups", web: "groups" },
  conditions: { ios: "checklist", android: "checklist", web: "checklist" },
  taharah: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  wudu: { ios: "hands.sparkles.fill", android: "volunteer_activism", web: "volunteer_activism" },
  tayammum: { ios: "hand.raised.fill", android: "back_hand", web: "back_hand" },
  clothing: { ios: "tshirt.fill", android: "checkroom", web: "checkroom" },
  "prayer-times": { ios: "clock.fill", android: "schedule", web: "schedule" },
  qiblah: { ios: "location.north.fill", android: "explore", web: "explore" },
  adhan: { ios: "speaker.wave.3.fill", android: "campaign", web: "campaign" },
  "how-to-pray": { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  positions: { ios: "figure.walk", android: "directions_walk", web: "directions_walk" },
  "common-mistakes": { ios: "xmark.circle.fill", android: "cancel", web: "cancel" },
  "sunnah-practices": { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
  khushu: { ios: "brain.head.profile", android: "psychology", web: "psychology" },
  "pillars-nullifiers": {
    ios: "building.columns.fill",
    android: "account_balance",
    web: "account_balance",
  },
  "prayer-types": { ios: "square.grid.2x2.fill", android: "apps", web: "apps" },
  congregational: { ios: "person.2.fill", android: "groups", web: "groups" },
  qada: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
  "after-salah": {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
};

export default function SalahGuideScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureSalahGuideProgressLoaded();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureSalahGuideContent,
    isSalahGuideContentReady,
  );
  const completedCount = useSalahGuideCompletedCount();
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const lessonTotal = useMemo(() => getSalahGuideLessonCount(), [contentVersion]);
  // Recompute when locale changes or the lazy content chunk finishes loading.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const TOPICS_BY_JOURNEY = useMemo(
    () => getSalahGuideTopicsByJourney(),
    [i18n.language, contentVersion],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const FEATURED_PHRASE = useMemo(() => getSalahGuidePhrases()[0], [i18n.language, contentVersion]);

  const quickLinks = useMemo(
    () => [
      {
        id: "how-to-pray",
        icon: {
          ios: "figure.stand",
          android: "self_improvement",
          web: "self_improvement",
        } as AppIcon,
        title: t("salahGuide.quickHowToPray"),
        subtitle: t("salahGuide.quickHowToPrayHint"),
        tint: colors.accent,
        onPress: () => router.push("/salah-guide/how-to-pray"),
      },
      {
        id: "wudu",
        icon: { ios: "drop.fill", android: "water_drop", web: "water_drop" } as AppIcon,
        title: t("salahGuide.quickWudu"),
        subtitle: t("salahGuide.quickWuduHint"),
        tint: tokens.status.info.color,
        onPress: () => router.push("/salah-guide/wudu"),
      },
      {
        id: "phrases",
        icon: {
          ios: "text.book.closed.fill",
          android: "auto_stories",
          web: "auto_stories",
        } as AppIcon,
        title: t("salahGuide.quickPhrases"),
        subtitle: t("salahGuide.quickPhrasesHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/salah-guide/phrases"),
      },
      {
        id: "progress",
        icon: {
          ios: "chart.line.uptrend.xyaxis",
          android: "trending_up",
          web: "trending_up",
        } as AppIcon,
        title: t("salahGuide.quickProgress"),
        subtitle: t("salahGuide.quickProgressHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/salah-guide/progress"),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  return (
    <ScreenLayout
      eyebrow={t("salahGuide.eyebrow")}
      title={t("salahGuide.title")}
      subtitle={t("salahGuide.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/salah-guide" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("salahGuide.intro")}</JannahCallout>

          <LearnQuizNavRow
            quizPath={"/salah-guide/quiz" as Href}
            titleKey="common.learnQuiz.title"
            subtitleKey="common.learnQuiz.hint"
          />

          <Card padding="three">
            <SectionHeader
              title={t("salahGuide.quickLinksTitle")}
              icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
            />
            <JannahQuickLinkGrid items={quickLinks} />
          </Card>

          <JannahNavRow
            icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
            title={t("salahGuide.progressCardTitle")}
            subtitle={t("salahGuide.progressCardHint", {
              completed: completedCount,
              total: lessonTotal,
            })}
            badge={`${completedCount}/${lessonTotal}`}
            tint={colors.accent}
            onPress={() => router.push("/salah-guide/progress")}
          />

          {JOURNEY_ORDER.map((phase) => {
            const topics = TOPICS_BY_JOURNEY[phase];
            if (!topics?.length) return null;
            return (
              <Card key={phase} padding="three">
                <SectionHeader
                  title={t(`salahGuide.journey.${phase}`)}
                  icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
                />
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.phaseHint}>
                  {t(`salahGuide.journey.${phase}Hint`)}
                </ThemedText>
                <View style={styles.rows}>
                  {topics.map((topic) => (
                    <JannahNavRow
                      key={topic.id}
                      icon={
                        TOPIC_ICONS[topic.id] ?? {
                          ios: "text.book.closed",
                          android: "article",
                          web: "article",
                        }
                      }
                      title={topic.title}
                      subtitle={topic.summary}
                      badge={
                        topic.importance
                          ? t(`salahGuide.importance.${topic.importance}`)
                          : undefined
                      }
                      onPress={() =>
                        topic.id === "adhan"
                          ? router.push("/salah-guide/adhan")
                          : router.push({
                              pathname: "/salah-guide/[topic]",
                              params: { topic: topic.id },
                            })
                      }
                    />
                  ))}
                </View>
              </Card>
            );
          })}

          {FEATURED_PHRASE ? (
            <JannahDuaBlock
              title={t("salahGuide.featuredPhraseTitle")}
              arabic={FEATURED_PHRASE.arabic}
              transliteration={FEATURED_PHRASE.transliteration}
              translation={FEATURED_PHRASE.translation}
              reference={FEATURED_PHRASE.reference}
            />
          ) : null}

          <Card padding="three">
            <SectionHeader
              title={t("salahGuide.rakatsTitle")}
              icon={{
                ios: "list.number",
                android: "format_list_numbered",
                web: "format_list_numbered",
              }}
            />
            <View style={styles.tableHead}>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.colName}>
                {t("salahGuide.prayer")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.colNum}>
                {t("salahGuide.fard")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.colNum}>
                {t("salahGuide.sunnah")}
              </ThemedText>
            </View>
            {getPrayerRakats().map((row) => (
              <View
                key={row.prayerId}
                style={[styles.tableRow, { borderTopColor: tokens.hairline }]}
              >
                <ThemedText type="small" style={styles.colName}>
                  {t(`prayers.${row.prayerId}`)}
                </ThemedText>
                <ThemedText type="small" style={styles.colNum}>
                  {row.fard || "—"}
                </ThemedText>
                <ThemedText type="small" style={styles.colNum}>
                  {row.sunnahBefore + row.sunnahAfter || "—"}
                </ThemedText>
              </View>
            ))}
          </Card>

          <Card padding="three">
            <SectionHeader
              title={t("salahGuide.relatedTitle")}
              icon={{ ios: "link", android: "link", web: "link" }}
            />
            <View style={styles.rows}>
              <JannahNavRow
                icon={{ ios: "airplane", android: "flight", web: "flight" }}
                title={t("travel.title")}
                subtitle={t("salahGuide.travelPointer")}
                onPress={() => router.push("/travel")}
              />
              <JannahNavRow
                icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
                title={t("salahGuide.qazaLink")}
                subtitle={t("salahGuide.qazaLinkHint")}
                onPress={() => router.push("/qaza")}
              />
              <JannahNavRow
                icon={{
                  ios: "hands.and.sparkles.fill",
                  android: "volunteer_activism",
                  web: "volunteer_activism",
                }}
                title={t("salahGuide.duasLink")}
                subtitle={t("salahGuide.duasLinkHint")}
                onPress={() => router.push("/dua/prayer")}
              />
            </View>
          </Card>

          <View style={styles.pillRow}>
            <Pill
              label={t("salahGuide.phaseV1")}
              compact
              color={colors.mutedForeground}
              background={colors.muted}
            />
            <Pill
              label={t("salahGuide.phaseV2")}
              compact
              color={colors.mutedForeground}
              background={colors.muted}
            />
          </View>

          <JannahDisclaimer textKey="salahGuide.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  phaseHint: { marginTop: Spacing.one, lineHeight: 20 },
  tableHead: {
    flexDirection: "row",
    marginTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.two + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  colName: { flex: 1 },
  colNum: { width: 64, textAlign: "center" },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "center" },
});
