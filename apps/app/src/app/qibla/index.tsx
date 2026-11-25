import { haversineKm } from "@munib-tracker/shared/utils";
import { Coordinates, Qibla } from "adhan";
import * as Location from "expo-location";
import { type Href, useRouter } from "expo-router";
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
import { QiblaFace } from "@/components/qibla/faces/qibla-face";
import type { QiblaMotion } from "@/components/qibla/faces/types";
import { QiblaStyleSheet } from "@/components/qibla/qibla-style-sheet";
import { QiblaTurnIcon } from "@/components/qibla/qibla-turn-icon";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Pill } from "@/components/ui/pill";
import { Stagger } from "@/components/ui/stagger";
import { BorderWidth, Breakpoints, Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { gradientBackground } from "@/lib/gradient";
import { triggerHaptic } from "@/lib/haptics";
import { localeToBcp47 } from "@/lib/locale-bcp47";
import { getLocationPermissionGranted } from "@/lib/location";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { resolveQiblaCompassStyle } from "@/lib/qibla-compass-styles";
import {
  getQiblaTurnGuidance,
  type QiblaTurnKind,
  qiblaAlignmentProgress,
  qiblaArrowAngle,
} from "@/lib/qibla-guidance";
import { getRouteFaq } from "@/lib/seo/faq-content";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { faqSchema, webPageSchema } from "@/lib/seo/structured-data";
import { useSetting } from "@/lib/settings/use-setting";
import {
  locationStore,
  useLocation,
  useLocationActions,
  useLocationStatus,
} from "@/stores/location-store";

const KAABA = { lat: 21.4225, lng: 39.8262 };

const ALIGN_THRESHOLD = 5;
const SMOOTHING = 0.15;
/** Earth's magnetic field strength range (µT) — outside it the magnetometer is disturbed. */
const EARTH_FIELD_MIN_UT = 20;
const EARTH_FIELD_MAX_UT = 75;

function smoothHeading(prev: number, next: number, alpha: number): number {
  const delta = ((next - prev + 540) % 360) - 180;
  return (prev + alpha * delta + 360) % 360;
}

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

function magnetometerHeading(x: number, y: number): number {
  const primary = Platform.OS === "android" ? Math.atan2(-x, y) : Math.atan2(y, x);
  return (primary * (180 / Math.PI) + 360) % 360;
}

export default function QiblaScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const reducedMotion = useReducedMotion();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const tv = isTV();
  const location = useLocation();
  const locationStatus = useLocationStatus();
  const { requestDeviceLocation } = useLocationActions();

  const bearing = useMemo(
    () => Qibla(new Coordinates(location.latitude, location.longitude)),
    [location.latitude, location.longitude],
  );
  const distance = useMemo(
    () =>
      Math.round(
        haversineKm(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: KAABA.lat, longitude: KAABA.lng },
        ),
      ),
    [location.latitude, location.longitude],
  );
  const locationError = useMemo(() => {
    if (locationStatus === "denied" && location.source !== "manual") {
      return "qibla.locationDenied" as const;
    }
    if (locationStatus === "error" && location.source === "default") {
      return "qibla.locationError" as const;
    }
    return null;
  }, [location.source, locationStatus]);

  const [heading, setHeading] = useState(0);
  const [hasCompass, setHasCompass] = useState(false);
  const [hasTrueNorth, setHasTrueNorth] = useState(false);
  /** 0 uncalibrated … 3 high, from the heading API; null when the sensor reports none. */
  const [headingAccuracy, setHeadingAccuracy] = useState<number | null>(null);
  const [, setAligned] = useState(false);

  // TV (landscape, ~540dp tall): size the dial from the height so the dial,
  // stats and the city/hint card all fit without scrolling past focusables.
  /** Desktop / wide web: dial beside an info aside (stats, location, hints). */
  const twoPane = !tv && windowWidth >= Breakpoints.wide;
  const dialSize = tv
    ? Math.round(Math.min(windowHeight * 0.42, windowWidth * 0.3))
    : twoPane
      ? windowWidth >= 1280
        ? 400
        : 340
      : Math.min(windowWidth - Spacing.four * 2, 320);
  /** Stage = dial + the classic ring's 12dp gutter on each side. */
  const stageSize = dialSize + 24;
  const compassStyle = resolveQiblaCompassStyle(
    useSetting<string>("appearance.qiblaCompass").value,
  );
  const [styleOpen, setStyleOpen] = useState(false);

  const smoothedRef = useRef(0);
  const rotation = useSharedValue(0);
  const dialRotation = useSharedValue(0);
  const lastArrowRef = useRef(0);
  const lastDialRef = useRef(0);
  const pulse = useSharedValue(1);
  const chevronNudge = useSharedValue(0);
  const alignGlow = useSharedValue(0);

  useEffect(() => {
    // Silent refresh only — never prompt on screen mount. Permission is requested
    // from onboarding or the location picker when the user opts in.
    void (async () => {
      if (!(await getLocationPermissionGranted())) return;
      if (location.source === "manual") return;
      await requestDeviceLocation();
    })();
  }, [location.source, requestDeviceLocation]);

  const applyHeading = useCallback((raw: number) => {
    const smoothed = smoothHeading(smoothedRef.current, raw, SMOOTHING);
    smoothedRef.current = smoothed;
    setHeading(smoothed);
  }, []);

  useEffect(() => {
    if (Platform.OS === "web" || isTV()) return;

    let headingSub: Location.LocationSubscription | null = null;
    let magSub: { remove: () => void } | null = null;
    let cancelled = false;

    const startMagnetometer = async () => {
      const available = await Magnetometer.isAvailableAsync().catch(() => false);
      if (!available || cancelled) return;
      setHasCompass(true);
      setHasTrueNorth(false);
      Magnetometer.setUpdateInterval(100);
      magSub = Magnetometer.addListener((data) => {
        if (cancelled) return;
        // The raw magnetometer reports no accuracy; a field far outside Earth's
        // (~25–65 µT) means magnets or metal nearby, so say the reading is unreliable.
        const fieldStrength = Math.hypot(data.x, data.y, data.z);
        const disturbed =
          Number.isFinite(fieldStrength) &&
          (fieldStrength < EARTH_FIELD_MIN_UT || fieldStrength > EARTH_FIELD_MAX_UT);
        setHeadingAccuracy((prev) => {
          const next = disturbed ? 0 : null;
          return prev === next ? prev : next;
        });
        applyHeading(magnetometerHeading(data.x, data.y));
      });
    };

    void (async () => {
      // Android's expo-location removeWatchAsync historically rejected when
      // location was denied, even for compass watches. Prefer Location heading
      // (true north) only when already authorized; otherwise use magnetometer.
      const permitted = await getLocationPermissionGranted();
      if (cancelled) return;

      if (permitted) {
        try {
          headingSub = await Location.watchHeadingAsync((data) => {
            if (cancelled) return;
            const hasTrue = data.trueHeading != null && data.trueHeading >= 0;
            const value = hasTrue ? data.trueHeading : data.magHeading;
            if (value == null || Number.isNaN(value)) return;
            setHasCompass(true);
            setHasTrueNorth(hasTrue);
            setHeadingAccuracy(
              typeof data.accuracy === "number" && data.accuracy >= 0 ? data.accuracy : null,
            );
            applyHeading((value + 360) % 360);
          });
          if (cancelled) {
            headingSub.remove();
            headingSub = null;
            return;
          }
          return;
        } catch {
          // Fall through to magnetometer.
        }
      }

      await startMagnetometer();
    })();

    return () => {
      cancelled = true;
      try {
        headingSub?.remove();
      } catch {
        // Subscription.remove is sync; native rejections are swallowed in the
        // expo-location patch. Keep a local guard for unexpected sync throws.
      }
      magSub?.remove();
    };
  }, [applyHeading]);

  // Distance is translated and uses the app language's digits and separators (no hard-coded "km").
  const distanceText = useMemo(
    () =>
      t("qibla.distanceKm", {
        km: new Intl.NumberFormat(localeToBcp47(i18n.language || "en")).format(distance),
      }),
    [t, i18n.language, distance],
  );
  const approximate = location.source === "default";
  const accuracyLevel =
    headingAccuracy == null
      ? null
      : (["unreliable", "low", "medium", "high"] as const)[Math.min(3, headingAccuracy)];

  const arrowAngle = useMemo(() => qiblaArrowAngle(bearing, heading), [bearing, heading]);

  const guidance = useMemo(() => getQiblaTurnGuidance(arrowAngle, ALIGN_THRESHOLD), [arrowAngle]);
  const alignmentProgress = qiblaAlignmentProgress(guidance.absDeg);
  const isAligned = hasCompass && guidance.kind === "aligned";
  const showTurnGuidance = hasCompass;
  const chevron = turnChevron(guidance.kind);

  useEffect(() => {
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

  const motion = useMemo<QiblaMotion>(
    () => ({ dial: dialRotation, needle: rotation, glow: alignGlow, pulse }),
    [dialRotation, rotation, alignGlow, pulse],
  );

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: chevronNudge.value }],
  }));

  const guidanceA11y = showTurnGuidance
    ? isAligned
      ? t("qibla.aligned")
      : `${t(TURN_I18N[guidance.kind])}, ${t("qibla.degreesOff", { deg: guidance.absDeg })}`
    : undefined;

  const compassA11yLabel = useMemo(() => {
    const base = t("qibla.compassLabel");
    const value = t("qibla.compassValue", {
      bearing: Math.round(bearing),
      distance: distanceText,
    });
    return guidanceA11y ? `${base}. ${value}. ${guidanceA11y}` : `${base}. ${value}`;
  }, [t, bearing, distanceText, guidanceA11y]);

  const compassGradient = gradientBackground(
    `radial-gradient(circle at 50% 42%, ${withAlpha(colors.accent, tokens.isDark ? 0.18 : 0.12)} 0%, ${withAlpha(colors.card, 0)} 68%)`,
  );

  const guidanceCard = showTurnGuidance ? (
    <Card
      padding="four"
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
            <QiblaTurnIcon
              kind={guidance.kind}
              size={36}
              color={isAligned ? colors.accent : colors.foreground}
              backgroundColor={isAligned ? tokens.accentSoft : tokens.surfaceRaised}
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
  ) : null;

  const statsRow = (
    <View style={[styles.statsRow, tv && styles.statsRowTv]}>
      <View style={[styles.statBlock, { backgroundColor: tokens.surfaceRaised }]}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("qibla.bearingLabel")}
        </ThemedText>
        <ThemedText type="header">{Math.round(bearing)}°</ThemedText>
      </View>

      <View style={[styles.statBlock, { backgroundColor: tokens.surfaceRaised }]}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("qibla.distanceLabel")}
        </ThemedText>
        <ThemedText type="header">{distanceText}</ThemedText>
      </View>
    </View>
  );

  const compassCard = (
    <Card
      padding="four"
      style={[
        styles.compassCard,
        tv && styles.compassCardTv,
        compassGradient,
        approximate && styles.compassApproximate,
      ]}
    >
      {approximate ? (
        <Pill tone="warning" label={t("qibla.approximateBadge")} style={styles.approximatePill} />
      ) : null}
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={compassA11yLabel}
        accessibilityLiveRegion="polite"
        style={styles.compassStage}
      >
        <QiblaFace
          style={compassStyle}
          size={stageSize}
          bearing={bearing}
          hasCompass={hasCompass}
          aligned={isAligned}
          offsetDeg={hasCompass ? guidance.offsetDeg : 0}
          motion={motion}
          reduceMotion={reducedMotion}
        />
      </View>
      {accuracyLevel && hasCompass ? (
        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          accessibilityLiveRegion="polite"
          style={styles.accuracyLine}
        >
          {t("qibla.accuracyLine", { level: t(`qibla.accuracy.${accuracyLevel}`) })}
        </ThemedText>
      ) : null}
      {twoPane ? null : statsRow}
    </Card>
  );

  const defaultLocationCard =
    location.source === "default" ? (
      <Callout
        tone="warning"
        // TV: the hint card below owns the (preferred-focus) Set location button.
        {...(tv
          ? {}
          : {
              action: {
                label: t("qibla.setLocation"),
                onPress: () => router.push("/location" as Href),
              },
            })}
      >
        {t("qibla.defaultLocationHint")}
      </Callout>
    ) : null;

  const hintCard = tv ? (
    // TV: no compass / GPS — static bearing for the chosen city, plus a
    // focusable way to change it (the screen otherwise has no D-pad target).
    <Card variant="muted" style={styles.tvHintCard}>
      {location.label ? (
        <ThemedText type="smallBold" numberOfLines={1}>
          {location.label}
        </ThemedText>
      ) : null}
      <ThemedText type="small" themeColor="mutedForeground">
        {t("qibla.tvHint")}
      </ThemedText>
      {/* Always one focusable target with initial focus (B-40): "Set location"
          while on the fallback city, "Change location" otherwise. */}
      <Button
        label={location.source === "default" ? t("qibla.setLocation") : t("hero.changeLocation")}
        variant="secondary"
        icon={{ ios: "location.fill", android: "location_on", web: "location_on" }}
        preferredFocus
        onPress={() => router.push("/location" as Href)}
      />
    </Card>
  ) : !hasCompass ? (
    <Card variant="muted">
      <ThemedText type="small" themeColor="mutedForeground">
        {Platform.OS === "web" ? t("qibla.webHint") : t("qibla.noCompassHint")}
      </ThemedText>
    </Card>
  ) : (
    <Card variant="muted">
      <ThemedText type="small" themeColor="mutedForeground">
        {showTurnGuidance
          ? t("qibla.rotatePhone")
          : hasCompass && !hasTrueNorth
            ? t("qibla.noCompassHint")
            : t("qibla.calibrateHint")}
      </ThemedText>
    </Card>
  );

  // GPS retry is phone-only — TV uses the manual city picker above.
  const errorCard =
    locationError && !tv ? (
      <Callout
        tone="warning"
        action={{
          label: t("qibla.tryAgain"),
          onPress: () => {
            void locationStore.getState().requestDeviceLocation();
          },
        }}
      >
        {t(locationError)}
      </Callout>
    ) : null;

  return (
    <ScreenLayout
      maxContentWidth={twoPane ? 1320 : undefined}
      eyebrow={t("qibla.eyebrow")}
      title={t("settings.qibla")}
      subtitle={t("qibla.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
      trailing={
        <IconButton
          name={{ ios: "paintpalette", android: "palette", web: "palette" }}
          accessibilityLabel={t("qiblaStyles.openButton")}
          onPress={() => setStyleOpen(true)}
        />
      }
    >
      <Seo
        path="/qibla"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("actions.qibla"), path: "/qibla" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/qibla",
            name: "Qibla Direction Finder",
            description: "Find the qibla direction toward the Kaaba in Makkah from anywhere.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("actions.qibla"), path: "/qibla" },
            ],
          }),
          faqSchema(getRouteFaq("/qibla") ?? []),
        ]}
      />
      <Stagger>
        {twoPane ? (
          <View style={styles.split}>
            <View style={styles.primary}>
              {defaultLocationCard}
              {errorCard}
              {compassCard}
            </View>
            <View style={styles.aside}>
              {guidanceCard}
              <Card>{statsRow}</Card>
              {location.source !== "default" ? (
                <Card variant="muted" style={styles.locationCard}>
                  {location.label ? (
                    <View style={styles.locationRow}>
                      <SymbolView
                        name={{ ios: "location.fill", android: "location_on", web: "location_on" }}
                        size={16}
                        tintColor={colors.accent}
                      />
                      <ThemedText type="smallBold" numberOfLines={2} style={styles.locationLabel}>
                        {location.label}
                      </ThemedText>
                    </View>
                  ) : null}
                  <Button
                    label={t("hero.changeLocation")}
                    variant="secondary"
                    size="sm"
                    onPress={() => router.push("/location" as Href)}
                  />
                </Card>
              ) : null}
              {hintCard}
            </View>
          </View>
        ) : null}
        {/* Warnings come before the compass: a fallback city must not look like a fix. */}
        {twoPane ? null : defaultLocationCard}
        {twoPane ? null : errorCard}
        {twoPane ? null : guidanceCard}
        {twoPane ? null : compassCard}
        {twoPane ? null : hintCard}
      </Stagger>
      <QiblaStyleSheet visible={styleOpen} onClose={() => setStyleOpen(false)} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  split: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.four,
  },
  primary: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.three,
  },
  // A fallback city is approximate: the compass is dimmed (and badged) until a real fix.
  compassApproximate: { opacity: 0.6 },
  approximatePill: { alignSelf: "flex-start" },
  accuracyLine: { textAlign: "center", marginTop: Spacing.two },
  aside: {
    width: 360,
    maxWidth: "40%",
    gap: Spacing.three,
  },
  locationCard: {
    gap: Spacing.three,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  locationLabel: {
    flex: 1,
    minWidth: 0,
  },
  guidanceCard: {
    borderWidth: BorderWidth.thin,
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
  compassCardTv: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: Spacing.four,
  },
  compassStage: {
    alignItems: "center",
    justifyContent: "center",
  },

  statsRow: {
    flexDirection: "row",
    gap: Spacing.three,
    width: "100%",
    paddingHorizontal: Spacing.two,
  },
  statsRowTv: {
    flexDirection: "column",
    width: "auto",
    flex: 1,
    maxWidth: tvDp(360),
    paddingHorizontal: 0,
  },
  tvHintCard: {
    gap: Spacing.three,
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

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/qibla");
