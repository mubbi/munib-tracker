import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type AccessibilityActionEvent,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type ViewInstance,
} from "react-native";
import { GlassSurface, hasLiquidGlass } from "@/components/ui/glass-surface";
import { IconButton } from "@/components/ui/icon-button";
import { Radius, Shadows, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { ltrControlViewProps } from "@/lib/rtl";
import { volumeIconForLevel } from "./player-format";

/** Volume slider step for keyboard/AT adjustments (0–1). */
const VOLUME_STEP = 0.1;

/** Vertical popover slider height (compact mini-player). */
const VERTICAL_VOLUME_HEIGHT = 88;

// ── Vertical volume popover (compact bar) ────────────────────────────────────

function VerticalVolumeBar({
  volume,
  onChange,
  trackColor,
  fillColor,
  thumbColor,
}: {
  volume: number;
  onChange: (volume: number) => void;
  trackColor: string;
  fillColor: string;
  thumbColor: string;
}) {
  const { t } = useTranslation();
  const [scrub, setScrub] = useState<number | null>(null);
  const trackRef = useRef<ViewInstance>(null);
  const trackWindowRef = useRef({ y: 0, height: VERTICAL_VOLUME_HEIGHT });

  const measureTrack = useCallback(() => {
    trackRef.current?.measureInWindow((_x, y, _w, h) => {
      if (h > 0) trackWindowRef.current = { y, height: h };
    });
  }, []);

  const ratioFromPageY = useCallback((pageY: number) => {
    const { y, height } = trackWindowRef.current;
    const h = height || VERTICAL_VOLUME_HEIGHT;
    return Math.max(0, Math.min(1, 1 - (pageY - y) / h));
  }, []);

  const responder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (e) => {
        measureTrack();
        triggerHaptic("selection");
        const next = ratioFromPageY(e.nativeEvent.pageY);
        setScrub(next);
        onChange(next);
      },
      onPanResponderMove: (e) => {
        const next = ratioFromPageY(e.nativeEvent.pageY);
        setScrub(next);
        onChange(next);
      },
      onPanResponderRelease: () => {
        setScrub(null);
      },
      onPanResponderTerminate: () => setScrub(null),
    });
  }, [measureTrack, onChange, ratioFromPageY]);

  const shown = scrub ?? volume;
  const progress = Math.min(Math.max(shown, 0), 1);
  const percent = Math.round(progress * 100);

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const delta =
      event.nativeEvent.actionName === "increment"
        ? VOLUME_STEP
        : event.nativeEvent.actionName === "decrement"
          ? -VOLUME_STEP
          : 0;
    if (delta === 0) return;
    onChange(Math.max(0, Math.min(1, volume + delta)));
  };

  return (
    <View
      style={[
        styles.verticalVolumeBar,
        Platform.OS === "web" ? ({ touchAction: "none", userSelect: "none" } as const) : null,
      ]}
      accessibilityRole="adjustable"
      accessibilityLabel={t("player.volume")}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: percent,
        text: t("player.volumeValue", { value: percent }),
      }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={onAccessibilityAction}
      onLayout={measureTrack}
      {...responder.panHandlers}
    >
      <View
        ref={trackRef}
        collapsable={false}
        style={[
          styles.verticalVolumeTrack,
          { height: VERTICAL_VOLUME_HEIGHT, backgroundColor: trackColor },
        ]}
      >
        <View
          style={[
            styles.verticalVolumeFill,
            { height: `${progress * 100}%`, backgroundColor: fillColor },
          ]}
        >
          <View
            style={[
              styles.verticalVolumeThumb,
              { backgroundColor: thumbColor, transform: [{ scale: scrub != null ? 1.25 : 1 }] },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

export function VolumePopover({
  volume,
  onChange,
  trackColor,
  fillColor,
  thumbColor,
  iconColor,
  popupBackground,
  popupBorder,
}: {
  volume: number;
  onChange: (volume: number) => void;
  trackColor: string;
  fillColor: string;
  thumbColor: string;
  iconColor: string;
  popupBackground: string;
  popupBorder: string;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const [open, setOpen] = useState(false);
  const hoverInsideRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isWeb = Platform.OS === "web";

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const openPopup = useCallback(() => setOpen(true), []);
  const closePopup = useCallback(() => setOpen(false), []);

  const scheduleClose = useCallback(() => {
    if (!isWeb) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      if (!hoverInsideRef.current) closePopup();
    }, 180);
  }, [closePopup, isWeb]);

  const onAnchorHoverIn = () => {
    if (!isWeb) return;
    hoverInsideRef.current = true;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    openPopup();
  };

  const onAnchorHoverOut = () => {
    if (!isWeb) return;
    hoverInsideRef.current = false;
    scheduleClose();
  };

  const onIconPress = () => {
    setOpen((value) => !value);
  };

  const positionStyle = isWeb ? styles.volumePopupFloating : styles.volumePopupNative;
  const sliderBar = (
    <VerticalVolumeBar
      volume={volume}
      onChange={onChange}
      trackColor={trackColor}
      fillColor={fillColor}
      thumbColor={thumbColor}
    />
  );

  const body = (
    <>
      {open ? (
        // Floating frosted-glass popover — real Liquid Glass on iOS 26, a native
        // blur elsewhere. Absolutely positioned so it hovers above the control
        // instead of reflowing the player bar. The wash keeps the blur fallback
        // legible; iOS 26's real material reads through without it.
        <GlassSurface
          backdropCapture
          style={[
            styles.volumePopup,
            positionStyle,
            styles.volumePopupGlass,
            { borderColor: popupBorder },
          ]}
        >
          {!hasLiquidGlass ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  pointerEvents: "none",
                  backgroundColor: withAlpha(popupBackground, tokens.isDark ? 0.5 : 0.62),
                },
              ]}
            />
          ) : null}
          {sliderBar}
        </GlassSurface>
      ) : null}
      <IconButton
        name={volumeIconForLevel(volume)}
        size={18}
        tintColor={iconColor}
        accessibilityLabel={t("player.volume")}
        accessibilityState={{ selected: open }}
        onPress={onIconPress}
        hitTarget={34}
        glass
        wellRadius={17}
      />
    </>
  );

  if (isWeb) {
    const ltrShell = ltrControlViewProps();
    return (
      <Pressable
        dir={ltrShell.dir}
        style={[styles.volumePopoverAnchor, ltrShell.style]}
        onHoverIn={onAnchorHoverIn}
        onHoverOut={onAnchorHoverOut}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.volumePopoverAnchor,
        styles.volumePopoverAnchorNative,
        ltrControlViewProps().style,
      ]}
    >
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  volumePopoverAnchor: {
    position: "relative",
    zIndex: 2,
  },
  volumePopoverAnchorNative: {
    alignItems: "center",
  },
  volumePopup: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    ...Shadows.sm,
    zIndex: 10,
  },
  volumePopupFloating: {
    position: "absolute",
    bottom: "100%",
    left: 0,
    right: 0,
    marginBottom: Spacing.one,
    alignItems: "center",
  },
  // Float above the volume icon (absolute) so opening it doesn't push the
  // surrounding transport controls around inside the bar.
  volumePopupNative: {
    position: "absolute",
    bottom: "100%",
    left: 0,
    right: 0,
    marginBottom: Spacing.one,
    alignItems: "center",
  },
  volumePopupGlass: {
    overflow: "hidden",
  },
  verticalVolumeBar: {
    minWidth: 52,
    minHeight: VERTICAL_VOLUME_HEIGHT + Spacing.two * 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  verticalVolumeTrack: {
    width: 4,
    borderRadius: 2,
    justifyContent: "flex-end",
  },
  verticalVolumeFill: {
    width: "100%",
    borderRadius: 2,
    position: "relative",
  },
  verticalVolumeThumb: {
    position: "absolute",
    top: -4,
    left: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    ...Shadows.sm,
  },
});
