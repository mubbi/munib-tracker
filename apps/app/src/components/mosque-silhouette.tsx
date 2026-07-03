import { StyleSheet, View } from "react-native";

type MosqueSilhouetteProps = {
  /** Silhouette fill for the current time of day. */
  color: string;
  /** Overall softness of the silhouette against the sky. */
  opacity?: number;
  /** Uniform scale applied to the whole skyline (1 = base size). */
  scale?: number;
};

/**
 * A calm mosque skyline drawn from plain Views — a central onion dome flanked
 * by smaller domes and two minarets, rising from a low wall. No SVG or image
 * asset (nothing to bundle, works on every platform); because it is a single
 * flat colour, the overlapping shapes read as one clean silhouette. It sits
 * behind the hero content as a quiet backdrop, recoloured with the sky.
 */
export function MosqueSilhouette({ color, opacity = 0.5, scale = 1.35 }: MosqueSilhouetteProps) {
  const s = (n: number) => n * scale;

  return (
    <View style={[styles.wrap, { height: s(140), opacity, pointerEvents: "none" }]}>
      {/* Ground wall spanning the base. */}
      <View style={[styles.wall, { height: s(30), backgroundColor: color }]} />

      <View style={[styles.row, { bottom: s(14), gap: s(6) }]}>
        <Minaret color={color} s={s} />
        <SmallDome color={color} s={s} />
        <CentralDome color={color} s={s} />
        <SmallDome color={color} s={s} />
        <Minaret color={color} s={s} />
      </View>
    </View>
  );
}

type PartProps = { color: string; s: (n: number) => number };

function CentralDome({ color, s }: PartProps) {
  return (
    <View style={styles.building}>
      <View style={{ width: s(3), height: s(14), borderRadius: s(2), backgroundColor: color }} />
      <View
        style={{
          width: s(74),
          height: s(62),
          borderTopLeftRadius: s(37),
          borderTopRightRadius: s(37),
          borderBottomLeftRadius: s(16),
          borderBottomRightRadius: s(16),
          backgroundColor: color,
        }}
      />
      <View style={{ width: s(60), height: s(36), backgroundColor: color }} />
    </View>
  );
}

function SmallDome({ color, s }: PartProps) {
  return (
    <View style={styles.building}>
      <View style={{ width: s(2), height: s(9), borderRadius: s(2), backgroundColor: color }} />
      <View
        style={{
          width: s(34),
          height: s(30),
          borderTopLeftRadius: s(17),
          borderTopRightRadius: s(17),
          backgroundColor: color,
        }}
      />
      <View style={{ width: s(30), height: s(30), backgroundColor: color }} />
    </View>
  );
}

function Minaret({ color, s }: PartProps) {
  return (
    <View style={styles.building}>
      <View style={{ width: s(3), height: s(10), borderRadius: s(2), backgroundColor: color }} />
      <View
        style={{
          width: s(16),
          height: s(13),
          borderTopLeftRadius: s(8),
          borderTopRightRadius: s(8),
          backgroundColor: color,
        }}
      />
      <View style={{ width: s(11), height: s(82), backgroundColor: color }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  wall: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  row: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  building: {
    alignItems: "center",
  },
});
