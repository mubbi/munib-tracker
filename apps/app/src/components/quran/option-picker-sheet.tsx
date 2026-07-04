import { SymbolView } from "expo-symbols";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export type OptionPickerItem = {
  id: string;
  label: string;
  subtitle?: string;
};

type SelectTriggerProps = {
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
};

/** Tappable field that opens an option sheet — used for reciter / translation pickers. */
export function SelectTrigger({ label, accessibilityLabel, onPress }: SelectTriggerProps) {
  const { colors } = useThemeTokens();

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.trigger, { backgroundColor: colors.muted }]}
    >
      <ThemedText type="small" numberOfLines={1} style={styles.triggerLabel}>
        {label}
      </ThemedText>
      <SymbolView
        name={{ ios: "chevron.down", android: "keyboard_arrow_down", web: "keyboard_arrow_down" }}
        size={14}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );
}

type OptionPickerSheetProps = {
  visible: boolean;
  title: string;
  options: OptionPickerItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function OptionPickerSheet({
  visible,
  title,
  options,
  selectedId,
  onSelect,
  onClose,
}: OptionPickerSheetProps) {
  const { colors, tokens } = useThemeTokens();

  const handleSelect = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <ThemedText type="subtitle">{title}</ThemedText>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {options.map((option) => {
          const selected = option.id === selectedId;
          return (
            <PressableScale
              key={option.id}
              haptic="selection"
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              onPress={() => handleSelect(option.id)}
              style={[styles.row, { backgroundColor: selected ? tokens.accentSoft : colors.muted }]}
            >
              <View style={styles.rowBody}>
                <ThemedText type="small">{option.label}</ThemedText>
                {option.subtitle ? (
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {option.subtitle}
                  </ThemedText>
                ) : null}
              </View>
              {selected ? (
                <SymbolView
                  name={{
                    ios: "checkmark.circle.fill",
                    android: "check_circle",
                    web: "check_circle",
                  }}
                  size={22}
                  tintColor={colors.accent}
                />
              ) : null}
            </PressableScale>
          );
        })}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    maxWidth: "62%",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  triggerLabel: {
    flexShrink: 1,
  },
  list: {
    maxHeight: 360,
  },
  listContent: {
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowBody: {
    flex: 1,
    gap: 2,
    paddingRight: Spacing.two,
  },
});
