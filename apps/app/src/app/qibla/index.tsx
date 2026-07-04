import { Coordinates, Qibla } from "adhan";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Magnetometer } from "expo-sensors";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { gradientBackground } from "@/lib/gradient";
import { triggerHaptic } from "@/lib/haptics";
import {
  getQiblaTurnGuidance,
  type QiblaTurnKind,
  qiblaAlignmentProgress,
  qiblaArrowAngle,
} from "@/lib/qibla-guidance";

const KAABA = { lat: 21.4225, lng: 39.8262 };

const ALIGN_THRESHOLD = 5;
const SMOOTHING = 0.15;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function smoothHeading(prev: number, next: number, alpha: number): number {
  const delta = ((next - prev + 540) % 360) - 180;
  return (prev + alpha * delta + 360) % 360;
}

const CARDINALS = [
  { key: "cardinalN", angle: 0 },
  { key: "cardinalE", angle: 90 },
  { key: "cardinalS", angle: 180 },
  { key: "cardinalW", angle: 270 },
] as const;

const TURN_I18N: Record<QiblaTurnKind, string> = {
  aligned: "qibla.aligned",
  fineTuneLeft: "qibla.turnFineTuneLeft",
  fineTuneRight: "qibla.turnFineTuneRight",
  slightLeft: "qibla.turnSlightLeft",
  slightRight: "qibla.turnSlightRight",
  left: "qibla.turnLeft",
  right: "qibla.turnRight",
};

function turnChevron(kind: QiblaTurnKind): "left" | "right" | "checkmark" | null {
  if (kind === "aligned") return "checkmark";
  if (kind.endsWith("Left")) return "left";
  if (kind.endsWith("Right")) return "right";
  return null;
}

type CompassFaceProps = {
  dialSize: number;
  bearing: number | null;
  /** When set, cardinal labels counter-rotate to stay upright while the dial spins. */
  heading?: number;
  tokens: ReturnType<typeof useThemeTokens>["tokens"];
  colors: ReturnType<typeof useThemeTokens>["colors"];
  t: ReturnType<typeof useTranslation>["t"];
};

/** Shared tick marks, cardinals, and Kaaba marker — rotators are dial-sized so pivots stay centered. */
function CompassFace({ dialSize, bearing, heading = 0, tokens, colors, t }: CompassFaceProps) {
  const labelCounter = heading;
  const kaabaSize = Math.round(dialSize * 0.15);
  const kaabaFontSize = Math.round(kaabaSize * 0.58);

  return (
    <>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const major = angle % 90 === 0;
        return (
          <View
            key={`tick-${angle}`}
            style={[
              styles.rotator,
              {
                width: dialSize,
                height: dialSize,
                transform: [{ rotate: `${angle}deg` }],
              },
            ]}
          >
            <View
              style={{
                marginTop: 8,
                width: major ? 3 : 2,
                height: major ? 14 : 8,
                borderRadius: 2,
                backgroundColor: major ? tokens.accentBorder : tokens.hairline,
              }}
            />
          </View>
        );
      })}

      {CARDINALS.map(({ key, angle }) => (
        <View
          key={key}
          style={[
            styles.rotator,
            {
              width: dialSize,
              height: dialSize,
              transform: [{ rotate: `${angle}deg` }],
            },
          ]}
        >
          <ThemedText
            type="caption"
            style={[
              styles.cardinalLabel,
              {
                marginTop: Spacing.two,
                color: key === "cardinalN" ? colors.accent : colors.mutedForeground,
                transform: [{ rotate: `${-angle + labelCounter}deg` }],
              },
            ]}
          >
            {t(`qibla.${key}`)}
          </ThemedText>
        </View>
      ))}

      {bearing != null ? (
        <View
          style={[
            styles.rotator,
            {
              width: dialSize,
              height: dialSize,
              transform: [{ rotate: `${bearing}deg` }],
            },
          ]}
        >
          <View
            style={[
              styles.qiblaBadge,
              {
                marginTop: 2,
                width: kaabaSize,
                height: kaabaSize,
                backgroundColor: tokens.accentSoft,
                borderColor: tokens.accentBorder,
                transform: [{ rotate: `${labelCounter - bearing}deg` }],
              },
            ]}
          >
            <ThemedText
              type="caption"
              style={{
                color: colors.accent,
                fontSize: kaabaFontSize,
                lineHeight: kaabaFontSize + 2,
              }}
            >
              🕋
            </ThemedText>
          </View>
        </View>
      ) : null}
    </>
  );
}

export default function QiblaScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const reducedMotion = useReducedMotion();
  const { width: windowWidth } = useWindowDimensions();

  const [bearing, setBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCompass, setHasCompass] = useState(false);
  const [hasTrueNorth, setHasTrueNorth] = useState(false);
  const [, setAligned] = useState(false);

  const dialSize = Math.min(windowWidth - Spacing.four * 2, 320);
  const needleGlyph = Math.round(dialSize * 0.26);

  const smoothedRef = useRef(0);
  const rotation = useSharedValue(0);
  const dialRotation = useSharedValue(0);
  const lastArrowRef = useRef(0);
  const lastDialRef = useRef(0);
  const pulse = useSharedValue(1);
  const chevronNudge = useSharedValue(0);
  const alignGlow = useSharedValue(0);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        if (mounted) setError("qibla.locationDenied");
        return;
      }
      try {
        const position = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = position.coords;
        if (!mounted) return;
        setBearing(Qibla(new Coordinates(latitude, longitude)));
        setDistance(haversineKm(latitude, longitude, KAABA.lat, KAABA.lng));
      } catch {
        if (mounted) setError("qibla.locationError");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const applyHeading = useCallback((raw: number) => {
    const smoothed = smoothHeading(smoothedRef.current, raw, SMOOTHING);
    smoothedRef.current = smoothed;
    setHeading(smoothed);
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;

    let headingSub: Location.LocationSubscription | null = null;
    let magSub: { remove: () => void } | null = null;
    let cancelled = false;

    void (async () => {
      try {
        headingSub = await Location.watchHeadingAsync((data) => {
          if (cancelled) return;
          const hasTrue = data.trueHeading != null && data.trueHeading >= 0;
          const value = hasTrue ? data.trueHeading : data.magHeading;
          if (value == null || Number.isNaN(value)) return;
          setHasCompass(true);
          setHasTrueNorth(hasTrue);
          applyHeading((value + 360) % 360);
        });
        return;
      } catch {
        // Fall through to magnetometer.
      }

      const available = await Magnetometer.isAvailableAsync().catch(() => false);
      if (!available || cancelled) return;
      setHasCompass(true);
      setHasTrueNorth(false);
      Magnetometer.setUpdateInterval(100);
      magSub = Magnetometer.addListener((data) => {
        if (cancelled) return;
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        angle = (angle + 360) % 360;
        applyHeading(angle);
      });
    })();

    return () => {
      cancelled = true;
      headingSub?.remove();
      magSub?.remove();
    };
  }, [applyHeading]);

  const arrowAngle = useMemo(() => {
    if (bearing == null) return 0;
    return qiblaArrowAngle(bearing, heading);
  }, [bearing, heading]);

  const guidance = useMemo(() => getQiblaTurnGuidance(arrowAngle, ALIGN_THRESHOLD), [arrowAngle]);
  const alignmentProgress = qiblaAlignmentProgress(guidance.absDeg);
  const isAligned = hasCompass && bearing != null && guidance.kind === "aligned";
  const showTurnGuidance = hasCompass && bearing != null;
  const chevron = turnChevron(guidance.kind);

  useEffect(() => {
    if (bearing == null) return;
    if (!hasCompass) {
      rotation.value = bearing;
      lastArrowRef.current = bearing;
      return;
    }
    const target = (bearing - heading + 360) % 360;
    const delta = ((target - lastArrowRef.current + 540) % 360) - 180;
    const next = lastArrowRef.current + delta;
    lastArrowRef.current = next;
    if (reducedMotion) {
      rotation.value = next;
    } else {
      rotation.value = withTiming(next, { duration: 200, easing: Easing.out(Easing.cubic) });
    }
  }, [bearing, heading, hasCompass, reducedMotion, rotation]);

  useEffect(() => {
    if (!hasCompass) return;
    const target = -heading;
    const delta = ((target - lastDialRef.current + 540) % 360) - 180;
    const next = lastDialRef.current + delta;
    lastDialRef.current = next;
    if (reducedMotion) {
      dialRotation.value = next;
    } else {
      dialRotation.value = withTiming(next, { duration: 200, easing: Easing.out(Easing.cubic) });
    }
  }, [heading, hasCompass, reducedMotion, dialRotation]);

  useEffect(() => {
    alignGlow.value = withTiming(isAligned ? 1 : alignmentProgress * 0.55, {
      duration: reducedMotion ? 0 : 260,
      easing: Easing.out(Easing.quad),
    });
  }, [isAligned, alignmentProgress, reducedMotion, alignGlow]);

  useEffect(() => {
    if (showTurnGuidance && chevron && chevron !== "checkmark" && !reducedMotion) {
      chevronNudge.value = withRepeat(
        withSequence(
          withTiming(chevron === "left" ? -6 : 6, {
            duration: 520,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(0, { duration: 520, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      );
    } else {
      chevronNudge.value = withTiming(0, { duration: 120 });
    }
  }, [showTurnGuidance, chevron, reducedMotion, chevronNudge]);

  useEffect(() => {
    setAligned((wasAligned) => {
      if (isAligned && !wasAligned) {
        triggerHaptic("success");
        if (!reducedMotion) {
          pulse.value = withRepeat(
            withSequence(
              withTiming(1.06, { duration: 420, easing: Easing.inOut(Easing.quad) }),
              withTiming(1, { duration: 420, easing: Easing.inOut(Easing.quad) }),
            ),
            -1,
            true,
          );
        }
      } else if (!isAligned && wasAligned) {
        pulse.value = withTiming(1, { duration: 160 });
      }
      return isAligned;
    });
  }, [isAligned, reducedMotion, pulse]);

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: pulse.value }],
  }));

  const dialStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${dialRotation.value}deg` }],
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: chevronNudge.value }],
  }));

  const hairlineColor = tokens.hairline;
  const accentColor = colors.accent;

  const ringStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(alignGlow.value, [0, 1], [hairlineColor, accentColor]),
    shadowOpacity: alignGlow.value * 0.35,
  }));

  const guidanceA11y = showTurnGuidance
    ? isAligned
      ? t("qibla.aligned")
      : `${t(TURN_I18N[guidance.kind])}, ${t("qibla.degreesOff", { deg: guidance.absDeg })}`
    : undefined;

  const compassA11yLabel = useMemo(() => {
    const base = t("qibla.compassLabel");
    if (bearing == null) return base;
    const value = t("qibla.compassValue", {
      bearing: Math.round(bearing),
      distance: distance != null ? t("qibla.distanceKm", { km: distance.toLocaleString() }) : "",
    });
    return guidanceA11y ? `${base}. ${value}. ${guidanceA11y}` : `${base}. ${value}`;
  }, [t, bearing, distance, guidanceA11y]);

  const compassGradient = gradientBackground(
    `radial-gradient(circle at 50% 42%, ${withAlpha(colors.accent, tokens.isDark ? 0.18 : 0.12)} 0%, ${withAlpha(colors.card, 0)} 68%)`,
  );

  return (
    <ScreenLayout
      eyebrow={t("qibla.eyebrow")}
      title={t("settings.qibla")}
      subtitle={t("qibla.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Stagger>
        {showTurnGuidance ? (
          <Card
            style={[
              styles.guidanceCard,
              {
                backgroundColor: isAligned ? tokens.accentSoft : tokens.surfaceRaised,
                borderColor: isAligned ? tokens.accentBorder : tokens.hairline,
              },
            ]}
          >
            <View style={styles.guidanceRow}>
              {chevron ? (
                <Animated.View style={chevronStyle}>
                  <SymbolView
                    name={
                      chevron === "checkmark"
                        ? { ios: "checkmark.circle.fill", android: "check", web: "check" }
                        : chevron === "left"
                          ? {
                              ios: "chevron.left.circle.fill",
                              android: "arrow_back",
                              web: "arrow_back",
                            }
                          : {
                              ios: "chevron.right.circle.fill",
                              android: "arrow_forward",
                              web: "arrow_forward",
                            }
                    }
                    size={36}
                    tintColor={isAligned ? colors.accent : colors.foreground}
                  />
                </Animated.View>
              ) : null}
              <View style={styles.guidanceCopy}>
                <ThemedText
                  type="header"
                  style={{ color: isAligned ? colors.accentText : colors.foreground }}
                >
                  {t(TURN_I18N[guidance.kind])}
                </ThemedText>
                {isAligned ? (
                  <ThemedText type="small" themeColor="mutedForeground">
                    {t("qibla.alignedHint")}
                  </ThemedText>
                ) : (
                  <ThemedText type="small" themeColor="mutedForeground">
                    {t("qibla.degreesOff", { deg: guidance.absDeg })}
                  </ThemedText>
                )}
              </View>
            </View>
          </Card>
        ) : null}

        <Card style={[styles.compassCard, compassGradient]}>
          <View style={styles.compassStage}>
            <Animated.View
              accessible
              accessibilityRole="image"
              accessibilityLabel={compassA11yLabel}
              accessibilityLiveRegion="polite"
              style={[
                styles.dialOuter,
                ringStyle,
                {
                  width: dialSize + 24,
                  height: dialSize + 24,
                  borderRadius: (dialSize + 24) / 2,
                  shadowColor: colors.accent,
                },
              ]}
            >
              <View
                style={[
                  styles.dial,
                  {
                    width: dialSize,
                    height: dialSize,
                    borderRadius: dialSize / 2,
                    borderColor: tokens.hairline,
                    backgroundColor: withAlpha(colors.card, tokens.isDark ? 0.55 : 0.72),
                  },
                ]}
              >
                {hasCompass ? (
                  <Animated.View style={[styles.dialInner, dialStyle]}>
                    <CompassFace
                      dialSize={dialSize}
                      bearing={bearing}
                      heading={heading}
                      tokens={tokens}
                      colors={colors}
                      t={t}
                    />
                  </Animated.View>
                ) : (
                  <>
                    <CompassFace
                      dialSize={dialSize}
                      bearing={bearing}
                      tokens={tokens}
                      colors={colors}
                      t={t}
                    />

                    {bearing != null ? (
                      <Animated.View style={[styles.needle, needleStyle]}>
                        <SymbolView
                          name={{
                            ios: "location.north.fill",
                            android: "navigation",
                            web: "navigation",
                          }}
                          size={needleGlyph}
                          tintColor={colors.accent}
                        />
                      </Animated.View>
                    ) : null}
                  </>
                )}
              </View>

              {hasCompass ? (
                <View style={[styles.topPointer, { borderBottomColor: colors.accent }]} />
              ) : null}
            </Animated.View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statBlock, { backgroundColor: tokens.surfaceRaised }]}>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("qibla.bearingLabel")}
              </ThemedText>
              {bearing != null ? (
                <ThemedText type="header">{Math.round(bearing)}°</ThemedText>
              ) : (
                <ThemedText type="small" themeColor="mutedForeground">
                  {error ? t(error) : t("qibla.locating")}
                </ThemedText>
              )}
            </View>

            {distance != null ? (
              <View style={[styles.statBlock, { backgroundColor: tokens.surfaceRaised }]}>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("qibla.distanceLabel")}
                </ThemedText>
                <ThemedText type="header">{distance.toLocaleString()} km</ThemedText>
              </View>
            ) : null}
          </View>
        </Card>

        {!hasCompass && bearing != null ? (
          <Card variant="muted" padding="three">
            <ThemedText type="small" themeColor="mutedForeground">
              {Platform.OS === "web" ? t("qibla.webHint") : t("qibla.noCompassHint")}
            </ThemedText>
          </Card>
        ) : (
          <Card variant="muted" padding="three">
            <ThemedText type="small" themeColor="mutedForeground">
              {showTurnGuidance
                ? t("qibla.rotatePhone")
                : hasCompass && !hasTrueNorth
                  ? t("qibla.noCompassHint")
                  : t("qibla.calibrateHint")}
            </ThemedText>
          </Card>
        )}

        {error && bearing == null ? (
          <Button label={t("qibla.tryAgain")} onPress={() => router.replace("/qibla")} />
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  guidanceCard: {
    borderWidth: 1,
    borderCurve: "continuous",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  guidanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  guidanceCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  compassCard: {
    alignItems: "center",
    gap: Spacing.four,
    paddingVertical: Spacing.five,
    overflow: "hidden",
  },
  compassStage: {
    alignItems: "center",
    justifyContent: "center",
  },
  dialOuter: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderCurve: "continuous",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 18,
  },
  dial: {
    borderWidth: 1.5,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  dialInner: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  rotator: {
    position: "absolute",
    alignItems: "center",
    pointerEvents: "none",
  },
  cardinalLabel: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  needle: {
    alignItems: "center",
    justifyContent: "center",
  },
  qiblaBadge: {
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  topPointer: {
    position: "absolute",
    top: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.three,
    width: "100%",
    paddingHorizontal: Spacing.two,
  },
  statBlock: {
    flex: 1,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    gap: Spacing.half,
    alignItems: "center",
  },
});
