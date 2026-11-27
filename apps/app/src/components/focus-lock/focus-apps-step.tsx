import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconSize, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/**
 * Salah focus setup, step 3 ("Apps"). Phone, Messages, emergency calling and
 * Munib Tracker itself are deliberately never blocked (iOS can't shield Phone;
 * Android's `FocusLockAllowlist.kt`; docs/FOCUS_LOCK_FILINGS.md) — this step
 * says so up front instead of leaving people to wonder why calls still ring.
 */

type AlwaysRow = { key: string; icon: SymbolViewProps["name"] };

const ALWAYS_AVAILABLE: readonly AlwaysRow[] = [
  { key: "phone", icon: { ios: "phone.fill", android: "call", web: "call" } },
  { key: "messages", icon: { ios: "message.fill", android: "chat", web: "chat" } },
  { key: "emergency", icon: { ios: "sos", android: "emergency", web: "emergency" } },
  { key: "munib", icon: { ios: "checkmark.seal.fill", android: "verified", web: "verified" } },
];

/** "Always available" card: what Salah focus never pauses, one line of why each. */
export function FocusAlwaysAvailableCard() {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  return (
    <Card style={styles.card} testID="focus-always-available">
      <ThemedText type="smallBold" role="heading">
        {t("focusLock.setup.apps.always.title")}
      </ThemedText>
      {ALWAYS_AVAILABLE.map((row) => (
        <View key={row.key} style={styles.row}>
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <SymbolView name={row.icon} size={IconSize.md} tintColor={colors.accent} />
          </View>
          <View style={styles.rowText}>
            <ThemedText type="small">{t(`focusLock.setup.apps.always.${row.key}`)}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t(`focusLock.setup.apps.always.${row.key}Hint`)}
            </ThemedText>
          </View>
        </View>
      ))}
    </Card>
  );
}

/**
 * iOS: Apple's Screen Time picker returns opaque tokens, and the native module
 * only reports their total (apps + categories + websites — a whole category
 * counts once), so the summary explains what that number means. A full-width
 * "Choose apps" button leads; once something is chosen it becomes the summary
 * plus an "Edit" link.
 */
export function FocusIosAppsPicker({ count, onPick }: { count: number; onPick: () => void }) {
  const { t } = useTranslation();
  if (count <= 0) {
    return (
      <View style={styles.stack}>
        <Button label={t("focusLock.setup.apps.pick")} fullWidth onPress={onPick} />
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("focusLock.setup.apps.noneYet")}
        </ThemedText>
      </View>
    );
  }
  return (
    <Card style={styles.card}>
      <View style={styles.summaryRow}>
        <View style={styles.rowText}>
          <ThemedText type="smallBold" accessibilityLiveRegion="polite">
            {t("focusLock.setup.apps.selectedItems", { count })}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("focusLock.setup.apps.selectedItemsHint")}
          </ThemedText>
        </View>
        <Button
          size="sm"
          variant="ghost"
          label={t("focusLock.setup.apps.edit")}
          accessibilityHint={t("focusLock.setup.apps.editHint")}
          onPress={onPick}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two },
  card: { gap: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  rowText: { flex: 1, gap: Spacing.half },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
});
