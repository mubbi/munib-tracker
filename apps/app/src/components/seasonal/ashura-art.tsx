import { StyleSheet, View } from "react-native";

type AshuraArtProps = {
  color: string;
  glowColor: string;
};

/** Abstract flowing bands suggesting calm waters for Ashura. */
export function AshuraArt({ color, glowColor }: AshuraArtProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.glow, { backgroundColor: glowColor }]} />
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.wave,
            {
              bottom: 18 + i * 14,
              right: 8 + i * 6,
              width: 120 - i * 12,
              opacity: 0.35 - i * 0.06,
              backgroundColor: color,
            },
          ]}
        />
      ))}
      <View style={[styles.droplet, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    pointerEvents: "none",
  },
  glow: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    opacity: 0.2,
    right: 10,
    top: 10,
  },
  wave: {
    position: "absolute",
    height: 3,
    borderRadius: 2,
  },
  droplet: {
    position: "absolute",
    right: 48,
    top: 32,
    width: 10,
    height: 14,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    opacity: 0.5,
  },
});
