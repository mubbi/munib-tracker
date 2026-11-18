import type { SymbolViewProps } from "expo-symbols";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { LearnColumnsGrid } from "@/components/jannah/hub-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import type { ZakatCalcSectionId } from "@/lib/zakat-section-info";

type ZakatFormSectionProps = {
  sectionId: ZakatCalcSectionId;
  title: string;
  icon: AppIcon;
  /** Short on-card hint — keep to 1–2 lines; details live in Learn more. */
  hint?: string;
  onLearnMore: (sectionId: ZakatCalcSectionId) => void;
  children: ReactNode;
  /** Optional footer below fields (due summaries, etc.). */
  footer?: ReactNode;
  /** Desktop: lay simple fields out in N columns (default 1 — phone/TV stack). */
  columns?: number;
};

/**
 * One focused calculator card: title, optional short hint, Learn more (Islamic
 * ruling sheet), then fields. Keeps the long form scannable by category.
 */
export function ZakatFormSection({
  sectionId,
  title,
  icon,
  hint,
  onLearnMore,
  children,
  footer,
  columns = 1,
}: ZakatFormSectionProps) {
  const { t } = useTranslation();
  const infoIcon: SymbolViewProps["name"] = {
    ios: "info.circle",
    android: "info",
    web: "info",
  };

  return (
    <Card padding="three">
      <SectionHeader
        title={title}
        icon={icon}
        actionLabel={t("zakat.learnMore")}
        actionIcon={infoIcon}
        actionAccessibilityLabel={t("zakat.sectionInfo.a11y", { section: title })}
        onActionPress={() => onLearnMore(sectionId)}
      />
      {hint ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          {hint}
        </ThemedText>
      ) : null}
      {columns > 1 ? (
        <LearnColumnsGrid columns={columns} gap={Spacing.three} style={styles.gridBody}>
          {children}
        </LearnColumnsGrid>
      ) : (
        <View style={styles.body}>{children}</View>
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two, lineHeight: 20 },
  body: { marginTop: Spacing.three, gap: Spacing.three },
  gridBody: { marginTop: Spacing.three },
  footer: { marginTop: Spacing.three },
});
