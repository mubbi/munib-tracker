import { SymbolView } from "expo-symbols";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type FlatList,
  type LayoutChangeEvent,
  type ListRenderItem,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import type { AudioTrack } from "@/providers/audio-player-provider";

/** Playlist row body height — fixed so FlatList getItemLayout / scroll offsets stay accurate. */
const PLAYLIST_ROW_BODY = tvDp(88);

/** Full row extent (body + gap) used for scroll-to-active math. */
const PLAYLIST_ROW_HEIGHT = PLAYLIST_ROW_BODY + Spacing.two;

export const ExpandedPlaylist = memo(function ExpandedPlaylist({
  queue,
  activeIndex,
  onJumpTo,
}: {
  queue: AudioTrack[];
  activeIndex: number;
  onJumpTo: (index: number) => void;
}) {
  const { t } = useTranslation();
  const playlistRef = useRef<FlatList<AudioTrack>>(null);
  const [playlistHeight, setPlaylistHeight] = useState(0);
  // Extra bottom space so the last track can still sit at the top of the viewport.
  const listEndInset = Math.max(0, playlistHeight - PLAYLIST_ROW_HEIGHT);

  const scrollActiveToTop = useCallback((targetIndex: number, animated = true) => {
    if (targetIndex < 0) return;
    playlistRef.current?.scrollToOffset({
      offset: targetIndex * PLAYLIST_ROW_HEIGHT,
      animated,
    });
  }, []);

  const onPlaylistLayout = useCallback((event: LayoutChangeEvent) => {
    setPlaylistHeight(event.nativeEvent.layout.height);
  }, []);

  useEffect(() => {
    if (queue.length === 0 || playlistHeight <= 0) return;
    const clamped = Math.min(Math.max(activeIndex, 0), queue.length - 1);
    // Non-animated so auto-advance doesn't leave the previous ayah at the top
    // while the active row is still below the fold.
    const timer = setTimeout(() => scrollActiveToTop(clamped, false), 16);
    return () => clearTimeout(timer);
  }, [activeIndex, queue.length, playlistHeight, scrollActiveToTop]);

  const renderItem = useCallback<ListRenderItem<AudioTrack>>(
    ({ item: track, index: i }) => (
      <PlaylistRow
        track={track}
        position={i + 1}
        active={i === activeIndex}
        onPress={() => onJumpTo(i)}
      />
    ),
    [activeIndex, onJumpTo],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<AudioTrack> | null | undefined, i: number) => ({
      length: PLAYLIST_ROW_HEIGHT,
      offset: PLAYLIST_ROW_HEIGHT * i,
      index: i,
    }),
    [],
  );

  const keyExtractor = useCallback((track: AudioTrack) => track.id, []);

  return (
    <>
      <ThemedText type="smallBold" themeColor="mutedForeground" style={styles.upNext}>
        {t("player.upNext")}
      </ThemedText>
      <TvFlatList
        ref={playlistRef}
        data={queue}
        extraData={activeIndex}
        keyExtractor={keyExtractor}
        style={styles.playlist}
        onLayout={onPlaylistLayout}
        contentContainerStyle={{
          paddingBottom: listEndInset + Spacing.three,
        }}
        showsVerticalScrollIndicator={false}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        initialNumToRender={Math.max(8, activeIndex + 3)}
        maxToRenderPerBatch={8}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={Platform.OS !== "web"}
      />
    </>
  );
});

const PlaylistRow = memo(function PlaylistRow({
  track,
  position,
  active,
  onPress,
}: {
  track: AudioTrack;
  position: number;
  active: boolean;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const primary = track.playlistPrimary ?? track.subtitle ?? track.title;
  const secondary = track.playlistSecondary ?? track.preview;
  const primaryIsArabic = track.playlistPrimaryRtl === true;
  const secondaryIsArabic = track.playlistSecondary == null && Boolean(track.preview);

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={secondary ? `${primary}. ${secondary}` : primary}
      haptic="light"
      scaleTo={0.98}
      onPress={onPress}
      style={[
        styles.plRow,
        {
          backgroundColor: active ? tokens.accentSoft : colors.muted,
          // TV: the solid accent edge is reserved for the D-pad focus ring.
          borderColor: active
            ? tv
              ? withAlpha(colors.accent, 0.35)
              : colors.accent
            : "transparent",
        },
      ]}
    >
      <View style={[styles.plIndex, { backgroundColor: active ? colors.accent : colors.card }]}>
        {active ? (
          <SymbolView
            name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
            size={16}
            tintColor={colors.accentForeground}
          />
        ) : (
          <ThemedText type="smallBold" themeColor="mutedForeground">
            {position}
          </ThemedText>
        )}
      </View>
      <View style={styles.plBody}>
        <ThemedText
          type={primaryIsArabic ? "arabic" : "smallBold"}
          numberOfLines={primaryIsArabic ? 2 : 1}
          style={[
            primaryIsArabic ? styles.plArabic : undefined,
            active ? { color: colors.accentText } : undefined,
          ]}
        >
          {primary}
        </ThemedText>
        {secondary ? (
          <ThemedText
            type={secondaryIsArabic ? "arabic" : "caption"}
            numberOfLines={1}
            themeColor={secondaryIsArabic ? undefined : "mutedForeground"}
            style={[
              secondaryIsArabic ? styles.plPreview : undefined,
              active && secondaryIsArabic ? { color: colors.accentText } : undefined,
            ]}
          >
            {secondary}
          </ThemedText>
        ) : null}
      </View>
      {active ? (
        <SymbolView
          name={{ ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }}
          size={16}
          tintColor={colors.accent}
        />
      ) : null}
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  upNext: { marginBottom: Spacing.two },
  playlist: { flex: 1 },
  plRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    height: PLAYLIST_ROW_BODY,
    marginBottom: Spacing.two,
    paddingVertical: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thick,
    borderColor: "transparent",
    overflow: "hidden",
  },
  plIndex: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  plBody: { flex: 1, gap: Spacing.half, minWidth: 0 },
  plArabic: {
    fontSize: 22,
    writingDirection: "rtl",
  },
  plPreview: {
    fontSize: 14,
    writingDirection: "rtl",
  },
});
