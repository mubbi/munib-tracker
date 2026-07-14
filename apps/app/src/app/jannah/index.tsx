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
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ensureJannahContent,
  getJannahFirdawsDua,
  getJannahHubTopics,
  getJannahPathTopics,
  getJannahPromised,
  isJannahContentReady,
} from "@/lib/jannah";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";

const HUB_ICONS: Record<string, AppIcon> = {
  about: { ios: "leaf.fill", android: "park", web: "park" },
  ranks: { ios: "stairs", android: "stairs", web: "stairs" },
  "al-firdaws": { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  warnings: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  promised: { ios: "person.3.fill", android: "groups", web: "groups" },
};

export default function JannahScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureJannahContent,
    isJannahContentReady,
  );
  const hubTopics = getJannahHubTopics();
  const pathTopics = getJannahPathTopics();
  const promised = getJannahPromised();
  // Recompute per locale so the localized du'a text renders on language switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize / content ready
  const firdawsDua = useMemo(() => getJannahFirdawsDua(), [i18n.language, contentVersion]);

  const quickLinks = useMemo(
    () => [
      {
        id: "gates",
        icon: { ios: "door.left.hand.open", android: "door_front", web: "door_front" } as AppIcon,
        title: t("jannah.gatesTitle"),
        subtitle: t("jannah.gatesSummary"),
        tint: tokens.status.info.color,
        onPress: () => router.push("/jannah/gates"),
      },
      {
        id: "duas",
        icon: {
          ios: "hands.and.sparkles.fill",
          android: "volunteer_activism",
          web: "volunteer_activism",
        } as AppIcon,
        title: t("jannah.duasTitle"),
        subtitle: t("jannah.duasSummary"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/jannah/duas"),
      },
      {
        id: "verses",
        icon: { ios: "book.fill", android: "menu_book", web: "menu_book" } as AppIcon,
        title: t("jannah.versesTitle"),
        subtitle: t("jannah.versesSummary"),
        tint: colors.accent,
        onPress: () => router.push("/jannah/verses"),
      },
      {
        id: "journey",
        icon: {
          ios: "chart.line.uptrend.xyaxis",
          android: "trending_up",
          web: "trending_up",
        } as AppIcon,
        title: t("jannah.journeyTitle"),
        subtitle: t("jannah.journeySummary"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/jannah/journey"),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  return (
    <ScreenLayout
      eyebrow={t("jannah.eyebrow")}
      title={t("jannah.title")}
      subtitle={t("jannah.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/jannah" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("jannah.intro")}</JannahCallout>

          <LearnQuizNavRow
            quizPath={"/jannah/quiz" as Href}
            titleKey="common.learnQuiz.title"
            subtitleKey="common.learnQuiz.hint"
          />

          <Card padding="three">
            <SectionHeader
              title={t("jannah.quickLinksTitle")}
              icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
            />
            <JannahQuickLinkGrid items={quickLinks} />
          </Card>

          <Card padding="three">
            <SectionHeader
              title={t("jannah.learnTitle")}
              icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
            />
            <View style={styles.rows}>
              {hubTopics.map((topic) => (
                <JannahNavRow
                  key={topic.id}
                  icon={
                    HUB_ICONS[topic.id] ?? {
                      ios: "text.book.closed",
                      android: "article",
                      web: "article",
                    }
                  }
                  title={topic.title}
                  subtitle={topic.summary}
                  onPress={() =>
                    router.push({ pathname: "/jannah/[topic]", params: { topic: topic.id } })
                  }
                />
              ))}
            </View>
          </Card>

          {firdawsDua ? (
            <JannahDuaBlock
              title={t("jannah.firdawsCardTitle")}
              arabic={firdawsDua.arabic}
              transliteration={firdawsDua.transliteration}
              translation={firdawsDua.translation}
              reference={firdawsDua.reference}
            />
          ) : null}

          <Card padding="three">
            <SectionHeader
              title={t("jannah.pathsTitle")}
              icon={{
                ios: "point.topleft.down.curvedto.point.bottomright.up",
                android: "route",
                web: "route",
              }}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.pathsHint}>
              {t("jannah.pathsHint")}
            </ThemedText>
            <View style={styles.pathGrid}>
              {pathTopics.map((topic) => (
                <PressableScale
                  key={topic.id}
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={`${topic.title}. ${topic.summary}`}
                  onPress={() =>
                    router.push({ pathname: "/jannah/[topic]", params: { topic: topic.id } })
                  }
                  style={[styles.pathTile, { backgroundColor: colors.muted }]}
                >
                  <ThemedText type="smallBold" numberOfLines={2}>
                    {topic.title}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={3}>
                    {topic.summary}
                  </ThemedText>
                  {topic.importance ? (
                    <Pill
                      label={t(`jannah.importance.${topic.importance}`)}
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
              title={t("jannah.promisedTitle")}
              icon={{ ios: "person.3.fill", android: "groups", web: "groups" }}
            />
            <View style={styles.promised}>
              {promised.map((entry) => (
                <View
                  key={entry.id}
                  style={[styles.promisedItem, { borderLeftColor: withAlpha(colors.accent, 0.55) }]}
                >
                  <ThemedText type="smallBold">{entry.name}</ThemedText>
                  <ThemedText
                    type="caption"
                    themeColor="mutedForeground"
                    style={styles.promisedSummary}
                  >
                    {entry.summary}
                  </ThemedText>
                  {entry.note ? (
                    <ThemedText
                      type="caption"
                      themeColor="mutedForeground"
                      style={styles.promisedNote}
                    >
                      {entry.note}
                    </ThemedText>
                  ) : null}
                </View>
              ))}
            </View>
          </Card>

          <JannahNavRow
            icon={{
              ios: "flame.fill",
              android: "local_fire_department",
              web: "local_fire_department",
            }}
            title={t("jannah.jahannamPointerTitle")}
            subtitle={t("jannah.jahannamPointerHint")}
            tint={tokens.status.warning.color}
            onPress={() => router.push("/jahannam" as Href)}
          />

          <JannahNavRow
            icon={{ ios: "map.fill", android: "map", web: "map" }}
            title={t("jannah.tourCta")}
            subtitle={t("jannah.tourCtaHint")}
            tint={colors.accent}
            onPress={() => router.push({ pathname: "/tour", params: { tour: "jannah" } })}
          />

          <JannahDisclaimer />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  pathsHint: { marginTop: Spacing.one, lineHeight: 20 },
  pathGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  pathTile: {
    width: "48%",
    flexGrow: 1,
    minWidth: 148,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    gap: Spacing.one + 2,
  },
  promised: { gap: Spacing.three, marginTop: Spacing.three },
  promisedItem: {
    borderLeftWidth: 3,
    paddingStart: Spacing.three,
    gap: Spacing.half,
  },
  promisedSummary: { lineHeight: 18 },
  promisedNote: { lineHeight: 16, fontStyle: "italic" },
});
