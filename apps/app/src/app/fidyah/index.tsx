import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
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

const SECTION_ICONS: Record<string, AppIcon> = {
  overview: { ios: "info.circle.fill", android: "info", web: "info" },
  fidyah: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
  kaffarah: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  practice: { ios: "checklist", android: "checklist", web: "checklist" },
};

export default function FidyahScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useThemeTokens();
  const calc = useFidyahCalculator();
  const [currencyOpen, setCurrencyOpen] = useState(false);
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

  return (
    <ScreenLayout
      eyebrow={t("fidyah.eyebrow")}
      title={t("fidyah.title")}
      subtitle={t("fidyah.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/fidyah" />
      <Stagger>
        <JannahCallout tone="warning">{t("fidyah.intro")}</JannahCallout>

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

          <View style={styles.fieldBlock}>
            <ThemedText type="smallBold">
              {calc.scenario === "kaffarah" ? t("fidyah.unitsLabel") : t("fidyah.daysLabel")}
            </ThemedText>
            <View style={[styles.inputRow, { backgroundColor: colors.muted }]}>
              <TextInput
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
          </View>

          <View style={styles.fieldBlock}>
            <ThemedText type="smallBold">{t("fidyah.mealCostLabel")}</ThemedText>
            <View style={[styles.inputRow, { backgroundColor: colors.muted }]}>
              <TextInput
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
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("fidyah.mealCostHint")}
            </ThemedText>
          </View>

          <View style={[styles.result, { backgroundColor: colors.muted }]}>
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
        </Card>

        {sectionOrder.map((section) => {
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
              <View style={styles.rows}>
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
              </View>
            </Card>
          );
        })}

        <JannahDisclaimer textKey="fidyah.disclaimer" />
      </Stagger>

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
  inputRow: {
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  input: { fontSize: 16, paddingVertical: Spacing.one },
  result: {
    marginTop: Spacing.three,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
