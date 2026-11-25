import type { VoluntaryFastKind } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { FOLLOWABLE_FAST_KINDS } from "@/lib/voluntary-fasting/prefs";

/**
 * "Fasts I follow" chips (NF-3.2) — one switch per followable kind. Shared by
 * the fasting hub and Settings › Fiqh & madhhab › Voluntary fasting; both write
 * through the `fiqh.fasting.kinds` setting.
 */
export function FastKindChips({
  value,
  onToggle,
  disabled,
}: {
  value: readonly VoluntaryFastKind[];
  onToggle: (kind: VoluntaryFastKind) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <View style={styles.chips} pointerEvents={disabled ? "none" : "auto"}>
      {FOLLOWABLE_FAST_KINDS.map((kind) => {
        const on = value.includes(kind);
        return (
          <PressableScale
            key={kind}
            haptic="selection"
            accessibilityRole="switch"
            accessibilityState={{ checked: on, disabled }}
            accessibilityLabel={t(`voluntaryFasting.kind.${kind}`)}
            onPress={() => onToggle(kind)}
            style={[
              styles.chip,
              {
                backgroundColor: on ? tokens.accentSoft : colors.muted,
                borderColor: on ? colors.accent : "transparent",
                opacity: disabled ? 0.5 : 1,
              },
            ]}
          >
            <ThemedText
              type="caption"
              style={{ color: on ? colors.accentText : colors.foreground }}
            >
              {t(`voluntaryFasting.kind.${kind}`)}
            </ThemedText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
  chip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: BorderWidth.thin,
  },
});
