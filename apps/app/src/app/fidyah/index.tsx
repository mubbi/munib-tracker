import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { FidyahFiqhPanel } from "@/components/fidyah/fidyah-fiqh-panel";
import {
  LearnColumnsGrid,
  LearnTwoPane,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { CurrencyField } from "@/components/money/currency-field";
import { useMoneyNumberFormat } from "@/components/money/use-number-format";
import { amountFromText, amountToText } from "@/components/records/amount-text";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { NumberField } from "@/components/ui/number-field";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { parseFidyahRouteParams, useFidyahCalculator } from "@/hooks/use-fidyah-calculator";
import { useMadhhabPrompt } from "@/hooks/use-madhhab-prompt";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import type { FidyahScenario } from "@/lib/fidyah";
import { getFidyahGuideSectionOrder, getFidyahGuideTopicsBySection } from "@/lib/fidyah-guide";
import { formatMoneyAmount } from "@/lib/format-currency";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

const SECTION_ICONS: Record<string, AppIcon> = {
  overview: { ios: "info.circle.fill", android: "info", web: "info" },
  fidyah: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
  kaffarah: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  practice: { ios: "checklist", android: "checklist", web: "checklist" },
};

export default function FidyahScreen() {
  // §4.1.1 item 4: once per session while the madhhab was never chosen.
  const madhhabPrompt = useMadhhabPrompt();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useThemeTokens();
  // `/fidyah?scenario=fidyah&days=3` (Ramadan "Days to make up") prefills the helper.
  const params = useLocalSearchParams<{ scenario?: string; days?: string }>();
  const calc = useFidyahCalculator(parseFidyahRouteParams(params));
  const numberFormat = useMoneyNumberFormat();
  const wide = useLearnHubLayout();
  // Desktop calculator: inputs side by side, live estimate in a sticky aside.
  const fieldsInRow = wide.mainWidth >= 640;
  const navCols = learnColumnsFor(wide.mainWidth - Spacing.three * 2, { minCell: 280, max: 2 });
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const topicsBySection = useMemo(
    () => getFidyahGuideTopicsBySection(),
    [i18n.language, overlayVersion],
  );
  const sectionOrder = getFidyahGuideSectionOrder();

  const scenarioOptions = useMemo(
    () => [
      { id: "fidyah" as const, label: t("fidyah.scenario.fidyah") },
      { id: "kaffarah" as const, label: t("fidyah.scenario.kaffarah") },
    ],
    [t],
  );

  const resultView = (
    <View
      style={[styles.result, wide.twoPane && styles.resultAside, { backgroundColor: colors.muted }]}
    >
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("fidyah.estimateLabel")}
      </ThemedText>
      <ThemedText type="subtitle">
        {calc.hasInput
          ? formatMoneyAmount(calc.result.amountEstimate, calc.currencyCode, numberFormat)
          : t("fidyah.estimateEmpty")}
      </ThemedText>
      {calc.hasInput ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {calc.scenario === "kaffarah"
            ? t("fidyah.estimateKaffarahDetail", {
                meals: calc.result.mealsDue,
                fasts: calc.result.consecutiveFastDays ?? 0,
              })
            : t("fidyah.estimateFidyahDetail", { meals: calc.result.mealsDue })}
        </ThemedText>
      ) : null}
    </View>
  );

  const calculatorCard = (
    <Card>
      <SectionHeader
        title={t("fidyah.helperTitle")}
        icon={{ ios: "function", android: "calculate", web: "calculate" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("fidyah.helperHint")}
      </ThemedText>

      <View style={styles.block}>
        <SegmentedControl<FidyahScenario>
          options={scenarioOptions}
          value={calc.scenario}
          onChange={calc.setScenario}
        />
      </View>

      <View style={styles.fieldBlock}>
        <CurrencyField
          label={t("fidyah.currency")}
          value={calc.currencyCode}
          onChange={calc.setCurrencyCode}
        />
      </View>

      <View style={[styles.fieldBlock, fieldsInRow && styles.fieldsRow]}>
        <View style={fieldsInRow ? styles.fieldCell : undefined}>
          <NumberField
            label={calc.scenario === "kaffarah" ? t("fidyah.unitsLabel") : t("fidyah.daysLabel")}
            value={amountFromText(calc.days)}
            onChangeValue={(n) => calc.setDays(amountToText(n))}
            numberFormat={numberFormat}
            maxFractionDigits={0}
          />
        </View>
        <View style={fieldsInRow ? styles.fieldCell : undefined}>
          <NumberField
            label={t("fidyah.mealCostLabel")}
            helperText={t("fidyah.mealCostHint")}
            value={amountFromText(calc.mealCost)}
            onChangeValue={(n) => calc.setMealCost(amountToText(n))}
            numberFormat={numberFormat}
            maxFractionDigits={2}
            suffix={calc.currencyCode}
          />
        </View>
      </View>

      {wide.twoPane ? null : resultView}
      <FidyahFiqhPanel
        scenario={calc.scenario}
        people={calc.result.days > 0 ? calc.result.mealsDue : 0}
      />
    </Card>
  );

  const sectionCards = sectionOrder.map((section) => {
    const topics = topicsBySection[section];
    if (!topics?.length) return null;
    return (
      <Card key={section}>
        <SectionHeader
          title={t(`fidyah.section.${section}`)}
          icon={
            SECTION_ICONS[section] ?? {
              ios: "book.fill",
              android: "menu_book",
              web: "menu_book",
            }
          }
        />
        <LearnColumnsGrid columns={navCols} style={styles.gridTop}>
          {topics.map((topic) => (
            <JannahNavRow
              key={topic.id}
              icon={{ ios: "text.book.closed", android: "article", web: "article" }}
              title={topic.title}
              subtitle={topic.summary}
              onPress={() =>
                router.push({
                  pathname: "/fidyah/[topic]",
                  params: { topic: topic.id },
                } as Href)
              }
            />
          ))}
        </LearnColumnsGrid>
      </Card>
    );
  });

  return (
    <ScreenLayout
      eyebrow={t("fidyah.eyebrow")}
      title={t("fidyah.title")}
      subtitle={t("fidyah.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/fidyah" />
      {madhhabPrompt.sheet}
      {wide.twoPane ? (
        <Stagger>
          <Callout tone="warning">{t("fidyah.intro")}</Callout>
          <LearnTwoPane
            main={
              <>
                {calculatorCard}
                {sectionCards}
              </>
            }
            aside={<Card>{resultView}</Card>}
          />
          <JannahDisclaimer textKey="fidyah.disclaimer" />
        </Stagger>
      ) : (
        <Stagger>
          <Callout tone="warning">{t("fidyah.intro")}</Callout>
          {calculatorCard}
          {sectionCards}
          <JannahDisclaimer textKey="fidyah.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two, lineHeight: 20 },
  block: { marginTop: Spacing.three },
  fieldBlock: { marginTop: Spacing.three, gap: Spacing.two },
  fieldsRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.three },
  fieldCell: { flex: 1, minWidth: 0 },
  result: {
    marginTop: Spacing.three,
    borderRadius: Radius.sm,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  resultAside: { marginTop: 0 },
  gridTop: { marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/fidyah");
