import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

import { rowStyles } from "./row-styles";

/**
 * −/value/+ row with bounds (§4.5.5) — replaces the three hand-built steppers
 * (masjid offsets, reminder timing, bedtime minutes). On TV a stepper at its
 * limit is dimmed, never disabled: a disabled Pressable drops D-pad focus.
 */
export function StepperRow({
  title,
  subtitle,
  accessory,
  value,
  min,
  max,
  step,
  format,
  onChange,
  disabled,
}: {
  title: string;
  subtitle?: string;
  accessory?: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const tv = isTV();
  const formatted = format(value);
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const limitProps = (atLimit: boolean) =>
    tv
      ? { accessibilityState: { disabled: atLimit }, style: atLimit ? styles.dimmed : undefined }
      : { disabled: atLimit || disabled };

  return (
    <View
      style={[
        rowStyles.block,
        tv && rowStyles.blockTv,
        { backgroundColor: colors.muted, opacity: disabled ? 0.5 : 1 },
      ]}
      pointerEvents={disabled ? "none" : "auto"}
    >
      <View style={rowStyles.line}>
        <View style={rowStyles.copy}>
          <View style={rowStyles.titleLine}>
            <ThemedText type="small">{title}</ThemedText>
            {accessory}
          </View>
          {subtitle ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
        <IconButton
          name={{ ios: "minus", android: "remove", web: "remove" }}
          size={18}
          tintColor={colors.foreground}
          accessibilityLabel={t("common.decrease", { label: title })}
          {...limitProps(value <= min)}
          onPress={() => onChange(clamp(value - step))}
        />
        <ThemedText
          type="smallBold"
          style={[styles.value, tv && styles.valueTv]}
          accessibilityLabel={`${title}, ${formatted}`}
        >
          {formatted}
        </ThemedText>
        <IconButton
          name={{ ios: "plus", android: "add", web: "add" }}
          size={18}
          tintColor={colors.foreground}
          accessibilityLabel={t("common.increase", { label: title })}
          {...limitProps(value >= max)}
          onPress={() => onChange(clamp(value + step))}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  value: { minWidth: 96, textAlign: "center" },
  valueTv: { minWidth: tvDp(140) },
  dimmed: { opacity: 0.35 },
});
