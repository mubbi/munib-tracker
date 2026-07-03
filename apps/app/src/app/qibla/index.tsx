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
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";

const KAABA = { lat: 21.4225, lng: 39.8262 };

/** Within this many degrees of the qibla we consider the arrow "aligned". */
const ALIGN_THRESHOLD = 5;
/** Smoothing factor for the low-pass filter on raw heading samples (0..1). */
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

/**
 * Circular low-pass filter: blends the previous smoothed heading towards the new
 * raw sample along the SHORTEST arc so the 359°→0° seam never causes a spin or a
 * jitter spike. Returns a value normalised to [0, 360).
 */
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
  /** True once a heading source that resolves true north (not just magnetic) is live. */
  const [hasTrueNorth, setHasTrueNorth] = useState(false);
  const [, setAligned] = useState(false);

  // Responsive dial: cap at 320 but shrink to fit narrow screens with gutters.
  const dialSize = Math.min(windowWidth - Spacing.four * 2, 320);
  const needleGlyph = Math.round(dialSize * 0.3);

  // Latest smoothed heading, kept in a ref so the sensor callback filters from
  // the previous value without re-subscribing on every sample.
  const smoothedRef = useRef(0);

  // Continuous (unwrapped) rotation target for the needle. We accumulate deltas
  // along the shortest arc so withTiming never sweeps the long way round 0/360.
  const rotation = useSharedValue(0);
  const lastArrowRef = useRef(0);
  const pulse = useSharedValue(1);

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
    // The web has no device compass (expo-location/magnetometer heading APIs are
    // unsupported and only log warnings), so skip subscribing entirely — the UI
    // falls back to the static bearing + `qibla.webHint`.
    if (Platform.OS === "web") return;

    let headingSub: Location.LocationSubscription | null = null;
    let magSub: { remove: () => void } | null = null;
    let cancelled = false;

    void (async () => {
      // Preferred source: expo-location heading gives us TRUE north directly
      // (trueHeading), which matches the qibla bearing's frame of reference.
      // magHeading is magnetic-north only, so we avoid it when trueHeading is set.
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
        // Fall through to the raw magnetometer below.
      }

      // Fallback: raw magnetometer (magnetic north only, no true-north correction).
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

  // Signed angle of the arrow relative to "up" (0 = pointing at qibla), in (-180, 180].
  const arrowAngle = useMemo(() => {
    if (bearing == null) return 0;
    return ((bearing - heading + 540) % 360) - 180;
  }, [bearing, heading]);

  const isAligned = hasCompass && bearing != null && Math.abs(arrowAngle) < ALIGN_THRESHOLD;

  // Drive the needle: accumulate the shortest-arc delta onto a continuous value
  // so the spring/timing never unwinds through the 0/360 seam.
  useEffect(() => {
    if (bearing == null || !hasCompass) return;
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

  // Fire exactly one success haptic on ENTERING alignment; drive the pulse.
  useEffect(() => {
    setAligned((wasAligned) => {
      if (isAligned && !wasAligned) {
        triggerHaptic("success");
        if (!reducedMotion) {
          pulse.value = withRepeat(
            withSequence(
              withTiming(1.08, { duration: 420, easing: Easing.inOut(Easing.quad) }),
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

  const needleColor = isAligned ? colors.accent : colors.foreground;

  const compassA11yLabel = useMemo(() => {
    const base = t("qibla.compassLabel");
    if (bearing == null) return base;
    const value = t("qibla.compassValue", {
      bearing: Math.round(bearing),
      distance: distance != null ? t("qibla.distanceKm", { km: distance.toLocaleString() }) : "",
    });
    return isAligned ? `${base}. ${value}. ${t("qibla.aligned")}` : `${base}. ${value}`;
  }, [t, bearing, distance, isAligned]);

  return (
    <ScreenLayout
      eyebrow={t("qibla.eyebrow")}
      title={t("settings.qibla")}
      subtitle={t("qibla.subtitle")}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card style={styles.compassCard}>
          <View
            accessible
            accessibilityRole="image"
            accessibilityLabel={compassA11yLabel}
            accessibilityLiveRegion="polite"
            style={[
              styles.dial,
              {
                width: dialSize,
                height: dialSize,
                borderRadius: dialSize / 2,
                borderColor: isAligned ? tokens.accentBorder : tokens.hairline,
              },
            ]}
          >
            {/* Eight-point geometric tick star for the Islamic theme + subtle ring. */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const major = angle % 90 === 0;
              return (
                <View
                  key={angle}
                  style={[
                    styles.tick,
                    {
                      height: dialSize / 2,
                      transform: [{ rotate: `${angle}deg` }],
                      pointerEvents: "none",
                    },
                  ]}
                >
                  <View
                    style={{
                      width: major ? 3 : 2,
                      height: major ? 14 : 8,
                      borderRadius: 2,
                      backgroundColor: major ? tokens.accentBorder : tokens.hairline,
                    }}
                  />
                </View>
              );
            })}

            {/* Cardinal marks N/E/S/W. */}
            {CARDINALS.map(({ key, angle }) => (
              <View
                key={key}
                style={[
                  styles.cardinal,
                  {
                    height: dialSize,
                    transform: [{ rotate: `${angle}deg` }],
                    pointerEvents: "none",
                  },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={[
                    styles.cardinalLabel,
                    {
                      color: key === "cardinalN" ? colors.accent : colors.mutedForeground,
                      transform: [{ rotate: `${-angle}deg` }],
                    },
                  ]}
                >
                  {t(`qibla.${key}`)}
                </ThemedText>
              </View>
            ))}

            <Animated.View style={[styles.needle, needleStyle]}>
              <SymbolView
                name={{ ios: "location.north.fill", android: "navigation", web: "navigation" }}
                size={needleGlyph}
                tintColor={needleColor}
              />
            </Animated.View>

            <View style={[styles.kaaba, { backgroundColor: tokens.accentSoft }]}>
              <ThemedText type="caption" style={{ color: colors.accent }}>
                🕋
              </ThemedText>
            </View>
          </View>

          {bearing != null ? (
            <ThemedText type="header">{Math.round(bearing)}°</ThemedText>
          ) : (
            <ThemedText type="small" themeColor="mutedForeground">
              {error ? t(error) : t("qibla.locating")}
            </ThemedText>
          )}

          {isAligned ? (
            <ThemedText type="small" style={{ color: colors.accentText }}>
              {t("qibla.aligned")}
            </ThemedText>
          ) : null}

          {distance != null ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("qibla.distanceKm", { km: distance.toLocaleString() })}
            </ThemedText>
          ) : null}
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
              {hasCompass && !hasTrueNorth ? t("qibla.noCompassHint") : t("qibla.calibrateHint")}
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
  compassCard: {
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.five,
  },
  dial: {
    borderWidth: 2,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  tick: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 6,
  },
  cardinal: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Spacing.two,
  },
  cardinalLabel: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  needle: {
    alignItems: "center",
    justifyContent: "center",
  },
  kaaba: {
    position: "absolute",
    top: 10,
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
});
