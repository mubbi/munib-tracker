import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { EvidenceCard, type EvidenceItem } from "@/components/records/evidence-card";
import { useExportFeedback } from "@/components/records/use-export-feedback";
import { useRecordAction } from "@/components/records/use-record-action";
import { VaultStateNotice } from "@/components/self-review/vault-state-notice";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Spacing } from "@/constants/theme";
import { useRecordFormat } from "@/hooks/use-record-format";
import { useDebts } from "@/lib/debts/debts-store";
import { isReviewDue, REVIEW_INTERVAL_OPTIONS, wasiyyahReviewDueOn } from "@/lib/wasiyyah/review";
import { useWasiyyahExport } from "@/lib/wasiyyah/use-wasiyyah-export";
import { useWasiyyah, wasiyyahActions } from "@/lib/wasiyyah/wasiyyah-store";

export const WASIYYAH_EVIDENCE: readonly EvidenceItem[] = [
  { key: "wasiyyah.evidence.prescribed", quran: { surah: 2, ayah: 180 } },
  { key: "wasiyyah.evidence.twoNights" },
  { key: "wasiyyah.evidence.oneThird" },
  { key: "wasiyyah.evidence.noHeir" },
  { key: "wasiyyah.evidence.debtFirst", quran: { surah: 4, ayah: 11 } },
  { key: "wasiyyah.evidence.witnesses", quran: { surah: 5, ayah: 106 } },
];

/** `/wasiyyah` content (inside `VaultLockGate`): status, review, versions, export. */
export function WasiyyahOverview() {
  const { t } = useTranslation();
  const run = useRecordAction();
  const router = useRouter();
  const format = useRecordFormat();
  const { versions, draft, settings, status, error, isReady } = useWasiyyah();
  const { debts } = useDebts();
  const exportDoc = useWasiyyahExport();
  const exportFeedback = useExportFeedback();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const today = getLocalDateString();
  const latest = versions[0];
  const dueOn = useMemo(
    () => wasiyyahReviewDueOn(settings, latest?.createdAt),
    [settings, latest?.createdAt],
  );
  const intervalOptions = useMemo(
    () =>
      REVIEW_INTERVAL_OPTIONS.map((m) => ({
        id: String(m),
        label: t("wasiyyah.reviewInterval.months", { count: m }),
      })),
    [t],
  );
  const dayOf = (iso: string) => format.formatDate(getLocalDateString(new Date(iso)));

  if (status === "locked" || status === "error") {
    return <VaultStateNotice status={status} error={error} />;
  }
  if (!isReady) return null;

  const reviewDue = dueOn != null && isReviewDue(dueOn, today);
  const debtsChanged = Boolean(settings.debtsChangeNoticedOn);
  const printLatest = () => {
    if (latest) void exportFeedback.run(() => exportDoc(latest.data));
  };

  return (
    <View style={styles.stack}>
      <JannahCallout tone="info">{t("wasiyyah.intro")}</JannahCallout>

      <Card>
        <View style={styles.stack}>
          {latest ? (
            <>
              <ThemedText type="smallBold">
                {t("wasiyyah.status.saved", { date: dayOf(latest.createdAt) })}
              </ThemedText>
              {dueOn ? (
                <ThemedText type="small" themeColor="mutedForeground">
                  {reviewDue
                    ? t("wasiyyah.status.reviewDueNow")
                    : t("wasiyyah.status.reviewDue", { date: format.formatDate(dueOn) })}
                </ThemedText>
              ) : null}
              {debtsChanged ? (
                <JannahCallout tone="warning">{t("wasiyyah.status.debtsChanged")}</JannahCallout>
              ) : null}
            </>
          ) : (
            <ThemedText type="small">{t("wasiyyah.status.none")}</ThemedText>
          )}
          {draft ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("wasiyyah.draftNote")}
            </ThemedText>
          ) : null}
          <View style={styles.actions}>
            <Button
              label={t(
                draft
                  ? "wasiyyah.actions.continue"
                  : latest
                    ? "wasiyyah.actions.update"
                    : "wasiyyah.actions.start",
              )}
              onPress={() => router.push("/wasiyyah/edit" as Href)}
            />
            {latest ? (
              <Button
                label={
                  exportFeedback.busy ? t("common.export.preparing") : t("wasiyyah.actions.print")
                }
                variant="secondary"
                icon={{ ios: "printer.fill", android: "print", web: "print" }}
                disabled={exportFeedback.busy}
                onPress={printLatest}
              />
            ) : null}
            {/* Only when a review is actually asked for: one less button the rest of the year. */}
            {latest && (reviewDue || debtsChanged) ? (
              <Button
                label={t("wasiyyah.actions.markReviewed")}
                variant="ghost"
                onPress={() => void run(wasiyyahActions.markReviewed(debts))}
              />
            ) : null}
            {draft ? (
              <Button
                label={t("wasiyyah.actions.discardDraft")}
                variant="ghost"
                onPress={() => setConfirmDiscard(true)}
              />
            ) : null}
          </View>
        </View>
      </Card>

      {latest ? (
        <Card>
          <SectionHeader
            title={t("wasiyyah.reviewInterval.title")}
            subtitle={t("wasiyyah.reviewInterval.hint")}
            icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
          />
          <View style={styles.block}>
            <SegmentedControl<string>
              options={intervalOptions}
              value={String(settings.reviewIntervalMonths)}
              onChange={(v) => void run(wasiyyahActions.setReviewInterval(Number(v)))}
            />
          </View>
        </Card>
      ) : null}

      {versions.length ? (
        <Card>
          <SectionHeader
            title={t("wasiyyah.versions.title")}
            icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
          />
          <View style={styles.block}>
            {versions.map((v, index) => (
              <View key={v.id} style={styles.versionRow}>
                <View style={styles.flex}>
                  <ThemedText type="smallBold">{dayOf(v.createdAt)}</ThemedText>
                  {index === 0 ? (
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("wasiyyah.versions.current")}
                    </ThemedText>
                  ) : null}
                </View>
                <Button
                  label={t("wasiyyah.actions.print")}
                  variant="ghost"
                  size="sm"
                  disabled={exportFeedback.busy}
                  accessibilityHint={dayOf(v.createdAt)}
                  onPress={() => void exportFeedback.run(() => exportDoc(v.data))}
                />
                <Button
                  label={t("common.delete")}
                  variant="ghost"
                  size="sm"
                  accessibilityHint={dayOf(v.createdAt)}
                  onPress={() => setDeleteId(v.id)}
                />
              </View>
            ))}
          </View>
        </Card>
      ) : null}

      <Card>
        <JannahNavRow
          icon={{ ios: "list.bullet.rectangle", android: "receipt_long", web: "receipt_long" }}
          title={t("wasiyyah.debtsLink")}
          subtitle={t("wasiyyah.debtsLinkHint")}
          onPress={() => router.push("/debts" as Href)}
        />
      </Card>

      <EvidenceCard titleKey="wasiyyah.evidence.title" items={WASIYYAH_EVIDENCE} />
      <JannahDisclaimer textKey="wasiyyah.disclaimer" />

      <ConfirmDialog
        visible={confirmDiscard}
        title={t("wasiyyah.discardDraftTitle")}
        message={t("wasiyyah.discardDraftBody")}
        confirmLabel={t("wasiyyah.actions.discardDraft")}
        destructive
        onConfirm={() => {
          setConfirmDiscard(false);
          void run(wasiyyahActions.discardDraft());
        }}
        onClose={() => setConfirmDiscard(false)}
      />
      <ConfirmDialog
        visible={deleteId != null}
        title={t("wasiyyah.versions.deleteTitle")}
        message={t("wasiyyah.versions.deleteBody")}
        confirmLabel={t("common.delete")}
        destructive
        onConfirm={() => {
          if (deleteId) void run(wasiyyahActions.deleteVersion(deleteId));
          setDeleteId(null);
        }}
        onClose={() => setDeleteId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  block: { gap: Spacing.two, marginTop: Spacing.two },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  versionRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});
