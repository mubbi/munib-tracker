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
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ensureJahannamContent,
  getJahannamMajorSinTopics,
  getJahannamRefugeDua,
  getJahannamTopicsBySection,
  isJahannamContentReady,
} from "@/lib/jahannam";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";

export default function JahannamScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureJahannamContent,
    isJahannamContentReady,
  );
  // Recompute per locale so translated topic titles/summaries render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const TOPICS_BY_SECTION = useMemo(
    () => getJahannamTopicsBySection(),
    [i18n.language, contentVersion],
  );
  const SECTION_ORDER = useMemo(
    () => Object.keys(TOPICS_BY_SECTION) as Array<keyof typeof TOPICS_BY_SECTION>,
    [TOPICS_BY_SECTION],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const majorSins = useMemo(() => getJahannamMajorSinTopics(), [i18n.language, contentVersion]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const refugeDua = useMemo(() => getJahannamRefugeDua(), [i18n.language, contentVersion]);

  const quickLinks = useMemo(
    () => [
      {
        id: "verses",
        icon: { ios: "book.fill", android: "menu_book", web: "menu_book" } as AppIcon,
        title: t("jahannam.versesTitle"),
        subtitle: t("jahannam.versesSummary"),
        tint: colors.accent,
        onPress: () => router.push("/jahannam/verses" as Href),
      },
      {
        id: "hadith",
        icon: {
          ios: "text.book.closed.fill",
          android: "auto_stories",
          web: "auto_stories",
        } as AppIcon,
        title: t("jahannam.hadithTitle"),
        subtitle: t("jahannam.hadithSummary"),
        tint: tokens.status.info.color,
        onPress: () => router.push("/jahannam/hadith" as Href),
      },
      {
        id: "reflection",
        icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" } as AppIcon,
        title: t("jahannam.reflectionTitle"),
        subtitle: t("jahannam.reflectionSummary"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/jahannam/reflection" as Href),
      },
      {
        id: "journey",
        icon: {
          ios: "chart.line.uptrend.xyaxis",
          android: "trending_up",
          web: "trending_up",
        } as AppIcon,
        title: t("jahannam.journeyTitle"),
        subtitle: t("jahannam.journeySummary"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/jahannam/journey" as Href),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  const exploreLinks = useMemo(
    () => [
      {
        id: "names",
        icon: {
          ios: "flame.fill",
          android: "local_fire_department",
          web: "local_fire_department",
        } as AppIcon,
        title: t("jahannam.namesTitle"),
        subtitle: t("jahannam.namesSummary"),
        onPress: () => router.push("/jahannam/names" as Href),
      },
      {
        id: "gates",
        icon: { ios: "door.left.hand.open", android: "door_front", web: "door_front" } as AppIcon,
        title: t("jahannam.gatesTitle"),
        subtitle: t("jahannam.gatesSummary"),
        onPress: () => router.push("/jahannam/gates" as Href),
      },
      {
        id: "duas",
        icon: {
          ios: "hands.and.sparkles.fill",
          android: "volunteer_activism",
          web: "volunteer_activism",
        } as AppIcon,
        title: t("jahannam.duasTitle"),
        subtitle: t("jahannam.duasSummary"),
        onPress: () => router.push("/jahannam/duas" as Href),
      },
      {
        id: "references",
        icon: { ios: "doc.text.fill", android: "description", web: "description" } as AppIcon,
        title: t("jahannam.referencesTitle"),
        subtitle: t("jahannam.referencesSummary"),
        onPress: () => router.push("/jahannam/references" as Href),
      },
    ],
    [router, t],
  );

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.title")}
      subtitle={t("jahannam.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/jahannam" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="warning">{t("jahannam.intro")}</JannahCallout>

          <LearnQuizNavRow
            quizPath={"/jahannam/quiz" as Href}
            titleKey="common.learnQuiz.title"
            subtitleKey="common.learnQuiz.hint"
          />

          <Card padding="three">
            <SectionHeader
              title={t("jahannam.quickLinksTitle")}
              icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
            />
            <JannahQuickLinkGrid items={quickLinks} />
          </Card>

          <JannahNavRow
            icon={{ ios: "leaf.fill", android: "park", web: "park" }}
            title={t("jahannam.jannahPairTitle")}
            subtitle={t("jahannam.jannahPairHint")}
            tint={tokens.status.success.color}
            onPress={() => router.push("/jannah" as Href)}
          />

          {SECTION_ORDER.map((section) => {
            if (section === "major-sins") return null;
            const topics = TOPICS_BY_SECTION[section];
            if (!topics?.length) return null;
            return (
              <Card key={section} padding="three">
                <SectionHeader
                  title={t(`jahannam.section.${section}`)}
                  icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
                />
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.sectionHint}>
                  {t(`jahannam.section.${section}Hint`)}
                </ThemedText>
                <View style={styles.rows}>
                  {topics.map((topic) => (
                    <JannahNavRow
                      key={topic.id}
                      icon={{
                        ios: "text.book.closed",
                        android: "article",
                        web: "article",
                      }}
                      title={topic.title}
                      subtitle={topic.summary}
                      badge={
                        topic.importance ? t(`jahannam.importance.${topic.importance}`) : undefined
                      }
                      onPress={() =>
                        router.push({
                          pathname: "/jahannam/[topic]",
                          params: { topic: topic.id },
                        })
                      }
                    />
                  ))}
                </View>
              </Card>
            );
          })}

          <Card padding="three">
            <SectionHeader
              title={t("jahannam.majorSinsTitle")}
              icon={{ ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" }}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.sectionHint}>
              {t("jahannam.majorSinsHint")}
            </ThemedText>
            <View style={styles.sinGrid}>
              {majorSins.map((topic) => (
                <PressableScale
                  key={topic.id}
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={`${topic.title}. ${topic.summary}`}
                  onPress={() =>
                    router.push({
                      pathname: "/jahannam/[topic]",
                      params: { topic: topic.id },
                    })
                  }
                  style={[styles.sinTile, { backgroundColor: colors.muted }]}
                >
                  <ThemedText type="smallBold" numberOfLines={2}>
                    {topic.title}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={3}>
                    {topic.summary}
                  </ThemedText>
                  {topic.importance ? (
                    <Pill
                      label={t(`jahannam.importance.${topic.importance}`)}
                      compact
                      color={colors.mutedForeground}
                      background={colors.card}
                    />
                  ) : null}
                </PressableScale>
              ))}
            </View>
          </Card>

          <Card padding="three">
            <SectionHeader
              title={t("jahannam.exploreTitle")}
              icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
            />
            <View style={styles.rows}>
              {exploreLinks.map((link) => (
                <JannahNavRow
                  key={link.id}
                  icon={link.icon}
                  title={link.title}
                  subtitle={link.subtitle}
                  onPress={link.onPress}
                />
              ))}
            </View>
          </Card>

          {refugeDua ? (
            <JannahDuaBlock
              title={t("jahannam.refugeDuaTitle")}
              arabic={refugeDua.arabic}
              transliteration={refugeDua.transliteration}
              translation={refugeDua.translation}
              reference={refugeDua.reference}
            />
          ) : null}

          <JannahDisclaimer textKey="jahannam.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  sectionHint: { marginTop: Spacing.one, lineHeight: 20 },
  sinGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  sinTile: {
    width: "48%",
    flexGrow: 1,
    minWidth: 148,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    gap: Spacing.one + 2,
  },
});
