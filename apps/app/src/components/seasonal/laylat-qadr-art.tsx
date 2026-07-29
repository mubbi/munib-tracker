import { StyleSheet, View } from "react-native";

type LaylatQadrArtProps = {
  color: string;
  starColor: string;
  glowColor: string;
};

/** Radiant open book and bright stars for Laylat al-Qadr. */
export function LaylatQadrArt({ color, starColor, glowColor }: LaylatQadrArtProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.glow, { backgroundColor: glowColor }]} />
      <View style={[styles.glowInner, { backgroundColor: glowColor }]} />
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
      <View style={styles.book}>
        <View style={[styles.pageLeft, { backgroundColor: color }]} />
        <View style={[styles.spine, { backgroundColor: color }]} />
        <View style={[styles.pageRight, { backgroundColor: color }]} />
        <View style={[styles.rays, { borderColor: starColor }]} />
      </View>
    </View>
  );
}

const STARS = [
  { left: "58%", top: 16, size: 3, opacity: 0.9 },
  { left: "74%", top: 24, size: 2, opacity: 0.75 },
  { left: "88%", top: 18, size: 2.5, opacity: 0.85 },
  { left: "82%", top: 40, size: 1.5, opacity: 0.6 },
] as const;

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    pointerEvents: "none",
  },
  glow: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    opacity: 0.3,
    right: 0,
    top: -30,
  },
  glowInner: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.35,
    right: 36,
    top: 20,
  },
  star: { position: "absolute" },
  book: {
    position: "absolute",
    right: 24,
    bottom: 20,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  pageLeft: {
    width: 28,
    height: 36,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 2,
    opacity: 0.85,
  },
  spine: {
    width: 4,
    height: 38,
    opacity: 0.95,
  },
  pageRight: {
    width: 28,
    height: 36,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 2,
    opacity: 0.85,
  },
  rays: {
    position: "absolute",
    top: -16,
    left: 10,
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    opacity: 0.4,
  },
});
