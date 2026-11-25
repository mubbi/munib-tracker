import type { WasiyyahBequest, WasiyyahData, WasiyyahDebtLine } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { JannahCallout, JannahNavRow } from "@/components/jannah/primitives";
import { CurrencyField } from "@/components/money/currency-field";
import { AmountInput } from "@/components/records/amount-input";
import { DayInput } from "@/components/records/day-input";
import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createId } from "@/db/id";
import { useRecordFormat } from "@/hooks/use-record-format";
import { normalizeDayInput } from "@/lib/records/day";
import type { ShahadahText } from "@/lib/wasiyyah/document";
import type { WasiyyahComputation } from "@/lib/wasiyyah/wasiyyah";

import { WasiyyahBequestCard } from "./wasiyyah-bequest-card";
import { WasiyyahIssues } from "./wasiyyah-issues";
import { WasiyyahSwitchRow } from "./wasiyyah-switch-row";

/**
 * The editable sections of the wasiyyah wizard (NF-3.9), one component per
 * step. Each gets the draft and a shallow `update(patch)`; the wizard owns
 * state, navigation, autosave and the review/save step.
 */
export interface WasiyyahStepProps {
  data: WasiyyahData;
  update: (patch: Partial<WasiyyahData>) => void;
}

/** Names typed into one comma-separated field (guardians); Arabic comma too. */
export function splitNames(text: string): string[] {
  return text
    .split(/[,،]/)
    .map((name) => name.trim())
    .filter(Boolean);
}

export function TestatorStep({
  data,
  update,
  shahadah,
}: WasiyyahStepProps & { shahadah: ShahadahText }) {
  const { t } = useTranslation();
  return (
    <>
      <LabeledInput
        label={t("wasiyyah.testator.name")}
        value={data.testator.name}
        onChangeText={(name) => update({ testator: { ...data.testator, name } })}
        autoCapitalize="words"
      />
      <DayInput
        label={t("wasiyyah.testator.date")}
        error={
          data.testator.date.trim() && normalizeDayInput(data.testator.date) == null
            ? // The picker can't display an unreadable legacy value — keep the
              // user's saved text visible next to the error so nothing is lost.
              `${t("common.dateInput.invalid")} (${data.testator.date.trim()})`
            : undefined
        }
        value={data.testator.date}
        onChangeText={(date) => update({ testator: { ...data.testator, date } })}
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
}

const FUNERAL_SWITCHES = ["sunnahRites", "muslimCemetery", "avoidInnovations"] as const;

export function FuneralStep({ data, update }: WasiyyahStepProps) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      {FUNERAL_SWITCHES.map((field) => (
        <WasiyyahSwitchRow
          key={field}
          label={t(`wasiyyah.funeral.${field}`)}
          value={data.funeral[field]}
          onChange={(v) => update({ funeral: { ...data.funeral, [field]: v } })}
        />
      ))}
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
}

export function DebtsStep({
  data,
  onUpdateLine,
  onReimport,
}: Pick<WasiyyahStepProps, "data"> & {
  onUpdateLine: (id: string, patch: Partial<WasiyyahDebtLine>) => void;
  onReimport: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const format = useRecordFormat();

  const lineLabel = (l: WasiyyahDebtLine) => {
    const kind = t(`wasiyyah.debtSource.${l.source}`);
    const value =
      l.amount != null && l.currency
        ? format.money(l.amount, l.currency)
        : l.count != null
          ? t("wasiyyah.doc.countValue", { count: l.count })
          : "";
    return [l.label ? `${kind}: ${l.label}` : kind, value].filter(Boolean).join(" — ");
  };

  return (
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
          <WasiyyahSwitchRow
            key={l.id}
            label={lineLabel(l)}
            value={l.confirmed}
            onChange={(confirmed) => onUpdateLine(l.id, { confirmed })}
          />
        ))
      )}
      <Button
        label={t("wasiyyah.debts.reimport")}
        variant="secondary"
        size="sm"
        onPress={onReimport}
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
}

export function TrustsStep({ data, update }: WasiyyahStepProps) {
  const { t } = useTranslation();
  if (data.trusts.length === 0) {
    return (
      <ThemedText type="small" themeColor="mutedForeground">
        {t("wasiyyah.trusts.none")}
      </ThemedText>
    );
  }
  return (
    <>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("wasiyyah.trusts.hint")}
      </ThemedText>
      {data.trusts.map((l) => (
        <WasiyyahSwitchRow
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
}

export function BequestsStep({
  data,
  update,
  computation,
  onUpdateBequest,
  onPickHeir,
}: WasiyyahStepProps & {
  computation: WasiyyahComputation;
  onUpdateBequest: (id: string, patch: Partial<WasiyyahBequest>) => void;
  onPickHeir: (bequestId: string) => void;
}) {
  const { t } = useTranslation();
  const format = useRecordFormat();
  return (
    <>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("wasiyyah.bequests.hint")}
      </ThemedText>
      <CurrencyField
        label={t("debts.form.currency")}
        value={data.currency}
        onChange={(currency) => update({ currency })}
      />
      <AmountInput
        label={t("wasiyyah.bequests.estate")}
        hint={t("wasiyyah.bequests.estateHint")}
        value={data.estimatedEstate}
        currency={data.currency}
        onChange={(estimatedEstate) => update({ estimatedEstate })}
      />
      <AmountInput
        label={t("wasiyyah.bequests.funeralCost")}
        value={data.funeralCost}
        currency={data.currency}
        onChange={(funeralCost) => update({ funeralCost })}
      />
      {computation.limitView ? (
        <Card variant="muted">
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
        <WasiyyahBequestCard
          key={b.id}
          bequest={b}
          onChange={(patch) => onUpdateBequest(b.id, patch)}
          onRemove={() => update({ bequests: data.bequests.filter((x) => x.id !== b.id) })}
          onPickHeir={() => onPickHeir(b.id)}
          currency={data.currency}
        />
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
}

export function PeopleStep({
  data,
  update,
  guardiansText,
  onGuardiansText,
}: WasiyyahStepProps & { guardiansText: string; onGuardiansText: (text: string) => void }) {
  const { t } = useTranslation();
  return (
    <>
      <LabeledInput
        label={t("wasiyyah.people.guardians")}
        hint={t("wasiyyah.people.guardiansHint")}
        value={guardiansText}
        onChangeText={(v) => {
          onGuardiansText(v);
          update({ guardians: splitNames(v) });
        }}
      />
      <LabeledInput
        label={t("wasiyyah.people.executor")}
        hint={t("wasiyyah.people.executorHint")}
        value={data.executor ?? ""}
        onChangeText={(executor) => update({ executor })}
      />
    </>
  );
}

export function DistributionStep({ data, update }: WasiyyahStepProps) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <JannahCallout tone="info">{t("wasiyyah.doc.distribution")}</JannahCallout>
      <ThemedText type="caption" themeColor="mutedForeground">
        {data.mirathSnapshot
          ? t("wasiyyah.doc.mirathIllustrative")
          : t("wasiyyah.distribution.mirathLater")}
      </ThemedText>
      <Button
        label={
          data.mirathSnapshot ? t("mirath.wasiyyah.recalculate") : t("mirath.wasiyyah.calculate")
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
}

export function WitnessesStep({ data, update }: WasiyyahStepProps) {
  const { t } = useTranslation();
  return (
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
}

const styles = StyleSheet.create({
  arabic: { writingDirection: "rtl", textAlign: "right" },
});
