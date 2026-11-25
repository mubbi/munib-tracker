import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { TvNumberStepper } from "@/components/tv-number-stepper";
import { Button } from "@/components/ui/button";
import { isNumberInRange, NumberField } from "@/components/ui/number-field";
import { Sheet } from "@/components/ui/sheet";
import { Stepper } from "@/components/ui/stepper";
import { Spacing } from "@/constants/theme";
import { useFormatCount } from "@/hooks/use-format-count";
import { tTv } from "@/lib/i18n/t-tv";
import { isTV } from "@/lib/platform/is-tv";

/** Upper bound shared by the phone field (5 digits) and the TV stepper. */
const MAX_COUNT = 99_999;

type QazaCountEditModalProps = {
  visible: boolean;
  /** Current remaining count (the stored value). */
  initialValue: number;
  /**
   * Instant step (no dialog); the parent writes the absolute value through the
   * store. Steps accumulate on a local value, so quick repeated taps each count
   * even before the store has caught up (B-07).
   */
  onStep: (next: number) => void;
  /** Exact value typed into the field and saved. */
  onSubmit: (remaining: number) => void;
  /** Destructive reset of this counter; the parent confirms it. */
  onReset?: () => void;
  onClose: () => void;
  /** Prayer-specific copy — used when custom `title` is not provided. */
  prayerLabel?: string;
  title?: string;
  hint?: string;
  accessibilityLabel?: string;
  /** Label of the reset button (omit `onReset` to hide it). */
  resetLabel?: string;
  /** Disables the reset button when there is nothing to clear. */
  canReset?: boolean;
};

/**
 * The one Qaza counter editor (prayers and fasts): an instant stepper for small
 * corrections, a number field for an exact value, and a confirmed reset.
 */
export function QazaCountEditModal({
  visible,
  prayerLabel,
  title,
  hint,
  accessibilityLabel,
  initialValue,
  onStep,
  onSubmit,
  onReset,
  onClose,
  resetLabel,
  canReset = true,
}: QazaCountEditModalProps) {
  const { t } = useTranslation();
  const formatCount = useFormatCount();
  const tv = isTV();
  const [draft, setDraft] = useState<number | undefined>(undefined);
  /**
   * Value after the steps taken in this sheet that the store has not reflected
   * yet (`null` = in sync). Each step applies its delta to this, not to the
   * stored value, so two taps before a re-render (or a slow write) are +2.
   */
  const [stepped, setStepped] = useState<number | null>(null);
  const steppedRef = useRef<number | null>(null);
  const shown = stepped ?? initialValue;

  useEffect(() => {
    if (visible) setDraft(undefined);
    steppedRef.current = null;
    setStepped(null);
  }, [visible]);

  // The store caught up with the last step: follow the stored value again.
  useEffect(() => {
    if (steppedRef.current != null && steppedRef.current === initialValue) {
      steppedRef.current = null;
      setStepped(null);
    }
  }, [initialValue]);

  /** Stepper / TV stepper report `shown ± step`; apply that delta to the latest value. */
  const step = (next: number) => {
    const delta = next - shown;
    if (delta === 0) return;
    const base = steppedRef.current ?? initialValue;
    const value = Math.min(MAX_COUNT, Math.max(0, base + delta));
    if (value === base) return;
    steppedRef.current = value;
    setStepped(value);
    onStep(value);
  };

  const resolvedTitle = title ?? t("qaza.editCountTitle", { prayer: prayerLabel ?? "" });
  const resolvedHint = hint ?? tTv(t, "qaza.editCountHint", "qaza.editCountHintTv");
  const resolvedA11y = accessibilityLabel ?? t("qaza.editCountA11y", { prayer: prayerLabel ?? "" });
  // An out-of-range exact value stays as typed with its error; it is never saved (B-03).
  const draftValid = isNumberInRange(draft, 0, MAX_COUNT);
  const canSave = draft != null && draftValid && draft !== shown;

  const save = () => {
    if (!canSave) return;
    onSubmit(draft);
    setDraft(undefined);
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={resolvedTitle}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {resolvedHint}
      </ThemedText>
      <View style={styles.stepperWrap}>
        {tv ? (
          <TvNumberStepper
            value={shown}
            onChange={step}
            label={resolvedA11y}
            max={MAX_COUNT}
            steps={[1, 10, 100, 1000]}
            preferredFocus
          />
        ) : (
          <Stepper
            value={shown}
            onChange={step}
            label={resolvedTitle}
            max={MAX_COUNT}
            formatValue={formatCount}
            valueMinWidth={72}
          />
        )}
      </View>
      {tv ? null : (
        <NumberField
          label={t("qaza.setExactLabel")}
          value={draft}
          onChangeValue={setDraft}
          maxFractionDigits={0}
          allowZero
          min={0}
          max={MAX_COUNT}
          placeholder={formatCount(shown)}
          returnKeyType="done"
          onSubmitEditing={save}
        />
      )}
      <View style={styles.actions}>
        {onReset ? (
          <Button
            label={resetLabel ?? t("common.reset")}
            variant="destructive"
            icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
            disabled={!canReset}
            onPress={onReset}
          />
        ) : null}
        <View style={styles.spacer} />
        {tv ? null : (
          <Button label={t("common.save")} variant="secondary" disabled={!canSave} onPress={save} />
        )}
        <Button label={t("common.done")} onPress={onClose} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  stepperWrap: {
    alignSelf: "center",
    marginVertical: Spacing.two,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  spacer: {
    flex: 1,
  },
});
