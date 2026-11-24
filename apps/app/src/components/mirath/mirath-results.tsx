import type { MadhhabId } from "@munib-tracker/shared/fiqh";
import { MADHHAB_IDS } from "@munib-tracker/shared/fiqh";
import {
  differingHeirs,
  HEIR_TYPES,
  type HeirType,
  type MirathHeirShare,
  type MirathResult,
  toFractionString,
} from "@munib-tracker/shared/mirath";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { MadhhabBadge } from "@/components/fiqh/madhhab-badge";
import { JannahCallout } from "@/components/jannah/primitives";
import { MirathShareChart } from "@/components/mirath/mirath-chart";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { useRecordFormat } from "@/hooks/use-record-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { baseSummary, explainHeir, heirCountLabel, SPECIAL_CASE_KEYS } from "@/lib/mirath/explain";

/** One heir row: label, fraction, percentage bar, amount and a "Why?" disclosure. */
function HeirRow({
  heir,
  currency,
  highlight,
}: {
  heir: MirathHeirShare;
  currency?: string;
  highlight: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { money } = useRecordFormat();
  const [open, setOpen] = useState(false);
  const label = heirCountLabel(t, heir.heir, heir.count);
  const fraction = toFractionString(heir.share);
  const why = explainHeir(t, heir);
  return (
    <View
      style={[
        styles.row,
        { borderColor: highlight ? tokens.accentBorder : tokens.hairline },
        highlight && { backgroundColor: tokens.accentSoft },
      ]}
    >
      <View style={styles.rowHead}>
        <View style={styles.rowLabel}>
          <ThemedText type="smallBold">{label}</ThemedText>
          {heir.inherits ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {heir.count > 1
                ? t("mirath.result.perHead", { fraction: toFractionString(heir.perHead) })
                : t(`mirath.basis.${heir.basis}`)}
            </ThemedText>
          ) : (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("mirath.result.noShare")}
            </ThemedText>
          )}
        </View>
        <View style={styles.rowValue}>
          <ThemedText
            type="smallBold"
            accessibilityLabel={t("mirath.result.fractionA11y", { fraction })}
          >
            {heir.inherits ? fraction : "—"}
          </ThemedText>
          {heir.inherits ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("mirath.result.percent", { percent: heir.percent })}
            </ThemedText>
          ) : null}
        </View>
      </View>
      {heir.inherits ? (
        // Bars fill from the reading edge: flex layout flips in RTL by itself.
        <View style={[styles.track, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${Math.min(100, Math.max(1, heir.percent))}%`,
                backgroundColor: colors.accent,
              },
            ]}
          />
        </View>
      ) : null}
      {heir.amount != null && currency && heir.inherits ? (
        <ThemedText type="small">
          {heir.count > 1
            ? heir.perHeadAmountMax != null && heir.perHeadAmountMax !== heir.perHeadAmount
              ? t("mirath.result.amountEachRange", {
                  amount: money(heir.amount, currency),
                  low: money(heir.perHeadAmount ?? 0, currency),
                  high: money(heir.perHeadAmountMax, currency),
                })
              : t("mirath.result.amountEach", {
                  amount: money(heir.amount, currency),
                  each: money(heir.perHeadAmount ?? 0, currency),
                })
            : money(heir.amount, currency)}
        </ThemedText>
      ) : null}
      <PressableScale
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={t("mirath.result.whyA11y", { heir: label })}
        onPress={() => setOpen((o) => !o)}
        scaleTo={0.98}
        style={styles.why}
      >
        <ThemedText type="label" style={{ color: colors.accentText }}>
          {open ? t("mirath.result.hideWhy") : t("mirath.result.why")}
        </ThemedText>
      </PressableScale>
      {open ? (
        <View style={styles.whyList}>
          {why.map((line) => (
            <ThemedText key={line} type="small" themeColor="mutedForeground">
              {`• ${line}`}
            </ThemedText>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/** Results for one school: callouts, base/'awl/radd summary, rows. */
export function MirathResultView({
  result,
  school,
  currency,
  highlight = [],
}: {
  result: MirathResult;
  /** The school shown in the badge (`null` = all-views mode, browsing one school). */
  school: MadhhabId | null;
  currency?: string;
  highlight?: readonly HeirType[];
}) {
  const { t } = useTranslation();
  const { money } = useRecordFormat();
  const inheriting = result.heirs.filter((h) => h.inherits);
  const excluded = result.heirs.filter((h) => !h.inherits);
  const meta = baseSummary(result);
  // Debts above the estate leave nothing to divide: explain it once instead of
  // showing every heir an unexplained zero.
  const debtsExceed = result.issues.some((i) => i.code === "debts_exceed_estate");
  const rowCurrency = debtsExceed ? undefined : currency;

  return (
    <Card padding="three">
      <View style={styles.headerRow}>
        <SectionHeader
          title={t("mirath.result.title", { school: t(`fiqh.school.${result.school}`) })}
          icon={{ ios: "chart.pie.fill", android: "pie_chart", web: "pie_chart" }}
        />
        <MadhhabBadge school={school ?? result.school} />
      </View>

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
          <HeirRow
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
          <HeirRow
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

/** Side-by-side table of the four schools; differing rows are highlighted. */
export function MirathCompareTable({
  results,
  selected,
}: {
  results: Record<MadhhabId, MirathResult>;
  selected: MadhhabId | null;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const differ = differingHeirs(results);
  const heirs = HEIR_TYPES.filter((h) => results.hanafi.heirs.some((x) => x.heir === h));
  const cell = (school: MadhhabId, heir: HeirType) => {
    const share = results[school].heirs.find((x) => x.heir === heir);
    return share?.inherits ? toFractionString(share.share) : "—";
  };
  return (
    <Card padding="three">
      <SectionHeader
        title={t("mirath.compare.title")}
        icon={{ ios: "square.grid.2x2", android: "grid_view", web: "grid_view" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.compareHint}>
        {differ.length ? t("mirath.compare.differ") : t("mirath.compare.same")}
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table} accessibilityRole="summary">
          <View style={[styles.tr, { borderColor: tokens.hairline }]}>
            <ThemedText type="label" style={styles.thHeir}>
              {t("mirath.compare.heir")}
            </ThemedText>
            {MADHHAB_IDS.map((s) => (
              <ThemedText
                key={s}
                type="label"
                style={[styles.th, selected === s && { color: colors.accentText }]}
              >
                {t(`fiqh.school.${s}`)}
              </ThemedText>
            ))}
          </View>
          {heirs.map((h) => {
            const count = results.hanafi.heirs.find((x) => x.heir === h)?.count ?? 1;
            const diff = differ.includes(h);
            return (
              <View
                key={h}
                style={[
                  styles.tr,
                  { borderColor: tokens.hairline },
                  diff && { backgroundColor: tokens.accentSoft },
                ]}
                accessibilityLabel={
                  diff
                    ? t("mirath.compare.rowDifferA11y", { heir: heirCountLabel(t, h, count) })
                    : undefined
                }
              >
                <ThemedText type="small" style={styles.thHeir}>
                  {heirCountLabel(t, h, count)}
                </ThemedText>
                {MADHHAB_IDS.map((s) => (
                  <ThemedText key={s} type={diff ? "smallBold" : "small"} style={styles.td}>
                    {cell(s, h)}
                  </ThemedText>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: { gap: Spacing.two },
  meta: { marginTop: Spacing.two, gap: Spacing.half },
  rows: { marginTop: Spacing.three, gap: Spacing.two },
  row: { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.two, gap: Spacing.one },
  rowHead: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.two },
  rowLabel: { flex: 1, minWidth: 0, gap: Spacing.half },
  rowValue: { alignItems: "flex-end", gap: Spacing.half },
  track: { height: 6, borderRadius: 3, overflow: "hidden", flexDirection: "row" },
  fill: { height: 6, borderRadius: 3 },
  why: { alignSelf: "flex-start", paddingVertical: Spacing.half },
  whyList: { gap: Spacing.one },
  excludedTitle: { marginTop: Spacing.two },
  compareHint: { marginTop: Spacing.one, marginBottom: Spacing.two },
  table: { minWidth: 520 },
  tr: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.two,
  },
  thHeir: { width: 180, paddingHorizontal: Spacing.one },
  th: { width: 84, textAlign: "center" },
  td: { width: 84, textAlign: "center" },
});
