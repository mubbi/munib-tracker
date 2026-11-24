import type { Kinship } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ChoiceChips } from "@/components/self-review/choice-chips";
import { TextField } from "@/components/self-review/text-field";
import { VaultStateNotice } from "@/components/self-review/vault-state-notice";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import {
  familyTiesActions,
  type RelativeInput,
  useFamilyTies,
  useRelative,
} from "@/lib/family-ties/family-ties-store";
import {
  CADENCE_MAX_DAYS,
  CADENCE_MIN_DAYS,
  clampCadence,
  DEFAULT_CADENCE_DAYS,
  KINSHIPS,
  RELATIVE_NAME_MAX_LENGTH,
  RELATIVE_NOTES_MAX_LENGTH,
  relativeToInput,
} from "@/lib/family-ties/model";
import { goBackOrReplace } from "@/lib/navigation";

const EMPTY: RelativeInput = {
  name: "",
  kinship: "mother",
  cadenceDays: DEFAULT_CADENCE_DAYS.mother,
};

/** Add / edit form for one relative (route: `/family-ties/edit?id=`). */
export function RelativeForm({ id }: { id: string | undefined }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { status, error } = useFamilyTies();
  const existing = useRelative(id);
  const [form, setForm] = useState<RelativeInput>(EMPTY);
  const [cadenceTouched, setCadenceTouched] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadedId, setLoadedId] = useState<string | undefined>(undefined);

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

  const update = (patch: Partial<RelativeInput>) => setForm((f) => ({ ...f, ...patch }));
  const setKinship = (kinship: Kinship) =>
    update(cadenceTouched ? { kinship } : { kinship, cadenceDays: DEFAULT_CADENCE_DAYS[kinship] });
  const setCadence = (days: number) => {
    setCadenceTouched(true);
    update({ cadenceDays: clampCadence(days) });
  };
  const done = () => goBackOrReplace(router, "/family-ties");

  const save = async () => {
    if (!form.name.trim()) return;
    if (id && existing) await familyTiesActions.updateRelative(id, form);
    else await familyTiesActions.addRelative(form);
    done();
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
            hint={t("familyTies.form.phoneHint")}
            value={form.phone ?? ""}
            onChangeText={(phone) => update({ phone })}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
          {form.deceased ? null : (
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
          )}
          <TextField
            label={t("familyTies.form.notes")}
            value={form.notes ?? ""}
            onChangeText={(notes) => update({ notes })}
            maxLength={RELATIVE_NOTES_MAX_LENGTH}
            multiline
          />
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
          label={t("familyTies.form.save")}
          disabled={!form.name.trim()}
          onPress={() => void save()}
        />
        <Button label={t("familyTies.form.cancel")} variant="ghost" onPress={done} />
        {existing ? (
          <Button
            label={t("familyTies.form.delete")}
            variant="ghost"
            onPress={() => setConfirmDelete(true)}
          />
        ) : null}
      </View>

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
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});
