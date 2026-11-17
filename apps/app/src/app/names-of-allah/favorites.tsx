import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { loadNamesOfAllah } from "@/lib/content-loaders";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureNameFavoritesLoaded,
  useFavoriteNameIds,
  useNameFavoritesActions,
} from "@/stores/name-favorites-store";

export default function NameFavoritesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureNameFavoritesLoaded();
  const favoriteIds = useFavoriteNameIds();
  const { toggle } = useNameFavoritesActions();
  const [names, setNames] = useState<Awaited<ReturnType<typeof loadNamesOfAllah>>>([]);
  const [corpusReady, setCorpusReady] = useState(false);
  useEffect(() => {
    void loadNamesOfAllah().then((loaded) => {
      setNames(loaded);
      setCorpusReady(true);
    });
  }, []);
  const byId = useMemo(() => new Map(names.map((name) => [name.id, name])), [names]);
  const numberById = useMemo(
    () => new Map(names.map((name, index) => [name.id, index + 1])),
    [names],
  );

  const items = favoriteIds.map((id) => byId.get(id)).filter((item) => item != null);

  return (
    <ScreenLayout
      eyebrow={t("names.eyebrow")}
      title={t("names.favorites")}
      subtitle={t("names.favSubtitle")}
      onBack={() => goBackOrReplace(router, "/names-of-allah")}
    >
      <Seo path="/names-of-allah/favorites" />
      {favoriteIds.length === 0 ? (
        <EmptyState
          icon={{ ios: "star", android: "star_border", web: "star_border" }}
          title={t("names.favEmptyTitle")}
          description={tTv(t, "names.favEmptyDesc", "names.favEmptyDescTv")}
          actionLabel={t("names.title")}
          onAction={() => router.replace("/names-of-allah")}
        />
      ) : !corpusReady ? null : items.length === 0 ? (
        <EmptyState
          icon={{ ios: "star", android: "star_border", web: "star_border" }}
          title={t("names.favEmptyTitle")}
          description={tTv(t, "names.favEmptyDesc", "names.favEmptyDescTv")}
          actionLabel={t("names.title")}
          onAction={() => router.replace("/names-of-allah")}
        />
      ) : (
        <Card padding="three">
          {/* Wide web / tablets: saved names in 2-3 columns (TV keeps one). */}
          <ResponsiveGrid columns={isTV() ? 1 : undefined} maxColumns={3} gap={Spacing.two}>
            {items.map((name) => (
              <View key={name.id} style={[styles.row, { backgroundColor: colors.muted }]}>
                <View style={[styles.number, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="caption" style={{ color: colors.accentText }}>
                    {numberById.get(name.id)}
                  </ThemedText>
                </View>
                <View style={styles.body}>
                  <ThemedText type="smallBold" numberOfLines={1}>
                    {name.transliteration}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                    {name.meaning ?? name.translation}
                  </ThemedText>
                </View>
                <ThemedText type="arabic" style={styles.arabic} numberOfLines={1}>
                  {name.arabic}
                </ThemedText>
                <IconButton
                  name={{ ios: "star.fill", android: "star", web: "star" }}
                  size={18}
                  tintColor={tokens.status.warning.color}
                  accessibilityLabel={t("names.unfavorite")}
                  haptic="warning"
                  hitTarget={isTV() ? TvLayout.minFocusTarget : undefined}
                  onPress={() => toggle(name.id)}
                />
              </View>
            ))}
          </ResponsiveGrid>
        </Card>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  number: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 2 },
  arabic: { fontSize: 20 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/names-of-allah/favorites");
