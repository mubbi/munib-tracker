import type {
  HeirType,
  WasiyyahBequest,
  WasiyyahData,
  WasiyyahDebtLine,
} from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahDisclaimer } from "@/components/jannah/primitives";
import { useExportFeedback } from "@/components/records/use-export-feedback";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { Spacing } from "@/constants/theme";
import { useMadhhabFor } from "@/hooks/use-madhhab";
import { deviceCurrency } from "@/hooks/use-record-format";
import { useDebts } from "@/lib/debts/debts-store";
import { useObligationsSummary } from "@/lib/debts/use-obligations";
import { takePendingMirathSnapshot } from "@/lib/mirath/wasiyyah-handoff";
import { goBackOrReplace } from "@/lib/navigation";
import { normalizeDayInput } from "@/lib/records/day";
import { useWasiyyahExport, wasiyyahShahadah } from "@/lib/wasiyyah/use-wasiyyah-export";
import {
  canSaveWasiyyah,
  computeWasiyyah,
  emptyWasiyyahData,
  importDebtLines,
  importTrustLines,
} from "@/lib/wasiyyah/wasiyyah";
import { wasiyyahActions } from "@/lib/wasiyyah/wasiyyah-store";
import { useToast } from "@/providers/toast-provider";

import { HeirPickerSheet } from "./heir-picker-sheet";
import { WasiyyahIssues } from "./wasiyyah-issues";
import { WasiyyahReviewSummary } from "./wasiyyah-review-summary";
import { WasiyyahSwitchRow } from "./wasiyyah-switch-row";
import {
  BequestsStep,
  DebtsStep,
  DistributionStep,
  FuneralStep,
  PeopleStep,
  TestatorStep,
  TrustsStep,
  WitnessesStep,
} from "./wasiyyah-wizard-steps";

export const WASIYYAH_STEPS = [
  "testator",
  "funeral",
  "debts",
  "trusts",
  "bequests",
  "people",
  "distribution",
  "witnesses",
  "review",
] as const;
export type WasiyyahStep = (typeof WASIYYAH_STEPS)[number];
const SUMMARY_STEPS = WASIYYAH_STEPS.filter(
  (s): s is Exclude<WasiyyahStep, "review"> => s !== "review",
);

/** Wait after the last edit before the draft is written to the vault. */
export const WASIYYAH_AUTOSAVE_MS = 600;

/**
 * The 8-section wasiyyah wizard + a review step (NF-3.9). Autosaves a draft
 * (debounced, and flushed when leaving the screen); the review step lists every
 * section with a jump back to edit it. `onStepChange` lets the route scroll to
 * the top of the new step.
 */
export function WasiyyahWizard({
  initialData,
  onStepChange,
}: {
  initialData: WasiyyahData;
  onStepChange?: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const exportFeedback = useExportFeedback();
  const school = useMadhhabFor("inheritance");
  const { debts, vows } = useDebts();
  const obligations = useObligationsSummary(vows);
  const exportDoc = useWasiyyahExport();
  const [data, setData] = useState<WasiyyahData>(initialData);
  const [stepIndex, setStepIndex] = useState(0);
  const [heirPickerFor, setHeirPickerFor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Guardians are edited as free text; the list is derived, so typing ", " isn't reformatted.
  const [guardiansText, setGuardiansText] = useState(() => initialData.guardians.join(", "));
  const step = WASIYYAH_STEPS[stepIndex] ?? "testator";
  const computation = useMemo(() => computeWasiyyah(data, school), [data, school]);
  const shahadah = useMemo(() => wasiyyahShahadah(), []);

  // Autosave the draft (debounced) so leaving mid-way loses nothing: an edit
  // still waiting for its timer is flushed on unmount. Once the will is saved
  // as a version, no draft is written again (it would resurrect "Continue").
  const firstRender = useRef(true);
  const pendingDraft = useRef<WasiyyahData | null>(null);
  const savedVersion = useRef(false);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    pendingDraft.current = data;
    const timer = setTimeout(() => {
      pendingDraft.current = null;
      if (!savedVersion.current) void wasiyyahActions.saveDraft(data).catch(() => {});
    }, WASIYYAH_AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [data]);
  useEffect(
    () => () => {
      const pending = pendingDraft.current;
      if (pending && !savedVersion.current) void wasiyyahActions.saveDraft(pending).catch(() => {});
    },
    [],
  );

  const goToStep = (next: number) => {
    const clamped = Math.max(0, Math.min(WASIYYAH_STEPS.length - 1, next));
    if (clamped === stepIndex) return;
    setStepIndex(clamped);
    onStepChange?.();
  };

  // First visit to sections 3/4 imports from the debts record.
  useEffect(() => {
    if (
      step === "debts" &&
      data.debts.length === 0 &&
      (debts.length || obligations.length || vows.length)
    ) {
      setData((d) => ({ ...d, debts: importDebtLines(d.debts, { debts, obligations, vows }) }));
    }
    if (step === "trusts" && data.trusts.length === 0 && debts.length) {
      setData((d) => ({ ...d, trusts: importTrustLines(d.trusts, debts) }));
    }
  }, [step, data.debts.length, data.trusts.length, debts, obligations, vows]);

  const update = (patch: Partial<WasiyyahData>) => setData((d) => ({ ...d, ...patch }));

  // NF-3.10: a snapshot attached from /mirath?from=wasiyyah (illustrative only).
  useFocusEffect(
    useCallback(() => {
      const snapshot = takePendingMirathSnapshot();
      if (snapshot) setData((d) => ({ ...d, mirathSnapshot: snapshot }));
    }, []),
  );
  const updateBequest = (id: string, patch: Partial<WasiyyahBequest>) =>
    setData((d) => ({
      ...d,
      bequests: d.bequests.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  const updateDebtLine = (id: string, patch: Partial<WasiyyahDebtLine>) =>
    setData((d) => ({ ...d, debts: d.debts.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));

  const testatorDay = normalizeDayInput(data.testator.date);
  // A will needs a readable date (section 1): saving waits until it is fixed.
  const canSave = canSaveWasiyyah(computation) && testatorDay != null;
  const save = async () => {
    // `savedVersion` is a synchronous guard: a second tap must not save twice.
    if (!canSave || savedVersion.current) return;
    setSaving(true);
    savedVersion.current = true;
    pendingDraft.current = null;
    try {
      const testator = { ...data.testator, date: testatorDay ?? data.testator.date };
      await wasiyyahActions.saveVersion({ ...data, testator }, debts);
      goBackOrReplace(router, "/wasiyyah");
    } catch {
      savedVersion.current = false;
      toast.error(t("common.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const stepProps = { data, update };
  let body: ReactNode = null;
  switch (step) {
    case "testator":
      body = <TestatorStep {...stepProps} shahadah={shahadah} />;
      break;
    case "funeral":
      body = <FuneralStep {...stepProps} />;
      break;
    case "debts":
      body = (
        <DebtsStep
          data={data}
          onUpdateLine={updateDebtLine}
          onReimport={() =>
            update({ debts: importDebtLines(data.debts, { debts, obligations, vows }) })
          }
        />
      );
      break;
    case "trusts":
      body = <TrustsStep {...stepProps} />;
      break;
    case "bequests":
      body = (
        <BequestsStep
          {...stepProps}
          computation={computation}
          onUpdateBequest={updateBequest}
          onPickHeir={setHeirPickerFor}
        />
      );
      break;
    case "people":
      body = (
        <PeopleStep
          {...stepProps}
          guardiansText={guardiansText}
          onGuardiansText={setGuardiansText}
        />
      );
      break;
    case "distribution":
      body = <DistributionStep {...stepProps} />;
      break;
    case "witnesses":
      body = <WitnessesStep {...stepProps} />;
      break;
    case "review":
      body = (
        <>
          <WasiyyahIssues computation={computation} data={data} />
          <WasiyyahReviewSummary
            data={data}
            steps={SUMMARY_STEPS}
            onEdit={(target) => goToStep(WASIYYAH_STEPS.indexOf(target))}
          />
          <WasiyyahSwitchRow
            label={t("wasiyyah.review.sideBySide")}
            value={data.sideBySideEnglish}
            onChange={(sideBySideEnglish) => update({ sideBySideEnglish })}
          />
          <Button
            label={saving ? t("common.saving") : t("wasiyyah.review.save")}
            disabled={!canSave}
            loading={saving}
            onPress={() => void save()}
          />
          <Button
            label={
              exportFeedback.busy ? t("common.export.preparing") : t("wasiyyah.review.preview")
            }
            variant="secondary"
            icon={{ ios: "printer.fill", android: "print", web: "print" }}
            disabled={exportFeedback.busy}
            onPress={() => void exportFeedback.run(() => exportDoc(data, { mode: "print" }))}
          />
          {testatorDay == null ? (
            <Callout tone="warning">{t("wasiyyah.dateBlocked")}</Callout>
          ) : null}
          {!canSaveWasiyyah(computation) ? (
            <Callout tone="warning">{t("wasiyyah.review.blocked")}</Callout>
          ) : null}
          <JannahDisclaimer textKey="wasiyyah.disclaimer" />
        </>
      );
      break;
  }

  const nameMissing = step === "testator" && !data.testator.name.trim();

  const optional = step !== "testator" && step !== "distribution" && step !== "review";

  return (
    <View style={styles.stack}>
      <WizardShell
        title={t(`wasiyyah.step.${step}`)}
        subtitle={optional ? t("wasiyyah.wizard.optional") : undefined}
        stepIndex={stepIndex}
        total={WASIYYAH_STEPS.length}
        stepLabel={t("wasiyyah.wizard.stepOf", {
          current: stepIndex + 1,
          total: WASIYYAH_STEPS.length,
        })}
        progressLabel={t("a11yProgress.wasiyyahSteps")}
        onBack={() => goToStep(stepIndex - 1)}
        onNext={stepIndex < WASIYYAH_STEPS.length - 1 ? () => goToStep(stepIndex + 1) : undefined}
        nextDisabled={nameMissing}
        nextHint={nameMissing ? t("wasiyyah.nameRequired") : undefined}
      >
        <View style={styles.stack}>{body}</View>
      </WizardShell>
      <HeirPickerSheet
        visible={heirPickerFor != null}
        selected={data.bequests.find((b) => b.id === heirPickerFor)?.heirType}
        onSelect={(heirType: HeirType) => {
          if (heirPickerFor) updateBequest(heirPickerFor, { heirType });
          setHeirPickerFor(null);
        }}
        onClose={() => setHeirPickerFor(null)}
      />
    </View>
  );
}

/** Initial wizard data: the draft, else a copy of the latest version, else empty. */
export function initialWasiyyahData(
  draft: WasiyyahData | null,
  latest: WasiyyahData | undefined,
): WasiyyahData {
  return draft ?? latest ?? emptyWasiyyahData(getLocalDateString(), deviceCurrency());
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
});
