import type { WasiyyahBequest } from "@munib-tracker/shared/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { JannahCallout, JannahNavRow } from "@/components/jannah/primitives";
import { AmountInput } from "@/components/records/amount-input";
import { LabeledInput } from "@/components/records/labeled-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Spacing } from "@/constants/theme";

import { WasiyyahSwitchRow } from "./wasiyyah-switch-row";

/** Clears the heir fields whenever the bequest can no longer go to an heir. */
const NOT_AN_HEIR: Partial<WasiyyahBequest> = { heirType: undefined, heirAcknowledged: undefined };

/** One bequest in the wizard's "bequests" step (NF-3.9). */
export function WasiyyahBequestCard({
  bequest: b,
  onChange,
  onRemove,
  onPickHeir,
  currency,
}: {
  bequest: WasiyyahBequest;
  onChange: (patch: Partial<WasiyyahBequest>) => void;
  onRemove: () => void;
  onPickHeir: () => void;
  currency?: string;
}) {
  const { t } = useTranslation();
  const [confirmRemove, setConfirmRemove] = useState(false);
  return (
    <Card>
      <View style={styles.stack}>
        <LabeledInput
          label={t("wasiyyah.bequests.beneficiary")}
          value={b.beneficiary}
          onChangeText={(beneficiary) => onChange({ beneficiary })}
        />
        <SegmentedControl<"person" | "charity">
          options={[
            { id: "person", label: t("wasiyyah.bequests.person") },
            { id: "charity", label: t("wasiyyah.bequests.charity") },
          ]}
          value={b.kind}
          onChange={(kind) =>
            onChange({ kind, ...(kind === "charity" ? { isHeir: false, ...NOT_AN_HEIR } : {}) })
          }
        />
        <SegmentedControl<"amount" | "percent">
          options={[
            { id: "amount", label: t("wasiyyah.bequests.byAmount") },
            { id: "percent", label: t("wasiyyah.bequests.byPercent") },
          ]}
          value={b.percent != null ? "percent" : "amount"}
          onChange={(mode) =>
            onChange(
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
            onChange={(percent) => onChange({ percent: percent ?? 0 })}
          />
        ) : (
          <AmountInput
            label={t("wasiyyah.bequests.amount")}
            value={b.amount}
            currency={currency}
            onChange={(amount) => onChange({ amount })}
          />
        )}
        <LabeledInput
          label={t("wasiyyah.bequests.purpose")}
          value={b.purpose ?? ""}
          onChangeText={(purpose) => onChange({ purpose })}
        />
        {b.kind === "person" ? (
          <WasiyyahSwitchRow
            label={t("wasiyyah.bequests.isHeir")}
            value={b.isHeir}
            onChange={(isHeir) => onChange({ isHeir, ...(isHeir ? {} : NOT_AN_HEIR) })}
          />
        ) : null}
        {b.isHeir ? (
          <>
            <JannahNavRow
              icon={{ ios: "person.2.fill", android: "group", web: "group" }}
              title={t("wasiyyah.bequests.heirType")}
              subtitle={b.heirType ? t(`heirs.${b.heirType}`) : t("wasiyyah.bequests.heirPick")}
              onPress={onPickHeir}
            />
            <JannahCallout tone="warning">{t("wasiyyah.bequests.heirWarning")}</JannahCallout>
            <WasiyyahSwitchRow
              label={t("wasiyyah.bequests.heirAcknowledge")}
              value={b.heirAcknowledged === true}
              onChange={(heirAcknowledged) => onChange({ heirAcknowledged })}
            />
          </>
        ) : null}
        <Button
          label={t("wasiyyah.bequests.remove")}
          variant="ghost"
          size="sm"
          onPress={() => setConfirmRemove(true)}
        />
      </View>
      <ConfirmDialog
        visible={confirmRemove}
        destructive
        title={t("wasiyyah.bequests.removeTitle")}
        message={t("wasiyyah.bequests.removeBody")}
        confirmLabel={t("wasiyyah.bequests.remove")}
        onConfirm={() => {
          setConfirmRemove(false);
          onRemove();
        }}
        onClose={() => setConfirmRemove(false)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
});
