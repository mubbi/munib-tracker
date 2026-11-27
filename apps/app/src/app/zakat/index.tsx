import type { ZakatGuideSectionKey } from "@munib-tracker/shared/content/zakat-guide";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type NativeScrollEvent, type NativeSyntheticEvent, StyleSheet, View } from "react-native";
import {
  LearnColumnsGrid,
  LearnTwoPane,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import {
  JannahCallout,
  JannahDisclaimer,
  JannahNavRow,
  JannahQuickLinkGrid,
} from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { ToolSeo } from "@/components/seo/tool-seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { ZakatCalculator } from "@/components/zakat/zakat-calculator";
import { ZakatFiltersToolbar } from "@/components/zakat/zakat-filters-toolbar";
import { ZAKAT_TOPIC_ICONS } from "@/components/zakat/zakat-guide-icons";
import { ZakatResultHero } from "@/components/zakat/zakat-result-hero";
import { ZakatSummaryBar } from "@/components/zakat/zakat-summary-bar";
import { getRouteSeo } from "@/config/seo-routes";
import { Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useMadhhabPrompt } from "@/hooks/use-madhhab-prompt";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useZakatCalculator } from "@/hooks/use-zakat-calculator";
import { tTv } from "@/lib/i18n/t-tv";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { collectionPageSchema } from "@/lib/seo/structured-data";

/** Fallback bar chrome height before onLayout (excludes safe-area already in ScreenLayout). */
const SUMMARY_BAR_FALLBACK = 72;
/** Reveal the filters toolbar after the intro/currency card scrolls past. */
const FILTERS_TOOLBAR_SCROLL_Y = 140;

export default function ZakatScreen() {
  // §4.1.1 item 4: once per session while the madhhab was never chosen.
  const madhhabPrompt = useMadhhabPrompt();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const calculator = useZakatCalculator();
  const contentBottomInset = useContentBottomInset();
  const wide = useLearnHubLayout();
  // Desktop: the live result + reset move into a sticky aside (no docked bar),
  // and simple field groups lay out in two columns.
  const docked = !wide.twoPane;
  const formColumns = learnColumnsFor(wide.mainWidth - Spacing.three * 2, {
    minCell: 260,
    max: 2,
  });
  const navCols = learnColumnsFor(wide.mainWidth - Spacing.three * 2, { minCell: 280, max: 2 });
  const [guideSections, setGuideSections] = useState<ZakatGuideSectionKey[]>([]);
  const [summaryBarHeight, setSummaryBarHeight] = useState(SUMMARY_BAR_FALLBACK);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);
  const [numberFormatPickerOpen, setNumberFormatPickerOpen] = useState(false);

  useEffect(() => {
    void import("@munib-tracker/shared/content/zakat-guide").then(({ ZAKAT_GUIDE_SECTIONS }) =>
      setGuideSections([...ZAKAT_GUIDE_SECTIONS]),
    );
  }, []);

  const summaryClearance = Math.max(
    Spacing.three,
    summaryBarHeight - contentBottomInset + Spacing.two,
  );

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = event.nativeEvent.contentOffset.y > FILTERS_TOOLBAR_SCROLL_Y;
    setFiltersVisible((prev) => (prev === next ? prev : next));
  }, []);

  const quickLinks = useMemo(
    () => [
      {
        id: "hawl",
        icon: ZAKAT_TOPIC_ICONS.hawl,
        title: t("zakat.quickHawl"),
        subtitle: t("zakat.quickHawlHint"),
        tint: colors.accent,
        onPress: () => router.push("/zakat/hawl"),
        href: "/zakat/hawl",
      },
      {
        id: "basics",
        icon: ZAKAT_TOPIC_ICONS.basics,
        title: t("zakat.quickBasics"),
        subtitle: t("zakat.quickBasicsHint"),
        tint: tokens.status.info.color,
        onPress: () => router.push("/zakat/basics"),
        href: "/zakat/basics",
      },
      {
        id: "checklist",
        icon: { ios: "checklist", android: "checklist", web: "checklist" } as AppIcon,
        title: t("zakat.quickChecklist"),
        subtitle: t("zakat.quickChecklistHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/zakat/checklist"),
        href: "/zakat/checklist",
      },
      {
        id: "evidence",
        icon: { ios: "book.fill", android: "menu_book", web: "menu_book" } as AppIcon,
        title: t("zakat.quickEvidence"),
        subtitle: t("zakat.quickEvidenceHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/zakat/evidence"),
        href: "/zakat/evidence",
      },
    ],
    [router, t, colors.accent, tokens],
  );

  // Structured data: the hub is a CollectionPage whose ItemList names every
  // guide topic + the checklist / evidence pages (same URLs as the links below).
  const seoBreadcrumbs = useMemo(
    () => [
      { name: t("tabs.home"), path: "/" },
      { name: t("zakat.title"), path: "/zakat" },
    ],
    [t],
  );
  const seoJsonLd = useMemo(() => {
    const entry = getRouteSeo("/zakat");
    return [
      collectionPageSchema({
        path: "/zakat",
        name: entry?.title ?? t("zakat.title"),
        description: entry?.description ?? t("zakat.subtitle"),
        items: [
          ...guideSections.map((topicId) => ({
            name: t(`zakat.guide.${topicId}.title`),
            path: `/zakat/${topicId}`,
          })),
          // Page titles (not the short tile labels, e.g. "Before you pay").
          {
            name: getRouteSeo("/zakat/checklist")?.title ?? t("zakat.quickChecklist"),
            path: "/zakat/checklist",
          },
          {
            name: getRouteSeo("/zakat/evidence")?.title ?? t("zakat.quickEvidence"),
            path: "/zakat/evidence",
          },
        ],
        breadcrumbs: seoBreadcrumbs,
      }),
    ];
  }, [guideSections, seoBreadcrumbs, t]);

  const resultHero = (
    <ZakatResultHero
      result={calculator.result}
      money={calculator.money}
      hasInput={calculator.hasInput}
      effectiveNisab={calculator.effectiveNisab}
      goldNisab={calculator.goldNisab}
      silverNisab={calculator.silverNisab}
      suggestedNisab={calculator.suggestedNisab}
      currencyCode={calculator.currencyCode}
      zakatSchool={calculator.zakatSchool}
      nisabBasis={calculator.nisabBasis}
      nisabBasisCustom={calculator.nisabBasisCustom}
      basisRows={calculator.basisRows}
      personalJewelleryValue={calculator.personalJewelleryValue}
      personalJewelleryCounted={calculator.personalJewelleryCounted}
      onReset={docked ? undefined : calculator.resetForm}
    />
  );

  const calculatorForm = (
    <ZakatCalculator
      {...calculator}
      currencyPickerOpen={currencyPickerOpen}
      onCurrencyPickerOpenChange={setCurrencyPickerOpen}
      numberFormatPickerOpen={numberFormatPickerOpen}
      onNumberFormatPickerOpenChange={setNumberFormatPickerOpen}
      formColumns={formColumns}
    />
  );

  const quickLinksCard = (
    <Card>
      <SectionHeader
        title={t("zakat.quickLinksTitle")}
        icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
      />
      <JannahQuickLinkGrid items={quickLinks} columns={wide.mainWidth >= 720 ? 4 : 2} />
    </Card>
  );

  const relatedCard = (
    <Card>
      <SectionHeader
        title={t("zakat.relatedTitle")}
        icon={{
          ios: "hands.and.sparkles.fill",
          android: "volunteer_activism",
          web: "volunteer_activism",
        }}
      />
      <LearnColumnsGrid columns={navCols} style={styles.gridTop}>
        <JannahNavRow
          icon={{
            ios: "hands.and.sparkles.fill",
            android: "volunteer_activism",
            web: "volunteer_activism",
          }}
          title={t("zakat.linkSadaqah")}
          subtitle={t("zakat.linkSadaqahHint")}
          onPress={() => router.push("/sadaqah")}
          href="/sadaqah"
        />
        <JannahNavRow
          icon={{ ios: "fork.knife", android: "restaurant", web: "restaurant" }}
          title={t("zakat.linkFidyah")}
          subtitle={t("zakat.linkFidyahHint")}
          onPress={() => router.push("/fidyah")}
          href="/fidyah"
        />
      </LearnColumnsGrid>
    </Card>
  );

  const learnCard = (
    <Card>
      <SectionHeader
        title={t("zakat.learnTitle")}
        icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.learnHint}>
        {tTv(t, "zakat.learnHint", "zakat.learnHintTv")}
      </ThemedText>
      <LearnColumnsGrid columns={navCols} style={styles.gridTop}>
        {guideSections.map((topicId) => (
          <JannahNavRow
            key={topicId}
            icon={ZAKAT_TOPIC_ICONS[topicId]}
            title={t(`zakat.guide.${topicId}.title`)}
            subtitle={t(`zakat.guide.${topicId}.summary`)}
            onPress={() => router.push({ pathname: "/zakat/[topic]", params: { topic: topicId } })}
            href={`/zakat/${topicId}`}
          />
        ))}
      </LearnColumnsGrid>
    </Card>
  );

  return (
    <View style={styles.root}>
      <ScreenLayout
        eyebrow={t("zakat.eyebrow")}
        title={t("zakat.title")}
        subtitle={t("zakat.subtitle")}
        onBack={() => goBackOrReplace(router, "/")}
        contentStyle={docked ? { paddingBottom: summaryClearance } : undefined}
        maxContentWidth={wide.maxContentWidth}
        onScroll={onScroll}
        // TV: skip the scroll-revealed glass toolbar — it duplicates the
        // calculator's currency / format / live-price controls and its focus
        // guide would trap the D-pad once entered.
        headerAccessory={
          isTV() ? undefined : (
            <ZakatFiltersToolbar
              visible={filtersVisible}
              currencyCode={calculator.currencyCode}
              currency={calculator.currency}
              numberFormat={calculator.numberFormat}
              money={calculator.money}
              market={calculator.market}
              pricesManual={calculator.pricesManual}
              applyLivePrices={calculator.applyLivePrices}
              effectiveNisab={calculator.effectiveNisab}
              result={calculator.result}
              hasInput={calculator.hasInput}
              onOpenCurrency={() => setCurrencyPickerOpen(true)}
              onOpenNumberFormat={() => setNumberFormatPickerOpen(true)}
            />
          )
        }
      >
        <ToolSeo path="/zakat" name={t("zakat.title")} jsonLd={seoJsonLd} />
        {madhhabPrompt.sheet}
        {wide.twoPane ? (
          <Stagger>
            <JannahCallout tone="info">{t("zakat.intro")}</JannahCallout>
            <LearnTwoPane
              main={
                <>
                  {calculatorForm}
                  {learnCard}
                  {quickLinksCard}
                  {relatedCard}
                </>
              }
              // Only the live result lives in the aside so it stays short
              // enough to remain pinned while the long form scrolls.
              aside={resultHero}
            />
            <JannahDisclaimer textKey="zakat.disclaimer" />
          </Stagger>
        ) : (
          <Stagger>
            <JannahCallout tone="info">{t("zakat.intro")}</JannahCallout>
            {resultHero}
            {calculatorForm}
            {quickLinksCard}
            {relatedCard}
            {learnCard}
            <JannahDisclaimer textKey="zakat.disclaimer" />
          </Stagger>
        )}
      </ScreenLayout>

      {docked ? (
        <ZakatSummaryBar
          result={calculator.result}
          money={calculator.money}
          hasInput={calculator.hasInput}
          effectiveNisab={calculator.effectiveNisab}
          currencyCode={calculator.currencyCode}
          resetForm={calculator.resetForm}
          onHeightChange={setSummaryBarHeight}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  learnHint: { marginTop: Spacing.one, lineHeight: 20 },
  gridTop: { marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/zakat");
