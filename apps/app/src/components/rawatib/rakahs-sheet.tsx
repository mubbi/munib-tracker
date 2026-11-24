import { RAWATIB_RAKAH_OPTIONS } from "@munib-tracker/shared/constants";
import type { RawatibId } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type RakahsSheetProps = {
  /** Row being edited; `null` keeps the sheet closed. */
  id: RawatibId | null;
  current: number;
  onSelect: (id: RawatibId, rakahs: number) => void;
  onClose: () => void;
};

/** Picks 2 or 4 rakahs for a variable rawatib row and logs it (NF-3.1). */
export function RakahsSheet({ id, current, onSelect, onClose }: RakahsSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const options = id ? [...RAWATIB_RAKAH_OPTIONS[id]].sort((a, b) => a - b) : [];

  return (
    <Sheet visible={id != null} onClose={onClose} variant="bottom">
      <ThemedText type="subtitle">{id ? t(`prayers.${id}`) : ""}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("rawatib.rakahsSheet.prompt")}
      </ThemedText>
      <View style={styles.options}>
        {options.map((count) => {
          const active = count === current;
          return (
            <PressableScale
              key={count}
              haptic="selection"
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={t("rawatib.rakahsSheet.option", { count })}
              onPress={() => {
                if (id) onSelect(id, count);
                onClose();
              }}
              style={[
                styles.option,
                {
                  backgroundColor: active ? tokens.accentSoft : colors.muted,
                  borderColor: active ? colors.accent : "transparent",
                },
              ]}
            >
              <ThemedText
                type="smallBold"
                style={{ color: active ? colors.accent : colors.foreground }}
              >
                {t("rawatib.rakahsSheet.option", { count })}
              </ThemedText>
            </PressableScale>
          );
        })}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  option: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1.5,
  },
});
