import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TASBEEH_MODES } from "@/components/tasbeeh/tasbeeh-counter";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Sheet } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Spacing } from "@/constants/theme";
import type { CustomTasbeehInput } from "@/stores/custom-tasbeeh-store";

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 200;
const MAX_TARGET_DIGITS = 5;

export type CustomTasbeehFormValues = CustomTasbeehInput;

type CustomTasbeehFormModalProps = {
  visible: boolean;
  mode: "create" | "edit";
  initial?: CustomTasbeehFormValues;
  onSubmit: (values: CustomTasbeehFormValues) => void;
  onClose: () => void;
};

type TargetPreset = "33" | "99" | "100" | "unlimited" | "custom";

function presetForTarget(target: number, modes: typeof TASBEEH_MODES): TargetPreset {
  if (target === 0) return "unlimited";
  const match = modes.find((mode) => mode.target === target);
  if (match) return String(match.target) as TargetPreset;
  return "custom";
}

export function CustomTasbeehFormModal({
  visible,
  mode,
  initial,
  onSubmit,
  onClose,
}: CustomTasbeehFormModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preset, setPreset] = useState<TargetPreset>("33");
  const [customTarget, setCustomTarget] = useState("");
  const [discardOpen, setDiscardOpen] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const target = initial?.target ?? 33;
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setPreset(presetForTarget(target, TASBEEH_MODES));
    setCustomTarget(presetForTarget(target, TASBEEH_MODES) === "custom" ? String(target) : "");
  }, [visible, initial]);

  const resolvedTarget = useMemo(() => {
    if (preset === "unlimited") return 0;
    if (preset === "custom") {
      const parsed = Number.parseInt(customTarget, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }
    return Number.parseInt(preset, 10);
  }, [preset, customTarget]);

  const titleValid = title.trim().length > 0;
  const targetValid = preset !== "custom" || resolvedTarget > 0;
  const canSubmit = titleValid && targetValid;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      target: resolvedTarget,
    });
    onClose();
  };

  const presets: Array<{ id: TargetPreset; label: string }> = [
    ...TASBEEH_MODES.map((modeItem) => ({
      id: (modeItem.target === 0 ? "unlimited" : String(modeItem.target)) as TargetPreset,
      label: modeItem.target === 0 ? t("tasbeehUi.unlimited") : modeItem.label,
    })),
    { id: "custom", label: t("tasbeehUi.custom") },
  ];

  // Unsaved edits are never dropped silently (backdrop, swipe, Cancel).
  const initialTarget = initial?.target ?? 33;
  const dirty =
    title !== (initial?.title ?? "") ||
    description !== (initial?.description ?? "") ||
    preset !== presetForTarget(initialTarget, TASBEEH_MODES) ||
    (preset === "custom" && customTarget !== String(initialTarget));
  const requestClose = () => {
    if (dirty) setDiscardOpen(true);
    else onClose();
  };

  return (
    <>
      <Sheet
        accessibilityLabel={
          mode === "create" ? t("tasbeeh.customCreateTitle") : t("tasbeeh.customEditTitle")
        }
        visible={visible}
        onClose={requestClose}
        variant="bottom"
      >
        <ThemedText type="subtitle">
          {mode === "create" ? t("tasbeeh.customCreateTitle") : t("tasbeeh.customEditTitle")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("tasbeeh.customFormHint")}
        </ThemedText>

        <TvScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.form}
        >
          <TextField
            label={t("tasbeeh.customTitleLabel")}
            required
            value={title}
            onChangeText={(text) => setTitle(text.slice(0, MAX_TITLE))}
            placeholder={t("tasbeeh.customTitlePlaceholder")}
            maxLength={MAX_TITLE}
            returnKeyType="next"
          />

          <TextField
            label={t("tasbeeh.customDescLabel")}
            value={description}
            onChangeText={(text) => setDescription(text.slice(0, MAX_DESCRIPTION))}
            placeholder={t("tasbeeh.customDescPlaceholder")}
            maxLength={MAX_DESCRIPTION}
            multiline
            minLines={3}
          />

          <View style={styles.field}>
            <ThemedText type="smallBold">{t("tasbeeh.customTargetLabel")}</ThemedText>
            <SegmentedControl
              tabs
              options={presets}
              value={preset}
              onChange={setPreset}
              accessibilityLabel={t("tasbeeh.customTargetLabel")}
            />

            {preset === "custom" ? (
              <TextField
                label={t("tasbeehUi.customPlaceholder")}
                value={customTarget}
                onChangeText={(text) =>
                  setCustomTarget(text.replace(/[^0-9]/g, "").slice(0, MAX_TARGET_DIGITS))
                }
                keyboardType="number-pad"
                placeholder={t("tasbeehUi.customPlaceholder")}
                inputStyle={styles.customTargetInput}
                style={styles.customTarget}
              />
            ) : null}
          </View>
        </TvScrollView>

        <View style={styles.actions}>
          <Button label={t("common.cancel")} variant="ghost" onPress={requestClose} />
          <Button
            label={mode === "create" ? t("tasbeeh.customCreateAction") : t("common.save")}
            onPress={submit}
            disabled={!canSubmit}
          />
        </View>
      </Sheet>
      <ConfirmDialog
        visible={discardOpen}
        title={t("common.discardTitle")}
        message={t("common.discardMessage")}
        confirmLabel={t("common.discard")}
        cancelLabel={t("common.keepEditing")}
        destructive
        onConfirm={() => {
          setDiscardOpen(false);
          onClose();
        }}
        onClose={() => setDiscardOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  field: {
    gap: Spacing.one,
  },
  customTarget: {
    marginTop: Spacing.one,
  },
  customTargetInput: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
