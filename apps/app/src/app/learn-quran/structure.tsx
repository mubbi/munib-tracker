import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideStructureLevels,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";

export default function LearnQuranStructureScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontScale } = useWindowDimensions();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const levels = getQuranGuideStructureLevels();
  // Keep cards wide enough that large Dynamic Type doesn't crush body text.
  const minWidthPct = fontScale >= 1.3 ? 88 : fontScale >= 1.15 ? 78 : 70;

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.structureTitle")}
      subtitle={t("learnQuran.structureSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/structure" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("learnQuran.structureIntro")}</JannahCallout>

          <LearnReadingChrome surface="learn_quran">
            <Card padding="three">
              <SectionHeader
                title={t("learnQuran.structurePyramid")}
                icon={{ ios: "square.stack.3d.up.fill", android: "layers", web: "layers" }}
              />
              <View style={styles.pyramid}>
                {levels.map((level, index) => (
                  <View key={level.id} style={styles.levelBlock}>
                    {index > 0 ? (
                      <ThemedText
                        type="caption"
                        themeColor="mutedForeground"
                        style={styles.arrow}
                        accessibilityElementsHidden
                        importantForAccessibility="no"
                      >
                        ↓
                      </ThemedText>
                    ) : null}
                    <View
                      style={[
                        styles.levelCard,
                        {
                          backgroundColor: tokens.accentSoft,
                          borderColor: colors.accent,
                          width: `${Math.max(minWidthPct, 100 - index * 4)}%` as `${number}%`,
                        },
                      ]}
                    >
                      <ThemedText type="smallBold" style={[styles.label, { color: colors.accent }]}>
                        {level.label}
                      </ThemedText>
                      <ThemedText type="title" style={styles.count}>
                        {level.count}
                      </ThemedText>
                      <ThemedText type="small" themeColor="mutedForeground" style={styles.detail}>
                        {level.detail}
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </LearnReadingChrome>

          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  pyramid: {
    marginTop: Spacing.three,
    alignItems: "center",
    gap: Spacing.two,
  },
  levelBlock: {
    alignItems: "center",
    width: "100%",
  },
  arrow: {
    marginVertical: Spacing.one,
    textAlign: "center",
  },
  levelCard: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    gap: Spacing.two,
    overflow: "visible",
  },
  label: {
    textAlign: "center",
  },
  count: {
    textAlign: "center",
    // Extra vertical room for title ascenders — do NOT set lineHeight here;
    // ThemedText scales it with Dynamic Type and a fixed value clips.
    paddingVertical: Spacing.one,
  },
  detail: {
    textAlign: "center",
  },
});
