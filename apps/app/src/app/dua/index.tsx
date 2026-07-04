import { duasByCategory } from "@munib-tracker/shared/content";
import type { DuaCategoryId, DuaItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ListIndexBadge } from "@/components/ui/list-index-badge";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { searchDuaList } from "@/lib/search";
import { useEnsureDuaFavoritesLoaded, useFavoriteDuaIds } from "@/stores/dua-favorites-store";

const CATEGORY_ICONS: Record<DuaCategoryId, SymbolViewProps["name"]> = {
  sunnah: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
  quranic: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  daily: { ios: "sun.max.fill", android: "light_mode", web: "light_mode" },
};

const CATEGORIES: DuaCategoryId[] = ["sunnah", "quranic", "daily"];

export default function DuaHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  useEnsureDuaFavoritesLoaded();
  const favoriteCount = useFavoriteDuaIds().length;
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const results = useMemo(() => (searching ? searchDuaList(query) : []), [query, searching]);

  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    for (const categoryId of CATEGORIES) {
      duasByCategory(categoryId).forEach((item, position) => {
        map.set(item.id, position + 1);
      });
    }
    return map;
  }, []);

  return (
    <ScreenLayout
      eyebrow={t("dua.eyebrow")}
      title={t("dua.title")}
      subtitle={
        searching ? t("dua.searchResultCount", { count: results.length }) : t("dua.subtitle")
      }
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Stagger>
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
                  count={duasByCategory(categoryId).length}
                  onPress={() =>
                    router.push({ pathname: "/dua/[category]", params: { category: categoryId } })
                  }
                />
              ))}
            </View>
          </Card>
        ) : null}

        {!searching ? (
          <Card padding="three">
            <View style={styles.list}>
              <NavRow
                icon={{ ios: "star.fill", android: "star", web: "star" }}
                label={t("dua.favorites")}
                count={favoriteCount > 0 ? favoriteCount : undefined}
                onPress={() => router.push("/dua/favorites")}
              />
              <NavRow
                icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
                label={t("dua.duroodsLink")}
                onPress={() => router.push("/duroods")}
              />
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
        <ThemedText type="small" numberOfLines={1}>
          {item.title}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
          {item.transliteration}
        </ThemedText>
      </View>
      <Pill label={categoryLabel} color={colors.mutedForeground} background={colors.card} />
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
