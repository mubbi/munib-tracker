import type { DuaCategoryId, DuaItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { loadDuaItems } from "@/lib/content-loaders";
import { goBackOrReplace } from "@/lib/navigation";
import { createDuaSearch } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { useEnsureDuaFavoritesLoaded, useFavoriteDuaIds } from "@/stores/dua-favorites-store";

const CATEGORY_ICONS: Record<DuaCategoryId, SymbolViewProps["name"]> = {
  morning_evening: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" },
  sleep: { ios: "moon.zzz.fill", android: "bedtime", web: "bedtime" },
  prayer: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
  forgiveness: {
    ios: "hands.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  distress: { ios: "exclamationmark.bubble.fill", android: "mood_bad", web: "mood_bad" },
  protection: { ios: "shield.fill", android: "shield", web: "shield" },
  quranic: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  food: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
  home: { ios: "house.fill", android: "home", web: "home" },
  travel: { ios: "airplane", android: "flight", web: "flight" },
  family: {
    ios: "figure.2.and.child.holdinghands",
    android: "family_restroom",
    web: "family_restroom",
  },
  illness: { ios: "cross.case.fill", android: "medical_services", web: "medical_services" },
  weather: { ios: "cloud.sun.fill", android: "cloud", web: "cloud" },
  hajj: { ios: "building.columns.fill", android: "account_balance", web: "account_balance" },
  purification: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  social: { ios: "person.2.fill", android: "groups", web: "groups" },
};

const CATEGORIES: DuaCategoryId[] = [
  "morning_evening",
  "sleep",
  "prayer",
  "forgiveness",
  "distress",
  "protection",
  "quranic",
  "food",
  "home",
  "travel",
  "family",
  "illness",
  "weather",
  "hajj",
  "purification",
  "social",
];

export default function DuaHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  useEnsureDuaFavoritesLoaded();
  const favoriteCount = useFavoriteDuaIds().length;
  const [query, setQuery] = useState("");
  const [duaItems, setDuaItems] = useState<DuaItem[]>([]);
  useEffect(() => {
    void loadDuaItems().then(setDuaItems);
  }, []);
  const searching = query.trim().length > 0;

  const searchIndex = useMemo(() => createDuaSearch(duaItems), [duaItems]);
  const results = useMemo(
    () => (searching ? searchIndex.search(query) : []),
    [query, searchIndex, searching],
  );

  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    for (const categoryId of CATEGORIES) {
      duaItems
        .filter((item) => item.categoryId === categoryId)
        .forEach((item, position) => {
          map.set(item.id, position + 1);
        });
    }
    return map;
  }, [duaItems]);

  return (
    <ScreenLayout
      eyebrow={t("dua.eyebrow")}
      title={t("dua.title")}
      subtitle={
        searching ? t("dua.searchResultCount", { count: results.length }) : t("dua.subtitle")
      }
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo
        path="/dua"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("dua.title"), path: "/dua" },
        ]}
        jsonLd={[
          collectionPageSchema({
            path: "/dua",
            name: "Duas & Supplications",
            description:
              "Authentic duas and supplications from the Qur'an and Sunnah — morning & evening, prayer, protection, travel, forgiveness, and more.",
            items: CATEGORIES.map((category) => ({
              name: t(`duaCat.${category}`),
              path: `/dua/${category}`,
            })),
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("dua.title"), path: "/dua" },
            ],
          }),
        ]}
      />
      <Stagger>
        <SavedNavCard
          title={t("dua.favorites")}
          viewLabel={t("dua.viewFavorites")}
          count={favoriteCount > 0 ? favoriteCount : undefined}
          headerIcon={{ ios: "star.fill", android: "star", web: "star" }}
          rowIcon={{ ios: "star.fill", android: "star", web: "star" }}
          onPress={() => router.push("/dua/favorites")}
        />

        <Card padding="three">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("dua.searchPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("dua.searchPlaceholder")}
            style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
          />
        </Card>

        {searching ? (
          results.length === 0 ? (
            <EmptyState
              icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
              title={t("dua.noResults")}
              description={t("search.noResultsDesc")}
            />
          ) : (
            <Card padding="three">
              <View style={styles.list}>
                {results.map((item) => (
                  <DuaSearchRow
                    key={item.id}
                    item={item}
                    index={indexById.get(item.id)}
                    categoryLabel={t(`duaCat.${item.categoryId}`)}
                    onPress={() =>
                      router.push({ pathname: "/dua/detail/[id]", params: { id: item.id } })
                    }
                  />
                ))}
              </View>
            </Card>
          )
        ) : null}

        {!searching ? (
          <Card padding="three">
            <View style={styles.list}>
              {CATEGORIES.map((categoryId) => (
                <NavRow
                  key={categoryId}
                  icon={CATEGORY_ICONS[categoryId]}
                  label={t(`duaCat.${categoryId}`)}
                  count={duaItems.filter((item) => item.categoryId === categoryId).length}
                  onPress={() =>
                    router.push({ pathname: "/dua/[category]", params: { category: categoryId } })
                  }
                />
              ))}
            </View>
          </Card>
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}

function DuaSearchRow({
  item,
  index,
  categoryLabel,
  onPress,
}: {
  item: DuaItem;
  index?: number;
  categoryLabel: string;
  onPress: () => void;
}) {
  const { colors } = useThemeTokens();

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={index != null ? `${index}. ${item.title}` : item.title}
      onPress={onPress}
      style={[styles.resultRow, { backgroundColor: colors.muted }]}
    >
      {index != null ? <ListIndexBadge index={index} /> : null}
      <View style={styles.resultBody}>
        <ThemedText type="small" numberOfLines={2}>
          {item.title}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
          {item.transliteration ?? item.translation}
        </ThemedText>
      </View>
      <Pill compact label={categoryLabel} color={colors.mutedForeground} background={colors.card} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  list: { gap: Spacing.two },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  resultBody: { flex: 1, gap: 2 },
});
