import type { PilgrimageChecklistItem } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

function CheckStep({
  item,
  done,
  onToggle,
}: {
  item: PilgrimageChecklistItem;
  done: boolean;
  onToggle: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={item.title}
      onPress={onToggle}
      scaleTo={0.98}
      haptic="selection"
      style={styles.step}
    >
      <SymbolView
        name={
          done
            ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
            : { ios: "circle", android: "radio_button_unchecked", web: "radio_button_unchecked" }
        }
        size={24}
        tintColor={done ? tokens.status.success.color : colors.mutedForeground}
      />
      <View style={styles.stepCopy}>
        <View style={styles.stepHead}>
          <ThemedText type="smallBold" style={done ? { color: colors.mutedForeground } : undefined}>
            {item.title}
          </ThemedText>
          {item.location ? (
            <Pill
              label={item.location}
              compact
              color={colors.accent}
              background={tokens.accentSoft}
            />
          ) : null}
        </View>
        <ThemedText type="caption" themeColor="mutedForeground">
          {item.hint}
        </ThemedText>
      </View>
    </PressableScale>
  );
}

export function PilgrimageChecklistView({
  items,
  done,
  onToggle,
  onReset,
  progressKeyPrefix = "hajj",
}: {
  items: PilgrimageChecklistItem[];
  done: Record<string, boolean>;
  onToggle: (id: string) => void;
  onReset: () => void;
  /** i18n namespace prefix for progress/reset strings (`hajj.*`). */
  progressKeyPrefix?: "hajj";
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const [resetOpen, setResetOpen] = useState(false);

  const totalSteps = items.length;
  const doneCount = useMemo(() => items.filter((item) => done[item.id]).length, [items, done]);
  const progress = totalSteps > 0 ? doneCount / totalSteps : 0;

  const grouped = useMemo(() => {
    const byDay = new Map<string, PilgrimageChecklistItem[]>();
    for (const item of items) {
      const key = item.day ?? "";
      const list = byDay.get(key) ?? [];
      list.push(item);
      byDay.set(key, list);
    }
    return [...byDay.entries()];
  }, [items]);

  return (
    <>
      <View style={styles.stack}>
        <Card padding="three" style={styles.progressCard}>
          <View style={styles.progressHead}>
            <ThemedText type="smallBold">
              {t(`${progressKeyPrefix}.progress`, { done: doneCount, total: totalSteps })}
            </ThemedText>
            {doneCount > 0 ? (
              <Button
                label={t(`${progressKeyPrefix}.reset`)}
                variant="ghost"
                size="sm"
                onPress={() => setResetOpen(true)}
              />
            ) : null}
          </View>
          <ProgressBar value={progress} height={6} color={tokens.status.success.color} />
        </Card>

        {grouped.map(([day, dayItems]) => (
          <Card key={day || "rites"} padding="three" style={styles.sectionCard}>
            {day ? (
              <ThemedText type="subtitle" style={styles.dayTitle}>
                {day}
              </ThemedText>
            ) : null}
            <View style={styles.steps}>
              {dayItems.map((item) => (
                <CheckStep
                  key={item.id}
                  item={item}
                  done={!!done[item.id]}
                  onToggle={() => onToggle(item.id)}
                />
              ))}
            </View>
          </Card>
        ))}
      </View>

      <ConfirmDialog
        visible={resetOpen}
        title={t(`${progressKeyPrefix}.resetConfirmTitle`)}
        message={t(`${progressKeyPrefix}.resetConfirmMsg`)}
        confirmLabel={t(`${progressKeyPrefix}.reset`)}
        cancelLabel={t("common.cancel")}
        destructive
        onConfirm={() => {
          setResetOpen(false);
          onReset();
        }}
        onCancel={() => setResetOpen(false)}
        onClose={() => setResetOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  /** Match `Stagger` stack gap so checklist cards breathe like other learn screens. */
  stack: { width: "100%", gap: Spacing.four },
  progressCard: { gap: Spacing.two },
  progressHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  sectionCard: { gap: Spacing.three },
  dayTitle: { marginBottom: Spacing.one },
  steps: { gap: Spacing.three },
  step: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.three },
  stepCopy: { flex: 1, gap: Spacing.one },
  stepHead: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
});
