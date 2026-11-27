import { SymbolView } from "expo-symbols";
import { forwardRef, type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputInstance,
  type TextInputProps,
  View,
  type ViewStyle,
} from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useIsRTL } from "@/lib/rtl";

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
  /** Slot after the clear button (filter / sort button, scope toggle). */
  trailing?: ReactNode;
  autoFocus?: boolean;
  /** Keyboard "search" key / Enter. */
  onSubmit?: (text: string) => void;
  /** Text direction of the query (defaults to the app direction). */
  direction?: "ltr" | "rtl";
  /** Accessible name when the placeholder is not a good label. */
  accessibilityLabel?: string;
  onFocus?: TextInputProps["onFocus"];
  onBlur?: TextInputProps["onBlur"];
};

const ICON_SIZE = 18;
/** Clear button hit area — 44pt platform floor. */
const CLEAR_HIT = 44;

/**
 * App search bar: leading glass, accent focus ring, 44pt clear button, optional
 * trailing slot. UI only — the search logic stays in `lib/search.ts`.
 * Forwards its ref to the `TextInput`.
 */
export const SearchField = forwardRef<TextInputInstance, SearchFieldProps>(function SearchField(
  {
    value,
    onChangeText,
    placeholder,
    style,
    trailing,
    autoFocus,
    onSubmit,
    direction,
    accessibilityLabel,
    onFocus,
    onBlur,
  },
  ref,
) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [focused, setFocused] = useState(false);
  const tv = isTV();
  const rtl = useIsRTL();
  const inputDir = direction ?? (rtl ? "rtl" : "ltr");
  // Symmetric inner padding when no clear / trailing control sits at the end edge.
  const hasEndControl = value.length > 0 || trailing != null;

  return (
    <View
      style={[
        styles.field,
        tv && styles.fieldTv,
        !hasEndControl && styles.fieldNoEndControl,
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
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        onSubmitEditing={onSubmit ? (e) => onSubmit(e.nativeEvent.text) : undefined}
        autoFocus={autoFocus}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        style={[
          styles.input,
          tv && styles.inputTv,
          // Follow the UI direction by default so the placeholder and text sit at the
          // start edge in RTL; an explicit `direction` (Arabic content) still wins.
          { writingDirection: inputDir, textAlign: inputDir === "rtl" ? "right" : "left" },
          // The container draws the focus indicator (keeps the pill shape); suppress
          // the global square :focus-visible outline on the bare input.
          Platform.OS === "web" && ({ outlineStyle: "none" } as object),
          { color: colors.foreground },
        ]}
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
      {trailing}
    </View>
  );
});

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
  fieldNoEndControl: {
    paddingEnd: Spacing.three,
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
