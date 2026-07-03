import { ZIKR_CATEGORY_LABELS } from "@munib-tracker/shared/constants";
import type { ZikrCategoryId } from "@munib-tracker/shared/types";
import { isZikrCategoryId } from "@munib-tracker/shared/validators";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { ZikrRow } from "@/components/zikr/zikr-row";
import { Spacing } from "@/constants/theme";
import { zikrByCategory } from "@/lib/zikr";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";

export default function ZikrCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category: string }>();
  const favoriteIds = useFavoriteZikrIds();
  const { toggleFavorite } = usePreferencesActions();

  const categoryId = (
    isZikrCategoryId(params.category) ? params.category : "anytime"
  ) as ZikrCategoryId;
  const items = zikrByCategory(categoryId);

  return (
    <ScreenLayout
      eyebrow="Zikr"
      title={ZIKR_CATEGORY_LABELS[categoryId]}
      subtitle={`${items.length} adhkar`}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      {items.length === 0 ? (
        <EmptyState
          icon={{ ios: "heart", android: "favorite_border", web: "favorite_border" }}
          title="No adhkar yet"
          description="More entries for this category are on the way."
        />
      ) : (
        <Card padding="three">
          <Stagger>
            <View style={styles.list}>
              {items.map((item) => (
                <ZikrRow
                  key={item.id}
                  item={item}
                  isFavorite={favoriteIds.includes(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  onPress={() => router.push({ pathname: "/zikr/[id]", params: { id: item.id } })}
                />
              ))}
            </View>
          </Stagger>
        </Card>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
});
