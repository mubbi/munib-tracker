import type { NameOfAllah } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type FlatList,
  type LayoutChangeEvent,
  type ListRenderItem,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useScriptureTranslation } from "@/hooks/use-scripture-translation";
import { useScrollToActiveIndex } from "@/hooks/use-scroll-to-active";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWebScreenKeyHandler } from "@/hooks/use-web-key-handler";
import { allNameTracks, nameAudioTrack, namesCompleteTrack } from "@/lib/audio-tracks";
import { loadNamesOfAllah } from "@/lib/content-loaders";
import { buildNamesActivity } from "@/lib/continue-activity";
import { cueStartSec, isNamesCompleteTrack } from "@/lib/names-complete-cues";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { isRTL, useChevronBackward, useChevronForward } from "@/lib/rtl";
import { createNameSearch } from "@/lib/search";
import { routeMetadata } from "@/lib/seo/route-metadata";
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
/** TV: landscape 10-foot grid — three cards per row instead of the phone pair. */
const NAME_COLUMNS = isTV() ? 3 : 2;
/** Wide web / tablets: narrowest comfortable name card in the dense grid. */
const NAME_MIN_CELL_WIDTH = 176;
const NAME_MAX_COLUMNS = 6;
/** Window width at which the selected-name detail panel sits beside the grid. */
const NAME_PANEL_BREAKPOINT = 1024;
const NAME_PANEL_WIDTH = 340;
/** Wide two-pane layout uses the desktop content cap. */
const NAMES_WIDE_MAX_WIDTH = 1320;
type Name = NameOfAllah;

export default function NamesOfAllahScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const { width: windowWidth } = useWindowDimensions();
  // Wide web / tablets (never TV): dense grid + a detail panel for the selected name.
  const wide = !tv && windowWidth >= 768;
  const showPanel = !tv && windowWidth >= NAME_PANEL_BREAKPOINT;
  const [gridWidth, setGridWidth] = useState(0);
  const columns = useMemo(() => {
    if (!wide) return NAME_COLUMNS;
    if (gridWidth <= 0) return 4;
    const fit = Math.floor((gridWidth + Spacing.two) / (NAME_MIN_CELL_WIDTH + Spacing.two));
    return Math.max(3, Math.min(NAME_MAX_COLUMNS, fit));
  }, [gridWidth, wide]);
  const onGridLayout = useCallback((event: LayoutChangeEvent) => {
    const next = Math.round(event.nativeEvent.layout.width);
    setGridWidth((prev) => (Math.abs(prev - next) < 4 ? prev : next));
  }, []);
  const listHeaderHeight = showPanel ? 0 : NAMES_LIST_HEADER_HEIGHT;
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const activeId = useMemo(() => {
    const trackId = audio.current?.id;
    if (!trackId || isNamesCompleteTrack(trackId)) return undefined;
    if (!names.some((n) => n.id === trackId)) return undefined;
    return trackId;
  }, [audio.current?.id, names]);

  const indexForKey = useCallback((id: string) => names.findIndex((n) => n.id === id), [names]);
  const { onScrollToIndexFailed } = useScrollToActiveIndex(listRef, activeId, indexForKey, {
    viewOffset: Spacing.two,
    itemCount: names.length,
    numColumns: columns,
    listHeaderHeight,
  });

  const getItemLayout = useCallback(
    (_: ArrayLike<Name> | null | undefined, i: number) => {
      const row = Math.floor(i / columns);
      return {
        length: NAME_ROW_HEIGHT,
        offset: listHeaderHeight + row * NAME_ROW_HEIGHT,
        index: i,
      };
    },
    [columns, listHeaderHeight],
  );

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
      <View style={showPanel ? styles.headerWrapPanel : styles.headerWrap}>
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
              icon={PLAY_CIRCLE_ICON}
              onPress={() => allNames[0] && playFrom(allNames[0])}
              style={styles.flex}
              preferredFocus
            />
            <Button
              label={t("names.playContinuous")}
              variant="secondary"
              icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
              onPress={() => audio.play([namesCompleteTrack()], 0, { sourceHref: NAMES_HREF })}
              style={styles.flex}
            />
          </View>
          <View style={[styles.searchBox, tokens.inputSurface]}>
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
      colors.mutedForeground,
      favoriteIds.length,
      playFrom,
      allNames,
      query,
      router,
      showPanel,
      t,
      tokens.inputSurface,
    ],
  );

  const keyExtractor = useCallback((name: Name) => name.id, []);

  // Detail panel selection: explicit pick, else the playing name, else the first match.
  const selectedName = useMemo(() => {
    if (!showPanel) return undefined;
    const pick = selectedId ?? activeId;
    return (pick ? names.find((n) => n.id === pick) : undefined) ?? names[0];
  }, [activeId, names, selectedId, showPanel]);
  const selectedIndex = selectedName ? names.indexOf(selectedName) : -1;

  const selectName = useCallback((id: string) => setSelectedId(id), []);
  const stepSelection = useCallback(
    (delta: number) => {
      if (selectedIndex < 0) return false;
      const next = names[selectedIndex + delta];
      if (!next) return false;
      setSelectedId(next.id);
      const listIndex = selectedIndex + delta;
      try {
        listRef.current?.scrollToIndex({ index: listIndex, viewPosition: 0.5, animated: true });
      } catch {
        // Out-of-window rows on first paint: selection still updates.
      }
      return true;
    },
    [names, selectedIndex],
  );

  // Desktop web: Left/Right arrows move through the names (mirrored in RTL).
  useWebScreenKeyHandler((event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return undefined;
    const forward = (event.key === "ArrowRight") !== isRTL();
    return stepSelection(forward ? 1 : -1);
  }, showPanel);

  const rowExtras = useMemo(
    () => ({
      activeId,
      isAudioPlaying: audio.isPlaying,
      favoriteSet,
      selectedId: selectedName?.id,
    }),
    [activeId, audio.isPlaying, favoriteSet, selectedName?.id],
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
          isSelected={extras.selectedId === name.id}
          onSelect={showPanel ? selectName : undefined}
        />
      );
    },
    [
      audio.toggle,
      isGesturePending,
      isSharing,
      numberById,
      playName,
      selectName,
      shareName,
      showPanel,
      toggle,
    ],
  );

  const list = (
    <TvFlatList
      // numColumns cannot change on the fly — remount when the column count changes.
      key={`names-cols-${columns}`}
      ref={listRef}
      data={names}
      extraData={rowExtras}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      numColumns={columns}
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={showPanel ? undefined : header}
      getItemLayout={tv ? undefined : getItemLayout}
      onScroll={onScroll}
      scrollEventThrottle={16}
      onScrollToIndexFailed={onScrollToIndexFailed}
      style={styles.list}
      contentContainerStyle={[styles.listContent, { paddingBottom: contentBottomInset }]}
      showsVerticalScrollIndicator={false}
      initialNumToRender={wide ? 18 : 6}
      maxToRenderPerBatch={wide ? 12 : 4}
      windowSize={5}
      updateCellsBatchingPeriod={100}
      // Stale getItemLayout + taller TV rows + clipping → blank viewport.
      removeClippedSubviews={!tv}
    />
  );

  return (
    <ScreenLayout
      scrollable={false}
      eyebrow={t("names.eyebrow")}
      title={t("names.title")}
      subtitle={t("names.subtitle", { count: allNames.length })}
      onBack={() => goBackOrReplace(router, "/")}
      maxContentWidth={showPanel ? NAMES_WIDE_MAX_WIDTH : undefined}
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
      {showPanel ? (
        <View style={styles.wideRoot}>
          <View style={styles.wideGrid} onLayout={onGridLayout}>
            {list}
          </View>
          <View style={[styles.panel, { borderStartColor: tokens.hairline }]}>
            <ScrollView
              style={styles.panelScroll}
              contentContainerStyle={[styles.panelContent, { paddingBottom: contentBottomInset }]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {header}
              {selectedName ? (
                <NameDetailPanel
                  name={selectedName}
                  number={numberById.get(selectedName.id)}
                  isPlaying={activeId === selectedName.id}
                  isAudioPlaying={activeId === selectedName.id && audio.isPlaying}
                  isFavorite={favoriteSet.has(selectedName.id)}
                  onPlay={() =>
                    activeId === selectedName.id ? audio.toggle() : playName(selectedName)
                  }
                  onToggleFavorite={() => toggle(selectedName.id)}
                  onShare={() => void shareName(selectedName)}
                  isSharing={isSharing(selectedName.id)}
                  isGesturePending={isGesturePending(selectedName.id)}
                  hasPrevious={selectedIndex > 0}
                  hasNext={selectedIndex >= 0 && selectedIndex < names.length - 1}
                  onStep={stepSelection}
                />
              ) : null}
            </ScrollView>
          </View>
        </View>
      ) : wide ? (
        <View style={styles.wideGridSolo} onLayout={onGridLayout}>
          {list}
        </View>
      ) : (
        list
      )}
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
  isSelected,
  onSelect,
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
  /** Wide web: highlighted as the detail panel's name. */
  isSelected?: boolean;
  /** Wide web: tapping the name body opens it in the detail panel. */
  onSelect?: (id: string) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
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
  const handleSelect = useCallback(() => onSelect?.(name.id), [name.id, onSelect]);

  const body = (
    <>
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
      <ThemedText
        type="smallBold"
        numberOfLines={1}
        style={[{ color: colors.accentText }, styles.clampText]}
      >
        {name.transliteration}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.meaning}>
        {displayMeaning}
      </ThemedText>
    </>
  );

  return (
    <View style={styles.cell}>
      <Card
        padding="three"
        style={[
          styles.card,
          !tv && styles.cardPhone,
          isPlaying || isSelected
            ? { borderColor: colors.accent, borderWidth: 1 }
            : { borderColor: tokens.hairline, borderWidth: 1 },
          isSelected && !isPlaying ? { backgroundColor: tokens.accentSoft } : null,
        ]}
      >
        {onSelect ? (
          // Sibling of the footer buttons (never wraps them — no nested <button> on web).
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={name.transliteration}
            accessibilityState={{ selected: Boolean(isSelected) }}
            onPress={handleSelect}
            scaleTo={0.98}
            style={styles.selectArea}
          >
            {body}
          </PressableScale>
        ) : (
          body
        )}
        <View style={[styles.footer, !tv && styles.footerPhone]}>
          {name.audioUri ? (
            <LabeledIconButton
              name={isPlaying && isAudioPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
              label={isPlaying && isAudioPlaying ? t("common.pause") : t("common.play")}
              iconSize={tv ? 24 : 18}
              tintColor={colors.accent}
              labelColor={colors.accent}
              background={tokens.accentSoft}
              accessibilityLabel={isPlaying && isAudioPlaying ? t("names.pause") : t("names.play")}
              accessibilityState={{ selected: isPlaying }}
              onPress={handlePlay}
              style={tv ? undefined : styles.playButton}
            />
          ) : (
            <View />
          )}
          <View style={[styles.footerActions, !tv && styles.footerActionsPhone]}>
            <IconButton
              name={
                isFavorite
                  ? { ios: "star.fill", android: "star", web: "star" }
                  : { ios: "star", android: "star_border", web: "star_border" }
              }
              size={tv ? 20 : 16}
              tintColor={isFavorite ? tokens.status.warning.color : colors.mutedForeground}
              background={tokens.accentSoft}
              hitTarget={tv ? TvLayout.minFocusTarget : 40}
              accessibilityLabel={isFavorite ? t("names.unfavorite") : t("names.favorite")}
              accessibilityState={{ selected: isFavorite }}
              onPress={handleToggleFavorite}
            />
            {/* No share sheet on TV (phone-only capability). */}
            {tv ? null : (
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
            )}
          </View>
        </View>
      </Card>
    </View>
  );
});

/** Wide web: the selected name, large, with its actions and previous / next. */
function NameDetailPanel({
  name,
  number,
  isPlaying,
  isAudioPlaying,
  isFavorite,
  onPlay,
  onToggleFavorite,
  onShare,
  isSharing,
  isGesturePending,
  hasPrevious,
  hasNext,
  onStep,
}: {
  name: Name;
  number?: number;
  isPlaying: boolean;
  isAudioPlaying: boolean;
  isFavorite: boolean;
  onPlay: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
  isSharing: boolean;
  isGesturePending: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onStep: (delta: number) => boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const translatedMeaning = useScriptureTranslation(name);
  const displayMeaning = name.meaning ?? translatedMeaning;
  const prevIcon = useChevronBackward();
  const nextIcon = useChevronForward();
  const pausing = isPlaying && isAudioPlaying;

  return (
    <Card
      padding="four"
      style={[styles.panelCard, { borderColor: tokens.hairline, borderWidth: 1 }]}
    >
      <View style={styles.panelTop}>
        <View style={[styles.number, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="caption" style={{ color: colors.accentText }}>
            {number}
          </ThemedText>
        </View>
        <View style={styles.panelStepRow}>
          <IconButton
            name={prevIcon}
            size={16}
            tintColor={colors.mutedForeground}
            background={colors.muted}
            hitTarget={36}
            accessibilityLabel={t("common.previous")}
            accessibilityState={{ disabled: !hasPrevious }}
            disabled={!hasPrevious}
            onPress={() => onStep(-1)}
          />
          <IconButton
            name={nextIcon}
            size={16}
            tintColor={colors.mutedForeground}
            background={colors.muted}
            hitTarget={36}
            accessibilityLabel={t("common.next")}
            accessibilityState={{ disabled: !hasNext }}
            disabled={!hasNext}
            onPress={() => onStep(1)}
          />
        </View>
      </View>
      <ThemedText type="arabic" style={styles.panelArabic}>
        {name.arabic}
      </ThemedText>
      <ThemedText type="subtitle" style={[styles.panelCenter, { color: colors.accentText }]}>
        {name.transliteration}
      </ThemedText>
      <ThemedText type="default" themeColor="mutedForeground" style={styles.panelCenter}>
        {displayMeaning}
      </ThemedText>
      <View style={styles.panelActions}>
        {name.audioUri ? (
          <Button
            label={pausing ? t("names.pause") : t("names.play")}
            icon={pausing ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
            onPress={onPlay}
            fullWidth
          />
        ) : null}
        <View style={styles.playActions}>
          <Button
            label={isFavorite ? t("names.unfavorite") : t("names.favorite")}
            variant="secondary"
            icon={
              isFavorite
                ? { ios: "star.fill", android: "star", web: "star" }
                : { ios: "star", android: "star_border", web: "star_border" }
            }
            onPress={onToggleFavorite}
            style={styles.flex}
          />
          <Button
            label={isGesturePending ? t("share.tapToShare") : t("names.share")}
            variant="ghost"
            icon={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
            disabled={isSharing}
            onPress={onShare}
            style={styles.flex}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  wideRoot: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    gap: Spacing.four,
    minHeight: 0,
  },
  wideGrid: { flex: 1, minWidth: 0, minHeight: 0 },
  wideGridSolo: { flex: 1, width: "100%", minHeight: 0 },
  panel: {
    width: NAME_PANEL_WIDTH,
    borderStartWidth: StyleSheet.hairlineWidth,
    minHeight: 0,
  },
  panelScroll: { flex: 1 },
  panelContent: { paddingStart: Spacing.four, gap: Spacing.three },
  panelCard: { gap: Spacing.two },
  panelTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  panelStepRow: { flexDirection: "row", gap: Spacing.two },
  panelArabic: { fontSize: 44, lineHeight: 72, textAlign: "center", marginVertical: Spacing.two },
  panelCenter: { textAlign: "center" },
  panelActions: { gap: Spacing.two, marginTop: Spacing.three },
  selectArea: { gap: Spacing.one, borderRadius: Radius.sm, borderCurve: "continuous" },
  headerWrapPanel: { gap: Spacing.three },
  list: { flex: 1, width: "100%", minHeight: 0 },
  listContent: { gap: Spacing.two },
  columnWrapper: { gap: Spacing.two },
  cell: { flex: 1, minWidth: 0 },
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
    minWidth: 0,
    gap: Spacing.one,
  },
  cardPhone: {
    paddingHorizontal: Spacing.two,
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
    flexShrink: 1,
    minWidth: 0,
  },
  clampText: {
    minWidth: 0,
  },
  meaning: {
    marginTop: Spacing.half,
    minWidth: 0,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    marginTop: "auto",
    paddingTop: Spacing.two,
    minWidth: 0,
  },
  footerPhone: {
    gap: Spacing.one,
  },
  playButton: {
    flex: 1,
    minWidth: 0,
  },
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 0,
  },
  footerActionsPhone: {
    gap: Spacing.one,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/names-of-allah");
