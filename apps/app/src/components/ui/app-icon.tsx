import { SymbolView } from "expo-symbols";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
  type AppIcon as AppIconName,
  isNamesOfAllahIcon,
  NAMES_OF_ALLAH_GLYPH,
} from "@/lib/names-of-allah-ui";

type AppIconProps = {
  icon: AppIconName;
  size?: number;
  tintColor?: string;
};

/** Renders a platform symbol or the الله glyph for the 99 Names feature. */
export function AppIcon({ icon, size = 18, tintColor }: AppIconProps) {
  if (isNamesOfAllahIcon(icon)) {
    return (
      <ThemedText
        type="arabic"
        style={[
          styles.glyph,
          {
            fontSize: Math.round(size * 0.88),
            lineHeight: Math.round(size * 1.05),
            color: tintColor,
          },
        ]}
      >
        {NAMES_OF_ALLAH_GLYPH}
      </ThemedText>
    );
  }

  return <SymbolView name={icon} size={size} tintColor={tintColor} />;
}

const styles = StyleSheet.create({
  glyph: {
    writingDirection: "rtl",
    textAlign: "center",
    includeFontPadding: false,
  },
});
