import type { WeatherEffectKind } from "@munib-tracker/shared/types";
import { useEffect, useMemo } from "react";
import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { CloudGraphic } from "@/components/weather/cloud-graphic";
import {
  type CloudPartSpec,
  type CloudSize,
  type CloudVariant,
  cloudFrame,
  cloudPlacementsFor,
  generateCumulusCloud,
} from "@/components/weather/cloud-shape";
import { createShadow } from "@/constants/theme";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { gradientBackground } from "@/lib/gradient";

/** Global scale — keeps location, clock, and prayer row legible over the hero. */
const EFFECTS_MASTER_OPACITY = 0.62;

type HeroWeatherEffectsProps = {
  effects: WeatherEffectKind[];
};

type CloudConfig = {
  id: number;
  top: string;
  left: string;
  scale: number;
  variant: CloudVariant;
  opacity: number;
  duration: number;
  offset: number;
  drift: number;
  size: CloudSize;
  parts: CloudPartSpec[];
};

/** Deterministic pseudo-random in [0, 1) for stable particle placement. */
function seed(index: number, salt: number): number {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function cloudConfigsFor(effects: WeatherEffectKind[]): CloudConfig[] {
  const storm = effects.includes("thunderstorm");
  const rain = effects.includes("rain");
  const cloudy = effects.includes("cloudy");
  const variant: CloudVariant = storm || rain ? "storm" : cloudy ? "medium" : "light";
  const baseOpacity = storm ? 0.72 : cloudy ? 0.68 : 0.58;

  const partlyCloudy =
    effects.includes("partly_cloudy") && !cloudy && !rain && !storm && !effects.includes("snow");

  const heavy = cloudy || rain || storm || effects.includes("snow");
  const overcast = cloudy && !rain && !storm && !effects.includes("snow");

  return cloudPlacementsFor({ partlyCloudy, heavy, cloudy: overcast, baseOpacity }).map(
    (placement) => ({
      id: placement.id,
      top: placement.top,
      left: placement.left,
      scale: placement.scale,
      variant,
      opacity: placement.opacity,
      duration: placement.duration,
      offset: placement.offset,
      drift: placement.drift,
      size: placement.size,
      parts: generateCumulusCloud(placement.id, placement.size),
    }),
  );
}

const RAIN_DROPS = Array.from({ length: 42 }, (_, index) => ({
  left: `${seed(index, 1) * 100}%`,
  delay: seed(index, 2) * 1400,
  duration: 700 + seed(index, 3) * 600,
  opacity: 0.15 + seed(index, 4) * 0.22,
  length: 14 + seed(index, 13) * 12,
}));

const SNOW_FLAKES = Array.from({ length: 26 }, (_, index) => ({
  left: `${seed(index, 5) * 100}%`,
  delay: seed(index, 6) * 1800,
  duration: 3200 + seed(index, 7) * 2200,
  size: 3 + seed(index, 8) * 4,
}));

const WIND_STREAKS = Array.from({ length: 14 }, (_, index) => ({
  top: `${6 + seed(index, 9) * 78}%`,
  delay: seed(index, 10) * 1200,
  duration: 1200 + seed(index, 11) * 800,
  width: 36 + seed(index, 12) * 52,
}));

/**
 * Non-interactive weather overlays for the home hero gradient.
 * Sits above the readability scrim; hero text uses a higher z-index.
 */
export function HeroWeatherEffects({ effects }: HeroWeatherEffectsProps) {
  const reducedMotion = useHydrationSafeReducedMotion();
  const cloudConfigs = useMemo(() => cloudConfigsFor(effects), [effects]);

  const showRain = effects.includes("rain") || effects.includes("thunderstorm");
  const showSnow = effects.includes("snow");
  const showClouds =
    effects.includes("cloudy") ||
    effects.includes("partly_cloudy") ||
    effects.includes("rain") ||
    effects.includes("snow") ||
    effects.includes("thunderstorm");
  const showClear = effects.includes("clear");
  const showFog = effects.includes("fog");
  const showWind = effects.includes("windy");
  const showThunder = effects.includes("thunderstorm");

  if (reducedMotion || effects.length === 0) return null;

  return (
    <View style={[styles.root, { opacity: EFFECTS_MASTER_OPACITY, pointerEvents: "none" }]}>
      {showClear ? <SunShimmer /> : null}
      {showClouds ? <CloudLayer configs={cloudConfigs} /> : null}
      {showFog ? <FogLayer /> : null}
      {showWind ? <WindLayer /> : null}
      {showRain ? <RainLayer /> : null}
      {showSnow ? <SnowLayer /> : null}
      {showThunder ? <ThunderFlash /> : null}
    </View>
  );
}

function SunShimmer() {
  const pulse = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    drift.value = withRepeat(
      withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [pulse, drift]);

  const rayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.1, 0.24]),
    transform: [
      { scale: interpolate(pulse.value, [0, 1], [1, 1.1]) },
      { rotate: `${interpolate(drift.value, [0, 1], [-8, 8])}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.08, 0.18]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.96, 1.1]) }],
  }));

  const bandStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.04, 0.1]),
    transform: [{ translateX: interpolate(drift.value, [0, 1], [-12, 12]) }],
  }));

  return (
    <>
      <Animated.View
        style={[
          styles.sunGlow,
          glowStyle,
          gradientBackground(
            "radial-gradient(circle at 68% 14%, rgba(255, 244, 210, 0.45) 0%, rgba(255, 236, 179, 0.16) 34%, rgba(255, 236, 179, 0) 68%)",
          ),
        ]}
      />
      <Animated.View
        style={[
          styles.sunBand,
          bandStyle,
          gradientBackground(
            "linear-gradient(115deg, rgba(255, 255, 255, 0) 18%, rgba(255, 248, 220, 0.22) 48%, rgba(255, 255, 255, 0) 78%)",
          ),
        ]}
      />
      <Animated.View
        style={[
          styles.sunRays,
          rayStyle,
          gradientBackground(
            "conic-gradient(from 205deg at 68% 14%, rgba(255, 250, 230, 0) 0deg, rgba(255, 250, 230, 0.28) 24deg, rgba(255, 250, 230, 0) 48deg, rgba(255, 250, 230, 0.22) 88deg, rgba(255, 250, 230, 0) 120deg, rgba(255, 250, 230, 0.16) 168deg, rgba(255, 250, 230, 0) 360deg)",
          ),
        ]}
      />
    </>
  );
}

function CloudLayer({ configs }: { configs: CloudConfig[] }) {
  return (
    <>
      {configs.map((cloud) => (
        <DriftingCloud key={`cloud-${cloud.id}`} {...cloud} />
      ))}
    </>
  );
}

function DriftingCloud({
  top,
  left,
  scale,
  variant,
  opacity,
  duration,
  offset,
  drift,
  parts,
}: CloudConfig) {
  const motion = useSharedValue(0);

  useEffect(() => {
    motion.value = withDelay(
      offset,
      withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [motion, duration, offset]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(motion.value, [0, 1], [-drift, drift]) },
      { translateY: interpolate(motion.value, [0, 1], [2, -4]) },
    ],
  }));

  const baseWidth = 148 * scale;
  const frame = cloudFrame(baseWidth, parts);

  return (
    <Animated.View
      style={[
        styles.cloudHost,
        style,
        {
          top: top as ViewStyle["top"],
          left: left as ViewStyle["left"],
          width: frame.width,
          height: frame.height,
          opacity,
        },
      ]}
    >
      <CloudGraphic
        width={frame.width}
        height={frame.height}
        baseWidth={baseWidth}
        parts={parts}
        variant={variant}
        offsetX={frame.offsetX}
        offsetY={frame.offsetY}
      />
    </Animated.View>
  );
}

function FogLayer() {
  const breath = useSharedValue(0);
  const drift = useSharedValue(0);

  useEffect(() => {
    breath.value = withRepeat(
      withTiming(1, { duration: 6800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    drift.value = withRepeat(
      withTiming(1, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [breath, drift]);

  const veilStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breath.value, [0, 1], [0.1, 0.2]),
  }));

  const bankStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breath.value, [0, 1], [0.06, 0.14]),
    transform: [{ translateX: interpolate(drift.value, [0, 1], [-18, 18]) }],
  }));

  return (
    <>
      <Animated.View
        style={[
          styles.fill,
          veilStyle,
          gradientBackground(
            "linear-gradient(180deg, rgba(236, 242, 248, 0.28) 0%, rgba(236, 242, 248, 0.1) 38%, rgba(236, 242, 248, 0.18) 100%)",
          ),
        ]}
      />
      <Animated.View
        style={[
          styles.fogBank,
          bankStyle,
          gradientBackground(
            "radial-gradient(ellipse 120% 80% at 50% 40%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 72%)",
          ),
        ]}
      />
      <Animated.View
        style={[
          styles.fogBankLower,
          bankStyle,
          gradientBackground(
            "radial-gradient(ellipse 100% 70% at 40% 60%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%)",
          ),
        ]}
      />
    </>
  );
}

function WindLayer() {
  return (
    <View style={styles.windField}>
      {WIND_STREAKS.map((streak, index) => (
        <WindStreak key={`wind-${index}`} {...streak} />
      ))}
    </View>
  );
}

function WindStreak({ top, delay, duration, width }: (typeof WIND_STREAKS)[number]) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false),
    );
  }, [delay, duration, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.12, 0.88, 1], [0, 0.26, 0.26, 0]),
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-width - 40, 380]) },
      { scaleX: interpolate(progress.value, [0, 0.5, 1], [0.6, 1, 0.85]) },
    ],
  }));

  return (
    <Animated.View style={[styles.windStreak, { top: top as ViewStyle["top"], width }, style]} />
  );
}

function RainLayer() {
  return (
    <View style={styles.precipField}>
      {RAIN_DROPS.map((drop, index) => (
        <RainDrop key={`rain-${index}`} {...drop} />
      ))}
    </View>
  );
}

function RainDrop({ left, delay, duration, opacity, length }: (typeof RAIN_DROPS)[number]) {
  const fall = useSharedValue(-40);

  useEffect(() => {
    fall.value = withDelay(
      delay,
      withRepeat(withTiming(460, { duration, easing: Easing.linear }), -1, false),
    );
  }, [delay, duration, fall]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: fall.value }],
  }));

  return (
    <Animated.View
      style={[styles.rainDrop, { left: left as ViewStyle["left"], opacity, height: length }, style]}
    />
  );
}

function SnowLayer() {
  return (
    <View style={styles.precipField}>
      {SNOW_FLAKES.map((flake, index) => (
        <SnowFlake key={`snow-${index}`} {...flake} />
      ))}
    </View>
  );
}

function SnowFlake({ left, delay, duration, size }: (typeof SNOW_FLAKES)[number]) {
  const fall = useSharedValue(-24);
  const sway = useSharedValue(0);

  useEffect(() => {
    fall.value = withDelay(
      delay,
      withRepeat(withTiming(460, { duration, easing: Easing.linear }), -1, false),
    );
    sway.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: duration * 0.65, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
  }, [delay, duration, fall, sway]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: fall.value },
      { translateX: interpolate(sway.value, [0, 1], [-10, 10]) },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.snowFlake,
        {
          left: left as ViewStyle["left"],
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    />
  );
}

function ThunderFlash() {
  const flash = useSharedValue(0);

  useEffect(() => {
    flash.value = withRepeat(
      withSequence(
        withDelay(3800, withTiming(1, { duration: 70 })),
        withTiming(0, { duration: 180 }),
        withDelay(5200, withTiming(0.85, { duration: 50 })),
        withTiming(0, { duration: 160 }),
      ),
      -1,
      false,
    );
  }, [flash]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(flash.value, [0, 1], [0, 0.18]),
  }));

  return <Animated.View style={[styles.fill, styles.thunderFlash, style]} />;
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    zIndex: 2,
  },
  fill: {
    ...StyleSheet.absoluteFill,
  },
  sunGlow: {
    position: "absolute",
    top: -48,
    right: -28,
    width: "78%",
    height: "62%",
  },
  sunBand: {
    position: "absolute",
    top: "6%",
    left: "-10%",
    width: "120%",
    height: "38%",
  },
  sunRays: {
    position: "absolute",
    top: -72,
    right: -48,
    width: "82%",
    height: "72%",
  },
  cloudHost: {
    position: "absolute",
  },
  fogBank: {
    position: "absolute",
    top: "8%",
    left: "-10%",
    width: "120%",
    height: "42%",
  },
  fogBankLower: {
    position: "absolute",
    top: "34%",
    left: "-8%",
    width: "116%",
    height: "36%",
  },
  windField: {
    ...StyleSheet.absoluteFill,
    transform: [{ rotate: "-8deg" }],
  },
  precipField: {
    ...StyleSheet.absoluteFill,
    transform: [{ rotate: "-16deg" }],
  },
  windStreak: {
    position: "absolute",
    left: 0,
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.32)",
  },
  rainDrop: {
    position: "absolute",
    top: -32,
    width: 2,
    borderRadius: 999,
    backgroundColor: "rgba(186, 220, 255, 0.5)",
  },
  snowFlake: {
    position: "absolute",
    top: -20,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    ...createShadow("#FFFFFF", {
      blur: 3,
      opacity: 0.35,
      elevation: Platform.OS === "android" ? 0 : 2,
    }),
  },
  thunderFlash: {
    backgroundColor: "#FFFFFF",
  },
});
