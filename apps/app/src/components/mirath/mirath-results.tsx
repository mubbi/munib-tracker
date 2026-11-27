import type { MadhhabId } from "@munib-tracker/shared/fiqh";
import { type HeirType, type MirathResult, toFractionString } from "@munib-tracker/shared/mirath";
import type { Ref } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View, type ViewInstance } from "react-native";

import { MadhhabBadge } from "@/components/fiqh/madhhab-badge";
import { JannahCallout } from "@/components/jannah/primitives";
import { MirathShareChart } from "@/components/mirath/mirath-chart";
import { MirathHeirRow } from "@/components/mirath/mirath-heir-row";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useRecordFormat } from "@/hooks/use-record-format";
import { baseSummary, SPECIAL_CASE_KEYS } from "@/lib/mirath/explain";
import { debtsExceedEstate, partitionHeirs } from "@/lib/mirath/results-view";

// Public import path for the comparison table (split into its own file).
export { MirathCompareTable } from "@/components/mirath/mirath-compare-table";

/** Results for one school: callouts, base/'awl/radd summary, rows. */
export function MirathResultView({
  result,
  school,
  currency,
  highlight = [],
  headingRef,
}: {
  result: MirathResult;
  /** The school shown in the badge (`null` = all-views mode, browsing one school). */
  school: MadhhabId | null;
  currency?: string;
  highlight?: readonly HeirType[];
  /** Focus / scroll target for "Show shares" (the results heading). */
  headingRef?: Ref<ViewInstance>;
}) {
  const { t } = useTranslation();
  const { money } = useRecordFormat();
  const { inheriting, excluded } = partitionHeirs(result);
  const meta = baseSummary(result);
  // Debts above the estate leave nothing to divide: explain it once instead of
  // showing every heir an unexplained zero.
  const debtsExceed = debtsExceedEstate(result);
  const rowCurrency = debtsExceed ? undefined : currency;

  return (
    <Card>
      <View style={styles.headerRow}>
        <View
          ref={headingRef}
          accessible
          focusable
          style={styles.headingTarget}
          {...(Platform.OS === "web" ? ({ tabIndex: -1 } as object) : null)}
        >
          <SectionHeader
            title={t("mirath.result.title", { school: t(`fiqh.school.${result.school}`) })}
            icon={{ ios: "chart.pie.fill", android: "pie_chart", web: "pie_chart" }}
          />
        </View>
        <MadhhabBadge school={school ?? result.school} />
      </View>
      {highlight.some((heir) => result.heirs.some((h) => h.heir === heir)) ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.meta}>
          {t("mirath.highlightHint")}
        </ThemedText>
      ) : null}

      {result.outcome === "dhawu_al_arham" ? (
        <JannahCallout tone="warning">{t("mirath.result.dhawuAlArham")}</JannahCallout>
      ) : null}
      {result.specialCases.map((c) => (
        <JannahCallout key={c} tone={c === "shibh_malikiyyah" ? "warning" : "info"}>
          {t(SPECIAL_CASE_KEYS[c])}
        </JannahCallout>
      ))}

      {result.outcome === "distributed" ? (
        <View style={styles.meta}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t(meta.base.key, meta.base.values)}
          </ThemedText>
          {meta.tashih ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t(meta.tashih.key, meta.tashih.values)}
            </ThemedText>
          ) : null}
          {result.radd ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("mirath.result.radd")}
            </ThemedText>
          ) : null}
        </View>
      ) : null}

      <MirathShareChart result={result} />

      {debtsExceed && result.estate && currency ? (
        <JannahCallout tone="warning">
          {t("mirath.result.debtsExceedEstate", {
            owed: money(result.estate.funeral + result.estate.debts, currency),
            gross: money(result.estate.gross, currency),
          })}
        </JannahCallout>
      ) : null}
      {result.estate && currency ? (
        <View style={styles.meta}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("mirath.estate.distributableLine", {
              amount: money(result.estate.distributable, currency),
            })}
          </ThemedText>
          {result.estate.bequestCapped ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("mirath.estate.bequestCapped", {
                amount: money(result.estate.bequests, currency),
              })}
            </ThemedText>
          ) : null}
        </View>
      ) : null}

      <View style={styles.rows}>
        {inheriting.map((h) => (
          <MirathHeirRow
            key={h.heir}
            heir={h}
            currency={rowCurrency}
            highlight={highlight.includes(h.heir)}
          />
        ))}
        {result.unallocated ? (
          <JannahCallout tone="warning">
            {t(`mirath.result.unallocated.${result.unallocated.reason}`, {
              fraction: toFractionString(result.unallocated.share),
              amount:
                result.unallocated.amount != null && rowCurrency
                  ? money(result.unallocated.amount, rowCurrency)
                  : "",
            })}
          </JannahCallout>
        ) : null}
        {excluded.length ? (
          <ThemedText type="smallBold" style={styles.excludedTitle}>
            {t("mirath.result.excludedTitle")}
          </ThemedText>
        ) : null}
        {excluded.map((h) => (
          <MirathHeirRow
            key={h.heir}
            heir={h}
            currency={rowCurrency}
            highlight={highlight.includes(h.heir)}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { gap: Spacing.two },
  headingTarget: { alignSelf: "stretch" },
  meta: { marginTop: Spacing.two, gap: Spacing.half },
  rows: { marginTop: Spacing.three, gap: Spacing.two },
  excludedTitle: { marginTop: Spacing.two },
});
