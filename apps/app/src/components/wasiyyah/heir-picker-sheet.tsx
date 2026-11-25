import { HEIR_TYPES, type HeirType } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/** Picks the beneficiary's heir relationship (the NF-3.10 heir list). */
export function HeirPickerSheet({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected?: HeirType;
  onSelect: (heir: HeirType) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  return (
    <Sheet
      accessibilityLabel={t("wasiyyah.bequests.heirPick")}
      visible={visible}
      onClose={onClose}
      variant="bottom"
      solid
    >
      <ThemedText type="subtitle" style={styles.title}>
        {t("wasiyyah.bequests.heirPick")}
      </ThemedText>
      <View style={styles.list}>
        {HEIR_TYPES.map((heir) => (
          <PressableScale
            key={heir}
            accessibilityRole="radio"
            accessibilityState={{ selected: heir === selected }}
            onPress={() => onSelect(heir)}
            style={[styles.row, heir === selected && { backgroundColor: tokens.accentSoft }]}
          >
            <ThemedText type="small">{t(`heirs.${heir}`)}</ThemedText>
          </PressableScale>
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: Spacing.two },
  list: { gap: Spacing.half },
  row: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Radius.sm },
});
