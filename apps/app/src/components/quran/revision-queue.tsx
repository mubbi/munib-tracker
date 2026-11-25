import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { DueItem } from "@/lib/quran-companion/due-queue";
import type { MemorizationRecord } from "@/lib/quran-companion/types";
import { getSurahByNumber } from "@/lib/quran-meta";

/** One row per due ayah (§9.4). Tap to practise it; "Not now" pushes it to tomorrow. */
export function RevisionQueue({
  items,
  records,
  hifz,
  onOpen,
  onNotNow,
  onStatus,
}: {
  items: DueItem[];
  records: Record<string, MemorizationRecord>;
  hifz: Record<string, "memorized" | "review">;
  onOpen: (item: DueItem) => void;
  onNotNow: (item: DueItem) => void;
  onStatus: (item: DueItem) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  // Phone: one column. Tablet / desktop: two due-ayah cards per row.
  return (
    <ResponsiveGrid gap={Spacing.two} maxColumns={2}>
      {items.map((item) => {
        const record = records[item.key];
        const name = getSurahByNumber(item.surah)?.nameTransliteration ?? String(item.surah);
        const status = record?.status;
        const pill =
          status === "needs_revision"
            ? {
                label: t("quranCompanion.revision.status.needsRevision"),
                color: tokens.status.danger.onSoft,
                bg: tokens.status.danger.soft,
              }
            : status === "practising"
              ? {
                  label: t("quranCompanion.revision.status.practising"),
                  color: tokens.status.success.onSoft,
                  bg: tokens.status.success.soft,
                }
              : status === "learning"
                ? {
                    label: t("quranCompanion.revision.status.learning"),
                    color: tokens.status.info.onSoft,
                    bg: tokens.status.info.soft,
                  }
                : {
                    label: t("quran.actionReview"),
                    color: tokens.status.warning.onSoft,
                    bg: tokens.status.warning.soft,
                  };
        return (
          <View key={item.key} style={[styles.row, { backgroundColor: colors.muted }]}>
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t("quranCompanion.revision.practiseRow", {
                surah: name,
                ayah: item.ayah,
              })}
              onPress={() => onOpen(item)}
              style={styles.rowMain}
            >
              <View style={styles.rowTitle}>
                <ThemedText type="small" numberOfLines={1} style={styles.flex}>
                  {t("quranCompanion.passage.single", { surah: name, ayah: item.ayah })}
                </ThemedText>
                <Pill label={pill.label} color={pill.color} background={pill.bg} compact />
              </View>
              <ThemedText type="caption" themeColor="mutedForeground">
                {item.overdueDays > 0
                  ? t("quranCompanion.revision.overdue", { count: item.overdueDays })
                  : t("quranCompanion.revision.dueToday")}
                {hifz[item.key] === "memorized"
                  ? ` · ${t("quranCompanion.revision.markedMemorized")}`
                  : ""}
              </ThemedText>
            </PressableScale>
            <View style={styles.actions}>
              <Button
                label={t("quranCompanion.revision.notNow")}
                variant="ghost"
                size="sm"
                onPress={() => onNotNow(item)}
              />
              <Button
                label={t("quranCompanion.revision.setStatus")}
                variant="ghost"
                size="sm"
                onPress={() => onStatus(item)}
              />
            </View>
          </View>
        );
      })}
    </ResponsiveGrid>
  );
}

const styles = StyleSheet.create({
  row: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.one,
  },
  rowMain: { gap: Spacing.half },
  rowTitle: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1, minWidth: 0 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: Spacing.one },
});
