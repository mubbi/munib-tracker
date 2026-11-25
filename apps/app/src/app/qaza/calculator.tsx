import { QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import type { QazaCalculatorIssue } from "@munib-tracker/shared/utils";
import {
  computeLifetimeMissedPrayers,
  qazaObligatedYears,
  validateQazaCalculatorInput,
} from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import type { TFunction } from "i18next";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { isNumberInRange, NumberField } from "@/components/ui/number-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Breakpoints, Spacing } from "@/constants/theme";
import { useFormatCount } from "@/hooks/use-format-count";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { triggerHaptic } from "@/lib/haptics";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { getRouteFaq } from "@/lib/seo/faq-content";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { faqSchema, webPageSchema } from "@/lib/seo/structured-data";
import { useQazaCounters, useTrackerActions } from "@/stores/tracker-store";

/** Shown as the placeholder; used when the field is left empty. */
const DEFAULT_PUBERTY_AGE = 15;
/** Field bounds. A value outside them stays as typed, shows its error and blocks Apply (B-03). */
const MAX_AGE = 120;
const MAX_PUBERTY_AGE = 30;
const MAX_EXEMPT_DAYS = 365;

function issueMessage(t: TFunction, issue: QazaCalculatorIssue): string {
  const key = `qazaCalc.validation.${issue.code}` as const;
  return t(key, issue.meta ?? {});
}

export default function QazaCalculatorScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const undoToast = useUndoToast();
  const formatCount = useFormatCount();
  const counters = useQazaCounters();
  const { setQazaCounters } = useTrackerActions();
  const [applying, setApplying] = useState(false);

  const [currentAge, setCurrentAge] = useState<number | undefined>(undefined);
  /** The age field was edited (NumberField reports a typed 0 as `undefined`, too). */
  const [ageTouched, setAgeTouched] = useState(false);
  const [pubertyAge, setPubertyAge] = useState<number | undefined>(undefined);
  const [yearsPrayed, setYearsPrayed] = useState<number | undefined>(undefined);
  const [exemptDays, setExemptDays] = useState<number | undefined>(undefined);
  const [yearMode, setYearMode] = useState<"lunar" | "solar">("lunar");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { width } = useWindowDimensions();
  /** Desktop / wide web: form on the start side, live result in an aside. */
  const twoPane = !isTV() && width >= Breakpoints.wide;
  /** Tablet + desktop: number fields in two columns instead of one 1000px-wide stack. */
  const fieldColumns = !isTV() && width >= Breakpoints.tablet;
  const fieldStyle = fieldColumns ? styles.fieldHalf : undefined;

  const input = useMemo(
    () => ({
      currentAge: currentAge ?? 0,
      pubertyAge: pubertyAge ?? DEFAULT_PUBERTY_AGE,
      yearsPrayedConsistently: yearsPrayed ?? 0,
      annualExemptDays: exemptDays ?? 0,
      useLunarYear: yearMode === "lunar",
    }),
    [currentAge, pubertyAge, yearsPrayed, exemptDays, yearMode],
  );

  // An untouched age field is not an error — the result shows the "enter your age"
  // prompt instead. (Validating `undefined` as 0 opened the screen with a red field
  // and a "Check your numbers" callout before anything was typed.) Typing 0 still errors.
  const issues = useMemo(
    () =>
      validateQazaCalculatorInput(input).filter(
        (issue) => !(issue.code === "needCurrentAge" && !ageTouched),
      ),
    [input, ageTouched],
  );
  // NumberField reports out-of-range input as typed (and shows the range error),
  // so the bounds are checked here too — an estimate is never built from them.
  const outOfRange =
    !isNumberInRange(currentAge, 0, MAX_AGE) ||
    !isNumberInRange(pubertyAge, 0, MAX_PUBERTY_AGE) ||
    !isNumberInRange(yearsPrayed, 0, MAX_AGE) ||
    !isNumberInRange(exemptDays, 0, MAX_EXEMPT_DAYS);
  const hasIssues = issues.length > 0 || outOfRange;
  const result = useMemo(() => computeLifetimeMissedPrayers(input), [input]);
  const obligatedYears = qazaObligatedYears(input.currentAge, input.pubertyAge);

  const fieldError = (field: QazaCalculatorIssue["field"]) => {
    const issue = issues.find((item) => item.field === field);
    return issue ? issueMessage(t, issue) : undefined;
  };

  const canApply = !hasIssues && result.missedDays > 0 && !applying;
  const showLegitimateZero = !hasIssues && input.currentAge > 0 && result.missedDays === 0;

  const previousTotal = counters.reduce((sum, c) => sum + c.remaining, 0);
  /** What Apply writes in total: the estimate for each fard Salah and Witr (B-06). */
  const nextTotal = QAZA_PRAYERS.reduce((sum, prayerId) => sum + result.byPrayer[prayerId], 0);

  const applyToCounters = async () => {
    if (applying) return;
    setApplying(true);
    try {
      const previous = Object.fromEntries(
        counters.map((c) => [c.prayerId, { remaining: c.remaining, completed: c.completed }]),
      );
      const updates = Object.fromEntries(
        QAZA_PRAYERS.map((prayerId) => {
          const existing = counters.find((c) => c.prayerId === prayerId);
          return [
            prayerId,
            {
              remaining: result.byPrayer[prayerId],
              completed: existing?.completed ?? 0,
            },
          ];
        }),
      );
      triggerHaptic("success");
      await undoToast.run({
        do: () => setQazaCounters(updates),
        undo: () => setQazaCounters(previous),
        messageKey: "qazaCalc.toastApplied",
      });
      goBackOrReplace(router, "/qaza");
    } finally {
      setApplying(false);
    }
  };

  /** Web: Enter in any field opens the apply confirmation (when the result is valid). */
  const submitFromKeyboard = () => {
    if (canApply) setConfirmOpen(true);
  };

  const formCard = (
    <Card>
      <View style={[styles.fields, fieldColumns && styles.fieldsGrid]}>
        <NumberField
          label={t("qazaCalc.currentAge")}
          style={fieldStyle}
          onSubmitEditing={submitFromKeyboard}
          value={currentAge}
          onChangeValue={(next) => {
            setAgeTouched(true);
            setCurrentAge(next);
          }}
          maxFractionDigits={0}
          placeholder="30"
          error={fieldError("currentAge")}
          max={MAX_AGE}
        />
        <NumberField
          label={t("qazaCalc.pubertyAge")}
          style={fieldStyle}
          onSubmitEditing={submitFromKeyboard}
          value={pubertyAge}
          onChangeValue={setPubertyAge}
          maxFractionDigits={0}
          placeholder={String(DEFAULT_PUBERTY_AGE)}
          error={fieldError("pubertyAge")}
          // 0 is a typed value, not "empty" — never fall back to the default (B-03).
          allowZero
          max={MAX_PUBERTY_AGE}
        />
        <NumberField
          label={t("qazaCalc.yearsPrayed")}
          style={fieldStyle}
          onSubmitEditing={submitFromKeyboard}
          value={yearsPrayed}
          onChangeValue={setYearsPrayed}
          maxFractionDigits={0}
          placeholder="0"
          error={fieldError("yearsPrayed")}
          max={MAX_AGE}
          helperText={
            input.currentAge > 0 && !fieldError("pubertyAge") && !outOfRange
              ? t("qazaCalc.yearsPrayedHint", { obligatedYears })
              : undefined
          }
        />
        <NumberField
          label={t("qazaCalc.exemptDays")}
          style={fieldStyle}
          onSubmitEditing={submitFromKeyboard}
          value={exemptDays}
          onChangeValue={setExemptDays}
          maxFractionDigits={0}
          placeholder="0"
          helperText={t("qazaCalc.exemptHint")}
          error={fieldError("exemptDays")}
          max={MAX_EXEMPT_DAYS}
        />
        <View style={fieldColumns ? styles.fieldFull : undefined}>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.fieldLabel}>
            {t("qazaCalc.yearLength")}
          </ThemedText>
          <SegmentedControl<"lunar" | "solar">
            options={[
              { id: "lunar", label: t("qazaCalc.lunar") },
              { id: "solar", label: t("qazaCalc.solar") },
            ]}
            value={yearMode}
            onChange={setYearMode}
          />
        </View>
      </View>
    </Card>
  );

  // Field errors sit under their fields; this is the one form-level summary (no repeated list).
  const guidance = (
    <>
      {hasIssues ? (
        <Callout tone="warning" title={t("qazaCalc.fixGuideTitle")}>
          {t("qazaCalc.fixGuideBody")}
        </Callout>
      ) : null}

      {showLegitimateZero ? (
        <Callout tone="info" title={t("qazaCalc.zeroResultTitle")}>
          {t("qazaCalc.zeroResultBody")}
        </Callout>
      ) : null}
    </>
  );

  const resultCard = (
    <Card padding="four">
      <View style={styles.resultHeader}>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("qazaCalc.estimatedDays")}
        </ThemedText>
        {input.currentAge <= 0 && !hasIssues ? (
          <ThemedText type="small" themeColor="mutedForeground" style={styles.enterPrompt}>
            {tTv(t, "qazaCalc.enterAgePrompt", "qazaCalc.enterAgePromptTv")}
          </ThemedText>
        ) : (
          <>
            <ThemedText
              type="header"
              style={hasIssues ? { color: tokens.status.danger.text } : undefined}
            >
              {hasIssues ? "—" : formatCount(result.missedDays)}
            </ThemedText>
            {!hasIssues ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("qazaCalc.resultYears", { years: formatCount(result.missedYears) })}
              </ThemedText>
            ) : (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("qazaCalc.resultBlocked")}
              </ThemedText>
            )}
          </>
        )}
      </View>
      {!hasIssues && input.currentAge > 0 ? (
        <View style={styles.perPrayer}>
          {QAZA_PRAYERS.map((prayerId) => (
            <View key={prayerId} style={styles.perPrayerItem}>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t(`prayers.${prayerId}`)}
              </ThemedText>
              <ThemedText type="smallBold">{formatCount(result.byPrayer[prayerId])}</ThemedText>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );

  const applyButton = (
    <Button
      label={t("qazaCalc.apply")}
      icon={{ ios: "square.and.arrow.down", android: "save", web: "save" }}
      fullWidth
      disabled={!canApply}
      onPress={() => setConfirmOpen(true)}
    />
  );

  return (
    <ScreenLayout
      maxContentWidth={twoPane ? 1320 : undefined}
      eyebrow={t("qazaCalc.eyebrow")}
      title={t("qazaCalc.title")}
      subtitle={t("qazaCalc.subtitle")}
      onBack={() => goBackOrReplace(router, "/qaza")}
    >
      <Seo
        path="/qaza/calculator"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("qaza.title"), path: "/qaza" },
          { name: t("qazaCalc.title"), path: "/qaza/calculator" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/qaza/calculator",
            name: "Qaza Prayer Calculator",
            description:
              "Estimate a lifetime of missed prayers from your age, age at puberty, and years prayed.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("qaza.title"), path: "/qaza" },
              { name: t("qazaCalc.title"), path: "/qaza/calculator" },
            ],
          }),
          faqSchema(getRouteFaq("/qaza/calculator") ?? []),
        ]}
      />
      <Stagger>
        {twoPane ? (
          <View style={styles.split}>
            <View style={styles.primary}>
              {formCard}
              {guidance}
            </View>
            <View style={styles.aside}>
              {resultCard}
              {applyButton}
              <Disclaimer />
            </View>
          </View>
        ) : null}
        {twoPane ? null : formCard}
        {twoPane ? null : guidance}
        {twoPane ? null : resultCard}
        {twoPane ? null : applyButton}
        {twoPane ? null : <Disclaimer />}
      </Stagger>

      <ConfirmDialog
        visible={confirmOpen}
        title={t("qazaCalc.confirmTitle")}
        message={t("qazaCalc.confirmTotalsMsg", {
          from: formatCount(previousTotal),
          to: formatCount(nextTotal),
        })}
        confirmLabel={t("common.apply")}
        destructive
        onConfirm={applyToCounters}
        onClose={() => setConfirmOpen(false)}
      />
    </ScreenLayout>
  );
}

function Disclaimer() {
  const { t } = useTranslation();
  return <Callout tone="warning">{t("qazaCalc.disclaimer")}</Callout>;
}

const styles = StyleSheet.create({
  split: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.four,
  },
  primary: {
    flex: 1,
    minWidth: 0,
    maxWidth: 720,
    gap: Spacing.three,
  },
  aside: {
    flex: 1,
    minWidth: 320,
    maxWidth: 440,
    gap: Spacing.three,
  },
  fields: {
    gap: Spacing.three,
  },
  fieldsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: Spacing.three,
  },
  fieldHalf: {
    flexBasis: "40%",
    flexGrow: 1,
    minWidth: 0,
  },
  fieldFull: {
    flexBasis: "100%",
  },
  fieldLabel: {
    marginBottom: Spacing.one,
  },
  resultHeader: {
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  enterPrompt: {
    textAlign: "center",
    paddingHorizontal: Spacing.two,
  },
  perPrayer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  perPrayerItem: {
    alignItems: "center",
    minWidth: "28%",
    gap: Spacing.half,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/qaza/calculator");
