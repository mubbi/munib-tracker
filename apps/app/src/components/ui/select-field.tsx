import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
  type FieldChromeProps,
  FieldShell,
  fieldRowStyles,
  useFieldA11y,
  useFieldSurface,
} from "@/components/ui/field-chrome";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
  /** Second line under the label. */
  description?: string;
};

export type SelectFieldProps<T extends string> = FieldChromeProps & {
  options: ReadonlyArray<SelectOption<T>>;
  value: T | undefined;
  onChange: (value: T) => void;
  /** Shown while nothing is selected (default: "Choose"). */
  placeholder?: string;
  /** Sheet title (default: the label). */
  sheetTitle?: string;
};

/**
 * 5+ option picker: a field-looking row that opens a bottom `Sheet` with a radio
 * list and closes on select (design-system §Forms: 2–4 options use SegmentedControl).
 */
export function SelectField<T extends string>({
  label,
  helperText,
  error,
  required,
  optional,
  disabled,
  options,
  value,
  onChange,
  placeholder,
  sheetTitle,
}: SelectFieldProps<T>) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const { inputId, messageId, counterId } = useFieldA11y({
    label,
    helperText,
    error,
    required,
    disabled,
  });
  const surface = useFieldSurface({ focused, error });
  const selected = options.find((o) => o.value === value);
  const web = Platform.OS === "web";

  return (
    <>
      <FieldShell
        label={label}
        helperText={helperText}
        error={error}
        required={required}
        optional={optional}
        messageId={messageId}
        counterId={counterId}
      >
        <PressableScale
          role="button"
          accessibilityLabel={`${label}, ${selected?.label ?? placeholder ?? t("uiField.choose")}`}
          accessibilityHint={error ? undefined : helperText}
          accessibilityState={{ disabled: Boolean(disabled), expanded: open }}
          disabled={disabled}
          onPress={() => setOpen(true)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          scaleTo={0.99}
          style={[fieldRowStyles.row, surface, disabled && fieldRowStyles.disabled]}
          {...(web
            ? ({
                id: inputId,
                "aria-haspopup": "dialog",
                "aria-invalid": error ? true : undefined,
                "aria-describedby": error || helperText ? messageId : undefined,
              } as object)
            : null)}
        >
          <ThemedText
            style={styles.value}
            numberOfLines={1}
            themeColor={selected ? undefined : "mutedForeground"}
          >
            {selected?.label ?? placeholder ?? t("uiField.choose")}
          </ThemedText>
          <SymbolView
            name={{ ios: "chevron.up.chevron.down", android: "unfold_more", web: "unfold_more" }}
            size={IconSize.md}
            tintColor={colors.mutedForeground}
          />
        </PressableScale>
      </FieldShell>
      <Sheet
        title={sheetTitle ?? label}
        visible={open}
        onClose={() => setOpen(false)}
        variant="bottom"
        solid
      >
        <View accessibilityRole="radiogroup" role="radiogroup" style={styles.list}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <PressableScale
                key={option.value}
                role="radio"
                accessibilityLabel={option.label}
                accessibilityState={{ selected: isSelected, checked: isSelected }}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                haptic="selection"
                style={[
                  styles.option,
                  { backgroundColor: isSelected ? tokens.accentSoft : "transparent" },
                ]}
              >
                <View style={styles.optionText}>
                  <ThemedText weight={isSelected ? "semibold" : "regular"}>
                    {option.label}
                  </ThemedText>
                  {option.description ? (
                    <ThemedText type="footnote" themeColor="mutedForeground">
                      {option.description}
                    </ThemedText>
                  ) : null}
                </View>
                {isSelected ? (
                  <SymbolView
                    name={{ ios: "checkmark", android: "check", web: "check" }}
                    size={IconSize.lg}
                    tintColor={colors.accent}
                  />
                ) : null}
              </PressableScale>
            );
          })}
        </View>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  value: { flex: 1, minWidth: 0 },
  list: { gap: Spacing.one },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: Control.row,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.lg,
  },
  optionText: { flex: 1, minWidth: 0 },
});
