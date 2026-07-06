import { StyleSheet, View } from "react-native";

type NewYearArtProps = {
  color: string;
  starColor: string;
  glowColor: string;
};

/** Rising crescent and quiet stars for the Islamic New Year banner. */
export function NewYearArt({ color, starColor, glowColor }: NewYearArtProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.glow, { backgroundColor: glowColor }]} />
      <View style={styles.horizon} />
      <View style={styles.crescentWrap}>
        <View style={[styles.crescent, { backgroundColor: color }]} />
        <View style={[styles.crescentCut, { backgroundColor: glowColor }]} />
      </View>
      {STARS.map((star) => (
        <View
          key={`${star.left}-${star.top}`}
          style={[
            styles.star,
            {
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              backgroundColor: starColor,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const STARS = [
  { left: "72%", top: 20, size: 2, opacity: 0.55 },
  { left: "84%", top: 36, size: 1.5, opacity: 0.45 },
  { left: "78%", top: 52, size: 2, opacity: 0.6 },
] as const;

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    pointerEvents: "none",
  },
  glow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.25,
    right: 20,
    bottom: 10,
  },
  horizon: {
    position: "absolute",
    right: -10,
    bottom: 24,
    width: 160,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 1,
  },
  crescentWrap: {
    position: "absolute",
    right: 40,
    bottom: 26,
    width: 48,
    height: 48,
  },
  crescent: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  crescentCut: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
    top: -2,
    left: 12,
    opacity: 0.9,
  },
  star: { position: "absolute" },
});
