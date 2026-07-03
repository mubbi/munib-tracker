import { getZikrById } from "@munib-tracker/shared/content";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Platform, Share, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { Stagger } from "@/components/ui/stagger";
import { ZikrCard } from "@/components/zikr/zikr-card";
import { Spacing } from "@/constants/theme";
import { formatZikrShare } from "@/lib/zikr";
import { useFavoriteZikrIds, usePreferencesActions } from "@/stores/preferences-store";
import { useZikrCount } from "@/stores/tracker-store";

export default function ZikrDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const favoriteIds = useFavoriteZikrIds();
  const { toggleFavorite } = usePreferencesActions();
  const item = params.id ? getZikrById(params.id) : undefined;
  const count = useZikrCount(item?.id ?? "");

  if (!item) {
    return (
      <ScreenLayout title="Zikr" onBack={router.canGoBack() ? () => router.back() : undefined}>
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title="Zikr not found"
          description="This item may have been removed."
        />
      </ScreenLayout>
    );
  }

  const isFavorite = favoriteIds.includes(item.id);
  const target = item.targetCount ?? 0;

  const onShare = async () => {
    if (Platform.OS === "web") return;
    try {
      await Share.share({ message: formatZikrShare(item) });
    } catch {
      // user cancelled or share unavailable
    }
  };

  return (
    <ScreenLayout
      eyebrow="Zikr"
      title={item.title}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <ZikrCard item={item} />

        {target > 0 ? (
          <Card padding="three">
            <View style={styles.progressHeader}>
              <ThemedText type="smallBold">Today</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {Math.min(count, target)} / {target}
              </ThemedText>
            </View>
            <SegmentedProgress total={target} completed={Math.min(count, target)} />
          </Card>
        ) : null}

        <View style={styles.actions}>
          <Button
            label="Open in Tasbeeh"
            icon={{ ios: "circle.hexagongrid.fill", android: "hive", web: "hive" }}
            fullWidth
            onPress={() =>
              router.push({ pathname: "/tasbeeh/[zikrId]", params: { zikrId: item.id } })
            }
          />
          <View style={styles.actionRow}>
            <Button
              label={isFavorite ? "Favorited" : "Favorite"}
              variant="secondary"
              icon={
                isFavorite
                  ? { ios: "star.fill", android: "star", web: "star" }
                  : { ios: "star", android: "star_border", web: "star_border" }
              }
              onPress={() => toggleFavorite(item.id)}
              style={styles.flex}
            />
            {Platform.OS !== "web" ? (
              <Button
                label="Share"
                variant="ghost"
                icon={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                onPress={onShare}
                style={styles.flex}
              />
            ) : null}
          </View>
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  actions: {
    gap: Spacing.two,
  },
  actionRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
});
