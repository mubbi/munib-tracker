import { StyleSheet, View } from "react-native";

type EidAdhaArtProps = {
  color: string;
  glowColor: string;
  bandColor: string;
  starColor: string;
};

/** Kaaba with golden celebration rays for Eid al-Adha. */
export function EidAdhaArt({ color, glowColor, bandColor, starColor }: EidAdhaArtProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.glow, { backgroundColor: glowColor }]} />
      {RAYS.map((ray) => (
        <View
          key={ray.rotate}
          style={[
            styles.ray,
            {
              transform: [{ rotate: `${ray.rotate}deg` }],
              backgroundColor: starColor,
              opacity: ray.opacity,
            },
          ]}
        />
      ))}
      <View style={styles.scene}>
        <Minaret color={color} scale={0.85} />
        <Kaaba color={color} bandColor={bandColor} />
        <Minaret color={color} scale={0.85} />
      </View>
    </View>
  );
}

function Kaaba({ color, bandColor }: { color: string; bandColor: string }) {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={[styles.kaabaBody, { backgroundColor: color }]}>
        <View style={[styles.kaabaBand, { backgroundColor: bandColor }]} />
        <View style={[styles.kaabaDoor, { borderColor: bandColor }]} />
      </View>
      <View style={[styles.kaabaBase, { backgroundColor: color }]} />
    </View>
  );
}

function Minaret({ color, scale }: { color: string; scale: number }) {
  const s = (n: number) => n * scale;
  return (
    <View style={{ alignItems: "center", marginBottom: 4 }}>
      <View
        style={{
          width: s(3),
          height: s(8),
          borderRadius: s(2),
          backgroundColor: color,
        }}
      />
      <View
        style={{
          width: s(12),
          height: s(10),
          borderTopLeftRadius: s(6),
          borderTopRightRadius: s(6),
          backgroundColor: color,
        }}
      />
      <View style={{ width: s(8), height: s(48), backgroundColor: color }} />
    </View>
  );
}

const RAYS = [
  { rotate: 0, opacity: 0.35 },
  { rotate: 45, opacity: 0.25 },
  { rotate: 90, opacity: 0.3 },
  { rotate: 135, opacity: 0.2 },
] as const;

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    pointerEvents: "none",
  },
  glow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.25,
    right: -10,
    top: -40,
  },
  ray: {
    position: "absolute",
    right: 58,
    top: 36,
    width: 2,
    height: 40,
    borderRadius: 1,
  },
  scene: {
    position: "absolute",
    right: 14,
    bottom: 6,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  kaabaBody: {
    width: 52,
    height: 48,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  kaabaBand: {
    position: "absolute",
    top: 14,
    left: 0,
    right: 0,
    height: 8,
    opacity: 0.85,
  },
  kaabaDoor: {
    position: "absolute",
    bottom: 4,
    width: 14,
    height: 22,
    borderWidth: 1.5,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    opacity: 0.7,
  },
  kaabaBase: {
    width: 58,
    height: 6,
    borderRadius: 2,
    marginTop: 2,
    opacity: 0.6,
  },
});
