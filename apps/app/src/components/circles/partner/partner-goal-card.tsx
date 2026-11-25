import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stepper } from "@/components/ui/stepper";
import { Spacing } from "@/constants/theme";
import {
  PARTNER_GOAL_LABEL_MAX,
  PARTNER_GOAL_PAGES,
  type PartnerGoal,
  type PartnerGoalKind,
} from "@/lib/circles/partner";

/** Localized one-line description of a private goal (shown only to its owner). */
export function partnerGoalText(goal: PartnerGoal, t: TFunction): string {
  switch (goal.kind) {
    case "fard5":
      return t("partnerCircle.goal.kind.fard5");
    case "wird":
      return t("partnerCircle.goal.kind.wird");
    case "quranPages":
      return t("partnerCircle.goal.pagesValue", { count: goal.pages });
    case "custom":
      return goal.label;
  }
}

/**
 * "My daily goal" + today's share. The goal never leaves the device; the only
 * thing shared is "done" for today, and only when the member taps it.
 */
export function PartnerGoalCard({
  goal,
  onSaveGoal,
  sharedToday,
  paused,
  looksMet,
  excused,
  busy,
  readOnly,
  onShare,
  onUnshare,
}: {
  goal: PartnerGoal | null;
  onSaveGoal: (goal: PartnerGoal) => void;
  sharedToday: boolean;
  paused: boolean;
  looksMet: boolean;
  excused: boolean;
  busy: boolean;
  readOnly?: boolean;
  onShare: () => void;
  onUnshare: () => void;
}) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(goal == null);
  const [kind, setKind] = useState<PartnerGoalKind>(goal?.kind ?? "fard5");
  const [pages, setPages] = useState(
    goal?.kind === "quranPages" ? goal.pages : PARTNER_GOAL_PAGES.default,
  );
  const [label, setLabel] = useState(goal?.kind === "custom" ? goal.label : "");

  useEffect(() => {
    if (goal == null) setEditing(true);
  }, [goal]);

  const save = () => {
    const next: PartnerGoal =
      kind === "quranPages"
        ? { kind, pages }
        : kind === "custom"
          ? { kind, label: label.trim() }
          : { kind };
    onSaveGoal(next);
    setEditing(false);
  };

  return (
    <Card style={styles.card}>
      <SectionHeader
        title={t("partnerCircle.goal.title")}
        subtitle={t("partnerCircle.goal.private")}
        icon={{ ios: "lock.fill", android: "lock", web: "lock" }}
        actionLabel={!editing && goal && !readOnly ? t("partnerCircle.goal.edit") : undefined}
        onActionPress={() => setEditing(true)}
      />

      {editing && !readOnly ? (
        <View style={styles.stack}>
          <SegmentedControl<PartnerGoalKind>
            options={[
              { id: "fard5", label: t("partnerCircle.goal.kindShort.fard5") },
              { id: "wird", label: t("partnerCircle.goal.kindShort.wird") },
              { id: "quranPages", label: t("partnerCircle.goal.kindShort.quranPages") },
              { id: "custom", label: t("partnerCircle.goal.kindShort.custom") },
            ]}
            value={kind}
            onChange={setKind}
          />
          {kind === "quranPages" ? (
            <View style={styles.row}>
              <ThemedText type="small">{t("partnerCircle.goal.pagesLabel")}</ThemedText>
              <Stepper
                value={pages}
                min={PARTNER_GOAL_PAGES.min}
                label={t("partnerCircle.goal.pagesLabel")}
                onIncrement={() => setPages((p) => Math.min(PARTNER_GOAL_PAGES.max, p + 1))}
                onDecrement={() => setPages((p) => Math.max(PARTNER_GOAL_PAGES.min, p - 1))}
              />
            </View>
          ) : null}
          {kind === "custom" ? (
            <LabeledInput
              label={t("partnerCircle.goal.customLabel")}
              hint={t("partnerCircle.goal.customHint")}
              value={label}
              onChangeText={setLabel}
              maxLength={PARTNER_GOAL_LABEL_MAX}
            />
          ) : null}
          <Button
            label={t("partnerCircle.goal.save")}
            onPress={save}
            disabled={kind === "custom" && !label.trim()}
          />
        </View>
      ) : goal ? (
        <ThemedText type="default" testID="partner-goal-text">
          {partnerGoalText(goal, t)}
        </ThemedText>
      ) : null}

      <View style={styles.today}>
        <ThemedText type="smallBold">{t("partnerCircle.today.title")}</ThemedText>
        {paused ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("partnerCircle.today.pausedNote")}
          </ThemedText>
        ) : sharedToday ? (
          <>
            <ThemedText type="small" themeColor="mutedForeground" testID="partner-shared-today">
              {t("partnerCircle.today.shared")}
            </ThemedText>
            {readOnly ? null : (
              <Button
                size="sm"
                variant="ghost"
                label={t("partnerCircle.today.unshare")}
                onPress={onUnshare}
                disabled={busy}
              />
            )}
          </>
        ) : (
          <>
            <ThemedText type="small" themeColor="mutedForeground">
              {excused
                ? t("partnerCircle.today.excusedNote")
                : looksMet
                  ? t("partnerCircle.today.looksMet")
                  : t("partnerCircle.today.notShared")}
            </ThemedText>
            {readOnly ? null : (
              <Button
                label={t("partnerCircle.today.share")}
                accessibilityHint={t("partnerCircle.today.shareHint")}
                onPress={onShare}
                disabled={busy}
                icon={{
                  ios: "checkmark.circle.fill",
                  android: "check_circle",
                  web: "check_circle",
                }}
              />
            )}
          </>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  stack: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  today: { gap: Spacing.two },
});
