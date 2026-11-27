import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import { withAlpha } from "@/constants/theme";

import {
  AlignHalo,
  DialLayer,
  DialText,
  FaceStage,
  fx,
  KaabaGlyph,
  polar,
  useDialNumber,
  useFaceColors,
} from "./shared";
import type { QiblaFaceProps } from "./types";

/**
 * Minimal: one hairline ring, a single accent dot for the Kaaba and a large
 * number in the centre — the bearing without a compass, the degrees still to
 * turn with one. An accent arc on the ring traces the remaining turn.
 */
export default function MinimalFace({
  size,
  bearing,
  hasCompass,
  aligned,
  offsetDeg,
  motion,
  preview,
}: QiblaFaceProps) {
  const { t } = useTranslation();
  const c = useFaceColors();
  const num = useDialNumber();
  const half = size / 2;
  const ring = half - Math.max(3, size * 0.03);
  const dot = Math.max(3, size * 0.032);

  const art = useMemo(() => {
    const kaaba = polar(half, ring, bearing);
    const n1 = polar(half, ring - size * 0.02, 0);
    const n2 = polar(half, ring - size * 0.065, 0);
    return (
      <Svg width={size} height={size}>
        <Circle
          cx={half}
          cy={half}
          r={ring}
          stroke={withAlpha(c.foreground, 0.22)}
          strokeWidth={1.5}
          fill="none"
        />
        <Line
          x1={fx(n1.x)}
          y1={fx(n1.y)}
          x2={fx(n2.x)}
          y2={fx(n2.y)}
          stroke={c.foreground}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Circle cx={fx(kaaba.x)} cy={fx(kaaba.y)} r={fx(dot * 2)} fill={c.accentSoft} />
        <Circle cx={fx(kaaba.x)} cy={fx(kaaba.y)} r={fx(dot)} fill={c.accent} />
      </Svg>
    );
  }, [size, half, ring, dot, bearing, c]);

  // Remaining turn, drawn in screen space from 12 o'clock toward the qibla.
  const turnArc = useMemo(() => {
    if (!hasCompass || aligned || Math.abs(offsetDeg) < 1) return null;
    const from = polar(half, ring, 0);
    const to = polar(half, ring, offsetDeg);
    const sweep = offsetDeg > 0 ? 1 : 0;
    return `M ${fx(from.x)} ${fx(from.y)} A ${fx(ring)} ${fx(ring)} 0 0 ${sweep} ${fx(to.x)} ${fx(to.y)}`;
  }, [hasCompass, aligned, offsetDeg, half, ring]);

  const big = Math.round(size * (preview ? 0.2 : 0.17));
  const value = hasCompass ? Math.round(Math.abs(offsetDeg)) : Math.round(bearing);

  return (
    <FaceStage size={size}>
      <AlignHalo size={size} diameter={ring * 2} color={c.accent} motion={motion} />
      <DialLayer size={size} motion={motion}>
        {art}
        {preview ? null : (
          <DialText
            size={size}
            angle={0}
            radius={ring - size * 0.11}
            motion={motion}
            text={t("qibla.cardinalN")}
            color={c.muted}
            fontSize={Math.round(size * 0.045)}
            bold
          />
        )}
      </DialLayer>
      <View pointerEvents="none" style={[styles.fixed, { width: size, height: size }]}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          {turnArc ? (
            <Path d={turnArc} stroke={c.accent} strokeWidth={3} strokeLinecap="round" fill="none" />
          ) : null}
          {hasCompass ? (
            <Line
              x1={half}
              y1={fx(half - ring - size * 0.035)}
              x2={half}
              y2={fx(half - ring + size * 0.035)}
              stroke={aligned ? c.accent : c.foreground}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          ) : null}
        </Svg>
        {hasCompass && aligned ? (
          <KaabaGlyph size={Math.round(size * 0.22)} />
        ) : (
          <View style={styles.readout}>
            <ThemedText
              allowFontScaling={false}
              weight="regular"
              style={{
                color: aligned ? c.accentText : c.foreground,
                fontSize: big,
                lineHeight: Math.round(big * 1.15),
                letterSpacing: -1,
                fontVariant: ["tabular-nums"],
              }}
            >
              {`${num(value)}°`}
            </ThemedText>
            {preview || hasCompass ? null : (
              <ThemedText type="caption" themeColor="mutedForeground" allowFontScaling={false}>
                {t("qibla.bearingLabel")}
              </ThemedText>
            )}
          </View>
        )}
      </View>
    </FaceStage>
  );
}

const styles = StyleSheet.create({
  fixed: {
    position: "absolute",
    top: 0,
    start: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  readout: {
    alignItems: "center",
  },
});
