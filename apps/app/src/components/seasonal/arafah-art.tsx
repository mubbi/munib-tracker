import { StyleSheet, View } from "react-native";

type ArafahArtProps = {
  color: string;
  glowColor: string;
};

/** Mount Arafat horizon silhouette for the Day of Arafah. */
export function ArafahArt({ color, glowColor }: ArafahArtProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.sun, { backgroundColor: glowColor }]} />
      <View style={[styles.mountLeft, { borderBottomColor: color }]} />
      <View style={[styles.mountCenter, { borderBottomColor: color }]} />
      <View style={[styles.mountRight, { borderBottomColor: color }]} />
      <View style={[styles.ground, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    pointerEvents: "none",
  },
  sun: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.35,
    right: 40,
    top: 18,
  },
  mountLeft: {
    position: "absolute",
    right: 72,
    bottom: 28,
    width: 0,
    height: 0,
    borderLeftWidth: 36,
    borderRightWidth: 36,
    borderBottomWidth: 52,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    opacity: 0.55,
  },
  mountCenter: {
    position: "absolute",
    right: 28,
    bottom: 28,
    width: 0,
    height: 0,
    borderLeftWidth: 48,
    borderRightWidth: 48,
    borderBottomWidth: 72,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    opacity: 0.75,
  },
  mountRight: {
    position: "absolute",
    right: -8,
    bottom: 28,
    width: 0,
    height: 0,
    borderLeftWidth: 32,
    borderRightWidth: 32,
    borderBottomWidth: 44,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    opacity: 0.45,
  },
  ground: {
    position: "absolute",
    right: 0,
    bottom: 24,
    width: 160,
    height: 4,
    opacity: 0.3,
    borderRadius: 2,
  },
});
