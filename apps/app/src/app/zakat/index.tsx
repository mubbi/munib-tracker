import type { ZakatGuideSectionKey } from "@munib-tracker/shared/content/zakat-guide";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type NativeScrollEvent, type NativeSyntheticEvent, StyleSheet, View } from "react-native";
import {
  JannahCallout,
  JannahDisclaimer,
  JannahNavRow,
  JannahQuickLinkGrid,
} from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { ZakatCalculator } from "@/components/zakat/zakat-calculator";
import { ZakatFiltersToolbar } from "@/components/zakat/zakat-filters-toolbar";
import { ZAKAT_TOPIC_ICONS } from "@/components/zakat/zakat-guide-icons";
import { ZakatResultHero } from "@/components/zakat/zakat-result-hero";
import { ZakatSummaryBar } from "@/components/zakat/zakat-summary-bar";
import { Spacing } from "@/constants/theme";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useZakatCalculator } from "@/hooks/use-zakat-calculator";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";

/** Fallback bar chrome height before onLayout (excludes safe-area already in ScreenLayout). */
const SUMMARY_BAR_FALLBACK = 72;
/** Reveal the filters toolbar after the intro/currency card scrolls past. */
const FILTERS_TOOLBAR_SCROLL_Y = 140;

export default function ZakatScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const calculator = useZakatCalculator();
  const contentBottomInset = useContentBottomInset();
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
      },
      {
        id: "basics",
        icon: ZAKAT_TOPIC_ICONS.basics,
        title: t("zakat.quickBasics"),
        subtitle: t("zakat.quickBasicsHint"),
        tint: tokens.status.info.color,
        onPress: () => router.push("/zakat/basics"),
      },
      {
        id: "checklist",
        icon: { ios: "checklist", android: "checklist", web: "checklist" } as AppIcon,
        title: t("zakat.quickChecklist"),
        subtitle: t("zakat.quickChecklistHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/zakat/checklist"),
      },
      {
        id: "evidence",
        icon: { ios: "book.fill", android: "menu_book", web: "menu_book" } as AppIcon,
        title: t("zakat.quickEvidence"),
        subtitle: t("zakat.quickEvidenceHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/zakat/evidence"),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  return (
    <View style={styles.root}>
      <ScreenLayout
        eyebrow={t("zakat.eyebrow")}
        title={t("zakat.title")}
        subtitle={t("zakat.subtitle")}
        onBack={() => goBackOrReplace(router, "/")}
        contentStyle={{ paddingBottom: summaryClearance }}
        onScroll={onScroll}
        headerAccessory={
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
        }
      >
        <Seo path="/zakat" />
        <Stagger>
          <JannahCallout tone="info">{t("zakat.intro")}</JannahCallout>

          <ZakatResultHero
            result={calculator.result}
            money={calculator.money}
            hasInput={calculator.hasInput}
            effectiveNisab={calculator.effectiveNisab}
            goldNisab={calculator.goldNisab}
            silverNisab={calculator.silverNisab}
            suggestedNisab={calculator.suggestedNisab}
            currencyCode={calculator.currencyCode}
          />

          <ZakatCalculator
            {...calculator}
            currencyPickerOpen={currencyPickerOpen}
            onCurrencyPickerOpenChange={setCurrencyPickerOpen}
            numberFormatPickerOpen={numberFormatPickerOpen}
            onNumberFormatPickerOpenChange={setNumberFormatPickerOpen}
          />

          <Card padding="three">
            <SectionHeader
              title={t("zakat.quickLinksTitle")}
              icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
            />
            <JannahQuickLinkGrid items={quickLinks} />
          </Card>

          <Card padding="three">
            <SectionHeader
              title={t("zakat.learnTitle")}
              icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.learnHint}>
              {t("zakat.learnHint")}
            </ThemedText>
            <View style={styles.rows}>
              {guideSections.map((topicId) => (
                <JannahNavRow
                  key={topicId}
                  icon={ZAKAT_TOPIC_ICONS[topicId]}
                  title={t(`zakat.guide.${topicId}.title`)}
                  subtitle={t(`zakat.guide.${topicId}.summary`)}
                  onPress={() =>
                    router.push({ pathname: "/zakat/[topic]", params: { topic: topicId } })
                  }
                />
              ))}
            </View>
          </Card>

          <JannahDisclaimer textKey="zakat.disclaimer" />
        </Stagger>
      </ScreenLayout>

      <ZakatSummaryBar
        result={calculator.result}
        money={calculator.money}
        hasInput={calculator.hasInput}
        effectiveNisab={calculator.effectiveNisab}
        currencyCode={calculator.currencyCode}
        resetForm={calculator.resetForm}
        onHeightChange={setSummaryBarHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  learnHint: { marginTop: Spacing.one, lineHeight: 20 },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
