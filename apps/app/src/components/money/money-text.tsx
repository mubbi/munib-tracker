import {
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";

import { CurrencyGlyph } from "@/components/money/currency-glyph";
import { CURRENCY_GLYPH_SYMBOLS } from "@/constants/currencies";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type Props = {
  /** Formatted amount, e.g. "ر.س1,234.56", "د.إ50", or "$12". */
  children: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessibilityLabel?: string;
};

const DEFAULT_SIZE = 16;

function findGlyph(value: string) {
  for (const entry of CURRENCY_GLYPH_SYMBOLS) {
    const index = value.indexOf(entry.symbol);
    if (index !== -1) {
      return { ...entry, index };
    }
  }
  return null;
}

/**
 * Drop-in amount renderer. When the string contains an AED/SAR catalogue symbol
 * it swaps that symbol for a vector {@link CurrencyGlyph}; otherwise it renders
 * ordinary text. Defaults to the theme foreground so amounts never render as
 * unstyled black on dark surfaces.
 */
export function MoneyText({ children, style, numberOfLines, accessibilityLabel }: Props) {
  const { colors } = useThemeTokens();
  const match = findGlyph(children);
  const flat = StyleSheet.flatten(style) ?? {};
  const color = typeof flat.color === "string" ? flat.color : colors.foreground;

  if (!match) {
    return (
      <Text
        style={[{ color }, style]}
        numberOfLines={numberOfLines}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </Text>
    );
  }

  const textStyle: TextStyle = {
    fontSize: flat.fontSize,
    fontFamily: flat.fontFamily,
    fontWeight: flat.fontWeight,
    fontStyle: flat.fontStyle,
    color,
    letterSpacing: flat.letterSpacing,
    lineHeight: flat.lineHeight,
    textAlign: flat.textAlign,
  };
  const containerStyle: ViewStyle = {
    margin: flat.margin,
    marginTop: flat.marginTop,
    marginBottom: flat.marginBottom,
    marginStart: flat.marginStart,
    marginEnd: flat.marginEnd,
    marginHorizontal: flat.marginHorizontal,
    marginVertical: flat.marginVertical,
    alignSelf: flat.alignSelf,
    opacity: flat.opacity,
    flex: flat.flex,
    flexGrow: flat.flexGrow,
    flexShrink: flat.flexShrink,
    flexBasis: flat.flexBasis,
  };

  const glyphSize = typeof flat.fontSize === "number" ? flat.fontSize : DEFAULT_SIZE;
  const gap = Math.max(1, Math.round(glyphSize * 0.1));

  const before = children.slice(0, match.index);
  const after = children.slice(match.index + match.symbol.length);

  return (
    <View
      style={[containerStyle, styles.row]}
      accessible={accessibilityLabel != null || undefined}
      accessibilityLabel={accessibilityLabel}
    >
      {before ? (
        <Text style={textStyle} numberOfLines={numberOfLines}>
          {before}
        </Text>
      ) : null}
      <CurrencyGlyph glyph={match.glyph} size={glyphSize} color={color} />
      {after ? (
        <Text style={[textStyle, { marginStart: gap }]} numberOfLines={numberOfLines}>
          {after}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
