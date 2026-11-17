import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import {
  LearnColumnsGrid,
  LearnTwoPane,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { TvStepButtons, useTvInputFocus } from "@/components/money/tv-number-input";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { Spacing } from "@/constants/theme";
import { useFidyahCalculator } from "@/hooks/use-fidyah-calculator";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import type { FidyahScenario } from "@/lib/fidyah";
import { getFidyahGuideSectionOrder, getFidyahGuideTopicsBySection } from "@/lib/fidyah-guide";
import { DEFAULT_NUMBER_FORMAT, formatNumberInput } from "@/lib/format-currency";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";

const SECTION_ICONS: Record<string, AppIcon> = {
  overview: { ios: "info.circle.fill", android: "info", web: "info" },
  fidyah: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
  kaffarah: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  practice: { ios: "checklist", android: "checklist", web: "checklist" },
};

export default function FidyahScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const calc = useFidyahCalculator();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const daysFocus = useTvInputFocus();
  const mealFocus = useTvInputFocus();
  const tv = isTV();
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
        {calc.hasInput ? calc.money(calc.result.amountEstimate) : t("fidyah.estimateEmpty")}
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
    <Card padding="three">
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

      <JannahNavRow
        icon={{ ios: "coloncurrencysign.circle", android: "payments", web: "payments" }}
        title={t("fidyah.currency")}
        subtitle={calc.currencyCode}
        onPress={() => setCurrencyOpen(true)}
      />

      <View style={fieldsInRow ? styles.fieldsRow : undefined}>
        <View style={[styles.fieldBlock, fieldsInRow && styles.fieldCell]}>
          <ThemedText type="smallBold">
            {calc.scenario === "kaffarah" ? t("fidyah.unitsLabel") : t("fidyah.daysLabel")}
          </ThemedText>
          <View style={tv ? styles.tvLine : undefined}>
            <View
              style={[
                styles.inputRow,
                tv && styles.inputRowTv,
                tokens.inputSurface,
                daysFocus.containerStyle,
              ]}
            >
              <TextInput
                {...daysFocus.focusProps}
                value={calc.days}
                onChangeText={(text) =>
                  calc.setDays(formatNumberInput(text, 0, DEFAULT_NUMBER_FORMAT))
                }
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.mutedForeground}
                accessibilityLabel={t("fidyah.daysLabel")}
                style={[styles.input, { color: colors.foreground }]}
              />
            </View>
            <TvStepButtons
              value={calc.days}
              onChange={calc.setDays}
              label={calc.scenario === "kaffarah" ? t("fidyah.unitsLabel") : t("fidyah.daysLabel")}
            />
          </View>
        </View>

        <View style={[styles.fieldBlock, fieldsInRow && styles.fieldCell]}>
          <ThemedText type="smallBold">{t("fidyah.mealCostLabel")}</ThemedText>
          <View style={tv ? styles.tvLine : undefined}>
            <View
              style={[
                styles.inputRow,
                tv && styles.inputRowTv,
                tokens.inputSurface,
                mealFocus.containerStyle,
              ]}
            >
              <TextInput
                {...mealFocus.focusProps}
                value={calc.mealCost}
                onChangeText={(text) =>
                  calc.setMealCost(formatNumberInput(text, 2, DEFAULT_NUMBER_FORMAT))
                }
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.mutedForeground}
                accessibilityLabel={t("fidyah.mealCostLabel")}
                style={[styles.input, { color: colors.foreground }]}
              />
            </View>
            <TvStepButtons
              value={calc.mealCost}
              onChange={calc.setMealCost}
              label={t("fidyah.mealCostLabel")}
              maxFractionDigits={2}
            />
          </View>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("fidyah.mealCostHint")}
          </ThemedText>
        </View>
      </View>

      {wide.twoPane ? null : resultView}
    </Card>
  );

  const sectionCards = sectionOrder.map((section) => {
    const topics = topicsBySection[section];
    if (!topics?.length) return null;
    return (
      <Card key={section} padding="three">
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
      {wide.twoPane ? (
        <Stagger>
          <JannahCallout tone="warning">{t("fidyah.intro")}</JannahCallout>
          <LearnTwoPane
            main={
              <>
                {calculatorCard}
                {sectionCards}
              </>
            }
            aside={<Card padding="three">{resultView}</Card>}
          />
          <JannahDisclaimer textKey="fidyah.disclaimer" />
        </Stagger>
      ) : (
        <Stagger>
          <JannahCallout tone="warning">{t("fidyah.intro")}</JannahCallout>
          {calculatorCard}
          {sectionCards}
          <JannahDisclaimer textKey="fidyah.disclaimer" />
        </Stagger>
      )}

      <CurrencyPickerSheet
        visible={currencyOpen}
        selectedCode={calc.currencyCode}
        onSelect={(code) => {
          calc.setCurrencyCode(code);
          setCurrencyOpen(false);
        }}
        onClose={() => setCurrencyOpen(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two, lineHeight: 20 },
  block: { marginTop: Spacing.three },
  fieldBlock: { marginTop: Spacing.three, gap: Spacing.two },
  fieldsRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.three },
  fieldCell: { flex: 1, minWidth: 0 },
  inputRow: {
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  input: { fontSize: 16, paddingVertical: Spacing.one },
  // TV: input + remote −/+ buttons side by side; input row centers its text.
  tvLine: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  inputRowTv: { flex: 1, justifyContent: "center" },
  result: {
    marginTop: Spacing.three,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  resultAside: { marginTop: 0 },
  gridTop: { marginTop: Spacing.three },
});
