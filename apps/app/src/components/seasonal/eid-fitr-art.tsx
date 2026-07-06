import { StyleSheet, View } from "react-native";

type EidFitrArtProps = {
  color: string;
  starColor: string;
  glowColor: string;
};

/** Festive crescent, stars, and sparkles for Eid al-Fitr. */
export function EidFitrArt({ color, starColor, glowColor }: EidFitrArtProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.glow, { backgroundColor: glowColor }]} />
      <View style={styles.crescentWrap}>
        <View style={[styles.crescent, { backgroundColor: color }]} />
        <View style={[styles.crescentCut, { backgroundColor: glowColor }]} />
      </View>
      {SPARKLES.map((spark) => (
        <View
          key={`${spark.left}-${spark.top}`}
          style={[
            styles.spark,
            {
              left: spark.left,
              top: spark.top,
              width: spark.size,
              height: spark.size,
              borderRadius: spark.size / 2,
              backgroundColor: starColor,
              opacity: spark.opacity,
            },
          ]}
        />
      ))}
      <View style={[styles.bannerArc, { borderColor: color }]} />
    </View>
  );
}

const SPARKLES = [
  { left: "62%", top: 22, size: 3, opacity: 0.85 },
  { left: "78%", top: 16, size: 2, opacity: 0.7 },
  { left: "88%", top: 32, size: 2.5, opacity: 0.8 },
  { left: "70%", top: 44, size: 1.5, opacity: 0.55 },
  { left: "92%", top: 50, size: 2, opacity: 0.65 },
] as const;

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    pointerEvents: "none",
  },
  glow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.28,
    right: 16,
    top: -10,
  },
  crescentWrap: {
    position: "absolute",
    right: 36,
    top: 28,
    width: 64,
    height: 64,
  },
  crescent: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  crescentCut: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    top: -4,
    left: 16,
    opacity: 0.85,
  },
  spark: { position: "absolute" },
  bannerArc: {
    position: "absolute",
    right: 10,
    bottom: 12,
    width: 100,
    height: 50,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderWidth: 1.5,
    opacity: 0.35,
  },
});
