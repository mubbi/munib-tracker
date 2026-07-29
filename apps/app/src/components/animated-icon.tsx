import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, Keyframe } from "react-native-reanimated";

import { useSplashDismissal } from "@/hooks/use-splash-dismissal";
import { useTheme } from "@/providers/theme-provider";

/**
 * Full-screen splash that stays mounted after fade-out.
 *
 * Unmounting this overlay (`return null`) during cold start races Android
 * `SwipeRefreshLayout` / overlay layout (home pull-to-refresh). That can fatal
 * with `getChildDrawingOrder() returned invalid index` (Sentry REACT-NATIVE-6).
 * Keep an inert host instead of removing the native child.
 *
 * Dismissal waits for prefs hydration + first destination paint (see
 * `useSplashDismissal`) so home tabs/hero never flash before intro.
 */
export function AnimatedSplashOverlay() {
  const { dismissed, opacity } = useSplashDismissal();
  const { colors } = useTheme();

  return (
    <Animated.View
      importantForAccessibility={dismissed ? "no-hide-descendants" : "yes"}
      accessibilityElementsHidden={dismissed}
      collapsable={false}
      style={[
        styles.splashOverlay,
        {
          opacity,
          pointerEvents: dismissed ? "none" : "auto",
          backgroundColor: dismissed ? "transparent" : colors.background,
        },
      ]}
    >
      {!dismissed ? (
        <Image style={styles.splashImage} source={require("@/assets/images/munib-logo.png")} />
      ) : null}
    </Animated.View>
  );
}

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: "0deg" }],
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

      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(600)}>
        <Image style={styles.image} source={require("@/assets/images/munib-logo.png")} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    zIndex: 100,
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
