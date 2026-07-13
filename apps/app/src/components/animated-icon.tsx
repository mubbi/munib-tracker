import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  Keyframe,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SPLASH_FAILSAFE_MS = 2500;
const SPLASH_FADE_MS = 450;

/**
 * Full-screen splash that stays mounted after fade-out.
 *
 * Unmounting this overlay (`return null`) during cold start races Android
 * `SwipeRefreshLayout` / overlay layout (home pull-to-refresh). That can fatal
 * with `getChildDrawingOrder() returned invalid index` (Sentry REACT-NATIVE-6).
 * Keep an inert host instead of removing the native child.
 */
export function AnimatedSplashOverlay() {
  const [dismissed, setDismissed] = useState(false);
  const opacity = useSharedValue(1);
  const fadingRef = useRef(false);

  useEffect(() => {
    void SplashScreen.hideAsync();

    const fadeOut = () => {
      if (fadingRef.current) return;
      fadingRef.current = true;
      opacity.value = withTiming(
        0,
        { duration: SPLASH_FADE_MS, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setDismissed)(true);
        },
      );
    };

    const failsafe = setTimeout(fadeOut, SPLASH_FAILSAFE_MS);
    const early = setTimeout(fadeOut, 500);

    return () => {
      clearTimeout(failsafe);
      clearTimeout(early);
    };
  }, [opacity]);

  return (
    <Animated.View
      pointerEvents={dismissed ? "none" : "auto"}
      importantForAccessibility={dismissed ? "no-hide-descendants" : "yes"}
      accessibilityElementsHidden={dismissed}
      collapsable={false}
      style={[styles.splashOverlay, { opacity }, dismissed ? styles.splashDismissed : null]}
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
    backgroundColor: "#152921",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  /** After fade: keep the native view mounted (stable child) but inert. */
  splashDismissed: {
    backgroundColor: "transparent",
  },
  splashImage: {
    width: 280,
    height: 280,
  },
});
