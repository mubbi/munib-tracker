import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, Keyframe } from "react-native-reanimated";

import { useSplashDismissal } from "@/hooks/use-splash-dismissal";
import i18n from "@/i18n";
import { useTheme } from "@/providers/theme-provider";

const DURATION = 300;

/**
 * Web cold-start overlay — covers hero/tabs until prefs hydrate and the first
 * destination (intro or home) paints. Indexing bots skip via `useSplashDismissal`.
 */
export function AnimatedSplashOverlay() {
  const { dismissed, opacity } = useSplashDismissal();
  const { colors } = useTheme();

  if (dismissed) {
    return null;
  }

  return (
    <Animated.View
      accessibilityRole="progressbar"
      accessibilityLabel={i18n.t("common.loadingRoute")}
      style={[
        styles.splashOverlay,
        { opacity, pointerEvents: "auto", backgroundColor: colors.background },
      ]}
    >
      <Image style={styles.splashImage} source={require("@/assets/images/munib-logo.png")} />
    </Animated.View>
  );
}

const logoKeyframe = new Keyframe({
  0: {
    opacity: 0,
  },
  60: {
    transform: [{ scale: 1.2 }],
    opacity: 0,
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(1.2),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: "-180deg" }, { scale: 0.8 }],
    opacity: 0,
  },
  [DURATION / 1000]: {
    transform: [{ rotateZ: "0deg" }, { scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(0.7),
  },
  100: {
    transform: [{ rotateZ: "7200deg" }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require("@/assets/images/logo-glow.png")} />
      </Animated.View>

      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require("@/assets/images/munib-logo.png")} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    zIndex: 1000,
    position: "absolute",
    top: 128 / 2 + 138,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    width: 201,
    height: 201,
    position: "absolute",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 128,
    height: 128,
  },
  image: {
    width: 128,
    height: 128,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  splashImage: {
    width: 280,
    height: 280,
  },
});
