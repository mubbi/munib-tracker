import type { NameOfAllah } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  type ListRenderItem,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { Radius, Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useScriptureTranslation } from "@/hooks/use-scripture-translation";
import { useScrollToActiveIndex } from "@/hooks/use-scroll-to-active";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { allNameTracks, nameAudioTrack, namesCompleteTrack } from "@/lib/audio-tracks";
import { loadNamesOfAllah } from "@/lib/content-loaders";
import { buildNamesActivity } from "@/lib/continue-activity";
import { cueStartSec, isNamesCompleteTrack, nameIdAtCueTime } from "@/lib/names-complete-cues";
import { goBackOrReplace } from "@/lib/navigation";
import { createNameSearch } from "@/lib/search";
import { webPageSchema } from "@/lib/seo/structured-data";
import { formatReadingShare } from "@/lib/share";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { recordContinueActivity } from "@/stores/continue-store";
import {
  useEnsureNameFavoritesLoaded,
  useFavoriteNameIds,
  useNameFavoritesActions,
} from "@/stores/name-favorites-store";

const NAMES_HREF = "/names-of-allah";
/** Approximate row height (card + column gap) for scroll recovery in the 2-column grid. */
const NAME_ROW_HEIGHT = 196;
/** Play-all header card + search + bottom margin. */
const NAMES_LIST_HEADER_HEIGHT = 272;
type Name = NameOfAllah;

export default function NamesOfAllahScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const contentBottomInset = useContentBottomInset();
  const audio = useAudioPlayerContext();
  const listRef = useRef<FlatList<Name>>(null);
  useEnsureNameFavoritesLoaded();
  const favoriteIds = useFavoriteNameIds();
  const { toggle } = useNameFavoritesActions();
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const { share, isSharing, isGesturePending, SnapshotHost } = useShareContentCard();

  const [query, setQuery] = useState("");
  const [allNames, setAllNames] = useState<Name[]>([]);
  useEffect(() => {
    void loadNamesOfAllah().then(setAllNames);
  }, []);
  const index = useMemo(() => createNameSearch(allNames), [allNames]);
  const names = query.trim() ? index.search(query) : allNames;
  const numberById = useMemo(
    () => new Map(allNames.map((name, index) => [name.id, index + 1])),
    [allNames],
  );

  // Reading progress from scroll position. `getItemLayout` gives the list an
  // exact content size, so pixel offset over the scrollable range is accurate
  // and maps directly to how far the reader has scrolled.
  const readingProgress = useSharedValue(0);
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const range = contentSize.height - layoutMeasurement.height;
      readingProgress.value = range > 0 ? Math.min(1, Math.max(0, contentOffset.y / range)) : 0;
    },
    [readingProgress],
  );

  const cuePositionSec = Math.floor(audio.position);

  const activeId = useMemo(() => {
    const trackId = audio.current?.id;
    if (!trackId) return undefined;

    const resolvedId = isNamesCompleteTrack(trackId) ? nameIdAtCueTime(cuePositionSec) : trackId;

    if (!resolvedId || !names.some((n) => n.id === resolvedId)) return undefined;
    return resolvedId;
  }, [audio.current?.id, cuePositionSec, names]);

  const indexForKey = useCallback((id: string) => names.findIndex((n) => n.id === id), [names]);
  const { onScrollToIndexFailed } = useScrollToActiveIndex(listRef, activeId, indexForKey, {
    viewOffset: Spacing.two,
    itemCount: names.length,
    numColumns: 2,
    listHeaderHeight: NAMES_LIST_HEADER_HEIGHT,
  });

  const getItemLayout = useCallback((_: ArrayLike<Name> | null | undefined, i: number) => {
    const row = Math.floor(i / 2);
    return {
      length: NAME_ROW_HEIGHT,
      offset: NAMES_LIST_HEADER_HEIGHT + row * NAME_ROW_HEIGHT,
      index: i,
    };
  }, []);

  const playFrom = useCallback(
    (name: Name) => {
      const position = allNames.findIndex((n) => n.id === name.id);
      audio.play(allNameTracks(allNames), Math.max(0, position), { sourceHref: NAMES_HREF });
      recordContinueActivity(buildNamesActivity(name, { isAudio: true }));
    },
    [allNames, audio],
  );

  /** Play one name, or seek within the continuous recitation when it is active. */
  const playName = useCallback(
    (name: Name) => {
      if (isNamesCompleteTrack(audio.current?.id)) {
        const start = cueStartSec(name.id);
        if (start == null) return;
        audio.seekTo(start);
        if (!audio.isPlaying) audio.toggle();
        recordContinueActivity(buildNamesActivity(name, { isAudio: true }));
        return;
      }

      const track = nameAudioTrack(name);
      if (track) {
        audio.play([track], 0, { sourceHref: NAMES_HREF });
        recordContinueActivity(buildNamesActivity(name, { isAudio: true }));
      }
    },
    [audio],
  );

  const shareName = useCallback(
    async (name: Name) => {
      await share({
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
    },
    [share, t],
  );

  const header = useMemo(
    () => (
      <View style={styles.headerWrap}>
        <SavedNavCard
          title={t("names.favorites")}
          viewLabel={t("names.favorites")}
          count={favoriteIds.length > 0 ? favoriteIds.length : undefined}
          headerIcon={{ ios: "star.fill", android: "star", web: "star" }}
          rowIcon={{ ios: "star.fill", android: "star", web: "star" }}
          onPress={() => router.push("/names-of-allah/favorites")}
        />

        <Card padding="three" style={styles.headerCard}>
          <View style={styles.playActions}>
            <Button
              label={t("names.playAll")}
              icon={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
              onPress={() => allNames[0] && playFrom(allNames[0])}
              style={styles.flex}
            />
            <Button
              label={t("names.playContinuous")}
              variant="secondary"
              icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
              onPress={() => audio.play([namesCompleteTrack()], 0, { sourceHref: NAMES_HREF })}
              style={styles.flex}
            />
          </View>
          <View style={[styles.searchBox, { backgroundColor: colors.muted }]}>
            <SymbolView
              name={{ ios: "magnifyingglass", android: "search", web: "search" }}
              size={17}
              tintColor={colors.mutedForeground}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("names.searchPlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={t("names.searchPlaceholder")}
              autoCorrect={false}
              returnKeyType="search"
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>
        </Card>
      </View>
    ),
    [
      audio,
      colors.foreground,
      colors.muted,
      colors.mutedForeground,
      favoriteIds.length,
      playFrom,
      allNames,
      query,
      router,
      t,
    ],
  );

  const keyExtractor = useCallback((name: Name) => name.id, []);

  const rowExtras = useMemo(
    () => ({ activeId, isAudioPlaying: audio.isPlaying, favoriteSet }),
    [activeId, audio.isPlaying, favoriteSet],
  );

  const rowExtrasRef = useRef(rowExtras);
  rowExtrasRef.current = rowExtras;

  const renderItem = useCallback<ListRenderItem<Name>>(
    ({ item: name }: ListRenderItemInfo<Name>) => {
      const extras = rowExtrasRef.current;
      const rowIsPlaying = extras.activeId === name.id;
      return (
        <NameRow
          name={name}
          isPlaying={rowIsPlaying}
          isAudioPlaying={rowIsPlaying ? extras.isAudioPlaying : false}
          isFavorite={extras.favoriteSet.has(name.id)}
          onPlayName={playName}
          onToggleFavorite={toggle}
          onShareName={shareName}
          isSharing={isSharing}
          isGesturePending={isGesturePending}
          onTogglePlayback={audio.toggle}
          number={numberById.get(name.id)}
        />
      );
    },
    [audio.toggle, isGesturePending, isSharing, numberById, playName, shareName, toggle],
  );

  return (
    <ScreenLayout
      scrollable={false}
      eyebrow={t("names.eyebrow")}
      title={t("names.title")}
      subtitle={t("names.subtitle", { count: allNames.length })}
      onBack={() => goBackOrReplace(router, "/")}
      headerAccessory={
        <ReadingProgressBar
          progress={readingProgress}
          accessibilityLabel={t("common.readingProgress")}
        />
      }
    >
      {SnapshotHost}
      <Seo
        path="/names-of-allah"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("names.title"), path: "/names-of-allah" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/names-of-allah",
            name: "99 Names of Allah — Asma ul Husna",
            description:
              "The 99 beautiful names of Allah (Asma ul-Husna) with Arabic, transliteration, and meaning.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("names.title"), path: "/names-of-allah" },
            ],
          }),
        ]}
      />
      <FlatList
        ref={listRef}
        data={names}
        extraData={rowExtras}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={header}
        getItemLayout={getItemLayout}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollToIndexFailed={onScrollToIndexFailed}
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: contentBottomInset }]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={5}
        updateCellsBatchingPeriod={100}
        removeClippedSubviews
      />
    </ScreenLayout>
  );
}

const NameRow = memo(function NameRow({
  name,
  isPlaying,
  isAudioPlaying,
  isFavorite,
  onPlayName,
  onToggleFavorite,
  onShareName,
  isSharing,
  isGesturePending,
  onTogglePlayback,
  number,
}: {
  name: Name;
  isPlaying: boolean;
  isAudioPlaying: boolean;
  isFavorite: boolean;
  onPlayName: (name: Name) => void;
  onToggleFavorite: (id: string) => void;
  onShareName: (name: Name) => void;
  isSharing: (shareKey: string) => boolean;
  isGesturePending: (shareKey: string) => boolean;
  onTogglePlayback: () => void;
  number?: number;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const translatedMeaning = useScriptureTranslation(name);
  const displayMeaning = name.meaning ?? translatedMeaning;

  const handlePlay = useCallback(() => {
    if (isPlaying) onTogglePlayback();
    else onPlayName(name);
  }, [isPlaying, name, onPlayName, onTogglePlayback]);

  const handleToggleFavorite = useCallback(
    () => onToggleFavorite(name.id),
    [name.id, onToggleFavorite],
  );

  const handleShare = useCallback(() => onShareName(name), [name, onShareName]);

  return (
    <View style={styles.cell}>
      <Card
        padding="three"
        style={[
          styles.card,
          isPlaying
            ? { borderColor: colors.accent, borderWidth: 1 }
            : { borderColor: tokens.hairline, borderWidth: 1 },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.number, { backgroundColor: tokens.accentSoft }]}>
            <ThemedText type="caption" style={{ color: colors.accentText }}>
              {number}
            </ThemedText>
          </View>
          <ThemedText type="arabic" style={styles.arabic}>
            {name.arabic}
          </ThemedText>
        </View>
        <ThemedText type="smallBold" numberOfLines={1} style={{ color: colors.accentText }}>
          {name.transliteration}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.meaning}>
          {displayMeaning}
        </ThemedText>
        <View style={styles.footer}>
          {name.audioUri ? (
            <IconButton
              name={
                isPlaying && isAudioPlaying
                  ? { ios: "pause.fill", android: "pause", web: "pause" }
                  : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
              }
              size={18}
              tintColor={colors.accentForeground}
              background={colors.accent}
              hitTarget={40}
              accessibilityLabel={isPlaying && isAudioPlaying ? t("names.pause") : t("names.play")}
              accessibilityState={{ selected: isPlaying }}
              onPress={handlePlay}
            />
          ) : (
            <View />
          )}
          <View style={styles.footerActions}>
            <IconButton
              name={
                isFavorite
                  ? { ios: "star.fill", android: "star", web: "star" }
                  : { ios: "star", android: "star_border", web: "star_border" }
              }
              size={16}
              tintColor={isFavorite ? tokens.status.warning.color : colors.mutedForeground}
              background={tokens.accentSoft}
              hitTarget={40}
              accessibilityLabel={isFavorite ? t("names.unfavorite") : t("names.favorite")}
              accessibilityState={{ selected: isFavorite }}
              onPress={handleToggleFavorite}
            />
            <IconButton
              name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
              size={16}
              tintColor={colors.mutedForeground}
              background={tokens.accentSoft}
              hitTarget={40}
              accessibilityLabel={
                isGesturePending(name.id) ? t("share.tapToShare") : t("names.share")
              }
              loading={isSharing(name.id)}
              onPress={handleShare}
            />
          </View>
        </View>
      </Card>
    </View>
  );
});

const styles = StyleSheet.create({
  list: { flex: 1, width: "100%" },
  listContent: { gap: Spacing.two },
  columnWrapper: { gap: Spacing.two },
  cell: { flex: 1 },
  headerWrap: { marginBottom: Spacing.two, gap: Spacing.two },
  headerCard: { gap: Spacing.three },
  playActions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  flex: { flex: 1 },
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
    paddingVertical: Spacing.two + 2,
    fontSize: 15,
  },
  card: {
    flex: 1,
    gap: Spacing.one,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.one,
  },
  number: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  arabic: {
    fontSize: 26,
  },
  meaning: {
    marginTop: Spacing.half,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    marginTop: "auto",
    paddingTop: Spacing.two,
  },
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
});
