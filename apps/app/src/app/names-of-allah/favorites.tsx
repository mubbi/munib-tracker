import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { nameAudioTrack } from "@/lib/audio-tracks";
import { NAMES_CORPUS } from "@/lib/content-loaders";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { formatReadingShare } from "@/lib/share";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
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
  const { toggle, restore } = useNameFavoritesActions();
  const undoToast = useUndoToast();
  const audio = useAudioPlayerContext();
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();
  const openName = (id: string) =>
    router.push({ pathname: "/names-of-allah", params: { name: id } });
  const playName = (name: (typeof items)[number]) => {
    const track = nameAudioTrack(name);
    if (track) audio.play([track], 0, { sourceHref: "/names-of-allah" });
  };
  const shareName = (name: (typeof items)[number]) =>
    share({
      message: formatReadingShare({
        title: name.transliteration,
        arabic: name.arabic,
        transliteration: name.transliteration,
        translation: name.meaning ?? name.translation,
      }),
      sectionTitle: t("share.sectionNames"),
      contentLabel: name.transliteration,
      filenameSlug: "names",
      shareKey: name.id,
      content: {
        kind: "reading",
        item: {
          title: name.transliteration,
          arabic: name.arabic,
          transliteration: name.transliteration,
          translation: name.meaning ?? name.translation,
        },
      },
    });
  const { items: names, ready: corpusReady } = useContentCorpus(NAMES_CORPUS);
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
      {/* TV: toasts take no focus — the Undo lives on the page (B-04). */}
      <TvUndoButton controller={undoToast} preferredFocus />
      {SnapshotHost}
      <Seo path="/names-of-allah/favorites" />
      {favoriteIds.length === 0 ? (
        <EmptyState
          icon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
          title={t("names.favEmptyTitle")}
          description={tTv(t, "names.favEmptyDesc", "names.favEmptyDescTv")}
          actionLabel={t("names.title")}
          onAction={() => router.replace("/names-of-allah")}
        />
      ) : !corpusReady ? (
        <SkeletonPlaceholder preset="rows" accessibilityLabel={t("names.loading")} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
          title={t("names.favEmptyTitle")}
          description={tTv(t, "names.favEmptyDesc", "names.favEmptyDescTv")}
          actionLabel={t("names.title")}
          onAction={() => router.replace("/names-of-allah")}
        />
      ) : (
        <Card>
          {/* Wide web / tablets: saved names in 2-3 columns (TV keeps one). */}
          <ResponsiveGrid columns={isTV() ? 1 : undefined} maxColumns={3} gap={Spacing.two}>
            {items.map((name) => (
              <View key={name.id} style={[styles.row, { backgroundColor: colors.muted }]}>
                <View style={[styles.number, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="caption" style={{ color: colors.accentText }}>
                    {numberById.get(name.id)}
                  </ThemedText>
                </View>
                <PressableScale
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={name.transliteration}
                  accessibilityHint={t("names.openHint")}
                  onPress={() => openName(name.id)}
                  style={styles.openArea}
                >
                  <View style={styles.body}>
                    <ThemedText type="smallBold" numberOfLines={1}>
                      {name.transliteration}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                      {name.meaning ?? name.translation}
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="arabic"
                    accessibilityLanguage="ar"
                    style={styles.arabic}
                    numberOfLines={1}
                  >
                    {name.arabic}
                  </ThemedText>
                </PressableScale>
                {name.audioUri ? (
                  <IconButton
                    name={{ ios: "play.circle.fill", android: "play_circle", web: "play_circle" }}
                    size={18}
                    tintColor={colors.accentText}
                    accessibilityLabel={t("names.play")}
                    hitTarget={isTV() ? TvLayout.minFocusTargetDp : undefined}
                    onPress={() => playName(name)}
                  />
                ) : null}
                {isTV() ? null : (
                  <IconButton
                    name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
                    size={18}
                    tintColor={colors.mutedForeground}
                    accessibilityLabel={
                      isGesturePending(name.id) ? t("share.tapToShare") : t("names.share")
                    }
                    loading={isSharing(name.id)}
                    onPress={() => void shareName(name)}
                  />
                )}
                <IconButton
                  name={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
                  size={18}
                  tintColor={colors.accentText}
                  accessibilityLabel={t("names.unfavorite")}
                  haptic="warning"
                  hitTarget={isTV() ? TvLayout.minFocusTargetDp : undefined}
                  onPress={() => {
                    // Undo restores the saved position (B-30).
                    const position = favoriteIds.indexOf(name.id);
                    void undoToast.run({
                      do: () => toggle(name.id),
                      undo: () => restore(name.id, position),
                      messageKey: "names.removedToast",
                    });
                  }}
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
  openArea: { flex: 1, flexDirection: "row", alignItems: "center", gap: Spacing.two },
  body: { flex: 1, gap: Spacing.half },
  arabic: { fontSize: 20 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/names-of-allah/favorites");
