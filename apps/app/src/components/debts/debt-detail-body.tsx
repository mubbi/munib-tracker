import type { DebtDirection } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { DebtPhotoCard } from "@/components/debts/debt-photo-card";
import { JannahCallout } from "@/components/jannah/primitives";
import { useRecordAction } from "@/components/records/use-record-action";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { deviceCurrency, useRecordFormat } from "@/hooks/use-record-format";
import { type DebtFormState, debtFormFrom, debtInputFromForm } from "@/lib/debts/debt-form";
import { type DebtEntry, isLoan, outstanding, paidTotal } from "@/lib/debts/debts";
import { debtsActions, useDebt, useDebts } from "@/lib/debts/debts-store";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { useToast } from "@/providers/toast-provider";

import { DebtFormCard } from "./debt-form-card";
import { DebtPaymentsCard } from "./debt-payments-card";

function formFrom(record: DebtEntry | undefined, direction: DebtDirection): DebtFormState {
  return debtFormFrom(record, direction, {
    currency: deviceCurrency(),
    today: getLocalDateString(),
  });
}

/** `/debts/[id]` content: create (`id === "new"`) or view/edit one record. */
export function DebtDetailBody({
  id,
  initialDirection = "i_owe",
  onCreated,
  onClosed,
}: {
  id: string;
  initialDirection?: DebtDirection;
  /** Master–detail: a new record was saved (default: replace the route with it). */
  onCreated?: (id: string) => void;
  /** Master–detail: cancel on a new record / delete (default: back to `/debts`). */
  onClosed?: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const format = useRecordFormat();
  const toast = useToast();
  const run = useRecordAction();
  const { status } = useDebts();
  const isNew = id === "new";
  const record = useDebt(isNew ? undefined : id);
  const [form, setForm] = useState<DebtFormState>(() => formFrom(record, initialDirection));
  const [editing, setEditing] = useState(isNew);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmForgive, setConfirmForgive] = useState(false);
  const [saving, setSaving] = useState(false);
  // Synchronous guards: state updates land a render later, so a fast second tap
  // would still see `saving === false`. Once a new record exists, later saves
  // (before the route swaps to it) update that record instead of adding another.
  const savingRef = useRef(false);
  const createdId = useRef<string | null>(null);
  const [removePaymentId, setRemovePaymentId] = useState<string | null>(null);

  // The vault store may finish loading after the first render.
  useEffect(() => {
    if (record && !editing) setForm(formFrom(record, initialDirection));
  }, [record, editing, initialDirection]);

  const close = () => (onClosed ? onClosed() : goBackOrReplace(router, "/debts"));

  const setField = <K extends keyof DebtFormState>(key: K, value: DebtFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    if (savingRef.current) return;
    const result = debtInputFromForm(form, record);
    if (!result.ok) return setError(t(result.error));
    setError(null);
    // One save at a time: a double tap on "Save" must not create two records.
    savingRef.current = true;
    setSaving(true);
    try {
      const target = isNew ? (createdId.current ?? undefined) : id;
      const savedId = await debtsActions.saveDebt(result.input, target);
      if (isNew && !createdId.current) {
        createdId.current = savedId;
        if (onCreated) onCreated(savedId);
        else router.replace({ pathname: "/debts/[id]", params: { id: savedId } } as Href);
      }
      setEditing(false);
    } catch {
      toast.error(t("privateUx.saveFailed"));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  // The encrypted record may still be opening: don't flash "no longer exists".
  if (status !== "ready" && !isNew) return null;

  if (!isNew && !record) {
    return (
      <ThemedText type="small" themeColor="mutedForeground">
        {t("debts.notFound")}
      </ThemedText>
    );
  }

  if (editing || !record) {
    return (
      <View style={styles.stack}>
        <DebtFormCard
          form={form}
          onChange={setField}
          error={error}
          saving={saving}
          onSave={() => void save()}
          onCancel={() => (isNew ? close() : setEditing(false))}
        />
      </View>
    );
  }

  const left = outstanding(record);
  const currency = record.currency ?? form.currency;

  return (
    <View style={styles.stack}>
      <Card padding="three">
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(`debts.direction.${record.direction}`)} · {t(`debts.status.${record.status}`)}
        </ThemedText>
        <ThemedText type="subtitle">{record.counterparty}</ThemedText>
        {record.amount != null && currency ? (
          <ThemedText type="small">
            {t("debts.detail.amounts", {
              total: format.money(record.amount, currency),
              paid: format.money(paidTotal(record), currency),
              left: format.money(left ?? 0, currency),
            })}
          </ThemedText>
        ) : null}
        {record.item ? <ThemedText type="small">{record.item}</ThemedText> : null}
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("debts.detail.createdOn", { date: format.formatDate(record.createdOn) })}
          {record.dueOn
            ? ` · ${t("debts.row.due", { date: format.formatDate(record.dueOn) })}`
            : ""}
        </ThemedText>
        {record.witnesses?.length ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("debts.detail.witnesses", { names: record.witnesses.join(", ") })}
          </ThemedText>
        ) : null}
        {record.notes ? <ThemedText type="small">{record.notes}</ThemedText> : null}
        {record.status === "forgiven" ? (
          <JannahCallout tone="success">{t("debts.detail.forgivenNote")}</JannahCallout>
        ) : null}
        <View style={styles.actions}>
          <Button
            label={t("common.edit")}
            variant="secondary"
            size="sm"
            onPress={() => setEditing(true)}
          />
          {record.status === "open" && record.direction === "owed_to_me" ? (
            <Button
              label={t("debts.detail.forgive")}
              variant="secondary"
              size="sm"
              onPress={() => setConfirmForgive(true)}
            />
          ) : null}
          {record.status === "open" && (!isLoan(record.direction) || record.amount == null) ? (
            <Button
              label={t("debts.detail.markReturned")}
              variant="secondary"
              size="sm"
              onPress={() => void run(debtsActions.markSettled(record.id))}
            />
          ) : null}
          {record.status !== "open" ? (
            <Button
              label={t("debts.detail.reopen")}
              variant="ghost"
              size="sm"
              onPress={() => void run(debtsActions.reopen(record.id))}
            />
          ) : null}
        </View>
      </Card>

      {record.amount != null ? (
        <DebtPaymentsCard
          record={record}
          currency={currency}
          onAdd={(payment) => run(debtsActions.addPayment(record.id, payment))}
          onRemove={setRemovePaymentId}
        />
      ) : null}

      {/* NF-3.8 document photo: device-only, encrypted; hidden on TV (shared screen, no picker). */}
      {isTV() ? null : <DebtPhotoCard debtId={record.id} documentUri={record.documentUri} />}

      <Button
        label={t("debts.detail.delete")}
        variant="ghost"
        onPress={() => setConfirmDelete(true)}
      />

      <ConfirmDialog
        visible={confirmForgive}
        title={t("debts.detail.forgiveTitle")}
        message={t("debts.detail.forgiveBody")}
        confirmLabel={t("debts.detail.forgive")}
        onConfirm={() => {
          setConfirmForgive(false);
          void run(debtsActions.forgive(record.id));
        }}
        onClose={() => setConfirmForgive(false)}
      />
      <ConfirmDialog
        visible={removePaymentId != null}
        title={t("privateUx.payments.removeTitle")}
        message={t("privateUx.payments.removeBody")}
        confirmLabel={t("common.remove")}
        destructive
        onConfirm={() => {
          const paymentId = removePaymentId;
          setRemovePaymentId(null);
          if (paymentId) void run(debtsActions.removePayment(record.id, paymentId));
        }}
        onClose={() => setRemovePaymentId(null)}
      />
      <ConfirmDialog
        visible={confirmDelete}
        title={t("debts.detail.deleteTitle")}
        message={t("debts.detail.deleteBody")}
        confirmLabel={t("common.delete")}
        destructive
        onConfirm={() => {
          setConfirmDelete(false);
          void run(debtsActions.deleteDebt(record.id)).then((deleted) => {
            if (deleted) close();
          });
        }}
        onClose={() => setConfirmDelete(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
});
