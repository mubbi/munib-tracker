import { useMemo } from "react";
import { Switch, type SwitchProps, View } from "react-native";

import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ltrControlViewProps } from "@/lib/rtl";

type ThemedSwitchProps = Omit<SwitchProps, "trackColor" | "thumbColor">;

/**
 * Theme-aware toggle that stays visually correct in RTL layouts.
 *
 * Native RTL mirrors flex rows *and* the Switch thumb, which double-flips the
 * knob off the track. Lock an LTR coordinate plane (same pattern as segmented
 * controls) while the parent row flex still places the control on the correct side.
 */
export function ThemedSwitch(props: ThemedSwitchProps) {
  const { colors, tokens } = useThemeTokens();
  const trackColor = useMemo(
    () => ({ true: colors.accent, false: tokens.track }),
    [colors.accent, tokens.track],
  );

  return (
    <View {...ltrControlViewProps()}>
      <Switch trackColor={trackColor} thumbColor={colors.card} {...props} />
    </View>
  );
}
