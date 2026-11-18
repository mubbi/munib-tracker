import { QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import type { QazaCalculatorIssue } from "@munib-tracker/shared/utils";
import {
  computeLifetimeMissedPrayers,
  qazaObligatedYears,
  validateQazaCalculatorInput,
} from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { TFunction } from "i18next";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  type StyleProp,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { TvNumberStepper } from "@/components/tv-number-stepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { getRouteFaq } from "@/lib/seo/faq-content";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { faqSchema, webPageSchema } from "@/lib/seo/structured-data";
import { useQazaCounters, useTrackerActions } from "@/stores/tracker-store";

function toInt(value: string): number {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : 0;
}

function issueMessage(t: TFunction, issue: QazaCalculatorIssue): string {
  const key = `qazaCalc.validation.${issue.code}` as const;
  return t(key, issue.meta ?? {});
}

export default function QazaCalculatorScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const counters = useQazaCounters();
  const { setQazaCounters } = useTrackerActions();
  const [applying, setApplying] = useState(false);

  const [currentAge, setCurrentAge] = useState("");
  const [pubertyAge, setPubertyAge] = useState("15");
  const [yearsPrayed, setYearsPrayed] = useState("0");
  const [exemptDays, setExemptDays] = useState("0");
  const [yearMode, setYearMode] = useState<"lunar" | "solar">("lunar");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { width } = useWindowDimensions();
  /** Desktop / wide web: form on the start side, live result in an aside. */
  const twoPane = !isTV() && width >= 1024;
  /** Tablet + desktop: number fields in two columns instead of one 1000px-wide stack. */
  const fieldColumns = !isTV() && width >= 768;
  const fieldStyle = fieldColumns ? styles.fieldHalf : undefined;

  const input = useMemo(
    () => ({
      currentAge: toInt(currentAge),
      pubertyAge: toInt(pubertyAge),
      yearsPrayedConsistently: toInt(yearsPrayed),
      annualExemptDays: toInt(exemptDays),
      useLunarYear: yearMode === "lunar",
    }),
    [currentAge, pubertyAge, yearsPrayed, exemptDays, yearMode],
  );

  const issues = useMemo(() => validateQazaCalculatorInput(input), [input]);
  const hasIssues = issues.length > 0;
  const result = useMemo(() => computeLifetimeMissedPrayers(input), [input]);
  const obligatedYears = qazaObligatedYears(input.currentAge, input.pubertyAge);

  const fieldError = (field: QazaCalculatorIssue["field"]) => {
    const issue = issues.find((item) => item.field === field);
    return issue ? issueMessage(t, issue) : undefined;
  };

  const canApply = !hasIssues && result.missedDays > 0 && !applying;
  const showLegitimateZero = !hasIssues && input.currentAge > 0 && result.missedDays === 0;

  const applyToCounters = async () => {
    if (applying) return;
    setApplying(true);
    try {
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
      await setQazaCounters(updates);
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
    <Card padding="three">
      <View style={[styles.fields, fieldColumns && styles.fieldsGrid]}>
        <NumberField
          label={t("qazaCalc.currentAge")}
          style={fieldStyle}
          onSubmit={submitFromKeyboard}
          value={currentAge}
          onChange={setCurrentAge}
          placeholder="30"
          error={fieldError("currentAge")}
          max={120}
          preferredFocus
        />
        <NumberField
          label={t("qazaCalc.pubertyAge")}
          style={fieldStyle}
          onSubmit={submitFromKeyboard}
          value={pubertyAge}
          onChange={setPubertyAge}
          error={fieldError("pubertyAge")}
          max={30}
          steps={[1]}
        />
        <NumberField
          label={t("qazaCalc.yearsPrayed")}
          style={fieldStyle}
          onSubmit={submitFromKeyboard}
          value={yearsPrayed}
          onChange={setYearsPrayed}
          error={fieldError("yearsPrayed")}
          max={120}
          hint={
            input.currentAge > 0 && !fieldError("pubertyAge")
              ? t("qazaCalc.yearsPrayedHint", { obligatedYears })
              : undefined
          }
        />
        <NumberField
          label={t("qazaCalc.exemptDays")}
          style={fieldStyle}
          onSubmit={submitFromKeyboard}
          value={exemptDays}
          onChange={setExemptDays}
          hint={t("qazaCalc.exemptHint")}
          error={fieldError("exemptDays")}
          max={365}
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

  const guidance = (
    <>
      {hasIssues ? (
        <GuidanceBanner
          tone="danger"
          title={t("qazaCalc.fixGuideTitle")}
          body={t("qazaCalc.fixGuideBody")}
          details={issues.map((issue) => issueMessage(t, issue))}
        />
      ) : null}

      {showLegitimateZero ? (
        <GuidanceBanner
          tone="warning"
          title={t("qazaCalc.zeroResultTitle")}
          body={t("qazaCalc.zeroResultBody")}
        />
      ) : null}
    </>
  );

  const resultCard = (
    <Card style={hasIssues ? styles.resultMuted : undefined}>
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
              {hasIssues ? "—" : result.missedDays.toLocaleString()}
            </ThemedText>
            {!hasIssues ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("qazaCalc.resultYears", { years: result.missedYears })}
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
              <ThemedText type="smallBold">{result.byPrayer[prayerId].toLocaleString()}</ThemedText>
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
        message={t("qazaCalc.confirmMsg")}
        confirmLabel={t("common.apply")}
        onConfirm={applyToCounters}
        onClose={() => setConfirmOpen(false)}
      />
    </ScreenLayout>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  max = 999,
  steps = [1, 10],
  preferredFocus,
  style,
  onSubmit,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  /** TV stepper upper bound (phone input is capped at 3 digits). */
  max?: number;
  /** TV stepper increments. */
  steps?: readonly number[];
  /** TV: initial D-pad focus. */
  preferredFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Web: Enter key submits the form. */
  onSubmit?: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const borderColor = error ? tokens.status.danger.border : colors.inputBorder;
  const tv = isTV();
  return (
    <View style={style}>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.fieldLabel}>
        {label}
      </ThemedText>
      {tv ? (
        // TV: no on-screen keyboard for numbers — large −/+ step targets instead.
        <View
          style={[
            styles.tvStepperWell,
            {
              backgroundColor: error ? tokens.status.danger.soft : colors.muted,
              borderColor,
            },
          ]}
        >
          <TvNumberStepper
            value={toInt(value)}
            onChange={(next) => onChange(String(next))}
            label={label}
            max={max}
            steps={steps}
            preferredFocus={preferredFocus}
          />
        </View>
      ) : (
        <TextInput
          value={value}
          onChangeText={(text) => onChange(text.replace(/[^0-9]/g, "").slice(0, 3))}
          keyboardType="number-pad"
          onSubmitEditing={Platform.OS === "web" ? onSubmit : undefined}
          accessibilityLabel={label}
          accessibilityHint={error}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          style={[
            styles.input,
            {
              color: colors.foreground,
              backgroundColor: error ? tokens.status.danger.soft : colors.input,
              borderColor,
              borderWidth: 1,
            },
          ]}
        />
      )}
      {error ? (
        <ThemedText type="caption" style={[styles.hint, { color: tokens.status.danger.text }]}>
          {error}
        </ThemedText>
      ) : hint ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

function GuidanceBanner({
  tone,
  title,
  body,
  details,
}: {
  tone: "danger" | "warning";
  title: string;
  body: string;
  details?: string[];
}) {
  const { tokens } = useThemeTokens();
  const palette = tokens.status[tone];
  return (
    <View
      style={[styles.guidance, { backgroundColor: palette.soft, borderColor: palette.border }]}
      accessibilityRole="alert"
    >
      <SymbolView
        name={
          tone === "danger"
            ? { ios: "exclamationmark.circle.fill", android: "error", web: "error" }
            : { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" }
        }
        size={18}
        tintColor={palette.color}
      />
      <View style={styles.guidanceCopy}>
        <ThemedText type="smallBold" style={{ color: palette.text }}>
          {title}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {body}
        </ThemedText>
        {details?.map((detail) => (
          <ThemedText key={detail} type="caption" style={{ color: palette.text }}>
            • {detail}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

function Disclaimer() {
  const { tokens } = useThemeTokens();
  const { t } = useTranslation();
  return (
    <View style={[styles.disclaimer, { backgroundColor: tokens.status.warning.soft }]}>
      <SymbolView
        name={{ ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" }}
        size={16}
        tintColor={tokens.status.warning.color}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimerText}>
        {t("qazaCalc.disclaimer")}
      </ThemedText>
    </View>
  );
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
  input: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 17,
    fontWeight: "600",
  },
  hint: {
    marginTop: Spacing.one,
  },
  tvStepperWell: {
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  resultHeader: {
    alignItems: "center",
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  resultMuted: {
    opacity: 0.72,
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
    gap: 2,
  },
  guidance: {
    flexDirection: "row",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  guidanceCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  disclaimer: {
    flexDirection: "row",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  disclaimerText: {
    flex: 1,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/qaza/calculator");
