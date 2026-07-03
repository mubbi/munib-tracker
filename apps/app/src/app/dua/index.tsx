import { duasByCategory } from "@munib-tracker/shared/content";
import type { DuaCategoryId } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
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
  useEnsureDuaFavoritesLoaded();
  const favoriteCount = useFavoriteDuaIds().length;

  return (
    <ScreenLayout
      eyebrow={t("dua.eyebrow")}
      title={t("dua.title")}
      subtitle={t("dua.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Stagger>
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
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
});
