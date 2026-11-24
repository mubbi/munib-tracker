import type {
  HeirType,
  WasiyyahBequest,
  WasiyyahData,
  WasiyyahDebtLine,
} from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useFocusEffect, useRouter } from "expo-router";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { AmountInput } from "@/components/records/amount-input";
import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { Spacing } from "@/constants/theme";
import { createId } from "@/db/id";
import { useMadhhabFor } from "@/hooks/use-madhhab";
import { deviceCurrency, useRecordFormat } from "@/hooks/use-record-format";
import { useDebts } from "@/lib/debts/debts-store";
import { useObligationsSummary } from "@/lib/debts/use-obligations";
import { takePendingMirathSnapshot } from "@/lib/mirath/wasiyyah-handoff";
import { goBackOrReplace } from "@/lib/navigation";
import { useWasiyyahExport, wasiyyahShahadah } from "@/lib/wasiyyah/use-wasiyyah-export";
import {
  canSaveWasiyyah,
  computeWasiyyah,
  emptyWasiyyahData,
  importDebtLines,
  importTrustLines,
} from "@/lib/wasiyyah/wasiyyah";
import { wasiyyahActions } from "@/lib/wasiyyah/wasiyyah-store";

import { HeirPickerSheet } from "./heir-picker-sheet";
import { WasiyyahIssues } from "./wasiyyah-issues";

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

function SwitchRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.switchRow}>
      <ThemedText type="small" style={styles.flex}>
        {label}
      </ThemedText>
      <ThemedSwitch value={value} onValueChange={onChange} accessibilityLabel={label} />
    </View>
  );
}

/** The 8-section wasiyyah wizard + a review step (NF-3.9). Autosaves a draft. */
export function WasiyyahWizard({ initialData }: { initialData: WasiyyahData }) {
  const { t } = useTranslation();
  const router = useRouter();
  const format = useRecordFormat();
  const school = useMadhhabFor("inheritance");
  const { debts, vows } = useDebts();
  const obligations = useObligationsSummary(vows);
  const exportDoc = useWasiyyahExport();
  const [data, setData] = useState<WasiyyahData>(initialData);
  const [stepIndex, setStepIndex] = useState(0);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [heirPickerFor, setHeirPickerFor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const step = WASIYYAH_STEPS[stepIndex] ?? "testator";
  const computation = useMemo(() => computeWasiyyah(data, school), [data, school]);
  const shahadah = useMemo(() => wasiyyahShahadah(), []);

  // Autosave the draft (debounced) so leaving mid-way loses nothing.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => void wasiyyahActions.saveDraft(data).catch(() => {}), 600);
    return () => clearTimeout(timer);
  }, [data]);

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

  const debtLineLabel = (l: WasiyyahDebtLine) => {
    const kind = t(`wasiyyah.debtSource.${l.source}`);
    const value =
      l.amount != null && l.currency
        ? format.money(l.amount, l.currency)
        : l.count != null
          ? t("wasiyyah.doc.countValue", { count: l.count })
          : "";
    return [l.label ? `${kind}: ${l.label}` : kind, value].filter(Boolean).join(" — ");
  };

  const save = async () => {
    if (!canSaveWasiyyah(computation)) return;
    setSaving(true);
    try {
      await wasiyyahActions.saveVersion(data, debts);
      goBackOrReplace(router, "/wasiyyah");
    } finally {
      setSaving(false);
    }
  };

  let body: ReactNode = null;
  switch (step) {
    case "testator":
      body = (
        <>
          <LabeledInput
            label={t("wasiyyah.testator.name")}
            value={data.testator.name}
            onChangeText={(name) => update({ testator: { ...data.testator, name } })}
            autoCapitalize="words"
          />
          <LabeledInput
            label={t("wasiyyah.testator.date")}
            value={data.testator.date}
            onChangeText={(date) => update({ testator: { ...data.testator, date } })}
            placeholder={t("debts.form.datePlaceholder")}
          />
          <ThemedText type="smallBold">{t("wasiyyah.testator.shahadah")}</ThemedText>
          <ThemedText type="arabic" style={styles.arabic}>
            {shahadah.arabic}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {shahadah.transliteration}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {shahadah.reference}
          </ThemedText>
        </>
      );
      break;
    case "funeral":
      body = (
        <>
          <SwitchRow
            label={t("wasiyyah.funeral.sunnahRites")}
            value={data.funeral.sunnahRites}
            onChange={(v) => update({ funeral: { ...data.funeral, sunnahRites: v } })}
          />
          <SwitchRow
            label={t("wasiyyah.funeral.muslimCemetery")}
            value={data.funeral.muslimCemetery}
            onChange={(v) => update({ funeral: { ...data.funeral, muslimCemetery: v } })}
          />
          <SwitchRow
            label={t("wasiyyah.funeral.avoidInnovations")}
            value={data.funeral.avoidInnovations}
            onChange={(v) => update({ funeral: { ...data.funeral, avoidInnovations: v } })}
          />
          <LabeledInput
            label={t("wasiyyah.funeral.notes")}
            value={data.funeral.notes ?? ""}
            onChangeText={(notes) => update({ funeral: { ...data.funeral, notes } })}
            multiline
          />
          <JannahNavRow
            icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
            title={t("wasiyyah.funeral.guideLink")}
            onPress={() => router.push("/janazah" as Href)}
          />
        </>
      );
      break;
    case "debts":
      body = (
        <>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("wasiyyah.debts.hint")}
          </ThemedText>
          {data.debts.length === 0 ? (
            <ThemedText type="small" themeColor="mutedForeground">
              {t("wasiyyah.debts.none")}
            </ThemedText>
          ) : (
            data.debts.map((l) => (
              <SwitchRow
                key={l.id}
                label={debtLineLabel(l)}
                value={l.confirmed}
                onChange={(confirmed) => updateDebtLine(l.id, { confirmed })}
              />
            ))
          )}
          <Button
            label={t("wasiyyah.debts.reimport")}
            variant="secondary"
            size="sm"
            onPress={() =>
              update({ debts: importDebtLines(data.debts, { debts, obligations, vows }) })
            }
          />
          <JannahNavRow
            icon={{ ios: "list.bullet.rectangle", android: "receipt_long", web: "receipt_long" }}
            title={t("wasiyyah.debts.openRecord")}
            onPress={() => router.push("/debts" as Href)}
          />
          <View nativeID="debts">
            <MadhhabNote id="wasiyyah.debtsToAllah" />
          </View>
        </>
      );
      break;
    case "trusts":
      body =
        data.trusts.length === 0 ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("wasiyyah.trusts.none")}
          </ThemedText>
        ) : (
          <>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("wasiyyah.trusts.hint")}
            </ThemedText>
            {data.trusts.map((l) => (
              <SwitchRow
                key={l.id}
                label={[l.counterparty, l.item].filter(Boolean).join(" — ")}
                value={l.confirmed}
                onChange={(confirmed) =>
                  update({
                    trusts: data.trusts.map((x) => (x.id === l.id ? { ...x, confirmed } : x)),
                  })
                }
              />
            ))}
          </>
        );
      break;
    case "bequests":
      body = (
        <>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("wasiyyah.bequests.hint")}
          </ThemedText>
          <JannahNavRow
            icon={{ ios: "coloncurrencysign.circle", android: "payments", web: "payments" }}
            title={t("debts.form.currency")}
            subtitle={data.currency}
            onPress={() => setCurrencyOpen(true)}
          />
          <AmountInput
            label={t("wasiyyah.bequests.estate")}
            hint={t("wasiyyah.bequests.estateHint")}
            value={data.estimatedEstate}
            onChange={(estimatedEstate) => update({ estimatedEstate })}
          />
          <AmountInput
            label={t("wasiyyah.bequests.funeralCost")}
            value={data.funeralCost}
            onChange={(funeralCost) => update({ funeralCost })}
          />
          {computation.limitView ? (
            <Card padding="three" variant="muted">
              <ThemedText type="small">
                {t("wasiyyah.bequests.limit", {
                  net: format.money(computation.limitView.netAfterDebts, data.currency),
                  limit: format.money(computation.limitView.limit, data.currency),
                  used: format.money(computation.limitView.used, data.currency),
                })}
              </ThemedText>
              {computation.applied === "stricter" ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("wasiyyah.bequests.stricterApplied")}
                </ThemedText>
              ) : null}
            </Card>
          ) : null}
          {data.bequests.map((b) => (
            <Card key={b.id} padding="three">
              <View style={styles.stack}>
                <LabeledInput
                  label={t("wasiyyah.bequests.beneficiary")}
                  value={b.beneficiary}
                  onChangeText={(beneficiary) => updateBequest(b.id, { beneficiary })}
                />
                <SegmentedControl<"person" | "charity">
                  options={[
                    { id: "person", label: t("wasiyyah.bequests.person") },
                    { id: "charity", label: t("wasiyyah.bequests.charity") },
                  ]}
                  value={b.kind}
                  onChange={(kind) =>
                    updateBequest(b.id, {
                      kind,
                      ...(kind === "charity"
                        ? { isHeir: false, heirType: undefined, heirAcknowledged: undefined }
                        : {}),
                    })
                  }
                />
                <SegmentedControl<"amount" | "percent">
                  options={[
                    { id: "amount", label: t("wasiyyah.bequests.byAmount") },
                    { id: "percent", label: t("wasiyyah.bequests.byPercent") },
                  ]}
                  value={b.percent != null ? "percent" : "amount"}
                  onChange={(mode) =>
                    updateBequest(
                      b.id,
                      mode === "percent"
                        ? { percent: b.percent ?? 0, amount: undefined }
                        : { amount: b.amount, percent: undefined },
                    )
                  }
                />
                {b.percent != null ? (
                  <AmountInput
                    label={t("wasiyyah.bequests.percent")}
                    value={b.percent}
                    max={100}
                    onChange={(percent) => updateBequest(b.id, { percent: percent ?? 0 })}
                  />
                ) : (
                  <AmountInput
                    label={t("wasiyyah.bequests.amount")}
                    value={b.amount}
                    onChange={(amount) => updateBequest(b.id, { amount })}
                  />
                )}
                <LabeledInput
                  label={t("wasiyyah.bequests.purpose")}
                  value={b.purpose ?? ""}
                  onChangeText={(purpose) => updateBequest(b.id, { purpose })}
                />
                {b.kind === "person" ? (
                  <SwitchRow
                    label={t("wasiyyah.bequests.isHeir")}
                    value={b.isHeir}
                    onChange={(isHeir) =>
                      updateBequest(b.id, {
                        isHeir,
                        ...(isHeir ? {} : { heirType: undefined, heirAcknowledged: undefined }),
                      })
                    }
                  />
                ) : null}
                {b.isHeir ? (
                  <>
                    <JannahNavRow
                      icon={{ ios: "person.2.fill", android: "group", web: "group" }}
                      title={t("wasiyyah.bequests.heirType")}
                      subtitle={
                        b.heirType ? t(`heirs.${b.heirType}`) : t("wasiyyah.bequests.heirPick")
                      }
                      onPress={() => setHeirPickerFor(b.id)}
                    />
                    <JannahCallout tone="warning">
                      {t("wasiyyah.bequests.heirWarning")}
                    </JannahCallout>
                    <SwitchRow
                      label={t("wasiyyah.bequests.heirAcknowledge")}
                      value={b.heirAcknowledged === true}
                      onChange={(heirAcknowledged) => updateBequest(b.id, { heirAcknowledged })}
                    />
                  </>
                ) : null}
                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel={t("wasiyyah.bequests.remove")}
                  onPress={() => update({ bequests: data.bequests.filter((x) => x.id !== b.id) })}
                >
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("wasiyyah.bequests.remove")}
                  </ThemedText>
                </PressableScale>
              </View>
            </Card>
          ))}
          <Button
            label={t("wasiyyah.bequests.add")}
            variant="secondary"
            icon={{ ios: "plus", android: "add", web: "add" }}
            onPress={() =>
              update({
                bequests: [
                  ...data.bequests,
                  { id: createId("wb"), beneficiary: "", kind: "charity", isHeir: false },
                ],
              })
            }
          />
          <WasiyyahIssues
            computation={computation}
            data={data}
            only={[
              "over_third",
              "heir_unacknowledged",
              "estate_needed",
              "debts_exceed_estate",
              "lines_excluded",
            ]}
          />
          <View nativeID="bequests">
            <MadhhabNote id="wasiyyah.noHeirs" />
          </View>
        </>
      );
      break;
    case "people":
      body = (
        <>
          <LabeledInput
            label={t("wasiyyah.people.guardians")}
            hint={t("wasiyyah.people.guardiansHint")}
            value={data.guardians.join(", ")}
            onChangeText={(v) => update({ guardians: v.split(/[,،]/) })}
          />
          <LabeledInput
            label={t("wasiyyah.people.executor")}
            hint={t("wasiyyah.people.executorHint")}
            value={data.executor ?? ""}
            onChangeText={(executor) => update({ executor })}
          />
        </>
      );
      break;
    case "distribution":
      body = (
        <>
          <JannahCallout tone="info">{t("wasiyyah.doc.distribution")}</JannahCallout>
          <ThemedText type="caption" themeColor="mutedForeground">
            {data.mirathSnapshot
              ? t("wasiyyah.doc.mirathIllustrative")
              : t("wasiyyah.distribution.mirathLater")}
          </ThemedText>
          <Button
            label={
              data.mirathSnapshot
                ? t("mirath.wasiyyah.recalculate")
                : t("mirath.wasiyyah.calculate")
            }
            variant="secondary"
            size="sm"
            onPress={() => router.push("/mirath?from=wasiyyah" as Href)}
          />
          {data.mirathSnapshot ? (
            <Button
              label={t("mirath.wasiyyah.remove")}
              variant="ghost"
              size="sm"
              onPress={() => update({ mirathSnapshot: undefined })}
            />
          ) : null}
        </>
      );
      break;
    case "witnesses":
      body = (
        <>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("wasiyyah.doc.witnessesIntro")}
          </ThemedText>
          <LabeledInput
            label={t("wasiyyah.witnesses.first")}
            value={data.witnesses[0]}
            onChangeText={(v) => update({ witnesses: [v, data.witnesses[1]] })}
          />
          <LabeledInput
            label={t("wasiyyah.witnesses.second")}
            value={data.witnesses[1]}
            onChangeText={(v) => update({ witnesses: [data.witnesses[0], v] })}
          />
        </>
      );
      break;
    case "review":
      body = (
        <>
          <WasiyyahIssues computation={computation} data={data} />
          <SwitchRow
            label={t("wasiyyah.review.sideBySide")}
            value={data.sideBySideEnglish}
            onChange={(sideBySideEnglish) => update({ sideBySideEnglish })}
          />
          <Button
            label={t("wasiyyah.review.preview")}
            variant="secondary"
            icon={{ ios: "printer.fill", android: "print", web: "print" }}
            onPress={() => void exportDoc(data, { mode: "print" })}
          />
          <Button
            label={t("wasiyyah.review.save")}
            disabled={!canSaveWasiyyah(computation) || saving}
            onPress={() => void save()}
          />
          {!canSaveWasiyyah(computation) ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("wasiyyah.review.blocked")}
            </ThemedText>
          ) : null}
          <JannahDisclaimer textKey="wasiyyah.disclaimer" />
        </>
      );
      break;
  }

  return (
    <View style={styles.stack}>
      <ThemedText type="caption" themeColor="mutedForeground" accessibilityRole="header">
        {t("wasiyyah.wizard.stepOf", { current: stepIndex + 1, total: WASIYYAH_STEPS.length })}
      </ThemedText>
      <ThemedText type="subtitle" heading={2}>
        {t(`wasiyyah.step.${step}`)}
      </ThemedText>
      {step !== "testator" && step !== "distribution" && step !== "review" ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("wasiyyah.wizard.optional")}
        </ThemedText>
      ) : null}
      <Card padding="three">
        <View style={styles.stack}>{body}</View>
      </Card>
      <View style={styles.nav}>
        <Button
          label={t("common.back")}
          variant="ghost"
          disabled={stepIndex === 0}
          onPress={() => setStepIndex((i) => Math.max(0, i - 1))}
        />
        {stepIndex < WASIYYAH_STEPS.length - 1 ? (
          <Button
            label={t("common.next")}
            disabled={step === "testator" && !data.testator.name.trim()}
            onPress={() => setStepIndex((i) => Math.min(WASIYYAH_STEPS.length - 1, i + 1))}
          />
        ) : null}
      </View>
      <CurrencyPickerSheet
        visible={currencyOpen}
        selectedCode={data.currency}
        onSelect={(currency) => {
          update({ currency });
          setCurrencyOpen(false);
        }}
        onClose={() => setCurrencyOpen(false)}
      />
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
  nav: { flexDirection: "row", justifyContent: "space-between", gap: Spacing.two },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
  arabic: { writingDirection: "rtl", textAlign: "right" },
});
