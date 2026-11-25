import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSetting } from "@/lib/settings/registry";

/** Read-only information row (motion/contrast follow the OS, widgets, screen readers). */
export function InfoNote({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const def = getSetting(settingId);
  if (!def) return null;
  return (
    <View
      style={[styles.row, { backgroundColor: colors.muted }]}
      accessible
      accessibilityLabel={[t(def.titleKey), def.subtitleKey ? t(def.subtitleKey) : ""]
        .filter(Boolean)
        .join(". ")}
    >
      <SymbolView
        name={{ ios: "info.circle", android: "info", web: "info" }}
        size={18}
        tintColor={colors.mutedForeground}
      />
      <View style={styles.copy}>
        <ThemedText type="small">{t(def.titleKey)}</ThemedText>
        {def.subtitleKey ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t(def.subtitleKey)}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  copy: { flex: 1, gap: Spacing.half },
});
