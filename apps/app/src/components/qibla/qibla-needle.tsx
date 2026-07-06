import { StyleSheet, View } from "react-native";

type QiblaNeedleProps = {
  size: number;
  color: string;
};

/** Upward-pointing compass needle — pure Views so it renders reliably on native. */
export function QiblaNeedle({ size, color }: QiblaNeedleProps) {
  const head = size * 0.42;
  const halfBase = size * 0.18;
  const tailW = size * 0.1;
  const tailH = size * 0.22;

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: halfBase,
          borderRightWidth: halfBase,
          borderBottomWidth: head,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: color,
        }}
      />
      <View
        style={{
          width: tailW,
          height: tailH,
          marginTop: -1,
          borderRadius: tailW / 2,
          backgroundColor: color,
          opacity: 0.85,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
  },
});
