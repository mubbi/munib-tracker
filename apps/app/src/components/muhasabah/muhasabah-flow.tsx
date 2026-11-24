import type {
  MuhasabahAnswer,
  MuhasabahEntry,
  PrayerLog,
  ZikrItem,
} from "@munib-tracker/shared/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ReadingCard } from "@/components/content/reading-card";
import { ChoiceChips } from "@/components/self-review/choice-chips";
import { TextField } from "@/components/self-review/text-field";
import { VaultStateNotice } from "@/components/self-review/vault-state-notice";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import { PrayerRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { summarizeSalahForMuhasabah } from "@/lib/muhasabah/logic";
import {
  buildMuhasabahEntry,
  draftFromEntry,
  MUHASABAH_ANSWERS,
  MUHASABAH_NOTE_MAX_LENGTH,
  type MuhasabahDraft,
  muhasabahDayKey,
} from "@/lib/muhasabah/model";
import { muhasabahActions, useMuhasabah } from "@/lib/muhasabah/muhasabah-store";
import { useSetting } from "@/lib/settings/use-setting";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";
import { useToast } from "@/providers/toast-provider";
import { usePreferences } from "@/stores/preferences-store";

import { muhasabahPromptLabel } from "./prompt-label";

/** Bundled Sayyid al-Istighfar (Hisnul Muslim, Bukhari 6306) — rendered by id, never typed. */
export const SAYYID_AL_ISTIGHFAR_ZIKR_ID = "morning-sayyid-al-istighfar";

const STEPS = ["salah", "prompts", "gratitude", "repent", "intention"] as const;
type Step = (typeof STEPS)[number];

/**
 * The nightly review (NF-3.6): five short screens — Salah recap (read-only),
 * 3–6 prompts, gratitude, repentance + Sayyid al-Istighfar, tomorrow's
 * intention. Everything is private and saved to the encrypted vault.
 */
export function MuhasabahFlow({ now = new Date() }: { now?: Date }) {
  const { t } = useTranslation();
  const toast = useToast();
  const { tokens } = useThemeTokens();
  const prefs = usePreferences();
  const nightlyReminder = useSetting<boolean>("notifications.personal.muhasabah");
  const { config, entries, status, error } = useMuhasabah();
  const date = useMemo(() => muhasabahDayKey(now), [now]);
  const existing = entries.find((entry) => entry.date === date);

  const [editing, setEditing] = useState(false);
  const [step, setStep] = useState<Step>("salah");
  const [draft, setDraft] = useState<MuhasabahDraft>(() => draftFromEntry(existing));
  const [thanked, setThanked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<PrayerLog[]>([]);
  const [istighfar, setIstighfar] = useState<ZikrItem | undefined>(() =>
    getZikrById(SAYYID_AL_ISTIGHFAR_ZIKR_ID),
  );
  const startedAt = useRef(Date.now());

  // Retention on open (plan §6) — also runs from the home card on launch.
  useEffect(() => {
    if (status === "ready") void muhasabahActions.runRetention();
  }, [status]);

  useEffect(() => {
    let alive = true;
    void PrayerRepository.getByDate(date).then((rows) => {
      if (alive) setLogs(rows);
    });
    if (!istighfar) {
      void ensureZikrCorpus().then(() => {
        if (alive) setIstighfar(getZikrById(SAYYID_AL_ISTIGHFAR_ZIKR_ID));
      });
    }
    return () => {
      alive = false;
    };
  }, [date, istighfar]);

  const recap = useMemo(
    () => summarizeSalahForMuhasabah(logs, date, prefs.activeExcusedReason),
    [logs, date, prefs.activeExcusedReason],
  );

  if (status === "locked" || status === "error") {
    return <VaultStateNotice status={status} error={error} />;
  }
  if (status !== "ready") return null;

  const showFlow = !existing || editing;
  const cancelEdit = () => {
    setEditing(false);
    setStep("salah");
  };
  const index = STEPS.indexOf(step);
  const isLast = index === STEPS.length - 1;

  const update = (patch: Partial<MuhasabahDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const setAnswer = (id: string, answer: MuhasabahAnswer) =>
    setDraft((d) => ({ ...d, answers: { ...d.answers, [id]: answer } }));

  const save = async () => {
    setSaving(true);
    try {
      const entry: MuhasabahEntry = buildMuhasabahEntry({
        date,
        draft,
        prompts: config.prompts,
        saveRepentText: config.prefs.saveRepentText,
        durationMs: Date.now() - startedAt.current + (existing?.durationMs ?? 0),
      });
      await muhasabahActions.saveEntry(entry);
      setEditing(false);
      setStep("salah");
      toast.success(t("muhasabah.saved"), t("muhasabah.savedSub"));
    } catch {
      toast.error(t("muhasabah.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const showReminderOffer =
    Boolean(config.firstCompletedAt) && !config.reminderOfferAnswered && !nightlyReminder.value;

  if (!showFlow && existing) {
    return (
      <View style={styles.stack}>
        <Card>
          <View style={styles.gap}>
            <ThemedText type="subtitle">{t("muhasabah.doneTitle")}</ThemedText>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("muhasabah.doneBody")}
            </ThemedText>
            {existing.intention ? (
              <ThemedText type="small">
                {t("muhasabah.doneIntention", { intention: existing.intention })}
              </ThemedText>
            ) : null}
            <Button
              label={t("muhasabah.editTonight")}
              variant="secondary"
              onPress={() => {
                setDraft(draftFromEntry(existing));
                startedAt.current = Date.now();
                setEditing(true);
              }}
            />
          </View>
        </Card>
        {showReminderOffer ? (
          <Card>
            <View style={styles.gap}>
              <ThemedText type="smallBold">{t("muhasabah.offerTitle")}</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {t("muhasabah.offerBody")}
              </ThemedText>
              <View style={styles.row}>
                <Button
                  label={t("muhasabah.offerYes")}
                  onPress={() => {
                    void nightlyReminder.setValue(true);
                    void muhasabahActions.answerReminderOffer();
                  }}
                />
                <Button
                  label={t("muhasabah.offerNo")}
                  variant="ghost"
                  onPress={() => void muhasabahActions.answerReminderOffer()}
                />
              </View>
            </View>
          </Card>
        ) : null}
      </View>
    );
  }

  const answerOptions = MUHASABAH_ANSWERS.map((id) => ({
    id,
    label: t(`muhasabah.answers.${id}`),
  }));

  return (
    <View style={styles.stack}>
      <View style={styles.gap}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("muhasabah.stepOf", { current: index + 1, total: STEPS.length })}
        </ThemedText>
        <SegmentedProgress total={STEPS.length} completed={index + 1} />
      </View>

      <Card>
        <View style={styles.gap}>
          <ThemedText type="subtitle" heading={2}>
            {t(`muhasabah.steps.${step}.title`)}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t(`muhasabah.steps.${step}.body`)}
          </ThemedText>

          {step === "salah" ? (
            recap.excusedReason ? (
              <ThemedText type="small">
                {t("muhasabah.salah.excused", {
                  reason: t(`tracker.excusedReason.${recap.excusedReason}`),
                })}
              </ThemedText>
            ) : (
              <View style={styles.gap}>
                <ThemedText type="smallBold" style={{ color: tokens.status.success.text }}>
                  {t("muhasabah.salah.onTime", {
                    count: recap.fardOnTime,
                    total: recap.fardTotal,
                  })}
                </ThemedText>
                {recap.fardLate > 0 ? (
                  <ThemedText type="small">
                    {t("muhasabah.salah.late", { count: recap.fardLate })}
                  </ThemedText>
                ) : null}
                <ThemedText type="small">
                  {t("muhasabah.salah.voluntary", { count: recap.voluntary })}
                </ThemedText>
                {recap.fardOnTime + recap.fardLate < recap.fardTotal ? (
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("muhasabah.salah.gentle")}
                  </ThemedText>
                ) : null}
              </View>
            )
          ) : null}

          {step === "prompts"
            ? config.prompts.map((id) => {
                const label = muhasabahPromptLabel(t, id, config);
                return (
                  <View key={id} style={styles.prompt}>
                    <ThemedText type="smallBold">{label}</ThemedText>
                    <ChoiceChips
                      options={answerOptions}
                      value={draft.answers[id]}
                      onChange={(answer) => setAnswer(id, answer)}
                      accessibilityLabel={label}
                    />
                  </View>
                );
              })
            : null}

          {step === "gratitude" ? (
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
                onPress={() => setThanked(true)}
              />
            </View>
          ) : null}

          {step === "repent" ? (
            <View style={styles.gap}>
              <View style={styles.switchRow}>
                <ThemedText type="small" style={styles.flex}>
                  {t("muhasabah.repentToggle")}
                </ThemedText>
                <ThemedSwitch
                  value={draft.repented}
                  onValueChange={(repented) => update({ repented })}
                  accessibilityLabel={t("muhasabah.repentToggle")}
                />
              </View>
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
              <View style={styles.switchRow}>
                <ThemedText type="small" style={styles.flex}>
                  {t("muhasabah.readIstighfar")}
                </ThemedText>
                <ThemedSwitch
                  value={draft.readIstighfar}
                  onValueChange={(readIstighfar) => update({ readIstighfar })}
                  accessibilityLabel={t("muhasabah.readIstighfar")}
                />
              </View>
            </View>
          ) : null}

          {step === "intention" ? (
            <TextField
              label={t("muhasabah.intentionLabel")}
              hint={t("muhasabah.intentionHint")}
              value={draft.intention}
              onChangeText={(intention) => update({ intention })}
              placeholder={t("muhasabah.intentionPlaceholder")}
              maxLength={MUHASABAH_NOTE_MAX_LENGTH}
            />
          ) : null}
        </View>
      </Card>

      <View style={styles.row}>
        {index > 0 ? (
          <Button
            label={t("muhasabah.back")}
            variant="ghost"
            onPress={() => setStep(STEPS[index - 1] as Step)}
          />
        ) : existing && editing ? (
          // Editing tonight's saved review: leave without changing it.
          <Button label={t("common.cancel")} variant="ghost" onPress={cancelEdit} />
        ) : null}
        <View style={styles.flex} />
        {isLast ? (
          <Button
            label={saving ? t("muhasabah.saving") : t("muhasabah.save")}
            disabled={saving}
            onPress={() => void save()}
          />
        ) : (
          <Button label={t("muhasabah.next")} onPress={() => setStep(STEPS[index + 1] as Step)} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
  prompt: { gap: Spacing.one, marginTop: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two, flexWrap: "wrap" },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});
