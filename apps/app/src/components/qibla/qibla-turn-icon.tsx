import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { QiblaTurnKind } from "@/lib/qibla-guidance";

type QiblaTurnIconProps = {
  kind: QiblaTurnKind;
  size: number;
  color: string;
  backgroundColor: string;
};

function turnGlyph(kind: QiblaTurnKind): string {
  if (kind === "aligned") return "✓";
  if (kind.endsWith("Left")) return "←";
  return "→";
}

/** Turn hint icon without platform symbol dependencies. */
export function QiblaTurnIcon({ kind, size, color, backgroundColor }: QiblaTurnIconProps) {
  const fontSize = Math.round(size * 0.52);

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <ThemedText type="header" style={{ color, fontSize, lineHeight: fontSize + 4 }}>
        {turnGlyph(kind)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
  },
});
