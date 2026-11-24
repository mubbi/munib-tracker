import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useFocusPlan } from "@/hooks/use-focus-lock";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { formatPrayerTime } from "@/lib/prayer-times";
import { usePreferences } from "@/stores/preferences-store";

/** Tracker header pill: "Focus active · ends 13:20" (NF-3.13). Renders nothing outside a window. */
export function FocusActiveChip() {
  if (isTV()) return null;
  return <FocusActiveChipInner />;
}

function FocusActiveChipInner() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useThemeTokens();
  const { timeFormat } = usePreferences();
  const { active, prefs } = useFocusPlan();
  if (!prefs.enabled || !active) return null;
  const label = t("focusLock.chip", { time: formatPrayerTime(active.end, timeFormat) });
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => router.push("/focus-lock")}
      style={[styles.chip, { backgroundColor: colors.muted }]}
    >
      <SymbolView
        name={{ ios: "moon.circle.fill", android: "do_not_disturb_on", web: "do_not_disturb_on" }}
        size={16}
        tintColor={colors.accent}
      />
      <ThemedText type="smallBold">{label}</ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: Radius.pill,
    flexDirection: "row",
    gap: Spacing.two,
    marginBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});
