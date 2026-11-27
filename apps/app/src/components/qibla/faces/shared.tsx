import { type ReactNode, useCallback, useEffect, useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, type TextStyle, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import Svg, { Polygon } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import { BorderWidth, QiblaInstrument, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { localeToBcp47 } from "@/lib/locale-bcp47";

import type { QiblaMotion } from "./types";

export const CARDINALS = [
  { key: "cardinalN", angle: 0 },
  { key: "cardinalE", angle: 90 },
  { key: "cardinalS", angle: 180 },
  { key: "cardinalW", angle: 270 },
] as const;

/** Point on a circle, `deg` clockwise from 12 o'clock (compass convention). */
export function polar(center: number, radius: number, deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: center + radius * Math.sin(rad), y: center - radius * Math.cos(rad) };
}

/** Two-decimal coordinates keep SVG path strings short and stable across renders. */
export function fx(n: number): string {
  return (Math.round(n * 100) / 100).toString();
}

/** Smallest angle between two bearings, 0–180. */
export function angleGap(a: number, b: number): number {
  return Math.abs(((a - b + 540) % 360) - 180);
}

/** An id safe inside `url(#…)` — SVG ids are document-global on web, so each face instance needs its own. */
export function useSvgId(): string {
  return `q${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

/** Rotates a layer with the dial (north stays on real north). */
export function useDialStyle(motion: QiblaMotion) {
  return useAnimatedStyle(() => ({ transform: [{ rotate: `${motion.dial.value}deg` }] }));
}

/** Rotates a layer toward the qibla on screen, with the aligned pulse. */
export function useNeedleStyle(motion: QiblaMotion) {
  return useAnimatedStyle(() => ({
    transform: [{ rotate: `${motion.needle.value}deg` }, { scale: motion.pulse.value }],
  }));
}

/** Static motion for style thumbnails and the editor's demo stage. */
export function useStaticQiblaMotion(bearing: number): QiblaMotion {
  const dial = useSharedValue(0);
  const needle = useSharedValue(bearing);
  const glow = useSharedValue(0);
  const pulse = useSharedValue(1);
  useEffect(() => {
    needle.value = bearing;
  }, [bearing, needle]);
  return useMemo(() => ({ dial, needle, glow, pulse }), [dial, needle, glow, pulse]);
}

/**
 * Theme-derived colours every face shares. `ink` is always the dark end of the
 * scheme and `paper` the light end, so instrument art (night disk, engraving)
 * reads the same in light and dark mode.
 */
export function useFaceColors() {
  const { colors, tokens } = useThemeTokens();
  return useMemo(
    () => ({
      accent: colors.accent,
      accentText: colors.accentText,
      accentSoft: tokens.accentSoft,
      accentBorder: tokens.accentBorder,
      foreground: colors.foreground,
      muted: colors.mutedForeground,
      hairline: tokens.hairline,
      card: colors.card,
      surface: tokens.surfaceRaised,
      ink: tokens.isDark ? colors.background : colors.foreground,
      paper: tokens.isDark ? colors.foreground : colors.background,
      isDark: tokens.isDark,
    }),
    [colors, tokens],
  );
}

export type FaceColors = ReturnType<typeof useFaceColors>;

/** Dial numerals in the app language's digits (Arabic-Indic, Persian, …). */
export function useDialNumber(): (n: number) => string {
  const { i18n } = useTranslation();
  const format = useMemo(
    () => new Intl.NumberFormat(localeToBcp47(i18n.language || "en")),
    [i18n.language],
  );
  return useCallback((n: number) => format.format(n), [format]);
}

/** Dial label size that stays legible on thumbnails and doesn't balloon on TV. */
export function dialFont(size: number, ratio = 0.05, min = 7): number {
  return Math.max(min, Math.round(size * ratio));
}

type DialMarkerProps = {
  /** The square box the dial is drawn in (marker positions are relative to it). */
  size: number;
  /** Compass angle of the marker on the dial. */
  angle: number;
  /** Distance of the marker's centre from the dial centre. */
  radius: number;
  /** Square box the child is centred in. */
  box: number;
  motion: QiblaMotion;
  children: ReactNode;
};

/**
 * A child pinned on the dial at `angle` / `radius` that stays upright while the
 * dial turns. Positioned by rotation (never left/right) so RTL can't mirror it.
 */
export function DialMarker({ size, angle, radius, box, motion, children }: DialMarkerProps) {
  const upright = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-angle - motion.dial.value}deg` }],
  }));
  return (
    <View
      pointerEvents="none"
      style={[
        styles.rotator,
        { width: size, height: size, transform: [{ rotate: `${angle}deg` }] },
      ]}
    >
      <Animated.View
        style={[
          styles.markerBox,
          { marginTop: size / 2 - radius - box / 2, width: box, height: box },
          upright,
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

type DialTextProps = Omit<DialMarkerProps, "box" | "children"> & {
  text: string;
  color: string;
  fontSize: number;
  bold?: boolean;
  backdrop?: string;
  style?: TextStyle;
};

/** An upright dial label (cardinal letter, degree numeral). */
export function DialText({
  text,
  color,
  fontSize,
  bold = false,
  backdrop,
  style,
  ...marker
}: DialTextProps) {
  return (
    <DialMarker {...marker} box={Math.round(fontSize * 2.6)}>
      <View
        style={[
          styles.textWrap,
          backdrop ? { backgroundColor: backdrop, paddingHorizontal: fontSize * 0.3 } : null,
        ]}
      >
        <ThemedText
          allowFontScaling={false}
          weight={bold ? "bold" : "medium"}
          style={[
            { color, fontSize, lineHeight: Math.round(fontSize * 1.25), letterSpacing: 0.3 },
            style,
          ]}
        >
          {text}
        </ThemedText>
      </View>
    </DialMarker>
  );
}

/** Translated N / E / S / W, upright on the dial; `skip` hides the one under the Kaaba. */
export function CardinalLabels({
  size,
  radius,
  motion,
  fontSize,
  northColor,
  color,
  backdrop,
  skip,
}: {
  size: number;
  radius: number;
  motion: QiblaMotion;
  fontSize: number;
  northColor: string;
  color: string;
  backdrop?: string;
  skip?: (angle: number) => boolean;
}) {
  const { t } = useTranslation();
  return (
    <>
      {CARDINALS.map(({ key, angle }) =>
        skip?.(angle) ? null : (
          <DialText
            key={key}
            size={size}
            angle={angle}
            radius={radius}
            motion={motion}
            text={t(`qibla.${key}`)}
            color={angle === 0 ? northColor : color}
            fontSize={fontSize}
            bold
            backdrop={backdrop}
          />
        ),
      )}
    </>
  );
}

/** A small isometric Kaaba with its gold band and door (constant colours, any surface). */
export function KaabaGlyph({ size }: { size: number }) {
  const k = QiblaInstrument.kaaba;
  const gold = QiblaInstrument.kiswahBand;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Polygon points="3,7 10,4.6 21,6.6 14,9" fill={k} fillOpacity={0.78} />
      <Polygon points="3,7 14,9 14,21 3,19" fill={k} />
      <Polygon points="14,9 21,6.6 21,18.6 14,21" fill={k} fillOpacity={0.88} />
      <Polygon points="3,10.2 14,12.2 14,13.8 3,11.8" fill={gold} />
      <Polygon points="14,12.2 21,9.8 21,11.4 14,13.8" fill={gold} fillOpacity={0.85} />
      <Polygon points="9.2,14.6 11.6,15 11.6,19.6 9.2,19.2" fill={gold} fillOpacity={0.9} />
    </Svg>
  );
}

/** The Kaaba on the dial at the qibla bearing, upright, optionally on a round badge. */
export function KaabaMarker({
  size,
  bearing,
  radius,
  glyph,
  motion,
  badge,
  badgeBorder,
}: {
  size: number;
  bearing: number;
  radius: number;
  glyph: number;
  motion: QiblaMotion;
  badge?: string;
  badgeBorder?: string;
}) {
  const box = Math.round(glyph * (badge ? 1.55 : 1.1));
  return (
    <DialMarker size={size} angle={bearing} radius={radius} box={box} motion={motion}>
      <View
        style={[
          styles.kaabaBadge,
          badge
            ? {
                width: box,
                height: box,
                borderRadius: box / 2,
                backgroundColor: badge,
                borderColor: badgeBorder ?? "transparent",
                borderWidth: badgeBorder ? BorderWidth.thick : 0,
              }
            : null,
        ]}
      >
        <KaabaGlyph size={glyph} />
      </View>
    </DialMarker>
  );
}

/**
 * The fixed "your phone points here" marker at 12 o'clock — shown only with a
 * live compass (the dial turns under it).
 */
export function TopPointer({
  size,
  width,
  height,
  top,
  color,
  direction = "down",
}: {
  size: number;
  width: number;
  height: number;
  top: number;
  color: string;
  direction?: "up" | "down";
}) {
  const points =
    direction === "down"
      ? `0,0 ${fx(width)},0 ${fx(width / 2)},${fx(height)}`
      : `0,${fx(height)} ${fx(width)},${fx(height)} ${fx(width / 2)},0`;
  return (
    <View pointerEvents="none" style={[styles.rotator, { width: size, height: size }]}>
      <Svg width={width} height={height} style={{ marginTop: top }}>
        <Polygon points={points} fill={color} />
      </Svg>
    </View>
  );
}

/** Soft accent halo that brightens as the phone nears the qibla. */
export function AlignHalo({
  size,
  diameter,
  color,
  motion,
}: {
  size: number;
  diameter: number;
  color: string;
  motion: QiblaMotion;
}) {
  const style = useAnimatedStyle(() => ({ opacity: motion.glow.value }));
  const inset = (size - diameter) / 2;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.halo,
        {
          top: inset,
          start: inset,
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          borderColor: color,
          boxShadow: `0px 0px 22px ${withAlpha(color, 0.55)}`,
        },
        style,
      ]}
    />
  );
}

/** A full-stage layer that turns with the dial (artwork, labels, Kaaba marker). */
export function DialLayer({
  size,
  motion,
  children,
}: {
  size: number;
  motion: QiblaMotion;
  children: ReactNode;
}) {
  const dialStyle = useDialStyle(motion);
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.rotator, { width: size, height: size }, dialStyle]}
    >
      {children}
    </Animated.View>
  );
}

/** The face's square stage; a fixed LTR plane so SVG and markers never mirror. */
export function FaceStage({ size, children }: { size: number; children: ReactNode }) {
  return <View style={[styles.stage, { width: size, height: size }]}>{children}</View>;
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "center",
    writingDirection: "ltr",
  },
  rotator: {
    position: "absolute",
    top: 0,
    start: 0,
    alignItems: "center",
    pointerEvents: "none",
  },
  markerBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  kaabaBadge: {
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    borderWidth: BorderWidth.thick,
  },
});
