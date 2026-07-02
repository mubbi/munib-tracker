import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type TrackerRowProps = {
  label: string;
  completed?: boolean;
  onPress?: () => void;
};

export function TrackerRow({ label, completed = false, onPress }: TrackerRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      <ThemedView type="card" style={[styles.row, { borderColor: colors.border }]}>
        <View style={styles.labelWrap}>
          <ThemedText type="default">{label}</ThemedText>
        </View>
        <View
          style={[
            styles.status,
            {
              borderColor: completed ? colors.accent : colors.border,
              backgroundColor: completed ? colors.accent : "transparent",
            },
          ]}
        >
          {completed ? (
            <SymbolView
              name={{ ios: "checkmark", android: "check", web: "check" }}
              size={12}
              tintColor={colors.accentForeground}
            />
          ) : null}
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderCurve: "continuous",
  },
  labelWrap: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  status: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
});
