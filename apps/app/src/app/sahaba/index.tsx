import type { SahabaCategory, SahabaProfile } from "@munib-tracker/shared/types";
import { type Href, useLocalSearchParams } from "expo-router";
import type { TFunction } from "i18next";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  type LearnHubItem,
  LearnHubScreen,
  type LearnHubSection,
} from "@/components/learn-guide/learn-hub-screen";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import type { AppIcon } from "@/lib/names-of-allah-ui";
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
const PERSON_ICON: AppIcon = { ios: "person.fill", android: "person", web: "person" };
const FIGURE_ICON: AppIcon = {
  ios: "shield.lefthalf.filled",
  android: "security",
  web: "security",
};

function sahabaSubtitle(profile: SahabaProfile, t: TFunction): string {
  const categoryLabel = profile.categories[0]
    ? t(`sahaba.category.${profile.categories[0]}`)
    : undefined;
  return [profile.arabicName, categoryLabel, profile.epithet ?? profile.summary]
    .filter(Boolean)
    .join(" · ");
}

/**
 * Sahaba hub. Category shortcuts are filters of the directory (G-56): choosing
 * "Women" shows every woman's profile, never a single profile. `?category=`
 * pre-selects a filter for deep links. The directory count is plain text, not a
 * fake navigation row (G-57).
 */
export default function SahabaScreen() {
  const { t, i18n } = useTranslation();
  const params = useLocalSearchParams<{ category?: string }>();
  const content = useEnsureContent(ensureSahabaContent, isSahabaContentReady);
  const contentVersion = content.version;

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or content changes
  const profiles = useMemo(() => getSahabaProfiles(), [i18n.language, contentVersion]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or content changes
  const categoryOrder = useMemo(() => getSahabaCategoryOrder(), [i18n.language, contentVersion]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or content changes
  const byCategory = useMemo(() => getSahabaProfilesByCategory(), [i18n.language, contentVersion]);

  const initialCategory = categoryOrder.includes(params.category as SahabaCategory)
    ? (params.category as SahabaCategory)
    : null;
  const [category, setCategory] = useState<SahabaCategory | null>(initialCategory);
  // TV (B-40): "Jump to directory" moves D-pad focus to the first profile; bumping
  // the nonce remounts that row so `preferredFocus` applies again.
  const tv = isTV();
  const [jumpNonce, setJumpNonce] = useState(0);

  const sections = useMemo<LearnHubSection[]>(() => {
    // Ids are per-section (a companion repeats across categories) so keys stay unique.
    const shown = category ? [category] : categoryOrder;
    const firstId = byCategory[shown[0] as SahabaCategory]?.[0]?.id;
    const toItem = (profile: SahabaProfile, cat: SahabaCategory): LearnHubItem => ({
      id:
        jumpNonce > 0 && cat === shown[0] && profile.id === firstId
          ? `${cat}:${profile.id}:${jumpNonce}`
          : `${cat}:${profile.id}`,
      preferredFocus: tv && jumpNonce > 0 && cat === shown[0] && profile.id === firstId,
      icon: getBattlesFigureIdForSahaba(profile.id) ? FIGURE_ICON : PERSON_ICON,
      title: profile.name,
      subtitle: sahabaSubtitle(profile, t),
      badge: profile.lifespan,
      href: { pathname: "/sahaba/[id]", params: { id: profile.id } } as Href,
    });
    // "All" lists every category's full membership (a companion in several
    // categories appears under each), so the chip counts match the lists.
    return shown.map((cat) => {
      const items = byCategory[cat] ?? [];
      return {
        id: cat,
        title: t(`sahaba.category.${cat}`),
        hint: t(`sahaba.categoryHint.${cat}`),
        icon: CATEGORY_ICONS[cat],
        tvColumns: 2,
        items: items.map((profile) => toItem(profile, cat)),
        children: items.length ? undefined : (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("sahaba.noResults")}
          </ThemedText>
        ),
      };
    });
  }, [t, category, categoryOrder, byCategory, tv, jumpNonce]);

  const tools = useMemo<LearnHubItem[]>(
    () => [
      {
        id: "/battles/figures",
        icon: { ios: "shield.fill", android: "shield", web: "shield" },
        title: t("sahaba.exploreBattles"),
        subtitle: t("sahaba.exploreBattlesHint"),
        href: "/battles/figures" as Href,
        hue: "dawn",
      },
      {
        id: "/seerah",
        icon: { ios: "timeline.selection", android: "timeline", web: "timeline" },
        title: t("sahaba.exploreSeerah"),
        subtitle: t("sahaba.exploreSeerahHint"),
        href: "/seerah" as Href,
        hue: "sage",
      },
      {
        id: "/history",
        icon: { ios: "calendar", android: "history_edu", web: "history_edu" },
        title: t("sahaba.exploreHistory"),
        subtitle: t("sahaba.exploreHistoryHint"),
        href: "/history" as Href,
        hue: "sky",
      },
    ],
    [t],
  );

  const filter = (
    <View style={styles.filter}>
      <ThemedText type="smallBold">{t("sahaba.countCardTitle")}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("sahaba.countCardHint", { count: profiles.length })}
      </ThemedText>
      {tv ? (
        <Button
          variant="secondary"
          label={t("sahaba.jumpToDirectory")}
          onPress={() => setJumpNonce((n) => n + 1)}
        />
      ) : null}
      <View accessibilityRole="radiogroup" style={styles.chips}>
        <Chip
          label={t("sahaba.categoryAll")}
          role="radio"
          selected={category === null}
          onPress={() => setCategory(null)}
        />
        {categoryOrder.map((cat) => (
          <Chip
            key={cat}
            label={t(`sahaba.category.${cat}`)}
            role="radio"
            count={byCategory[cat]?.length}
            selected={category === cat}
            onPress={() => setCategory(cat)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <LearnHubScreen
      ns="sahaba"
      basePath="/sahaba"
      content={content}
      continueSlot={filter}
      sections={sections}
      tools={tools}
      quiz
    />
  );
}

const styles = StyleSheet.create({
  filter: { gap: Spacing.one },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/sahaba");
