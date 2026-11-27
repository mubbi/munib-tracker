import { type StyleProp, View, type ViewStyle } from "react-native";

import { BorderWidth, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export type DividerProps = {
  /** Leading inset (logical start) so the line aligns with row text, e.g. past an icon well. */
  inset?: number;
  /** Draw a vertical rule instead (stretches to the parent's height). */
  vertical?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** The one hairline separator (list rows, card sections). Decorative: hidden from assistive tech. */
export function Divider({ inset = 0, vertical = false, style }: DividerProps) {
  const { tokens } = useThemeTokens();
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={[
        vertical
          ? { width: BorderWidth.hairline, alignSelf: "stretch", marginVertical: Spacing.half }
          : { height: BorderWidth.hairline, alignSelf: "stretch", marginStart: inset },
        { backgroundColor: tokens.hairline },
        style,
      ]}
    />
  );
}
