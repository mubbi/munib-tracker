import { DUROOD_ITEMS } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ReadingCard } from "@/components/content/reading-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { createDuroodSearch } from "@/lib/search";
import { webPageSchema } from "@/lib/seo/structured-data";
import {
  useDuroodFavoritesActions,
  useEnsureDuroodFavoritesLoaded,
  useFavoriteDuroodIds,
} from "@/stores/durood-favorites-store";

export default function DuroodsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  useEnsureDuroodFavoritesLoaded();
  const favoriteIds = useFavoriteDuroodIds();
  const { toggle } = useDuroodFavoritesActions();

  const [query, setQuery] = useState("");
  const index = useMemo(() => createDuroodSearch(DUROOD_ITEMS), []);
  const items = query.trim() ? index.search(query) : DUROOD_ITEMS;
  const favoriteSet = new Set(favoriteIds);

  return (
    <ScreenLayout
      eyebrow={t("duroods.eyebrow")}
      title={t("duroods.title")}
      subtitle={t("duroods.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo
        path="/duroods"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("duroods.title"), path: "/duroods" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/duroods",
            name: "Duroods & Salawat",
            description:
              "Recite Durood and Salawat — sending blessings upon the Prophet Muhammad ﷺ.",
            type: "CollectionPage",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("duroods.title"), path: "/duroods" },
            ],
          }),
        ]}
      />
      <Stagger>
        <Card padding="three">
          <View style={[styles.searchBox, { backgroundColor: colors.muted }]}>
            <SymbolView
              name={{ ios: "magnifyingglass", android: "search", web: "search" }}
              size={17}
              tintColor={colors.mutedForeground}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("duroods.searchPlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={t("duroods.searchPlaceholder")}
              autoCorrect={false}
              returnKeyType="search"
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>
          <View style={styles.favRow}>
            <NavRow
              icon={{ ios: "star.fill", android: "star", web: "star" }}
              label={t("duroods.favorites")}
              count={favoriteIds.length}
              onPress={() => router.push("/duroods/favorites")}
            />
          </View>
        </Card>

        {items.length === 0 ? (
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("duroods.noResults")}
          />
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.item}>
              <ThemedText type="smallBold" style={styles.title}>
                {item.title}
              </ThemedText>
              <ReadingCard
                item={item}
                sourceHref="/duroods"
                isFavorite={favoriteSet.has(item.id)}
                onToggleFavorite={() => toggle(item.id)}
              />
            </View>
          ))
        )}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: Spacing.two,
  },
  title: {
    marginLeft: Spacing.one,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  favRow: {
    marginTop: Spacing.two,
  },
});
