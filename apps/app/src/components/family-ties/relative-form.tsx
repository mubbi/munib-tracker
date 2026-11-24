import type { Kinship } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ChoiceChips } from "@/components/self-review/choice-chips";
import { TextField } from "@/components/self-review/text-field";
import { VaultStateNotice } from "@/components/self-review/vault-state-notice";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Stepper } from "@/components/ui/stepper";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  familyTiesActions,
  type RelativeInput,
  useFamilyTies,
  useRelative,
} from "@/lib/family-ties/family-ties-store";
import {
  CADENCE_MAX_DAYS,
  CADENCE_MIN_DAYS,
  CADENCE_PRESET_DAYS,
  clampCadence,
  DEFAULT_CADENCE_DAYS,
  KINSHIPS,
  normalizePhone,
  RELATIVE_NAME_MAX_LENGTH,
  RELATIVE_NOTES_MAX_LENGTH,
  relativeToInput,
} from "@/lib/family-ties/model";
import { goBackOrReplace } from "@/lib/navigation";
import { useToast } from "@/providers/toast-provider";

const EMPTY: RelativeInput = {
  name: "",
  kinship: "mother",
  cadenceDays: DEFAULT_CADENCE_DAYS.mother,
};

/** Add / edit form for one relative (route: `/family-ties/edit?id=`). */
export function RelativeForm({ id }: { id: string | undefined }) {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { tokens } = useThemeTokens();
  const { status, error } = useFamilyTies();
  const existing = useRelative(id);
  const [form, setForm] = useState<RelativeInput>(EMPTY);
  const [cadenceTouched, setCadenceTouched] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadedId, setLoadedId] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  // Synchronous double-tap guard (state lands a render later).
  const savingRef = useRef(false);

  useEffect(() => {
    if (existing && loadedId !== existing.id) {
      setForm(relativeToInput(existing));
      setCadenceTouched(true);
      setLoadedId(existing.id);
    }
  }, [existing, loadedId]);

  if (status === "locked" || status === "error") {
    return <VaultStateNotice status={status} error={error} />;
  }
  if (status !== "ready") return null;
  // A stale link (relative deleted, maybe on another device): don't show an
  // "Edit" form that would silently add a new person.
  if (id && !existing) {
    return (
      <EmptyState
        icon={{
          ios: "person.crop.circle.badge.questionmark",
          android: "person_off",
          web: "person_off",
        }}
        title={t("privateUx.familyTies.notFound")}
        actionLabel={t("familyTies.form.cancel")}
        onAction={() => goBackOrReplace(router, "/family-ties")}
      />
    );
  }

  const update = (patch: Partial<RelativeInput>) => setForm((f) => ({ ...f, ...patch }));
  const setKinship = (kinship: Kinship) =>
    update(cadenceTouched ? { kinship } : { kinship, cadenceDays: DEFAULT_CADENCE_DAYS[kinship] });
  const setCadence = (days: number) => {
    setCadenceTouched(true);
    update({ cadenceDays: clampCadence(days) });
  };
  const done = () => goBackOrReplace(router, "/family-ties");

  const phoneInvalid = Boolean(form.phone?.trim()) && normalizePhone(form.phone) == null;

  const save = async () => {
    if (!form.name.trim() || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      if (id && existing) await familyTiesActions.updateRelative(id, form);
      else await familyTiesActions.addRelative(form);
      done();
    } catch {
      // Only a failed save unlocks the form; a saved one is on its way out.
      savingRef.current = false;
      setSaving(false);
      toast.error(t("privateUx.saveFailed"));
    }
  };

  return (
    <View style={styles.stack}>
      <Card padding="three">
        <View style={styles.list}>
          <TextField
            label={t("familyTies.form.name")}
            value={form.name}
            onChangeText={(name) => update({ name })}
            maxLength={RELATIVE_NAME_MAX_LENGTH}
            autoComplete="off"
          />
          <ThemedText type="smallBold">{t("familyTies.form.kinship")}</ThemedText>
          <ChoiceChips<Kinship>
            options={KINSHIPS.map((k) => ({ id: k, label: t(`familyTies.kinship.${k}`) }))}
            value={form.kinship}
            onChange={setKinship}
            accessibilityLabel={t("familyTies.form.kinship")}
          />
          <TextField
            label={t("familyTies.form.phone")}
            hint={phoneInvalid ? undefined : t("familyTies.form.phoneHint")}
            value={form.phone ?? ""}
            onChangeText={(phone) => update({ phone })}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
          {phoneInvalid ? (
            <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
              {t("privateUx.familyTies.phoneInvalid")}
            </ThemedText>
          ) : null}
          {form.deceased ? null : (
            <View style={styles.cadence}>
              <View style={styles.switchRow}>
                <View style={styles.flex}>
                  <ThemedText type="smallBold">{t("familyTies.form.cadence")}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("familyTies.form.cadenceValue", { count: form.cadenceDays })}
                  </ThemedText>
                </View>
                <Stepper
                  value={form.cadenceDays}
                  min={CADENCE_MIN_DAYS}
                  label={t("familyTies.form.cadence")}
                  onDecrement={() => setCadence(form.cadenceDays - 1)}
                  onIncrement={() => setCadence(Math.min(CADENCE_MAX_DAYS, form.cadenceDays + 1))}
                />
              </View>
              {/* Common rhythms in one tap; the stepper fine-tunes (7 → 30 was 23 taps). */}
              <ChoiceChips<string>
                options={CADENCE_PRESET_DAYS.map((days) => ({
                  id: String(days),
                  label: t("familyTies.form.cadenceValue", { count: days }),
                }))}
                value={String(form.cadenceDays)}
                onChange={(days) => setCadence(Number(days))}
                accessibilityLabel={t("familyTies.form.cadence")}
              />
            </View>
          )}
          <TextField
            label={t("familyTies.form.notes")}
            value={form.notes ?? ""}
            onChangeText={(notes) => update({ notes })}
            maxLength={RELATIVE_NOTES_MAX_LENGTH}
            multiline
          />
          {form.deceased ? null : (
            <View style={styles.switchRow}>
              <ThemedText type="small" style={styles.flex}>
                {t("familyTies.form.paused")}
              </ThemedText>
              <ThemedSwitch
                value={Boolean(form.paused)}
                onValueChange={(paused) => update({ paused })}
                accessibilityLabel={t("familyTies.form.paused")}
              />
            </View>
          )}
          <View style={styles.switchRow}>
            <ThemedText type="small" style={styles.flex}>
              {t("familyTies.form.deceased")}
            </ThemedText>
            <ThemedSwitch
              value={Boolean(form.deceased)}
              onValueChange={(deceased) => update({ deceased })}
              accessibilityLabel={t("familyTies.form.deceased")}
            />
          </View>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("familyTies.form.privacy")}
          </ThemedText>
        </View>
      </Card>

      <View style={styles.row}>
        <Button
          label={saving ? t("privateUx.saving") : t("familyTies.form.save")}
          disabled={!form.name.trim() || saving}
          onPress={() => void save()}
        />
        <Button label={t("familyTies.form.cancel")} variant="ghost" onPress={done} />
      </View>
      {/* Destructive action apart from Save / Cancel. */}
      {existing ? (
        <Button
          label={t("familyTies.form.delete")}
          variant="ghost"
          onPress={() => setConfirmDelete(true)}
        />
      ) : null}

      <ConfirmDialog
        visible={confirmDelete}
        title={t("familyTies.form.deleteTitle")}
        message={t("familyTies.form.deleteBody")}
        confirmLabel={t("familyTies.form.delete")}
        destructive
        onConfirm={() => {
          setConfirmDelete(false);
          if (id) void familyTiesActions.removeRelative(id).then(done);
        }}
        onClose={() => setConfirmDelete(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  list: { gap: Spacing.three },
  cadence: { gap: Spacing.two },
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});
