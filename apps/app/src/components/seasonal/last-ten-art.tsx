import { StyleSheet, View } from "react-native";

type LastTenArtProps = {
  color: string;
  starColor: string;
  glowColor: string;
};

/** Dense starfield and a mosque dome for the last ten nights of Ramadan. */
export function LastTenArt({ color, starColor, glowColor }: LastTenArtProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.glow, { backgroundColor: glowColor }]} />
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
      <View style={styles.domeWrap}>
        <View style={[styles.finial, { backgroundColor: color }]} />
        <View style={[styles.dome, { backgroundColor: color }]} />
        <View style={[styles.base, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

const STARS = [
  { left: "55%", top: 14, size: 2, opacity: 0.65 },
  { left: "62%", top: 28, size: 1.5, opacity: 0.5 },
  { left: "70%", top: 18, size: 2.5, opacity: 0.8 },
  { left: "78%", top: 34, size: 1.5, opacity: 0.55 },
  { left: "86%", top: 22, size: 2, opacity: 0.7 },
  { left: "92%", top: 44, size: 1.5, opacity: 0.45 },
  { left: "68%", top: 48, size: 2, opacity: 0.6 },
] as const;

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    pointerEvents: "none",
  },
  glow: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.28,
    right: 8,
    top: -24,
  },
  star: { position: "absolute" },
  domeWrap: {
    position: "absolute",
    right: 28,
    bottom: 8,
    alignItems: "center",
  },
  finial: {
    width: 3,
    height: 12,
    borderRadius: 2,
    marginBottom: 2,
  },
  dome: {
    width: 56,
    height: 44,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  base: {
    width: 64,
    height: 18,
    marginTop: -2,
  },
});
