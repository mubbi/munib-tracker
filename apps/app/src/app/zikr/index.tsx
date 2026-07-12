import { ZIKR_CATEGORY_IDS } from "@munib-tracker/shared/constants";
import type { ZikrItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { searchZikrList } from "@/lib/search";
import { collectionPageSchema } from "@/lib/seo/structured-data";
import { ensureZikrCorpus, zikrByCategory, zikrCategories } from "@/lib/zikr";
import { useFavoriteZikrIds } from "@/stores/preferences-store";

export default function ZikrHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const favoriteIds = useFavoriteZikrIds();
  const [zikrReady, setZikrReady] = useState(false);
  const categories = zikrReady ? zikrCategories() : [];
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  useEffect(() => {
    let active = true;
    void ensureZikrCorpus().then(() => {
      if (active) setZikrReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

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

  const onOpenDetail = useCallback(
    (id: string) => router.push({ pathname: "/zikr/detail/[id]", params: { id } }),
    [router],
  );

  return (
    <ScreenLayout
      eyebrow={t("zikr.eyebrow")}
      title={t("zikr.title")}
      subtitle={
        searching ? t("zikr.searchResultCount", { count: results.length }) : t("zikr.subtitle")
      }
      onBack={() => goBackOrReplace(router, "/")}
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
        <SavedNavCard
          title={t("zikr.favorites")}
          viewLabel={t("zikr.seeAll")}
          count={favoriteIds.length > 0 ? favoriteIds.length : undefined}
          headerIcon={{ ios: "star.fill", android: "star", web: "star" }}
          rowIcon={{ ios: "star.fill", android: "star", web: "star" }}
          onPress={() => router.push("/zikr/favorites")}
        />

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
                    onPress={onOpenDetail}
                  />
                ))}
              </View>
            </Card>
          )
        ) : (
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
  onPress: (id: string) => void;
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
