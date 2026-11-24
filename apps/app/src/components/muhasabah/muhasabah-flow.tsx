import type {
  MuhasabahAnswer,
  MuhasabahEntry,
  MuhasabahPromptId,
} from "@munib-tracker/shared/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { VaultStateNotice } from "@/components/self-review/vault-state-notice";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { Spacing } from "@/constants/theme";
import { adjacentMuhasabahStep, MUHASABAH_STEPS, type MuhasabahStep } from "@/lib/muhasabah/flow";
import {
  buildMuhasabahEntry,
  draftFromEntry,
  type MuhasabahDraft,
  muhasabahDayKey,
} from "@/lib/muhasabah/model";
import { muhasabahActions, useMuhasabah } from "@/lib/muhasabah/muhasabah-store";
import { useToast } from "@/providers/toast-provider";
import { usePreferences } from "@/stores/preferences-store";

import { MuhasabahDone } from "./muhasabah-done";
import { MuhasabahStepBody } from "./muhasabah-steps";
import { useMuhasabahDay } from "./use-muhasabah-day";

// Public import path — the id now lives with the flow helpers.
export { SAYYID_AL_ISTIGHFAR_ZIKR_ID } from "@/lib/muhasabah/flow";

/**
 * The nightly review (NF-3.6): five short screens — Salah recap (read-only),
 * 3–6 prompts, gratitude, repentance + Sayyid al-Istighfar, tomorrow's
 * intention. Everything is private and saved to the encrypted vault.
 */
export function MuhasabahFlow({ now = new Date() }: { now?: Date }) {
  const { t } = useTranslation();
  const toast = useToast();
  const prefs = usePreferences();
  const { config, entries, status, error } = useMuhasabah();
  const date = useMemo(() => muhasabahDayKey(now), [now]);
  const existing = entries.find((entry) => entry.date === date);

  const [editing, setEditing] = useState(false);
  const [step, setStep] = useState<MuhasabahStep>("salah");
  const [draft, setDraft] = useState<MuhasabahDraft>(() => draftFromEntry(existing));
  const [thanked, setThanked] = useState(false);
  const [saving, setSaving] = useState(false);
  const startedAt = useRef(Date.now());
  const { recap, istighfar } = useMuhasabahDay(date, prefs.activeExcusedReason);

  // Retention on open (plan §6) — also runs from the home card on launch.
  useEffect(() => {
    if (status === "ready") void muhasabahActions.runRetention().catch(() => {});
  }, [status]);

  if (status === "locked" || status === "error") {
    return <VaultStateNotice status={status} error={error} />;
  }
  if (status !== "ready") return null;

  if (existing && !editing) {
    return (
      <MuhasabahDone
        entry={existing}
        config={config}
        onEdit={() => {
          setDraft(draftFromEntry(existing));
          startedAt.current = Date.now();
          setEditing(true);
        }}
      />
    );
  }

  const cancelEdit = () => {
    setEditing(false);
    setStep("salah");
  };
  const index = MUHASABAH_STEPS.indexOf(step);
  const isLast = index === MUHASABAH_STEPS.length - 1;

  const update = (patch: Partial<MuhasabahDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const setAnswer = (id: MuhasabahPromptId, answer: MuhasabahAnswer) =>
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

  return (
    <View style={styles.stack}>
      <View style={styles.gap}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("muhasabah.stepOf", { current: index + 1, total: MUHASABAH_STEPS.length })}
        </ThemedText>
        <SegmentedProgress total={MUHASABAH_STEPS.length} completed={index + 1} />
      </View>

      <Card>
        <View style={styles.gap}>
          <ThemedText type="subtitle" heading={2}>
            {t(`muhasabah.steps.${step}.title`)}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t(`muhasabah.steps.${step}.body`)}
          </ThemedText>
          <MuhasabahStepBody
            step={step}
            draft={draft}
            onDraftChange={update}
            onAnswer={setAnswer}
            config={config}
            recap={recap}
            istighfar={istighfar}
            thanked={thanked}
            onThank={() => setThanked(true)}
          />
        </View>
      </Card>

      <View style={styles.row}>
        {index > 0 ? (
          <Button
            label={t("muhasabah.back")}
            variant="ghost"
            onPress={() => setStep(adjacentMuhasabahStep(step, -1))}
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
          <Button
            label={t("muhasabah.next")}
            onPress={() => setStep(adjacentMuhasabahStep(step, 1))}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two, flexWrap: "wrap" },
  flex: { flex: 1 },
});
