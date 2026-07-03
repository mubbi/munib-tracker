import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { Durations } from "@/constants/motion";

const PARTICLE_COUNT = 28;
const BURST_DURATION = Durations.slow + 280;
const MAX_DELAY = 100;
const CLEANUP_DURATION = BURST_DURATION + MAX_DELAY + 80;

type ParticleConfig = {
  angle: number;
  distance: number;
  size: number;
  color: string;
  delay: number;
  shape: "rect" | "dot";
};

function seededValue(seed: number, multiplier: number, max: number) {
  return (seed * multiplier) % max;
}

function createParticles(key: number, colors: string[]): ParticleConfig[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const seed = key * 1000 + i;
    return {
      angle: (360 / PARTICLE_COUNT) * i + seededValue(seed, 17, 36) - 18,
      distance: 72 + seededValue(seed, 31, 56),
      size: 5 + seededValue(seed, 13, 7),
      color: colors[i % colors.length] ?? colors[0] ?? "#D4AF37",
      delay: seededValue(seed, 7, 100),
      shape: i % 3 === 0 ? "dot" : "rect",
    };
  });
}

function ConfettiParticle({ config }: { config: ParticleConfig }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(
      config.delay,
      withTiming(1, { duration: BURST_DURATION, easing: Easing.out(Easing.cubic) }),
    );
  }, [config, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const rad = (config.angle * Math.PI) / 180;
    const x = Math.cos(rad) * config.distance * p;
    const y = Math.sin(rad) * config.distance * p - 28 * p;
    return {
      opacity: p < 0.7 ? 1 - p * 0.3 : Math.max(0, (1 - p) / 0.3) * 0.79,
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${config.angle + p * 220}deg` },
        { scale: 1 - p * 0.35 },
      ],
    };
  });

  const particleStyle =
    config.shape === "dot"
      ? { width: config.size, height: config.size, borderRadius: config.size / 2 }
      : { width: config.size, height: config.size * 0.55, borderRadius: 2 };

  return (
    <Animated.View
      style={[styles.particle, particleStyle, { backgroundColor: config.color }, style]}
    />
  );
}

type PartyPopperProps = {
  burstKey: number;
  colors: string[];
};

export function PartyPopper({ burstKey, colors }: PartyPopperProps) {
  const reducedMotion = useReducedMotion();
  const [activeKey, setActiveKey] = useState(0);
  const particles = useMemo(
    () => (activeKey > 0 ? createParticles(activeKey, colors) : []),
    [activeKey, colors],
  );

  useEffect(() => {
    if (burstKey === 0) return;
    setActiveKey(burstKey);
    const timeout = setTimeout(() => setActiveKey(0), CLEANUP_DURATION);
    return () => clearTimeout(timeout);
  }, [burstKey]);

  if (reducedMotion || activeKey === 0 || particles.length === 0) return null;

  return (
    <View style={styles.container}>
      {particles.map((particle, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative burst, never reordered
        <ConfettiParticle key={`${activeKey}-${index}`} config={particle} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    pointerEvents: "none",
    zIndex: 2,
  },
  particle: {
    position: "absolute",
  },
});
