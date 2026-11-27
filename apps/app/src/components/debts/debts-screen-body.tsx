import type { DebtDirection } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { EvidenceCard, type EvidenceItem } from "@/components/records/evidence-card";
import { useExportFeedback } from "@/components/records/use-export-feedback";
import { VaultStateNotice } from "@/components/self-review/vault-state-notice";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { Spacing } from "@/constants/theme";
import { useRecordFormat } from "@/hooks/use-record-format";
import { DEBT_TABS, type DebtTab, debtsForTab, outstandingByCurrency } from "@/lib/debts/debts";
import { useDebts } from "@/lib/debts/debts-store";
import { useDebtsStatementExport } from "@/lib/debts/use-debts-export";
import { useObligationsSummary } from "@/lib/debts/use-obligations";

import { DebtRow } from "./debt-row";
import { ObligationsCard } from "./obligations-card";

export const DEBTS_EVIDENCE: readonly EvidenceItem[] = [
  { key: "debts.evidence.writeDown", quran: { surah: 2, ayah: 282 } },
  { key: "debts.evidence.forgive", quran: { surah: 2, ayah: 280 } },
  { key: "debts.evidence.suspended" },
  { key: "debts.evidence.martyr" },
  { key: "debts.evidence.intention" },
];

/**
 * `/debts` content (inside `VaultLockGate`): tabs, totals, obligations, export.
 * Phones push `/debts/[id]`; the wide master–detail layout passes `onOpenRecord`
 * / `onAddRecord` to show the record beside the list instead, and `selectedId`
 * to mark the open row.
 */
export function DebtsScreenBody({
  selectedId,
  onOpenRecord,
  onAddRecord,
}: {
  selectedId?: string | null;
  onOpenRecord?: (id: string) => void;
  onAddRecord?: (direction: DebtDirection) => void;
} = {}) {
  const { t } = useTranslation();
  const router = useRouter();
  const format = useRecordFormat();
  const { debts, vows, status, error } = useDebts();
  const obligations = useObligationsSummary(vows);
  const [tab, setTab] = useState<DebtTab>("i_owe");
  const today = getLocalDateString();

  const rows = useMemo(() => debtsForTab(debts, tab), [debts, tab]);
  const tabOptions = useMemo(
    () => DEBT_TABS.map((id) => ({ id, label: t(`debts.tabs.${id}`) })),
    [t],
  );
  const totals = (direction: "i_owe" | "owed_to_me") =>
    Object.entries(outstandingByCurrency(debts, direction))
      .map(([code, amount]) => (code ? format.money(amount, code) : String(amount)))
      .join(" · ") || "—";

  const exportDebtsStatement = useDebtsStatementExport();
  const exportFeedback = useExportFeedback();
  const exportStatement = () => {
    void exportFeedback.run(() => exportDebtsStatement({ debts, obligations, today }));
  };

  if (status === "locked" || status === "error") {
    return <VaultStateNotice status={status} error={error} />;
  }
  // Don't flash "nothing recorded" totals while the encrypted record opens.
  if (status !== "ready") return <SkeletonPlaceholder preset="rows" count={3} />;

  const addRecord = () => {
    const direction: DebtDirection = tab === "trusts" ? "trust_held" : tab;
    if (onAddRecord) onAddRecord(direction);
    else
      router.push({
        pathname: "/debts/[id]",
        params: { id: "new", direction },
      } as Href);
  };

  return (
    <View style={styles.stack}>
      <JannahCallout tone="info">{t("debts.intro")}</JannahCallout>

      <Card>
        <View style={styles.totals}>
          <View style={styles.total}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("debts.totals.iOwe")}
            </ThemedText>
            <ThemedText type="subtitle">{totals("i_owe")}</ThemedText>
          </View>
          <View style={styles.total}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("debts.totals.owedToMe")}
            </ThemedText>
            <ThemedText type="subtitle">{totals("owed_to_me")}</ThemedText>
          </View>
        </View>
      </Card>

      <SegmentedControl<DebtTab> options={tabOptions} value={tab} onChange={setTab} />

      <View style={styles.list}>
        {rows.length === 0 ? (
          <EmptyState
            icon={{ ios: "doc.text", android: "description", web: "description" }}
            title={t(`debts.empty.${tab}`)}
            actionLabel={t("debts.add")}
            onAction={addRecord}
          />
        ) : (
          rows.map((record) => (
            <DebtRow
              key={record.id}
              record={record}
              today={today}
              selected={selectedId === record.id}
              onPress={() =>
                onOpenRecord
                  ? onOpenRecord(record.id)
                  : router.push({ pathname: "/debts/[id]", params: { id: record.id } } as Href)
              }
            />
          ))
        )}
        {rows.length > 0 ? (
          <Button
            label={t("debts.add")}
            icon={{ ios: "plus", android: "add", web: "add" }}
            onPress={addRecord}
          />
        ) : null}
      </View>

      <ObligationsCard obligations={obligations} vows={vows} />

      <Card>
        <SectionHeader
          title={t("debts.more")}
          icon={{ ios: "doc.text.fill", android: "description", web: "description" }}
        />
        <View style={styles.rows}>
          <JannahNavRow
            icon={{ ios: "scroll.fill", android: "history_edu", web: "history_edu" }}
            title={t("debts.wasiyyahLink")}
            subtitle={t("debts.wasiyyahLinkHint")}
            onPress={() => router.push("/wasiyyah" as Href)}
            href="/wasiyyah"
          />
          <JannahNavRow
            icon={{ ios: "square.and.arrow.up", android: "ios_share", web: "ios_share" }}
            title={t("debts.export")}
            subtitle={exportFeedback.busy ? t("common.export.preparing") : t("debts.exportHint")}
            onPress={exportStatement}
          />
        </View>
      </Card>

      <EvidenceCard titleKey="debts.evidence.title" items={DEBTS_EVIDENCE} />
      <JannahDisclaimer textKey="debts.disclaimer" />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  totals: { flexDirection: "row", gap: Spacing.three, flexWrap: "wrap" },
  total: { flex: 1, minWidth: 140, gap: Spacing.half },
  list: { gap: Spacing.two },
  rows: { gap: Spacing.two, marginTop: Spacing.two },
});
