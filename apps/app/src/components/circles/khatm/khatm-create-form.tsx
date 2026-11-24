import {
  CIRCLE_LIMITS,
  type KhatmAssignmentMode,
  type KhatmUnit,
} from "@munib-tracker/shared/circles";
import { masjidKey } from "@munib-tracker/shared/masjid";
import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import {
  type CircleDetail,
  type CreateKhatmInput,
  createCircle,
  createKhatm,
  type KhatmDetail,
} from "@/lib/circles/api";
import { useCircleMutation } from "@/lib/circles/hooks";
import { assignmentModeHintKey, classifyKhatmError, khatmErrorKey } from "@/lib/circles/khatm";
import { useHomeMasjid } from "@/lib/masjid/home-masjid";
import { useToast } from "@/providers/toast-provider";

type DeadlineChoice = "none" | "7" | "14" | "30";

/**
 * Start a group khatm (NF-3.18). Without `circleId` it also creates the khatm
 * group (guests may do this). Unit defaults to 30 juz (locked); 60 hizb and
 * 114 surahs are optional. Assignment: self-pick (default), round-robin, or
 * creator assigns. A home masjid may be tagged — display only.
 */
export function KhatmCreateForm({
  circleId,
  onCreated,
}: {
  circleId?: string;
  onCreated: (result: { circleId: string; khatm: KhatmDetail }) => void;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const home = useHomeMasjid();
  const [groupName, setGroupName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("");
  const [intention, setIntention] = useState("");
  const [unit, setUnit] = useState<KhatmUnit>("juz");
  const [mode, setMode] = useState<KhatmAssignmentMode>("self_pick");
  const [deadline, setDeadline] = useState<DeadlineChoice>("none");
  const [tagMasjid, setTagMasjid] = useState(false);

  const makeCircle = useCircleMutation((token, input: Parameters<typeof createCircle>[1]) =>
    createCircle(token, input),
  );
  const makeKhatm = useCircleMutation(
    (token, vars: { circleId: string; input: CreateKhatmInput }) =>
      createKhatm(token, vars.circleId, vars.input),
  );
  const busy = makeCircle.isPending || makeKhatm.isPending;
  const khatmTitle = title.trim() || t("khatmGroups.create.defaultTitle");

  const submit = async () => {
    try {
      let target = circleId;
      if (!target) {
        const created: CircleDetail = await makeCircle.mutateAsync({
          type: "khatm_group",
          name: groupName.trim() || khatmTitle,
          ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
          ...(tagMasjid && home ? { masjidOsmRef: masjidKey(home) } : {}),
        });
        target = created.id;
      }
      const input: CreateKhatmInput = {
        title: khatmTitle,
        unit,
        assignmentMode: mode,
        ...(intention.trim() ? { intention: intention.trim() } : {}),
        ...(deadline !== "none"
          ? { deadline: addDays(getLocalDateString(), Number(deadline)) }
          : {}),
      };
      const khatm = await makeKhatm.mutateAsync({ circleId: target, input });
      onCreated({ circleId: target, khatm });
    } catch (error) {
      toast.error(t(khatmErrorKey(classifyKhatmError(error))));
    }
  };

  return (
    <View style={styles.stack}>
      <Card padding="three" style={styles.gap}>
        {!circleId ? (
          <>
            <LabeledInput
              label={t("khatmGroups.create.groupName")}
              placeholder={t("khatmGroups.create.groupNamePlaceholder")}
              value={groupName}
              onChangeText={setGroupName}
              maxLength={CIRCLE_LIMITS.nameMaxLength}
            />
            <LabeledInput
              label={t("circleMembership.nameLabel")}
              hint={t("circleMembership.nameHint")}
              value={displayName}
              onChangeText={setDisplayName}
              maxLength={CIRCLE_LIMITS.displayNameMaxLength}
            />
          </>
        ) : null}
        <LabeledInput
          label={t("khatmGroups.create.title")}
          placeholder={t("khatmGroups.create.defaultTitle")}
          value={title}
          onChangeText={setTitle}
          maxLength={CIRCLE_LIMITS.khatmTitleMaxLength}
        />
        <LabeledInput
          label={t("khatmGroups.create.intention")}
          hint={t("khatmGroups.create.intentionHint")}
          value={intention}
          onChangeText={setIntention}
          maxLength={CIRCLE_LIMITS.khatmIntentionMaxLength}
          multiline
        />
      </Card>

      <Card padding="three" style={styles.gap}>
        <ThemedText type="smallBold">{t("khatmGroups.create.unit")}</ThemedText>
        <SegmentedControl<KhatmUnit>
          options={[
            { id: "juz", label: t("khatmGroups.unit.juz") },
            { id: "hizb", label: t("khatmGroups.unit.hizb") },
            { id: "surah", label: t("khatmGroups.unit.surah") },
          ]}
          value={unit}
          onChange={setUnit}
        />
        <ThemedText type="smallBold">{t("khatmGroups.create.mode")}</ThemedText>
        <SegmentedControl<KhatmAssignmentMode>
          options={[
            { id: "self_pick", label: t("khatmGroups.mode.self_pick") },
            { id: "round_robin", label: t("khatmGroups.mode.round_robin") },
            { id: "creator_assigns", label: t("khatmGroups.mode.creator_assigns") },
          ]}
          value={mode}
          onChange={setMode}
        />
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(assignmentModeHintKey(mode))}
        </ThemedText>
        <ThemedText type="smallBold">{t("khatmGroups.create.deadline")}</ThemedText>
        <SegmentedControl<DeadlineChoice>
          options={[
            { id: "none", label: t("khatmGroups.create.deadlineNone") },
            { id: "7", label: t("khatmGroups.create.deadlineDays", { count: 7 }) },
            { id: "14", label: t("khatmGroups.create.deadlineDays", { count: 14 }) },
            { id: "30", label: t("khatmGroups.create.deadlineDays", { count: 30 }) },
          ]}
          value={deadline}
          onChange={setDeadline}
        />
        {!circleId && home ? (
          <View style={styles.switchRow}>
            <View style={styles.switchText}>
              <ThemedText type="smallBold">{t("khatmGroups.create.tagMasjid")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("khatmGroups.create.tagMasjidHint", {
                  name: home.name ?? t("khatmGroups.create.homeMasjid"),
                })}
              </ThemedText>
            </View>
            <ThemedSwitch
              value={tagMasjid}
              onValueChange={setTagMasjid}
              accessibilityLabel={t("khatmGroups.create.tagMasjid")}
            />
          </View>
        ) : null}
      </Card>

      <Card padding="three" style={styles.gap}>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("khatmGroups.intentionNote.body")}
        </ThemedText>
      </Card>

      <Button
        label={t("khatmGroups.create.submit")}
        disabled={busy}
        onPress={() => void submit()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  switchText: { flex: 1, gap: Spacing.half },
});
