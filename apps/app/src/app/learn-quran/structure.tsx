import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideStructureLevels,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function LearnQuranStructureScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
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
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/learn-quran/structure" />
      <LearnContentGate ready={contentReady}>
        <LearnSplitLayout aside={<QuranGuideTopicAside currentId="structure" />}>
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
                      {/* TV: each level is a D-pad stop so the pyramid scrolls by remote. */}
                      <TvReadableBlock style={styles.levelFocusTv}>
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
                          <LearnProseText
                            proseRole="title"
                            style={[styles.label, { color: colors.accent }]}
                          >
                            {level.label}
                          </LearnProseText>
                          <ThemedText type="title" style={styles.count}>
                            {level.count}
                          </ThemedText>
                          <LearnProseText themeColor="mutedForeground" style={styles.detail}>
                            {level.detail}
                          </LearnProseText>
                        </View>
                      </TvReadableBlock>
                    </View>
                  ))}
                </View>
              </Card>
            </LearnReadingChrome>

            <JannahDisclaimer textKey="learnQuran.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
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
  // TV-only focus host: full lane width so the %-wide level card still resolves.
  levelFocusTv: {
    alignSelf: "stretch",
    alignItems: "center",
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

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/structure");
