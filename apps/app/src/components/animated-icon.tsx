import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, FadeOut, Keyframe } from "react-native-reanimated";

const SPLASH_FAILSAFE_MS = 2500;

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    void SplashScreen.hideAsync();

    const timer = setTimeout(() => {
      setVisible(false);
    }, SPLASH_FAILSAFE_MS);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Animated.View
      exiting={FadeOut.duration(450).easing(Easing.out(Easing.cubic))}
      onLayout={() => {
        setTimeout(() => setVisible(false), 500);
      }}
      style={styles.splashOverlay}
    >
      <Image style={styles.splashImage} source={require("@/assets/images/munib-logo.png")} />
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
  splashImage: {
    width: 280,
    height: 280,
  },
});
