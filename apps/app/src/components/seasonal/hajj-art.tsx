import { StyleSheet, View } from "react-native";

type HajjArtProps = {
  color: string;
  glowColor: string;
  /** Kaaba band colour — warm gold on the cube. */
  bandColor: string;
};

/** Kaaba silhouette with minarets and a soft golden glow for the Hajj banner. */
export function HajjArt({ color, glowColor, bandColor }: HajjArtProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.glow, { backgroundColor: glowColor }]} />

      <View style={styles.scene}>
        <Minaret color={color} scale={0.9} />
        <Kaaba color={color} bandColor={bandColor} />
        <Minaret color={color} scale={0.9} />
      </View>

      {/* Subtle geometric arc suggesting the mataf. */}
      <View style={[styles.arc, { borderColor: color }]} />
    </View>
  );
}

function Kaaba({ color, bandColor }: { color: string; bandColor: string }) {
  return (
    <View style={styles.kaaba}>
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
      <View
        style={{
          width: s(8),
          height: s(52),
          backgroundColor: color,
        }}
      />
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
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.2,
    right: 8,
    top: -30,
  },
  scene: {
    position: "absolute",
    right: 16,
    bottom: 6,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  kaaba: {
    alignItems: "center",
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
  arc: {
    position: "absolute",
    right: -20,
    bottom: -40,
    width: 180,
    height: 90,
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    borderWidth: 1,
    opacity: 0.25,
  },
});
