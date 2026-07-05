import { ZIKR_CATEGORY_IDS } from "@munib-tracker/shared/constants";
import { getZikrById } from "@munib-tracker/shared/content";
import type { ZikrItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { searchZikrList } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { zikrByCategory, zikrCategories } from "@/lib/zikr";
import { useFavoriteZikrIds } from "@/stores/preferences-store";

export default function ZikrHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const favoriteIds = useFavoriteZikrIds();
  const categories = zikrCategories();
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const favorites = favoriteIds
    .map(getZikrById)
    .filter((item) => item != null)
    .slice(0, 3);

  const results = useMemo(() => (searching ? searchZikrList(query) : []), [query, searching]);

  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    for (const category of categories) {
      zikrByCategory(category.id).forEach((item, position) => {
        map.set(item.id, position + 1);
      });
    }
    return map;
  }, [categories]);

  return (
    <ScreenLayout
      eyebrow={t("zikr.eyebrow")}
      title={t("zikr.title")}
      subtitle={
        searching ? t("zikr.searchResultCount", { count: results.length }) : t("zikr.subtitle")
      }
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo
        path="/zikr"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("zikr.title"), path: "/zikr" },
        ]}
        jsonLd={[
          collectionPageSchema({
            path: "/zikr",
            name: "Daily Adhkar & Dhikr",
            description: "Morning, evening, and situational adhkar for every part of your day.",
            items: ZIKR_CATEGORY_IDS.map((id) => ({
              name: t(`zikrCat.${id}`),
              path: `/zikr/${id}`,
            })),
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("zikr.title"), path: "/zikr" },
            ],
          }),
        ]}
      />
      <Stagger>
        <Card padding="three">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("zikr.searchPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("zikr.searchPlaceholder")}
            style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
          />
        </Card>

        {searching ? (
          results.length === 0 ? (
            <EmptyState
              icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
              title={t("zikr.noResults")}
              description={t("search.noResultsDesc")}
            />
          ) : (
            <Card padding="three">
              <View style={styles.list}>
                {results.map((item) => (
                  <ZikrSearchRow
                    key={item.id}
                    item={item}
                    index={indexById.get(item.id)}
                    categoryLabel={t(`zikrCat.${item.categoryId}`)}
                    onPress={() =>
                      router.push({ pathname: "/zikr/detail/[id]", params: { id: item.id } })
                    }
                  />
                ))}
              </View>
            </Card>
          )
        ) : (
          <>
            {favorites.length > 0 ? (
              <Card padding="three">
                <SectionHeader
                  title={t("zikr.favorites")}
                  icon={{ ios: "star.fill", android: "star", web: "star" }}
                  actionLabel={t("zikr.seeAll")}
                  onActionPress={() => router.push("/zikr/favorites")}
                />
                <View style={styles.list}>
                  {favorites.map((item) => (
                    <ZikrRow
                      key={item.id}
                      item={item}
                      onPress={() =>
                        router.push({ pathname: "/zikr/detail/[id]", params: { id: item.id } })
                      }
                    />
                  ))}
                </View>
              </Card>
            ) : null}

            <Card padding="three">
              <SectionHeader
                title={t("zikr.categories")}
                icon={{ ios: "square.grid.2x2.fill", android: "grid_view", web: "grid_view" }}
              />
              <View style={styles.list}>
                {categories.map((category) => (
                  <NavRow
                    key={category.id}
                    icon={category.icon}
                    label={t(`zikrCat.${category.id}`)}
                    count={category.count}
                    onPress={() =>
                      router.push({
                        pathname: "/zikr/[category]",
                        params: { category: category.id },
                      })
                    }
                  />
                ))}
                <NavRow
                  icon={{ ios: "square.and.pencil", android: "edit_note", web: "edit_note" }}
                  label={t("customAdhkar.title")}
                  onPress={() => router.push("/adhkar-builder")}
                />
              </View>
            </Card>
          </>
        )}
      </Stagger>
    </ScreenLayout>
  );
}

function ZikrSearchRow({
  item,
  index,
  categoryLabel,
  onPress,
}: {
  item: ZikrItem;
  index?: number;
  categoryLabel: string;
  onPress: () => void;
}) {
  return <ZikrRow item={item} index={index} categoryLabel={categoryLabel} onPress={onPress} />;
}

const styles = StyleSheet.create({
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  list: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
