import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";

/**
 * Section inside a settings group (§4.5.5): header, optional reset action,
 * rows, optional footer note. Replaces ad-hoc Card + SectionHeader stacks.
 */
export function SettingsSection({
  title,
  footer,
  action,
  children,
}: {
  title: string;
  footer?: string;
  /** Trailing header control, e.g. `ResetSectionButton`. */
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card padding="three">
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <SectionHeader title={title} />
        </View>
        {action}
      </View>
      <View style={styles.rows}>{children}</View>
      {footer ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
          {footer}
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  headerTitle: { flex: 1, minWidth: 0 },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  footer: { marginTop: Spacing.three },
});
