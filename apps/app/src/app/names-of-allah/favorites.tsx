import { NAMES_OF_ALLAH } from "@munib-tracker/shared/content";
import { goBackOrReplace } from "@/lib/navigation";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  useEnsureNameFavoritesLoaded,
  useFavoriteNameIds,
  useNameFavoritesActions,
} from "@/stores/name-favorites-store";

const BY_ID = new Map(NAMES_OF_ALLAH.map((name) => [name.id, name]));
const NUMBER_BY_ID = new Map(NAMES_OF_ALLAH.map((name, index) => [name.id, index + 1]));

export default function NameFavoritesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureNameFavoritesLoaded();
  const favoriteIds = useFavoriteNameIds();
  const { toggle } = useNameFavoritesActions();

  const items = favoriteIds.map((id) => BY_ID.get(id)).filter((item) => item != null);

  return (
    <ScreenLayout
      eyebrow={t("names.eyebrow")}
      title={t("names.favorites")}
      subtitle={t("names.favSubtitle")}
      onBack={() => (goBackOrReplace(router, "/names-of-allah"))}
    >
      <Seo path="/names-of-allah/favorites" />
      {items.length === 0 ? (
        <EmptyState
          icon={{ ios: "star", android: "star_border", web: "star_border" }}
          title={t("names.favEmptyTitle")}
          description={t("names.favEmptyDesc")}
          actionLabel={t("names.title")}
          onAction={() => router.replace("/names-of-allah")}
        />
      ) : (
        <Card padding="three">
          <View style={styles.list}>
            {items.map((name) => (
              <View key={name.id} style={[styles.row, { backgroundColor: colors.muted }]}>
                <View style={[styles.number, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="caption" style={{ color: colors.accentText }}>
                    {NUMBER_BY_ID.get(name.id)}
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
                  onPress={() => toggle(name.id)}
                />
              </View>
            ))}
          </View>
        </Card>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  row: {
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
