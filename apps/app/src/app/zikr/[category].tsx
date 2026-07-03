import type { ZikrCategoryId } from "@munib-tracker/shared/types";
import { isZikrCategoryId } from "@munib-tracker/shared/validators";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ category: string }>();
  const favoriteIds = useFavoriteZikrIds();
  const { toggleFavorite } = usePreferencesActions();

  const categoryId = (
    isZikrCategoryId(params.category) ? params.category : "anytime"
  ) as ZikrCategoryId;
  const items = zikrByCategory(categoryId);

  return (
    <ScreenLayout
      eyebrow={t("zikr.categoryEyebrow")}
      title={t(`zikrCat.${categoryId}`)}
      subtitle={t("zikr.adhkarCount", { count: items.length })}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      {items.length === 0 ? (
        <EmptyState
          icon={{ ios: "heart", android: "favorite_border", web: "favorite_border" }}
          title={t("zikr.emptyTitle")}
          description={t("zikr.emptyDesc")}
        />
      ) : (
        <Card padding="three">
          <Stagger>
            <View style={styles.list}>
              {items.map((item) => (
                <ZikrRow
                  key={item.id}
                  item={item}
                  expandable
                  isFavorite={favoriteIds.includes(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  onPress={() =>
                    router.push({ pathname: "/zikr/detail/[id]", params: { id: item.id } })
                  }
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
