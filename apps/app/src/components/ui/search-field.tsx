import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type StyleProp, StyleSheet, TextInput, View, type ViewStyle } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
};

const ICON_SIZE = 18;
const CLEAR_HIT = 40;

/** App search bar: leading glass, accent focus ring, clear button. */
export function SearchField({ value, onChangeText, placeholder, style }: SearchFieldProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [focused, setFocused] = useState(false);
  const tv = isTV();

  return (
    <View
      style={[
        styles.field,
        tv && styles.fieldTv,
        focused ? tokens.inputSurfaceFocused : tokens.inputSurface,
        style,
      ]}
    >
      <SymbolView
        name={{ ios: "magnifyingglass", android: "search", web: "search" }}
        size={tv ? 22 : ICON_SIZE}
        tintColor={focused ? colors.accent : colors.mutedForeground}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        style={[styles.input, tv && styles.inputTv, { color: colors.foreground }]}
      />
      {value.length > 0 ? (
        <IconButton
          name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
          size={ICON_SIZE}
          tintColor={colors.mutedForeground}
          accessibilityLabel={t("common.clearSearch")}
          haptic="selection"
          hitTarget={tv ? TvLayout.minFocusTargetDp : CLEAR_HIT}
          onPress={() => onChangeText("")}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: tvDp(50),
    paddingStart: Spacing.three,
    paddingEnd: Spacing.one,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  fieldTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingStart: Spacing.four,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  inputTv: {
    fontSize: tvDp(TvLayout.bodyFontSize), // TextInput: no ThemedText tvOS scaling
  },
});
