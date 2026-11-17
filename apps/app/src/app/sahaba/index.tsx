import type { SahabaCategory, SahabaProfile } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import type { TFunction } from "i18next";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  StyleSheet,
  View,
  type ViewInstance,
} from "react-native";
import {
  JannahCallout,
  JannahDisclaimer,
  JannahNavRow,
  JannahQuickLinkGrid,
} from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  LearnSplitLayout,
  LearnTopicGrid,
  type LearnTopicGridItem,
  useLearnWideLayout,
} from "@/components/learn-guide/learn-wide-layout";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { scrollChildIntoView } from "@/hooks/use-scroll-to-active";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  ensureSahabaContent,
  getBattlesFigureIdForSahaba,
  getSahabaCategoryOrder,
  getSahabaProfiles,
  getSahabaProfilesByCategory,
  isSahabaContentReady,
} from "@/lib/sahaba";
import { routeMetadata } from "@/lib/seo/route-metadata";

const CATEGORY_ICONS: Record<SahabaCategory, AppIcon> = {
  caliphs: { ios: "crown.fill", android: "workspace_premium", web: "workspace_premium" },
  ashara: { ios: "star.circle.fill", android: "stars", web: "stars" },
  family: { ios: "house.fill", android: "home", web: "home" },
  women: { ios: "person.2.fill", android: "groups", web: "groups" },
  notable: { ios: "person.fill", android: "person", web: "person" },
};

export default function SahabaScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureSahabaContent,
    isSahabaContentReady,
  );
  const scrollRef = useRef<ScrollViewInstance>(null);
  const directoryRef = useRef<ViewInstance>(null);
  const scrollYRef = useRef(0);
  const tv = isTV();
  // TV: "jump to directory" moves D-pad focus (bumping this remounts the first
  // directory row with preferred focus) — a programmatic scroll alone would be
  // undone by the focus engine keeping the focused row in view.
  const [directoryFocusNonce, setDirectoryFocusNonce] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or content changes
  const profiles = useMemo(() => getSahabaProfiles(), [i18n.language, contentVersion]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or content changes
  const categoryOrder = useMemo(() => getSahabaCategoryOrder(), [i18n.language, contentVersion]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or content changes
  const byCategory = useMemo(() => getSahabaProfilesByCategory(), [i18n.language, contentVersion]);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = event.nativeEvent.contentOffset?.y ?? 0;
  }, []);

  const jumpToDirectory = useCallback(() => {
    if (tv) {
      setDirectoryFocusNonce((n) => n + 1);
      return;
    }
    scrollChildIntoView(scrollRef, directoryRef, scrollYRef.current, 88);
  }, [tv]);
  const firstDirectoryId = categoryOrder
    .map((category) => byCategory[category]?.[0]?.id)
    .find(Boolean);

  const { split, maxContentWidth } = useLearnWideLayout();

  const quickLinks = useMemo(
    () => [
      {
        id: "caliphs",
        icon: CATEGORY_ICONS.caliphs,
        title: t("sahaba.category.caliphs"),
        subtitle: t("sahaba.quickCaliphsHint"),
        tint: colors.accent,
        onPress: () =>
          router.push({
            pathname: "/sahaba/[id]",
            params: { id: "abu-bakr" },
          }),
      },
      {
        id: "ashara",
        icon: CATEGORY_ICONS.ashara,
        title: t("sahaba.category.ashara"),
        subtitle: t("sahaba.quickAsharaHint"),
        tint: tokens.status.warning.color,
        onPress: () =>
          router.push({
            pathname: "/sahaba/[id]",
            params: { id: "talha" },
          }),
      },
      {
        id: "women",
        icon: CATEGORY_ICONS.women,
        title: t("sahaba.category.women"),
        subtitle: t("sahaba.quickWomenHint"),
        tint: tokens.status.info.color,
        onPress: () =>
          router.push({
            pathname: "/sahaba/[id]",
            params: { id: "khadijah" },
          }),
      },
      {
        id: "battles",
        icon: { ios: "shield.fill", android: "shield", web: "shield" } as AppIcon,
        title: t("sahaba.quickBattles"),
        subtitle: t("sahaba.quickBattlesHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/battles/figures" as Href),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  const sahabaGridItem = (profile: SahabaProfile): LearnTopicGridItem => ({
    id: profile.id,
    icon: getBattlesFigureIdForSahaba(profile.id)
      ? { ios: "shield.lefthalf.filled", android: "security", web: "security" }
      : { ios: "person.fill", android: "person", web: "person" },
    title: profile.name,
    subtitle: sahabaSubtitle(profile, t),
    badge: profile.lifespan,
    onPress: () => router.push({ pathname: "/sahaba/[id]", params: { id: profile.id } }),
  });

  const quizRow = (
    <LearnQuizNavRow
      quizPath={"/sahaba/quiz" as Href}
      titleKey="common.learnQuiz.title"
      subtitleKey="common.learnQuiz.hint"
    />
  );
  const quickLinksCard = (
    <Card padding="three">
      <SectionHeader
        title={t("sahaba.quickLinksTitle")}
        icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
      />
      <JannahQuickLinkGrid items={quickLinks} />
    </Card>
  );
  const countRow = (
    <JannahNavRow
      icon={{ ios: "person.3.fill", android: "groups", web: "groups" }}
      title={t("sahaba.countCardTitle")}
      subtitle={t("sahaba.countCardHint", { count: profiles.length })}
      badge={String(profiles.length)}
      tint={colors.accent}
      onPress={jumpToDirectory}
    />
  );
  const exploreCard = (
    <Card padding="three">
      <SectionHeader
        title={t("sahaba.exploreTitle")}
        icon={{ ios: "compass.drawing", android: "explore", web: "explore" }}
      />
      <View style={styles.rows}>
        <JannahNavRow
          icon={{ ios: "shield.fill", android: "shield", web: "shield" }}
          title={t("sahaba.exploreBattles")}
          subtitle={t("sahaba.exploreBattlesHint")}
          onPress={() => router.push("/battles/figures" as Href)}
        />
        <JannahNavRow
          icon={{ ios: "timeline.selection", android: "timeline", web: "timeline" }}
          title={t("sahaba.exploreSeerah")}
          subtitle={t("sahaba.exploreSeerahHint")}
          onPress={() => router.push("/seerah" as Href)}
        />
        <JannahNavRow
          icon={{ ios: "calendar", android: "history_edu", web: "history_edu" }}
          title={t("sahaba.exploreHistory")}
          subtitle={t("sahaba.exploreHistoryHint")}
          onPress={() => router.push("/history" as Href)}
        />
      </View>
    </Card>
  );

  return (
    <ScreenLayout
      eyebrow={t("sahaba.eyebrow")}
      title={t("sahaba.title")}
      subtitle={t("sahaba.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
      maxContentWidth={maxContentWidth}
      scrollRef={scrollRef}
      onScroll={onScroll}
    >
      <Seo path="/sahaba" />
      <LearnContentGate ready={contentReady}>
        <LearnSplitLayout
          aside={
            <>
              {quizRow}
              {countRow}
              {quickLinksCard}
              {exploreCard}
            </>
          }
        >
          <Stagger>
            <JannahCallout tone="info">{t("sahaba.intro")}</JannahCallout>

            {split ? null : quizRow}

            {split ? null : quickLinksCard}

            {split ? null : countRow}

            <View ref={directoryRef} collapsable={false} style={styles.directory}>
              {categoryOrder.map((category) => {
                const items = byCategory[category] ?? [];
                if (!items.length) return null;
                return (
                  <Card key={category} padding="three">
                    <SectionHeader
                      title={t(`sahaba.category.${category}`)}
                      icon={CATEGORY_ICONS[category]}
                    />
                    <ThemedText
                      type="caption"
                      themeColor="mutedForeground"
                      style={styles.sectionHint}
                    >
                      {t(`sahaba.categoryHint.${category}`)}
                    </ThemedText>
                    {/* TV: 2-column grid uses the landscape width; D-pad moves row by row. */}
                    {tv ? (
                      <View style={[styles.rows, styles.rowsTv]}>
                        {items.map((profile) => {
                          const jumpTarget = profile.id === firstDirectoryId;
                          return (
                            <View key={profile.id} style={styles.cellTv}>
                              <SahabaNavRow
                                key={
                                  jumpTarget ? `${profile.id}-${directoryFocusNonce}` : profile.id
                                }
                                profile={profile}
                                preferredFocus={jumpTarget && directoryFocusNonce > 0}
                              />
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      // Phones: stacked rows (unchanged). Tablet / desktop: 2-column grid.
                      <LearnTopicGrid
                        style={styles.rows}
                        items={items.map((profile) => sahabaGridItem(profile))}
                      />
                    )}
                  </Card>
                );
              })}
            </View>

            {split ? null : exploreCard}

            <JannahDisclaimer textKey="sahaba.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      </LearnContentGate>
    </ScreenLayout>
  );
}

function sahabaSubtitle(profile: SahabaProfile, t: TFunction): string {
  const categoryLabel = profile.categories[0]
    ? t(`sahaba.category.${profile.categories[0]}`)
    : undefined;
  return [profile.arabicName, categoryLabel, profile.epithet ?? profile.summary]
    .filter(Boolean)
    .join(" · ");
}

function SahabaNavRow({
  profile,
  preferredFocus,
}: {
  profile: SahabaProfile;
  preferredFocus?: boolean;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const battlesFigureId = getBattlesFigureIdForSahaba(profile.id);

  return (
    <JannahNavRow
      icon={
        battlesFigureId
          ? { ios: "shield.lefthalf.filled", android: "security", web: "security" }
          : { ios: "person.fill", android: "person", web: "person" }
      }
      title={profile.name}
      subtitle={sahabaSubtitle(profile, t)}
      badge={profile.lifespan}
      preferredFocus={preferredFocus}
      onPress={() =>
        router.push({
          pathname: "/sahaba/[id]",
          params: { id: profile.id },
        })
      }
    />
  );
}

const styles = StyleSheet.create({
  directory: { gap: Spacing.four },
  sectionHint: { marginBottom: Spacing.two },
  rows: { gap: Spacing.two, marginTop: Spacing.two },
  rowsTv: { flexDirection: "row", flexWrap: "wrap" },
  cellTv: { flexBasis: "48%", flexGrow: 1 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/sahaba");
