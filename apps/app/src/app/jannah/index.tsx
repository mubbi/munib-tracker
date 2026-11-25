import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahDuaBlock, JannahNavRow } from "@/components/jannah/primitives";
import {
  type LearnHubItem,
  LearnHubScreen,
  type LearnHubSection,
} from "@/components/learn-guide/learn-hub-screen";
import { ThemedText } from "@/components/themed-text";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { BorderWidth, Spacing, withAlpha } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import {
  ensureJannahContent,
  getJannahFirdawsDua,
  getJannahHubTopics,
  getJannahPathTopics,
  getJannahPromised,
  isJannahContentReady,
} from "@/lib/jannah";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";

const HUB_ICONS: Record<string, AppIcon> = {
  about: { ios: "leaf.fill", android: "park", web: "park" },
  ranks: { ios: "stairs", android: "stairs", web: "stairs" },
  "al-firdaws": { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  warnings: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  promised: { ios: "person.3.fill", android: "groups", web: "groups" },
};
const TOPIC_ICON: AppIcon = { ios: "text.book.closed", android: "article", web: "article" };
const PATH_ICON: AppIcon = {
  ios: "point.topleft.down.curvedto.point.bottomright.up",
  android: "route",
  web: "route",
};

const topicHref = (id: string) => ({ pathname: "/jannah/[topic]", params: { topic: id } }) as Href;

export default function JannahScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useThemeTokens();
  const wide = useLearnHubLayout();
  const navCols = learnColumnsFor(wide.mainWidth - Spacing.three * 2, { minCell: 280, max: 2 });
  const content = useEnsureContent(ensureJannahContent, isJannahContentReady);
  const contentVersion = content.version;
  // Recompute per locale / once the corpus lands so translated titles render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize / content ready
  const hubTopics = useMemo(() => getJannahHubTopics(), [i18n.language, contentVersion]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize / content ready
  const pathTopics = useMemo(() => getJannahPathTopics(), [i18n.language, contentVersion]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize / content ready
  const promised = useMemo(() => getJannahPromised(), [i18n.language, contentVersion]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize / content ready
  const firdawsDua = useMemo(() => getJannahFirdawsDua(), [i18n.language, contentVersion]);

  const sections = useMemo<LearnHubSection[]>(
    () => [
      {
        id: "learn",
        title: t("jannah.learnTitle"),
        items: hubTopics.map((topic) => ({
          id: topic.id,
          icon: HUB_ICONS[topic.id] ?? TOPIC_ICON,
          title: topic.title,
          subtitle: topic.summary,
          href: topicHref(topic.id),
        })),
      },
      {
        id: "paths",
        title: t("jannah.pathsTitle"),
        hint: tTv(t, "jannah.pathsHint", "jannah.pathsHintTv"),
        icon: PATH_ICON,
        items: pathTopics.map((topic) => ({
          id: topic.id,
          icon: PATH_ICON,
          title: topic.title,
          subtitle: topic.summary,
          badge: topic.importance ? t(`jannah.importance.${topic.importance}`) : undefined,
          href: topicHref(topic.id),
        })),
      },
      {
        id: "promised-list",
        title: t("jannah.promisedTitle"),
        icon: { ios: "person.3.fill", android: "groups", web: "groups" },
        children: (
          <LearnColumnsGrid columns={navCols} gap={Spacing.three}>
            {promised.map((entry) => (
              <TvReadableBlock key={entry.id}>
                <View
                  style={[
                    styles.promisedItem,
                    { borderStartColor: withAlpha(colors.accent, 0.55) },
                  ]}
                >
                  <ThemedText type="smallBold">{entry.name}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
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
              </TvReadableBlock>
            ))}
          </LearnColumnsGrid>
        ),
      },
    ],
    [t, hubTopics, pathTopics, promised, navCols, colors.accent],
  );

  const tools = useMemo<LearnHubItem[]>(
    () => [
      {
        id: "/jannah/gates",
        icon: { ios: "door.left.hand.open", android: "door_front", web: "door_front" },
        title: t("jannah.gatesTitle"),
        subtitle: t("jannah.gatesSummary"),
        href: "/jannah/gates" as Href,
        hue: "sky",
      },
      {
        id: "/jannah/duas",
        icon: {
          ios: "hands.and.sparkles.fill",
          android: "volunteer_activism",
          web: "volunteer_activism",
        },
        title: t("jannah.duasTitle"),
        subtitle: t("jannah.duasSummary"),
        href: "/jannah/duas" as Href,
        hue: "sage",
      },
      {
        id: "/jannah/verses",
        icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
        title: t("jannah.versesTitle"),
        subtitle: t("jannah.versesSummary"),
        href: "/jannah/verses" as Href,
        hue: "accent",
      },
      {
        id: "/jannah/journey",
        icon: { ios: "chart.line.uptrend.xyaxis", android: "trending_up", web: "trending_up" },
        title: t("jannah.journeyTitle"),
        subtitle: t("jannah.journeySummary"),
        href: "/jannah/journey" as Href,
        hue: "dawn",
      },
    ],
    [t],
  );

  const footer = (
    <View style={styles.footer}>
      {firdawsDua ? (
        <JannahDuaBlock
          title={t("jannah.firdawsCardTitle")}
          arabic={firdawsDua.arabic}
          transliteration={firdawsDua.transliteration}
          translation={firdawsDua.translation}
          reference={firdawsDua.reference}
        />
      ) : null}
      <JannahNavRow
        icon={{ ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" }}
        title={t("jannah.jahannamPointerTitle")}
        subtitle={t("jannah.jahannamPointerHint")}
        onPress={() => router.push("/jahannam" as Href)}
      />
      <JannahNavRow
        icon={{ ios: "map.fill", android: "map", web: "map" }}
        title={t("jannah.tourCta")}
        subtitle={t("jannah.tourCtaHint")}
        onPress={() => router.push({ pathname: "/tour", params: { tour: "jannah" } })}
      />
    </View>
  );

  return (
    <LearnHubScreen
      ns="jannah"
      basePath="/jannah"
      content={content}
      sections={sections}
      tools={tools}
      quiz
      footer={footer}
    />
  );
}

const styles = StyleSheet.create({
  footer: { gap: Spacing.three },
  promisedItem: {
    borderStartWidth: BorderWidth.thick,
    paddingStart: Spacing.three,
    gap: Spacing.half,
  },
  promisedNote: { fontStyle: "italic" },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/jannah");
