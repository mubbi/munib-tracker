import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const CHEVRON_DOWN = {
  ios: "chevron.down",
  android: "keyboard_arrow_down",
  web: "keyboard_arrow_down",
} as const;

/** A section that starts folded behind its header (long, rarely-changed lists). */
export interface SectionDisclosure {
  open: boolean;
  onToggle: () => void;
  /** Shown beside the title while folded, e.g. "2 customised". */
  summary?: string;
}

/**
 * Section inside a settings group (§4.5.5): header, optional reset action,
 * rows, optional footer note. Replaces ad-hoc Card + SectionHeader stacks.
 * With `disclosure` the header becomes a toggle and the rows show only when
 * open (progressive disclosure for per-prayer steppers and toggles).
 */
export function SettingsSection({
  title,
  footer,
  action,
  disclosure,
  children,
}: {
  title: string;
  footer?: string;
  /** Trailing header control, e.g. `ResetSectionButton` (shown while open). */
  action?: ReactNode;
  disclosure?: SectionDisclosure;
  children: ReactNode;
}) {
  const open = disclosure?.open ?? true;
  return (
    <Card padding="three">
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          {disclosure ? (
            <DisclosureHeader title={title} disclosure={disclosure} />
          ) : (
            <SectionHeader title={title} />
          )}
        </View>
        {open ? action : null}
      </View>
      {open ? <View style={styles.rows}>{children}</View> : null}
      {open && footer ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
          {footer}
        </ThemedText>
      ) : null}
    </Card>
  );
}

function DisclosureHeader({ title, disclosure }: { title: string; disclosure: SectionDisclosure }) {
  const { colors } = useThemeTokens();
  const { open, onToggle, summary } = disclosure;
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={summary && !open ? `${title}, ${summary}` : title}
      accessibilityState={{ expanded: open }}
      scaleTo={0.99}
      onPress={onToggle}
      style={styles.disclosure}
    >
      <View style={styles.disclosureText}>
        <SectionHeader title={title} />
        {summary && !open ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {summary}
          </ThemedText>
        ) : null}
      </View>
      <SymbolView
        name={CHEVRON_DOWN}
        size={16}
        tintColor={colors.mutedForeground}
        style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  headerTitle: { flex: 1, minWidth: 0 },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  footer: { marginTop: Spacing.three },
  disclosure: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 44,
  },
  disclosureText: { flex: 1, minWidth: 0, gap: Spacing.half },
});
