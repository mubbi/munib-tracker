import { useTranslation } from "react-i18next";

import { Pill } from "@/components/ui/pill";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/** Marks a setting that only applies to (and is stored on) this device. */
export function ThisDeviceBadge() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <Pill
      compact
      label={t("settingsPanel.thisDevice")}
      color={colors.mutedForeground}
      background={tokens.hairline}
      icon={{ ios: "iphone", android: "smartphone", web: "smartphone" }}
    />
  );
}
