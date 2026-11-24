import type { ReactNode } from "react";
import { useState } from "react";
import { View } from "react-native";

import { WallClockPicker } from "@/components/ui/wall-clock-picker";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useTimeFormat } from "@/hooks/use-time-format";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { formatHhMm, formatStoredTime, parseHhMm } from "@/lib/time";

import { rowStyles } from "./row-styles";
import { SettingsRow } from "./settings-rows";

/**
 * HH:mm row (§4.5.5): shows the time in the user's clock format and expands an
 * inline wall-clock picker on tap (bedtime moved here from its own screen).
 */
export function TimeRow({
  icon,
  title,
  subtitle,
  accessory,
  value,
  fallback = { hour: 22, minute: 30 },
  onChange,
  disabled,
  initiallyOpen = false,
}: {
  icon?: AppIcon;
  title: string;
  subtitle?: string;
  accessory?: ReactNode;
  value: string;
  fallback?: { hour: number; minute: number };
  onChange: (hhMm: string) => void;
  disabled?: boolean;
  initiallyOpen?: boolean;
}) {
  const { colors } = useThemeTokens();
  const timeFormat = useTimeFormat();
  const [open, setOpen] = useState(initiallyOpen);
  const parsed = parseHhMm(value, fallback);
  return (
    <View style={[open && rowStyles.block, open && { backgroundColor: colors.muted }]}>
      <SettingsRow
        icon={icon}
        title={title}
        subtitle={subtitle}
        accessory={accessory}
        value={formatStoredTime(value, timeFormat, fallback)}
        disabled={disabled}
        showChevron={false}
        onPress={() => setOpen((o) => !o)}
      />
      {open && !disabled ? (
        <WallClockPicker
          value={parsed}
          onChange={(next) => onChange(formatHhMm(next.hour, next.minute))}
        />
      ) : null}
    </View>
  );
}
