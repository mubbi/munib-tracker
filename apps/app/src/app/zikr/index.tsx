import { getZikrById } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Spacing } from "@/constants/theme";
import { zikrCategories } from "@/lib/zikr";
import { useFavoriteZikrIds } from "@/stores/preferences-store";

export default function ZikrHomeScreen() {
  const router = useRouter();
  const favoriteIds = useFavoriteZikrIds();
  const categories = zikrCategories();

  const favorites = favoriteIds
    .map(getZikrById)
    .filter((item) => item != null)
    .slice(0, 3);

  return (
    <ScreenLayout
      eyebrow="Remembrance"
      title="Zikr"
      subtitle="Adhkar for every part of your day"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        {favorites.length > 0 ? (
          <Card padding="three">
            <SectionHeader
              title="Favorites"
              icon={{ ios: "star.fill", android: "star", web: "star" }}
              actionLabel="See all"
              onActionPress={() => router.push("/zikr/favorites")}
            />
            <View style={styles.list}>
              {favorites.map((item) => (
                <ZikrRow
                  key={item.id}
                  item={item}
                  onPress={() => router.push({ pathname: "/zikr/[id]", params: { id: item.id } })}
                />
              ))}
            </View>
          </Card>
        ) : null}

        <Card padding="three">
          <SectionHeader
            title="Categories"
            icon={{ ios: "square.grid.2x2.fill", android: "grid_view", web: "grid_view" }}
          />
          <View style={styles.list}>
            {categories.map((category) => (
              <NavRow
                key={category.id}
                icon={category.icon}
                label={category.label}
                count={category.count}
                onPress={() =>
                  router.push({ pathname: "/zikr/[category]", params: { category: category.id } })
                }
              />
            ))}
          </View>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
