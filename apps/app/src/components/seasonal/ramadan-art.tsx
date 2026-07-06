import { StyleSheet, View } from "react-native";

type RamadanArtProps = {
  color: string;
  starColor: string;
  glowColor: string;
};

/** Lanterns, crescent moon, and a soft starfield for the Ramadan home banner. */
export function RamadanArt({ color, starColor, glowColor }: RamadanArtProps) {
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

      <View style={styles.moonWrap}>
        <View style={[styles.moonDisc, { backgroundColor: color }]} />
        <View style={[styles.moonCutout, { backgroundColor: glowColor }]} />
      </View>

      <View style={[styles.lanternRow, { bottom: 8 }]}>
        <Lantern color={color} size={0.85} />
        <Lantern color={color} size={1.1} />
        <Lantern color={color} size={0.75} />
      </View>
    </View>
  );
}

function Lantern({ color, size }: { color: string; size: number }) {
  const s = (n: number) => n * size;
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: s(3),
          height: s(10),
          borderRadius: s(2),
          backgroundColor: color,
        }}
      />
      <View
        style={{
          width: s(22),
          height: s(28),
          borderTopLeftRadius: s(6),
          borderTopRightRadius: s(6),
          borderBottomLeftRadius: s(4),
          borderBottomRightRadius: s(4),
          backgroundColor: color,
        }}
      />
      <View
        style={{
          width: s(14),
          height: s(3),
          borderRadius: s(2),
          backgroundColor: color,
          marginTop: s(2),
        }}
      />
    </View>
  );
}

const STARS = [
  { left: "8%", top: 18, size: 2, opacity: 0.6 },
  { left: "22%", top: 42, size: 1.5, opacity: 0.45 },
  { left: "38%", top: 24, size: 2, opacity: 0.7 },
  { left: "52%", top: 52, size: 1.5, opacity: 0.5 },
  { left: "68%", top: 16, size: 2.5, opacity: 0.75 },
  { left: "82%", top: 38, size: 1.5, opacity: 0.55 },
  { left: "90%", top: 58, size: 2, opacity: 0.65 },
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
    opacity: 0.22,
    right: 24,
    top: -20,
  },
  star: {
    position: "absolute",
  },
  moonWrap: {
    position: "absolute",
    right: 36,
    top: 28,
    width: 56,
    height: 56,
  },
  moonDisc: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  moonCutout: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    top: -4,
    left: 14,
    opacity: 0.85,
  },
  lanternRow: {
    position: "absolute",
    right: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
});
