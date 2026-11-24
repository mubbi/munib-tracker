import type { DebtDirection } from "@munib-tracker/shared/types";
import { DEBT_DIRECTIONS } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { DebtPhotoCard } from "@/components/debts/debt-photo-card";
import { JannahCallout, JannahNavRow } from "@/components/jannah/primitives";
import { DayInput } from "@/components/records/day-input";
import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { Spacing } from "@/constants/theme";
import { deviceCurrency, useRecordFormat } from "@/hooks/use-record-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type DebtEntry, isLoan, outstanding, paidTotal, ribaExcess } from "@/lib/debts/debts";
import { type DebtInput, debtsActions, useDebt, useDebts } from "@/lib/debts/debts-store";
import { DEFAULT_NUMBER_FORMAT, formatNumberInput, parseNumberInput } from "@/lib/format-currency";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { dueDayPresets, normalizeDayInput } from "@/lib/records/day";
import { useToast } from "@/providers/toast-provider";

interface FormState {
  direction: DebtDirection;
  counterparty: string;
  amount: string;
  currency: string;
  item: string;
  createdOn: string;
  dueOn: string;
  witnesses: string;
  notes: string;
}

function formFrom(record: DebtEntry | undefined, direction: DebtDirection): FormState {
  return {
    direction: record?.direction ?? direction,
    counterparty: record?.counterparty ?? "",
    amount: record?.amount != null ? String(record.amount) : "",
    currency: record?.currency ?? deviceCurrency(),
    item: record?.item ?? "",
    createdOn: record?.createdOn ?? getLocalDateString(),
    dueOn: record?.dueOn ?? "",
    witnesses: (record?.witnesses ?? []).join(", "),
    notes: record?.notes ?? "",
  };
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
  const { tokens } = useThemeTokens();
  const toast = useToast();
  const { status } = useDebts();
  const isNew = id === "new";
  const record = useDebt(isNew ? undefined : id);
  const [form, setForm] = useState<FormState>(() => formFrom(record, initialDirection));
  const [editing, setEditing] = useState(isNew);
  const [error, setError] = useState<string | null>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmForgive, setConfirmForgive] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState(getLocalDateString());
  const [payNote, setPayNote] = useState("");
  const [payError, setPayError] = useState<string | null>(null);
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

  const directionOptions = useMemo(
    () => DEBT_DIRECTIONS.map((d) => ({ id: d, label: t(`debts.direction.${d}`) })),
    [t],
  );
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    if (savingRef.current) return;
    const amount = parseNumberInput(form.amount, DEFAULT_NUMBER_FORMAT);
    const createdOn = normalizeDayInput(form.createdOn);
    const dueOn = form.dueOn.trim() ? normalizeDayInput(form.dueOn) : "";
    if (!form.counterparty.trim()) return setError(t("debts.form.errorWho"));
    if (isLoan(form.direction) && !(amount > 0)) return setError(t("debts.form.errorAmount"));
    if (!createdOn || dueOn == null) return setError(t("debts.form.errorDate"));
    setError(null);
    const input: DebtInput = {
      direction: form.direction,
      counterparty: form.counterparty,
      ...(amount > 0 ? { amount, currency: form.currency } : {}),
      // A loan has no "item"; drop text left over from switching the type.
      item: isLoan(form.direction) ? "" : form.item,
      createdOn,
      ...(dueOn ? { dueOn } : {}),
      witnesses: form.witnesses.split(/[,،]/),
      notes: form.notes,
      payments: record?.payments ?? [],
      ...(record?.removedPaymentIds ? { removedPaymentIds: record.removedPaymentIds } : {}),
      status: record?.status ?? "open",
      ...(record?.forgivenOn ? { forgivenOn: record.forgivenOn } : {}),
      ...(record?.documentUri ? { documentUri: record.documentUri } : {}),
    };
    // One save at a time: a double tap on "Save" must not create two records.
    savingRef.current = true;
    setSaving(true);
    try {
      const target = isNew ? (createdId.current ?? undefined) : id;
      const savedId = await debtsActions.saveDebt(input, target);
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

  const typedPayment = parseNumberInput(payAmount, DEFAULT_NUMBER_FORMAT);
  const excess = record ? ribaExcess(record, typedPayment) : 0;

  const addPayment = () => {
    if (!record) return;
    const date = normalizeDayInput(payDate);
    if (!(typedPayment > 0)) return setPayError(t("privateUx.payments.errorAmount"));
    if (!date) return setPayError(t("debts.form.errorDate"));
    setPayError(null);
    void debtsActions
      .addPayment(record.id, {
        amount: typedPayment,
        date,
        ...(payNote.trim() ? { note: payNote } : {}),
      })
      .then(
        () => {
          setPayAmount("");
          setPayNote("");
        },
        () => toast.error(t("privateUx.saveFailed")),
      );
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

  const left = record ? outstanding(record) : null;
  const currency = record?.currency ?? form.currency;

  const formCard = (
    <Card padding="three">
      <View style={styles.form}>
        <ThemedText type="smallBold">{t("debts.form.direction")}</ThemedText>
        <SegmentedControl<DebtDirection>
          options={directionOptions}
          value={form.direction}
          onChange={(d) => set("direction", d)}
        />
        <LabeledInput
          label={t("debts.form.who")}
          value={form.counterparty}
          onChangeText={(v) => set("counterparty", v)}
          autoCapitalize="words"
        />
        <LabeledInput
          label={t(isLoan(form.direction) ? "debts.form.amount" : "debts.form.amountOptional")}
          value={form.amount}
          onChangeText={(v) => set("amount", formatNumberInput(v, 2, DEFAULT_NUMBER_FORMAT))}
          keyboardType="decimal-pad"
          placeholder="0"
        />
        <JannahNavRow
          icon={{ ios: "coloncurrencysign.circle", android: "payments", web: "payments" }}
          title={t("debts.form.currency")}
          subtitle={form.currency}
          onPress={() => setCurrencyOpen(true)}
        />
        {!isLoan(form.direction) ? (
          <LabeledInput
            label={t("debts.form.item")}
            value={form.item}
            onChangeText={(v) => set("item", v)}
            placeholder={t("debts.form.itemPlaceholder")}
          />
        ) : null}
        <DayInput
          label={t("debts.form.createdOn")}
          value={form.createdOn}
          onChangeText={(v) => set("createdOn", v)}
          hint={t("debts.form.dateHint")}
        />
        <DayInput
          label={t("debts.form.dueOn")}
          value={form.dueOn}
          onChangeText={(v) => set("dueOn", v)}
          hint={t("debts.form.dueHint")}
          presets={dueDayPresets(normalizeDayInput(form.createdOn) ?? getLocalDateString())}
        />
        <LabeledInput
          label={t("debts.form.witnesses")}
          value={form.witnesses}
          onChangeText={(v) => set("witnesses", v)}
          hint={t("debts.form.witnessesHint")}
        />
        <LabeledInput
          label={t("debts.form.notes")}
          value={form.notes}
          onChangeText={(v) => set("notes", v)}
          multiline
        />
        {error ? (
          <ThemedText
            type="small"
            style={{ color: tokens.status.danger.text }}
            accessibilityRole="alert"
          >
            {error}
          </ThemedText>
        ) : null}
        <View style={styles.actions}>
          <Button
            label={saving ? t("privateUx.saving") : t("common.save")}
            disabled={saving}
            onPress={() => void save()}
          />
          <Button
            label={t("common.cancel")}
            variant="ghost"
            onPress={() => (isNew ? close() : setEditing(false))}
          />
        </View>
      </View>
      <CurrencyPickerSheet
        visible={currencyOpen}
        selectedCode={form.currency}
        onSelect={(code) => {
          set("currency", code);
          setCurrencyOpen(false);
        }}
        onClose={() => setCurrencyOpen(false)}
      />
    </Card>
  );

  if (editing || !record) return <View style={styles.stack}>{formCard}</View>;

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
              onPress={() => void debtsActions.markSettled(record.id)}
            />
          ) : null}
          {record.status !== "open" ? (
            <Button
              label={t("debts.detail.reopen")}
              variant="ghost"
              size="sm"
              onPress={() => void debtsActions.reopen(record.id)}
            />
          ) : null}
        </View>
      </Card>

      {record.amount != null ? (
        <Card padding="three">
          <SectionHeader
            title={t("debts.payments.title")}
            icon={{ ios: "list.bullet", android: "list", web: "list" }}
          />
          <View style={styles.form}>
            {record.payments.length === 0 ? (
              <ThemedText type="small" themeColor="mutedForeground">
                {t("debts.payments.empty")}
              </ThemedText>
            ) : (
              record.payments.map((p) => (
                <View key={p.id} style={styles.payment}>
                  <View style={styles.paymentText}>
                    <ThemedText type="smallBold">{format.money(p.amount, currency)}</ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {format.formatDate(p.date)}
                      {p.note ? ` · ${p.note}` : ""}
                    </ThemedText>
                  </View>
                  <Button
                    label={t("common.remove")}
                    variant="ghost"
                    size="sm"
                    accessibilityHint={t("debts.payments.remove")}
                    onPress={() => setRemovePaymentId(p.id)}
                  />
                </View>
              ))
            )}
            {record.status === "open" ? (
              <>
                <LabeledInput
                  label={t("debts.payments.amount")}
                  value={payAmount}
                  onChangeText={(v) => setPayAmount(formatNumberInput(v, 2, DEFAULT_NUMBER_FORMAT))}
                  keyboardType="decimal-pad"
                  placeholder="0"
                />
                <DayInput
                  label={t("debts.payments.date")}
                  value={payDate}
                  onChangeText={setPayDate}
                />
                <LabeledInput
                  label={t("debts.payments.note")}
                  value={payNote}
                  onChangeText={setPayNote}
                />
                {excess > 0 ? (
                  <View style={styles.riba}>
                    <JannahCallout tone="warning">
                      {t("debts.riba.body", { excess: format.money(excess, currency) })}
                    </JannahCallout>
                    <JannahNavRow
                      icon={{ ios: "text.book.closed", android: "article", web: "article" }}
                      title={t("debts.riba.link")}
                      onPress={() =>
                        router.push({
                          pathname: "/finance/[topic]",
                          params: { topic: "riba-prohibition" },
                        } as Href)
                      }
                    />
                  </View>
                ) : null}
                {payError ? (
                  <ThemedText
                    type="small"
                    style={{ color: tokens.status.danger.text }}
                    accessibilityRole="alert"
                  >
                    {payError}
                  </ThemedText>
                ) : null}
                <Button label={t("debts.payments.add")} onPress={addPayment} />
              </>
            ) : null}
          </View>
        </Card>
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
          void debtsActions.forgive(record.id);
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
          if (paymentId) void debtsActions.removePayment(record.id, paymentId);
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
          void debtsActions.deleteDebt(record.id).then(close);
        }}
        onClose={() => setConfirmDelete(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  form: { gap: Spacing.three, marginTop: Spacing.two },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
  payment: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  paymentText: { flex: 1, gap: 2 },
  riba: { gap: Spacing.two },
});
