import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward, useIsRTL } from "@/lib/rtl";
import { settingHref } from "@/lib/settings/routes";

type MoreInSettingsLinkProps = {
  /** Setting to focus in its group (`/settings/<group>?focus=<id>`). */
  settingId: string;
  /** Runs before navigating (e.g. close the sheet hosting the link). */
  onNavigate?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * "More in Settings" footer for in-context options sheets and filter cards
 * (§4.5.6): the controls there are shortcuts; the full group lives in Settings.
 */
export function MoreInSettingsLink({ settingId, onNavigate, style }: MoreInSettingsLinkProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useThemeTokens();
  const chevron = useChevronForward();
  const rtl = useIsRTL();
  const tv = isTV();
  const label = t("settingsPanel.moreInSettings");

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="link"
      accessibilityLabel={label}
      accessibilityHint={t("settingsPanel.moreInSettingsHint")}
      onPress={() => {
        onNavigate?.();
        router.push(settingHref(settingId) as Href);
      }}
      style={[styles.row, tv && styles.rowTv, style]}
    >
      <SymbolView
        name={{ ios: "gearshape", android: "settings", web: "settings" }}
        size={tv ? 20 : 16}
        tintColor={colors.accent}
      />
      <ThemedText
        type="small"
        style={[styles.label, { color: colors.accent }, tv && { fontSize: TvLayout.bodyFontSize }]}
      >
        {label}
      </ThemedText>
      <SymbolView
        key={rtl ? "chevron-rtl" : "chevron-ltr"}
        name={chevron}
        size={tv ? 18 : 14}
        tintColor={colors.accent}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.one + 2,
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  rowTv: { minHeight: TvLayout.minFocusTarget, gap: Spacing.two },
  label: { fontWeight: "600" },
});
