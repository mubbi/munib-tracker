import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { Radius } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconType } from "@/lib/names-of-allah-ui";

type IconWellProps = {
  icon: AppIconType;
  /** Symbol point size. */
  size?: number;
  /** Symbol tint (defaults to the accent color). */
  tint?: string;
  /** Well background (defaults to the soft accent tint). */
  background?: string;
  /** Well square dimension. */
  well?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/** The recurring "rounded square containing a symbol" affordance, unified in one place. */
export function IconWell({
  icon,
  size = 20,
  tint,
  background,
  well = 44,
  radius = Radius.md,
  style,
}: IconWellProps) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View
      style={[
        styles.well,
        {
          width: well,
          height: well,
          borderRadius: radius,
          backgroundColor: background ?? tokens.accentSoft,
        },
        style,
      ]}
    >
      <AppIcon icon={icon} size={size} tintColor={tint ?? colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  well: {
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
});
