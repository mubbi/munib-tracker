import type { ReactNode } from "react";
import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

import { rowStyles } from "./row-styles";

/** Short single choice (2–4 options) inline in a row (§4.5.5). */
export function SegmentedRow<V>({
  title,
  subtitle,
  accessory,
  options,
  value,
  onChange,
  disabled,
}: {
  title: string;
  subtitle?: string;
  accessory?: ReactNode;
  options: readonly { value: V; label: string }[];
  value: V;
  onChange: (value: V) => void;
  disabled?: boolean;
}) {
  const { colors } = useThemeTokens();
  // SegmentedControl keys by string id; map values through their index.
  const ids = options.map((_, i) => String(i));
  const index = options.findIndex((o) => Object.is(o.value, value));
  return (
    <View
      style={[
        rowStyles.block,
        isTV() && rowStyles.blockTv,
        { backgroundColor: colors.muted, opacity: disabled ? 0.5 : 1 },
      ]}
      pointerEvents={disabled ? "none" : "auto"}
    >
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
      <SegmentedControl<string>
        options={options.map((o, i) => ({ id: ids[i], label: o.label }))}
        value={index === -1 ? "" : ids[index]}
        onChange={(id) => {
          const next = options[Number(id)];
          if (next) onChange(next.value);
        }}
      />
    </View>
  );
}
