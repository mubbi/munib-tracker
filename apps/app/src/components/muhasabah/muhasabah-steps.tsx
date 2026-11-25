import type {
  MuhasabahAnswer,
  MuhasabahConfig,
  MuhasabahPromptId,
  ZikrItem,
} from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ReadingCard } from "@/components/content/reading-card";
import { ChoiceChips } from "@/components/self-review/choice-chips";
import { TextField } from "@/components/self-review/text-field";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { SwitchRow as DsSwitchRow } from "@/components/ui/switch-row";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { hasUnloggedFard, type MuhasabahStep } from "@/lib/muhasabah/flow";
import type { MuhasabahSalahRecap } from "@/lib/muhasabah/logic";
import {
  MUHASABAH_ANSWERS,
  MUHASABAH_NOTE_MAX_LENGTH,
  type MuhasabahDraft,
} from "@/lib/muhasabah/model";

import { muhasabahPromptLabel } from "./prompt-label";

/** Screen 1 (read-only): tonight's Salah from the tracker, or rest copy on an excused day. */
function SalahRecap({ recap }: { recap: MuhasabahSalahRecap }) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  if (recap.excusedReason) {
    return (
      <ThemedText type="small">
        {t("muhasabah.salah.excused", {
          reason: t(`tracker.excusedReason.${recap.excusedReason}`),
        })}
      </ThemedText>
    );
  }
  return (
    <View style={styles.gap}>
      <ThemedText type="smallBold" style={{ color: tokens.status.success.text }}>
        {t("muhasabah.salah.onTime", { count: recap.fardOnTime, total: recap.fardTotal })}
      </ThemedText>
      {recap.fardLate > 0 ? (
        <ThemedText type="small">{t("muhasabah.salah.late", { count: recap.fardLate })}</ThemedText>
      ) : null}
      <ThemedText type="small">
        {t("muhasabah.salah.voluntary", { count: recap.voluntary })}
      </ThemedText>
      {hasUnloggedFard(recap) ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("muhasabah.salah.gentle")}
        </ThemedText>
      ) : null}
    </View>
  );
}

type MuhasabahStepBodyProps = {
  step: MuhasabahStep;
  draft: MuhasabahDraft;
  onDraftChange: (patch: Partial<MuhasabahDraft>) => void;
  onAnswer: (id: MuhasabahPromptId, answer: MuhasabahAnswer) => void;
  config: MuhasabahConfig;
  recap: MuhasabahSalahRecap;
  istighfar: ZikrItem | undefined;
  /** "Alhamdulillah" was tapped on the gratitude screen (UI only, not saved). */
  thanked: boolean;
  onThank: () => void;
};

/** The body of one review screen (below its title + intro). */
export function MuhasabahStepBody({
  step,
  draft,
  onDraftChange: update,
  onAnswer,
  config,
  recap,
  istighfar,
  thanked,
  onThank,
}: MuhasabahStepBodyProps) {
  const { t } = useTranslation();

  switch (step) {
    case "salah":
      return <SalahRecap recap={recap} />;

    case "prompts": {
      const answerOptions = MUHASABAH_ANSWERS.map((id) => ({
        id,
        label: t(`muhasabah.answers.${id}`),
      }));
      return (
        <>
          {config.prompts.map((id) => {
            const label = muhasabahPromptLabel(t, id, config);
            return (
              <View key={id} style={styles.prompt}>
                <ThemedText type="smallBold">{label}</ThemedText>
                <ChoiceChips
                  options={answerOptions}
                  value={draft.answers[id]}
                  onChange={(answer) => onAnswer(id, answer)}
                  accessibilityLabel={label}
                />
              </View>
            );
          })}
        </>
      );
    }

    case "gratitude":
      return (
        <View style={styles.gap}>
          <TextField
            label={t("muhasabah.gratitudeLabel")}
            value={draft.gratitude}
            onChangeText={(gratitude) => update({ gratitude })}
            placeholder={t("muhasabah.gratitudePlaceholder")}
            maxLength={MUHASABAH_NOTE_MAX_LENGTH}
          />
          <Button
            label={thanked ? t("muhasabah.alhamdulillahDone") : t("muhasabah.alhamdulillah")}
            variant={thanked ? "secondary" : "primary"}
            onPress={onThank}
          />
        </View>
      );

    case "repent":
      return (
        <View style={styles.gap}>
          <DsSwitchRow
            title={t("muhasabah.repentToggle")}
            value={draft.repented}
            onValueChange={(repented) => update({ repented })}
          />
          {draft.repented && config.prefs.saveRepentText ? (
            <TextField
              label={t("muhasabah.repentLabel")}
              hint={t("muhasabah.repentHint")}
              value={draft.repentNote}
              onChangeText={(repentNote) => update({ repentNote })}
              maxLength={MUHASABAH_NOTE_MAX_LENGTH}
              multiline
            />
          ) : null}
          {draft.repented && !config.prefs.saveRepentText ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("muhasabah.repentFactOnly")}
            </ThemedText>
          ) : null}
          {istighfar ? <ReadingCard item={istighfar} enableContextMenu={false} /> : null}
          <DsSwitchRow
            title={t("muhasabah.readIstighfar")}
            value={draft.readIstighfar}
            onValueChange={(readIstighfar) => update({ readIstighfar })}
          />
        </View>
      );

    case "intention":
      return (
        <TextField
          label={t("muhasabah.intentionLabel")}
          hint={t("muhasabah.intentionHint")}
          value={draft.intention}
          onChangeText={(intention) => update({ intention })}
          placeholder={t("muhasabah.intentionPlaceholder")}
          maxLength={MUHASABAH_NOTE_MAX_LENGTH}
        />
      );
  }
}

const styles = StyleSheet.create({
  gap: { gap: Spacing.two },
  prompt: { gap: Spacing.one, marginTop: Spacing.two },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});
