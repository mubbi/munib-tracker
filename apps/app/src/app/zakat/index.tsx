import { ZAKAT_GUIDE_SECTIONS } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

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
import { ZAKAT_TOPIC_ICONS } from "@/components/zakat/zakat-guide-icons";
import { ZakatResultHero } from "@/components/zakat/zakat-result-hero";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useZakatCalculator } from "@/hooks/use-zakat-calculator";
import type { AppIcon } from "@/lib/names-of-allah-ui";

export default function ZakatScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const calculator = useZakatCalculator();

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
    <ScreenLayout
      eyebrow={t("zakat.eyebrow")}
      title={t("zakat.title")}
      subtitle={t("zakat.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
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
        />

        <Card padding="three">
          <SectionHeader
            title={t("zakat.quickLinksTitle")}
            icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
          />
          <JannahQuickLinkGrid items={quickLinks} />
        </Card>

        <ZakatCalculator {...calculator} />

        <Card padding="three">
          <SectionHeader
            title={t("zakat.learnTitle")}
            icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.learnHint}>
            {t("zakat.learnHint")}
          </ThemedText>
          <View style={styles.rows}>
            {ZAKAT_GUIDE_SECTIONS.map((topicId) => (
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
  );
}

const styles = StyleSheet.create({
  learnHint: { marginTop: Spacing.one, lineHeight: 20 },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
