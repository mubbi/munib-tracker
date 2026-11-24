import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { TtsVoiceControl } from "@/components/audio/tts-voice-control";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { QuranPlaybackSettingsControl } from "@/components/quran/quran-playback-settings-control";
import { MoreInSettingsLink } from "@/components/settings/more-in-settings-link";
import { ThemedText } from "@/components/themed-text";
import { GlassControl, GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useSetMiniPlayerInset } from "@/hooks/use-content-bottom-inset";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWebKeyHandler } from "@/hooks/use-web-key-handler";
import { useWebTabLayout } from "@/hooks/use-web-tab-layout";
import { supportsProgrammaticVolume } from "@/lib/audio-volume";
import { isTV } from "@/lib/platform/is-tv";
import { ltrControlViewProps, useSkipNextIcon, useSkipPreviousIcon } from "@/lib/rtl";
import { useAudioPlayerContext, useAudioProgressContext } from "@/providers/audio-player-provider";
import { usePreferences } from "@/stores/preferences-store";
import { ExpandedPlaylist } from "./expanded-playlist";
import {
  DESKTOP_BAR_MIN_WIDTH,
  EXPANDED_DESKTOP_MAX_WIDTH,
  LOOP_ICON,
  LOOP_LABEL_KEY,
  REPLAY_ICON,
  SEEK_STEP,
} from "./player-constants";
import { formatTime, nextPlaybackRate } from "./player-format";
import { SeekBar } from "./seek-bar";
import { useLivePlaybackUi } from "./use-live-playback-ui";
import { VolumePopover } from "./volume-popover";

// ── Expanded full player ─────────────────────────────────────────────────────

export function ExpandedPlayer({ onCollapse }: { onCollapse: () => void }) {
  const insets = useAppSafeAreaInsets();
  const { width: windowWidth } = useWebTabLayout();
  // Web: Escape minimises the expanded player (before any early return).
  useWebKeyHandler((event) => {
    if (event.key !== "Escape") return undefined;
    onCollapse();
    return true;
  }, !isTV());
  const setMiniPlayerInset = useSetMiniPlayerInset();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const skipPreviousIcon = useSkipPreviousIcon();
  const skipNextIcon = useSkipNextIcon();
  const cacheAudioLocally = usePreferences().cacheAudioLocally !== false;
  const audio = useAudioPlayerContext();
  const { position, queuePosition, queueProgress } = useAudioProgressContext();

  const {
    current,
    queue,
    index,
    isPlaying,
    isBuffering,
    isTransitioning,
    rate,
    volume,
    loopMode,
    sourceHref,
    duration,
    queueDuration,
    trackDurations,
    isQueueFinished,
    toggle,
    next,
    previous,
    replay,
    jumpTo,
    seekTo,
    seekToQueuePosition,
    setRate,
    setVolume,
    cycleLoopMode,
    stop,
    readPlaybackSeconds,
  } = audio;

  useEffect(() => {
    setMiniPlayerInset(0);
  }, [setMiniPlayerInset]);

  const hasQueue = queue.length > 1;
  const shownPosition = hasQueue ? queuePosition : position;
  const shownDuration = hasQueue ? (queueDuration > 0 ? queueDuration : duration) : duration;
  const heldProgress = hasQueue
    ? queueProgress
    : shownDuration > 0
      ? Math.min(shownPosition / shownDuration, 1)
      : 0;
  const { position: livePosition } = useLivePlaybackUi({
    readSeconds: readPlaybackSeconds,
    isPlaying: Boolean(current) && isPlaying,
    isTransitioning,
    hasQueue,
    queue,
    index,
    trackDurations,
    heldPosition: shownPosition,
    heldProgress,
    trackDuration: shownDuration,
  });

  const showBufferingBar = isBuffering || isTransitioning;
  const [confirmClose, setConfirmClose] = useState(false);

  if (!current) return null;

  const remainingTracks = Math.max(0, queue.length - (index + 1));
  const loopActive = loopMode !== "off";
  const showSpinner = isBuffering && !isPlaying && !isTransitioning;

  const cycleRate = () => setRate(nextPlaybackRate(rate));
  const openSource = () => {
    if (sourceHref) {
      onCollapse();
      router.push(sourceHref as Href);
    }
  };

  const sheetBottomInset = Math.max(insets.bottom, Spacing.two) + Spacing.two;
  const tv = isTV();
  // Desktop / wide tablet: keep the full-screen player in a centred column
  // instead of spreading header buttons and the queue across the window.
  const desktopGutter =
    !tv && windowWidth >= DESKTOP_BAR_MIN_WIDTH
      ? Math.max(Spacing.four, (windowWidth - EXPANDED_DESKTOP_MAX_WIDTH) / 2)
      : null;
  const onSeek = hasQueue ? seekToQueuePosition : seekTo;
  // TV: the seek bar is drag-only — step ±10 s with buttons instead.
  const seekBy = (delta: number) => {
    if (shownDuration <= 0) return;
    onSeek(Math.max(0, Math.min(shownDuration, livePosition + delta)));
  };

  const sheetStyle = StyleSheet.flatten([
    styles.sheet,
    {
      paddingTop: insets.top + Spacing.two,
      paddingBottom: sheetBottomInset,
      ...(desktopGutter != null ? { paddingHorizontal: desktopGutter } : null),
      ...(tv
        ? {
            paddingHorizontal: TvLayout.contentPaddingX,
            paddingTop: TvLayout.contentPaddingY,
            paddingBottom: TvLayout.contentPaddingY,
          }
        : null),
    },
  ]);

  return (
    <>
      {/* TV: the expanded player is an in-tree overlay, not a Modal — trap D-pad
          focus inside it so it can't wander to the screen underneath. */}
      <ExpandedSheetHost style={sheetStyle}>
        {/* Frosted glass chrome to match the sheets and compact bar: real Liquid
          Glass on iOS 26, a native blur elsewhere, backdrop-filter on web. The
          wash keeps the full-screen player legible over busy content behind. */}
        <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
          <GlassSurface backdropCapture style={StyleSheet.absoluteFill} intensity={64} />
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: withAlpha(
                  colors.background,
                  hasLiquidGlass ? (tokens.isDark ? 0.6 : 0.7) : tokens.isDark ? 0.82 : 0.88,
                ),
              },
            ]}
          />
        </View>
        <View style={styles.sheetHeader}>
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("player.minimize")}
            onPress={onCollapse}
            style={[
              styles.headerButton,
              tv && styles.headerButtonTv,
              { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
            ]}
          >
            <SymbolView
              name={{
                ios: "chevron.down",
                android: "keyboard_arrow_down",
                web: "keyboard_arrow_down",
              }}
              size={18}
              tintColor={colors.accent}
            />
            <ThemedText type="smallBold" style={{ color: colors.accent }}>
              {t("player.minimize")}
            </ThemedText>
          </PressableScale>
          <ThemedText type="smallBold" themeColor="mutedForeground">
            {t("player.nowPlaying")}
          </ThemedText>
          <PressableScale
            haptic="medium"
            accessibilityRole="button"
            accessibilityLabel={t("player.close")}
            onPress={() => setConfirmClose(true)}
            style={[
              styles.headerButton,
              tv && styles.headerButtonTv,
              {
                backgroundColor: tokens.status.danger.soft,
                borderColor: withAlpha(tokens.status.danger.color, 0.4),
              },
            ]}
          >
            <SymbolView
              name={{ ios: "xmark", android: "close", web: "close" }}
              size={16}
              tintColor={tokens.status.danger.text}
            />
            <ThemedText type="smallBold" style={{ color: tokens.status.danger.text }}>
              {t("player.closeLabel")}
            </ThemedText>
          </PressableScale>
        </View>

        <View style={[styles.artwork, { backgroundColor: tokens.accentSoft }]}>
          <SymbolView
            name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
            size={56}
            tintColor={colors.accent}
          />
        </View>

        <View style={styles.titleBlock}>
          <ThemedText type="title" numberOfLines={1} style={styles.centerText}>
            {current.title}
          </ThemedText>
          {current.subtitle ? (
            <ThemedText
              type="small"
              themeColor="mutedForeground"
              numberOfLines={1}
              style={styles.centerText}
            >
              {current.subtitle}
            </ThemedText>
          ) : null}
          {hasQueue ? (
            <ThemedText type="caption" style={[styles.centerText, { color: colors.accentText }]}>
              {t("player.trackOf", { current: index + 1, total: queue.length })} ·{" "}
              {t("player.remaining", { count: remainingTracks })}
            </ThemedText>
          ) : null}
        </View>

        {!cacheAudioLocally ? (
          <ThemedText
            type="caption"
            themeColor="mutedForeground"
            style={[styles.centerText, styles.streamingNote]}
          >
            {t("player.streamingOnlyNote")}
          </ThemedText>
        ) : null}

        {/* Draggable seek bar + times */}
        <SeekBar
          position={livePosition}
          duration={shownDuration}
          onSeek={onSeek}
          trackColor={tokens.track}
          fillColor={colors.accent}
          thumbColor={colors.accent}
          buffering={showBufferingBar}
        />
        <View style={styles.times}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {formatTime(livePosition, shownDuration)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            -{formatTime(Math.max(0, shownDuration - livePosition), shownDuration)}
          </ThemedText>
        </View>
        {tv ? (
          // Media transport stays LTR in every UI direction (time runs left→right).
          <View style={[styles.tvSeekRow, ltrControlViewProps().style]}>
            <IconButton
              name={{ ios: "gobackward.10", android: "replay_10", web: "replay_10" }}
              size={22}
              tintColor={colors.foreground}
              background={colors.muted}
              accessibilityLabel={t("player.seekBack", { seconds: SEEK_STEP })}
              onPress={() => seekBy(-SEEK_STEP)}
              hitTarget={TvLayout.minFocusTargetDp}
            />
            <IconButton
              name={{ ios: "goforward.10", android: "forward_10", web: "forward_10" }}
              size={22}
              tintColor={colors.foreground}
              background={colors.muted}
              accessibilityLabel={t("player.seekForward", { seconds: SEEK_STEP })}
              onPress={() => seekBy(SEEK_STEP)}
              hitTarget={TvLayout.minFocusTargetDp}
            />
          </View>
        ) : null}

        {/* Controls — mirror the mini player's cluster: loop · prev · play · next ·
          volume (inline popover) · speed. Interactive Liquid Glass wells on
          iOS 26, tinted solids elsewhere. */}
        <View style={styles.controls}>
          <IconButton
            name={LOOP_ICON[loopMode]}
            size={22}
            tintColor={loopActive ? colors.accent : colors.mutedForeground}
            accessibilityLabel={t(LOOP_LABEL_KEY[loopMode])}
            accessibilityState={{ selected: loopActive }}
            onPress={cycleLoopMode}
            glass={!loopActive}
            background={loopActive ? tokens.accentSoft : undefined}
            wellRadius={24}
            style={loopActive ? { borderWidth: 1.5, borderColor: colors.accent } : undefined}
          />
          <QuranPlaybackSettingsControl size={22} wellRadius={24} />
          <TtsVoiceControl size={22} wellRadius={24} />
          <IconButton
            name={skipPreviousIcon}
            size={26}
            tintColor={hasQueue ? colors.foreground : colors.mutedForeground}
            accessibilityLabel={t("player.previous")}
            accessibilityState={{ disabled: !hasQueue }}
            onPress={previous}
            glass
            wellRadius={24}
          />
          <GlassControl radius={32} tintColor={colors.accent}>
            <PressableScale
              haptic="medium"
              accessibilityRole="button"
              accessibilityLabel={
                isQueueFinished
                  ? t("player.replay")
                  : isPlaying
                    ? t("player.pause")
                    : t("player.play")
              }
              accessibilityState={{ busy: showSpinner }}
              onPress={isQueueFinished ? replay : toggle}
              {...(tv ? { hasTVPreferredFocus: true } : {})}
              style={[
                styles.bigPlay,
                tv && styles.bigPlayTv,
                !hasLiquidGlass && { backgroundColor: colors.accent },
              ]}
            >
              {showSpinner ? (
                <ActivityIndicator size="small" color={colors.accentForeground} />
              ) : (
                <SymbolView
                  name={
                    isQueueFinished
                      ? REPLAY_ICON
                      : isPlaying
                        ? { ios: "pause.fill", android: "pause", web: "pause" }
                        : { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
                  }
                  size={28}
                  tintColor={colors.accentForeground}
                />
              )}
            </PressableScale>
          </GlassControl>
          <IconButton
            name={skipNextIcon}
            size={26}
            tintColor={hasQueue ? colors.foreground : colors.mutedForeground}
            accessibilityLabel={t("player.next")}
            accessibilityState={{ disabled: !hasQueue }}
            onPress={next}
            glass
            wellRadius={24}
          />
          {supportsProgrammaticVolume() && !tv ? (
            <VolumePopover
              volume={volume}
              onChange={setVolume}
              trackColor={tokens.track}
              fillColor={colors.accent}
              thumbColor={colors.accent}
              iconColor={colors.foreground}
              popupBackground={colors.card}
              popupBorder={colors.border}
            />
          ) : null}
          <GlassControl radius={Radius.sm}>
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t("player.speedValue", { value: rate })}
              onPress={cycleRate}
              style={[
                styles.speed,
                tv && styles.speedTv,
                !hasLiquidGlass && { backgroundColor: colors.muted },
              ]}
            >
              <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                {rate}×
              </ThemedText>
            </PressableScale>
          </GlassControl>
        </View>

        {sourceHref ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("player.goToScreen")}
            haptic="light"
            onPress={openSource}
            style={[styles.sourceLink, { borderColor: tokens.hairline }]}
          >
            <SymbolView
              name={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
              size={16}
              tintColor={colors.accent}
            />
            <ThemedText type="smallBold" style={{ color: colors.accentText }}>
              {t("player.goToScreen")}
            </ThemedText>
          </PressableScale>
        ) : null}

        {/* Speed / volume / voice here are shortcuts to Settings › Audio & voice. */}
        {tv ? null : (
          <MoreInSettingsLink
            settingId="audio.speed"
            onNavigate={onCollapse}
            style={styles.moreInSettings}
          />
        )}

        {/* Playlist — isolated so progress-clock re-renders don't thrash FlatList */}
        {hasQueue ? <ExpandedPlaylist queue={queue} activeIndex={index} onJumpTo={jumpTo} /> : null}
      </ExpandedSheetHost>
      <ConfirmDialog
        visible={confirmClose}
        title={t("player.closeConfirmTitle")}
        message={t("player.closeConfirmMessage")}
        confirmLabel={t("player.closeConfirmCta")}
        destructive
        onConfirm={stop}
        onClose={() => setConfirmClose(false)}
      />
    </>
  );
}

/** Phone/web: plain View. TV: focus guide trapping all four edges (+ focus memory). */
function ExpandedSheetHost({
  style,
  children,
}: {
  style: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  if (!isTV()) return <View style={style}>{children}</View>;
  return (
    <TvFocusGuide autoFocus trapFocusUp trapFocusDown trapFocusLeft trapFocusRight style={style}>
      {children}
    </TvFocusGuide>
  );
}

const styles = StyleSheet.create({
  moreInSettings: { alignSelf: "center" },
  headerButtonTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.four,
  },
  bigPlayTv: {
    width: tvDp(80),
    height: tvDp(80),
    borderRadius: tvDp(40),
  },
  speedTv: {
    minWidth: TvLayout.minFocusTarget,
    minHeight: TvLayout.minFocusTarget,
  },
  tvSeekRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.four,
    marginBottom: Spacing.two,
  },
  sheet: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    paddingHorizontal: Spacing.four,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.four,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.two - 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  artwork: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: Radius.xl,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.four,
  },
  titleBlock: { gap: Spacing.one, marginBottom: Spacing.four },
  centerText: { textAlign: "center" },
  streamingNote: { marginTop: Spacing.one },
  times: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.three },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.four,
  },
  bigPlay: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  speed: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  sourceLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.three,
  },
});
