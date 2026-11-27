import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, type LayoutChangeEvent, StyleSheet, View } from "react-native";
import { TtsVoiceControl } from "@/components/audio/tts-voice-control";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { QuranPlaybackSettingsControl } from "@/components/quran/quran-playback-settings-control";
import { ThemedText } from "@/components/themed-text";
import { GlassControl, GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useSetMiniPlayerInset, useTabBarOffset } from "@/hooks/use-content-bottom-inset";
import { useIsTabScreen } from "@/hooks/use-tab-screen";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWebTabLayout } from "@/hooks/use-web-tab-layout";
import { supportsProgrammaticVolume } from "@/lib/audio-volume";
import { isTV } from "@/lib/platform/is-tv";
import { useSkipNextIcon, useSkipPreviousIcon } from "@/lib/rtl";
import { useAudioPlayerContext, useAudioProgressContext } from "@/providers/audio-player-provider";
import { usePreferences } from "@/stores/preferences-store";
import { BufferingBand } from "./buffering-band";
import {
  DESKTOP_BAR_MAX_WIDTH,
  DESKTOP_BAR_MIN_WIDTH,
  LOOP_ICON,
  LOOP_LABEL_KEY,
  REPLAY_ICON,
} from "./player-constants";
import { formatTime, nextPlaybackRate } from "./player-format";
import { useLivePlaybackUi } from "./use-live-playback-ui";
import { VolumePopover } from "./volume-popover";

// ── Compact bar ──────────────────────────────────────────────────────────────

export function CompactPlayer({
  onExpand,
  focusOnMount = false,
}: {
  onExpand: () => void;
  /**
   * TV: take D-pad focus on mount — only after collapsing the expanded player.
   * The bar never grabs focus on its own when playback starts.
   */
  focusOnMount?: boolean;
}) {
  const insets = useAppSafeAreaInsets();
  const inTabs = useIsTabScreen();
  const tabBarOffset = useTabBarOffset();
  const { sideRailWidth, width: windowWidth } = useWebTabLayout();
  const setMiniPlayerInset = useSetMiniPlayerInset();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const skipPreviousIcon = useSkipPreviousIcon();
  const skipNextIcon = useSkipNextIcon();
  const tv = isTV();
  // Desktop / wide tablet: one horizontal bar (track · transport · close) centred
  // in the content column instead of the stacked two-row phone layout.
  const desktopBar = !tv && windowWidth >= DESKTOP_BAR_MIN_WIDTH;
  // Stack screens: dock flush to the screen and pad the home indicator inside the
  // bar. Tab roots: keep sitting above the tab bar (tabBarOffset includes safe area).
  const dockBottom = inTabs ? tabBarOffset : 0;
  const dockSafePad = inTabs ? 0 : insets.bottom;
  const {
    current,
    isPlaying,
    isBuffering,
    isTransitioning,
    toggle,
    next,
    previous,
    replay,
    stop,
    isQueueFinished,
    duration,
    queueDuration,
    queue,
    index,
    trackDurations,
    rate,
    setRate,
    volume,
    setVolume,
    loopMode,
    cycleLoopMode,
    readPlaybackSeconds,
  } = useAudioPlayerContext();
  const { position, queuePosition, queueProgress } = useAudioProgressContext();
  const cacheAudioLocally = usePreferences().cacheAudioLocally !== false;

  useEffect(() => () => setMiniPlayerInset(0), [setMiniPlayerInset]);

  const [confirmClose, setConfirmClose] = useState(false);

  const hasQueue = queue.length > 1;
  const shownPosition = hasQueue ? queuePosition : position;
  const shownDuration = hasQueue ? (queueDuration > 0 ? queueDuration : duration) : duration;
  const heldProgress = hasQueue
    ? queueProgress
    : shownDuration > 0
      ? Math.min(shownPosition / shownDuration, 1)
      : 0;
  const { position: livePosition, progress } = useLivePlaybackUi({
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

  if (!current) return null;

  const showSpinner = isBuffering && !isPlaying && !isTransitioning;
  const loopActive = loopMode !== "off";
  const cycleRate = () => setRate(nextPlaybackRate(rate));

  const onLayout = (event: LayoutChangeEvent) => {
    setMiniPlayerInset(event.nativeEvent.layout.height);
  };

  const closeButton = (
    <PressableScale
      haptic="medium"
      accessibilityRole="button"
      accessibilityLabel={t("player.close")}
      onPress={() => setConfirmClose(true)}
      style={[
        styles.compactClose,
        tv && styles.compactCloseTv,
        {
          backgroundColor: tokens.status.danger.soft,
          borderColor: withAlpha(tokens.status.danger.color, 0.4),
        },
      ]}
    >
      <SymbolView
        name={{ ios: "xmark", android: "close", web: "close" }}
        size={13}
        tintColor={tokens.status.danger.text}
      />
      <ThemedText weight="bold" type="caption" style={{ color: tokens.status.danger.text }}>
        {t("player.closeLabel")}
      </ThemedText>
    </PressableScale>
  );

  return (
    <>
      <View
        onLayout={onLayout}
        style={[
          styles.container,
          {
            bottom: dockBottom,
            // Logical inset: the side rail sits on the start edge (right in RTL).
            start: sideRailWidth,
            end: 0,
            borderColor: colors.border,
            paddingBottom: dockSafePad,
            ...(tv
              ? {
                  paddingHorizontal: TvLayout.contentPaddingX,
                  paddingTop: Spacing.two,
                  // Bottom overscan: keep controls off the bezel-cropped edge.
                  paddingBottom: Math.max(dockSafePad, TvLayout.contentPaddingY),
                }
              : null),
          },
        ]}
      >
        {/* Frosted glass chrome: real Liquid Glass on iOS 26, a native blur
          elsewhere, backdrop-filter on web. A light card wash keeps the small
          metadata text legible over busy content behind the bar. */}
        <GlassSurface backdropCapture style={StyleSheet.absoluteFill} intensity={64} />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: withAlpha(colors.card, tokens.isDark ? 0.22 : 0.32),
              pointerEvents: "none",
            },
          ]}
        />
        <View style={[styles.progress, { backgroundColor: tokens.track }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress * 100}%`, backgroundColor: colors.accent },
            ]}
          />
          <BufferingBand color={colors.accent} active={showBufferingBar} />
        </View>

        <View style={[styles.compactBody, desktopBar && styles.compactBodyDesktop]}>
          <View style={[styles.compactTopRow, desktopBar && styles.compactTopRowDesktop]}>
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={current.title}
              accessibilityHint={t("player.expand")}
              onPress={onExpand}
              {...(tv && focusOnMount ? { hasTVPreferredFocus: true } : {})}
              style={styles.infoRow}
            >
              <View style={[styles.icon, { backgroundColor: tokens.accentSoft }]}>
                <SymbolView
                  name={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
                  size={18}
                  tintColor={colors.accent}
                />
              </View>
              <View style={styles.meta}>
                <ThemedText type="smallBold" numberOfLines={1}>
                  {current.title}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                  {current.subtitle ? `${current.subtitle} · ` : ""}
                  {showSpinner
                    ? t("player.buffering")
                    : `${formatTime(livePosition, shownDuration)} / ${formatTime(shownDuration, shownDuration)}`}
                </ThemedText>
                {!cacheAudioLocally ? (
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                    {t("player.streamingOnlyNote")}
                  </ThemedText>
                ) : null}
              </View>
              <SymbolView
                name={{ ios: "chevron.up", android: "keyboard_arrow_up", web: "keyboard_arrow_up" }}
                size={16}
                tintColor={colors.mutedForeground}
              />
            </PressableScale>
            {desktopBar ? null : closeButton}
          </View>

          <View style={[styles.compactControlsRow, desktopBar && styles.compactControlsDesktop]}>
            <IconButton
              name={LOOP_ICON[loopMode]}
              size={18}
              tintColor={loopActive ? colors.accent : colors.mutedForeground}
              accessibilityLabel={t(LOOP_LABEL_KEY[loopMode])}
              accessibilityState={{ selected: loopActive }}
              onPress={cycleLoopMode}
              glass={!loopActive}
              background={loopActive ? tokens.accentSoft : undefined}
              wellRadius={20}
              style={
                loopActive
                  ? { borderWidth: BorderWidth.thick, borderColor: colors.accent }
                  : undefined
              }
            />
            <QuranPlaybackSettingsControl size={18} wellRadius={20} />
            <TtsVoiceControl size={18} wellRadius={20} />
            {hasQueue ? (
              <IconButton
                name={skipPreviousIcon}
                size={20}
                tintColor={colors.foreground}
                accessibilityLabel={t("player.previous")}
                onPress={previous}
                glass
                wellRadius={20}
              />
            ) : null}
            <GlassControl radius={19} tintColor={colors.accent}>
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
                style={[
                  styles.playButton,
                  tv && styles.playButtonTv,
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
                    size={20}
                    tintColor={colors.accentForeground}
                  />
                )}
              </PressableScale>
            </GlassControl>
            {hasQueue ? (
              <IconButton
                name={skipNextIcon}
                size={20}
                tintColor={colors.foreground}
                accessibilityLabel={t("player.next")}
                onPress={next}
                glass
                wellRadius={20}
              />
            ) : null}
            {/* TV: the remote owns system volume, and the drag-only slider has
                no D-pad path — hide it. */}
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
                  styles.compactSpeed,
                  tv && styles.compactSpeedTv,
                  !hasLiquidGlass && { backgroundColor: colors.muted },
                ]}
              >
                <ThemedText weight="bold" type="caption" style={{ color: colors.accentText }}>
                  {rate}×
                </ThemedText>
              </PressableScale>
            </GlassControl>
          </View>
          {desktopBar ? closeButton : null}
        </View>
      </View>
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

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    start: 0,
    end: 0,
    zIndex: 40,
    borderTopWidth: BorderWidth.hairline,
    overflow: "visible",
  },
  progress: { height: 3, width: "100%", overflow: "hidden" },
  progressFill: { height: "100%" },
  compactBody: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.twoHalf,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.twoHalf,
  },
  compactTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  /** Desktop: single row centred in the content column (not edge-to-edge). */
  compactBodyDesktop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.four,
    width: "100%",
    maxWidth: DESKTOP_BAR_MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: Spacing.four,
  },
  compactTopRowDesktop: { flex: 1, minWidth: 0 },
  compactControlsDesktop: { flexShrink: 0 },
  compactCloseTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.three,
  },
  playButtonTv: {
    width: TvLayout.chipMinHeight,
    height: TvLayout.chipMinHeight,
    borderRadius: TvLayout.chipMinHeight / 2,
  },
  compactSpeedTv: {
    minWidth: TvLayout.chipMinHeight,
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.two,
  },
  compactClose: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
    flexShrink: 0,
  },
  infoRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.twoHalf,
    minWidth: 0,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  meta: { flex: 1, gap: Spacing.half, minWidth: 0 },
  compactControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.oneHalf,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  compactSpeed: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: Spacing.oneHalf,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
});
