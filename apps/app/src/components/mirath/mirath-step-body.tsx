import type { HeirType, MirathHeirCounts } from "@munib-tracker/shared/mirath";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stepper } from "@/components/ui/stepper";
import { SwitchRow } from "@/components/ui/switch-row";
import { Spacing } from "@/constants/theme";
import { heirLabelKey } from "@/lib/mirath/explain";
import {
  type DeceasedGender,
  heirsForStep,
  isHeirAsked,
  type MirathStepId,
  siblingsOnlyCountForMother,
  totalHeads,
} from "@/lib/mirath/wizard";

type MirathStepBodyProps = {
  step: MirathStepId;
  gender: DeceasedGender;
  onGenderChange: (gender: DeceasedGender) => void;
  /** Raw stepper counts (what the user entered). */
  counts: MirathHeirCounts;
  /** Counts after the deceased's gender is applied (what the engine sees). */
  heirs: MirathHeirCounts;
  onCountChange: (heir: HeirType, value: number) => void;
  confirmed: boolean;
  onConfirmedChange: (confirmed: boolean) => void;
};

/** Body of one wizard step: deceased gender, an heir group's steppers, or the final confirmation. */
export function MirathStepBody({
  step,
  gender,
  onGenderChange,
  counts,
  heirs,
  onCountChange,
  confirmed,
  onConfirmedChange,
}: MirathStepBodyProps) {
  const { t } = useTranslation();

  if (step === "deceased") {
    return (
      <SegmentedControl<DeceasedGender>
        options={[
          { id: "male", label: t("mirath.deceased.male") },
          { id: "female", label: t("mirath.deceased.female") },
        ]}
        value={gender}
        onChange={onGenderChange}
      />
    );
  }

  if (step === "confirm") {
    return (
      <View style={styles.gap}>
        {(["muslim", "alive", "notKiller"] as const).map((k) => (
          <ThemedText key={k} type="small">
            {`• ${t(`mirath.confirm.${k}`)}`}
          </ThemedText>
        ))}
        <SwitchRow
          title={t("mirath.confirm.toggle")}
          value={confirmed}
          onValueChange={onConfirmedChange}
        />
        {totalHeads(heirs) === 0 ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("mirath.confirm.noHeirs")}
          </ThemedText>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.gap}>
      {heirsForStep(step, gender)
        .filter((h) => isHeirAsked(h, counts))
        .map((h) => (
          <View key={h} style={styles.row}>
            <ThemedText type="small" style={styles.flex}>
              {t(heirLabelKey(h))}
            </ThemedText>
            <Stepper
              value={counts[h] ?? 0}
              label={t(heirLabelKey(h))}
              onIncrement={() => onCountChange(h, (counts[h] ?? 0) + 1)}
              onDecrement={() => onCountChange(h, (counts[h] ?? 0) - 1)}
            />
          </View>
        ))}
      {step === "grandparents" ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("mirath.step.grandparents.note")}
        </ThemedText>
      ) : null}
      {step === "siblings" && siblingsOnlyCountForMother(counts) ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("mirath.step.siblings.withFatherNote")}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: Spacing.three },
  flex: { flex: 1, minWidth: 0 },
  // Heir stepper rows and the confirm switch row share one layout.
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
});
