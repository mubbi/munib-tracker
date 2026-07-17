import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { TASBEEH_MODES } from "@/components/tasbeeh/tasbeeh-counter";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
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
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preset, setPreset] = useState<TargetPreset>("33");
  const [customTarget, setCustomTarget] = useState("");

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

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <ThemedText type="subtitle">
        {mode === "create" ? t("tasbeeh.customCreateTitle") : t("tasbeeh.customEditTitle")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("tasbeeh.customFormHint")}
      </ThemedText>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.form}
      >
        <Field label={t("tasbeeh.customTitleLabel")}>
          <TextInput
            value={title}
            onChangeText={(text) => setTitle(text.slice(0, MAX_TITLE))}
            placeholder={t("tasbeeh.customTitlePlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("tasbeeh.customTitleLabel")}
            style={[
              styles.input,
              {
                color: colors.foreground,
                backgroundColor: colors.muted,
                borderColor: colors.border,
              },
            ]}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.counter}>
            {title.length}/{MAX_TITLE}
          </ThemedText>
        </Field>

        <Field label={t("tasbeeh.customDescLabel")}>
          <TextInput
            value={description}
            onChangeText={(text) => setDescription(text.slice(0, MAX_DESCRIPTION))}
            placeholder={t("tasbeeh.customDescPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("tasbeeh.customDescLabel")}
            multiline
            style={[
              styles.input,
              styles.textArea,
              {
                color: colors.foreground,
                backgroundColor: colors.muted,
                borderColor: colors.border,
              },
            ]}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.counter}>
            {description.length}/{MAX_DESCRIPTION}
          </ThemedText>
        </Field>

        <Field label={t("tasbeeh.customTargetLabel")}>
          <View
            accessibilityRole="tablist"
            style={[styles.presetTrack, { backgroundColor: colors.muted }]}
          >
            {presets.map((option) => {
              const active = preset === option.id;
              return (
                <PressableScale
                  key={option.id}
                  haptic="selection"
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  onPress={() => setPreset(option.id)}
                  style={[
                    styles.presetSegment,
                    active && { backgroundColor: tokens.segmentThumb, ...Shadows.sm },
                  ]}
                >
                  <ThemedText
                    type="smallBold"
                    style={{ color: active ? colors.foreground : colors.mutedForeground }}
                  >
                    {option.label}
                  </ThemedText>
                </PressableScale>
              );
            })}
          </View>

          {preset === "custom" ? (
            <TextInput
              value={customTarget}
              onChangeText={(text) =>
                setCustomTarget(text.replace(/[^0-9]/g, "").slice(0, MAX_TARGET_DIGITS))
              }
              keyboardType="number-pad"
              placeholder={t("tasbeehUi.customPlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={t("tasbeehUi.customPlaceholder")}
              style={[
                styles.input,
                styles.customTargetInput,
                {
                  color: colors.foreground,
                  backgroundColor: colors.muted,
                  borderColor: colors.border,
                },
              ]}
            />
          ) : null}
        </Field>
      </ScrollView>

      <View style={styles.actions}>
        <Button label={t("common.cancel")} variant="ghost" onPress={onClose} />
        <Button
          label={mode === "create" ? t("tasbeeh.customCreateAction") : t("common.save")}
          onPress={submit}
          disabled={!canSubmit}
        />
      </View>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      {children}
    </View>
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
  input: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
  },
  textArea: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  counter: {
    alignSelf: "flex-end",
  },
  presetTrack: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: Spacing.half + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.half,
  },
  presetSegment: {
    flexGrow: 1,
    flexBasis: "18%",
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    minHeight: 40,
  },
  customTargetInput: {
    marginTop: Spacing.one,
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
